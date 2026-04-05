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

async function queryPublishedArticles() {
  const payload = {
    filter: {
      property: 'status',
      status: { equals: '已發布' },
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
    publishedAt: getDate(page, 'published_at'),
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
  };
}

async function main() {
  try {
    const pages = await queryPublishedArticles();
    const items = pages.map(mapArticle).filter((item) => item.title && item.contentHtml);

    const exportDir = path.join(projectRoot, 'data', 'published-articles');
    fs.mkdirSync(exportDir, { recursive: true });

    const result = writePublishedArticles(items, { prune: false });
    console.log(`[publish-export:notion] exported ${result.count} article(s) from Notion`);
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}

main();
