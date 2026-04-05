# CURRENT SOURCE OF TRUTH - 2026-04-04

This file defines the priority order for deciding what is true when versions
conflict.

## 1. Display truth

Production URL:

- `https://court-notes-site.vercel.app/`

Latest recorded production deployment:

- `dpl_4uK72XekvYpoz6ELUBnAnJBePMcg` on `2026-04-05`

Use production to answer:

- What users currently see
- Whether a bug is currently visible in the live site
- Whether a route is reachable in production

Production is the truth of what is deployed, not the full truth of local code.

## 2. Code truth

The formal code truth is:

1. `main`
2. `origin/main`
3. the current working branch only after it has been compared against `main`

Do not assume a local branch is truth unless the gate confirms its baseline.

## 3. Governance truth

These files define the active operating rules:

- `00_唯一基準入口_先讀我_2026-04-04.md`
- `CURRENT_SOURCE_OF_TRUTH_2026-04-04.md`
- `CURRENT_BASELINE_2026-04-04.md`
- `WORK_PROTOCOL.md`
- `CURRENT_TASK_GATE.md`
- `GIT_MAINLINE_POLICY.md`
- `DEPLOYMENT_AND_RELEASE_POLICY.md`
- `DEPLOYMENT_LEDGER.md`

Governance docs summarize process and risk. They do not replace code truth.

Deployment truth must also be checked against `DEPLOYMENT_LEDGER.md`.

If a deployment was triggered from a dirty worktree, the deployment ledger note
overrides any assumption that commit truth and deployed truth are identical.

If a homepage or major page surface is explicitly approved before further
iteration, also preserve its local snapshot under `version_snapshots/` and
record the snapshot folder in `CURRENT_BASELINE_2026-04-04.md`.

This already applies to:

- `version_snapshots/2026-04-05_homepage_guide_shelf_snapshot/`
- `version_snapshots/2026-04-05_sessions_status_snapshot/`
- `version_snapshots/2026-04-05_notion_submit_safety_snapshot/`
- `version_snapshots/2026-04-05_aggregation_handoff_snapshot/`

## 4. Formal product surface

Formal routes currently include:

- `/`
- `/about`
- `/guide`
- `/knowledge`
- `/sessions`
- `/sessions/[id]`
- `/sessions/compose`
- `/forum`
- `/forum/[id]`
- `/contact`
- `/rankings`

Core shared formal components include:

- `components/SubpageHeader.tsx`
- `components/SessionsOverviewSection.tsx`
- `components/Navbar.tsx`

## 5. Non-formal surface

The following are not part of formal IA:

- preview
- prototype
- demo
- archive
- history

They are intentionally isolated under:

- `app/(preview)/...`
- `app/(prototype)/...`
- `app/(demo)/...`
- `app/(archive)/...`

## 6. Final rule

When versions conflict, decide in this order:

1. production truth
2. code truth
3. governance truth
4. non-formal references only as supporting material
