# AI Handoff - Current State - 2026-04-05

這份文件是目前給下一位 AI 的主交接文件。先讀這份，再決定下一輪要收哪一條主線。

## 建議閱讀順序

1. `docs/governance/00_唯一基準入口_先讀我_2026-04-04.md`
2. `docs/governance/CURRENT_SOURCE_OF_TRUTH_2026-04-04.md`
3. `docs/governance/CURRENT_BASELINE_2026-04-04.md`
4. `docs/governance/DEPLOYMENT_LEDGER.md`
5. `docs/governance/AI_HANDOFF_2026-04-05_CURRENT_STATE.md`
6. `docs/governance/COPY_AUDIT_AND_REMAINING_TEXT_2026-04-05.md`

## 目前 repo 狀態

- 目前分支：`main`
- 目前 `HEAD`：`b4fb22624f285cc4cd3140cc32c1ff8fafd4937d`
- 工作樹：**仍然是 dirty**

目前最明確的 dirty 範圍：

- `M .gitignore`
- `M AGGREGATION_ZONE_PUBLISHING_TECH_DECISION_V0_1_2026-04-05.md`
- `M app/admin/articles/page.tsx`
- `M app/admin/login/page.tsx`
- `M app/admin/review/page.tsx`
- `M app/api/forum/[id]/route.ts`
- `M app/api/forum/route.ts`
- `M app/forum/[id]/page.tsx`
- `M app/forum/page.tsx`
- `M components/admin/AdminConsoleNav.tsx`
- `M data/published-articles/README.md`
- `D data/published-articles/art-1775147932504.json`
- `M data/published-articles/index.json`
- `M data/sessions/s-114-1-6.json`
- `M data/sessions/s-114-51-1211.json`
- `M docs/governance/AI_HANDOFF_2026-04-05_CURRENT_STATE.md`
- `M docs/governance/CURRENT_BASELINE_2026-04-04.md`
- `M docs/governance/CURRENT_SOURCE_OF_TRUTH_2026-04-04.md`
- `M docs/governance/DEPLOYMENT_LEDGER.md`
- `M docs/governance/WORK_PROTOCOL.md`
- ... 另有 30 項未列出

## 最新 production 狀態（2026-04-14 live recheck）

正式站網址：

- `https://court-notes-site.vercel.app`

已直接驗證：

- `/` `200`
- `/about` `200`
- `/guide` `200`
- `/knowledge` `200`
- `/sessions` `200`
- `/sessions/s-114-51-1218` `200`
- `/forum` `200`
- `/contact` `200`
- `/rankings` `200`

### 這次最重要的新發現

- 首頁已有 `鳴謝與資料來源` 導覽與 `#sources-acknowledgements`
- 匯集區目前已經對外顯示新版 `本計畫資料來源與鳴謝` 櫥窗
- `s-114-51-1211` live 版本已含 `懸壅垂` 修正
- `s-114-51-1218` 已由 `2025-12-18 還原筆錄.docx` 匯入並上線
- `/api/transcripts/s-114-51-1218` live 已確認回傳 `476` 筆 transcript
- admin routes 仍為登入保護頁面，未登入時不是 bug
- 最新 recorded production deployment：`dpl_7TtNGVoSHHeC5DNBQAxJavJhDMg9`

## 與克勞德摘要的落差提醒

- 本 repo 的 `main` 目前**沒有**克勞德摘要中提到的：
  - `app/admin/corrections/page.tsx`
  - `app/api/admin/session-patch/route.ts`
  - `app/api/admin/session-patch/log/route.ts`
  - `components/workbench/*` 八元件拆分（目前只有 `WorkbenchHeader.tsx`）
- 目前 `app/sessions/[id]/page.tsx` 仍是單檔大型頁面，尚未合入摘要裡描述的元件拆解版本。
- 因此後續若要延續「內容更正 / session patch / 場次頁公版化」這條線，請以**摘要是待合併設計方向**來理解，不要誤以為它已經存在於目前 mainline。

## 最新 recorded deployment

請先查看：

- `docs/governance/DEPLOYMENT_LEDGER.md`

如果本次只是 live recheck，而非新 deploy，請不要把它誤記成新部署。

## 本地已確認的 code truth

- 首頁共享導覽與頁尾資料來源櫥窗已存在於本地 code
- 匯集區頁尾資料來源櫥窗已存在於本地 code，且目前 live 已可觀察
- admin 營運控台、發布流程、env 健康檢查、session patch 流程都已有腳本與治理文件

## 目前最重要的未完成項

### A. dirty worktree 仍需持續收斂

- 現在專案已可用，但不代表 worktree 已乾淨
- 下一位 AI 若要部署，請先判斷 dirty 範圍是否應一起帶上

### B. 匯集區長期發佈架構已落地第一版，但仍需營運驗證

- 目前已有：
  - `articles:publish:prepare`
  - `articles:publish:finalize`
  - `release:prod`
- 但仍需真實營運驗證 publish / unpublish / dirty sync 邏輯

### C. 治理更新已可工具化，但仍需養成固定使用習慣

- 每次重大 recheck 或部署後，請跑治理更新腳本
- 不要再只手動改一份 handoff

## admin surface

- `/admin/login` -> `200`
- `/admin/review` -> `307`
- `/admin/articles` -> `307`
- `/admin/comments` -> `307`
- `/admin/inbox` -> `307`

## 中文工作簡稱

- 首頁
- 緣起頁
- 規範頁
- 知識頁
- 筆記總覽頁
- 單場筆記頁
- 跨場工作檯
- 匯集區
- 單篇文章頁
- 排行頁
- 聯絡頁
- 首頁主敘事
- 首頁右櫥窗
- 首頁規範櫥窗
- 筆記總覽抬頭區
- 庭期區
- 匯集區前導
