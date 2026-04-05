# Active Routes and Classification

最後更新：2026-04-04

## A. 正式主站路由

- `/`
- `/about`
- `/guide`
- `/knowledge`
- `/sessions`
- `/sessions/[id]`
- `/sessions/compose`
- `/forum`
- `/forum/[id]`
- `/contact`
- `/rankings`

## B. Admin 路由

- `/admin/login`
- `/admin/review`
- `/admin/articles`
- `/admin/inbox`

## C. 仍存在的 preview / prototype

- `/about-preview`
- `/guide-prototype`
- `/project-intention-prototype`

說明：

- 這些不是正式 IA 的一部分
- 但目前仍有實際用途
- 尤其 `/about-preview` 目前被當作較偏好的新計畫緣起版本使用

檔案結構上，目前這批頁面已開始進入實體隔離：

- `app/(preview)/about-preview`
- `app/(prototype)/guide-prototype`
- `app/(prototype)/project-intention-prototype`

## D. 歷史版面 / archive

- `/sessions/history`
- `/sessions/history/v1`
- `/sessions/history/v2`
- `/sessions/history/v3`

檔案結構上，目前已搬到：

- `app/(archive)/sessions/history/*`

## E. demo / experiment

- `/beautification-demo`
- `/demo`
- `/demo2`
- `/demo3`
- `/demo4`

檔案結構上，目前已搬到：

- `app/(demo)/beautification-demo`
- `app/(demo)/demo`
- `app/(demo)/demo2`
- `app/(demo)/demo3`
- `app/(demo)/demo4`

## 目前應遵守的路由原則

1. 正式導覽只應指向正式主站路由與必要的 admin 路由。
2. preview / prototype / history / demo 不應再被正式導覽主動曝光。
3. 如果使用者明確指定某個 preview 成為當前主參考，需在 handoff 中註明。

## 目前特殊狀態

`/about-preview` 雖然 technically 屬 preview，但目前在實際導覽與設計討論上已具準正式地位。

接手時不要直接刪除或忽視這一頁。
