# GOVERNANCE REFRESH WORKFLOW - 2026-04-12

這份文件說明如何在重大部署、production recheck、或交接前，快速更新治理文件。

## 指令

本機重建治理文件：

```powershell
npm run docs:governance:refresh
```

若這次同時要把 production live recheck 追加到部署帳本：

```powershell
npm run docs:governance:refresh -- --append-ledger-recheck
```

## 目前會更新的文件

- `docs/governance/CURRENT_BASELINE_2026-04-04.md`
- `docs/governance/CURRENT_SOURCE_OF_TRUTH_2026-04-04.md`
- `docs/governance/AI_HANDOFF_2026-04-05_CURRENT_STATE.md`

## 可選附加動作

- 追加一筆 `DEPLOYMENT_LEDGER.md` 的 live recheck 記錄

## 目前會自動檢查

- git branch / HEAD
- dirty worktree 摘要
- production 主要正式路由狀態
- admin 路由保護狀態
- 首頁與匯集區關鍵 marker

## 注意

- 這份工具是治理更新工具，不會替你部署
- 若是正式 deploy，仍應另外跑：
  - `npm run env:check`
  - `npm run build`
  - `npm run release:prod`（依需求）
