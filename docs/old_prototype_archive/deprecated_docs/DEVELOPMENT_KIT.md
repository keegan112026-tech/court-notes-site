# 專案開發裝備包 (Development Kit)

為了順利開發並維護「社工觀庭筆記共構平台」，我們整理了您所需的「軟體、範本、技能」清單。

## 1. 必備軟體與環境 (Essential Software)
這是您電腦上必須安裝的基礎設施，相當於蓋房子的「地基」。

*   **[必要] Node.js (LTS 版本)**
    *   **用途**: 讓您的電腦能執行 Next.js 前端程式。
    *   **狀態**: 尚未安裝 (請參考 `SETUP_GUIDE.md`)。
    *   **下載**: [nodejs.org](https://nodejs.org/)

*   **[推薦] VS Code (Visual Studio Code)**
    *   **用途**: 修改程式碼的編輯器。
    *   **外掛建議**:
        *   `Tailwind CSS IntelliSense`: 寫樣式時會有自動提示。
        *   `ESLint`: 幫您檢查程式碼語法錯誤。

*   **[必要] Google Chrome / Edge**
    *   **用途**: 測試網頁與使用 Notion。

---

## 2. 程式碼範本 (Code Templates)
這是我們已經為您準備好的「半成品模組」，您**不需要**再去網路上找其他範本。

*   **前端範本 (The Website)**
    *   **位置**: `frontend/` 資料夾
    *   **內容**: 包含首頁、場次列表、逐字稿視圖、留言功能的所有 React 程式碼。
    *   **您擁有的**: 我們已經完成了 90% 的 UI 邏輯 (包含顆粒化互動)。

*   **後端範本 (The Connector)**
    *   **位置**: `backend/middleware.gs`
    *   **內容**: Google Apps Script 腳本，負責幫您把網站上的留言「搬運」到 Notion。

*   **資料庫藍圖 (The Skeleton)**
    *   **位置**: `NOTION_SCHEMA.md`
    *   **內容**: 四個核心資料庫的欄位定義表。

---

## 3. 關鍵技能 (Key Skills)
要維護這套系統，您不需要成為全端工程師，但掌握以下技能會讓您如魚得水：

*   **Notion 進階操作 (Database Management)**
    *   **必學**: 如何建立 `Relation` (關聯欄位) 與 `Rollup` (參照欄位)。
    *   **必學**: CSV/Excel 匯入技巧與批量編輯 (Batch Property Edit)。

*   **基礎終端機指令 (Basic Terminal)**
    *   您只需要會打這三個指令：
        1.  `cd` (進入資料夾)
        2.  `npm install` (安裝依賴)
        3.  `npm run dev` (啟動網站)

*   **Excel 資料整理**
    *   能夠依照我們定義的格式 (Line_ID, Content, Group_ID) 快速整理逐字稿。

---

## 4. 資源與帳號 (Accounts & Keys)
*   **Notion Integration Token**: 需要到 [Notion Developers](https://www.notion.so/my-integrations) 申請一組機器人 Token。
*   **Google Account**: 用於部署 Google Apps Script。

---

### 總結
您**不需要**再去購買或下載其他付費軟體。
目前的專案結構已經包含了所有必要的客製化代碼。您唯一缺少的「拼圖」就是 **Node.js 環境** 與 **Notion 資料庫的實際建立**。
