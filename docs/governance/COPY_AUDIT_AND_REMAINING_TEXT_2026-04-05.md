# COPY AUDIT AND REMAINING TEXT - 2026-04-05

這份文件只管文案與命名狀態，不管功能邏輯。

## 目前已確認的情況

production 主路由都可開，但本地主線檔案仍有一批 user-facing copy 污染殘留。

這代表：

- 網站目前不是全面壞掉
- 但也不能假設所有頁面文案都是乾淨 UTF-8

## 高風險 copy 污染區

以下檔案已確認有明顯亂碼、舊命名或不適合直接部署的 copy：

- `lib/public-site.tsx`
- `app/page.tsx`
- `app/guide/page.tsx`
- `app/forum/page.tsx`
- `app/contact/page.tsx`
- `app/rankings/page.tsx`
- `app/sessions/compose/page.tsx`
- `app/sessions/[id]/page.tsx`
- `app/api/contact/route.ts`
- `app/api/submit-article/route.ts`
- `components/SubpageHeader.tsx`

## 目前已做過但還需要再確認的區域

### 匯集區

- `app/forum/page.tsx` 曾做過一輪重寫
- 但目前檔案內容仍有大量亂碼殘留
- 不應視為「已完全清乾淨」

### 公共命名層

- `lib/public-site.tsx` 是最關鍵的公共文字來源
- 目前仍有亂碼，會影響導航與站名系統
- 這個檔案應列為下一輪 copy cleanup 的最高優先之一

### 規範頁

- `app/guide/page.tsx` 是現在最容易影響全站語意的一頁
- 使用者已明確要求這頁以「平台限制與規範」為名
- 本頁應完整重寫，不建議局部補字

## 產品命名共識

下一位 AI 不應再回退到舊命名。

目前應採用：

- `/forum`：`觀庭筆記匯集區`
- `/guide`：`平台限制與規範`

避免再用：

- `論壇交流`
- `公開文章`
- `平台使用說明與規範`

## 對話用中文簡稱

建議沿用這組：

- 首頁
- 緣起頁
- 規範頁
- 知識頁
- 筆記總覽頁
- 單場筆記頁
- 跨場工作檯
- 匯集區
- 單篇文章頁
- 排行頁
- 聯絡頁

## 下一輪 copy cleanup 建議順序

1. `lib/public-site.tsx`
2. `app/guide/page.tsx`
3. `app/forum/page.tsx`
4. `app/contact/page.tsx`
5. `app/rankings/page.tsx`
6. `app/page.tsx`
7. `app/sessions/compose/page.tsx`
8. `app/sessions/[id]/page.tsx`
9. `app/api/contact/route.ts`
10. `app/api/submit-article/route.ts`
11. `components/SubpageHeader.tsx`

## 清理原則

- 不要把使用者指令誤寫成 UI 文案
- 優先清 user-facing text，再清 admin / API 回應文字
- 清完後至少重跑：
  - `npx tsc --noEmit --incremental false`
  - `npm run gate:encoding`
  - `npm run build`
  - `npm run smoke:public:prod`
