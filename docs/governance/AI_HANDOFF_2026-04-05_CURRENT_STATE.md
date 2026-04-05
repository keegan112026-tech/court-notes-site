# AI Handoff - Current State - 2026-04-05

This file is the current operational handoff for the next AI.

## Read this after the governance entry files

Recommended order:

1. `00_唯一基準入口_先讀我_2026-04-04.md`
2. `CURRENT_SOURCE_OF_TRUTH_2026-04-04.md`
3. `CURRENT_BASELINE_2026-04-04.md`
4. `WORK_PROTOCOL.md`
5. `CURRENT_TASK_GATE.md`
6. `AI_HANDOFF_2026-04-05_CURRENT_STATE.md`

## Production status

Latest production deployment:

- `dpl_4uK72XekvYpoz6ELUBnAnJBePMcg`

Production alias:

- `https://court-notes-site.vercel.app/`

Verified healthy public routes:

- `/`
- `/guide`
- `/sessions`
- `/forum`

## Production blocker

Human submission testing is still blocked in production.

Current production API state:

- `POST /api/submit-article` -> `500`
- `POST /api/contact` -> `500`

Current error:

- `Notion API 401: API token is invalid`

Interpretation:

- the current production blocker is no longer missing DB ids
- the current production blocker is the production `NOTION_TOKEN` value
- do not rebuild the databases before fixing this token issue

## Local verification already completed

The following has already been verified locally:

- local article submission API can write into Notion
- Chinese title, author, and content round-trip correctly
- article submission payload shape is aligned between the front end and the API

Implication:

- this is not a full front-end/back-end field mismatch
- the remaining hard blocker for human testing is production auth to Notion

## Code changes already in place

Key backend files already updated:

- `lib/notion.ts`
- `app/api/submit-article/route.ts`
- `app/api/contact/route.ts`
- `app/api/forum/route.ts`
- `app/api/forum/[id]/route.ts`

Key publication-system docs already created:

- `AGGREGATION_ZONE_PUBLISHING_TECH_DECISION_V0_1_2026-04-05.md`
- `AGGREGATION_ZONE_DATA_MODEL_AND_LINKAGE_SPEC_V0_1_2026-04-05.md`

Published snapshot groundwork already exists:

- `data/published-articles/`
- `lib/published-articles/`
- `scripts/export-published-articles.mjs`
- `scripts/export-published-articles-from-notion.mjs`
- `scripts/validate-published-articles.mjs`

## Current recommended next step

Do this first:

1. repair the production `NOTION_TOKEN` value
2. redeploy production
3. re-test:
   - article submission
   - contact / inbox submission
4. only after that run human mobile testing

Do not do this yet:

- do not rebuild all Notion databases
- do not change publication IA again before the token issue is resolved
- do not assume the current dirty worktree is safe to commit as one batch

## Local runtime state

At handoff time:

- local Next dev servers were intentionally stopped
- local prototype Vite servers were intentionally stopped
- Playwright background processes were intentionally stopped

If the next AI needs local preview again, it must start fresh and not assume old ports are still live.

## Dirty worktree warning

The worktree remains dirty and broad.

Treat the current repo as:

- operationally usable
- document-backed
- not commit-clean

Do not attempt a broad cleanup before the next scoped task is defined.

## Snapshot reference

Latest handoff snapshot folder:

- `version_snapshots/2026-04-05_aggregation_handoff_snapshot/`

This snapshot should be used together with:

- `version_snapshots/2026-04-05_homepage_guide_shelf_snapshot/`
- `version_snapshots/2026-04-05_sessions_status_snapshot/`
- `version_snapshots/2026-04-05_notion_submit_safety_snapshot/`
