# CURRENT SOURCE OF TRUTH - 2026-04-04

這份文件定義版本衝突時，應該先相信什麼。

## 1. Production truth

正式站：

- `https://court-notes-site.vercel.app`

production 用來回答：

- 使用者現在真的看到什麼
- 某個 bug 是否仍在 live site 上可見
- 某條正式路由是否可開

### 最新直接實測時間

- `2026-04-12`

### 2026-04-12 production alias recheck

- `/` `200`
- `/about` `200`
- `/guide` `200`
- `/knowledge` `200`
- `/sessions` `200`
- `/forum` `200`
- `/contact` `200`
- `/rankings` `200`

內容層面的最新 production truth：

- 首頁已有 `鳴謝與資料來源` 導覽與 `#sources-acknowledgements`
- 規範頁仍為 `平台限制與規範`
- 筆記總覽頁有案件抬頭摘要
- 匯集區目前已顯示新版 `本計畫資料來源與鳴謝` 櫥窗

所以：

- 如果首頁與匯集區發生衝突，請按**各自路由的 production 實測結果**回答
- 不要把某一路由的更新狀態外推到全站

## 2. Code truth

程式碼真相順序：

1. `main`
2. `origin/main` 在明確同步檢查後
3. 當前工作樹，但前提是已先釐清 dirty 範圍

截至 2026-04-14 重新核對：

- branch：`main`
- `HEAD`：`b4fb22624f285cc4cd3140cc32c1ff8fafd4937d`

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

- `/admin`
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

## 7. 最後規則

當版本衝突時，判斷順序是：

1. production truth（逐路由、逐時間）
2. code truth
3. governance truth
4. snapshot truth
5. non-formal references
