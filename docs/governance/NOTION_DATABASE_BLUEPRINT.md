# Notion Database Blueprint

更新日期：2026-04-03

這份文件只整理目前網站「需要與後端互動」的資料結構。

核心原則：
- `sessions / transcripts / 逐字稿本體` 留在前端本地資料。
- Notion 只承接投稿、留言、Inbox、審查紀錄等編務資料。
- 正式網站文案不是 Notion 主資料流的一部分。

## 現行資料分工

### 前端本地資料
- 場次列表
- 各場次逐字稿
- 引用 hover / jump 所需段落資料
- 單場次與跨場次工作區的逐字閱讀體驗

### Notion 後端資料
- 文章投稿
- 留言投稿
- 聯絡、錯誤回報、內容更正、使用建議、私密傳訊
- 審查與發布紀錄

## 現行使用的 4 張資料庫

### 1. `Articles_DB｜觀庭共構文章`
用途：
- 承接單場次投稿文章
- 承接跨場次綜合文章
- 保存文章審查狀態與發布狀態

主要欄位：
- `標題`：Title
- `author_name`：作者名稱
- `contact_email`：不公開聯絡信箱
- `content_html`：文章內容
- `summary`：摘要
- `article_type`：單場次 / 跨場次 / 專題
- `primary_session_id`：主要場次代碼
- `source_session_ids`：引用來源場次
- `status`：待審核 / 審閱中 / 退回修改 / 已核准 / 已發布 / 已封存
- `reviewed_by`
- `reviewed_at`
- `review_note`
- `published_at`
- `likes_count`
- `comments_count`
- `last_activity_at`
- `created_at`
- `public_slug`
- `is_featured`

網站用途：
- 公開文章列表 `/forum`
- 單篇文章頁 `/forum/[id]`
- 排行榜 `/rankings`
- 後台審查 `/admin/review`

### 2. `Comments_DB｜公開文章留言`
用途：
- 承接公開文章底下的留言
- 管理留言審查狀態

主要欄位：
- `留言內容`：Title
- `content`
- `author_name`
- `article_id`
- `comment_type`：一般留言 / 補充 / 指正
- `status`：待審核 / 已核准 / 退回 / 已刪除
- `likes_count`
- `reviewed_by`
- `reviewed_at`
- `review_note`
- `created_at`
- `target_session_id`
- `is_sensitive`

網站用途：
- 單篇文章頁留言顯示
- 留言審查
- 留言互動統計

### 3. `Inbox_DB｜聯絡、回饋與私密傳訊`
用途：
- 承接不公開訊息
- 分流一般聯絡與敏感通報

主要欄位：
- `主旨`：Title
- `message_type`：一般聯絡 / 錯誤回報 / 內容更正 / 使用建議 / 私密傳訊
- `sender_name`
- `sender_email`
- `content`
- `attachment_url`
- `is_sensitive`
- `status`：新進 / 處理中 / 已回覆 / 已結案 / 已封存
- `internal_note`
- `created_at`
- `handled_by`
- `handled_at`
- `related_article_id`
- `related_session_id`

網站用途：
- `/contact` 提交
- 內部處理與回覆追蹤

### 4. `Moderation_Log_DB｜審查紀錄`
用途：
- 記錄管理者對文章、留言、Inbox 的審查與操作

主要欄位：
- `log_title`：Title
- `target_type`：article / comment / inbox
- `target_id`
- `action`：approve / reject / delete / publish / archive / edit
- `actor_name`
- `note`
- `acted_at`
- `target_status_before`
- `target_status_after`

網站用途：
- 後台審查追溯
- 未來共同管理員治理

## 現行互動規則對應

### 投稿
- 內容上限：10000 字
- 頻率限制：10 分鐘最多 3 篇
- 寫入：`Articles_DB`

### 留言
- 內容上限：1000 字
- 頻率限制：1 分鐘最多 4 則
- 寫入：`Comments_DB`

### 私密傳訊 / 聯絡
- 內容上限：3000 字
- 一般聯絡：10 分鐘最多 3 次
- 私密傳訊：10 分鐘最多 2 次
- 寫入：`Inbox_DB`

### 審查
- 文章與留言審查操作寫入：`Moderation_Log_DB`

## 不納入 Notion 主後台的資料
- 場次逐字稿全文
- 逐字稿段落映射
- 引用 hover / jump 本地資料
- 前端正式文案主內容

## 下一階段建議
- 將 `/admin/review` 擴充成更完整的站內控制台
- 增加 Inbox 處理頁與文章發布頁
- 保持 Notion 為編務後台，同時讓前端維持快速、穩定的本地內容讀取
