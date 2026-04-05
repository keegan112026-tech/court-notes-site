# Notion Manual Setup Steps

這份文件只記錄「需要你手動完成」的 Notion 布建步驟。

等這些完成後，就可以把主編務流程從 Firebase 切回 Notion。

## 1. 建立或確認 Notion integration

請在 Notion integrations 後台建立一個 integration，並取得：

- `NOTION_TOKEN`

之後把它填進 `.env.local`。

## 2. 準備需要的資料庫

這個專案至少需要下列幾種資料庫：

### A. `Sessions_DB`

用來記錄場次本體資料。

建議欄位：

- `Session_ID`
- `Title`
- `Date`
- `Category`
- `Status`
- `Summary`
- `Hot_Topic`
- `Participants_Count`

### B. `Interactions_DB`

這是最重要的一張，拿來存：

- 投稿文章
- 留言
- 審查狀態

建議欄位：

- `Comment_ID`
- `Type`
  - 可選值建議：
    - `論壇文章`
    - `文章留言`
    - `段落留言`
- `Author`
- `Contact_Email`
- `Title`
- `Content`
- `Category`
- `Target_Topic`
- `Status`
  - 可選值建議：
    - `待審核`
    - `審閱中`
    - `退回修改`
    - `核准`
- `Likes`
- `Target_Session`
  - relation 到 `Sessions_DB`
- `Source_Session_IDs`
  - rich text 或 multi-select
- `Review_Note`
- `Reviewed_By`
- `Reviewed_At`

### C. `Contact_DB`

用來接聯絡表單。

建議欄位：

- `Message_ID`
- `Sender_Name`
- `Category`
- `Content`
- `Attachment_URL`
- `Status`

## 3. 把 integration 分享到這些資料庫

請確認你建立的 integration 有被加入到上述資料庫的共享權限中，不然 API 會讀不到。

## 4. 填寫 `.env.local`

完成後，請在專案根目錄的 [`.env.local`](C:\Users\User\OneDrive\Desktop\社工共構觀庭筆記平台\.env.local) 補上：

```env
BACKEND_PROVIDER=notion
NOTION_TOKEN=你的 integration token
NOTION_DB_SESSIONS=你的 Sessions_DB id
NOTION_DB_TRANSCRIPTS=如果仍有使用，再填；沒有可先保留空白
NOTION_DB_INTERACTIONS=你的 Interactions_DB id
NOTION_DB_CONTACT=你的 Contact_DB id
```

如果你之後完全不再使用 Firebase，也可以把 Firebase 那組環境變數先留著但不啟用。

## 5. 建議的 Notion view

在 `Interactions_DB` 內，建議你另外建立幾個 view：

### 投稿待審

篩選：

- `Type = 論壇文章`
- `Status = 待審核`

### 留言待審

篩選：

- `Type = 文章留言`
- `Status = 待審核`

### 已核准文章

篩選：

- `Type = 論壇文章`
- `Status = 核准`

### 退回修改

篩選：

- `Status = 退回修改`

## 6. 狀態流程建議

建議審稿流程統一成：

1. `待審核`
2. `審閱中`
3. `退回修改`
4. `核准`

網站前台只讀：

- `核准`

## 7. 目前程式已經預留的欄位

目前投稿與跨場次工作檯已經會用到：

- `contactEmail`
- `sourceSessionIds`
- `targetSessionId`

所以你在 Notion schema 中，請務必把對應欄位也建好。

## 8. 補充說明

- 正式網站文案不再由 `CMS_DB` 或 `/api/cms` 作為主來源。
- 因此目前 Notion 手動布建不需要再建立 CMS 文案庫。

## 9. 完成後要通知我什麼

你完成手動布建後，只要回來告訴我：

1. `.env.local` 已填好
2. Integration 已授權到資料庫
3. `Interactions_DB` / `Sessions_DB` / `Contact_DB` 已建立

我下一輪就可以直接接手做：

- Notion provider 的正式審查流
- 投稿寫入 Notion
- 公開文章改讀 Notion 核准資料
- 留言改讀 Notion 核准資料
