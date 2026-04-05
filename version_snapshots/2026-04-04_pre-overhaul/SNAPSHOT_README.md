# 2026-04-04 Pre-Overhaul Snapshot

這份快照是為了在進行下一階段大改前，保留目前可運作版本的回溯基準。

## 快照目的

- 保留目前頁面與互動狀態
- 保留目前 Notion 後端串接狀態
- 保留目前主要工作文件與需求書
- 之後若大改方向不理想，可回到這個版本重新整合

## 目前快照重點

- 首頁已進入收攏中的入口頁方向
- `/about-preview` 為新版計畫緣起預覽頁
- `/sessions` 已改為 `v3` 資訊節奏 + 現行工版頁首 + 現行資料邏輯
- `/sessions` 已導入第一個 `shadcn/ui` 互動元件：
  - `Accordion`（使用於準備程序庭）
- Notion 主後台已接通：
  - `Articles_DB`
  - `Comments_DB`
  - `Inbox_DB`
  - `Moderation_Log_DB`

## 已備份的核心頁面

- `app/page.tsx`
- `app/about/page.tsx`
- `app/about-preview/page.tsx`
- `app/guide/page.tsx`
- `app/guide-prototype/page.tsx`
- `app/project-intention-prototype/page.tsx`
- `app/sessions/page.tsx`
- `app/sessions/[id]/page.tsx`
- `app/forum/page.tsx`
- `app/forum/[id]/page.tsx`
- `app/contact/page.tsx`
- `app/rankings/page.tsx`

## 已備份的核心元件

- `components/Navbar.tsx`
- `components/SubpageHeader.tsx`
- `components/ui/accordion.tsx`
- `components/ui-shared.tsx`

## 已備份的後端與資料層

- `lib/notion.ts`
- `lib/backend/provider.ts`
- `lib/backend/types.ts`
- `app/api/submit-article/route.ts`
- `app/api/comments/route.ts`
- `app/api/contact/route.ts`
- `app/api/forum/route.ts`
- `app/api/forum/[id]/route.ts`
- `app/api/like/route.ts`
- `app/api/trending/route.ts`
- `app/api/sessions/route.ts`
- `data/sessions-index.json`

## 已備份的工作文件

- `Obsidian-頁面排版與文案工作本.md`
- `PAGE_LAYOUT_AND_COPY_WORKBOOK_2026-04-03.md`
- `NOTION_DATABASE_BLUEPRINT.md`
- `MECHANISM_POLICY.md`
- `AI_START_HERE.md`

## 回溯方式

如果後續大改需要回到這個版本：

1. 先比對目前正式工作檔與本快照內對應檔案
2. 只回拷你要回復的頁面、元件或後端檔
3. 不要整包覆蓋，避免把後續有價值的新改動一起洗掉

## 注意

- 這是「人工快照」，不是 Git tag
- 正式文案仍以使用者定義為準
- 大改期間，應優先以這份快照做對照，不要靠聊天紀錄找版本
