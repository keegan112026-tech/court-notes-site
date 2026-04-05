import fs from 'node:fs';
import path from 'node:path';

const repoRoot = process.cwd();
const sessionsDir = path.join(repoRoot, 'data', 'sessions');
const outputPath = path.join(repoRoot, 'lib', 'generated', 'local-session-details.ts');

function toIdentifier(stem) {
  const parts = stem.split(/[^A-Za-z0-9]+/).filter(Boolean);
  let name = parts.map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join('');
  if (!name || /^\d/.test(name)) name = `Session${name}`;
  return name;
}

function render() {
  const imports = [];
  const mappings = [];

  for (const name of fs.readdirSync(sessionsDir).filter((item) => item.endsWith('.json')).sort()) {
    const stem = name.replace(/\.json$/, '');
    const identifier = toIdentifier(stem);
    imports.push(`import ${identifier} from '@/data/sessions/${name}';`);
    mappings.push(`    '${stem}': ${identifier},`);
  }

  return [
    '/* eslint-disable */',
    '// AUTO-GENERATED FILE. DO NOT EDIT MANUALLY.',
    '// Run `npm run sessions:generate-map` after adding or removing files in data/sessions.',
    '',
    ...imports,
    '',
    'export const localSessionDetailsMap = {',
    ...mappings,
    '} as const;',
    '',
    'export type GeneratedLocalSessionId = keyof typeof localSessionDetailsMap;',
    '',
  ].join('\n');
}

const expected = render();
const current = fs.existsSync(outputPath) ? fs.readFileSync(outputPath, 'utf8') : '';

if (process.argv.includes('--check')) {
  if (current !== expected) {
    console.log('[sessions-map] OUT OF DATE');
    console.log('Run: npm run sessions:generate-map');
    process.exit(1);
  }
  console.log('[sessions-map] OK');
  process.exit(0);
}

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, expected, { encoding: 'utf8' });
console.log(`[sessions-map] wrote ${outputPath}`);
