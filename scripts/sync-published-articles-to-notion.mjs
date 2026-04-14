import fs from 'node:fs';
import path from 'node:path';
import dotenv from 'dotenv';

const API = 'https://api.notion.com/v1';
const NOTION_VERSION = '2022-06-28';
const projectRoot = process.cwd();

dotenv.config({ path: path.join(projectRoot, '.env.local') });

const token = process.env.NOTION_TOKEN || '';

const ARTICLE_STATUS = {
  approved: '已核准',
  published: '已發布',
};

function fail(message) {
  throw new Error(`[publish-sync:notion] ${message}`);
}

if (!token) {
  fail('missing NOTION_TOKEN');
}

function parseArgs(argv) {
  const args = {
    manifestPath: '',
    dryRun: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const tokenArg = argv[i];
    if (tokenArg === '--manifest') {
      args.manifestPath = argv[i + 1] || '';
      i += 1;
      continue;
    }
    if (tokenArg === '--dry-run') {
      args.dryRun = true;
    }
  }

  return args;
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

async function updatePageProperties(pageId, properties) {
  return notionFetch(`/pages/${pageId}`, {
    method: 'PATCH',
    body: JSON.stringify({ properties }),
  });
}

function richTextProp(value) {
  const text = String(value || '');
  return {
    rich_text: text
      ? [
          {
            type: 'text',
            text: { content: text.slice(0, 1800) },
          },
        ]
      : [],
  };
}

function statusProp(name) {
  return { status: { name } };
}

function dateProp(value) {
  return { date: value ? { start: value } : null };
}

async function main() {
  try {
    const args = parseArgs(process.argv.slice(2));
    if (!args.manifestPath) {
      fail('missing --manifest <path>');
    }

    const manifestPath = path.isAbsolute(args.manifestPath)
      ? args.manifestPath
      : path.join(projectRoot, args.manifestPath);

    if (!fs.existsSync(manifestPath)) {
      fail(`manifest file not found: ${manifestPath}`);
    }

    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    const readyIds = Array.isArray(manifest.readyToPublishIds) ? manifest.readyToPublishIds : [];

    if (args.dryRun) {
      console.log(`[publish-sync:notion] dry-run ok: ${readyIds.length} article(s) would be marked as ${ARTICLE_STATUS.published}`);
      return;
    }

    for (const pageId of readyIds) {
      await updatePageProperties(pageId, {
        status: statusProp(ARTICLE_STATUS.published),
        published_at: dateProp(new Date().toISOString()),
        review_note: richTextProp('已完成正式發布匯出並同步到前台。'),
        last_activity_at: dateProp(new Date().toISOString()),
      });
    }

    console.log(`[publish-sync:notion] synced ${readyIds.length} article(s) to ${ARTICLE_STATUS.published}`);
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}

main();
