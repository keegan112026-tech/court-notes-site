# Current Alignment Audit

Updated: 2026-03-31

## Completed alignment

### Product structure
- Homepage remains the narrative-facing public entry.
- `/sessions/[id]` is the core workspace.
- `/forum` is the approved public article layer.
- `/rankings` reflects public article popularity instead of old forum taxonomy.

### Backend
- Firebase is now the active backend provider.
- Firestore seed has been run successfully.
- CMS, articles, comments, likes, and contacts are routed through Firebase-compatible APIs.

### Workspace
- Transcript data comes from local JSON.
- Clicking transcript lines inserts citations into the editor.
- Workspace citations support hover preview and jump-to-line.
- Workspace article submission stores pending articles in Firebase.

### Public article layer
- Public article list is working.
- Public article detail is working.
- Citation hover preview is working in article detail.
- Article comments and likes are working through the new API flow.

### Moderation layer
- `/admin/review` exists as the first review console.
- `/api/admin/review` exists and can review pending articles/comments.
- Review actions now store `reviewedBy`, `reviewedAt`, `reviewNote`, and `reviewLogs`.
- `/admin` and `/api/admin` are now guarded by an admin token session flow.
- Current session model supports named admin accounts and `owner` / `reviewer` roles.
- Delete actions are restricted to `owner`.

### Validation
- `npm run firebase:seed` passed.
- `npm run build` passed.
- Local homepage, workspace, public article list, and public article detail all returned `200` during verification.

## Remaining cleanup

### Main editorial cleanup
- Homepage, contact, about, guide, knowledge, navbar, session list, and session index data have been rewritten into the current product language.
- Remaining copy cleanup is mainly in demo pages, archive material, and some legacy/fallback implementation files.

### Moderation tooling
- A first moderation UI now exists.
- What still remains is a stronger identity/role model beyond token-based access.

### Security and abuse prevention
- Core moderation flow now exists, and first-step route-specific rate limits are now in place for:
  - comments
  - article submissions
  - likes
  - contact submissions
- Production-grade hardening is still pending.
- Next security work should focus on:
  - stronger admin auth and roles
  - Firestore security rules review
  - anti-spam / anti-bot controls for comments, submissions, and likes
  - logging and abuse response paths

### Legacy Notion footprint
- Legacy Notion code remains in the repo for fallback/history.
- It is no longer the intended primary data path.

## Current canonical sources

- Architecture: `PROJECT_HANDOFF_ARCHITECTURE_2026-03-31.md`
- Data schema: `FIREBASE_DATA_SCHEMA_2026-03-31.md`
- Entry file for future AI: `AI_START_HERE.md`
