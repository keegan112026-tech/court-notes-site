# 2026-04-05 Notion Submit Safety Snapshot

## Purpose

This snapshot preserves the exact code and decision context used to make
`submit-article` safe for production environment testing.

## What changed

1. `lib/notion.ts` now validates Notion configuration by feature scope.
   - article submission only requires `NOTION_TOKEN` and `NOTION_DB_ARTICLES`
   - comment features require `NOTION_DB_COMMENTS`
   - inbox features require `NOTION_DB_INBOX`
   - moderation logs require `NOTION_DB_MODERATION_LOG`
2. title-property writes were normalized to use the Notion title property id.
3. production was redeployed after the change.

## Verified result after deployment

- production submit endpoint:
  - `POST /api/submit-article`
  - now fails with only:
    - `Notion 環境變數尚未完成：NOTION_DB_ARTICLES`
- this confirms the previous "all DB vars missing" blocker was reduced to the
  minimum article-db dependency required for manual article submission tests

## Snapshot files

- `01-lib-notion.latest.ts`
- `02-submit-article-route.latest.ts`
- `03-aggregation-tech-decision.snapshot.md`

## Operational note

This snapshot is a safety baseline for the next human verification step:

1. add `NOTION_DB_ARTICLES` to Vercel production
2. redeploy or wait for env refresh
3. manually submit from the public site
4. confirm the article appears in the Notion articles database
