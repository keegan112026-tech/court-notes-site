# Notion Database Schema Design

此文件定義了「社工觀庭筆記共構平台」所需的四個核心資料庫結構。請依照以下規格在 Notion 中建立資料庫，並將其連接至您的 Integration Token。

## 1. Sessions_DB (主檔與場次庫)
**用途**: 管理首頁列表、場次狀態與元資料。

| Property Name | Type | Options / Format | Description |
| :--- | :--- | :--- | :--- |
| **Session_ID** | `Title` (Key) | e.g. "1141211" | 唯一識別碼，通常與案件編號或日期相關 |
| **Title** | `Text` | | 場次標題，e.g. "家庭支持系統與強制抽離之辯論" |
| **Date** | `Date` | | 開庭日期 |
| **Category** | `Select` | 兒少, 家事, 刑事 | 案件分類 |
| **Status** | `Status` | 草稿, 校對中, 已發布 | 前端只會抓取 "已發布" 的場次 |
| **Participants_Count** | `Number` | | 目前參與協作/觀看的人數 (可選) |
| **Summary** | `Rich Text` | | 列表頁顯示的簡短摘要 |
| **Hot_Topic** | `Checkbox` | | 是否為發燒話題 (人工勾選或自動計算) |
| **Transcripts** | `Relation` | Related to `Transcripts_DB` | 關聯到該場次的所有逐字稿行 |

---

## 2. Transcripts_DB (逐字稿內容庫)
**用途**: 儲存龐大的對話內容。每一行對話為一個 Page。

| Property Name | Type | Options / Format | Description |
| :--- | :--- | :--- | :--- |
| **Line_ID** | `Title` (Key) | e.g. "1141211-L001" | 全局唯一的行 ID，建議格式：`{SessionID}-L{SEQ}` |
| **Session_ID** | `Relation` | Related to `Sessions_DB` | 歸屬哪個場次 |
| **Role** | `Select` | 法官, 檢察官, 社工, 辯護人 | 角色，前端會根據此欄位渲染顏色 |
| **Content** | `Rich Text` | | 實際的對話內容 |
| **Order** | `Number` | | 排序用，確保對話順序正確 |
| **Merge_Group_ID** | `Text` | Optional | **人工區塊分組欄位**。若要將多行合併為一個互動區塊，請在此填入相同的自訂代碼 (e.g. "BLOCK-A")。前端會將相同 ID 的行渲染在一起。 |
| **Interactions** | `Relation` | Related to `Interactions_DB` | 關聯到該行的所有留言 |
| **Like_Count** | `Number` | | 該行的按讚數 (由 Middleware 更新) |

---

## 3. Interactions_DB (互動與留言庫)
**用途**: 儲存使用者投稿與按讚。

| Property Name | Type | Options / Format | Description |
| :--- | :--- | :--- | :--- |
| **Comment_ID** | `Title` (Key) | UUID | 系統生成的唯一 ID |
| **Target_Line_ID** | `Relation` | Related to `Transcripts_DB` | 針對哪一行對話發言 |
| **Author** | `Text` | | 投稿者暱稱 |
| **Content** | `Rich Text` | | 留言內容 |
| **Likes** | `Number` | | 該留言獲得的讚數 |
| **Status** | `Status` | 待審核 (Default), 核准, 隱藏 | 審核狀態。前端只抓取 "核准"。 |
| **Created_At** | `Created Time`| | 建立時間 |

---

## 4. Global_Settings_DB (全站配置庫)
**用途**: KV (Key-Value) 形式儲存靜態文案，方便非技術人員修改。

| Property Name | Type | Options / Format | Description |
| :--- | :--- | :--- | :--- |
| **Key** | `Title` | e.g. "Disclaimer" | 設定項目的鍵值 |
| **Value** | `Rich Text` | | 設定項目的內容 (支援 Markdown) |
| **Description** | `Text` | | 給小編看的備註說明 |

### 預設資料 (Default Data)
1.  **Key**: `Hero_Title` -> **Value**: "將法庭交鋒，轉譯為專業實務累積。"
2.  **Key**: `Disclaimer` -> **Value**: "本平台免責聲明內容..."
3.  **Key**: `Announcement` -> **Value**: "系統更新公告..."
