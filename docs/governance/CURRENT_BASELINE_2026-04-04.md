# CURRENT BASELINE - 2026-04-04

This file records the active baseline that the team should assume until a newer
baseline replaces it.

## Production baseline

Production URL:

- `https://court-notes-site.vercel.app/`

Latest recorded production deployment:

- date: `2026-04-05`
- deployment id: `dpl_4uK72XekvYpoz6ELUBnAnJBePMcg`
- source branch: `feat/optimization-plan`
- source baseline commit: `97180e220fd16d6efb85d6f550b396f6ae84f309`

Confirmed healthy routes:

- `/`
- `/about`
- `/guide`
- `/sessions`
- `/forum`

Homepage layout note:

- the approved homepage upper layout baseline is preserved at `version_snapshots/2026-04-05_homepage_guide_shelf_snapshot/`

Sessions layout note:

- the approved sessions width-alignment and status-card baseline is preserved at `version_snapshots/2026-04-05_sessions_status_snapshot/`

Notion submit safety note:

- the production-safe article submission baseline is preserved at `version_snapshots/2026-04-05_notion_submit_safety_snapshot/`
- local article submission to Notion has been verified working, including Chinese title, author, and content round-trip
- after deployment `dpl_4uK72XekvYpoz6ELUBnAnJBePMcg`, production `POST /api/submit-article` and `POST /api/contact` both fail with `Notion API 401: API token is invalid`
- this is the current handoff checkpoint: production page surfaces are healthy, but human submission testing is blocked until the production `NOTION_TOKEN` value is corrected

Aggregation and handoff note:

- the current aggregation-zone technical checkpoint is preserved at `version_snapshots/2026-04-05_aggregation_handoff_snapshot/`

## Git baseline

As of 2026-04-04:

- current working branch: `feat/optimization-plan`
- `HEAD`: `97180e220fd16d6efb85d6f550b396f6ae84f309`
- `main`: `97180e220fd16d6efb85d6f550b396f6ae84f309`
- `origin/main`: `97180e220fd16d6efb85d6f550b396f6ae84f309`

Interpretation:

- production baseline is aligned with `main`
- current working branch is aligned with `main`
- this does not mean the worktree is clean
- the 2026-04-05 production deployments were triggered from a dirty worktree, so the deployments are operationally valid but must not be treated as a perfect commit-to-production mapping

## Worktree baseline

The worktree is dirty.

This means:

- there are many real product changes not yet committed
- there are governance and tooling changes not yet committed
- there are retired or isolated files still showing in git status

Dirty does not mean random. It means changes must be grouped before commit.

## Route baseline

Formal:

- `/`
- `/about`
- `/guide`
- `/knowledge`
- `/sessions`
- `/sessions/[id]`
- `/sessions/compose`
- `/forum`
- `/contact`
- `/rankings`

Non-formal but still reachable:

- `/about-preview`
- `/guide-prototype`
- `/project-intention-prototype`
- `/sessions/history/*`
- `/beautification-demo`
- `/demo*`

Those routes are isolated in route groups and must not be treated as formal IA.

## Current operational rule

Before any edit:

1. open UTF-8 shell
2. run gate
3. confirm touched-file scope
4. avoid accidental edits outside the declared scope

Before any future deployment:

1. run gate
2. verify local build
3. verify production target routes after deployment
4. record deployment id, alias URL, branch, and commit in `DEPLOYMENT_LEDGER.md`

## Local runtime note

As of the latest handoff checkpoint:

- local dev servers have been intentionally stopped
- do not assume `localhost:3001` or `localhost:3002` is still serving the approved UI
- restart local servers only when the next AI is ready to continue work
