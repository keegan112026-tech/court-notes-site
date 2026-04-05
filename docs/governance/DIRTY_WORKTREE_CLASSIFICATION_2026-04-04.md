# DIRTY WORKTREE CLASSIFICATION - 2026-04-04

This file groups the current dirty worktree into three categories so we can
tell the difference between:

1. Formal website changes
2. Governance, docs, and workflow changes
3. Retired, isolated, archived, or ignorable items

## Baseline for this classification

Inputs used:

- `npm run gate:check`
- `git status --short`
- `git diff --name-only`
- `git ls-files --others --exclude-standard`

Current baseline result:

- production is healthy
- `main`, `origin/main`, and `feat/optimization-plan` are aligned
- worktree is still dirty
- dirty state now mixes real product work, governance work, and isolated legacy material

## Quick summary

| Group | Meaning | Commit guidance |
| --- | --- | --- |
| A | Formal website changes | Candidate for formal product commits |
| B | Governance, docs, tooling | Should be committed separately from product changes |
| C | Retired, isolated, archived, or ignorable | Must not be treated as current formal source |

## A. Formal website changes

These files belong to the active formal product line.

### A1. Formal pages and routes

- `app/page.tsx`
- `app/about/page.tsx`
- `app/contact/page.tsx`
- `app/forum/page.tsx`
- `app/forum/[id]/page.tsx`
- `app/guide/page.tsx`
- `app/knowledge/page.tsx`
- `app/rankings/page.tsx`
- `app/sessions/page.tsx`
- `app/sessions/[id]/page.tsx`
- `app/sessions/compose/page.tsx`
- `app/admin/articles/page.tsx`
- `app/admin/inbox/page.tsx`
- `app/admin/login/AdminLoginClient.tsx`
- `app/admin/login/page.tsx`
- `app/admin/review/page.tsx`
- `app/error.tsx`
- `app/not-found.tsx`
- `app/robots.ts`
- `app/sitemap.ts`

### A2. Formal API routes

- `app/api/comments/route.ts`
- `app/api/contact/route.ts`
- `app/api/forum/route.ts`
- `app/api/forum/[id]/route.ts`
- `app/api/like/route.ts`
- `app/api/sessions/route.ts`
- `app/api/stats/route.ts`
- `app/api/transcripts/[id]/route.ts`
- `app/api/trending/route.ts`
- `app/api/admin/articles/route.ts`
- `app/api/admin/inbox/route.ts`
- `app/api/admin/review/route.ts`
- `app/api/admin/session/route.ts`
- `app/api/submit-article/route.ts`

### A3. Formal shared components and UI

- `components/Navbar.tsx`
- `components/SubpageHeader.tsx`
- `components/SessionsOverviewSection.tsx`
- `components/InternalRouteBanner.tsx`
- `components/ui/accordion.tsx`
- `components/ui/resizable.tsx`
- `components/ui/sheet.tsx`
- `components/ui/skeleton.tsx`
- `components/ui/sonner.tsx`
- `components/ui/tooltip.tsx`

### A4. Formal data and runtime support

- `data/sessions-index.json`
- `data/sessions/s-114-1-6.json`
- `data/sessions/s-114-51-1211.json`
- `lib/notion.ts`
- `lib/rateLimiter.ts`
- `lib/admin-auth.ts`
- `lib/backend/provider.ts`
- `lib/backend/types.ts`
- `lib/content-security.ts`
- `lib/firebase-admin.ts`
- `lib/firebase-schema.ts`
- `lib/local-data.ts`
- `middleware.ts`
- `firestore.indexes.json`
- `firestore.rules`
- `firebase-schema-example.json`

### A5. Formal environment and site support

- `.env.example`
- `package.json`
- `package-lock.json`
- `next-sitemap.config.js`

### Guidance for A

- This is the main candidate set for product-facing commits.
- Do not mix this set with archive or outsourcing material.
- Validate formal routes after any changes.

## B. Governance, docs, and tooling

These files support safe maintenance but are not user-facing features.

### B1. Core governance files

- `00_唯一基準入口_先讀我_2026-04-04.md`
- `CURRENT_SOURCE_OF_TRUTH_2026-04-04.md`
- `CURRENT_BASELINE_2026-04-04.md`
- `WORK_PROTOCOL.md`
- `CURRENT_TASK_GATE.md`
- `GIT_MAINLINE_POLICY.md`
- `DEPLOYMENT_AND_RELEASE_POLICY.md`
- `DEPLOYMENT_LEDGER.md`
- `WORK_SESSION_GATE_2026-04-04.md`
- `REPO_CLEANUP_BASELINE_2026-04-04.md`
- `REPO_CLEANUP_FINAL_VERIFICATION_2026-04-04.md`
- `ROUTE_ISOLATION_STRATEGY_2026-04-04.md`

### B2. Active docs, audits, and specs

- `README.md`
- `MAINTENANCE_MANUAL.md`
- `CLAUDE_HANDOFF_START_HERE_2026-04-04.md`
- `CURRENT_ALIGNMENT_AUDIT.md`
- `PAGE_POLISH_STANDARD_2026-04-04.md`
- `SESSION_NOTE_ACCEPTANCE_WORKFLOW_2026-04-04.md`
- `SESSION_NOTE_INTEGRATION_SOP_2026-04-04.md`
- `SITE_SELF_AUDIT_2026-04-04.md`
- `MICRO_INTERACTION_APPLICATION_GUIDE_2026-04-04.md`
- `SYMBOLIC_ANIMATION_APPLICATION_NOTES_2026-04-04.md`
- `CONTENT_COPY_PROTECTION_RULES.md`
- `MECHANISM_POLICY.md`
- `NOTION_BACKEND_RECOMMENDATION_2026-04-02.md`
- `NOTION_DATABASE_BLUEPRINT.md`
- `NOTION_MANUAL_SETUP_STEPS_2026-04-02.md`
- `EDITORIAL_CONTROL_CONSOLE_SPEC_2026-04-03.md`
- `MULTI_SESSION_WORKSPACE_AND_SUBMISSION_SPEC_2026-04-02.md`
- `SECURITY_AND_ABUSE_PREVENTION_PLAN.md`
- `CANONICAL_PAGE_BASELINES_2026-04-02.md`
- `PROJECT_MILESTONE_2026-04-02_CITATION_HOVER.md`
- `PAGE_LAYOUT_AND_COPY_WORKBOOK_2026-04-03.md`
- `RESIDUAL_STRING_AND_PATH_AUDIT_2026-04-03.md`

### B3. Handoff directories

- `docs/claude_handoff_2026-04-04/**`

### B4. Governance and UTF-8 tooling

- `scripts/bootstrap-utf8.ps1`
- `scripts/open-utf8-shell.ps1`
- `scripts/dev-stable.ps1`
- `scripts/run-current-task-gate.ps1`
- `scripts/seed-firestore.mjs`
- `tsconfig.json`
- `.gitignore`

### Guidance for B

- Keep this as a separate governance/tooling commit batch.
- Do not bundle this with large product UI changes unless necessary.

## C. Retired, isolated, archived, or ignorable

These items are not current formal source-of-truth material.

### C1. Retired formal files that should stay retired

- `app/ClientApp.tsx`
- `app/api/cms/route.ts`
- `app/prerequisites/page.tsx`
- `app/rules/page.tsx`
- `components/AboutView.tsx`
- `components/Footer.tsx`
- `components/HomeView.tsx`
- `components/SectionBanner.tsx`
- `components/SessionsListView.tsx`
- `components/TranscriptView.tsx`
- `lib/mockData.ts`

### C2. Old locations removed after route-group isolation

- `app/beautification-demo/page.tsx`
- `app/demo/page.tsx`
- `app/demo2/page.tsx`
- `app/demo3/page.tsx`
- `app/demo4/page.tsx`

### C3. Isolated non-formal routes that still exist

- `app/(preview)/**`
- `app/(prototype)/**`
- `app/(demo)/**`
- `app/(archive)/**`

### C4. Archive, snapshot, and outsourcing material

- `old_prototype_archive/**`
- `version_snapshots/**`
- `outsourcing_packages/**`
- `docs/archive/**`
- `docs/legacy_archived_docs_2026-04-04/**`
- root legacy handoff / old architecture / old snapshot files
- Chinese-named backup folders created during prior iterations

### C5. Noise already removed or ignorable

- `error.log`
- `out.log`
- root fetch/debug HTML/log/curl output

### Guidance for C

- Do not use this group as current formal source.
- Some of it should remain archived.
- Some of it should remain deleted.
- None of it should be mixed into formal product commit batches by default.

## Suggested future commit batching

### Batch 1: Formal product changes

Commit only Group A.

### Batch 2: Governance and tooling

Commit only Group B.

### Batch 3: Isolation / archive / retirement housekeeping

Commit only the subset of Group C that should be tracked as structural cleanup.

## Final takeaway

The dirty worktree is not a random pile of garbage.

It is a mixture of:

- formal product work
- governance and workflow work
- isolation, archive, and retirement work

The key is not pretending the worktree is clean.
The key is knowing what each dirty path actually means.
