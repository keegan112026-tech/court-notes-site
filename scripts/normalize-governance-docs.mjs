import fs from 'node:fs';
import path from 'node:path';

const EXACT_FILES = [
  'CURRENT_SOURCE_OF_TRUTH_2026-04-04.md',
  'CURRENT_BASELINE_2026-04-04.md',
  'WORK_PROTOCOL.md',
  'CURRENT_TASK_GATE.md',
  'GIT_MAINLINE_POLICY.md',
  'DEPLOYMENT_AND_RELEASE_POLICY.md',
  'DEPLOYMENT_LEDGER.md',
  'WORK_SESSION_GATE_2026-04-04.md',
  'REPO_CLEANUP_BASELINE_2026-04-04.md',
  'REPO_CLEANUP_FINAL_VERIFICATION_2026-04-04.md',
  'DIRTY_WORKTREE_CLASSIFICATION_2026-04-04.md',
  'ROUTE_ISOLATION_STRATEGY_2026-04-04.md',
  'CLAUDE_HANDOFF_START_HERE_2026-04-04.md',
  'README.md',
];

const GLOB_DIR = path.join('docs', 'claude_handoff_2026-04-04');
const BOM = Buffer.from([0xef, 0xbb, 0xbf]);

function iterGovernanceDocs(repoRoot) {
  const found = new Map();

  for (const rel of EXACT_FILES) {
    const full = path.join(repoRoot, rel);
    if (fs.existsSync(full)) found.set(path.posix.normalize(rel.replaceAll('\\', '/')), full);
  }

  const zeroEntries = fs.readdirSync(repoRoot).filter((name) => /^00_.*2026-04-04\.md$/.test(name));
  for (const name of zeroEntries) {
    found.set(name, path.join(repoRoot, name));
  }

  const handoffDir = path.join(repoRoot, GLOB_DIR);
  if (fs.existsSync(handoffDir)) {
    for (const name of fs.readdirSync(handoffDir)) {
      const full = path.join(handoffDir, name);
      if (fs.statSync(full).isFile() && name.endsWith('.md')) {
        found.set(`${GLOB_DIR}/${name}`.replaceAll('\\', '/'), full);
      }
    }
  }

  return [...found.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([, full]) => full);
}

function normalizeText(text) {
  let normalized = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  if (!normalized.endsWith('\n')) normalized += '\n';
  return normalized;
}

function normalize(repoRoot) {
  const files = iterGovernanceDocs(repoRoot);
  if (!files.length) {
    console.log('[governance-docs] FAIL: no governance docs matched');
    return 1;
  }

  console.log(`[governance-docs] NORMALIZE ${files.length} files`);
  for (const full of files) {
    const text = fs.readFileSync(full, 'utf8').replace(/^\uFEFF/, '');
    fs.writeFileSync(full, normalizeText(text), { encoding: 'utf8' });
    console.log(path.relative(repoRoot, full).split(path.sep).join('/'));
  }

  console.log('[governance-docs] OK');
  return 0;
}

function verify(repoRoot) {
  const files = iterGovernanceDocs(repoRoot);
  if (!files.length) {
    console.log('[governance-docs] FAIL: no governance docs matched');
    return 1;
  }

  const problems = [];
  for (const full of files) {
    const rel = path.relative(repoRoot, full).split(path.sep).join('/');
    const raw = fs.readFileSync(full);

    if (raw.subarray(0, 3).equals(BOM)) problems.push([rel, 'has UTF-8 BOM']);

    const text = raw.toString('utf8');
    if (text.includes('\r')) problems.push([rel, 'contains CR or CRLF line endings']);
    if (!text.endsWith('\n')) problems.push([rel, 'missing final newline']);
  }

  if (problems.length) {
    console.log('[governance-docs] FAIL');
    for (const [rel, reason] of problems) {
      console.log(`${rel}: ${reason}`);
    }
    return 1;
  }

  console.log(`[governance-docs] OK (${files.length} files)`);
  return 0;
}

const repoRoot = process.cwd();
const cmd = process.argv[2];

if (!['normalize', 'verify', 'list'].includes(cmd)) {
  console.log('usage: node scripts/normalize-governance-docs.mjs [normalize|verify|list]');
  process.exit(2);
}

if (cmd === 'list') {
  for (const full of iterGovernanceDocs(repoRoot)) {
    console.log(path.relative(repoRoot, full).split(path.sep).join('/'));
  }
  process.exit(0);
}

process.exit(cmd === 'normalize' ? normalize(repoRoot) : verify(repoRoot));
