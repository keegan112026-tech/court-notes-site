# Legacy Views 歸檔

**歸檔日期：** 2026-04-04

## 說明

這些檔案是早期開發階段遺留的舊版元件，目前已無任何頁面 import 使用，
屬於死碼（dead code）。保留於此以備未來參考，不再參與 build。

## 檔案清單

| 檔案 | 原路徑 | 說明 |
|------|--------|------|
| `components/HomeView.tsx` | `components/` | 舊版首頁 View，被新版 `app/page.tsx` 取代 |
| `components/SessionsListView.tsx` | `components/` | 舊版場次列表 View |
| `components/AboutView.tsx` | `components/` | 舊版計畫緣起 View |
| `components/TranscriptView.tsx` | `components/` | 舊版逐字稿 View |
| `components/Footer.tsx` | `components/` | 舊版頁尾，現各頁面自行處理頁尾 |
| `lib/mockData.ts` | `lib/` | 舊版假資料，供以上元件使用 |
| `app/ClientApp.tsx` | `app/` (worktree) | 舊版 SPA 路由入口，已被 App Router 取代 |
