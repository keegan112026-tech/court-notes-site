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
- 目前 `HEAD`：`028a19c894af72eed675c5b45112d260c96510db`
- 工作樹：**仍然是 dirty**

這不是零星髒檔，而是累積了：

- 首頁、規範頁、匯集區、聯絡頁、排行頁、工作檯的產品改動
- admin console 與 forum publication flow 的改動
- governance / snapshot / archive 調整
- 已公開文章 snapshot 與 Notion 相關腳本調整

不要把現在的工作樹誤認成「只差一個 commit」；它是可營運、可交接，但不是 commit-clean。

## 最新 production 狀態

正式站網址：

- `https://court-notes-site.vercel.app/`

本輪重新檢查後，以下正式主路由都回 `200`：

- `/`
- `/guide`
- `/sessions`
- `/forum`
- `/contact`
- `/rankings`

這次檢查是 2026-04-05 在正式站直接用 `curl` 重測完成的。

## 最新 recorded deployment

repo 內目前最新記錄的 production deployment 仍是：

- `dpl_EUKSjuYdMg1wat3konSH8H4taCAf`

這個 deployment 的語意是：

- 文章送出成功後有 toast 與清空
- 留言送出後不再假裝先公開
- admin comments / inbox 已補第一版狀態管理
- 匯集區文章卡先做過一輪 hover 風險止血

但要注意：

- **目前本地還有一大批未部署的改動**
- 所以 production truth 和 local code truth 已經再次分開

## 已完成且目前可用的營運主鏈

### 1. 前台送件

- 文章投稿：可送
- 聯絡／私密傳訊：可送
- 留言：可送，且會走待審核語意

### 2. 後台分流

目前後台已拆成：

- `待審核`：`/admin/review`
- `文章管理`：`/admin/articles`
- `留言管理`：`/admin/comments`
- `收件匣`：`/admin/inbox`

### 3. 匯集區發佈鏈

目前 production 行為是：

- 匯集區先讀「後端已核准文章」
- 不再被舊 snapshot 完全卡死

這條鏈現在適合真人測試，但還不是最終的長期架構。

## 已建立但尚未完全落地的長期架構

這兩份技術文件已存在：

- `docs/governance/AGGREGATION_ZONE_PUBLISHING_TECH_DECISION_V0_1_2026-04-05.md`
- `docs/governance/AGGREGATION_ZONE_DATA_MODEL_AND_LINKAGE_SPEC_V0_1_2026-04-05.md`

方向已鎖定為：

- 後端審核池
- 前端 published snapshot
- 長期目標是 `ready_to_publish -> publish export -> deploy`

但目前 production 還是在「後端已核准文章直接可見」的過渡模式。

## 目前最重要的未完成項

### A. 全站文案清理仍未完成

已完成重寫的主線檔案：

- `lib/public-site.tsx` 曾經重寫過，但目前檔案內容再次出現大量亂碼，需要重新確認
- `app/forum/page.tsx` 已做過一次重寫，但目前檔案後半仍有亂碼殘留

仍需優先清理的主線檔案：

- `app/page.tsx`
- `app/guide/page.tsx`
- `app/contact/page.tsx`
- `app/rankings/page.tsx`
- `app/sessions/compose/page.tsx`
- `app/sessions/[id]/page.tsx`
- `app/api/contact/route.ts`
- `app/api/submit-article/route.ts`
- `components/SubpageHeader.tsx`
- `lib/public-site.tsx`
- `app/forum/page.tsx`

目前判斷：

- 這不是單點亂碼，而是整批 user-facing copy 還有殘留污染
- 下一位 AI 應該把「全站 copy cleanup」列為獨立主線，而不是邊修功能邊順手改文案

### B. 單篇文章頁引用預覽剛做完重構，但還沒上 production 驗證

本地已完成：

- 拿掉 `mousemove` 連續重算
- 改成較輕的委派式 hover 預覽
- 放寬單篇文章頁寬度到較合理的寬版

檔案：

- `app/forum/[id]/page.tsx`

本地驗證：

- `npm run build` 通過

但：

- 這一版**尚未部署**
- production 上目前還不是這個版本

### C. 工作檯頁首統一化已做，但也還未部署

已新增：

- `components/workbench/WorkbenchHeader.tsx`

已改：

- `app/sessions/[id]/page.tsx`
- `app/sessions/compose/page.tsx`

目標：

- 單場工作檯與跨場工作檯都有一致的頁首結構
- 引用來源顯示正式場次名稱，不再露出 `s-114-...`

這一版同樣是本地完成、尚未部署。

## 本地已完成的驗證紀錄

在這輪交接前，本地已跑過：

- `npx tsc --noEmit --incremental false`：通過
- `npm run gate:encoding`：通過
- `npm run articles:validate`：通過
- `npm run build`：通過
- `npm run smoke:public:prod`：通過

補充：

- `npm run lint` 仍有 warning，但主因偏向 demo / preview / 舊字型噪音，不是眼前產品阻塞

## 目前快照資料夾

這些快照仍是有效交接素材：

- `version_snapshots/2026-04-05_homepage_guide_shelf_snapshot/`
- `version_snapshots/2026-04-05_sessions_status_snapshot/`
- `version_snapshots/2026-04-05_notion_submit_safety_snapshot/`
- `version_snapshots/2026-04-05_aggregation_handoff_snapshot/`
- `version_snapshots/2026-04-05_admin_console_and_forum_sync_snapshot/`
- `version_snapshots/2026-04-05_submission_feedback_and_triage_snapshot/`

## 下一位 AI 最適合先做的事

請不要先做大規模新功能。先做這個順序：

1. 重新核對目前 dirty worktree 的真實修改範圍
2. 先把 user-facing copy 亂碼清理完
3. 再決定是否部署：
   - 單篇文章頁 hover 預覽重構
   - 單篇文章頁寬版
   - 工作檯頁首統一化
4. 最後才回到匯集區長期發佈架構

## 中文工作簡稱

之後與使用者溝通時，建議沿用這組中文簡稱：

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

## 最後一句

現在的 repo 不是壞掉，而是：

- production 可用
- 本地持續前進
- 但本地尚未完成一次乾淨收斂

下一位 AI 如果先把 copy cleanup 和 deployment boundary 釐清，後面會順很多。
