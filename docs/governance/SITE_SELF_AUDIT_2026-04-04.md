# SITE SELF AUDIT — 2026-04-04

## Scope
- Home `/`
- About `/about`
- Guide `/guide`
- Knowledge `/knowledge`
- Sessions `/sessions`
- Cross-session workspace `/sessions/compose`
- Forum `/forum`
- Contact `/contact`
- Rankings `/rankings`
- Admin routes

## Pages checked
- `/`
- `/about`
- `/guide`
- `/knowledge`
- `/sessions`
- `/sessions/compose`
- `/forum`
- `/contact`
- `/rankings`
- `/admin/login`
- `/admin/review`
- `/admin/articles`
- `/admin/inbox`
- `/about-preview`
- `/guide-prototype`
- `/project-intention-prototype`

## Route status
- All checked routes returned `200` during audit.

## Fixed during this audit
1. Home no longer depends on `/api/cms`.
   - Homepage data now only relies on current active sources:
     - `/api/sessions`
     - `/api/stats`
     - `/api/trending`
   - This removes a hidden failure path from the retired CMS endpoint.

2. Home secondary published-note card no longer hardcodes `sessions[1]`.
   - Secondary card now follows the current active carousel item and shows the next available published note.
   - This prevents duplicate primary/secondary cards when the active carousel item changes.

## Cleanliness check
- No remaining official-page references to:
  - `人工排序`
  - `新增可閱覽還原筆記`
- No official-page references from the main audited pages to:
  - `preview`
  - `prototype`
  - `history`
  - `demo`

## Residual risks
1. Prototype/demo/history pages remain publicly reachable by URL.
   - They are not currently linked from the audited official pages.
   - If production hardening is needed later, these routes should be gated, removed from deployment, or clearly marked as internal.

2. Home and subpages intentionally use different top navigation systems.
   - Home uses its own landing-page navbar.
   - Subpages use `SubpageHeader`.
   - This is acceptable if intentional, but should remain a conscious design choice.

## Current verdict
- Main site routes are operational.
- Homepage/session alignment improved.
- No new blocking consistency issues found in the audited official pages after the homepage fixes.
