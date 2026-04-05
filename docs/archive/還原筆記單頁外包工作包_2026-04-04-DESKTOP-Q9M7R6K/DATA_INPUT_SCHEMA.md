# 資料輸入格式

## 目標

外包 AI 應把資料整理成接近以下結構。

## Session metadata

```json
{
  "metadata": {
    "id": "s-114-1-6",
    "title": "114年度訴字第51號過失致死等案（一審審理庭第六場次）",
    "date": "2026-02-26",
    "summary": "場次摘要",
    "status": "已公開",
    "source": "local-json",
    "tags": ["最終言詞辯論", "檢方論告"]
  }
}
```

## Transcript item

```json
{
  "id": "p10",
  "type": "dialogue",
  "role": "審判長",
  "action": "接續發言",
  "content": "逐字內容"
}
```

## Type 說明

- `dialogue`
  - 一般對話段
- `stage`
  - 程序切換、階段標記

## 必填欄位

### metadata

- `id`
- `title`
- `date`
- `summary`

### transcript item

- `id`
- `type`
- `content`

### dialogue 建議欄位

- `role`
- `action`

## 命名規則

- 場次段落 id 使用：
  - `p1`
  - `p2`
  - `p3`
- 不要跳號
- 同一場次內不可重複

## 整理原則

- 保持原始語意
- 可修正常見格式問題
- 不可新增立場性文字
- 不可自行濃縮成摘要取代原文
