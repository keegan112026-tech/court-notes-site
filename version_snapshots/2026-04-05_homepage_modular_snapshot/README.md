# Homepage Modular Snapshot 2026-04-05

這份快照是首頁目前已確認的最新本機版本之模組備份，方便後續單獨調取、回看與局部回退。

目前確認基準：
- 本機最新首頁：[http://localhost:3002/](http://localhost:3002/)
- 來源檔案：[C:\Users\User\OneDrive\Desktop\社工共構觀庭筆記平台\app\page.tsx](C:\Users\User\OneDrive\Desktop\社工共構觀庭筆記平台\app\page.tsx)

## 快照內容

1. [00-app-page.latest.tsx](C:\Users\User\OneDrive\Desktop\社工共構觀庭筆記平台\version_snapshots\2026-04-05_homepage_modular_snapshot\00-app-page.latest.tsx)
- 完整首頁檔案快照
- 用途：整頁回退、比對整體版型

2. [01-homepage-hero-left.snapshot.tsx](C:\Users\User\OneDrive\Desktop\社工共構觀庭筆記平台\version_snapshots\2026-04-05_homepage_modular_snapshot\01-homepage-hero-left.snapshot.tsx)
- 來源：`app/page.tsx:272-338`
- 用途：Hero 左側主敘事、CTA、統計數字

3. [02-homepage-right-notebook-window.snapshot.tsx](C:\Users\User\OneDrive\Desktop\社工共構觀庭筆記平台\version_snapshots\2026-04-05_homepage_modular_snapshot\02-homepage-right-notebook-window.snapshot.tsx)
- 來源：`app/page.tsx:341-475`
- 用途：Hero 右側完整筆記櫥窗
- 目前包含：
  - 單場次完整筆記預覽
  - 兩列路徑入口
    - `先進行教學再進入觀庭筆記共構（推薦）`
    - `直接進入觀庭筆記共構（跨場次版面）`

4. [03-homepage-guide-block.snapshot.tsx](C:\Users\User\OneDrive\Desktop\社工共構觀庭筆記平台\version_snapshots\2026-04-05_homepage_modular_snapshot\03-homepage-guide-block.snapshot.tsx)
- 來源：`app/page.tsx:480-591`
- 用途：Hero 下方獨立的「平台限制與規範」區塊

## 使用原則

- 這些檔案是板塊切片備份，不是可直接獨立編譯的正式元件。
- 若之後要把某一塊真正拆成元件，請以這份快照為視覺與文案結構基準。
- 若 PowerShell 直接顯示中文看起來怪，請以 UTF-8 編輯器查看檔案內容，不要直接假設檔案已壞掉。
