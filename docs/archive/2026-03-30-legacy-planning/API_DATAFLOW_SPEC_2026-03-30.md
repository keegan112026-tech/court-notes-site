# 社工共構觀庭筆記平台

API 與資料流規格書

最後整理時間：2026-03-30

## 1. 文件目的

本文件專門整理專案目前的：

- API 路由
- 請求與回應用途
- 前端呼叫位置
- 後端對應 Notion 函式
- 主要資料流
- 目前存在的故障點與風險

這份文件的目標是讓 AI 不需要先讀完整個程式，就能快速理解資料是怎麼流動的。

---

## 2. 系統資料流總圖

目前主體資料流為：

1. 使用者進入前端頁面
2. React / Next 頁面呼叫 `/app/api/...`
3. API route 呼叫 `lib/notion.ts`
4. `lib/notion.ts` 直接與 Notion REST API 溝通
5. 回傳 JSON 給前端

簡化可表示為：

`Browser -> Next.js Page -> API Route -> lib/notion.ts -> Notion API`

---

## 3. API 分層設計

### 3.1 頁面層

負責：

- 顯示資料
- 觸發 fetch
- 收集表單輸入
- 驅動互動

### 3.2 API Route 層

負責：

- 隱藏 Notion Token
- 輸入驗證
- 限流
- 回傳一致 JSON 結構
- 錯誤攔截

### 3.3 Notion Service 層

`lib/notion.ts` 負責：

- Query databases
- 建立 pages
- 修改 like count
- 做欄位抽取與映射

---

## 4. API 一覽

### 4.1 `GET /api/cms`

#### 目的

取得全站 CMS 設定。

#### 對應函式

- `fetchAllCMS()`

#### 資料來源

- `Global_Settings_DB`

#### 前端用途

- 首頁 Hero 文案
- 首頁 banner 與動態文案

#### 快取策略

- `revalidate = 60`

#### 回應結構

成功：

```json
{
  "ok": true,
  "data": {
    "Hero_Title": "...",
    "Hero_Desc_1": "..."
  }
}
```

失敗：

```json
{
  "ok": false,
  "error": "..."
}
```

---

### 4.2 `GET /api/sessions`

#### 目的

取得庭次列表。

#### 對應函式

- `fetchSessions()`

#### 資料來源

- `Sessions_DB`

#### 前端用途

- 庭次總覽頁
- 首頁部分導流區

#### 快取策略

- `revalidate = 60`

#### 回應結構

成功：

```json
{
  "ok": true,
  "data": [
    {
      "id": "...",
      "sessionId": "S-114-1-6",
      "title": "...",
      "date": "...",
      "category": "...",
      "status": "...",
      "summary": "...",
      "hotTopic": true,
      "participantsCount": 0
    }
  ]
}
```

#### 目前狀態

本地 `server_run.log` 顯示此 API 有 500。

#### 主要風險

- `Status` filter 可能與 Notion 實際值不一致
- 欄位型別可能與程式假設不同

---

### 4.3 `GET /api/transcripts/[id]`

#### 目的

取得單一庭次工作區所需的全部核心資料。

#### 對應函式

- `fetchSessionById()`
- `fetchTranscripts()`
- `fetchAllApprovedParagraphComments()`

#### 回傳資料

- `session`
- `transcripts`
- `comments`

#### 特殊資料流

1. 先用 URL `id` 查 session
2. 成功後再讀 transcripts
3. 特定 session 先嘗試本地 fallback transcript
4. 最後載入所有 approved paragraph comments
5. 依 transcript line id 過濾出此庭次相關 comments

#### 本地 fallback 邏輯

對特定 session：

- `s-114-1-6`
- `S-206`

會先從本地 transcript 檔載入。

#### 快取策略

- `revalidate = 60`

#### 前端用途

- `/sessions/[id]` 共構工作區

#### 目前狀態

本地 `server_run.log` 顯示此 API 有 500。

#### 主要風險

- `Session_ID` 查詢欄位型別
- fallback data 與 Notion data 形狀是否一致
- comments line id 是否與 transcript id 完全對齊

---

### 4.4 `GET /api/comments?lineId=...`

#### 目的

取得單一逐字段落的評論。

#### 對應函式

- `fetchComments(lineId)`

#### 資料來源

- `Interactions_DB`

#### 過濾條件

- `Target_Line_ID == lineId`
- `Status == approved`

#### 回應結構

成功：

```json
{
  "ok": true,
  "data": [...]
}
```

失敗：

```json
{
  "ok": false,
  "error": "lineId required"
}
```

---

### 4.5 `POST /api/comments`

#### 目的

建立新的段落評論。

#### 輸入欄位

- `targetLineId`
- `author`
- `content`
- `sessionId`
- `topic`
- `type`

#### 對應函式

- `createComment(...)`

#### 實際寫入

- `Interactions_DB`

#### 防護機制

- rate limit
- 內容不可空白
- 內容長度上限 2000

#### 重要邏輯

新評論不是直接公開，而是寫成 pending review。

#### 前端用途

- 段落評論提交
- 未來工作區可能也會沿用

---

### 4.6 `GET /api/forum`

#### 目的

取得論壇文章列表。

#### 對應函式

- `fetchForumPosts()`

#### 實際資料來源

- 目前是 `Interactions_DB`
- 透過 `Type == 論壇文章類型` 篩選

#### 快取策略

- `revalidate = 60`

#### 回應

```json
{
  "ok": true,
  "data": [...]
}
```

---

### 4.7 `POST /api/forum`

#### 目的

建立論壇文章。

#### 輸入欄位

- `author`
- `title`
- `content`
- `category`
- `topic`
- `targetSessionSid`

#### 對應函式

- `createForumPost(...)`

#### 實際寫入

- 目前是 `Interactions_DB`

#### 防護機制

- rate limit
- title / content 必填
- content 長度上限 5000
- category 白名單

#### 重要邏輯

新文章預設也是 pending review。

#### 與工作區的關係

未來應由 `sessions/[id]` 右欄編輯器送出至此 API，形成共構閉環。  
目前這條閉環尚未真正打通。

---

### 4.8 `GET /api/forum/[id]`

#### 目的

取得單篇論壇文章與其回應。

#### 對應函式

- `fetchForumPostById(postId)`
- `fetchForumComments(postId)`

#### 回傳資料

- `post`
- `comments`

#### 快取策略

- `revalidate = 60`

#### 風險

`postId` 的語意需要再確認：

- 是 Notion page id
- 還是自定義 `Comment_ID`

目前函式 `fetchForumPostById()` 是走 `getPage(postId)`，比較像使用 Notion page id。

---

### 4.9 `POST /api/contact`

#### 目的

送出聯絡或匿名訊息。

#### 輸入欄位

- `name`
- `category`
- `content`
- `attachmentUrl`

#### 對應函式

- `createContact(...)`

#### 防護機制

- rate limit
- 內容必填
- 內容長度上限 5000
- category 白名單

#### 寫入資料庫

- `Contact_DB`

---

### 4.10 `POST /api/like`

#### 目的

對內容按讚。

#### 輸入欄位

- `targetId`
- `targetType`

#### `targetType` 允許值

- `transcripts`
- `interactions`
- `forum`

#### 對應函式

- `incrementLike(pageId, targetDb)`

#### 防護機制

- rate limit
- 一小時內同 IP 同 target 不可重複 like

#### 回傳

```json
{
  "ok": true,
  "data": {
    "newCount": 5
  }
}
```

#### 風險

實際上 `forum` 在資料模型上仍與 `interactions` 有重疊，這裡的 `targetType` 需與真實 DB 策略一致。

---

### 4.11 `GET /api/stats`

#### 目的

取得網站統計數據。

#### 對應函式

- `fetchSiteStats()`

#### 資料來源

- `Sessions_DB`
- `Interactions_DB`

#### 回傳欄位

- `totalSessions`
- `restoredSessions`
- `approvedComments`

#### 快取策略

- `revalidate = 60`

#### 前端用途

- 首頁 hero 統計數字

---

### 4.12 `GET /api/trending?type=...`

#### 目的

取得首頁熱門內容。

#### 支援 type

- `notes`
- `comments`
- `articles`

#### 對應函式

- `fetchTrendingNotes(3)`
- `fetchTrendingComments(3)`
- `fetchTrendingArticles(3)`

#### 前端用途

- 首頁熱門三欄

#### 快取策略

- `revalidate = 60`

#### 錯誤處理

- 未提供合法 type 會回 400

---

## 5. 前端主要資料流

### 5.1 首頁資料流

首頁 `app/page.tsx` 在 mounted 後同時發出：

- `/api/cms`
- `/api/sessions`
- `/api/stats`
- `/api/trending?type=notes`
- `/api/trending?type=comments`
- `/api/trending?type=articles`

再將資料分別灌入：

- hero / banner / typewriter
- 站點統計
- 熱門逐字
- 熱門評論
- 熱門文章

#### 風險

首頁高度依賴多 API 並行，一個 API 500 就可能讓首頁部分區塊缺資料。

---

### 5.2 庭次工作區資料流

進入 `/sessions/[id]` 時：

1. client component 讀 `params.id`
2. `fetch('/api/transcripts/[id]')`
3. 回來後設定：
   - `transcript`
   - `session`
4. 使用者點擊左側逐字行
5. `handleInjectCitation()` 把 citation 寫入 Tiptap

#### 目前尚未形成的資料流

右側編輯器內容尚未真正送到：

- `/api/forum`
- 或其他 article 發布 API

目前只停在 alert / placeholder 階段。

---

### 5.3 論壇資料流

理想資料流：

1. 列表頁讀 `/api/forum`
2. 單篇頁讀 `/api/forum/[id]`
3. 發文走 `POST /api/forum`
4. 回文應走 forum comment 流程

#### 現況

後端讀寫已存在，但前端全流程成熟度仍待確認。

---

## 6. 限流與保護機制

### 6.1 rate limit

`checkRateLimit(ip)`：

- 視窗：60 秒
- 次數：最多 5 次

應用在：

- `/api/comments`
- `/api/forum`
- `/api/contact`
- `/api/like`

### 6.2 duplicate like

`checkDuplicateLike(ip, targetId)`：

- 同 IP 對同目標 1 小時內不得重複 like

應用在：

- `/api/like`

### 6.3 侷限

這是 in-memory 方案，只適合：

- 本地開發
- 簡單單實例環境

若正式部署到 serverless，多實例時不能保證全域一致。

---

## 7. 快取與更新策略

大部分 GET API 使用：

- `revalidate = 60`

代表目前策略是：

- 不是每次請求都打 Notion
- 但內容最多 60 秒更新一次

### 影響

優點：

- 減少 Notion API 壓力
- 首頁與列表頁更穩

缺點：

- 審核剛通過的內容不會即時反映
- 若 Notion 圖片 URL 有時效性，仍需額外策略

---

## 8. 已知故障與風險點

### 8.1 `/api/sessions` 500

已在執行日誌出現。

### 8.2 `/api/transcripts/[id]` 500

已在執行日誌出現。

### 8.3 schema 不一致風險

最可能出錯的位置：

- Sessions filter
- Transcripts filter
- relation / select 混用

### 8.4 `forum/[id]` 的 id 語意

若前端傳的不是 Notion page id，而是自定義 post id，`getPage(postId)` 會失敗。

---

## 9. AI 接手時的實作順序建議

1. 先修 `GET /api/sessions`
2. 再修 `GET /api/transcripts/[id]`
3. 釐清 `forum` 是不是全面併入 `Interactions_DB`
4. 確認 forum detail 的 `[id]` 應傳 page id 還是業務 id
5. 打通 `sessions/[id]` -> `POST /api/forum`
6. 補 editor 內容儲存、預覽與引用互動

---

## 10. 一句話摘要

目前這個網站的 API 架構已經形成清楚的三層流：前端頁面、Next API route、Notion service，但 sessions 與 transcripts 兩條核心資料流仍不穩，且 forum / interactions 的模型尚待收斂，是現階段最優先需要修復與定義的部分。
