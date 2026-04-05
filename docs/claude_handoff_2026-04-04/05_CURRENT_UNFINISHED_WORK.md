# Current Unfinished Work

最後更新：2026-04-04

這份文件記錄本輪對話中做到一半、尚未完全收尾的工作，讓接手者不必重新挖對話。

## 1. 首頁正在進行中的重構

目前首頁不是靜止狀態，正在從一頁式主視覺收攏到更強的總覽頁。

### 已完成

- 首頁已拿掉對 `/api/cms` 的依賴
- 首頁次級還原筆記卡不再固定綁 `sessions[1]`
- `app/page.tsx` 已引入 `SessionsOverviewSection`
- 舊的 Hero 右側還原筆記卡區塊被隱藏，不再作為正式顯示
- 新的 guide 說明型右欄已插入首頁 Hero 後半部
- 首頁已開始直接嵌入 `/sessions` 的正式內容區塊

### 尚未收尾

- `app/page.tsx` 仍保留一大段被 `hidden` 的舊 Hero 右側卡程式碼，屬技術債，應清理
- 首頁與 `/sessions` 的完全對齊尚未最終定稿
- 首頁右半部要用什麼最終填充，仍在設計收斂中

## 2. `/sessions` 的後續打磨

### 已完成

- `v3` 風格資訊節奏已回歸到現行 `/sessions`
- 已發布完整筆記與跨場次工作檯已形成上方雙卡
- 證人色塊與 tooltip 已接上
- 準備程序庭已做整塊收合式呈現
- `12/11` 新場次已整合進資料流

### 尚未收尾

- 左側「已發布完整筆記」未來很可能改成 carousel 輪轉櫥窗
- 目前這個 carousel 想法已明確被討論過，但尚未正式導入
- 之後新增場次時，首頁與 `/sessions` 的展示關係仍要持續檢查

## 3. `/about` 與 `/about-preview`

### 已完成

- 新版計畫緣起內容已做成可對外展示的 `/about-preview`
- `/about` 目前技術上已直接承接 `about-preview` 內容
- `about-preview` 檔案結構已搬到：
  - `app/(preview)/about-preview`

### 尚未收尾

- 尚未決定之後是否要保留 `/about-preview` 作為獨立可訪問頁
- 導覽與正式頁命名策略雖已大致收斂，但 preview 身分仍需持續明確標示

## 4. preview / prototype / history / demo 隔離

### 已完成

- 已有 `ROUTE_ISOLATION_STRATEGY_2026-04-04.md`
- 已完成路由分類
- 已完成第一階段實體隔離：
  - `app/(preview)/...`
  - `app/(prototype)/...`
  - `app/(demo)/...`
  - `app/(archive)/...`

### 尚未收尾

- 尚未補齊所有文件對新 route group 的描述
- 尚未決定未來是否要進一步改成更明確的 public path，例如 `/preview`、`/archive`、`/lab`
- 尚未處理部署層面的 `noindex` / preview 可見性策略

## 5. 外包整合線

### 已完成

- 新的乾淨外包模板包已建立
- `114-51-1211` 場次已驗收可用並接進主資料流

### 尚未收尾

- 舊外包工作包仍留在專案內，容易干擾後續使用
- 建議接手者優先使用 clean 模板包，不要再沿用舊包
