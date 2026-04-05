# Project Handoff Architecture

> Superseded notice (2026-04-04)
>
> 這份文件屬較早期 handoff。
> 新接手者請改讀：
> `docs/claude_handoff_2026-04-04/00_START_HERE.md`
>
> 本文件不可再直接視為現行唯一真相。

Updated: 2026-03-31

## 1. Project position

This project is no longer structured as:
- dynamic Notion-driven court pages
- an independent free-posting forum

It is now structured as:
- a preserved homepage with established visual design
- a core workspace product for session-based writing
- a public article layer for approved workspace submissions
- a Firebase-backed interaction layer

## 2. Canonical product logic

### 2.1 Homepage `/`
- Homepage stays visually important and is not being collapsed into a minimal landing page.
- Existing narrative-facing structure is intentionally retained.
- Homepage copy, navigation labels, stats, and trending blocks were cleaned to match the new workspace/public-article logic.

### 2.2 Session list `/sessions`
- Lists available sessions from local JSON.
- Serves as the entry point into the writing workspace.

### 2.3 Session workspace `/sessions/[id]`
- Core production surface of the site.
- Left side: session transcript / hearing notes.
- Right side: collaborative article editor.
- Clicking a transcript line inserts a citation into the editor.
- Citations now support:
  - hover preview cards
  - click-to-jump back to the cited line
  - temporary line highlight in the transcript panel
- Submissions go through `/api/submit-article`.
- Submitted articles are stored as pending review in Firebase.

### 2.4 Public article hub `/forum`
- This is no longer a classic discussion forum.
- It is the publication layer for approved workspace articles.
- Articles come from session workspace submissions only.
- Public interaction still exists:
  - article likes
  - article comments

### 2.5 Public article detail `/forum/[id]`
- Renders approved article HTML.
- Preserves citation traceability with hover preview cards.
- Allows article comments and likes.

### 2.6 Rankings `/rankings`
- Reads from public approved articles.
- Intended to reflect public article popularity, not old forum category logic.

### 2.7 Admin review `/admin/review`
- Internal review surface for pending articles and pending comments.
- Supports:
  - approve
  - reject
  - delete
- Session now resolves the current admin identity from a configured token account.
- Supports owner / reviewer role distinction.
- Delete is restricted to `owner`.
- Stores review metadata and optional review note.

## 3. Current data architecture

### 3.1 Local cold data
Source of truth for:
- sessions index
- per-session transcript content

Files:
- `data/sessions-index.json`
- `data/sessions/*.json`
- `lib/local-data.ts`

These power:
- `/sessions`
- `/sessions/[id]`
- `/api/sessions`
- `/api/transcripts/[id]`

### 3.2 Firebase hot data
Source of truth for:
- public articles
- comments
- likes
- contact submissions

Files:
- `lib/firebase-admin.ts`
- `lib/backend/provider.ts`
- `.env.local`

Routes already using Firebase provider:
- `/api/comments`
- `/api/contact`
- `/api/forum`
- `/api/forum/[id]`
- `/api/like`
- `/api/stats`
- `/api/submit-article`
- `/api/trending`

## 4. Backend provider strategy

The project now uses a provider abstraction:
- Notion provider
- Firebase provider

Selection:
- `BACKEND_PROVIDER=firebase` forces Firebase
- `BACKEND_PROVIDER=notion` forces legacy Notion
- `auto` uses Firebase if env is configured

Current active backend:
- Firebase

Important implementation note:
- Firestore queries were adjusted to avoid blocking dev on composite indexes.
- Some lists are fetched and sorted in application code for now.

## 5. What is complete

### 5.1 Firebase migration foundation
- Firebase Admin credentials connected
- Firestore seed script created
- Initial example data seeded successfully
- Forum article APIs now read from Firebase

### 5.2 Workspace experience
- Session workspace UI is functioning
- Citation insertion is functioning
- Citation hover preview in workspace is functioning
- Citation click-to-scroll in workspace is functioning
- Article submission API is functioning

### 5.3 Public article layer
- Public article list page is functioning
- Public article detail page is functioning
- Citation hover preview in article detail is functioning
- Article comments and likes are routed through Firebase-compatible APIs

### 5.4 Rankings and homepage data
- Rankings page reads public article popularity data
- Stats route reads local sessions + Firebase articles
- Trending article route is Firebase-backed

### 5.5 Copy-source alignment
- Homepage formal copy is no longer sourced from `/api/cms`.
- Official copy is now treated as frontend-owned content supplied by the user.
- Legacy CMS copy control should be treated as deprecated.
### 5.6 Admin review foundation
- `/admin/review` page exists
- `/api/admin/review` exists
- Pending article and pending comment review actions exist
- Review actions write review metadata and a `reviewLogs` record
- `/api/admin/session` now resolves named admin accounts and roles
- token-backed sessions now distinguish `owner` vs `reviewer`

### 5.7 Build status
- `npm run build` passes successfully as of 2026-03-31
- `npm run dev:stable` starts local development reliably

## 6. Important remaining follow-up

### 6.1 Shared/UI cleanup
- Main homepage, contact, about, guide, knowledge, navbar, session list, and local session index labels are now aligned.
- Remaining cleanup is mostly limited to older demo pages, legacy components, or archive/fallback code not used in the main user path.

### 6.2 Firebase indexes
- Current implementation avoids hard dependency on composite indexes for small-scale dev.
- If data volume grows, Firestore composite indexes should be created and query paths can be optimized again.

### 6.3 Admin authentication
- Token-backed admin login now exists and supports owner / reviewer roles.
- Current gap is that this is still a shared-token model, not full identity-provider auth.
- Future work should add:
  - stronger account-based authentication
  - multi-admin lifecycle management
  - more granular moderation permissions if needed

### 6.4 Legacy Notion code
- Legacy Notion code still exists as fallback and archive logic.
- It is no longer the intended primary path.
- Future cleanup can remove more of `lib/notion.ts` once Firebase workflows are fully trusted.

### 6.5 Content seeding
- Current Firestore content is seed/demo baseline data.
- Real article review flow and moderation operations still need actual operational data entry.

## 7. Operational commands

### Local development
```bash
npm run dev:stable
```

### Production build
```bash
npm run build
```

### Firestore seed
```bash
npm run firebase:seed
```

## 8. Recommended next implementation priorities

1. Add security hardening and abuse prevention for comments, submissions, and likes.
2. Move from shared-token admin access to stronger account-based authentication.
3. Normalize existing Firestore data values so old and new comment type labels no longer need compatibility handling.
4. Replace remaining visible legacy/garbled labels outside the main user path.
5. Decide whether to keep Notion fallback indefinitely or fully retire it.
> LEGACY / SUPERSEDED NOTICE
>
> 這份 handoff 文件屬於舊版本交接資料。
>
> 不可直接用來判斷現行正式站或本機正式主線。
> 請改讀：
> - `00_唯一基準入口_先讀我_2026-04-04.md`
> - `CURRENT_SOURCE_OF_TRUTH_2026-04-04.md`
> - `CURRENT_BASELINE_2026-04-04.md`
> - `docs/claude_handoff_2026-04-04/00_START_HERE.md`
