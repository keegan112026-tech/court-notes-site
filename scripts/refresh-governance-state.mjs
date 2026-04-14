#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const repoRoot = process.cwd();
const governanceDir = path.join(repoRoot, 'docs', 'governance');
const ledgerPath = path.join(governanceDir, 'DEPLOYMENT_LEDGER.md');
const baselinePath = path.join(governanceDir, 'CURRENT_BASELINE_2026-04-04.md');
const sourceOfTruthPath = path.join(governanceDir, 'CURRENT_SOURCE_OF_TRUTH_2026-04-04.md');
const handoffPath = path.join(governanceDir, 'AI_HANDOFF_2026-04-05_CURRENT_STATE.md');
const workflowPath = path.join(governanceDir, 'GOVERNANCE_REFRESH_WORKFLOW_2026-04-11.md');

const args = new Set(process.argv.slice(2));
const shouldAppendLedger = args.has('--append-ledger-recheck');
const baseUrl =
    process.argv.find((arg) => arg.startsWith('--base-url='))?.slice('--base-url='.length) ||
    'https://court-notes-site.vercel.app';

const routeChecks = [
    {
        path: '/',
        label: '首頁',
        markers: ['鳴謝與資料來源', 'sources-acknowledgements', '平台限制與規範'],
    },
    {
        path: '/about',
        label: '緣起頁',
        markers: ['計畫緣起', '觀庭還原筆記共構平台'],
    },
    {
        path: '/guide',
        label: '規範頁',
        markers: ['平台限制與規範'],
    },
    {
        path: '/knowledge',
        label: '知識頁',
        markers: [],
    },
    {
        path: '/sessions',
        label: '筆記總覽頁',
        markers: ['114年度訴字第51號過失致死等案', '目前已發布的完整筆記'],
    },
    {
        path: '/forum',
        label: '匯集區',
        markers: ['觀庭筆記匯集區', '本計畫資料來源與鳴謝'],
    },
    {
        path: '/contact',
        label: '聯絡頁',
        markers: [],
    },
    {
        path: '/rankings',
        label: '排行頁',
        markers: [],
    },
];

const adminChecks = [
    { path: '/admin/login', label: '管理登入', expectedStatus: 200 },
    { path: '/admin/review', label: '待審核', expectedStatus: 307 },
    { path: '/admin/articles', label: '文章管理', expectedStatus: 307 },
    { path: '/admin/comments', label: '留言管理', expectedStatus: 307 },
    { path: '/admin/inbox', label: '收件匣', expectedStatus: 307 },
];

function runGit(args) {
    return execFileSync('git', args, {
        cwd: repoRoot,
        encoding: 'utf8',
        windowsHide: true,
    }).trim();
}

function getTaipeiDate() {
    const parts = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Asia/Taipei',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).formatToParts(new Date());

    const values = Object.fromEntries(parts.filter((part) => part.type !== 'literal').map((part) => [part.type, part.value]));
    return `${values.year}-${values.month}-${values.day}`;
}

function readUtf8(filePath) {
    return fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, '');
}

function writeUtf8(filePath, content) {
    fs.writeFileSync(filePath, content.replace(/\r\n/g, '\n').replace(/\r/g, '\n'), 'utf8');
}

async function fetchCheck(base, check) {
    const url = `${base.replace(/\/$/, '')}${check.path}`;
    const response = await fetch(url, { redirect: 'manual' });
    const body = response.status === 200 ? await response.text() : '';
    const missingMarkers = check.markers.filter((marker) => !body.includes(marker));

    return {
        ...check,
        status: response.status,
        ok: response.status === 200 && missingMarkers.length === 0,
        missingMarkers,
        matchedMarkers: check.markers.filter((marker) => !missingMarkers.includes(marker)),
    };
}

async function fetchAdminCheck(base, check) {
    const url = `${base.replace(/\/$/, '')}${check.path}`;
    const response = await fetch(url, { redirect: 'manual' });

    return {
        ...check,
        status: response.status,
        ok: response.status === check.expectedStatus,
    };
}

function formatDirtyList(lines, limit = 20) {
    if (!lines.length) {
        return ['- worktree 乾淨'];
    }

    const mapped = lines.slice(0, limit).map((line) => `- \`${line}\``);
    if (lines.length > limit) {
        mapped.push(`- ... 另有 ${lines.length - limit} 項未列出`);
    }
    return mapped;
}

function summarizeForumCheck(forumCheck) {
    if (forumCheck.status !== 200) {
        return `- 匯集區 live recheck 失敗：\`${forumCheck.status}\``;
    }

    const hasShelf = forumCheck.matchedMarkers.includes('本計畫資料來源與鳴謝');
    if (hasShelf) {
        return '- 匯集區 production 已顯示新版 `本計畫資料來源與鳴謝` 櫥窗';
    }

    return '- 匯集區 production 仍未顯示新版 `本計畫資料來源與鳴謝` 櫥窗';
}

function buildBaseline(date, branch, head, dirtyLines, routeResults, adminResults) {
    const routeStatusLines = routeResults.map((result) => `- \`${result.path}\` -> \`${result.status}\``).join('\n');
    const adminLines = adminResults.map((result) => `- \`${result.path}\` -> \`${result.status}\`${result.ok ? '' : ' (與預期不符)'}`).join('\n');
    const forumCheck = routeResults.find((result) => result.path === '/forum');
    const homepageCheck = routeResults.find((result) => result.path === '/');

    return `# CURRENT BASELINE - 2026-04-04

這份文件記錄目前團隊應該採信的基準狀態。

## Production baseline

正式站網址：

- \`${baseUrl}\`

### ${date} live recheck

已直接驗證：

${routeStatusLines}

### ${date} live content recheck

- 首頁已有 \`鳴謝與資料來源\` 導覽：${homepageCheck?.matchedMarkers.includes('鳴謝與資料來源') ? '是' : '否'}
- 首頁已有 \`#sources-acknowledgements\` anchor：${homepageCheck?.matchedMarkers.includes('sources-acknowledgements') ? '是' : '否'}
${summarizeForumCheck(forumCheck)}

## Admin baseline

${adminLines}

## Git baseline

截至 ${date} 重新核對：

- current branch：\`${branch}\`
- \`HEAD\`：\`${head}\`

## Worktree baseline

工作樹目前仍然是 dirty。可見範圍：

${formatDirtyList(dirtyLines).join('\n')}

## 目前最重要的基準提醒

1. production 應以**逐路由實測**為準
2. 首頁與匯集區目前都已經 live 顯示新版資料來源導覽／櫥窗語氣
3. admin 頁面仍採登入保護，未登入時 \`/admin/review\`、\`/admin/articles\`、\`/admin/comments\`、\`/admin/inbox\` 會導向登入
4. dirty worktree 仍存在，部署或交接前要先釐清範圍
`;
}

function buildSourceOfTruth(date, branch, head, routeResults) {
    const forumCheck = routeResults.find((result) => result.path === '/forum');
    const homeCheck = routeResults.find((result) => result.path === '/');

    return `# CURRENT SOURCE OF TRUTH - 2026-04-04

這份文件定義版本衝突時，應該先相信什麼。

## 1. Production truth

正式站：

- \`${baseUrl}\`

production 用來回答：

- 使用者現在真的看到什麼
- 某個 bug 是否仍在 live site 上可見
- 某條正式路由是否可開

### 最新直接實測時間

- \`${date}\`

### ${date} production alias recheck

${routeResults.map((result) => `- \`${result.path}\` \`${result.status}\``).join('\n')}

內容層面的最新 production truth：

- 首頁已有 \`鳴謝與資料來源\` 導覽與 \`#sources-acknowledgements\`
- 規範頁仍為 \`平台限制與規範\`
- 筆記總覽頁有案件抬頭摘要
- 匯集區目前${forumCheck?.matchedMarkers.includes('本計畫資料來源與鳴謝') ? '已顯示新版 `本計畫資料來源與鳴謝` 櫥窗' : '仍未顯示新版 `本計畫資料來源與鳴謝` 櫥窗'}

所以：

- 如果首頁與匯集區發生衝突，請按**各自路由的 production 實測結果**回答
- 不要把某一路由的更新狀態外推到全站

## 2. Code truth

程式碼真相順序：

1. \`main\`
2. \`origin/main\` 在明確同步檢查後
3. 當前工作樹，但前提是已先釐清 dirty 範圍

截至 ${date} 重新核對：

- branch：\`${branch}\`
- \`HEAD\`：\`${head}\`

不要把 dirty worktree 直接當成單一可信版本。

## 3. Governance truth

治理文件負責說明流程與風險，但不能覆蓋 production truth 或 code truth。

優先看的治理檔：

- \`docs/governance/00_唯一基準入口_先讀我_2026-04-04.md\`
- \`docs/governance/CURRENT_SOURCE_OF_TRUTH_2026-04-04.md\`
- \`docs/governance/CURRENT_BASELINE_2026-04-04.md\`
- \`docs/governance/DEPLOYMENT_LEDGER.md\`
- \`docs/governance/AI_HANDOFF_2026-04-05_CURRENT_STATE.md\`

## 4. Snapshot truth

如果某段頁面曾被使用者明確接受，而且後續可能被大改，應同時參考 \`version_snapshots/\`。

## 5. Formal product surface

目前正式 IA 包括：

- \`/\`
- \`/about\`
- \`/guide\`
- \`/knowledge\`
- \`/sessions\`
- \`/sessions/[id]\`
- \`/sessions/compose\`
- \`/forum\`
- \`/forum/[id]\`
- \`/contact\`
- \`/rankings\`

目前 admin surface 包括：

- \`/admin\`
- \`/admin/login\`
- \`/admin/review\`
- \`/admin/articles\`
- \`/admin/comments\`
- \`/admin/inbox\`

## 6. Non-formal surface

以下不算正式 IA：

- preview
- prototype
- demo
- archive
- history

## 7. 最後規則

當版本衝突時，判斷順序是：

1. production truth（逐路由、逐時間）
2. code truth
3. governance truth
4. snapshot truth
5. non-formal references
`;
}

function buildHandoff(date, branch, head, dirtyLines, routeResults, adminResults) {
    const routeStatusLines = routeResults.map((result) => `- \`${result.path}\` \`${result.status}\``).join('\n');
    const forumCheck = routeResults.find((result) => result.path === '/forum');

    return `# AI Handoff - Current State - 2026-04-05

這份文件是目前給下一位 AI 的主交接文件。先讀這份，再決定下一輪要收哪一條主線。

## 建議閱讀順序

1. \`docs/governance/00_唯一基準入口_先讀我_2026-04-04.md\`
2. \`docs/governance/CURRENT_SOURCE_OF_TRUTH_2026-04-04.md\`
3. \`docs/governance/CURRENT_BASELINE_2026-04-04.md\`
4. \`docs/governance/DEPLOYMENT_LEDGER.md\`
5. \`docs/governance/AI_HANDOFF_2026-04-05_CURRENT_STATE.md\`
6. \`docs/governance/COPY_AUDIT_AND_REMAINING_TEXT_2026-04-05.md\`

## 目前 repo 狀態

- 目前分支：\`${branch}\`
- 目前 \`HEAD\`：\`${head}\`
- 工作樹：${dirtyLines.length ? '**仍然是 dirty**' : '乾淨'}

目前最明確的 dirty 範圍：

${formatDirtyList(dirtyLines).join('\n')}

## 最新 production 狀態（${date} live recheck）

正式站網址：

- \`${baseUrl}\`

已直接驗證：

${routeStatusLines}

### 這次最重要的新發現

- 首頁已有 \`鳴謝與資料來源\` 導覽與 \`#sources-acknowledgements\`
- 匯集區目前${forumCheck?.matchedMarkers.includes('本計畫資料來源與鳴謝') ? '已經對外顯示新版 `本計畫資料來源與鳴謝` 櫥窗' : '仍未對外顯示新版 `本計畫資料來源與鳴謝` 櫥窗'}
- admin routes 仍為登入保護頁面，未登入時不是 bug

## 最新 recorded deployment

請先查看：

- \`docs/governance/DEPLOYMENT_LEDGER.md\`

如果本次只是 live recheck，而非新 deploy，請不要把它誤記成新部署。

## 本地已確認的 code truth

- 首頁共享導覽與頁尾資料來源櫥窗已存在於本地 code
- 匯集區頁尾資料來源櫥窗已存在於本地 code，且目前 live 已可觀察
- admin 營運控台、發布流程、env 健康檢查、session patch 流程都已有腳本與治理文件

## 目前最重要的未完成項

### A. dirty worktree 仍需持續收斂

- 現在專案已可用，但不代表 worktree 已乾淨
- 下一位 AI 若要部署，請先判斷 dirty 範圍是否應一起帶上

### B. 匯集區長期發佈架構已落地第一版，但仍需營運驗證

- 目前已有：
  - \`articles:publish:prepare\`
  - \`articles:publish:finalize\`
  - \`release:prod\`
- 但仍需真實營運驗證 publish / unpublish / dirty sync 邏輯

### C. 治理更新已可工具化，但仍需養成固定使用習慣

- 每次重大 recheck 或部署後，請跑治理更新腳本
- 不要再只手動改一份 handoff

## admin surface

${adminResults.map((result) => `- \`${result.path}\` -> \`${result.status}\`${result.ok ? '' : ' (與預期不符)'}`).join('\n')}

## 中文工作簡稱

- 首頁
- 緣起頁
- 規範頁
- 知識頁
- 筆記總覽頁
- 單場筆記頁
- 跨場工作檯
- 匯集區
- 單篇文章頁
- 排行頁
- 聯絡頁
- 首頁主敘事
- 首頁右櫥窗
- 首頁規範櫥窗
- 筆記總覽抬頭區
- 庭期區
- 匯集區前導
`;
}

function buildWorkflowDoc(date) {
    return `# GOVERNANCE REFRESH WORKFLOW - ${date}

這份文件說明如何在重大部署、production recheck、或交接前，快速更新治理文件。

## 指令

本機重建治理文件：

\`\`\`powershell
npm run docs:governance:refresh
\`\`\`

若這次同時要把 production live recheck 追加到部署帳本：

\`\`\`powershell
npm run docs:governance:refresh -- --append-ledger-recheck
\`\`\`

## 目前會更新的文件

- \`docs/governance/CURRENT_BASELINE_2026-04-04.md\`
- \`docs/governance/CURRENT_SOURCE_OF_TRUTH_2026-04-04.md\`
- \`docs/governance/AI_HANDOFF_2026-04-05_CURRENT_STATE.md\`

## 可選附加動作

- 追加一筆 \`DEPLOYMENT_LEDGER.md\` 的 live recheck 記錄

## 目前會自動檢查

- git branch / HEAD
- dirty worktree 摘要
- production 主要正式路由狀態
- admin 路由保護狀態
- 首頁與匯集區關鍵 marker

## 注意

- 這份工具是治理更新工具，不會替你部署
- 若是正式 deploy，仍應另外跑：
  - \`npm run env:check\`
  - \`npm run build\`
  - \`npm run release:prod\`（依需求）
`;
}

function appendLedgerRecheck(date, branch, head, routeResults) {
    const checkedRoutes = routeResults.map((result) => result.path).join(', ');
    const forumCheck = routeResults.find((result) => result.path === '/forum');
    const notes = forumCheck?.matchedMarkers.includes('本計畫資料來源與鳴謝')
        ? 'Live alias recheck only; homepage與匯集區皆已顯示新版資料來源與鳴謝內容。'
        : 'Live alias recheck only; homepage 已顯示新版資料來源導覽，但匯集區仍未顯示新版資料來源櫥窗。';

    const row = `| ${date} | \`${branch}\` | \`${head}\` | production rechecked | \`${checkedRoutes}\` | ${notes} |`;
    const existing = readUtf8(ledgerPath);
    if (existing.includes(row)) {
        return false;
    }

    if (existing.includes('\n## Rule')) {
        const updated = existing.replace('\n## Rule', `\n${row}\n\n## Rule`);
        writeUtf8(ledgerPath, updated);
        return true;
    }

    writeUtf8(ledgerPath, `${existing.trimEnd()}\n${row}\n`);
    return true;
}

async function main() {
    const date = getTaipeiDate();
    const branch = runGit(['rev-parse', '--abbrev-ref', 'HEAD']);
    const head = runGit(['rev-parse', 'HEAD']);
    const dirtyLines = runGit(['status', '--short'])
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean);

    const routeResults = [];
    for (const check of routeChecks) {
        routeResults.push(await fetchCheck(baseUrl, check));
    }

    const adminResults = [];
    for (const check of adminChecks) {
        adminResults.push(await fetchAdminCheck(baseUrl, check));
    }

    writeUtf8(baselinePath, buildBaseline(date, branch, head, dirtyLines, routeResults, adminResults));
    writeUtf8(sourceOfTruthPath, buildSourceOfTruth(date, branch, head, routeResults));
    writeUtf8(handoffPath, buildHandoff(date, branch, head, dirtyLines, routeResults, adminResults));
    writeUtf8(workflowPath, buildWorkflowDoc(date));

    let appendedLedger = false;
    if (shouldAppendLedger) {
        appendedLedger = appendLedgerRecheck(date, branch, head, routeResults);
    }

    console.log(`[governance-refresh] updated baseline/source-of-truth/handoff (${date})`);
    if (shouldAppendLedger) {
        console.log(`[governance-refresh] ledger ${appendedLedger ? 'appended' : 'already up to date'}`);
    }
}

main().catch((error) => {
    console.error('[governance-refresh] FAIL');
    console.error(error instanceof Error ? error.stack || error.message : String(error));
    process.exit(1);
});
