# 匯集區正式發布機制落地紀錄

日期：`2026-04-11`

## 這次完成了什麼

本輪已把 `匯集區` 的正式發布機制，從「只有技術決策稿」推進到「可操作的本地發布鏈」。

核心原則：

- 審查台核准 != 立刻出現在前台
- 前台 `匯集區` 以 `published snapshot` 為正式來源
- 正式上線需經過本地發布匯出與部署

## 目前實作結果

### 1. 審核狀態改成兩階段

- `待審核`
- `已核准`（待發布）
- `已發布`
- `退回修改`
- `已封存`

其中：

- 審查台／文章管理頁按下核准後，現在會把文章設為 `已核准`
- 不再直接把文章設成 `已發布`

### 2. 前台讀取順序已調整

以下 API 現在會先讀 `published snapshot`：

- `app/api/forum/route.ts`
- `app/api/forum/[id]/route.ts`

只有當本地 `data/published-articles/index.json` 為空時，才會 fallback 去讀後端已發布文章。

### 3. 正式發布腳本已建立

#### 匯出待發布文章

- `npm run articles:publish:prepare`

作用：

- 從 Notion 讀取 `已核准` + `已發布` 的文章
- 生成：
  - `data/published-articles/index.json`
  - `data/published-articles/{slug}.json`
- 同步輸出：
  - `.release-artifacts/published-articles-manifest.json`

#### 部署成功後回寫發布狀態

- `npm run articles:publish:finalize`

作用：

- 讀取 `.release-artifacts/published-articles-manifest.json`
- 將本次 manifest 中原本 `已核准` 的文章，回寫為 `已發布`

### 4. 一鍵正式發布流程已建立

- `npm run release:prod`

流程：

1. `env:check`
2. 匯出 publishable articles
3. `articles:validate`
4. `build`
5. `vercel deploy --prod --yes`
6. `smoke:public:prod`
7. 回寫 Notion 狀態為 `已發布`

### 5. dry-run 驗證已通過

本輪實際驗證：

- `npm run env:check`
- `npm run release:prod -- -DryRun`
- `npm run articles:publish:prepare`
- `npm run articles:validate`
- `npx tsc --noEmit --incremental false`
- `npm run build`

結果皆通過。

## 目前還沒有做的

以下仍屬下一階段：

1. `published_dirty` / `withdrawn` 的完整後台欄位與 UI
2. 已發布文章再次修改後的 dirty 同步提示
3. 自動更新治理文件（ledger / baseline / source of truth）
4. 審查台內直接觸發本地發布的操作介面

## 操作建議

若要正式把 `已核准` 文章上線：

1. 在後台審查台核准文章
2. 本地跑：
   - `npm run release:prod`
3. 等 deploy 成功後，再確認前台 `匯集區`

## 注意事項

本機發布腳本會寫入 repo 內的：

- `data/published-articles/index.json`
- `data/published-articles/{slug}.json`

因此這條流程本質上仍屬：

> 本地受控發布，不是 production 後台直接改 repo。

這是目前刻意保留的安全控制點。
