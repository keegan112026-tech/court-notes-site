# Firebase Data Schema

> Legacy notice (2026-04-04)
>
> 這份文件記錄的是 Firebase 主線時期的資料設計。
> 目前正式後台方向已改為 Notion + 本地 sessions/transcripts。
> 請不要把這份文件當作現行主架構入口。

Updated: 2026-03-31

## 1. Active backend

Current Firebase project:
- `adhd-2812c`

Current backend mode:
- `BACKEND_PROVIDER=firebase`

## 2. Collection overview

### `articles`
Purpose:
- approved and pending public articles originating from workspace submissions

Fields:
- `postId: string`
- `author: string`
- `title: string`
- `content: string`
- `category: string`
- `targetTopic: string`
- `targetSessionId: string`
- `likes: number`
- `status: string`
- `createdAt: string`
- `source?: string`
- `reviewedBy?: string`
- `reviewedAt?: string`
- `reviewNote?: string`

Status values:
- `pending`
- `approved`
- `rejected`

Current meaning:
- `approved` articles appear in `/forum` and `/rankings`
- `pending` articles are submitted from workspace and await moderation

### `comments`
Purpose:
- article comments
- line-level comments if later reused more broadly

Fields:
- `targetLineId: string`
- `author: string`
- `content: string`
- `likes: number`
- `status: string`
- `createdAt: string`
- `type: string`
- `targetTopic?: string`
- `targetSessionId?: string`
- `reviewedBy?: string`
- `reviewedAt?: string`
- `reviewNote?: string`

Current article comment types:
- `article-comment`
- legacy compatibility: `文章留言`

Status values:
- `pending`
- `approved`
- `rejected`

### `contacts`
Purpose:
- contact / anonymous submissions / external messages

Fields:
- `name: string`
- `category: string`
- `content: string`
- `attachmentUrl?: string`
- `status: string`
- `createdAt: string`

### `reviewLogs`
Purpose:
- audit trail for admin review actions

Fields:
- `targetType: string`
- `targetId: string`
- `action: string`
- `reviewerName: string`
- `note: string`
- `createdAt: string`

## 3. Route to collection mapping

### `/api/forum`
- reads: `articles`
- only returns approved articles
- no longer accepts public posting

### `/api/forum/[id]`
- reads: `articles`
- reads: `comments`

### `/api/submit-article`
- writes: `articles`
- writes new records with:
  - `category = 觀庭共構公開文章`
  - `targetTopic = 觀庭共構與專業評論`
  - `status = pending`
  - `source = workspace`

### `/api/comments`
- reads: `comments`
- writes: `comments`

### `/api/like`
- updates `likes` field on:
  - `articles`
  - `comments`

### `/api/trending`
- `type=articles`: reads approved articles
- `type=comments`: reads approved article comments
- `type=notes`: reads local JSON, not Firebase

### `/api/admin/review`
- reads pending `articles`
- reads pending `comments`
- writes review metadata to `articles` or `comments`
- writes audit records to `reviewLogs`

### `/api/admin/session`
- validates `ADMIN_REVIEW_TOKEN`
- sets or clears the admin review session cookie

### `/api/stats`
- session counts from local JSON
- article count from Firebase `articles`

## 4. Local JSON schema

### `data/sessions-index.json`
Fields:
- `id`
- `title`
- `date`
- `summary`
- `status`
- `phase?`
- `published?`
- `highlight?`

### `data/sessions/[id].json`
Structure:
- `metadata`
- `transcripts`

`metadata` fields:
- `id`
- `title`
- `date`
- `summary`
- `status`
- `source?`
- `tags?`

`transcripts` fields:
- `id`
- `lineId?`
- `type`
- `role`
- `speaker?`
- `action?`
- `content`

## 5. Compatibility notes

### Article comments
The provider currently accepts both:
- `article-comment`
- `文章留言`

This is temporary compatibility support for legacy seeded or transitional data.

### Likes
Likes are currently incremented directly on article/comment documents.
No separate `likes` collection is used at this time.

## 6. Moderation model

Current model:
- workspace article submission -> `pending`
- comment submission -> `pending`
- public visibility requires `approved`
- admin review actions can also set `rejected`

Current implemented tooling:
- `/admin/login`
- `/admin/review`
- `/api/admin/session`
- `/api/admin/review`

Current gap:
- a first moderation UI now exists
- secure owner / reviewer role enforcement is still future work

## 7. Seed data

Seed source:
- `firebase-schema-example.json`

Seed command:
```bash
npm run firebase:seed
```

This currently creates baseline example records in:
- `cms`
- `articles`
- `comments`
- `contacts`
> LEGACY / SUPERSEDED NOTICE
>
> 這份文件不能再被當作目前系統的主架構來源。
>
> 目前專案正式文案主線不是由 Firebase/CMS 承接。
> 若要理解現況，請先讀：
> - `00_唯一基準入口_先讀我_2026-04-04.md`
> - `CURRENT_SOURCE_OF_TRUTH_2026-04-04.md`
> - `docs/claude_handoff_2026-04-04/02_DATA_BACKEND_AND_RELATION_LOGIC.md`
