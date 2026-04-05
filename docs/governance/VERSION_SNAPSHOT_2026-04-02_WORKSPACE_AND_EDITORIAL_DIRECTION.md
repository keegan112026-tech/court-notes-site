# Version Snapshot: 2026-04-02

This snapshot exists to prevent future regressions and architecture confusion.

## Locked Product Decisions

1. Citation hover and jump are now a confirmed core feature.
   - In `sessions/[id]`, citations inserted into the editor must:
     - render as real citation nodes, not raw HTML text
     - show source transcript text on hover
     - jump back to the left transcript panel on click
   - This behavior is considered non-regressible.

2. Homepage preference must be preserved.
   - The user explicitly wants the preferred Project Origin / plan-origin section design kept.
   - Do not redesign or remove that homepage narrative block unless the user explicitly asks again.

3. Public articles are not a free-form forum.
   - `/forum` is the approved public article layer for workspace submissions.
   - Approved articles may come from:
     - a single-session workspace
     - a new cross-session workspace

4. Cross-session writing is now part of the canonical roadmap.
   - `sessions/compose` is the new shared workspace scaffold.
   - It exists so authors can switch between multiple transcript sessions on the left and write one integrated article on the right.

5. Submission payloads must support expanded editorial metadata.
   - Required editorial concepts:
     - primary session id
     - source session ids
     - title
     - content
   - Optional:
     - contact email
   - Contact email must never be displayed publicly.

## Current Implementation State

- Single-session workspace citation hover/jump is working and user-confirmed.
- Cross-session workspace scaffold exists at `app/sessions/compose/page.tsx`.
- Submission API supports:
  - `contactEmail`
  - `sourceSessionIds`
- Public article list and article detail pages now surface source session metadata.
- Admin review page now surfaces:
  - contact email
  - source session ids

## Recommended Backend Direction

The recommended editorial direction is now:

- local JSON for sessions/transcripts
- Notion as the editorial moderation backend
- optional automation layer later (`n8n`, webhook transforms, caching, static regeneration)

Firebase remains supported in the repository, but it is no longer the preferred long-term editorial direction.

## Manual Follow-Up Still Expected

The user will likely need to do manual Notion setup later:

- create/update Notion databases and properties
- connect integration credentials
- set environment variables

Those steps are documented separately in:

- `NOTION_BACKEND_RECOMMENDATION_2026-04-02.md`
- `NOTION_MANUAL_SETUP_STEPS_2026-04-02.md`
- `MULTI_SESSION_WORKSPACE_AND_SUBMISSION_SPEC_2026-04-02.md`
