import fs from 'node:fs';
import path from 'node:path';

const TEXT_EXTS = new Set([
  '.md', '.txt', '.json', '.yml', '.yaml', '.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs', '.html', '.css', '.ps1', '.cmd', '.bat',
]);

const SKIP_DIRS = new Set([
  '.git',
  'node_modules',
  '.next',
  'next-dev-cache',
  '.claude',
  '.vercel',
  'old_prototype_archive',
  'version_snapshots',
  'outsourcing_packages',
  '版本備份_guide-prototype與計畫緣起_2026-04-03',
  '還原筆記單頁外包工作包_2026-04-04',
]);

const SKIP_PATH_PARTS = [
  'docs/archive',
  'docs/legacy_archived_docs_2026-04-04',
  'scripts/check-encoding.mjs',
];

const MOJIBAKE_SNIPPETS = [
  'ï»¿',
  'Ã',
  'â€',
  'â€™',
  'â€œ',
  'â€\x9d',
  'å',
  'ç',
  'æ',
];

const SUSPICIOUS_QUESTION_MARK_SNIPPETS = [
  '????',
  '？？',
];

function shouldSkip(filePath) {
  const rel = filePath.split(path.sep).join('/');
  const parts = filePath.split(path.sep);
  if (parts.some((part) => SKIP_DIRS.has(part))) return true;
  return SKIP_PATH_PARTS.some((part) => rel.includes(part));
}

function walk(dir, problems) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue;
      walk(full, problems);
      continue;
    }

    if (!entry.isFile()) continue;
    if (!TEXT_EXTS.has(path.extname(entry.name).toLowerCase())) continue;
    if (shouldSkip(full)) continue;

    let text;
    try {
      text = fs.readFileSync(full, 'utf8');
    } catch {
      problems.push([path.relative(process.cwd(), full).split(path.sep).join('/'), 'not valid utf-8']);
      continue;
    }

    if (text.includes('\uFFFD')) {
      problems.push([path.relative(process.cwd(), full).split(path.sep).join('/'), 'contains replacement character']);
      continue;
    }

    const found = MOJIBAKE_SNIPPETS.find((snippet) => text.includes(snippet));
    if (found) {
      problems.push([path.relative(process.cwd(), full).split(path.sep).join('/'), `contains mojibake snippet: ${JSON.stringify(found)}`]);
    }

    const suspiciousQuestionMark = SUSPICIOUS_QUESTION_MARK_SNIPPETS.find((snippet) => text.includes(snippet));
    if (suspiciousQuestionMark) {
      problems.push([path.relative(process.cwd(), full).split(path.sep).join('/'), `contains suspicious question-mark corruption: ${JSON.stringify(suspiciousQuestionMark)}`]);
    }
  }
}

const problems = [];
walk(process.cwd(), problems);

if (problems.length) {
  console.log('[encoding] FAIL');
  for (const [filePath, reason] of problems) {
    console.log(`${filePath}: ${reason}`);
  }
  process.exit(1);
}

console.log('[encoding] OK');
