# Published Articles Store

這個資料夾是 `匯集區` 的前端公開內容庫。

用途：

- 保存已通過審核、且已匯出到前端的公開文章 snapshot
- 提供首頁「目前已形成論述」與 `匯集區` 使用的公開索引
- 讓前台在後端維護或異常時，仍可穩定讀取已公開文章

## 目前結構

- `index.json`
  - 已公開文章的輕量索引
- `{slug}.json`
  - 單篇文章的公開 snapshot

## 原則

1. 這裡只放已公開內容，不放待審稿或草稿
2. `index.json` 只保存摘要與陳列欄位，不保存全文
3. 單篇全文保存在各自的 `{slug}.json`
4. 若文章撤下，匯出流程必須同步移除索引與對應 snapshot

## 正式發布流程（2026-04-11 起）

目前正式發布採用：

1. 待審文章核准後 -> Notion 狀態變成 `已核准`
2. 本地執行 `npm run articles:publish:prepare`
   - 從 Notion 匯出 `已核准` + `已發布` 文章
   - 重建 `index.json` 與 `{slug}.json`
   - 產生 `.release-artifacts/published-articles-manifest.json`
3. 驗證與部署
4. 部署成功後執行 `npm run articles:publish:finalize`
   - 將本次 manifest 中的 `已核准` 文章回寫成 `已發布`

若要一次跑完整鏈，可使用：

- `npm run release:prod`
