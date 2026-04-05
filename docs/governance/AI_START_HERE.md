# AI Start Here

## Superseded Notice

This file is no longer the best primary entry for new handoff.

If you are a new AI or collaborator taking over this repository, read:

- `docs/claude_handoff_2026-04-04/00_START_HERE.md`

first.

The rest of this file is preserved as historical context only.

---

Read these files first, in this order:

1. `CONTENT_COPY_PROTECTION_RULES.md`
   - Hard rule: only the user defines official copy, naming, and wording
   - Architecture refactors must not rewrite user copy without explicit approval
2. `CANONICAL_PAGE_BASELINES_2026-04-02.md`
   - Approved canonical page sources
   - Current page-level baselines that must be preserved
3. `VERSION_SNAPSHOT_2026-04-02_WORKSPACE_AND_EDITORIAL_DIRECTION.md`
   - Current locked product decisions
   - Homepage preservation note
   - Cross-session workspace direction
   - Backend direction snapshot
4. `PROJECT_MILESTONE_2026-04-02_CITATION_HOVER.md`
   - Locks in the citation hover/jump milestone
   - Marks the workspace citation system as non-regressible
5. `MULTI_SESSION_WORKSPACE_AND_SUBMISSION_SPEC_2026-04-02.md`
   - Cross-session workspace direction
   - Submission field expansion
   - Citation/source-session rules
6. `NOTION_BACKEND_RECOMMENDATION_2026-04-02.md`
   - Why Notion should be the editorial backend
   - Recommended mixed architecture
7. `NOTION_MANUAL_SETUP_STEPS_2026-04-02.md`
   - Manual Notion setup required from the user
8. `NOTION_DATABASE_BLUEPRINT.md`
   - Full inventory of backend-connected inputs
   - Recommended Notion database structure
   - Which data should stay local vs go to Notion
9. `EDITORIAL_CONTROL_CONSOLE_SPEC_2026-04-03.md`
   - Next-stage in-site control console plan
   - Notion moderation flow
   - Publish flow and role design
10. `MECHANISM_POLICY.md`
   - Current input limits
   - Submission, comments, likes, private message rules
   - Ranking and anti-abuse policy
11. `PROJECT_HANDOFF_ARCHITECTURE_2026-03-31.md`
   - Current product logic
   - Current page architecture
   - What is finished
   - What still needs follow-up
12. `FIREBASE_DATA_SCHEMA_2026-03-31.md`
   - Firestore collections
   - Field definitions
   - Route-to-collection mapping
13. `CURRENT_ALIGNMENT_AUDIT.md`
   - Remaining cleanup and risk notes
14. `SECURITY_AND_ABUSE_PREVENTION_PLAN.md`
   - Upcoming hardening and anti-abuse phase
15. `RESIDUAL_STRING_AND_PATH_AUDIT_2026-04-03.md`
   - Confirms legacy CMS path removal
   - Confirms current active cleanup status
16. `PAGE_LAYOUT_AND_COPY_WORKBOOK_2026-04-03.md`
   - Page-by-page layout workbook
   - Copy placement and jump/relation workbook
   - User-editable document for directing future implementation
17. `PAGE_POLISH_STANDARD_2026-04-04.md`
   - Current site-grade UI polish baseline
   - Shared subpage shell, section rhythm, dual-card pattern
   - Approved standard for future page upgrades
18. `README.md`
   - Dev commands and local environment usage

Current canonical direction:
- Official copy, naming, and wording belong to the user only.
- Do not rewrite user copy unless the user explicitly authorizes a wording change.
- Prefer canonical approved pages over historical drafts when restoring content.
- Homepage UI and especially the preferred Project Origin / About section should be preserved unless the user explicitly asks to redesign it.
- UI improvements should converge toward the current site-grade polish baseline rather than becoming one-off page work.
- `sessions/[id]` is the core workspace for writing.
- `sessions/compose` is the new cross-session workspace scaffold.
- `/forum` is no longer a free-form forum; it is the public article layer for approved workspace submissions.
- `/admin/review` is the first internal moderation console for pending articles and comments.
- The repo currently still supports Firebase, but the next recommended editorial direction is Notion as the main moderation/backend layer.
- Local JSON remains the source of truth for sessions and transcripts.

Do not assume old Notion-first planning is current.
Archived legacy planning lives under `docs/archive/`.
> LEGACY / SUPERSEDED NOTICE
>
> 這份文件不再是目前專案的唯一真相來源。
>
> 請先改讀：
> - `00_唯一基準入口_先讀我_2026-04-04.md`
> - `CURRENT_SOURCE_OF_TRUTH_2026-04-04.md`
> - `CURRENT_BASELINE_2026-04-04.md`
> - `docs/claude_handoff_2026-04-04/00_START_HERE.md`
>
> 這份文件只能作為歷史參考，不可直接用來判斷現行版本。
