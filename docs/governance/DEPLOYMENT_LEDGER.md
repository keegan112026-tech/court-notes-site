# DEPLOYMENT LEDGER

## Current known deployment history

| Date | Branch | Commit | Environment | Checked routes | Notes |
| --- | --- | --- | --- | --- | --- |
| 2026-04-04 | `feat/optimization-plan` | `97180e220fd16d6efb85d6f550b396f6ae84f309` | production observed | `/`, `/about`, `/sessions`, `/forum` | Production was healthy; exact deployment id was not recorded at that checkpoint. |
| 2026-04-05 | `feat/optimization-plan` | `97180e220fd16d6efb85d6f550b396f6ae84f309` | production deployed | `/`, `/about`, `/sessions`, `/forum` | Deployed via `dpl_8o3p9EQJKACUrFxAoHtdi1oJiUHj`. Deployment came from a dirty local worktree. |
| 2026-04-05 | `feat/optimization-plan` | `97180e220fd16d6efb85d6f550b396f6ae84f309` | production deployed | `/`, `/guide`, `/sessions`, `/forum` | Deployed via `dpl_AYpzJZQ83gXJUjXoziqFW3jahccH`. Homepage upper guide-shelf layout was snapshotted at `version_snapshots/2026-04-05_homepage_guide_shelf_snapshot/`. |
| 2026-04-05 | `feat/optimization-plan` | `97180e220fd16d6efb85d6f550b396f6ae84f309` | production deployed | `/`, `/guide`, `/sessions`, `/forum` | Deployed via `dpl_EmB5W4YdjAFPBuTTT4H75STJuQcg`. Sessions width-alignment and status-card repair were snapshotted at `version_snapshots/2026-04-05_sessions_status_snapshot/`. |
| 2026-04-05 | `feat/optimization-plan` | `97180e220fd16d6efb85d6f550b396f6ae84f309` | production deployed | `/api/submit-article`, `/`, `/sessions`, `/forum` | Deployed via `dpl_BzwdJFjS2qBdX89JFDakk8pERB8b`. This reduced the production Notion blocker from “all Notion DB vars” to the article DB path. Snapshot: `version_snapshots/2026-04-05_notion_submit_safety_snapshot/`. |
| 2026-04-05 | `feat/optimization-plan` | `97180e220fd16d6efb85d6f550b396f6ae84f309` | production deployed | `/`, `/guide`, `/sessions`, `/forum`, `/api/submit-article`, `/api/contact` | Deployed via `dpl_4uK72XekvYpoz6ELUBnAnJBePMcg`. At that checkpoint, public routes returned `200` but submission APIs still surfaced the production Notion token problem. Snapshot: `version_snapshots/2026-04-05_aggregation_handoff_snapshot/`. |
| 2026-04-05 | `main` | `028a19c894af72eed675c5b45112d260c96510db` | production deployed | `/`, `/guide`, `/sessions`, `/forum`, `/admin/review`, `/admin/articles`, `/admin/comments`, `/admin/inbox`, `/api/forum`, `/api/submit-article`, `/api/contact` | Deployed via `dpl_XzzBoLdrURM77hJrbdKMA9gnAMfg`. Admin console split was live and forum moved to backend-published-first behavior. Snapshot: `version_snapshots/2026-04-05_admin_console_and_forum_sync_snapshot/`. |
| 2026-04-05 | `main` | `028a19c894af72eed675c5b45112d260c96510db` | production deployed | `/`, `/sessions`, `/forum`, `/forum/[id]`, `/admin/comments`, `/admin/inbox` | Deployed via `dpl_EUKSjuYdMg1wat3konSH8H4taCAf`. Added submission success feedback, removed fake optimistic comment rendering, widened article reading layout, and added basic `已閱 / 已處理` triage controls. Snapshot: `version_snapshots/2026-04-05_submission_feedback_and_triage_snapshot/`. |

## Post-deploy recheck

After the last recorded deployment, production was rechecked again on 2026-04-05 and these routes all returned `200`:

- `/`
- `/guide`
- `/sessions`
- `/forum`
- `/contact`
- `/rankings`

No newer deployment id was recorded in-repo during that recheck.

## Rule

Add a new row after any meaningful deployment or release verification event.
