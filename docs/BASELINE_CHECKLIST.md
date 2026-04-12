# 核對基準表 BASELINE_CHECKLIST.md
> 每次有重大修改或新代理接手時，依此表逐項核對，確保平台基線完整。  
> 最後核對：2026-04-12 ｜ 核對者：Claude Sonnet 4.5

---

## A. TypeScript 健康
- [x] `npx tsc --noEmit` → 0 errors
- [x] `npm run lint` → 0 errors（warnings 為舊有 demo 檔案，可接受）

## B. 路由完整性
- [x] `/` 首頁正常渲染
- [x] `/sessions` 場次總覽正常
- [x] `/sessions/s-114-51-1211` 工作檯（第二場次）正常
- [x] `/sessions/s-114-1-6` 工作檯（第六場次）正常
- [x] `/admin` 登入頁正常
- [x] `/admin/corrections` 需 admin token，未登入正確跳轉登入

## C. 工作檯元件（手機版）
- [x] 三模式 Tab（閱讀/逐段填寫/書寫筆記）可切換
- [x] 閱讀模式：modeHintRead 顯示，TranscriptPanel 渲染
- [x] 逐段填寫：modeHintInline 顯示，InlinePanel 渲染，填寫後計數器更新
- [x] 彙整按鈕（已填 N 段）→ 確認後跳到書寫筆記 + editor
- [x] 書寫筆記：modeHintEdit 顯示，子 Tab 切換逐字/編輯
- [x] Flag 按鈕 → ReportSheet 展開
- [x] 首次訪問 → OnboardingOverlay 顯示
- [x] 二次訪問（localStorage 已設）→ overlay 不顯示

## D. 工作檯元件（桌面版）
- [x] 左欄 Tab「逐字紀錄 / 逐段填寫」可切換
- [x] 逐段填寫：InlinePanel + modeHintInline 顯示
- [x] 填寫後「已填 N 段 → 彙整進編輯區」按鈕出現
- [x] 彙整後左欄自動切回逐字紀錄，右欄編輯器內容更新
- [x] 桌面版 hover 引用預覽 (CitationPreview card) 正常
- [x] 桌面版 ResizablePanelGroup 左右拖曳調整比例

## E. Admin 端點 Role Guard
- [x] `GET /api/admin/inbox` → 401 未登入
- [x] `POST /api/admin/inbox` → 401 未登入
- [x] `GET /api/admin/articles` → 401 未登入
- [x] `POST /api/admin/articles` action=delete → 403 reviewer
- [x] `GET /api/admin/session-patch` → 401 未登入
- [x] `PATCH /api/admin/session-patch` → 401 未登入 / 403 reviewer
- [x] `GET /api/admin/session-patch/log` → 401 未登入

## F. 資料完整性
- [x] `data/sessions-index.json` 包含所有已知場次 ID
- [x] `data/sessions/s-114-51-1211.json` 存在且格式正確
- [x] `data/sessions/s-114-1-6.json` 存在
- [x] `lib/generated/local-session-details.ts` 與 sessions-index 同步
- [x] `data/patches/` 目錄不需手動建立（API 自動 mkdirSync）

## G. 環境與部署
- [x] `npm run env:check:prod` 腳本可執行（本機無 env 時顯示正確錯誤）
- [x] `npm run smoke:public` 可執行
- [x] `git push origin main` → Vercel auto-deploy 觸發

## H. SESSION_PAGE_TEMPLATE.md 同步
- [x] 所有 workbench 元件的 Props interface 與實際元件一致
- [x] 新增場次 3 步驟正確（JSON → index → TS map）
- [x] 設計語言 token 與實際使用一致

---

## 核對失敗時的 SOP

1. **TypeScript error** → 先讀 error 訊息，定位到檔案 + 行號，修改後再跑一次
2. **Admin 401/403 不正確** → 檢查 `lib/admin-auth.ts` `getAdminAccountByToken()` + 對應 route.ts
3. **場次資料缺失** → 跑 `npm run sessions:verify-map`，比對 `data/sessions-index.json`
4. **元件 Props 不對** → 以 `SESSION_PAGE_TEMPLATE.md` 為基準，逐欄對照
5. **部署失敗** → 先跑 `npm run build` 本機確認，查看 Vercel build log
