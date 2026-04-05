import fs from 'node:fs';
import path from 'node:path';
import type {
  PublishedArticleIndexItem,
  PublishedArticleSnapshot,
  PublishedArticlesIndex,
} from '@/lib/published-articles/types';

const publishedArticlesDir = path.join(process.cwd(), 'data', 'published-articles');
const publishedIndexPath = path.join(publishedArticlesDir, 'index.json');

export function getPublishedArticlesDir() {
  return publishedArticlesDir;
}

export function getPublishedArticlePath(slug: string) {
  return path.join(publishedArticlesDir, `${slug}.json`);
}

export function readPublishedArticlesIndex(): PublishedArticlesIndex {
  if (!fs.existsSync(publishedIndexPath)) {
    return { generatedAt: null, items: [] };
  }

  const raw = fs.readFileSync(publishedIndexPath, 'utf8');
  return JSON.parse(raw) as PublishedArticlesIndex;
}

export function readPublishedArticleSnapshot(slug: string): PublishedArticleSnapshot | null {
  const filePath = getPublishedArticlePath(slug);
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, 'utf8')) as PublishedArticleSnapshot;
}

export function findPublishedArticleIndexItemByIdOrSlug(idOrSlug: string): PublishedArticleIndexItem | null {
  const index = readPublishedArticlesIndex();
  return index.items.find((item) => item.slug === idOrSlug || item.id === idOrSlug) || null;
}

export function findPublishedArticleSnapshotByIdOrSlug(idOrSlug: string): PublishedArticleSnapshot | null {
  const direct = readPublishedArticleSnapshot(idOrSlug);
  if (direct) return direct;

  const item = findPublishedArticleIndexItemByIdOrSlug(idOrSlug);
  if (!item) return null;

  return readPublishedArticleSnapshot(item.slug);
}
