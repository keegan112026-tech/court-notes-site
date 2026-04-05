# MULTI SESSION WORKSPACE AND SUBMISSION SPEC

## Goal
讓網站同時支援兩種工作檯：

1. 單場次工作檯
   - 左側顯示單一場次逐字稿
   - 右側撰寫該場次相關共構文章

2. 跨場次共通工作檯
   - 左側可快速切換不同場次逐字稿
   - 右側可在同一篇論述中引用多個場次
   - 最終形成綜合型公開文章

## Core Rules

### Citation Rule
每一個引用都必須可追溯到：
- `sourceSessionId`
- `lineId`
- `speaker`

引用在畫面上可以顯示簡化標籤，例如：
- `[引用:4]`
- `[s-114-1-6:4]`

但在資料層至少要保留：
- `data-session`
- `data-line`
- `data-speaker`

### Article Rule
每一篇投稿文章至少要包含：
- `title`
- `author`
- `contactEmail` 可選
- `content`
- `targetSessionSid`
- `sourceSessionSids[]`
- `status`

其中：
- `targetSessionSid`
  - 主要歸屬場次
  - 用於列表分類、主要入口、排行榜關聯
- `sourceSessionSids[]`
  - 真正被引用過的場次集合
  - 可用於顯示「本文引用了哪些庭次」

## Submission Form

### Existing Fields
- 標題
- 作者名稱
- 內容

### Added Field
- 電子信箱
  - 非必填
  - 不公開
  - 僅供管理團隊於後續修改或異動聯繫

## Cross Session Workspace

### Route
- 建議正式路由：`/sessions/compose`

### Left Panel
- 場次切換器
- 該場次逐字稿
- 點擊段落可插入引用

### Right Panel
- 綜合論述編輯區
- 標題、作者、聯絡信箱
- 顯示已引用來源場次

### Current Scaffold
已建立骨架頁：
- `app/sessions/compose/page.tsx`

目前用途：
- 驗證跨場次工作檯的基本交互與資料格式
- 作為未來正式多場次版本的起點

## Public Article Display

### Public Article Page Should Show
- 文章標題
- 作者
- 文章內容
- 留言與按讚
- 本文主要場次
- 本文引用場次清單

### Future Enhancement
公開文章頁的引用 hover 卡片要與工作檯一致：
- hover 顯示原文
- 點擊跳到對應工作檯與段落

## Risks To Avoid
- 不可把跨場次文章簡化成只有單一 `targetSessionSid`，否則資料會失真
- 不可只在前端字面上顯示場次，卻不在資料層保存 `sourceSessionSids`
- 不可讓 email 混入公開文章頁渲染資料

## Status
- 單場次工作檯：已可用
- 引用 hover 與跳轉：已具現
- email 欄位：已加入投稿流程
- `sourceSessionSids`：已進入投稿資料結構
- 跨場次工作檯：已建立第一版骨架
