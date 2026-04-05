# 社工共構觀庭筆記平台

AI 快速接手架構書暨施作進度總覽

最後整理時間：2026-03-30  
整理依據：目前專案檔案、Git 狀態、API 程式碼、優化計畫文件、執行日誌

## 1. 文件目的

這份文件是給後續 AI 助手或協作者快速接手用的總架構書，目標是一次說清楚：

- 這個網站想做什麼
- 目前整體網站架構長什麼樣子
- 已經做完哪些部分
- 哪些部分還在過渡期或原型階段
- 各功能目前是如何實作的
- 現在最大的阻塞點是什麼
- 下一步最值得優先推進的是哪些工作

---

## 2. 專案定位與核心目標

本案是一個以「社工／專業工作者共同閱讀、理解、整理與延伸法庭逐字內容」為核心的平台。

它不是單純的新聞站，也不是一般論壇，而是結合三種功能：

- 法庭逐字與庭次資料的公開整理與閱讀
- 相關知識、背景脈絡、術語與規則的前置理解
- 讓使用者在逐字內容旁建立觀點、段落分析、討論與論壇文章

目前產品邏輯可以理解成三層：

1. 知識層：讓使用者先理解制度、角色、程序與重要概念
2. 庭次層：進入各場次逐字內容，閱讀與分析內容
3. 共構層：對逐字段落留下看法、延伸為論壇文章、形成知識交流

---

## 3. 技術架構總覽

### 3.1 前端

- Next.js 14
- React 18
- TypeScript
- App Router
- Tailwind CSS 3.4
- Framer Motion
- lucide-react
- shadcn/ui 風格元件
- `react-resizable-panels`
- Tiptap v3

### 3.2 後端／資料層

- Next.js Route Handlers 當作 API 層
- Notion API 當作 Headless CMS + 資料庫
- 沒有使用傳統 SQL / NoSQL 資料庫
- 所有資料讀寫最終都落到 Notion databases

### 3.3 部署與執行

- Vercel 為預定正式部署平台
- 本地開發使用 `npm run dev`
- 環境變數透過 `.env.local` 管理

---

## 4. 目前專案目錄結構

### 4.1 核心目錄

- `/app`
  - Next.js App Router 頁面與 API
- `/components`
  - 可重用 UI 與頁面組件
- `/components/ui`
  - UI primitives，目前已有 `resizable`
- `/lib`
  - Notion 整合、限流、假資料、工具函式
- `/data`
  - 本地 fallback 資料
- `/public`
  - 靜態資產
- `/old_prototype_archive`
  - 舊原型封存，不應再作為主架構依據

### 4.2 重要說明文件

- `AI_DEVELOPER_CONTEXT.md`
  - 給 AI 的操作背景與核心限制
- `Optimization_Plan.md`
  - 目前這輪 IA / UX / 架構優化的主計畫文件
- `MAINTENANCE_MANUAL.md`
  - Notion CMS 使用與維護手冊
- `README.md`
  - 專案啟動說明

---

## 5. 網站資訊架構（IA）

目前網站正從舊版命名與舊頁面結構，轉向新版資訊架構。

### 5.1 目前已建立的主要路由

- `/`
  - 首頁
- `/about`
  - 專案說明頁
- `/guide`
  - 使用／閱讀指引頁
- `/knowledge`
  - 前置知識頁
- `/sessions`
  - 庭次列表頁
- `/sessions/[id]`
  - 單一庭次工作區頁
- `/forum`
  - 論壇文章列表頁
- `/forum/[id]`
  - 單篇論壇文章頁
- `/rankings`
  - 排行／熱門頁
- `/contact`
  - 聯絡表單頁

### 5.2 正在被淘汰的舊結構

Git 狀態顯示以下頁面正在退出主結構：

- `app/prerequisites/page.tsx`
- `app/rules/page.tsx`
- `app/ClientApp.tsx`

這表示新版 IA 已經開始取代舊頁面命名與舊入口設計。

---

## 6. 主要頁面與施作進度

### 6.1 首頁 `/`

#### 目前定位

首頁已是一個高度視覺化、內容分區明確的 landing page，承擔以下任務：

- 說明平台定位
- 展示核心 CTA
- 顯示站內統計
- 呈現熱門內容
- 導向 sessions / forum / contact

#### 目前已做

- Hero 區塊
- Beta banner
- 固定頂部 navbar
- 站點統計區塊
- Latest Restoration 右側卡片
- 熱門筆記／熱門評論／熱門文章區
- 論壇導流區
- 聯絡導流區
- 致謝／背景說明區
- Footer

#### 目前做法

- `app/page.tsx` 為主頁實作
- 大量使用 Framer Motion 做入場、hover、scroll 動效
- 前端以 `fetch('/api/...')` 讀取：
  - `/api/cms`
  - `/api/sessions`
  - `/api/stats`
  - `/api/trending`

#### 狀態判定

- 視覺與頁面結構：高完成度
- 資料穩定性：受 API 500 問題影響

### 6.2 導覽列 `components/Navbar.tsx`

#### 目前已做

- 新版導覽列已切換到新版 IA
- 導向 about / guide / knowledge / sessions / forum / rankings / contact
- 桌機版連結已完成

#### 目前不足

- 手機選單按鈕存在，但尚未做完整展開互動
- 命名與文字仍有整理空間

#### 狀態判定

- 已完成一版新版導覽
- 尚未完全 polish

### 6.3 前置知識頁 `/knowledge`

#### 目前定位

此頁是新版資訊架構中的「規則書／知識牆」。

#### 目前已做

- 側欄索引
- 分類段落
- 卡片牆式呈現
- 錨點跳轉
- 使用新版 Navbar

#### 目前做法

- 內容目前為硬編碼在 `app/knowledge/page.tsx`
- 頁面採左右欄佈局
- 以一組 `categories` 資料陣列生成所有區塊與卡片

#### 意義

這代表優化計畫中「把知識區獨立成一個完整路由與單獨頁面」已經落地。

#### 狀態判定

- 頁面骨架：已完成
- 內容體系：初版完成
- 是否接 Notion：目前看起來仍為靜態內容，尚未導入 CMS 化

### 6.4 庭次列表頁 `/sessions`

#### 目前定位

應為各場庭次與恢復進度的總覽入口。

#### 已有機制

- 後端已有 `/api/sessions`
- `fetchSessions()` 已定義
- `components/SessionsListView.tsx` 存在

#### 目前狀態

- 頁面本身尚未被本次盤點深入驗證
- 但從 API 與頁面結構看，功能方向已清楚
- 目前最大的問題是 `/api/sessions` 在本地執行紀錄中回傳 500

#### 狀態判定

- 架構存在
- 實際資料供應目前不穩

### 6.5 庭次工作區 `/sessions/[id]`

#### 目前定位

這是整個平台最關鍵的核心頁面，正從「閱讀頁」升級為「雙欄共構工作區」。

#### 目前已做

- 使用 `ResizablePanelGroup`
- 左欄為 transcript viewer
- 中間可拖拉 resize handle
- 右欄為 Tiptap 編輯器區
- 可點擊逐字段落插入 citation tag
- 有分享按鈕
- 有文章送出按鈕 placeholder

#### 目前做法

- `app/sessions/[id]/page.tsx` 是 client component
- 透過 `/api/transcripts/[id]` 取得：
  - session metadata
  - transcripts
  - comments
- Tiptap 使用：
  - `@tiptap/react`
  - `@tiptap/starter-kit`
  - `@tiptap/extension-placeholder`

#### 核心互動機制

1. 載入庭次資料
2. 左欄顯示逐字內容
3. 點擊某行逐字，呼叫 `handleInjectCitation`
4. 將引用標記插入右側編輯器

#### 目前尚未完成

- citation hover 對應原文內容尚未完整做成
- 送出文章只是 alert，尚未真正寫入論壇資料庫
- editor toolbar 仍為簡化版 mock
- 行級引用與論壇文章之間的資料結構仍在設計中

#### 狀態判定

- 已有可見原型
- 是本輪進度中最重要的已落地功能之一
- 但仍屬原型到功能化之間的階段

### 6.6 論壇 `/forum` 與 `/forum/[id]`

#### 目前定位

論壇是把段落觀點延伸成完整文章的區域。

#### 已有機制

- `GET /api/forum`
  - 讀取論壇文章
- `POST /api/forum`
  - 新增論壇文章
- `fetchForumPosts()`
- `createForumPost()`
- `fetchForumPostById()`
- `fetchForumComments()`

#### 特點

- 論壇文章與一般評論目前都落在同一個 Notion interactions 體系中，以 `Type` 區分
- 建文時可帶入：
  - author
  - title
  - content
  - category
  - topic
  - targetSessionSid

#### 狀態判定

- API 層已存在
- 頁面應有初步前端
- 論壇作為獨立模組的資料邏輯已具雛形

### 6.7 聯絡 `/contact`

#### 已有機制

- `POST /api/contact`
- `createContact()`

#### 功能邏輯

- 接收匿名或具名訊息
- 寫入 Notion `Contact_DB`
- 附件使用 `attachmentUrl`
- 有基本 rate limit

#### 狀態判定

- 後端寫入機制已存在
- 前端頁面存在

### 6.8 排行頁 `/rankings`

#### 目前狀態

- 路由已建立
- 屬於新版 IA 的一部分
- 從現有程式碼看，應仍在初期頁面階段

---

## 7. 資料層設計：Notion 作為 CMS / Database

### 7.1 核心設計原則

這個專案不使用傳統資料庫，而是把 Notion 當成：

- CMS
- 結構化資料庫
- 後台操作入口
- 審核流程管理介面

所有重要資料都由 `lib/notion.ts` 負責讀寫。

### 7.2 已定義的資料庫

在程式與維護手冊中可確認共 6 個資料庫：

1. `Global_Settings_DB`
2. `Sessions_DB`
3. `Transcripts_DB`
4. `Interactions_DB`
5. `Forum_DB`
6. `Contact_DB`

### 7.3 實際程式的使用情況

雖然文件中列出 6 個 DB，但目前程式實作有一個關鍵現況：

- forum 文章與 paragraph comments 的主要讀寫，目前實際上是寫入 `Interactions_DB`
- `Forum_DB` 變數存在，但主要 forum functions 目前查詢的是 `DB.interactions`

這代表：

- 文件上的理想模型與程式的現行模型之間有些不一致
- 這是未來需要釐清與收斂的重要地方

### 7.4 各資料型別的用途

#### Global Settings

用途：

- 首頁文案
- Banner
- Hero title / description
- Typewriter text

目前已有函式：

- `fetchAllCMS()`
- `fetchCMS(key)`

#### Sessions

用途：

- 各庭次基本資料

已定義欄位概念：

- `Session_ID`
- `Title`
- `Date`
- `Category`
- `Status`
- `Summary`
- `Hot_Topic`
- `Participants_Count`

主要函式：

- `fetchSessions()`
- `fetchSessionById()`

#### Transcripts

用途：

- 逐字內容
- 段落排序
- 角色
- 行號
- 按讚

主要函式：

- `fetchTranscripts(sessionSid)`

已抽取欄位：

- `Line_ID`
- `Role`
- `Action`
- `Content`
- `Order`
- `Merge_Group_ID`
- `Like_Count`

#### Interactions

用途：

- 段落評論
- 論壇文章
- 論壇回應
- 審核中的互動內容

主要函式：

- `fetchComments()`
- `createComment()`
- `fetchForumPosts()`
- `fetchForumPostById()`
- `fetchForumComments()`
- `createForumPost()`
- `fetchAllApprovedParagraphComments()`

#### Contact

用途：

- 聯絡訊息與匿名表單

主要函式：

- `createContact()`

---

## 8. API 架構與目前機制

### 8.1 API 總體策略

前端不直接連 Notion，而是透過 Next.js Route Handlers：

- 保護 Token
- 統一做驗證與輸入檢查
- 集中做錯誤處理
- 加入 rate limit

### 8.2 已存在 API

#### `/api/cms`

用途：

- 讀取全站 CMS 設定

#### `/api/sessions`

用途：

- 讀取庭次列表

機制：

- `revalidate = 60`
- 由 `fetchSessions()` 提供資料

現況：

- server log 顯示本地執行有 500 錯誤

#### `/api/transcripts/[id]`

用途：

- 讀取單一庭次工作區資料

回傳內容：

- `session`
- `transcripts`
- `comments`

特殊機制：

- 如果是特定 session id，先嘗試從本地 fallback transcript 檔案讀取
- 失敗再回退到 Notion

這是一個很關鍵的過渡機制，代表團隊正在處理：

- Notion 不穩定或資料尚未完全整理
- 某些重要庭次需要先用本地資料保證可展示

#### `/api/comments`

用途：

- 讀取段落評論
- 建立段落評論

保護機制：

- IP rate limit
- 長度上限
- 基本欄位檢查

#### `/api/forum`

用途：

- 讀論壇列表
- 發論壇文章

保護機制：

- IP rate limit
- 文章長度上限
- category 白名單

#### `/api/contact`

用途：

- 發送聯絡表單

保護機制：

- IP rate limit
- 字數上限
- category 白名單

#### `/api/like`

用途：

- 對逐字／互動／論壇按讚

機制：

- rate limit
- 同 IP 同 target 一小時內不可重複按讚

#### `/api/stats`

用途：

- 讀網站統計

#### `/api/trending`

用途：

- 讀熱門逐字
- 熱門評論
- 熱門文章

---

## 9. 關鍵機制說明

### 9.1 CMS 機制

首頁文案與部分站點內容來自 `Global_Settings_DB`。

好處：

- 不必改程式就能更新文案
- 後台維護者可直接在 Notion 操作

限制：

- 若 Notion 失敗，首頁某些內容就會失去資料來源

### 9.2 本地 fallback transcript 機制

這是目前很重要的「保命設計」。

在 `/api/transcripts/[id]` 中，針對特定 session：

- 先讀本地檔案
- 本地失敗才回 Notion

這顯示平台目前尚處於資料整理與系統遷移並行的階段。

### 9.3 共構編輯器機制

在 `sessions/[id]` 中：

- 左側是 transcript
- 右側是文章編輯器
- 點逐字行可插入 citation

這是目前最接近產品差異化的核心互動。

### 9.4 審核流程機制

從 `createComment()`、`createForumPost()` 可看出：

- 新建立內容預設不是直接公開
- 會以 pending review 狀態進 Notion

這是非常重要的治理機制，表示平台不是完全開放貼文，而是採：

- 投稿
- 審核
- 公開

### 9.5 熱門與統計機制

已經有：

- `fetchTrendingNotes()`
- `fetchTrendingComments()`
- `fetchTrendingArticles()`
- `fetchSiteStats()`

可支撐首頁的熱門區塊與數據展示。

### 9.6 rate limit 與防濫用

`lib/rateLimiter.ts` 採簡單記憶體內限流：

- 60 秒內最多 5 次請求
- 同 IP 對同 target 1 小時內不可重複 like

優點：

- 簡單
- 本地開發可立即使用

限制：

- 僅適合單實例
- 部署到 serverless / 多實例環境不夠穩健
- 重啟即失去狀態

---

## 10. 視覺與前端實作策略

### 10.1 視覺風格

目前網站走的是：

- 中文內容導向
- 編輯感、筆記感
- 法庭／知識平台混合視覺
- 使用米白、綠、棕、灰黑作為主色

### 10.2 主要前端工具

- Tailwind CSS
- Framer Motion
- Lucide icons
- 自製 shared UI primitives
- `react-resizable-panels`
- Tiptap

### 10.3 動效策略

首頁已有大量動效：

- scroll progress bar
- navbar 變化
- hero 與卡片 hover
- typewriter
- 數字 counter

這表示首頁已不是 wireframe，而是偏向可展示版本。

---

## 11. Git 與目前施作狀態判斷

### 11.1 目前分支

- `feat/optimization-plan`

### 11.2 最近 5 筆 commit

1. `feat: add Latest Restoration card to hero right column`
2. `style: compact horizontal navbar + update typewriter texts and slow speed`
3. `style: navbar square layout + tighten Project Origin spacing`
4. `fix: remove duplicate Latest Restoration section`
5. `fix: reorder sections - Prerequisites now follows Project Origin, remove redundant button, add Latest Restoration section`

### 11.3 Git 工作樹狀態解讀

目前工作樹顯示：

- 新版文件與新頁面已經存在，但仍有不少未提交內容
- `app/sessions/[id]/page.tsx`、`components/Navbar.tsx`、`package.json` 等仍在修改
- 新頁面資料夾如 `app/about/`、`app/guide/`、`app/knowledge/`、`app/rankings/` 仍屬未提交狀態

這代表：

- 優化計畫已在執行中
- 但尚未收斂成一個乾淨穩定的里程碑提交

---

## 12. 目前已完成、半完成、未完成清單

### 12.1 已完成度高

- 新版首頁視覺與區塊編排
- 新版導覽列骨架
- 新版 IA 主要路由建立
- Knowledge 頁面第一版
- Notion 圖片白名單設定
- sessions/[id] 雙欄工作區原型
- Tiptap 容器接入
- API 層基本結構
- Notion CRUD 基本整合
- rate limit 與 duplicate like 基本保護

### 12.2 已有架構但尚未成熟

- `/sessions` 庭次列表的穩定資料供應
- `/forum` 與論壇文章全流程
- citation 到原文 hover / 定位的完整體驗
- 從工作區直接送出文章到論壇的真實串接
- mobile navbar 完整互動
- CMS 與靜態內容的邊界收斂

### 12.3 尚未完成或明顯待補

- API 500 問題修復
- Notion schema 與實際程式邏輯對齊
- forum / interactions / forum_db 的資料模型收斂
- 更完整的錯誤處理與 fallback 策略
- serverless 環境可用的正式 rate limit
- 測試
- 型別與資料驗證層強化
- 文章發佈、審核與工作區串流的完整閉環

---

## 13. 現在最重要的阻塞點

### 13.1 API 500

`server_run.log` 顯示：

- `GET /api/transcripts/s-114-1-6 500`
- `GET /api/sessions 500`

這是目前最直接影響實際可用性的問題。

### 13.2 Notion schema 與程式碼不完全一致

從文件與程式觀察到幾個可能風險：

- 文件說明 6 個 DB，但 forum 相關實際查詢偏向 `Interactions_DB`
- 某些 property 類型似乎在程式中以 `title`、`select`、`relation` 混用
- 這很可能就是目前 500 的主因之一

### 13.3 過渡架構仍並存

目前專案同時存在：

- 新版 IA 頁面
- 舊版 page / 舊版命名
- 本地 fallback transcript
- Notion 正式資料流

這是正常過渡現象，但也讓 AI 接手時容易誤判主路徑。

---

## 14. AI 接手時應遵守的實務判斷

### 14.1 先把這個專案理解成「正在重構中的 Next.js + Notion 平台」

不是從零開始。

### 14.2 目前最成熟的部分是：

- 首頁展示
- 新 IA 的方向
- sessions 工作區原型

### 14.3 目前最不穩的部分是：

- Notion 實際資料讀取
- schema 與實作對齊
- forum / comment / article 閉環

### 14.4 不應再依賴舊原型

- `old_prototype_archive` 只作歷史參考
- 不應再作為主要實作來源

### 14.5 後續修改優先順序建議

1. 修復 `/api/sessions` 與 `/api/transcripts/[id]` 的 500
2. 對齊 Notion schema 與 `lib/notion.ts`
3. 打通 sessions 工作區到 forum 發文的真實提交流程
4. 補強 citation hover / scroll / 定位
5. 收斂 forum 與 interactions 的資料模型
6. 補測試與部署穩定性

---

## 15. 建議的後續文件體系

若要讓後續 AI 長期穩定接手，建議把文件分成四份：

1. 產品與資訊架構書
2. Notion schema 對照書
3. API 與資料流規格書
4. 施工進度與待辦清單

本文件目前扮演的是整體總覽與接手地圖。

---

## 16. 總結判讀

這個專案目前不是「只剩想法」，也不是「已完整上線」。

它的真實階段比較像：

「新版產品架構與關鍵互動已被實作出第一輪可見版本，但資料層與正式運作邏輯仍在校準與打通。」

換句話說：

- 產品方向已經很清楚
- IA 重整已開始落地
- 核心工作區原型已建立
- API 與 Notion 基礎整合已存在
- 但距離穩定可運行版本，還差資料層修復、模型收斂與流程閉環

---

## 17. AI 一句話接手摘要

這是一個以 Next.js 14 + Notion API 為核心的社工法庭逐字共構平台，現正從舊原型遷移到新版 IA 與雙欄工作區架構；首頁與 knowledge 頁已有高可見度成果，sessions/[id] 已有可操作原型，但 sessions / transcripts API 仍有 500，且 Notion schema 與實作尚需收斂，是當前最優先的技術任務。
