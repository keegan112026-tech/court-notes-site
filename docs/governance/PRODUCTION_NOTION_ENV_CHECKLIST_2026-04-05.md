# Production Notion Env Checklist (2026-04-05)

## Goal

Make public article submission on production writable without changing the
database contents directly.

## Confirmed current production state

After deployment `dpl_BzwdJFjS2qBdX89JFDakk8pERB8b`, production
`/api/submit-article` returns:

- `Notion 環境變數尚未完成：NOTION_DB_ARTICLES`

This means the code path is alive, and the remaining blocker for article
submission is the production article database id.

## Minimum variable required for manual article submission

- `NOTION_TOKEN`
- `NOTION_DB_ARTICLES`

## Recommended full production set

- `BACKEND_PROVIDER=notion`
- `NOTION_TOKEN`
- `NOTION_DB_ARTICLES`
- `NOTION_DB_COMMENTS`
- `NOTION_DB_INBOX`
- `NOTION_DB_MODERATION_LOG`

## Safe manual sequence

1. Open Vercel project settings for `court-notes-site`
2. Add or verify `NOTION_DB_ARTICLES`
3. Confirm `NOTION_TOKEN` is also present
4. Redeploy production
5. Submit one real test article from the public site
6. Check the Notion articles database for the new pending row

## Success criteria

- production article submission no longer shows the env warning
- a new pending article row appears in the Notion articles database
- title, author, content, and `primary_session_id` are populated
