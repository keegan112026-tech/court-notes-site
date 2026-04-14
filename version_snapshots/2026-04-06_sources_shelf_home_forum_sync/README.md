# 2026-04-06 Sources Shelf Home/Forum Sync

## Summary

這個 snapshot 記錄 2026-04-06 對「資料來源與鳴謝」櫥窗所做的同步調整：

- 匯集區原本上方的資料來源與鳴謝櫥窗，移到頁面最底部
- 首頁最底部新增同一套共享櫥窗
- 首頁與匯集區改為共用同一個元件，避免之後兩邊 copy 漂移
- 全站共享導覽中的 `熱門排行` 改成 `鳴謝與資料來源`
- 導覽連結改為指向首頁底部的 `#sources-acknowledgements`

## Files

- `00-homepage.latest.tsx`
- `01-forum.latest.tsx`
- `02-public-site.latest.tsx`
- `03-source-acknowledgement-shelf.latest.tsx`

## Production deployment

- deployment id: `dpl_4NrRauL2H8JBYu5Hm5bHTiekAtMy`
- production alias: `https://court-notes-site.vercel.app/`

## Notes

- 這次仍屬 dirty-worktree deployment
- `/rankings` 路由沒有刪除，但已不在共享導覽列中
- 之後若要改動這塊，應優先修改共享元件：
  - `components/SourceAcknowledgementShelf.tsx`
