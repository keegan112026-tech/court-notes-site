# Firebase Migration Plan

更新日期：2026-03-31

## 1. 遷移原則

- 保留目前已打磨完成的大部分 UI
- `sessions / transcripts` 維持本地冷資料
- 互動型熱資料改由 Firebase 承接
- 遷移期間保留 Notion fallback，避免本地與正式站同時失效

## 2. 本次遷移目標

### 2.1 保留本地資料
- `data/sessions-index.json`
- `data/sessions/*.json`

### 2.2 轉移到 Firebase 的資料
- `articles`
- `comments`
- `contacts`
- `likes`（先以文件欄位累加為主）

## 3. Firestore 建議集合

### `articles`
- fields:
  - `postId`
  - `author`
  - `title`
  - `content`
  - `category`
  - `targetTopic`
  - `targetSessionId`
  - `likes`
  - `status`
  - `source`
  - `createdAt`

### `comments`
- fields:
  - `targetLineId`
  - `author`
  - `content`
  - `likes`
  - `status`
  - `type`
  - `targetTopic`
  - `targetSessionId`
  - `createdAt`

### `contacts`
- fields:
  - `name`
  - `category`
  - `content`
  - `attachmentUrl`
  - `status`
  - `createdAt`

## 4. 目前程式已完成的底層改造

- 已加入 `firebase-admin`
- 已建立 Firebase Admin 初始化：
  - `lib/firebase-admin.ts`
- 已建立 provider abstraction：
  - `lib/backend/provider.ts`
  - `lib/backend/types.ts`
- 以下 API 已切到 provider：
  - `/api/comments`
  - `/api/contact`
  - `/api/forum`
  - `/api/forum/[id]`
  - `/api/like`
  - `/api/stats`
  - `/api/submit-article`
  - `/api/trending`

## 5. 啟用 Firebase 的方式

在 `.env.local` 設定：

```env
BACKEND_PROVIDER=firebase
FIREBASE_PROJECT_ID=...
FIREBASE_CLIENT_EMAIL=...
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

若尚未完成 Firebase 憑證設定，可先維持：

```env
BACKEND_PROVIDER=auto
```

此時系統會：
- 有 Firebase 憑證就用 Firebase
- 沒有就退回 Notion

## 6. 下一步建議

1. 建立 Firestore collection 與索引
2. 匯入既有已核准文章與留言資料
3. 將 `BACKEND_PROVIDER` 切為 `firebase`
4. 逐步淘汰 `lib/notion.ts` 中的互動資料讀寫
5. 最後再處理審核後台與管理工具

## 補充

- 早期的 CMS 文案後台已不再符合現行規劃。
- 正式網站文案與命名不應由後端 CMS 覆蓋。
