# 《匯集區資料模型與互聯規格 v0.1》

日期：`2026-04-05`  
狀態：`draft / pending adoption`

關聯文件：  
- [《匯集區發佈系統技術決策稿 v0.1》](C:\Users\User\OneDrive\Desktop\社工共構觀庭筆記平台\AGGREGATION_ZONE_PUBLISHING_TECH_DECISION_V0_1_2026-04-05.md)

---

## 0. 目的

本文件用來補齊 `匯集區` 的第二層核心規格：

1. 文章從待審到公開，需要哪些資料欄位
2. 已公開文章如何保存成穩定的 published snapshot
3. 文章如何和原始觀庭還原筆記建立「文字互聯」
4. 已公開、已修改、已下架三種公開狀態如何同步
5. 首頁與匯集區未來能安全讀取哪些摘要欄位

本文件刻意把**原始文字互聯**放在中心，而不是只把文章當作一般論壇貼文。

---

## 1. 本系統真正的核心

`匯集區` 的產品價值，不在於「可以投稿文章」，而在於：

> 每一篇已公開論述，都應能回扣到它所依據的觀庭還原筆記、場次、爭點與人物脈絡。

因此，V1 的資料模型必須先支撐：

- 文章來自哪一個主場次
- 文章還引用了哪些其他場次
- 文章是在談哪一類爭點
- 文章和原始還原筆記之間，至少保留一層可查的引用關係

若這些關係不存在，`匯集區` 就會退化成一般文章列表，不再具有「觀庭筆記共構」的獨特性。

---

## 2. V1 邊界

### V1 必做

- 支援單場次、跨場次、專題三種文章類型
- 支援後端待審池到 `ready_to_publish`
- 支援發布匯出為前端 published snapshot
- 支援文章與場次之間的正式關聯
- 支援首頁與匯集區讀取公開摘要資料
- 支援已發布後的 dirty flag 與撤下同步

### V1 非核心

- 文章圖片上傳與圖床管理
- 圖文混排的複雜媒體內容
- 行內精確註腳編號系統
- 自動化全文引用圖譜
- 全自動發布 pipeline

### V1 明確原則

> 匯集區 V1 為文字優先系統。  
> 圖片不是發布模型的前置依賴，也不作為判定系統完成度的核心要件。

---

## 3. 狀態模型

本文件把狀態分成三層看待：

### A. 審核池狀態

- `pending`
- `rejected`
- `ready_to_publish`
- `archived`

### B. 已公開同步狀態

- `published_synced`
- `published_dirty`
- `withdrawn`

### C. 投稿者可見狀態文案

- `投稿已送出`
- `已通過審核，等待發布`
- `已公開於匯集區`
- `需修正後重新投稿`

### 狀態說明

#### `published_synced`
- 代表文章最後一次審核版本，已與前端公開快照一致

#### `published_dirty`
- 代表文章曾經公開過，但後台內容又被修改
- 前端仍顯示舊版
- 必須再次執行發布匯出，才能同步

#### `withdrawn`
- 代表文章曾經公開過，但已撤下
- 前端 published snapshot 必須同步移除

---

## 4. 後端審核池資料模型（草案）

以下欄位以現有 `BackendArticle` 為基礎擴充。

```ts
type DraftSource =
  | 'single-session-editor'
  | 'multi-session-workbench'
  | 'admin-manual';

type ArticleType =
  | 'single-session'
  | 'multi-session'
  | 'thematic';

type ReviewStage =
  | 'pending'
  | 'rejected'
  | 'ready_to_publish'
  | 'archived';

type PublishSyncState =
  | 'never_published'
  | 'published_synced'
  | 'published_dirty'
  | 'withdrawn';

interface BackendArticleV2 {
  id: string;
  postId: string;
  author: string;
  contactEmail?: string;
  title: string;
  content: string;
  excerpt?: string;

  draftSource: DraftSource;
  articleType: ArticleType;

  category: string;
  targetTopic: string;
  targetSessionId: string;
  primarySessionId?: string;
  sourceSessionIds: string[];

  sourceTopicKeys?: string[];
  sourceWitnessLabels?: string[];

  slugDraft?: string;
  publishedSlug?: string;

  reviewStage: ReviewStage;
  publishSyncState: PublishSyncState;

  likes: number;
  createdAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  reviewNote?: string;

  lastPublishedAt?: string;
  lastPublishedVersion?: number;
}
```

### 欄位說明

#### `draftSource`
- 判斷文章來自哪個入口
- 用來輔助系統自動推定文章類型

#### `articleType`
- 公開層使用的正式類型
- V1 原則：
  - `單場筆記頁` 投稿 -> 預設 `single-session`
  - `跨場工作檯` 投稿 -> 預設 `multi-session`
  - `thematic` 由管理員於審核或發布前指定

#### `primarySessionId`
- 主場次
- 單場次文章通常等於 `targetSessionId`
- 跨場次文章可由管理員指定主入口場次

#### `sourceSessionIds`
- 來源場次清單
- 為 V1 最重要欄位之一
- 公開頁與首頁摘要都要能讀到

#### `sourceTopicKeys`
- 文章涉及的爭點鍵值
- 例如：
  - `child-abuse-identification`
  - `social-work-supervision`
  - `inter-agency-handoff`

#### `sourceWitnessLabels`
- 文章關聯的證人或角色標籤
- 先用 label，而不是過早綁定複雜 ID

#### `publishSyncState`
- 用來處理已發布後又編修、或已撤下的同步問題

---

## 5. 前端 published snapshot 模型（草案）

```ts
type PublishedArticleType =
  | 'single-session'
  | 'multi-session'
  | 'thematic';

interface PublishedArticleSnapshot {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  contentHtml: string;

  articleType: PublishedArticleType;

  primarySessionId?: string;
  sourceSessionIds: string[];
  sourceTopicKeys?: string[];
  sourceWitnessLabels?: string[];

  authorLabel: string;
  publishedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  publishedVersion: number;

  commentsOpen: boolean;
  likesSnapshot: number;

  linkageSummary?: {
    sessionCount: number;
    witnessCount: number;
    topicCount: number;
  };
}
```

### 說明

#### `contentHtml`
- 已清洗、可公開的最終 HTML
- 來源不是前台直接打 API 的原始審核池內容

#### `publishedVersion`
- 用來追蹤第幾次公開版本
- 之後若需要差異比對，才有基礎

#### `linkageSummary`
- 給首頁與匯集區卡片快速使用
- 避免每次都解析完整內容

---

## 6. Published 索引模型（輕量版）

V1 不應把所有全文塞進同一個 `index.json`。

### 建議結構

```ts
interface PublishedArticleIndexItem {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  articleType: 'single-session' | 'multi-session' | 'thematic';

  primarySessionId?: string;
  sourceSessionIds: string[];

  publishedAt: string;
  authorLabel: string;

  linkageSummary?: {
    sessionCount: number;
    witnessCount: number;
    topicCount: number;
  };
}
```

### 儲存方式

- `data/published-articles/index.json`
- `data/published-articles/{slug}.json`

### 原則

- `index.json` 只放摘要
- 單篇內容另存
- 之後若文章量變大，再自然擴展成分頁 index

---

## 7. 原始文字互聯規格（V1）

這是本文件最重要的區塊。

### V1 互聯目標

讓已公開文章至少能清楚回答：

1. 這篇文章主要是從哪一場來的？
2. 這篇文章還引用了哪些場次？
3. 這篇文章在談哪些爭點？
4. 這篇文章關聯到哪些證人或角色？

### V1 互聯層級

#### Level 1：場次互聯（必做）

- `primarySessionId`
- `sourceSessionIds[]`

這是最低限度，也是最優先完成的互聯。

#### Level 2：主題互聯（必做）

- `sourceTopicKeys[]`

讓文章不只連到場次，也連到具體爭點。

#### Level 3：人物 / 證人互聯（建議做）

- `sourceWitnessLabels[]`

先用 label 版本即可，不急著在 V1 做出完整人物主檔綁定。

#### Level 4：段落 / 區塊互聯（V2 再做）

例如：
- 某段文章引用哪一場的哪一節筆記
- 某句整理對應哪位證人的哪段陳述

這層很重要，但 V1 不應先把系統做得太重。

---

## 8. 文章與原始筆記的關係原則

### 原則 1

公開文章不是獨立生成物，而是：

> 由既有還原筆記脈絡整理出的公開論述版本。

### 原則 2

每篇文章在公開時，應至少附帶：

- 主要場次
- 來源場次數量
- 若有多場，應標示「跨場次」

### 原則 3

首頁與匯集區卡片不需要直接展示全文引用，但必須暗示：

- 此文依據多少場次
- 屬於單場次還是跨場次

### 原則 4

日後若要支撐更強的「論述可回扣原始筆記」能力，資料模型必須先保留：

- `sourceSessionIds`
- `sourceTopicKeys`
- `sourceWitnessLabels`

這三條先建立起來，未來才有擴展空間。

---

## 9. `slug` 與公開網址規格

### 生成時機

- 文章進入 `ready_to_publish` 後生成
- 由系統先提建議
- 管理員發布前可微調一次

### 唯一性原則

- `slug` 必須唯一
- 若標題重複，固定加短碼

### 公開後原則

- 已公開的 `slug` 不應頻繁修改
- 若需要更改，需保留舊路徑導向

---

## 10. 發布匯出規格

發布匯出腳本至少要處理三種情境：

### A. 新增公開

- 讀取 `ready_to_publish`
- 生成 snapshot
- 寫入 `index.json`
- 生成 `{slug}.json`
- 後端狀態改為 `published_synced`

### B. 已公開文章更新

- 若文章為 `published_dirty`
- 重新生成 snapshot
- 更新 `index.json`
- 覆蓋 `{slug}.json`
- 狀態改回 `published_synced`

### C. 已公開文章撤下

- 若文章被標示為 `withdrawn`
- 必須從 `index.json` 移除
- 對應 `{slug}.json` 必須刪除或停用
- 前台該頁應 404 或導向撤下說明

### 明確要求

> 發布匯出腳本不能只會新增，還必須會更新與刪除。

否則會出現幽靈頁面。

---

## 11. 管理端與投稿端狀態語言

### 管理端顯示建議

- `待審核`
- `已退回`
- `待發布`
- `已與前台同步`
- `已發布但有變更尚未同步`
- `已撤下`

### 投稿者可見建議

- `投稿已送出`
- `已通過審核，等待發布`
- `已公開於匯集區`
- `需修正後重新投稿`

### 原則

不要讓投稿者只看到：
- `已核准`

卻不知道前台尚未發布。

---

## 12. 異常與風險處理

### A. 投稿中斷

- 投稿 API 失敗時需回傳清楚錯誤
- 不應讓前台誤以為已投稿成功

### B. 重複審核

- 同一筆文章若已進 `ready_to_publish` 或更後狀態
- 應限制重複核准造成的競態

### C. 同步失敗

- 若發布匯出中途失敗
- 後端狀態不得誤標為 `published_synced`

### D. 撤下失敗

- 若前端 snapshot 沒被刪除
- 應記錄在發布 log，避免幽靈頁殘留

---

## 13. 首頁與匯集區使用規則

### 首頁「目前已形成論述」

只讀 `PublishedArticleIndexItem[]`，不讀全文。

卡片至少顯示：
- 標題
- 摘要
- 類型
- 主要場次
- 發布日期

### 匯集區

固定三類分區：
- 單場次筆記
- 跨場次整合
- 專題 / 綜合論述

### 單篇文章頁

讀單篇 snapshot，並顯示：
- 類型
- 主要場次
- 來源場次
- 發布日期

---

## 14. V1 驗收標準

只有當以下條件同時成立，才算 V1 可用：

1. 可投稿單場次文章
2. 可投稿跨場次文章
3. 審查台可核准 / 退回
4. 核准後可進 `ready_to_publish`
5. 可手動發布匯出
6. `匯集區` 能正確分區陳列
7. `單篇文章頁` 能顯示主要場次與來源場次
8. 已公開文章修改後會標示 `published_dirty`
9. 已撤下文章會從前端公開層同步移除

---

## 15. 結論

本文件的正式結論是：

> `匯集區` V1 不是一般文章系統，而是「以場次、爭點與原始觀庭筆記互聯為核心」的公開論述層。

因此 V1 必須優先做對的不是：

- 圖片
- 花俏編排
- 即時互動

而是：

- 狀態同步
- published snapshot
- 場次互聯
- 主題互聯
- 撤下與重發布機制

若這幾件事做穩，`匯集區` 才會成為整個觀庭筆記共構系統的核心，而不是一個名稱換過的論壇頁。
