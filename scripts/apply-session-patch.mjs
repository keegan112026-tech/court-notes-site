import fs from 'node:fs/promises';
import path from 'node:path';

function parseArgs(argv) {
    const options = {
        patchPath: '',
        dryRun: false,
    };

    for (let index = 0; index < argv.length; index += 1) {
        const arg = argv[index];
        if (arg === '--patch') {
            options.patchPath = argv[index + 1] || '';
            index += 1;
            continue;
        }
        if (arg === '--dry-run') {
            options.dryRun = true;
        }
    }

    return options;
}

function countOccurrences(input, search) {
    if (!search) return 0;
    let count = 0;
    let cursor = 0;

    while (cursor <= input.length) {
        const foundAt = input.indexOf(search, cursor);
        if (foundAt === -1) break;
        count += 1;
        cursor = foundAt + search.length;
    }

    return count;
}

function replaceOccurrences(input, search, replacement) {
    if (!search) {
        return { output: input, count: 0 };
    }

    const count = countOccurrences(input, search);
    if (count === 0) {
        return { output: input, count: 0 };
    }

    return {
        output: input.split(search).join(replacement),
        count,
    };
}

function assertString(value, fieldName) {
    if (typeof value !== 'string' || !value.trim()) {
        throw new Error(`patch 欄位 ${fieldName} 必須是非空字串。`);
    }
}

function cloneJson(value) {
    return JSON.parse(JSON.stringify(value));
}

async function readJson(filePath) {
    const raw = await fs.readFile(filePath, 'utf8');
    return JSON.parse(raw);
}

function ensureArray(value, fieldName) {
    if (!Array.isArray(value)) {
        throw new Error(`patch 欄位 ${fieldName} 必須是陣列。`);
    }
}

function matchTranscriptLine(line, match) {
    if (!match) return true;

    if (match.lineId) {
        return line.id === match.lineId || line.lineId === match.lineId;
    }

    if (match.contains) {
        return typeof line.content === 'string' && line.content.includes(match.contains);
    }

    return true;
}

function applyReplaceTranscriptText(sessionData, operation) {
    const transcripts = Array.isArray(sessionData.transcripts) ? sessionData.transcripts : [];
    const touchedLineIds = [];
    let matchCount = 0;

    for (const line of transcripts) {
        if (!matchTranscriptLine(line, operation.match)) {
            continue;
        }

        const original = typeof line.content === 'string' ? line.content : '';
        const replaced = replaceOccurrences(original, operation.find, operation.replace);

        if (replaced.count > 0) {
            line.content = replaced.output;
            matchCount += replaced.count;
            touchedLineIds.push(line.id || line.lineId || '(unknown-line)');
        }
    }

    return {
        matchCount,
        touchedLineIds,
    };
}

function applyReplaceMetadataText(sessionData, operation) {
    const field = operation.field;
    if (!field || typeof field !== 'string') {
        throw new Error('replace-metadata-text 缺少 field。');
    }

    const metadata = sessionData.metadata || {};
    const original = typeof metadata[field] === 'string' ? metadata[field] : '';
    const replaced = replaceOccurrences(original, operation.find, operation.replace);

    if (replaced.count > 0) {
        metadata[field] = replaced.output;
    }

    sessionData.metadata = metadata;

    return {
        matchCount: replaced.count,
        touchedFields: replaced.count > 0 ? [field] : [],
    };
}

function applyOperation(sessionData, operation) {
    if (!operation || typeof operation !== 'object') {
        throw new Error('patch operation 格式錯誤。');
    }

    assertString(operation.type, 'operations[].type');
    assertString(operation.find, 'operations[].find');
    if (typeof operation.replace !== 'string') {
        throw new Error('patch 欄位 operations[].replace 必須是字串。');
    }

    let result;

    if (operation.type === 'replace-transcript-text') {
        result = applyReplaceTranscriptText(sessionData, operation);
    } else if (operation.type === 'replace-metadata-text') {
        result = applyReplaceMetadataText(sessionData, operation);
    } else {
        throw new Error(`不支援的 patch operation：${operation.type}`);
    }

    if (typeof operation.expectMatches === 'number' && result.matchCount !== operation.expectMatches) {
        throw new Error(
            `operation ${operation.type} 預期命中 ${operation.expectMatches} 次，實際命中 ${result.matchCount} 次。`
        );
    }

    if (result.matchCount === 0) {
        throw new Error(`operation ${operation.type} 沒有命中任何內容，已中止避免 silent no-op。`);
    }

    return result;
}

async function main() {
    const repoRoot = process.cwd();
    const options = parseArgs(process.argv.slice(2));

    if (!options.patchPath) {
        throw new Error('請提供 --patch <patch.json>。');
    }

    const patchPath = path.isAbsolute(options.patchPath)
        ? options.patchPath
        : path.resolve(repoRoot, options.patchPath);

    const patch = await readJson(patchPath);

    assertString(patch.patchId, 'patchId');
    assertString(patch.sessionId, 'sessionId');
    assertString(patch.summary, 'summary');
    ensureArray(patch.operations, 'operations');

    const sessionPath = path.resolve(repoRoot, 'data', 'sessions', `${patch.sessionId}.json`);
    const beforeRaw = await fs.readFile(sessionPath, 'utf8');
    const beforeData = JSON.parse(beforeRaw);
    const workingData = cloneJson(beforeData);

    const operationResults = patch.operations.map((operation, index) => {
        const result = applyOperation(workingData, operation);
        return {
            index,
            type: operation.type,
            find: operation.find,
            replace: operation.replace,
            matchCount: result.matchCount,
            touchedLineIds: result.touchedLineIds || [],
            touchedFields: result.touchedFields || [],
        };
    });

    const afterRaw = `${JSON.stringify(workingData, null, 4)}\n`;
    const artifactDir = path.resolve(repoRoot, 'version_snapshots', 'session-patches', patch.patchId);
    const resultPayload = {
        patchId: patch.patchId,
        sessionId: patch.sessionId,
        summary: patch.summary,
        patchSource: patchPath,
        appliedAt: new Date().toISOString(),
        dryRun: options.dryRun,
        operations: operationResults,
        sessionPath,
        artifactDir,
    };

    if (!options.dryRun) {
        await fs.mkdir(artifactDir, { recursive: true });
        await fs.writeFile(path.join(artifactDir, `${patch.sessionId}.before.json`), beforeRaw, 'utf8');
        await fs.writeFile(path.join(artifactDir, `${patch.sessionId}.after.json`), afterRaw, 'utf8');
        await fs.writeFile(path.join(artifactDir, 'result.json'), `${JSON.stringify(resultPayload, null, 4)}\n`, 'utf8');
        await fs.writeFile(sessionPath, afterRaw, 'utf8');
    }

    console.log(JSON.stringify(resultPayload, null, 2));
}

main().catch((error) => {
    console.error(`[session-patch] ${error instanceof Error ? error.message : String(error)}`);
    process.exitCode = 1;
});
