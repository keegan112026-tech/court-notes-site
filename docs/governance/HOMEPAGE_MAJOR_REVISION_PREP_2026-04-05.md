# HOMEPAGE MAJOR REVISION PREP - 2026-04-05

Purpose:

- lock the homepage baseline before a larger redesign pass
- separate already-finished work from still-open work
- keep edits inside a safe scope while the worktree remains dirty

## Gate and baseline

- branch:
  - `feat/optimization-plan`
- `HEAD`:
  - `97180e220fd16d6efb85d6f550b396f6ae84f309`
- `main`:
  - `97180e220fd16d6efb85d6f550b396f6ae84f309`
- gate:
  - `npm run gate:check`
  - verdict: `PROCEED WITH SCOPE LOCK`
- type check:
  - `cmd /c npx tsc --noEmit --incremental false`
  - passed

## Production baseline

Verified on 2026-04-05:

- `https://court-notes-site.vercel.app/` -> `200`
- `https://court-notes-site.vercel.app/about` -> `200`
- `https://court-notes-site.vercel.app/sessions` -> `200`
- `https://court-notes-site.vercel.app/forum` -> `200`

Homepage markers currently present on production:

- site name present
- `計畫緣起` entry present
- `還原筆記` entry present
- `本站須知` content present
- `熱門排行` entry present

## Scope lock

This prep file inherits:

- `CURRENT_SCOPE_LOCK_HOMEPAGE_2026-04-05.md`

Allowed files for the homepage round:

- `app/page.tsx`
- `app/layout.tsx`
- `components/SubpageHeader.tsx`
- `components/Navbar.tsx`
- `lib/public-site.tsx`
- consistency-only fallback pages if needed:
  - `app/not-found.tsx`
  - `app/error.tsx`

Do not touch in this round:

- session detail and workspace flows
- session data files
- forum content flows
- APIs
- scripts and tooling
- preview / prototype / demo / archive areas

## Current homepage structure

Main homepage file:

- `app/page.tsx`

Current high-level composition:

1. beta banner
2. inline homepage navbar
3. hero block
4. embedded `SessionsOverviewSection`
5. trending-entry section
6. contact-and-support section
7. inline footer

Relevant anchors in `app/page.tsx`:

- line 220:
  - `計畫緣起 →`
- line 250:
  - `SessionsOverviewSection embedded`
- line 253:
  - trending banner
- line 407:
  - contact-and-support banner

## Shared public shell dependencies

Shared public copy and nav source:

- `lib/public-site.tsx`

Confirmed from current file content:

- `SITE_NAME` = `觀庭還原筆記共構平台`
- `SITE_TAGLINE` = `SOCIAL WORK COURT NOTES`
- `SITE_TITLE_SUFFIX` = `社工觀庭與公開共構平台`
- `BETA_NOTICE` exists

Public shared consumers:

- `components/SubpageHeader.tsx`
- `app/layout.tsx`
- `app/page.tsx`

## Re-reviewed task status

Already handled enough to remove from the active homepage queue:

- trending notes fake heat issue
- local-data manual registration issue

Partially handled and not the focus of this round:

- `/sessions/[id]` mobile mode
  - already has a mobile switcher
  - still may need later refinement

Still valid as the main current task:

- homepage and public-navigation consistency finish

## Risks for the next edit round

1. `app/page.tsx` still contains a large amount of inline homepage shell logic.
2. Public shell logic is partially centralized, but homepage still behaves like its own shell.
3. The worktree is still dirty, so accidental scope creep is the main risk.
4. Homepage visual polish and public navigation polish must stay separated from session-detail work.

## Recommended edit order

1. `lib/public-site.tsx`
   - confirm copy, labels, and shared nav wording
2. `components/SubpageHeader.tsx`
   - align with shared public copy and nav intent
3. `app/layout.tsx`
   - align metadata and site identity if needed
4. `app/page.tsx`
   - major homepage revision after shared layer is stable

## Validation checklist for the upcoming homepage round

Before deploy or preview sign-off, re-check:

- `npm run gate:check`
- `cmd /c npx tsc --noEmit --incremental false`
- homepage local render
- homepage production markers after deploy
- `/about`, `/sessions`, `/forum` still return `200`
- nav labels remain consistent between homepage and subpages

## Success condition

This homepage round is successful if:

- homepage visual structure is improved
- public navigation is more coherent
- shared public copy stays centralized
- no unrelated systems are modified
