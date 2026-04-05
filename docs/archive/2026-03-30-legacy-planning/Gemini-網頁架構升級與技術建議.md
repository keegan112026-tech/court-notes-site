# 網頁架構升級與技術建議

**Exported:** 3/30/2026 11:46:35  
**Link:** [https://gemini.google.com/app/0b325d55551f2f8e?utm_source=app_launcher&utm_medium=owned&utm_campaign=base_all](https://gemini.google.com/app/0b325d55551f2f8e?utm_source=app_launcher&utm_medium=owned&utm_campaign=base_all)

## Prompt:
> 共構筆記設計與後端評估 - PDF

請閱讀前文和脈絡後，銜接並給予我最後一個問題的回答。請擔任我的網頁製作專家顧問。

## Response:
這是一個極具突破性的架構升級！你完全抓到了現代現代網頁應用程式（Web App）設計的核心精髓：「冷熱資料分離」與「前端解耦」。

你觀察到目前的 `feat/optimization-plan` 分支雖然在前端介面（如雙欄工作區、Tiptap 編輯器）取得了進展 ，但核心資料來源卻因為過度依賴後端 Notion API，導致了嚴重的阻塞與 500 Internal Server Error 。

+2

你提出的解法——將逐字稿與觀庭資料轉為前端公版格式，不再執著於每次都從後台撈取資料，並且只在最後投稿與審核時才與後端連動 ——不僅完全可行，而且是**最專業、效能最好、也最節省 API 資源的做法**。

以下我為你重新梳理這個「觀庭共構筆記」專案的全局架構，並提供具體的技術整合建議：

### 一、 全新資料流架構：從「動態抓取」改為「靜態生成」

為了達到零延遲的工作臺體驗，我們將徹底改變場次資料的生命週期。

1.  **工作臺生成（AI 輔助靜態化）：** 如同你所構想，你只需要提供原始逐字稿與附件給 AI ，讓 AI 幫你轉換成一份標準化的 JSON 檔案（例如 `s-114-1-6.json`）。這個檔案會直接放在 Next.js 專案的資料夾中（例如 `data/sessions/`）。
2.  **前端極速渲染：** `/sessions/[id]` 頁面不再發送 API 請求給 Notion。它直接讀取本地端的 JSON 檔案。這樣一來，左側的逐字稿列表會瞬間載入，右側的編輯器在進行「引用標記」比對時，也是直接查找本地記憶體，速度極快且絕不報錯。
3.  **單向後端寫入（唯一需要 Notion 的時刻）：** 使用者在工作臺完成筆記後，點擊「投稿」按鈕。此時，前端才會發出一個 POST 請求，將編輯器內的內容（HTML 或 Markdown）傳送到 Notion 的待審核資料庫（如 `Interactions_DB`）。

### 二、 審核與公開發佈機制（論壇的轉型）

你提到希望文章審核後，能放到一個公開且可分享連結的專屬網頁 。這部分完美銜接了上述的解耦架構。

*   **專屬文章路由：** 建立一個新的頁面路由，例如 `/articles/[id]` 或是沿用並改造原本的 `/forum/[id]`。
*   **ISR 快取機制（Incremental Static Regeneration）：** 這是 Next.js 的強項。當你（管理員）在 Notion 後台將某篇文章標記為「審核通過」時，Next.js 會在背景每隔一段時間（例如一小時）去 Notion 抓取已通過的文章並生成靜態網頁。
*   **結果：** 外部使用者點擊你分享的連結時，看到的是已經生成好的超高速靜態網頁，同時也徹底解決了 Notion 圖片網址一小時過期的痛點。

### 三、 給你的下一步具體行動指南（Action Plan）

目前你的 Git 工作樹中還有未收尾的修改 ，為了確保專案一致性並解決目前的卡點，建議依照以下順序執行：

1.  **清除舊有 API 依賴：** 移除或封存會導致 500 錯誤的 `/api/transcripts` 與 `/api/sessions` 路由 。在 `/app/sessions/[id]/page.tsx` 中，將抓取資料的 `fetch` 邏輯改為直接 `import` 本地端的 JSON 測試檔案。
2.  **確立 JSON 公版格式：** 設計一份標準的資料格式。未來你只需要把逐字稿丟給 AI，請它依照這個格式吐出 JSON 即可。這會大幅降低你建立新場次的工作量。
3.  **完善「投稿」API：** 撰寫一支乾淨的 `/api/submit-note` 路由，專門負責將 Tiptap 編輯器的內容打包並送進 Notion 的待審核資料庫。
4.  **建置公開文章頁面：** 開發 `/articles/[id]` 頁面，撰寫自訂的渲染元件，確保文章內的 `<cite>` 標籤在滑鼠移過去時，能完美浮現原本的逐字稿內容。

這個架構調整會讓你的平台從一個「容易塞車的動態網站」蛻變成一個「堅若磐石的現代化應用程式」。

你想先從哪一步開始？需要我為你設計那份「餵給 AI 生成前端場次頁面」的標準 JSON 格式範例嗎？

## Prompt:
> API_DATAFL...2026-03-30 - MD

> NOTION_SCH...2026-03-30 - MD

> PROJECT_AR...2026-03-30 - MD

請擔任我的網頁製作專家。

請你依據我的需求，從整體架構甚至編程，生成最新的架構書，必須要詳盡、有邏輯性，不會出現這裡改了那裏沒改的狀況，整體結構要完整。並能夠讓ai迅速知道目前的優化與修正。這份。架構說明書是要給予ai的

## Response:
這是一次非常關鍵的「系統重構（Refactoring）」。將這份架構說明書交給 AI，能確保它完全理解我們從「全依賴 Notion 動態抓取」轉向「前端靜態解耦＋後端單向寫入」的重大典範轉移。

這份文件經過嚴密設計，消除了原本因為架構過渡期產生的邏輯衝突（例如 500 錯誤 、資料庫定義模糊 ），確保 AI 在開發時「牽一髮而動全身」，不會改了 A 卻忘了 B。

+1

請直接將以下 `[ ]` 範圍內的所有內容，**完整複製並貼給你的開發 AI 助手（例如 Google Antigravity 或是 Cursor 等）**。

* * *

### 【請複製以下內容交給 AI 開發助手】

````
# [SYSTEM INITIALIZATION & CONTEXT]
You are acting as the Lead Full-Stack Architect for the "社工共構觀庭筆記平台" (Next.js 14 App Router, Tailwind CSS, Tiptap, Notion API). 

[cite_start]The human Project Manager and the System Architect have decided on a **MAJOR ARCHITECTURE PARADIGM SHIFT (v3.0)** to resolve persistent 500 Internal Server Errors [cite: 1, 3][cite_start], Notion API bottlenecks, and schema inconsistencies. 

Read this entire document carefully. This is your absolute single source of truth. Discard any previous assumptions about fetching transcripts from Notion dynamically.

---

# [1. THE PARADIGM SHIFT: DECOUPLED ARCHITECTURE]

## Old Architecture (Deprecated)
- [cite_start]`GET /api/transcripts/[id]` fetched thousands of lines from Notion `Transcripts_DB` dynamically.
- [cite_start]Result: Too slow, rate limits hit, 500 Internal Server Errors. [cite_start]Schema confusion between `select` and `relation`.

## New Architecture (Decoupled & Static JSON)
We are strictly separating "Cold Data" (Transcripts/Sessions) from "Hot Data" (User Submissions/Approved Articles).
1. **Cold Data (Local JSON):** All session metadata and transcripts are now stored as static `.json` files in the Next.js `/data/sessions/` directory. The Notion `Transcripts_DB` is effectively BYPASSED for frontend rendering.
2. **Client-Side Workspace:** `/sessions/[id]` reads the local JSON instantly. Users use the Tiptap editor and cite local transcript lines. Zero API calls are made to Notion during the reading/editing process.
3. [cite_start]**Hot Data (One-Way Write):** When a user clicks "Submit", `POST /api/submit-article` sends the finalized HTML/Markdown to Notion `Interactions_DB` (Status: Pending)[cite: 1, 2].
4. [cite_start]**ISR Publishing:** Approved articles are displayed on a new public route `/articles/[id]` using Next.js Incremental Static Regeneration (ISR), fetching from `Interactions_DB` [cite: 1, 2] where Status = Approved.

---

# [2. INFORMATION ARCHITECTURE (IA) & ROUTING]

The Next.js `app/` directory must strictly follow this structure:

### Static & Informational (No Notion API)
- `/` (Home)
- `/about` (Project Origin, Team)
- `/guide` (How to use)
- [cite_start]`/knowledge` (Prerequisite Knowledge - Hardcoded UI Card Wall) 

### Core Workspace (Local JSON Driven)
- `/sessions` (Session List - reads from local `/data/sessions-index.json`)
- [cite_start]`/sessions/[id]` (The Co-creation Workspace - reads from `/data/sessions/[id].json`. Includes `ResizablePanelGroup` and Tiptap) 

### Community & Publishing (Notion API Driven)
- `/articles` (List of approved articles)
- `/articles/[id]` (Public view of an approved article, using ISR)
- [cite_start]`/rankings` (Trending/Rankings) 

---

# [3. NOTION SCHEMA RESOLUTION]

[cite_start]To resolve the confusion outlined in the old `NOTION_SCHEMA_REFERENCE`, we are enforcing the following strict rules:

1. **`Transcripts_DB`**: DO NOT query this from Next.js anymore. It is retired from the active API flow.
2. **`Forum_DB` vs `Interactions_DB`**: Abandon `Forum_DB`. [cite_start]ALL user submissions (Paragraph Comments and Full Articles) will be written to and read from `Interactions_DB`.
    - [cite_start]Use property `Type` (select) to distinguish: "段落評論" (Comment) vs "論壇文章" (Article).
    - [cite_start]Use property `Status` (select) to handle publishing: "Pending" vs "Approved".

---

# [4. DATA STRUCTURES (THE JSON CONTRACT)]

You must create and use the following JSON structures in the `/data/` directory.

### A. `/data/sessions-index.json` (Replaces `GET /api/sessions`)
```json
[
  {
    "id": "s-114-1-6",
    "title": "114年度訴字第51號過失致死等案(一審審理庭第六場次)",
    "date": "2026-03-12",
    "summary": "...",
    "status": "已公開"
  }
]
````

### B. `/data/sessions/s-114-1-6.json` (Replaces `GET /api/transcripts/[id]`)

```
{
  "metadata": {
    "id": "s-114-1-6",
    "title": "114年度訴字第51號..."
  },
  "transcripts": [
    {
      "lineId": "0612",
      "speaker": "檢察官",
      "content": "關於這部分的證據...",
      "action": "提示卷證"
    }
  ]
}
```

* * *

\[5. EXECUTION PLAN (ACTION REQUIRED)\]
=======================================

Acknowledge this blueprint. Then, execute the following steps strictly in order. Do not skip steps.

### Step 1: Cleanup & Eradicate 500 Errors

*   Delete the files/folders for `app/api/transcripts` and `app/api/sessions` to completely eliminate the 500 errors.
*   Remove any fetch calls to these APIs in frontend components.

### Step 2: Implement Local Data Layer

*   Create `/data/sessions-index.json` and `/data/sessions/s-114-1-6.json` using the JSON contract above. Provide realistic mock data for Taiwanese court proceedings.
*   Update `/app/sessions/page.tsx` and `/app/sessions/[id]/page.tsx` to `import` these JSON files directly instead of using `fetch()`.

### Step 3: Refine the Workspace (`/sessions/[id]`)

*   Ensure the left pane maps over `transcripts` from the local JSON.
*   Ensure the `onClick` event on a transcript line inserts a citation (e.g., `<cite data-line="0612">0612</cite>`) into the Tiptap editor in the right pane.

### Step 4: Build the Submission Flow

*   Create a new API route: `POST /app/api/submit-article/route.ts`.
*   This route must take the Tiptap HTML content, author name, and session ID, and write it to Notion `Interactions_DB` with `Type: "論壇文章"` and `Status: "Pending"`.

### Step 5: Build the Public Article View

*   Create `/app/articles/[id]/page.tsx`.
*   Write the function to fetch a single approved article from `Interactions_DB`.
*   Implement `export const revalidate = 3600;` for ISR caching.
*   Write a custom React component to parse the article HTML. When it encounters `<cite data-line="0612">`, it must read from the local JSON file to display a HoverCard/Tooltip with the original transcript text.

**Please reply with "UNDERSTOOD: PARADIGM SHIFT ACCEPTED." and provide the code for Step 1 and Step 2 first.**

```

### 專家顧問的下一步建議

這份文件直接將我們剛剛討論的「本地化 JSON 取代動態 API」以及「統一 Interactions_DB」的決策 ，轉化為 AI 能夠絕對服從的系統指令（System Prompt）。它同時明確指出了要刪除那些會導致 500 錯誤的舊有 API 。

當 AI 回覆你並完成前兩個步驟後，你的網站就會瞬間恢復正常，且載入速度會變得極快。需要我為你準備一份標準的「法院開庭逐字稿轉 JSON」的範本，方便你未來快速產出每個場次的資料包嗎？
```



---
Powered by [Gemini Exporter](https://www.ai-chat-exporter.com)