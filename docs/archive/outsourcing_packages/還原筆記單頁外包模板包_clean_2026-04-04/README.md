# 還原筆記單頁外包模板包（乾淨版）

## 用途

這個資料夾是下一次委託外包 AI 時可直接交付的乾淨模板包。

它的目的不是保存某一次交付成果，而是提供：

- 穩定的任務邊界
- 清楚的資料格式
- 一致的驗收方式
- 主工程之後可直接吸收的交付格式

## 這一包的特點

- 不含前一次委託的交互污染檔案
- 不含舊的 handoff 成果
- 不含錯誤示範
- 只保留下次委託需要的模板、規格與範例

## 建議交付方式

把這整個資料夾交給外包 AI，並要求它依序閱讀：

1. `README.md`
2. `SCOPE_AND_RULES.md`
3. `PAGE_TEMPLATE_SPEC.md`
4. `DATA_INPUT_SCHEMA.md`
5. `WORKFLOW_SOP.md`
6. `QA_CHECKLIST.md`
7. `HANDOFF_OUTPUT_TEMPLATE.md`
8. `給外包AI的直接指令稿.md`

再讓它開始處理單一場次資料。

## 本包內附的參考檔

- `CURRENT_WORKSPACE_PAGE.tsx`
  - 目前正式單場次工作檯頁面的參考實作
- `EXAMPLE_SESSION_DATA_s-114-1-6.json`
  - 可直接對照的乾淨示範資料

## 主工程原則

外包 AI 的交付應優先是：

- 可解析的結構化資料
- 可閱讀的交接報告
- 可驗證的 metadata / transcript 結果

而不是直接覆蓋主專案檔案。
