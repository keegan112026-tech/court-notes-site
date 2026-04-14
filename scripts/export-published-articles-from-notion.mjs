import fs from 'node:fs';
import path from 'node:path';
import dotenv from 'dotenv';
import { writePublishedArticles } from './export-published-articles.mjs';

const API = 'https://api.notion.com/v1';
const NOTION_VERSION = '2022-06-28';
const projectRoot = process.cwd();

dotenv.config({ path: path.join(projectRoot, '.env.local') });

const token = process.env.NOTION_TOKEN || '';
const articlesDb = process.env.NOTION_DB_ARTICLES || '';

const ARTICLE_STATUS = {
  approved: '已核准',
  published: '已發布',
};

function fail(message) {
  throw new Error(`[publish-export:notion] ${message}`);
}

if (!token || !articlesDb) {
  fail('missing NOTION_TOKEN or NOTION_DB_ARTICLES');
}

function headers() {
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
    'Notion-Version': NOTION_VERSION,
  };
}

function parseArgs(argv) {
  const args = {
    prune: false,
    dryRun: false,
    manifestPath: '',
  };

  for (let i = 0; i < argv.length; i += 1) {
    const tokenArg = argv[i];
    if (tokenArg === '--prune') {
      args.prune = true;
      continue;
    }
    if (tokenArg === '--dry-run') {
      args.dryRun = true;
      continue;
    }
    if (tokenArg === '--manifest') {
      args.manifestPath = argv[i + 1] || '';
      i += 1;
    }
  }

  return args;
}

async function notionFetch(pathname, init = {}) {
  const res = await fetch(`${API}${pathname}`, {
    ...init,
    headers: {
      ...headers(),
      ...(init.headers || {}),
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    fail(`Notion API ${res.status}: ${body}`);
  }

  return res.json();
}

async function queryPublishableArticles() {
  const payload = {
    filter: {
      or: [
        {
          property: 'status',
          status: { equals: ARTICLE_STATUS.approved },
        },
        {
          property: 'status',
          status: { equals: ARTICLE_STATUS.published },
        },
      ],
    },
    sorts: [{ property: 'published_at', direction: 'descending' }],
    page_size: 100,
  };

  const result = await notionFetch(`/databases/${articlesDb}/query`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  return Array.isArray(result.results) ? result.results : [];
}

function getTitle(page, key) {
  const prop = page.properties?.[key];
  if (!prop || prop.type !== 'title') return '';
  return (prop.title || []).map((item) => item.plain_text || '').join('').trim();
}

function getRichText(page, key) {
  const prop = page.properties?.[key];
  if (!prop || prop.type !== 'rich_text') return '';
  return (prop.rich_text || []).map((item) => item.plain_text || '').join('').trim();
}

function getSelect(page, key) {
  const prop = page.properties?.[key];
  if (!prop) return '';
  if (prop.type === 'select') return prop.select?.name || '';
  if (prop.type === 'status') return prop.status?.name || '';
  return '';
}

function getDate(page, key) {
  return page.properties?.[key]?.date?.start || page.created_time || new Date().toISOString();
}

function getNumber(page, key) {
  const value = page.properties?.[key]?.number;
  return typeof value === 'number' ? value : 0;
}

function getMultiSelect(page, key) {
  const values = page.properties?.[key]?.multi_select;
  if (!Array.isArray(values)) return [];
  return values.map((item) => item?.name).filter(Boolean);
}

function stripHtml(value) {
  return String(value || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function inferArticleType(articleTypeLabel, sourceSessionIds) {
  if (articleTypeLabel.includes('跨')) return 'multi-session';
  if (articleTypeLabel.includes('專題') || articleTypeLabel.includes('綜合')) return 'thematic';
  if (sourceSessionIds.length > 1) return 'multi-session';
  return 'single-session';
}

function buildExcerpt(summary, contentHtml) {
  const fromSummary = stripHtml(summary);
  if (fromSummary) return fromSummary.slice(0, 180);
  return stripHtml(contentHtml).slice(0, 180);
}

function normalizeSlug(raw, pageId) {
  const clean = String(raw || '').trim();
  if (clean) return clean;
  return `article-${String(pageId).replace(/[^a-zA-Z0-9]/g, '').slice(-8).toLowerCase()}`;
}

function mapArticle(page) {
  const title = getTitle(page, '標題');
  const contentHtml = getRichText(page, 'content_html');
  const summary = getRichText(page, 'summary');
  const sourceSessionIds = getMultiSelect(page, 'source_session_ids');
  const primarySessionId = getRichText(page, 'primary_session_id') || sourceSessionIds[0] || '';
  const articleTypeLabel = getSelect(page, 'article_type');
  const slug = normalizeSlug(getRichText(page, 'public_slug'), page.id);
  const status = getSelect(page, 'status');
  const publishedAt = getDate(page, 'published_at');
  const createdAt = getDate(page, 'created_at');

  return {
    id: page.id,
    slug,
    title,
    excerpt: buildExcerpt(summary, contentHtml),
    contentHtml,
    articleType: inferArticleType(articleTypeLabel, sourceSessionIds),
    primarySessionId: primarySessionId || undefined,
    sourceSessionIds,
    sourceTopicKeys: [],
    sourceWitnessLabels: [],
    authorLabel: getRichText(page, 'author_name') || '匿名作者',
    publishedAt: publishedAt || createdAt,
    reviewedAt: getDate(page, 'reviewed_at'),
    reviewedBy: getRichText(page, 'reviewed_by') || undefined,
    publishedVersion: 1,
    commentsOpen: true,
    likesSnapshot: getNumber(page, 'likes_count'),
    linkageSummary: {
      sessionCount: sourceSessionIds.length,
      witnessCount: 0,
      topicCount: 0,
    },
    statusBeforeExport: status,
  };
}

function writeManifest(manifestPath, payload) {
  if (!manifestPath) return;

  const resolvedPath = path.isAbsolute(manifestPath)
    ? manifestPath
    : path.join(projectRoot, manifestPath);

  fs.mkdirSync(path.dirname(resolvedPath), { recursive: true });
  fs.writeFileSync(resolvedPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
}

async function main() {
  try {
    const args = parseArgs(process.argv.slice(2));
    const pages = await queryPublishableArticles();
    const items = pages.map(mapArticle).filter((item) => item.title && item.contentHtml);

    const exportItems = items.map(({ statusBeforeExport, ...item }) => item);
    const readyItems = items.filter((item) => item.statusBeforeExport === ARTICLE_STATUS.approved);

    const manifest = {
      generatedAt: new Date().toISOString(),
      count: exportItems.length,
      readyToPublishIds: readyItems.map((item) => item.id),
      exportedIds: items.map((item) => item.id),
      items: items.map((item) => ({
        id: item.id,
        slug: item.slug,
        title: item.title,
        statusBeforeExport: item.statusBeforeExport,
      })),
    };

    if (args.dryRun) {
      writeManifest(args.manifestPath, manifest);
      console.log(`[publish-export:notion] dry-run ok: ${exportItems.length} publishable article(s), ${readyItems.length} ready-to-publish`);
      return;
    }

    const result = writePublishedArticles(exportItems, { prune: args.prune });
    writeManifest(args.manifestPath, manifest);
    console.log(`[publish-export:notion] exported ${result.count} article(s) from Notion`);
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}

main();
