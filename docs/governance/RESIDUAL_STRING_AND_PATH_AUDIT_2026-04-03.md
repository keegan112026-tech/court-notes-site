# Residual String And Path Audit

更新日期：2026-04-03

## 這次排查目的

確認目前 active 程式是否還殘留：
- 舊的 CMS 文案來源
- 舊的錯誤路徑
- 舊的 Notion / Firebase 過渡命名
- 明顯系統亂碼

## 已確認清理完成

### 1. 舊 CMS 主路徑
已確認 active 程式中沒有以下殘留：
- `/api/cms`
- `CMS_DB`
- `NOTION_DB_GLOBAL`
- `fetchAllCMS`
- `Hero_Title`
- `Hero_Desc_1`
- `Hero_TypeWriter_Texts`

這表示：
- 正式文案不再由後端 CMS 覆蓋
- 首頁 Hero 不再依賴後端 CMS

### 2. 系統 API 訊息
以下路由已重寫為乾淨版系統訊息：
- `app/api/admin/review/route.ts`
- `app/api/admin/session/route.ts`
- `app/api/comments/route.ts`
- `app/api/contact/route.ts`
- `app/api/submit-article/route.ts`
- `app/api/forum/route.ts`

### 3. 前台 / 後台系統頁面
以下頁面已清理主要系統文字：
- `app/admin/login/AdminLoginClient.tsx`
- `app/admin/review/page.tsx`
- `app/forum/page.tsx`
- `app/forum/[id]/page.tsx`
- `app/rankings/page.tsx`
- `app/contact/page.tsx`

## 本次驗證結果

- `npx tsc --noEmit` 通過
- `/admin/review` 可開
- `/contact` 可開
- active 程式中未搜尋到舊 CMS 主路徑殘留

## 仍保留但不視為主線的內容

以下內容可保留作歷史參考，但不作現行主線：
- `FIREBASE_DATA_SCHEMA_2026-03-31.md`
- `MAINTENANCE_MANUAL.md` 中舊流程說明
- `docs/archive/` 底下歷史規劃
- `demo / beautification-demo / demo2 / demo3 / demo4` 類示範頁

## 後續建議

- 若要進一步排查零星殘留，優先看：
  - `sessions/[id]`
  - `sessions/compose`
  - `sessions/page.tsx`
  - `page.tsx`
- 但排查時必須遵守：
  - 不改使用者正式文案
  - 只清系統層、錯誤訊息、過渡命名與路徑
