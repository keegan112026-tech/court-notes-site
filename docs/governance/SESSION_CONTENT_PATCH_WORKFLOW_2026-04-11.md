# Session 內容修訂 Patch 流程

## 為什麼要補這個流程

目前 `data/sessions/*.json` 是正式公開內容來源。過去修正文句時，常直接手改單一 JSON 檔，雖然快，但會留下三個問題：

1. 很難回頭知道哪一句為什麼改
2. 沒有固定的 before / after 快照
3. 下一位接手者無法快速判斷某次修訂是文字勘誤、法庭筆錄補完，還是 metadata 調整

因此從 2026-04-11 起，新增正式的 session patch 流程。

## 正式流程

1. 先在：
   - `data/session-patches/drafts/`
   建立 patch JSON
2. 先跑 dry run：
   - `npm run sessions:patch:dry-run -- --patch <patch.json>`
3. 確認命中行數與取代內容都正確
4. 正式套用：
   - `npm run sessions:patch -- --patch <patch.json>`
5. 套用後自動留存：
   - `version_snapshots/session-patches/<patchId>/`

## 目前 patch 能做的事

### `replace-transcript-text`

適用於：

- 修正逐字稿中的錯字
- 名詞修正
- 補回原始筆錄中的遺漏詞

### `replace-metadata-text`

適用於：

- 修標題
- 修 summary
- 修 metadata 內的單一字詞

## 稽核輸出

每次 patch 成功套用後，會留下：

- `before`
- `after`
- `result.json`

其中 `result.json` 會記錄：

- `patchId`
- `sessionId`
- 套用時間
- 命中次數
- 被碰到的 line id 或 field

## 原則

- 不再直接無記錄地手改 `data/sessions/*.json`
- 每次修訂都應優先走 patch 流程
- 如需大量重構整個 session，再另外建立專案級 migration，不混用單次 patch
