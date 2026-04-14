# Session Content Patch Workflow

這裡放的是「場次內容修訂 patch」本身，不是正式公開內容。

目的：

- 避免直接手改 `data/sessions/*.json` 卻沒有留下結構化修訂記錄
- 讓每次修訂都能有 `before / after / result` 快照
- 讓下一位接手的人知道某一句、某一段為什麼被改

## 目錄建議

- `templates/`
  - patch 樣板
- `drafts/`
  - 尚未套用的 patch

## 套用方式

```powershell
npm run sessions:patch -- --patch .\data\session-patches\drafts\your-patch.json
```

只預演、不實際寫檔：

```powershell
npm run sessions:patch:dry-run -- --patch .\data\session-patches\drafts\your-patch.json
```

## 套用後會留下什麼

每次成功套用，都會在：

- `version_snapshots/session-patches/<patchId>/`

產生：

- `<sessionId>.before.json`
- `<sessionId>.after.json`
- `result.json`

## 目前支援的 patch operation

### 1. `replace-transcript-text`

用來修正文稿內容。

可用 `match.lineId` 精準指定某一行，也可用 `match.contains` 找含特定片段的段落。

### 2. `replace-metadata-text`

用來修正：

- `metadata.title`
- `metadata.summary`
- `metadata.status`

這類 metadata 欄位中的文字。
