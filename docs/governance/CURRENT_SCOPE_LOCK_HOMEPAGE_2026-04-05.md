# CURRENT SCOPE LOCK - HOMEPAGE ROUND - 2026-04-05

This file defines the exact scope lock for the next active round of work.

Purpose:

- reduce risk from the dirty worktree
- allow focused work on homepage and public navigation polish
- prevent accidental edits in unrelated systems

This file is intentionally narrower than the full dirty-worktree classification.

## Outcome status

Homepage upper section status as of `2026-04-05`:

- approved for continued work as the current homepage baseline
- preserved at `version_snapshots/2026-04-05_homepage_guide_shelf_snapshot/`
- deployed to production in Vercel deployment `dpl_AYpzJZQ83gXJUjXoziqFW3jahccH`
- local preview baseline verified at `http://localhost:3002/`

## Session intent

Active intent for this round:

- polish the homepage
- tighten public navigation consistency
- keep the touched-file scope small and explicit

This is **not** a repo-wide cleanup round.

## Baseline

- production display truth:
  - `https://court-notes-site.vercel.app/`
  - `https://court-notes-site.vercel.app/about`
  - `https://court-notes-site.vercel.app/sessions`
  - `https://court-notes-site.vercel.app/forum`
- branch:
  - `feat/optimization-plan`
- `HEAD`, `main`, and `origin/main`:
  - `97180e220fd16d6efb85d6f550b396f6ae84f309`
- gate verdict:
  - proceed with scope lock

## This round may touch

Only these files are in active edit scope unless a new scope lock is created.

### Primary homepage files

- `app/page.tsx`
- `app/layout.tsx`

### Public navigation and public-shell support

- `components/SubpageHeader.tsx`
- `components/Navbar.tsx`
- `lib/public-site.tsx`

### Consistency-only public fallbacks

These may be touched only if required for public shell or public brand consistency:

- `app/not-found.tsx`
- `app/error.tsx`

## This round must not touch

These areas are explicitly out of scope for the homepage round.

### Session detail and workspace flows

- `app/sessions/[id]/page.tsx`
- `app/sessions/compose/**`
- `app/api/submit-article/**`
- `lib/local-data.ts`
- `data/sessions/**`
- `data/sessions-index.json`

### Sessions overview and timeline work

- `app/sessions/page.tsx`
- `components/SessionsOverviewSection.tsx`

### Forum content and article detail flows

- `app/forum/page.tsx`
- `app/forum/[id]/page.tsx`
- `app/api/forum/**`
- `app/api/comments/**`
- `app/api/like/**`

### Stats, trending, and API/data trust fixes

- `app/api/stats/**`
- `app/api/trending/**`
- `app/api/sessions/**`
- `app/api/transcripts/**`
- `lib/notion.ts`
- `lib/rateLimiter.ts`

### Governance, tooling, encoding, and deploy system

- `scripts/**`
- `CURRENT_SOURCE_OF_TRUTH_2026-04-04.md`
- `CURRENT_BASELINE_2026-04-04.md`
- `CURRENT_TASK_GATE.md`
- `WORK_PROTOCOL.md`
- `DEPLOYMENT_LEDGER.md`
- `.editorconfig`
- `.gitattributes`
- `package.json`
- `package-lock.json`
- `tsconfig.json`
- `next-sitemap.config.js`

### Non-formal routes and archives

- `app/(preview)/**`
- `app/(prototype)/**`
- `app/(demo)/**`
- `app/(archive)/**`
- `old_prototype_archive/**`
- `version_snapshots/**`
- `outsourcing_packages/**`
- `docs/**`

## Later / separate follow-up tracks

These are real tasks, but they belong to separate future rounds.

### Track A: data trust

- remove fake popularity numbers from trending displays if any remain
- tighten stats and source-of-truth consistency

### Track B: session detail mobile UX

- redesign `app/sessions/[id]/page.tsx` for mobile content flow
- reduce full-screen lock behavior
- replace poor horizontal behavior on small screens

### Track C: session data pipeline

- continue moving from manual local-data registration to automated generation
- keep session ingest and map verification stable

### Track D: commit batching and dirty-worktree reduction

- separate formal product changes
- separate governance/tooling changes
- separate archive/isolation changes

## Practical rule for this round

If a requested change requires editing something outside the "may touch" list,
stop and create a new scope lock instead of silently expanding scope.

## Quick reminder

This round is successful if:

- homepage is improved
- public navigation is more consistent
- no unrelated systems are modified
- the dirty worktree becomes easier to reason about, not harder
