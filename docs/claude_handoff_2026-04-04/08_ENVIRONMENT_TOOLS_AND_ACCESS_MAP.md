# Environment, Tools, and Access Map

最後更新：2026-04-04

這份文件整理目前專案已安裝與正在使用的環境、工具、啟動方式、路徑、網站網址、GitHub / Vercel / Notion 相關入口。

注意：

- 本文件**不包含實際 token / secret 值**
- 本文件只記錄：
  - 路徑
  - 啟動方法
  - 服務入口
  - 哪些地方需要授權
  - 哪些值應填在哪裡

## 1. 專案主路徑

專案根目錄：

- `C:\Users\User\OneDrive\Desktop\社工共構觀庭筆記平台`

目前 Claude handoff 入口：

- `C:\Users\User\OneDrive\Desktop\社工共構觀庭筆記平台\CLAUDE_HANDOFF_START_HERE_2026-04-04.md`
- `C:\Users\User\OneDrive\Desktop\社工共構觀庭筆記平台\docs\claude_handoff_2026-04-04`

## 2. 本機開發啟動方式

### Node / Next.js 專案

主要 script 定義於：

- `C:\Users\User\OneDrive\Desktop\社工共構觀庭筆記平台\package.json`

主要啟動指令：

- `npm run dev`
- `npm run dev:stable`
- `npm run build`
- `npm run start`
- `npx tsc --noEmit`

### scripts 位置

- `C:\Users\User\OneDrive\Desktop\社工共構觀庭筆記平台\scripts\dev-stable.ps1`
- `C:\Users\User\OneDrive\Desktop\社工共構觀庭筆記平台\scripts\seed-firestore.mjs`
- `C:\Users\User\OneDrive\Desktop\社工共構觀庭筆記平台\scripts\seed_guidelines.js`
- `C:\Users\User\OneDrive\Desktop\社工共構觀庭筆記平台\scripts\seed_guidelines.mjs`

## 3. 正式與本機網址

### 本機

- 首頁：`http://localhost:3000`
- 計畫緣起：`http://localhost:3000/about`
- 計畫緣起預覽：`http://localhost:3000/about-preview`
- 平台使用說明與規範：`http://localhost:3000/guide`
- 先備知識：`http://localhost:3000/knowledge`
- 還原筆記總覽：`http://localhost:3000/sessions`
- 單場次還原筆記（例）：`http://localhost:3000/sessions/s-114-51-1211`
- 跨場次工作檯：`http://localhost:3000/sessions/compose`
- 公開文章：`http://localhost:3000/forum`
- 聯絡與回報：`http://localhost:3000/contact`
- 排行榜：`http://localhost:3000/rankings`

### 正式公開站

- `https://court-notes-site.vercel.app`

注意：

- 正式公開站是 Vercel production。
- `localhost` 是本機開發版本，不會自動同步到正式站。

## 4. GitHub

Git remote：

- `https://github.com/keegan112026-tech/court-notes-site.git`

用途：

- 原始碼倉庫
- Vercel 部署來源

## 5. Vercel

本機綁定檔：

- `C:\Users\User\OneDrive\Desktop\社工共構觀庭筆記平台\.vercel\project.json`

目前記錄：

- `projectName`: `court-notes-site`
- `projectId`: `prj_cNimnwTR7TBrlv6r0Iv6xcA2bq8b`
- `orgId`: `team_efhl6E6rM5QfoIk7uaUQSkrY`

Vercel 正式站網址：

- `https://court-notes-site.vercel.app`

注意：

- Preview 部署可能受保護。
- Production 正式站可公開。

## 6. Notion

### 使用角色

Notion 目前承接：

- 文章投稿
- 公開文章
- 留言
- Inbox / 聯絡 / 私密傳訊
- 審查記錄

### Notion 相關設定位置

環境變數模板：

- `C:\Users\User\OneDrive\Desktop\社工共構觀庭筆記平台\.env.example`

本機實際填寫位置：

- `C:\Users\User\OneDrive\Desktop\社工共構觀庭筆記平台\.env.local`

需要填入但本文件不公開的欄位：

- `NOTION_TOKEN`
- `NOTION_DB_ARTICLES`
- `NOTION_DB_COMMENTS`
- `NOTION_DB_INBOX`
- `NOTION_DB_MODERATION_LOG`

### Notion 後台入口

整合後台：

- [Notion Integrations](https://www.notion.so/profile/integrations)

一般 Notion workspace 入口：

- [Notion](https://www.notion.so/)

### 需要授權的地方

- Notion integration 必須被 share 到以下資料庫：
  - `Articles_DB`
  - `Comments_DB`
  - `Inbox_DB`
  - `Moderation_Log_DB`

## 7. 環境變數與授權位置

### 環境變數檔案

- 模板：`C:\Users\User\OneDrive\Desktop\社工共構觀庭筆記平台\.env.example`
- 本機：`C:\Users\User\OneDrive\Desktop\社工共構觀庭筆記平台\.env.local`

### `.env.example` 目前包含的主欄位

- `BACKEND_PROVIDER`
- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY`
- `FIREBASE_DATABASE_ID`
- `ADMIN_REVIEW_TOKEN`
- `ADMIN_OWNER_NAME`
- `ADMIN_REVIEW_ACCOUNTS_JSON`
- `NOTION_TOKEN`
- `NOTION_DB_ARTICLES`
- `NOTION_DB_COMMENTS`
- `NOTION_DB_INBOX`
- `NOTION_DB_MODERATION_LOG`

### 授權與敏感資料原則

- token / private key 不寫入一般 handoff 文件
- 若要交接敏感資料，應另外建立本機限定私密文件，不放進可外發套件

## 8. 主要技術棧

來自 `package.json` 的現行核心依賴：

- `next`
- `react`
- `react-dom`
- `typescript`
- `tailwindcss`
- `framer-motion`
- `lucide-react`
- `@notionhq/client`
- `firebase-admin`
- `@tiptap/react`
- `@tiptap/starter-kit`
- `react-resizable-panels`
- `@radix-ui/react-accordion`
- `@radix-ui/react-dialog`
- `@radix-ui/react-tooltip`
- `class-variance-authority`
- `clsx`
- `tailwind-merge`

## 9. 已採用的 UI / 互動方向

### 已採用

- `shadcn/ui` 局部導入
  - 目前已有：
    - `components/ui/accordion.tsx`
    - `components/ui/tooltip.tsx`
    - `components/ui/resizable.tsx`

### 只作參考，不直接導入整包

- `nextjs-notion-starter-kit`

### 明確不主動推進

除非使用者再次主動要求，否則不要主動規劃：

- `novel`
- `yjs`

## 10. 本地資料路徑

還原筆記主資料：

- `C:\Users\User\OneDrive\Desktop\社工共構觀庭筆記平台\data\sessions`
- `C:\Users\User\OneDrive\Desktop\社工共構觀庭筆記平台\data\transcripts`
- `C:\Users\User\OneDrive\Desktop\社工共構觀庭筆記平台\data\sessions-index.json`

目前已知已接入的場次資料範例：

- `C:\Users\User\OneDrive\Desktop\社工共構觀庭筆記平台\data\sessions\s-114-1-6.json`
- `C:\Users\User\OneDrive\Desktop\社工共構觀庭筆記平台\data\sessions\s-114-51-1211.json`

## 11. 外包資料包位置

### 舊工作包（已被交互資料污染）

- `C:\Users\User\OneDrive\Desktop\社工共構觀庭筆記平台\outsourcing_packages\還原筆記單頁外包工作包_2026-04-04`

### 新乾淨模板包（之後應優先使用）

- `C:\Users\User\OneDrive\Desktop\社工共構觀庭筆記平台\outsourcing_packages\還原筆記單頁外包模板包_clean_2026-04-04`

## 12. 版本快照與備份

版本快照：

- `C:\Users\User\OneDrive\Desktop\社工共構觀庭筆記平台\version_snapshots\2026-04-04_pre-overhaul`

舊版計畫緣起 / guide prototype 備份：

- `C:\Users\User\OneDrive\Desktop\社工共構觀庭筆記平台\版本備份_guide-prototype與計畫緣起_2026-04-03`

## 13. Claude / AI 接手建議流程

1. 先讀：
   - `C:\Users\User\OneDrive\Desktop\社工共構觀庭筆記平台\CLAUDE_HANDOFF_START_HERE_2026-04-04.md`
2. 再讀：
   - `C:\Users\User\OneDrive\Desktop\社工共構觀庭筆記平台\docs\claude_handoff_2026-04-04`
3. 不要直接把舊 Firebase / 舊 handoff 文件當主線
4. 若需本機執行：
   - 先確認 `.env.local`
   - 再跑 `npm run dev`

