# 社工共構觀庭筆記平台

Notion Schema 對照書

最後整理時間：2026-03-30

## 1. 文件目的

本文件專門整理此專案在 Notion 的資料模型，讓 AI 或協作者能快速理解：

- 專案用了哪些 Notion databases
- 每個資料庫大致承擔什麼角色
- 程式目前實際讀寫哪些欄位
- 文件理想模型與實作現況有沒有落差

本文件以 `lib/notion.ts`、`MAINTENANCE_MANUAL.md`、`AI_DEVELOPER_CONTEXT.md` 為主要依據。

---

## 2. 總體原則

本專案將 Notion 同時當作：

- CMS
- 結構化資料庫
- 後台維護介面
- 內容審核流程工具

程式中使用的環境變數：

- `NOTION_TOKEN`
- `NOTION_DB_GLOBAL`
- `NOTION_DB_SESSIONS`
- `NOTION_DB_TRANSCRIPTS`
- `NOTION_DB_INTERACTIONS`
- `NOTION_DB_FORUM`
- `NOTION_DB_CONTACT`

---

## 3. Database 清單

### 3.1 `Global_Settings_DB`

#### 角色

全站 CMS 設定庫，用來提供首頁與全站共用文案。

#### 程式實際用法

- `fetchAllCMS()`
- `fetchCMS(key)`

#### 程式實際使用欄位

- `Key`
- `Content`

#### 常見內容用途

- Top banner 文案
- Hero 標題
- Hero 描述
- Typewriter 文字
- 首頁區塊文字

#### 推測欄位型態

- `Key`: title
- `Content`: rich_text 或 title 以外的文字欄位

#### 補充

這個 DB 是目前 CMS 邏輯最清楚、風險最低的一個。

---

### 3.2 `Sessions_DB`

#### 角色

庭次主表。每一筆代表一場庭次或一組場次實體。

#### 程式實際用法

- `fetchSessions()`
- `fetchSessionById()`
- `createComment()` 內部拿來建立 relation
- `createForumPost()` 內部拿來建立 relation

#### 程式實際使用欄位

- `Session_ID`
- `Title`
- `Date`
- `Category`
- `Status`
- `Summary`
- `Hot_Topic`
- `Participants_Count`

#### 推測欄位型態

- `Session_ID`: title
- `Title`: rich_text
- `Date`: date
- `Category`: select
- `Status`: select
- `Summary`: rich_text
- `Hot_Topic`: checkbox
- `Participants_Count`: number

#### 目前用途

- 庭次列表
- 單一庭次查詢
- 首頁統計
- forum / comment 與 session relation

#### 風險提示

`fetchSessionById()` 以 `Session_ID` 的 title 等值查找；若 Notion 實際型態不是 title，會出錯。

---

### 3.3 `Transcripts_DB`

#### 角色

逐字內容主表。每一筆應代表一段或一行逐字內容。

#### 程式實際用法

- `fetchTranscripts(sessionSid)`
- `fetchTrendingNotes()`
- `incrementLike(..., 'transcripts')`

#### 程式實際使用欄位

- `Session_ID`
- `Line_ID`
- `Role`
- `Action`
- `Content`
- `Order`
- `Merge_Group_ID`
- `Like_Count`

#### 推測欄位型態

- `Session_ID`
  - 目前程式有兩種假設
  - 在 `fetchTranscripts()` 中以 `select` 條件過濾
  - 在 `fetchTrendingNotes()` 中又把 `Session_ID` 當 relation 取 `.relation[0]`
- `Line_ID`: rich_text 或 title
- `Role`: rich_text 或 select
- `Action`: rich_text
- `Content`: rich_text
- `Order`: number
- `Merge_Group_ID`: rich_text
- `Like_Count`: number

#### 這裡是目前最大風險區

`Session_ID` 欄位在不同函式中被當作兩種不同型態使用：

- `select`
- `relation`

這是造成 API 500 的高風險來源之一。

#### 特殊實作

`fetchTranscripts()` 中目前有過渡性邏輯：

- 查詢指定 session
- 額外 OR 一個 `S-206`

代表資料層仍有過渡期處理，不是完全乾淨的正式模型。

---

### 3.4 `Interactions_DB`

#### 角色

目前實務上最複雜的一個 DB。它不只放段落評論，也承擔論壇文章與論壇回覆。

#### 程式實際用法

- `fetchComments()`
- `createComment()`
- `fetchForumPosts()`
- `fetchForumPostById()`
- `fetchForumComments()`
- `createForumPost()`
- `fetchTrendingComments()`
- `fetchTrendingArticles()`
- `fetchAllApprovedParagraphComments()`
- `incrementLike(..., 'interactions')`

#### 程式實際使用欄位

- `Comment_ID`
- `Target_Line_ID`
- `Author`
- `Content`
- `Likes`
- `Status`
- `Type`
- `Target_Topic`
- `Target_Session`
- `Title`
- `Category`

#### 推測欄位型態

- `Comment_ID`: title
- `Target_Line_ID`: rich_text
- `Author`: rich_text
- `Content`: rich_text
- `Likes`: number
- `Status`: select
- `Type`: select
- `Target_Topic`: select
- `Target_Session`: relation
- `Title`: rich_text
- `Category`: select

#### 內部分流方式

目前透過 `Type` 區分類型：

- 段落評論
- 論壇文章
- 論壇文章留言

#### 優點

- 資料集中
- 論壇與評論共享按讚、審核、作者等欄位

#### 缺點

- 模型容易混淆
- 欄位負擔過多
- 容易和文件中的 `Forum_DB` 角色衝突

---

### 3.5 `Forum_DB`

#### 角色

文件中定義為論壇文章主庫。

#### 程式現況

雖然環境變數與 `DB.forum` 存在，但目前在 `lib/notion.ts` 中的論壇主要讀寫，實際上是走 `Interactions_DB`。

#### 解讀

目前有兩種可能：

1. 架構原本想把 forum 獨立成一個 DB，但尚未切換完成
2. 文件仍停留在理想設計，實作則已收斂到 interactions 單庫策略

#### 建議

這個差異必須在後續整理時做出明確決策，否則 AI 很容易誤用。

---

### 3.6 `Contact_DB`

#### 角色

聯絡與匿名訊息收件庫。

#### 程式實際用法

- `createContact()`

#### 程式實際使用欄位

- `Message_ID`
- `Sender_Name`
- `Category`
- `Content`
- `Attachment_URL`
- `Status`

#### 推測欄位型態

- `Message_ID`: title
- `Sender_Name`: rich_text
- `Category`: select
- `Content`: rich_text
- `Attachment_URL`: url
- `Status`: select

#### 狀態

模型明確，風險較低。

---

## 4. 程式內通用欄位讀取器

`lib/notion.ts` 裡有幾個欄位讀取 helper：

- `txt(page, prop)`
- `num(page, prop)`
- `sel(page, prop)`
- `dte(page, prop)`
- `chk(page, prop)`

這意味著目前整體讀取策略偏向：

- 直接從 raw Notion payload 取值
- 用簡化 helper 避免 TypeScript 與 SDK 型別負擔

### 風險

這種寫法速度快，但前提是欄位型別要很穩。  
一旦 Notion 欄位型別與假設不一致，就容易出現執行期錯誤。

---

## 5. 審核與狀態欄位策略

從程式與手冊可以看出，`Status` 是非常重要的治理欄位。

### 5.1 sessions 狀態

至少存在：

- 已公開／已恢復類型狀態

程式在 `fetchSessions()` 與 `fetchSiteStats()` 會只抓特定狀態。

### 5.2 interactions / forum 狀態

新建立內容預設不是公開，而是 pending review。

代表平台內容治理邏輯是：

1. 使用者送出
2. 進入待審核
3. 經審核後公開

這點對 AI 來說很重要，不應假設所有 POST 都是直接發布。

---

## 6. 目前模型落差與風險總結

### 6.1 最大落差：`Forum_DB` 與 `Interactions_DB`

文件說有獨立 `Forum_DB`，程式卻主要把論壇當成 `Interactions_DB` 的一種 `Type`。

### 6.2 第二大風險：`Transcripts_DB.Session_ID`

同一欄位被不同程式段落當成：

- select
- relation

這很可能是目前 500 的根源之一。

### 6.3 第三大風險：title / rich_text / select 的型別假設

像 `Session_ID`、`Title`、`Role` 等欄位，若 Notion 實際設定與程式不同，所有 query/filter 都會失敗。

---

## 7. AI 接手時的建議做法

### 7.1 先做 schema 驗證

在改功能前，先實際確認 Notion 中以下欄位的真實型別：

- Sessions_DB.Session_ID
- Sessions_DB.Status
- Transcripts_DB.Session_ID
- Transcripts_DB.Role
- Interactions_DB.Type
- Interactions_DB.Status
- Interactions_DB.Target_Session

### 7.2 不要先擴功能，先收斂模型

目前最重要的不是再加頁面，而是先把：

- DB 角色
- property 型別
- forum 與 interactions 關係

定清楚。

### 7.3 建議後續補一份 machine-readable schema

若條件允許，應補：

- 真實欄位名稱
- 真實 Notion property type
- 是否必填
- 誰在讀
- 誰在寫

這樣之後 AI 會穩定很多。

---

## 8. 一句話摘要

目前專案的 Notion 模型已足以支撐 CMS、庭次、逐字、互動、論壇與聯絡功能，但實作上仍存在 `Forum_DB` 與 `Interactions_DB` 的角色重疊，以及 `Transcripts_DB.Session_ID` 型別假設不一致等問題，這些是所有後續穩定化工作的核心前提。
