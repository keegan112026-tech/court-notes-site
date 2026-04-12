# 場次頁公版機制（Session Page Template Spec）

> AI 與維護者共用的規格書。新增場次、修改 UX、或與首頁元件勾連時，以本文件為唯一依據。

---

## 一、場次頁的組成架構

每個場次頁（`/sessions/[id]`）是**純動態**的：只需要一份 JSON 資料，頁面 UX 完全自動套用。

```
app/sessions/[id]/page.tsx          ← 主頁（薄層，只有 state 和 layout）
components/workbench/
  CitationChip.ts                   ← Tiptap 引用節點（不依賴任何 state）
  TranscriptPanel.tsx               ← 逐字紀錄（閱讀/引用）
  InlinePanel.tsx                   ← 逐段填寫
  EditorPanel.tsx                   ← 共構編輯（Tiptap）
  MobileReadHeader.tsx              ← 手機版精簡 Header
  OnboardingOverlay.tsx             ← 首次使用教學
  ReportSheet.tsx                   ← 段落錯誤回報
  ContributionSheet.tsx             ← 書寫說明抽屜
  WorkbenchHeader.tsx               ← 桌面版完整 Header
```

---

## 二、新增一個場次（3 步驟）

### 步驟 1：建立逐字稿 JSON

放在 `data/sessions/` 資料夾，命名為 `[sessionId].json`。

```json
{
  "metadata": {
    "id": "s-114-1-7",
    "title": "114年度訴字第51號 過失致死等案（一審審理庭第七場次）",
    "date": "2026-04-10",
    "summary": "宣判庭，法院宣讀判決主文。",
    "status": "published"
  },
  "transcripts": [
    {
      "id": "p001",
      "lineId": "p001",
      "type": "stage",
      "role": "系統/旁白",
      "speaker": "系統/旁白",
      "action": "",
      "content": "🏛️ 宣判庭開始"
    },
    {
      "id": "p002",
      "lineId": "p002",
      "type": "dialog",
      "role": "審判長",
      "speaker": "審判長",
      "action": "",
      "content": "..."
    }
  ]
}
```

**逐字段落 `type` 值：**
- `"stage"` — 旁白/程序說明，顯示為置中標籤，不可引用
- `"dialog"` — 對話，可點擊引用，可回報錯誤

### 步驟 2：在 sessions-index.json 加入索引

```json
// data/sessions-index.json
{
  "id": "s-114-1-7",
  "title": "第七場次：宣判庭",
  "date": "2026-04-10",
  "summary": "宣判庭，法院宣讀判決主文。",
  "status": "published",
  "highlight": false
}
```

### 步驟 3：在 local-session-details 地圖中登錄

```typescript
// lib/generated/local-session-details.ts
import s114_1_7 from '@/data/sessions/s-114-1-7.json';

export const localSessionDetailsMap = {
  // ...現有場次...
  's-114-1-7': s114_1_7,
};
```

**完成。** 無需改動任何頁面元件，場次頁自動運作，首頁和場次列表也會自動更新。

---

## 三、各元件的 Props 介面（AI 工作手冊）

### TranscriptPanel
```typescript
{
  transcript: LocalTranscriptLine[];  // 逐字稿陣列
  isMobileLayout: boolean;            // 控制佈局（false = 桌面左欄）
  activeLineId: string;               // 當前高亮段落 ID
  transcriptContainerRef: RefObject<HTMLDivElement>;
  onInjectCitation: (lineId: string) => void;  // 點擊段落 → 插入引用
  onReport: (lineId: string, speaker: string, content: string) => void;
}
```

### InlinePanel
```typescript
{
  transcript: LocalTranscriptLine[];
  inlineNotes: Record<string, string>;   // lineId → 筆記文字
  expandedLineId: string | null;
  onExpandToggle: (lineId: string) => void;
  onNoteChange: (lineId: string, value: string) => void;
  onReport: (lineId: string, speaker: string, content: string) => void;
}
```

### EditorPanel
```typescript
{
  editor: Editor | null;      // Tiptap editor instance
  isMobileLayout: boolean;
  articleTitle: string;
  authorName: string;
  contactEmail: string;
  submitState: string;        // 送出後的提示文字
  editorLength: number;
  onTitleChange: (v: string) => void;
  onAuthorChange: (v: string) => void;
  onEmailChange: (v: string) => void;
}
```

### MobileReadHeader
```typescript
{
  title: string;
  mobileMode: 'read' | 'inline' | 'edit';
  filledCount: number;
  mergeConfirming: boolean;
  onMergeConfirmStart: () => void;
  onMergeConfirmCancel: () => void;
  onMergeConfirm: () => void;
}
```

### ReportSheet
```typescript
{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  segment: { lineId: string; speaker: string; content: string } | null;
  text: string;
  onTextChange: (text: string) => void;
  submitting: boolean;
  submitted: boolean;
  onSubmit: () => void;
}
```

### OnboardingOverlay
```typescript
{
  show: boolean;    // isMobileLayout && !localStorage['session-onboarding-seen']
  onDismiss: () => void;
}
```

### ContributionSheet
```typescript
{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isMobileLayout: boolean;
  onStartWriting: () => void;   // → setMobileMode('edit') + setMobilePanel('editor')
}
```

---

## 四、首頁與列表頁的勾連機制

### 場次列表（/sessions）
- `SessionsOverviewSection.tsx` 讀取 `getLocalSessionsIndex()` 自動呈現所有已發布場次
- `highlight: true` 的場次會有特殊視覺強調
- **不需要改任何元件**，新增索引後自動出現

### 首頁場次櫥窗（/）
- 從 `trialHearings` 陣列讀取，目前為靜態資料
- **新增場次後需要同步更新** `components/SessionsOverviewSection.tsx` 中的 `trialHearings` 陣列

### 觀庭筆記匯集區（/forum）
- 從 `/api/forum` 動態讀取，只顯示審核通過的文章
- **自動更新**，不需要手動操作

---

## 五、設計語言規範（所有元件必須遵守）

### 色彩
| 用途 | 值 |
|------|-----|
| 主色（橄欖綠） | `#6B8E23` |
| 主色深色 | `#5a781d` |
| 淺底 | `#F9FBE7` |
| 邊框 | `#DDE6C8`, `#C9D9A3` |
| 文字主色 | `#2D2A26` |
| 文字次色 | `#5A5347`, `#8A8078` |
| 橙色（回報） | `orange-500` |

### 字體
```css
/* 內文 / UI */
font-family: system-ui, sans-serif   /* Tailwind 預設 */

/* 標題 / 逐字稿內容 */
font-family: 'Noto Serif TC', serif  /* const serif = { fontFamily: "..." } */
```

### 圓角
- 段落卡片：`rounded-[1.5rem]`
- Sheet / Overlay：`rounded-t-3xl`
- 小按鈕：`rounded-lg`, `rounded-xl`
- 標籤 / badge：`rounded-full`

### 手機版三模式
| 模式 | Tab 背景 | 說明提示色 |
|------|---------|-----------|
| 閱讀 | `bg-white` | `#F4F1EC`（米褐） |
| 逐段填寫 | `bg-[#F0F7E0]` | `#F0F7E0`（淺綠） |
| 書寫筆記 | `bg-[#6B8E23] text-white` | 彙整後：綠色橫幅；未彙整：米褐 |

---

## 六、AI 操作守則

1. **修改 UX 流程**：改對應元件（如 `InlinePanel.tsx`），**不動** `page.tsx`
2. **修改文案**：需用戶明確批准，不自行更動
3. **新增功能**：先確認該功能屬於哪個元件層，如果橫跨多個元件則在 `page.tsx` 新增 state 並透過 props 傳遞
4. **新增場次**：只需要 JSON + 索引更新，永遠不要複製 page.tsx
5. **修改首頁場次櫥窗**：同步更新 `SessionsOverviewSection.tsx` 的 `trialHearings`
6. **TypeScript**：每次改動後執行 `npx tsc --noEmit`，零錯誤才算完成
