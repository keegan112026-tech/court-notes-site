# 社工觀庭筆記共構平台 (Social Worker Court Notes Collaboration Platform)

## 1. 專案概述 (Project Overview)
本專案旨在建立一個**「社工實務與法律對話的共構平台」**。
核心功能是將法庭開庭實況轉化為「類逐字稿（Transcript）」呈現，並允許專業人員針對「特定對話段落（Paragraph/Line）」進行精準的留言論述與按讚。

## 2. 系統架構 (System Architecture)
- **Frontend**: React.js / Next.js (SPA), Tailwind CSS.
- **Backend/CMS**: Notion Database.
- **Middleware**: Google Apps Script (GAS) or Cloudflare Worker.

## 3. 功能概覽
- **首頁**: 發燒話題推播 (Top likes/comments).
- **場次列表**: 類百科條目樣式.
- **觀庭詳情頁**: 
    - 逐字稿呈現 (Role-based styling).
    - 顆粒化/區塊級互動 (Block-level comments).
- **互動機制**: 按讚, 留言 (需審核).

## 4. 資料庫 (Notion)
- Sessions_DB
- Transcripts_DB
- Interactions_DB
- Global_Settings_DB
