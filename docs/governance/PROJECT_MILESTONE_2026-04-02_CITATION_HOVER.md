# PROJECT MILESTONE 2026-04-02

## Milestone
工作檯引用 hover / 跳轉機制正式具現

## This Version Locks In
- `/sessions/[id]` 右側編輯區的引用不再是純文字或裸 HTML。
- 新插入的引用會以正式引用節點存在於編輯器中。
- 滑鼠移到引用上會顯示原始逐字段落預覽。
- 點擊引用會自動跳回左側對應逐字位置。
- 左側被定位的段落會暫時高亮，方便追溯。

## Why This Matters
這是整個「觀庭共構工作檯」和一般文章編輯器最大的差異化功能。  
未來若再調整工作檯框架，這個機制必須被視為不可退回的核心能力。

## Files
- `app/sessions/[id]/page.tsx`
- `app/api/submit-article/route.ts`
- `lib/backend/types.ts`
- `lib/backend/provider.ts`

## Also Added In This Milestone
- 投稿表單新增 `contactEmail` 欄位
  - 非必填
  - 不公開
  - 僅供後續修改或異動聯繫
- 投稿資料結構新增 `sourceSessionSids`
  - 為未來跨場次綜合論述預留
- 新增跨場次工作檯骨架
  - `app/sessions/compose/page.tsx`

## Regression Warning
如果未來再次重構 Tiptap / 工作檯：
- 不可以把引用重新退回成 `insertContent('<cite ...>')` 的純字串思路
- 不可以取消 `data-line` / `data-session` 這兩個追溯屬性
- 不可以讓公開文章與工作檯使用完全不同的引用資料格式

## Recommended Next Checkpoint
- 跨場次工作檯真的接到多場次資料
- 公開文章頁引用互動完全對齊工作檯
- 投稿與審核資料層正式回切到 Notion 或混合架構
