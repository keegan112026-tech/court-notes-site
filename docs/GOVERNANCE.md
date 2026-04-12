# 平台治理文件 GOVERNANCE.md
> 最後更新：2026-04-12 ｜ 版本：v0.4.0  
> 本文件為 AI 代理交接基準，任何代理在協助開發前必須先閱讀此文件。

---

## 一、平台定位

**觀庭還原筆記共構平台**（Social Work Court Notes）

- **目的**：讓社工、學術研究者、公民記者等人，能閱讀法庭逐字稿、書寫觀庭筆記、共構專業論述，並投稿至平台匯集區。
- **技術棧**：Next.js 14 App Router、TypeScript、Tailwind CSS、Tiptap 編輯器、Firebase/Firestore、Notion（optional backend）
- **部署**：Vercel（`main` branch auto-deploy）
- **GitHub**：`keegan112026-tech/court-notes-site`

---

## 二、核心原則（任何 AI 代理必須遵守）

### 2.1 程式碼原則
| 原則 | 說明 |
|------|------|
| TypeScript 零 error | 每次修改後必須執行 `npx tsc --noEmit` 確認 |
| 元件分責 | UX/邏輯修改 → 改 `components/workbench/` 元件；不改 `page.tsx` |
| 新功能 → 新 state | 新狀態在 `app/sessions/[id]/page.tsx` 宣告，透過 Props 傳入元件 |
| 不動公版欄位 | `SESSION_PAGE_TEMPLATE.md` 所定義的 Props interface 為基準 |
| 不自行改文案 | 所有用戶可見的中文文案需用戶確認後才修改 |

### 2.2 安全原則
| 端點 | 規則 |
|------|------|
| 所有 `/api/admin/*` | 需通過 `getAdminAccountByToken()` 驗證，返回 401 |
| 破壞性操作（刪除）| 限 `role === 'owner'`，reviewer 返回 403 |
| 逐字稿修訂（PATCH）| 僅 owner 可執行，寫入 JSONL audit log |
| 前台 API | `/api/contact`、`/api/submit-article` 無需 admin 驗證 |

### 2.3 資料原則
| 資料類型 | 儲存位置 | 格式 |
|---------|---------|------|
| 場次逐字稿 | `data/sessions/[id].json` | `LocalTranscriptLine[]` |
| 場次索引 | `data/sessions-index.json` | `SessionIndexEntry[]` |
| 場次 TypeScript map | `lib/generated/local-session-details.ts` | key-value |
| 修訂記錄 | `data/patches/[sessionId].jsonl` | 每行一個 JSON |
| 已發布文章 | `data/published-articles/*.json` | `PublishedArticle` |

---

## 三、路由地圖

### 3.1 前台路由
| 路徑 | 功能 |
|------|------|
| `/` | 首頁（計畫緣起、還原筆記輪轉、多場次工作檯 CTA） |
| `/sessions` | 場次總覽（SessionsOverviewSection） |
| `/sessions/[id]` | 單場次工作檯（逐字稿 + 三模式 + 編輯器） |
| `/articles` | 觀庭筆記匯集區（已發布文章列表） |
| `/forum` | 討論區（Notion 驅動） |
| `/about` | 計畫說明 |
| `/guidelines` | 平台限制與規範 |
| `/tutorial` | 觀庭前教程 |
| `/multi-session` | 跨場次工作檯 |

### 3.2 Admin 路由
| 路徑 | 功能 | 最低權限 |
|------|------|---------|
| `/admin` | 登入 | — |
| `/admin/review` | 文章審核 | reviewer |
| `/admin/articles` | 文章管理 | reviewer |
| `/admin/comments` | 留言管理 | reviewer |
| `/admin/inbox` | 收件匣 | reviewer |
| `/admin/corrections` | 內容更正（逐字稿修訂）| reviewer（修訂需 owner）|

### 3.3 API 路由
| 路徑 | 方法 | 功能 |
|------|------|------|
| `/api/contact` | POST | 聯絡/回報表單 |
| `/api/submit-article` | POST | 觀庭筆記投稿 |
| `/api/forum` | GET | 論壇文章列表 |
| `/api/stats` | GET | 平台統計數字 |
| `/api/trending` | GET | 熱門文章 |
| `/api/admin/session` | GET/POST/DELETE | Admin 登入/登出 |
| `/api/admin/inbox` | GET/POST | 收件匣讀取/處理 |
| `/api/admin/review` | GET/POST | 文章審核 |
| `/api/admin/articles` | GET/POST | 文章管理 |
| `/api/admin/comments` | GET/POST | 留言管理 |
| `/api/admin/session-patch` | GET/PATCH | 逐字稿修訂（PATCH = owner only）|
| `/api/admin/session-patch/log` | GET | 修訂 audit log |

---

## 四、元件架構

### 4.1 工作檯元件（`components/workbench/`）
| 元件 | 職責 |
|------|------|
| `CitationChip.ts` | Tiptap 自訂節點，渲染引用標籤 |
| `TranscriptPanel.tsx` | 逐字稿面板（桌面：Flag + Quote hover；手機：Flag 右上角） |
| `InlinePanel.tsx` | 逐段填寫面板（每段可展開 textarea） |
| `EditorPanel.tsx` | Tiptap 編輯器 + 投稿表單 |
| `MobileReadHeader.tsx` | 手機版標題列（含彙整確認按鈕） |
| `OnboardingOverlay.tsx` | 首次使用三模式教學 overlay（localStorage 閘控） |
| `ReportSheet.tsx` | 段落錯誤回報 Bottom Sheet |
| `ContributionSheet.tsx` | 投稿引導 Bottom Sheet |

### 4.2 Admin 元件（`components/admin/`）
| 元件 | 職責 |
|------|------|
| `AdminConsoleNav.tsx` | Admin 分頁導覽（review/articles/comments/inbox/corrections）|

---

## 五、設計語言 Token

```
背景色：#FBF7F0（暖米）/ #FAFAFA（淺灰）
主色：#6B8E23（橄欖綠）
深主色：#5a781d
文字主色：#2D2A26
文字次色：#6B6358 / #8A8078
邊框色：#E8E0D4 / #F0EBE3
工作檯邊框：#DDE6C8（綠色調）
回報色：orange（#F97316 系列）
字型：Noto Serif TC（serif 常數：{ fontFamily: "'Noto Serif TC', serif" }）
圓角：rounded-2xl（1rem）/ rounded-[2rem]（大卡片）/ rounded-xl（小元件）
```

---

## 六、新增場次的 3 步驟

完整規格見 `SESSION_PAGE_TEMPLATE.md`，快速摘要：

1. **建立 JSON**：`data/sessions/[id].json`（格式：`LocalSessionBundle`）
2. **更新索引**：`data/sessions-index.json` 加入 `SessionIndexEntry`
3. **更新 TypeScript map**：`lib/generated/local-session-details.ts` 加入 key

新場次工作檯自動繼承全部 8 個 workbench 元件，不需修改 `page.tsx`。

---

## 七、npm 腳本速查

| 指令 | 功能 |
|------|------|
| `npm run dev` | 啟動開發伺服器 |
| `npm run build` | 建置（pre-commit hook 會自動執行 tsc + lint）|
| `npm run env:check:prod` | 生產環境變數健康檢查 |
| `npm run smoke:public` | 本機公開路由 smoke test |
| `npm run smoke:public:prod` | 生產路由 smoke test |
| `npm run sessions:generate-map` | 重新產生場次 TypeScript map |
| `npm run sessions:verify-map` | 驗證場次 map 完整性 |
| `npm run articles:validate` | 驗證已發布文章格式 |
| `npx tsc --noEmit` | TypeScript 型別檢查（修改後必跑）|
