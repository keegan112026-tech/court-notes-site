# Data, Backend, and Relation Logic

最後更新：2026-04-04

## 1. 資料主線

### 本地資料

本地資料目前是還原筆記主線：

- `data/sessions-index.json`
- `data/sessions/*.json`
- `data/transcripts/*.json` 或現有 transcript 檔案

這些是：

- 場次清單
- 單場次 metadata
- 還原筆記內容
- 排序與主入口關聯

### Notion 後端

Notion 現在承接的是互動與審查層，不是正式文案主來源。

目前使用的資料庫：

- `Articles_DB`
- `Comments_DB`
- `Inbox_DB`
- `Moderation_Log_DB`

Notion 現在負責：

- 文章投稿
- 公開文章
- 留言
- Inbox / 聯絡 / 私密傳訊
- 審查記錄

## 2. 不再使用的舊方向

以下方向都已退場：

- `/api/cms` 作為首頁正式文案來源
- `CMS_DB` 作為正式文案主系統
- Firebase 作為目前主要正式後台方向

Firebase 相關文件仍存在，但屬歷史方案，不是現行主線。

## 3. sessions 資料整合邏輯

新增一篇還原筆記後，至少要連動這些地方：

1. 新增 `data/sessions/<session-id>.json`
2. 更新 `data/sessions-index.json`
3. 確認 `lib/local-data.ts` 能正確讀到
4. 確認 `/api/sessions`
5. 確認 `/sessions`
6. 確認 `/sessions/[id]`
7. 確認首頁是否有依排序正確更新

相關 SOP：

- `SESSION_NOTE_INTEGRATION_SOP_2026-04-04.md`
- `SESSION_NOTE_ACCEPTANCE_WORKFLOW_2026-04-04.md`

## 4. 人工排序原則

雖然資料可以依日期排序，但首頁與 `/sessions` 有時會採用人工排序。

人工排序屬內部操作指令，不得直接顯示在前台。

目前已知案例：

- `02/26` 被保留為首頁主筆記第一筆
- `12/11` 次之

這是結果層規則，不應在前台顯示「人工排序」之類的內部說明。

## 5. 首頁與 `/sessions` 的關係

目前方向是：

- `/sessions` 是還原筆記總覽的正式主頁
- 首頁逐步把 `/sessions` 的內容抽進來
- 但不代表首頁要取代 `/sessions`

也就是：

- 首頁負責導流與收攏
- `/sessions` 仍是正式總覽頁

