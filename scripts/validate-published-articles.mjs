import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const publishedDir = path.join(root, 'data', 'published-articles');
const indexPath = path.join(publishedDir, 'index.json');

function fail(message) {
  console.error(`[published-articles] ${message}`);
  process.exit(1);
}

function ensureString(value, field, fileLabel) {
  if (typeof value !== 'string' || value.trim().length === 0) {
    fail(`${fileLabel}: field "${field}" must be a non-empty string`);
  }
}

function ensureStringArray(value, field, fileLabel) {
  if (!Array.isArray(value) || value.some((item) => typeof item !== 'string')) {
    fail(`${fileLabel}: field "${field}" must be a string array`);
  }
}

if (!fs.existsSync(publishedDir)) {
  fail(`missing directory: ${publishedDir}`);
}

if (!fs.existsSync(indexPath)) {
  fail(`missing index file: ${indexPath}`);
}

const index = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
if (!index || typeof index !== 'object') {
  fail('index.json must be a JSON object');
}

if (!Array.isArray(index.items)) {
  fail('index.json must contain an "items" array');
}

for (const item of index.items) {
  ensureString(item.id, 'id', 'index.json item');
  ensureString(item.slug, 'slug', `index.json item ${item.id}`);
  ensureString(item.title, 'title', `index.json item ${item.id}`);
  ensureString(item.excerpt, 'excerpt', `index.json item ${item.id}`);
  ensureString(item.articleType, 'articleType', `index.json item ${item.id}`);
  ensureString(item.authorLabel, 'authorLabel', `index.json item ${item.id}`);
  ensureString(item.publishedAt, 'publishedAt', `index.json item ${item.id}`);
  ensureStringArray(item.sourceSessionIds, 'sourceSessionIds', `index.json item ${item.id}`);

  const snapshotPath = path.join(publishedDir, `${item.slug}.json`);
  if (!fs.existsSync(snapshotPath)) {
    fail(`missing snapshot file for slug "${item.slug}"`);
  }

  const snapshot = JSON.parse(fs.readFileSync(snapshotPath, 'utf8'));
  ensureString(snapshot.id, 'id', snapshotPath);
  ensureString(snapshot.slug, 'slug', snapshotPath);
  ensureString(snapshot.title, 'title', snapshotPath);
  ensureString(snapshot.excerpt, 'excerpt', snapshotPath);
  ensureString(snapshot.contentHtml, 'contentHtml', snapshotPath);
  ensureString(snapshot.articleType, 'articleType', snapshotPath);
  ensureString(snapshot.authorLabel, 'authorLabel', snapshotPath);
  ensureString(snapshot.publishedAt, 'publishedAt', snapshotPath);
  ensureStringArray(snapshot.sourceSessionIds, 'sourceSessionIds', snapshotPath);

  if (typeof snapshot.publishedVersion !== 'number') {
    fail(`${snapshotPath}: field "publishedVersion" must be a number`);
  }

  if (typeof snapshot.commentsOpen !== 'boolean') {
    fail(`${snapshotPath}: field "commentsOpen" must be a boolean`);
  }

  if (typeof snapshot.likesSnapshot !== 'number') {
    fail(`${snapshotPath}: field "likesSnapshot" must be a number`);
  }
}

console.log('[published-articles] OK');
