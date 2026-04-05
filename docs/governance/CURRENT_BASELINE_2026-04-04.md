# CURRENT BASELINE - 2026-04-04

這份文件記錄目前團隊應該採信的基準狀態。

## Production baseline

正式站網址：

- `https://court-notes-site.vercel.app/`

目前 repo 內最新記錄的 production deployment：

- 日期：`2026-04-05`
- deployment id：`dpl_EUKSjuYdMg1wat3konSH8H4taCAf`
- source branch：`main`
- source commit：`028a19c894af72eed675c5b45112d260c96510db`

2026-04-05 再次重查時，以下正式主路由都正常回 `200`：

- `/`
- `/guide`
- `/sessions`
- `/forum`
- `/contact`
- `/rankings`

## 已核定的頁面快照

首頁相關：

- `version_snapshots/2026-04-05_homepage_guide_shelf_snapshot/`
- `version_snapshots/2026-04-05_homepage_modular_snapshot/`

筆記總覽頁相關：

- `version_snapshots/2026-04-05_sessions_status_snapshot/`

Notion / 投稿鏈安全節點：

- `version_snapshots/2026-04-05_notion_submit_safety_snapshot/`

匯集區 / admin / 發佈鏈節點：

- `version_snapshots/2026-04-05_aggregation_handoff_snapshot/`
- `version_snapshots/2026-04-05_admin_console_and_forum_sync_snapshot/`
- `version_snapshots/2026-04-05_submission_feedback_and_triage_snapshot/`

## 目前已在 production 上可用的能力

- 文章投稿可送出
- 聯絡 / 私密傳訊可送出
- 後台登入可用
- 待審核 / 文章管理 / 留言管理 / 收件匣這四個 admin 路由可用
- 匯集區會優先顯示後端已核准文章

## 目前尚未納入 production 的本地成果

以下成果目前是本地已完成，但不應被誤認成 production 已上線：

- 單篇文章頁 hover 引用預覽的輕量重構
- 單篇文章頁進一步放寬的寬版閱讀布局
- 工作檯頁首統一化與 `WorkbenchHeader`
- 大規模 copy cleanup 的前半段

## Git baseline

截至目前：

- current branch：`main`
- `HEAD`：`028a19c894af72eed675c5b45112d260c96510db`

但要注意：

- 這不代表工作樹乾淨
- 本地仍有大量未提交修改
- 因此 production truth 和 local code truth 目前是分開看的

## Worktree baseline

工作樹仍是 dirty，而且範圍廣。

它包含：

- 產品頁面改動
- admin / forum publication flow 改動
- Notion 與 published-articles 調整
- governance / snapshot / archive 整理

這代表：

- repo 是可營運、可交接的
- 但不是可直接一鍵收斂成單一 commit 的狀態

## 目前最重要的基準提醒

1. production 現在是可用的，但不是本地最新全部改動
2. 下一位 AI 接手時，要先判斷哪些修改是 local-only
3. copy cleanup 應該列為下一輪主線之一
4. 在下一次部署前，應再次跑：
   - `npx tsc --noEmit --incremental false`
   - `npm run gate:encoding`
   - `npm run build`
   - `npm run smoke:public:prod`
