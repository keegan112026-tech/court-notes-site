# REPO CLEANUP BASELINE — 2026-04-04

這份文件記錄的是第一輪 repo 清理與版本治理整理的基線。

目標不是把 repo 變成完全乾淨，而是把它從：

- 雜訊很多
- 正式 / 非正式版本混在一起
- 文件與路由訊號彼此干擾

收斂成：

- 正式主線較清楚
- 非正式頁有隔離
- 後續工作可在 gate 制度下繼續進行

---

## 1. 先前的主要噪音來源

### A. 根目錄暫存輸出

已確認並清除：

- `homepage.html`
- `error.html`
- `server_run.log`
- `server_output.log`
- `server_error.log`
- `out.log`
- `error.log`
- `curl.txt`

這類檔案應繼續由 `.gitignore` 忽略。

### B. 大體積但不等於版本混亂的來源

盤點時較大的資料夾包括：

- `.claude/`
- `node_modules/`
- `next-dev-cache/`

這些是容量來源，但不是版本判斷的唯一問題。

### C. 真正造成混亂的來源

- `old_prototype_archive/`
- `version_snapshots/`
- `outsourcing_packages/`
- `docs/legacy_archived_docs_2026-04-04/`
- preview / prototype / demo / history 路由

---

## 2. 已完成的清理

### A. 忽略規則補齊

`.gitignore` 已補上：

- `/.claude/`
- `/server_*.log`
- `/out.log`
- `/error.log`
- `/homepage.html`
- `/error.html`
- `/curl.txt`

### B. 退場檔案確認

以下檔案已確認不應回到正式主線：

- `app/ClientApp.tsx`
- `app/api/cms/route.ts`
- `app/prerequisites/page.tsx`
- `app/rules/page.tsx`
- `components/AboutView.tsx`
- `components/Footer.tsx`
- `components/HomeView.tsx`
- `components/SectionBanner.tsx`
- `components/SessionsListView.tsx`
- `components/TranscriptView.tsx`
- `components/InternalRouteNotice.tsx`
- `lib/mockData.ts`

### C. 空殘骸與舊 API

已退場：

- `/api/cms`
- `/prerequisites`
- `/rules`

### D. 非正式頁實體隔離

已完成 route groups：

- `app/(preview)/...`
- `app/(prototype)/...`
- `app/(demo)/...`
- `app/(archive)/...`

這代表網址可以不變，但檔案在 repo 內已開始分層。

---

## 3. 目前尚未解決的現實

工作樹仍然是 dirty。

這不是清理失敗，而是代表：

- 有正式功能改動尚未提交
- 有治理文件尚未提交
- 有 route isolation 與清理成果尚未提交

所以現在的原則不是「假裝乾淨」，而是：

**在已治理的 dirty worktree 上，透過 gate 與 scope lock 持續工作。**

---

## 4. 清理成果判斷

本輪清理的成功標準不是 `git status = 0`，而是：

1. 正式主線較清楚
2. 噪音輸出被排除
3. 非正式頁已被隔離
4. 舊 route / 舊元件不再誤導接手者
5. 後續工作能依 gate 流程進行

---

## 一句話結論

**repo 已從「混亂」清到「可治理」。**
