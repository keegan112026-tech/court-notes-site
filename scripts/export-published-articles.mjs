import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const publishedDir = path.join(root, 'data', 'published-articles');
const indexPath = path.join(publishedDir, 'index.json');

function fail(message) {
  throw new Error(`[publish-export] ${message}`);
}

function hasSuspiciousQuestionCorruption(value) {
  const text = String(value || '');
  return text.includes('????') || text.includes('？？') || /^\?+$/.test(text.trim());
}

function parseArgs(argv) {
  const args = { source: '', prune: false };

  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (token === '--source') {
      args.source = argv[i + 1] || '';
      i += 1;
      continue;
    }
    if (token === '--prune') {
      args.prune = true;
    }
  }

  return args;
}

function shortCode(id) {
  return String(id).replace(/[^a-zA-Z0-9]/g, '').slice(-4).toLowerCase() || 'item';
}

function buildFallbackSlug(item) {
  const datePart = String(item.publishedAt || new Date().toISOString()).slice(0, 10).replace(/-/g, '');
  return `article-${datePart}-${shortCode(item.id)}`;
}

function normalizeAsciiSlug(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}

function buildSlug(item) {
  const fromTitle = normalizeAsciiSlug(item.title);
  if (fromTitle) {
    return `${fromTitle}-${shortCode(item.id)}`;
  }
  return buildFallbackSlug(item);
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function toIndexItem(item, slug) {
  return {
    id: item.id,
    slug,
    title: item.title,
    excerpt: item.excerpt,
    articleType: item.articleType,
    primarySessionId: item.primarySessionId || undefined,
    sourceSessionIds: Array.isArray(item.sourceSessionIds) ? item.sourceSessionIds : [],
    sourceTopicKeys: Array.isArray(item.sourceTopicKeys) ? item.sourceTopicKeys : [],
    sourceWitnessLabels: Array.isArray(item.sourceWitnessLabels) ? item.sourceWitnessLabels : [],
    publishedAt: item.publishedAt,
    authorLabel: item.authorLabel,
    linkageSummary: item.linkageSummary || {
      sessionCount: Array.isArray(item.sourceSessionIds) ? item.sourceSessionIds.length : 0,
      witnessCount: Array.isArray(item.sourceWitnessLabels) ? item.sourceWitnessLabels.length : 0,
      topicCount: Array.isArray(item.sourceTopicKeys) ? item.sourceTopicKeys.length : 0,
    },
  };
}

function toSnapshot(item, slug, indexItem) {
  return {
    ...indexItem,
    contentHtml: item.contentHtml,
    reviewedAt: item.reviewedAt || undefined,
    reviewedBy: item.reviewedBy || undefined,
    publishedVersion: Number(item.publishedVersion || 1),
    commentsOpen: Boolean(item.commentsOpen),
    likesSnapshot: Number(item.likesSnapshot || 0),
  };
}

export function writePublishedArticles(items, options = {}) {
  const prune = Boolean(options.prune);

  ensureDir(publishedDir);

  const writtenSlugs = new Set();
  const indexItems = [];

  for (const item of items) {
    if (!item || typeof item !== 'object') {
      fail('each source item must be an object');
    }

    if (!item.id || !item.title || !item.excerpt || !item.contentHtml || !item.articleType || !item.authorLabel || !item.publishedAt) {
      fail('source item is missing one of the required fields: id/title/excerpt/contentHtml/articleType/authorLabel/publishedAt');
    }

    for (const field of ['title', 'excerpt', 'authorLabel']) {
      if (hasSuspiciousQuestionCorruption(item[field])) {
        fail(`source item "${item.id}" has suspicious corruption in field "${field}"`);
      }
    }

    const slug = item.slug ? String(item.slug) : buildSlug(item);
    const indexItem = toIndexItem(item, slug);
    const snapshot = toSnapshot(item, slug, indexItem);

    fs.writeFileSync(
      path.join(publishedDir, `${slug}.json`),
      `${JSON.stringify(snapshot, null, 2)}\n`,
      'utf8',
    );

    writtenSlugs.add(slug);
    indexItems.push(indexItem);
  }

  if (prune) {
    for (const file of fs.readdirSync(publishedDir)) {
      if (file === 'README.md' || file === 'index.json') continue;
      if (!file.endsWith('.json')) continue;

      const slug = file.replace(/\.json$/i, '');
      if (!writtenSlugs.has(slug)) {
        fs.unlinkSync(path.join(publishedDir, file));
      }
    }
  }

  const indexPayload = {
    generatedAt: new Date().toISOString(),
    items: indexItems.sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt)),
  };

  fs.writeFileSync(indexPath, `${JSON.stringify(indexPayload, null, 2)}\n`, 'utf8');

  return {
    count: indexItems.length,
    slugs: [...writtenSlugs],
  };
}

function main() {
  try {
    const { source, prune } = parseArgs(process.argv.slice(2));

    if (!source) {
      fail('missing --source <path-to-json>');
    }

    const sourcePath = path.isAbsolute(source) ? source : path.join(root, source);
    if (!fs.existsSync(sourcePath)) {
      fail(`source file not found: ${sourcePath}`);
    }

    const sourceJson = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));
    const items = Array.isArray(sourceJson) ? sourceJson : Array.isArray(sourceJson.items) ? sourceJson.items : null;
    if (!items) {
      fail('source file must be an array or an object with an "items" array');
    }

    const result = writePublishedArticles(items, { prune });
    console.log(`[publish-export] wrote ${result.count} published article(s)`);
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}

if (import.meta.url === `file://${process.argv[1].replace(/\\/g, '/')}`) {
  main();
}
