# 還原筆記單頁外包工作包

## 目的

這個資料夾是提供給另一個 AI 的單頁外包工作包。

用途：

- 讓另一個 AI 可以協助製作「還原筆記頁面」相關資料與頁面內容
- 不直接碰主專案其他頁面
- 讓主線工程之後可以穩定整合回主專案

## 外包 AI 的任務邊界

外包 AI 可以做：

- 整理單一場次的頁面資料
- 依照既有模板補齊頁面資料欄位
- 整理逐字稿段落
- 製作單頁所需的內容結構
- 產出可供整合的中間檔

外包 AI 不可以做：

- 改寫正式網站文案
- 改名頁面或路由
- 修改主專案全域元件
- 修改後端或 Notion schema
- 修改頁面工版或品牌語言

## 這個資料夾內的檔案

- `CURRENT_WORKSPACE_PAGE.tsx`
  - 目前正式單場次工作檯頁面的參考實作
- `EXAMPLE_SESSION_DATA_s-114-1-6.json`
  - 單一場次的乾淨示範資料
- `SCOPE_AND_RULES.md`
  - 外包工作邊界與不可碰原則
- `PAGE_TEMPLATE_SPEC.md`
  - 還原筆記單頁規格
- `DATA_INPUT_SCHEMA.md`
  - 資料格式要求
- `WORKFLOW_SOP.md`
  - 外包流程
- `QA_CHECKLIST.md`
  - 驗收清單
- `HANDOFF_OUTPUT_TEMPLATE.md`
  - 外包 AI 完成後要怎麼交付

## 建議使用方式

把這整個資料夾交給另一個 AI，並要求它：

1. 先讀 `SCOPE_AND_RULES.md`
2. 再讀 `PAGE_TEMPLATE_SPEC.md`
3. 再讀 `DATA_INPUT_SCHEMA.md`
4. 依照 `WORKFLOW_SOP.md` 工作
5. 最後依照 `HANDOFF_OUTPUT_TEMPLATE.md` 回報

## 主線整合原則

外包 AI 產出的內容應優先是：

- 結構化資料
- 可複製的中間稿
- 可供人審閱的整理結果

而不是直接覆蓋主專案檔案。
