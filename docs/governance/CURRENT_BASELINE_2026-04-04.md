# CURRENT BASELINE - 2026-04-04

這份文件記錄目前團隊應該採信的基準狀態。

## Production baseline

正式站網址：

- `https://court-notes-site.vercel.app`

### 2026-04-14 live recheck

已直接驗證：

- `/` -> `200`
- `/about` -> `200`
- `/guide` -> `200`
- `/knowledge` -> `200`
- `/sessions` -> `200`
- `/forum` -> `200`
- `/contact` -> `200`
- `/rankings` -> `200`

### 2026-04-14 live content recheck

- 首頁已有 `鳴謝與資料來源` 導覽：是
- 首頁已有 `#sources-acknowledgements` anchor：是
- 匯集區 production 已顯示新版 `本計畫資料來源與鳴謝` 櫥窗
- `s-114-51-1211` production 已顯示修正版文字 `懸壅垂`
- `s-114-51-1218` production 已上線，標題為 `114年度訴字第51號過失致死等案（審理程序第三次開庭）`
- `s-114-51-1218` production API 已確認有 `476` 筆 transcript
- `/sessions` 與 `/sessions/history/v1~v3` 的 `一審宣判預告` 文案已統一去除 `下午`
- 最新 production deployment：`dpl_CbwG7e36VspLhVFSYKruvMGqWSoU`

## Admin baseline

- `/admin/login` -> `200`
- `/admin/review` -> `307`
- `/admin/articles` -> `307`
- `/admin/comments` -> `307`
- `/admin/inbox` -> `307`

## Git baseline

截至 2026-04-14 重新核對：

- current branch：`main`
- `HEAD`：`b4fb22624f285cc4cd3140cc32c1ff8fafd4937d`

## Worktree baseline

工作樹目前仍然是 dirty。可見範圍：

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

## 目前最重要的基準提醒

1. production 應以**逐路由實測**為準
2. 首頁與匯集區目前都已經 live 顯示新版資料來源導覽／櫥窗語氣
3. `s-114-51-1211` 目前 live 已是修正版逐字內容
4. admin 頁面仍採登入保護，未登入時 `/admin/review`、`/admin/articles`、`/admin/comments`、`/admin/inbox` 會導向登入
5. dirty worktree 仍存在，部署或交接前要先釐清範圍
