# Notion Backend Recommendation

## 結論先說

對這個專案目前的型態來說，最合理的長期方向是：

- `sessions / transcripts` 保持本地 JSON 或靜態資料
- `投稿 / 審查 / 公開文章 / 留言 / Inbox` 改以 Notion 作為主要後台
- 若未來有需要，再另外加上：
  - 快取層
  - webhook 自動化
  - n8n
  - Firebase Auth

也就是說，**Notion 很適合當這個專案的內容審查後台**，不需要因為它不是傳統資料庫就直接否定它。

## 為什麼 Notion 適合這個專案

### 1. 你的核心需求其實是「內容審閱」

這個網站不是一般高頻交易系統，也不是大型社群平台。

你真正需要的是：

- 收稿
- 審稿
- 退回修改
- 核准公開
- 文章狀態追蹤
- 團隊共同管理

這些其實正是 Notion 很強的地方。

### 2. Notion 天生就像 CMS

如果用 Firebase 當主審查後台，你最後還是得自己做：

- 審查列表
- 狀態欄位
- 編輯畫面
- 拖曳流程
- 管理介面

但 Notion 本身就已經提供：

- database
- board view
- table view
- status 欄位
- relation
- comment
- internal review workflow

對你現在這種內容型網站來說，Notion 幾乎就是現成 CMS。

### 3. 容量與檔案管理也比較符合你的需求

如果未來投稿不只文字，還可能有：

- 圖片
- 文件
- 補充附件

Notion 付費版通常比 Firebase 免費額度更不容易馬上撞牆，尤其在「稿件儲存與審閱」這種場景。

### 4. 管理者更容易上手

你之後若有共同管理員，Notion 的學習成本遠低於 Firebase Console。

這件事很重要，因為：

- 共同管理員不一定是工程師
- 你自己也不該每次都被迫進工程師介面處理內容

## 這個專案最適合的架構

### 冷資料

放本地：

- `sessions-index.json`
- `sessions/[id].json`
- transcript 段落資料

原因：

- 速度快
- 穩定
- 不受 Notion API 延遲影響
- 可直接支援工作檯引用 hover / jump

### 熱資料與編務資料

放 Notion：

- 投稿文章
- 審查狀態
- 編輯備註
- 留言
- 非公開聯絡與私密傳訊
- 聯絡訊息

補充：

- 正式網站文案不應再由 CMS 後台作為主來源覆蓋。
- 使用者已明確指定：正式命名、定義、文案應以前端承接與使用者提供為準。
- 因此，舊的 CMS 文案機制應視為歷史過渡殘留，而非現行主方案。

## 對 Firebase 的建議

Firebase 不是完全沒價值，但比較適合留在這些場景：

- 會員登入 / 身分驗證
- 未來如果要做真正的帳號系統
- 特定互動紀錄或即時功能

如果只是拿來當你現在的「稿件審查後台」，它反而不是最省力的選擇。

## 建議的最終方向

### 建議方案

採用混合架構：

- 本地 JSON：場次與逐字稿
- Notion：稿件、留言、審查、CMS

### 不建議方案

- 全部都丟進 Firebase
- 為了審稿而硬做一整套自家 CMS

這樣會增加大量維護成本，而且未必比較好用。

## 目前 repo 狀況

目前程式已具備 provider abstraction，因此可以切換：

- `BACKEND_PROVIDER=firebase`
- `BACKEND_PROVIDER=notion`

而且投稿資料模型已經開始支援：

- `contactEmail`
- `sourceSessionIds`

這代表後續切回 Notion 時，不需要把最近做好的工作檯與投稿框架整個重寫。

## 專業建議

如果以你現在的目標來看，我的正式建議是：

1. 保留本地 sessions / transcripts
2. 把 Notion 定位成主要編務後台
3. 讓前端投稿經過 Next.js API 後寫入 Notion
4. 用 Notion 做審查與退修
5. 網站前台只顯示 `approved` / `已核准`

這會是最符合你目前專案邏輯、成本、可維護性與團隊協作方式的選擇。
