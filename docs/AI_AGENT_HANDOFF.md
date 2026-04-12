# AI 代理交接文件 AI_AGENT_HANDOFF.md
> 給下一個接手的 AI 代理閱讀。本文是快速上手指南，詳細規格請見其他文件。  
> 最後更新：2026-04-12

---

## 你在接手什麼

一個 **Next.js 14 App Router** 平台，讓公民可閱讀台灣法院庭審逐字稿、書寫觀庭筆記、投稿論述。
目前主要功能已完成，正在持續補入逐字稿資料並完善 Admin 工具。

**GitHub**：`keegan112026-tech/court-notes-site`  
**部署**：Vercel，`main` branch auto-deploy  
**本機啟動**：`npm run dev`（port 3000）

---

## 必讀文件清單（照順序）

1. `docs/GOVERNANCE.md` — 所有原則、路由地圖、資料結構、安全規則
2. `SESSION_PAGE_TEMPLATE.md` — 新增場次的公版規格（Props interface 全覽）
3. `docs/BASELINE_CHECKLIST.md` — 核對基準表（確認平台當前健康狀態）
4. `docs/CHANGELOG.md` — 版本歷史 + 待辦 Backlog

---

## 快速核對（接手後第一件事）

```bash
# 1. TypeScript 健康
npx tsc --noEmit

# 2. 環境變數（需有 .env.local）
npm run env:check:prod

# 3. 本機啟動
npm run dev
# 然後訪問 http://localhost:3000/sessions/s-114-51-1211 確認工作檯正常
```

---

## 最重要的 3 個檔案

| 檔案 | 角色 |
|------|------|
| `app/sessions/[id]/page.tsx` | 工作檯主頁（~320 行，只有狀態 + 版面） |
| `components/workbench/` | 8 個工作檯元件（UX 修改在這裡）|
| `lib/admin-auth.ts` | Admin 角色驗證核心（owner/reviewer）|

---

## 常見任務的正確做法

### 修改工作檯 UX（例如改按鈕樣式）
→ 修改 `components/workbench/` 對應元件，**不要動** `page.tsx`

### 新增場次逐字稿
→ 依 `SESSION_PAGE_TEMPLATE.md` 三步驟（JSON + index + TS map）

### 新增 Admin 功能
→ 新建 `app/api/admin/[name]/route.ts`，必須調用 `getAdminAccountByToken()`
→ 破壞性操作加 `if (admin.role !== 'owner') return 403`

### 修改文案（中文用戶介面）
→ **必須先詢問用戶確認**，不自行修改

### 修改 Props interface
→ 修改對應元件檔案，**同步更新** `SESSION_PAGE_TEMPLATE.md`

---

## 目前待辦（優先順序）

### 立即可處理
1. **`/admin/corrections` 全流程測試**：需要實際 admin token 登入後手動測試修訂流程
2. **首頁靜態庭期陣列同步**：`app/page.tsx` 內的 `trialHearings` 需與 `data/sessions-index.json` 一致

### 接到指示時處理
3. **新增逐字稿場次**：依 3 步驟格式匯入（`data/sessions/[id].json`）
4. **Onboarding overlay 桌面版**：目前只在手機顯示
5. **InlinePanel 展開動畫**

---

## 禁止事項

- ❌ 未確認就改中文文案
- ❌ 繞過 `getAdminAccountByToken()` 驗證
- ❌ 直接改 `page.tsx` 的 JSX 而不改對應元件
- ❌ 修改 Props interface 卻不更新 `SESSION_PAGE_TEMPLATE.md`
- ❌ commit 前未跑 `npx tsc --noEmit`

---

## 關鍵環境變數（生產）

```bash
BACKEND_PROVIDER=auto          # auto | notion | firebase
ADMIN_REVIEW_TOKEN=xxx         # 或使用 ADMIN_REVIEW_ACCOUNTS_JSON
ADMIN_REVIEW_ACCOUNTS_JSON='[{"name":"王小明","token":"xxx","role":"owner"}]'
# Firebase 或 Notion 的其他 vars 依 .env.example 填入
```

完整說明見 `.env.example` 與 `docs/GOVERNANCE.md` 第七節。
