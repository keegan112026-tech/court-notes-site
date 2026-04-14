# AI 接手基準文件
**版本：** 2026-04-14  
**最新 commit：** `088bb2f`  
**部署狀態：** Vercel Production ● Ready  
**Production URL：** https://court-notes-site.vercel.app

---

## 一、這個專案是什麼

**觀庭還原筆記共構平台**——記錄剴剴案（兒童死亡案）法庭審理過程，讓社工、公民、法律人可以閱讀逐字稿、書寫論述、共同形成公開觀點。

核心價值：**人的書寫**。不使用 AI 生成內容。

---

## 二、技術棧

| 層次 | 技術 |
|------|------|
| Framework | Next.js 14 App Router（TypeScript + Tailwind CSS）|
| UGC 後端 | Firebase / Firestore |
| 文章後端 | Notion API（`lib/notion.ts`）|
| 編輯器 | Tiptap（含自訂 CitationChip extension）|
| 部署 | Vercel（auto-deploy from `main`）|

---

## 三、現有功能狀態（全部已上線）

### 3.1 首頁（`app/page.tsx`）
- Hero、三欄問答、投稿引導
- Nav 6 項：還原筆記 / 觀庭筆記匯集區 / 計畫緣起 / 觀庭前教程 / 規範 / 聯絡

### 3.2 場次頁（`app/sessions/[id]/page.tsx`）— 最複雜
**手機三模式（`mobileMode: 'read' | 'inline' | 'edit'`）**
- `read`：預設，閱讀逐字稿，Floating bar
- `inline`：逐段展開 textarea 填寫，彙整後帶入編輯器
- `edit`：Tiptap 書寫模式，可提交審核

**電腦雙模式（`desktopMode: 'read' | 'workbench'`，預設 `'read'`）**
- `read`：`max-w-[820px]` 純閱讀（speaker 11px uppercase，逐字稿 17px serif，line-height 2.0，舞台分節線）
- `workbench`：ResizablePanelGroup 左右分欄（逐字稿 + 編輯器）
- 切換按鈕在 WorkbenchHeader 右上角

**共通功能：**
- Flag 按鈕 → ReportSheet → `/api/contact`
- Onboarding overlay（localStorage）
- 送出審核（僅電腦工作台模式顯示）

### 3.3 Workbench 元件（`components/workbench/`）
8 個子元件，parent 約 320 行：
`CitationChip.ts` / `TranscriptPanel` / `InlinePanel` / `EditorPanel` / `MobileReadHeader` / `OnboardingOverlay` / `ReportSheet` / `ContributionSheet`

### 3.4 後台（`app/admin/`）
| 路由 | 功能 |
|------|------|
| `/admin` | Dashboard 總覽 |
| `/admin/review` | 投稿審核 |
| `/admin/articles` | 已發佈文章管理 |
| `/admin/corrections` | 回報 + 就地修訂 + audit log |
| `/admin/login` | 登入 |

Admin 角色：`'owner' | 'reviewer'`（API level 強制）

### 3.5 Forum（`app/forum/`）
前後端已接通，`/api/forum` + `/api/forum/[id]`。

---

## 四、資料層

### 場次 JSON
```
data/sessions-index.json          ← [{id, date, title, ...}] 3 筆
data/sessions/s-114-1-6.json      ← 第1場 2025-11-27
data/sessions/s-114-51-1211.json  ← 第2場 2025-12-11
data/sessions/s-114-51-1218.json  ← 第3場 2025-12-18
lib/generated/local-session-details.ts  ← import 三者，組成 sessionMap
```

首頁 `SessionsOverviewSection` 用 `date` 欄位自動比對場次連結，保持 YYYY-MM-DD 格式即可。

### 文章 JSON
```
data/published-articles/index.json   ← {generatedAt, items:[...]}（注意：不是純陣列）
data/published-articles/art-*.json   ← 個別文章
```

---

## 五、API 對照表（18 支，全部存在）

**前台**
```
GET  /api/stats                   ← 首頁統計數字
POST /api/like                    ← 按讚
GET  /api/sessions                ← 場次列表
GET  /api/transcripts/[id]        ← 逐字稿
POST /api/submit-article          ← 投稿審核
GET/POST /api/comments            ← 留言
POST /api/contact                 ← 錯誤回報（flag）
GET  /api/trending                ← 熱門文章
GET/POST /api/forum               ← 論壇
GET  /api/forum/[id]              ← 論壇文章
```

**後台（需 admin token）**
```
/api/admin/review
/api/admin/articles
/api/admin/comments
/api/admin/inbox
/api/admin/dashboard
/api/admin/session
/api/admin/session-patch          ← owner-only 逐字稿修訂
/api/admin/session-patch/log      ← audit log
```

---

## 六、已知規則與地雷

| 項目 | 規則 |
|------|------|
| ESLint no-unused-vars | interface Props callback 參數必須加 `_` 前綴 |
| published-articles index | `{generatedAt, items:[...]}` 格式，用 `.items` 讀取 |
| admin 型別 | `AdminConsoleSection` 聯合型別含 `'dashboard'`，不能漏 |
| git heredoc | 含中文括號的路徑（如 `app/(archive)/`）會讓 bash heredoc 出錯，改用 `-m "..."` |
| Notion / Firebase | 不動後端設定，現行運作穩定 |

---

## 七、新增場次標準流程

1. 逐字稿 JSON → `data/sessions/s-[id].json`
2. `data/sessions-index.json` 加一筆（date YYYY-MM-DD）
3. `lib/generated/local-session-details.ts` import 並加入 sessionMap
4. 首頁自動比對，不需其他改動

詳見 `SESSION_PAGE_TEMPLATE.md`。

---

## 八、Backlog（截至 2026-04-14）

| 優先 | 項目 | 狀態 |
|------|------|------|
| 1 | `/admin/corrections` 全流程實機測試 | 需 admin token 環境，deferred |
| 2 | 新場次匯入 | 等使用者提供逐字稿 |
| 3 | Forum 討論區功能驗收 | 前後端已接通，待確認 |

---

## 九、工作規則（接手 AI 必讀）

1. **文案**：不得自行改寫或新增前台文案，先提方案讓使用者審閱
2. **功能**：先討論確認方向，不要直接實作再說「我做了 XYZ」
3. **AI 生成內容**：禁止整合生成式 AI 做內容（核心原則）
4. **回報格式**：完成後條列式，已完成 + 剩餘 Backlog
5. **同步**：工作前先 `git pull origin main` 確認本地與 remote 同步
6. **記憶更新**：重大工作完成後，更新 `memory/project_state.md` 和本文件
