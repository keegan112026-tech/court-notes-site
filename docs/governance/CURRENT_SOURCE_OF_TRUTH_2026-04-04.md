# CURRENT SOURCE OF TRUTH - 2026-04-04

這份文件定義版本衝突時，應該先相信什麼。

## 1. Production truth

正式站：

- `https://court-notes-site.vercel.app/`

production 用來回答：

- 使用者現在真的看到什麼
- 某個 bug 是否仍在 live site 上可見
- 某條正式路由是否可開

目前 repo 內最新記錄的 deployment 是：

- `dpl_EUKSjuYdMg1wat3konSH8H4taCAf`

但如果下一位 AI 看到更晚的 deployment，應以最新 alias 實測為準。

## 2. Code truth

程式碼真相順序：

1. `main`
2. `origin/main` 在明確同步檢查後
3. 當前工作樹，但前提是已先釐清 dirty 範圍

不要把 dirty worktree 直接當成單一可信版本。

## 3. Governance truth

治理文件負責說明流程與風險，但不能覆蓋 production truth 或 code truth。

優先看的治理檔：

- `docs/governance/00_唯一基準入口_先讀我_2026-04-04.md`
- `docs/governance/CURRENT_SOURCE_OF_TRUTH_2026-04-04.md`
- `docs/governance/CURRENT_BASELINE_2026-04-04.md`
- `docs/governance/DEPLOYMENT_LEDGER.md`
- `docs/governance/AI_HANDOFF_2026-04-05_CURRENT_STATE.md`

## 4. Snapshot truth

如果某段頁面曾被使用者明確接受，而且後續可能被大改，應同時參考 `version_snapshots/`。

目前有效的 snapshot 包括：

- `version_snapshots/2026-04-05_homepage_guide_shelf_snapshot/`
- `version_snapshots/2026-04-05_sessions_status_snapshot/`
- `version_snapshots/2026-04-05_notion_submit_safety_snapshot/`
- `version_snapshots/2026-04-05_aggregation_handoff_snapshot/`
- `version_snapshots/2026-04-05_admin_console_and_forum_sync_snapshot/`
- `version_snapshots/2026-04-05_submission_feedback_and_triage_snapshot/`

## 5. Formal product surface

目前正式 IA 包括：

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

目前 admin surface 包括：

- `/admin/login`
- `/admin/review`
- `/admin/articles`
- `/admin/comments`
- `/admin/inbox`

## 6. Non-formal surface

以下不算正式 IA：

- preview
- prototype
- demo
- archive
- history

即使它們仍可開，也只能當輔助參考。

## 7. 最後規則

當版本衝突時，判斷順序是：

1. production truth
2. code truth
3. governance truth
4. snapshot truth
5. non-formal references
