# 2026-04-05 Admin Console And Forum Sync Snapshot

## Purpose

This snapshot preserves the code state where the admin console became a clearer
multi-page workflow and the public 匯集區 stopped hiding newly approved
articles behind snapshot-first behavior.

## What this checkpoint means

At this checkpoint:

- `審查台` is for pending articles and pending comments
- `文章管理` is for all article management
- `留言管理` is for all comment management
- `收件匣` is for inbox/private message review
- public `/forum` prefers backend-published content first
- newly approved articles can surface on the public 匯集區 immediately

## Snapshot files

- `01-api-forum.route.ts`
- `02-api-forum-id.route.ts`
- `03-admin-review.page.tsx`
- `04-admin-articles.page.tsx`
- `05-admin-comments.page.tsx`
- `06-admin-inbox.page.tsx`
- `07-admin-console-nav.tsx`
- `08-forum.page.tsx`
- `09-api-admin-articles.route.ts`
- `10-api-admin-comments.route.ts`

## Production reference

- deployment id: `dpl_XzzBoLdrURM77hJrbdKMA9gnAMfg`
- alias: `https://court-notes-site.vercel.app/`

## Verification summary

- `/forum` -> `200`
- `/admin/review` -> `200`
- `/admin/articles` -> `200`
- `/admin/comments` -> `200`
- `/admin/inbox` -> `200`
- `/api/forum` -> `200` with `source=backend-published`

## Remaining gap

This snapshot does not mean the long-term published-snapshot architecture is
finished. It only records the interim but operationally useful state where
admin review and public visibility are connected again.
