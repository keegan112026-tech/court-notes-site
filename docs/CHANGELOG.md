# 開發記錄 CHANGELOG.md
> 最後更新：2026-04-12  
> 格式：新功能 feat | 修正 fix | 重構 refactor | 維運 chore

---

## v0.4.0 — 2026-04-12（當前版本）
**commit** `539c8c0`

### feat
- **工作檯元件拆分**：`app/sessions/[id]/page.tsx` 從 950 行重構至 ~320 行，抽出 8 個 `components/workbench/` 元件
- **電腦版逐段填寫**：左欄 Tab 切換「逐字紀錄 / 逐段填寫」，右欄編輯器常駐，彙整後自動切回逐字紀錄
- **Onboarding overlay**：首次訪問工作檯（手機版）顯示三模式教學，localStorage `session-onboarding-seen` 閘控
- **段落錯誤回報（ReportSheet）**：Flag 按鈕 → Bottom Sheet → `POST /api/contact`（messageType: `內容更正`）
- **管理後台：內容更正頁** (`/admin/corrections`)：pending/resolved 回報列表、owner 就地修訂、audit log 前後對比
- **逐字稿修訂 API** (`/api/admin/session-patch`)：PATCH 修改 JSON 段落，寫入 JSONL audit log（owner only）
- **Audit log 讀取 API** (`/api/admin/session-patch/log`)：所有 admin 可查，newest first
- **AdminConsoleNav 更正分頁**：Flag icon，link to `/admin/corrections`
- **浮動 bar 文案**：「你也可以去探究、感受、書寫——創建屬於你的觀庭筆記」
- **模式 hint 文字**：閱讀/逐段填寫/書寫筆記各有情境說明

### chore
- `scripts/check-env-prod.mjs`：生產環境變數健康檢查腳本，`npm run env:check:prod`
- `SESSION_PAGE_TEMPLATE.md`：AI 可讀場次頁面公版規格（3 步驟 + Props interface 全覽）
- `data/patches/` 目錄（由 API 自動 mkdirSync 建立）

### fix
- `FileEdit` 未使用 import 移除
- `ContributionSheet` 「直接開始書寫」同時設定 `mobileMode='edit'` + `mobilePanel='editor'`
- `mergeInlineNotes` 在桌面版彙整後切換左欄模式而非設定 mobileMode

---

## v0.3.x — 2026-04 初
**commits** `b664439`、`7d24329` 等

### feat
- 燒盡互動簡報（`data/presentations/social-work-burnout.ts`）
- 觀庭前教程頁（`/tutorial`）含 Dog 互動角色
- 字元計數器加入所有投稿表單
- 留言字元上限 UX 改善、審核全文展開、引用 chip 半透明

---

## v0.2.x — 2026-03 末
**commits** `5acb03e`、`2f6a2f3` 等

### feat
- 公開頁面整體美化與 Admin 審核介面改版
- `ADMIN_REVIEW_ACCOUNTS_JSON`：多帳號 JSON 設定，支援 `owner`/`reviewer` role 分權
- 管理後台所有端點加入 role guard（刪除 = owner only）
- 版本快照與治理文件初稿

---

## 待辦 Backlog（下一個代理接手時的優先清單）

### 高優先
- [ ] **逐字稿修訂 UI 全流程測試**：需要實際設定 admin token 後登入 `/admin/corrections` 執行 PATCH
- [ ] **場次 `s-114-1-6` 逐字稿補全**：目前資料格式待確認（`data/sessions/s-114-1-6.json`）
- [ ] **首頁 `trialHearings` 靜態陣列同步**：首頁硬編碼的庭期清單需手動與 `data/sessions-index.json` 保持一致

### 中優先
- [ ] **Onboarding overlay 桌面版**：目前 overlay 只在 `isMobileLayout` 時顯示，桌面版沒有教學
- [ ] **InlinePanel 展開動畫**：點擊段落展開 textarea 目前無 CSS transition
- [ ] **ReportSheet 回報成功後的 inbox 計數**：管理員需要有提示（badge 或 email 通知）

### 低優先
- [ ] **`useEffect` HMR deps warning**：scroll handler 在熱重載時出現 `[false] → [false, read]` warning，實際不影響功能
- [ ] `(demo)` 資料夾內的 unused imports（pre-commit 已標記為 warning）
- [ ] 生產路由 smoke test CI 整合
