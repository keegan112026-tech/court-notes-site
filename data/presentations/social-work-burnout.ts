export type PresentationMode = 'audience' | 'speaker' | 'projection';

export type SlideStat = {
  label: string;
  value: string;
  note?: string;
  accent?: 'mist' | 'coral' | 'ink' | 'sand';
};

export type SlideHighlight = {
  title: string;
  detail: string;
};

export type SlideContent = {
  id: string;
  chapter: string;
  kicker: string;
  title: string;
  headline: string;
  summary: string;
  audienceSummary: string;
  highlights: SlideHighlight[];
  stats: SlideStat[];
  speakerNotes: string[];
  sourceNote?: string;
};

export const PRESENTATION_TITLE = '社工真正耗損的，不只是服務本身';
export const PRESENTATION_SUBTITLE = '把時間還給陪伴，先從整理型耗損開始。';

export const PRESENTATION_MODES: Array<{
  id: PresentationMode;
  label: string;
  description: string;
}> = [
  {
    id: 'audience',
    label: '觀眾模式',
    description: '可捲動閱讀 10 頁內容，也能快速跳頁。',
  },
  {
    id: 'speaker',
    label: '講者模式',
    description: '單頁講述、可看講稿摘要，支援鍵盤切頁。',
  },
  {
    id: 'projection',
    label: '投影模式',
    description: '16:9 聚焦畫面，可一鍵進入全螢幕。',
  },
];

export const SOCIAL_WORK_BURNOUT_SLIDES: SlideContent[] = [
  {
    id: 'slide-01',
    chapter: '01',
    kicker: '封面 / 主命題',
    title: '社工真正耗損的，不只是服務本身',
    headline: '把時間還給陪伴',
    summary:
      '真正吃掉心力的，往往不是服務當下，而是服務之後那整串整理、核對、補寫、搬運與重新交付。',
    audienceSummary:
      '這份簡報想討論的不是誰比較快，而是第一線工作中，那些圍繞服務不斷生成的整理型耗損。',
    highlights: [
      {
        title: '服務後的第二輪工作',
        detail: '服務做完之後，整理、核對、補寫、匯整才真正開始。',
      },
      {
        title: 'AI 的位置',
        detail: '先處理整理型耗損，不先碰專業判斷。',
      },
    ],
    stats: [
      { label: '有效案例', value: '12 份', accent: 'coral' },
      { label: '工作節點', value: '5 段', note: '服務→整理→核對→補寫→匯整', accent: 'mist' },
    ],
    speakerNotes: [
      '先把立場說清楚：這不是工具炫技，也不是效率競賽。',
      '核心訊息是服務當下之外的整理型耗損，經常才是最吃力的部分。',
      '引出 AI 介入位置：先幫忙把時間還給陪伴與判斷。',
    ],
    sourceNote: '本次主分析採初步清理後之 12 份有效案例。',
  },
  {
    id: 'slide-02',
    chapter: '02',
    kicker: '資料來源與分析口徑',
    title: '這不是在看誰慢，而是在看工作結構',
    headline: '不是評分，是拆解',
    summary:
      '資料從 18 份原始提交，清理成 12 份有效案例，目的不是比較快慢，而是拆出耗損長在哪裡。',
    audienceSummary:
      '先把資料口徑講清楚，才能避免把工作壓力誤讀成個人效率問題。',
    highlights: [
      {
        title: '18 → 17 → 12',
        detail: '扣除 1 筆測試資料與 5 筆重複填答後，留下 12 份主分析案例。',
      },
      {
        title: '從人轉回工作',
        detail: '真正要看的不是誰做得慢，而是哪個結構反覆讓人卡住。',
      },
    ],
    stats: [
      { label: '原始提交', value: '18', accent: 'mist' },
      { label: '扣測試資料', value: '-1', accent: 'ink' },
      { label: '扣重複填答', value: '-5', accent: 'coral' },
      { label: '有效案例', value: '12', accent: 'sand' },
    ],
    speakerNotes: [
      '提醒這不是大樣本研究，也不拿來檢討個人。',
      '把焦點從個人效率移回工作結構，後面所有數字才有意義。',
    ],
    sourceNote: '資料來源：量化與敘事整合演講講稿、簡報與講稿整合生成指令。',
  },
  {
    id: 'slide-03',
    chapter: '03',
    kicker: '從哪裡開始感到卡住',
    title: '大家多半不是先畫流程，而是先處理最卡的地方',
    headline: '最麻煩的地方，常常就是日常',
    summary:
      '12 份案例中，有 8 份先從最麻煩的工作切入；11 份則屬於經常會遇到的日常任務。',
    audienceSummary:
      '社工不是不知道流程，而是最先感受到的，常常是某一段特別亂、特別怕漏的環節。',
    highlights: [
      {
        title: '8 / 12',
        detail: '先從最麻煩的事開始，而不是先完整拆整段流程。',
      },
      {
        title: '11 / 12',
        detail: '這不是偶爾爆炸的例外，而是會反覆出現的工作。',
      },
    ],
    stats: [
      { label: '最麻煩先開始', value: '8 / 12', note: '66.7%', accent: 'coral' },
      { label: '整段流程切入', value: '2 / 12', note: '16.7%', accent: 'mist' },
      { label: '單一工作切入', value: '2 / 12', note: '16.7%', accent: 'sand' },
      { label: '經常會遇到', value: '11 / 12', note: '91.7%', accent: 'ink' },
    ],
    speakerNotes: [
      '這一頁的重點不是分類漂亮，而是日常壓力怎麼被辨認出來。',
      '先感到卡住的地方，通常也最值得優先優化。',
    ],
  },
  {
    id: 'slide-04',
    chapter: '04',
    kicker: '工具與切換複雜度',
    title: '少步驟，不等於低複雜度',
    headline: '表面 2.25 步，背後卻是多工具切換',
    summary:
      '平均步驟只有 2.25，中位數更只有 2 步，但背後常要在 Word、Excel、LINE、AI 工具與多個系統間反覆切換。',
    audienceSummary:
      '真正的負擔不是看起來做了幾步，而是每一步背後要切多少來源、格式與核對動作。',
    highlights: [
      {
        title: '表面短流程',
        detail: '平均 2.25 步、中位數 2 步，看起來不長。',
      },
      {
        title: '實際多切換',
        detail: 'Word、Excel、AI 工具、LINE、政府系統、內部系統、紙本與電話彼此穿插。',
      },
    ],
    stats: [
      { label: '平均步驟數', value: '2.25', accent: 'coral' },
      { label: '中位數', value: '2 步', accent: 'mist' },
      { label: 'Word', value: '15', accent: 'sand' },
      { label: 'Excel', value: '14', accent: 'sand' },
      { label: 'AI 工具', value: '10', accent: 'mist' },
      { label: 'LINE', value: '10', accent: 'ink' },
      { label: '政府系統', value: '7', accent: 'mist' },
      { label: '內部系統', value: '6', accent: 'sand' },
      { label: '紙本資料', value: '6', accent: 'ink' },
      { label: '電話', value: '3', accent: 'coral' },
    ],
    speakerNotes: [
      '請觀眾不要被 2.25 這個數字誤導。',
      '真正造成耗損的是跨工具切換、重複輸入和格式搬運。',
    ],
  },
  {
    id: 'slide-05',
    chapter: '05',
    kicker: '時間分布',
    title: '時間不是一個平均值就能說清楚',
    headline: '8.7 小時背後，差距可以拉到 57.5 小時',
    summary:
      '平均月耗時約 8.7 小時，但中位數是 4.6，小任務與高耗損任務之間存在極大差距。',
    audienceSummary:
      '光看平均值很容易失真，更重要的是高耗時任務如何長出來。',
    highlights: [
      {
        title: '差距很大',
        detail: '最低約 0.3 小時，最高可到 57.5 小時。',
      },
      {
        title: '排除極端值後',
        detail: '平均回到約 4.2 小時，顯示高值任務對整體感受影響很大。',
      },
    ],
    stats: [
      { label: '平均月耗時', value: '8.7 小時', accent: 'coral' },
      { label: '中位數', value: '4.6 小時', accent: 'mist' },
      { label: '最低', value: '0.3 小時', accent: 'sand' },
      { label: '最高', value: '57.5 小時', accent: 'ink' },
      { label: '排除高值後平均', value: '4.2 小時', accent: 'mist' },
    ],
    speakerNotes: [
      '不要只說平均，要帶著觀眾一起看分布。',
      '這頁的結論是高耗時工作值得被優先處理，因為它們會快速拉高整體耗損。',
    ],
  },
  {
    id: 'slide-06',
    chapter: '06',
    kicker: '模式一',
    title: '抓資料、改格式、再核對，才變成可交付成果',
    headline: '定期報表與成果彙整型工作',
    summary:
      '這類工作不是填一張表，而是要回頭從不同來源抓資料、分類、合併、改格式、做清冊與統計，最後才交得出去。',
    audienceSummary:
      '最耗人的地方不是分析，而是資料搬運與重複整理。',
    highlights: [
      {
        title: '來源很多',
        detail: 'Excel、Word、LINE、紙本、系統都可能是原始資料源。',
      },
      {
        title: '輸出要整齊',
        detail: '分類、改格式、核對數字後，才能變成可交付報表。',
      },
    ],
    stats: [
      { label: '典型任務', value: '月報 / 成果統整', accent: 'mist' },
      { label: '流程節點', value: '抓資料→分類→改格式→核對→報表', accent: 'coral' },
    ],
    speakerNotes: [
      '這一頁以質性模式為主，不額外堆疊新數字。',
      '把觀眾帶回現場感：資料散落、欄位不一致、反覆核對。',
    ],
  },
  {
    id: 'slide-07',
    chapter: '07',
    kicker: '模式二 + 模式五',
    title: '做過，不等於完成；還要能被看見、被接續',
    headline: '系統核對、服務量統計與個案進度追蹤',
    summary:
      '逐筆確認資料是否登錄、能否統計、能否被下一個工作者接上，是另一種高壓整理工作。',
    audienceSummary:
      '工作做完不代表結束，還要能被看見、被使用、被承接。',
    highlights: [
      {
        title: '逐筆確認',
        detail: '先確認有沒有登錄，再回填服務量表或指定格式。',
      },
      {
        title: '持續更新',
        detail: '個案時間軸需要把 LINE、電話、紙本、錄音與系統紀錄重新拼接。',
      },
    ],
    stats: [
      { label: '關鍵壓力', value: '怕漏', accent: 'coral' },
      { label: '工作感受', value: '要對得起來', accent: 'mist' },
      { label: '服務延續', value: '讓今天接得上明天', accent: 'sand' },
    ],
    speakerNotes: [
      '這一頁要把確認與延續兩件事講在一起。',
      '共同壓力不是一次完成，而是後續還要可見、可接、可統計。',
    ],
  },
  {
    id: 'slide-08',
    chapter: '08',
    kicker: '模式三 + 模式四',
    title: '零散資訊，不會自己長成正式紀錄',
    headline: '訪視後紀錄與突發事件處遇紀錄',
    summary:
      'LINE、筆記、錄音、電話與家屬或單位回覆，需要被重新收攏、重組與核對，才能形成正式紀錄。',
    audienceSummary:
      '難的不是寫字本身，而是要在時間壓力下，把零散資訊整理成能承接責任的紀錄。',
    highlights: [
      {
        title: '資訊碎片多',
        detail: 'LINE、手寫便條、錄音與舊紀錄都可能同時存在。',
      },
      {
        title: '又快又不能漏',
        detail: '尤其事件處遇時，既要如實，又要統整，還要來得及後續接續。',
      },
    ],
    stats: [
      { label: '資料源', value: 'LINE / 筆記 / 錄音 / 電話', accent: 'mist' },
      { label: '輸出結果', value: '正式紀錄', accent: 'coral' },
      { label: '延續要求', value: '服務可接續', accent: 'sand' },
    ],
    speakerNotes: [
      '這頁要讓觀眾看到隱性耗損，不只是文書量大，而是回溯與重組很重。',
      '把「既要如實，又要統整；既要快，又不能漏」當成收束句。',
    ],
  },
  {
    id: 'slide-09',
    chapter: '09',
    kicker: '需求分析',
    title: '大家要的不是炫技，而是減少混亂',
    headline: '真正想被幫忙的是流程簡化、彙整成表與少一點來回確認',
    summary:
      '最常見的期待，是簡化整體流程與把資料彙整成表，其次才是生成初稿；真正想省下的，也包括混亂感與怕出錯。',
    audienceSummary:
      '第一線要的不是很炫，而是少一點重工、少一點怕漏、少一點不知道從哪開始。',
    highlights: [
      {
        title: '最希望被幫什麼',
        detail: '4 份希望簡化流程，4 份希望彙整成表，2 份希望先生成初稿。',
      },
      {
        title: '最想節省什麼',
        detail: '除了時間，還包括來回確認、出錯機率、重複輸入與混亂感。',
      },
    ],
    stats: [
      { label: '簡化整體流程', value: '4', note: '33.3%', accent: 'coral' },
      { label: '彙整成表', value: '4', note: '33.3%', accent: 'mist' },
      { label: '生成初稿', value: '2', note: '16.7%', accent: 'sand' },
      { label: '找漏資訊', value: '1', note: '8.3%', accent: 'ink' },
      { label: '整理內容', value: '1', note: '8.3%', accent: 'ink' },
      { label: '想省時間', value: '4', note: '33.3%', accent: 'coral' },
      { label: '少來回確認', value: '3', note: '25.0%', accent: 'mist' },
      { label: '降低出錯', value: '2', note: '16.7%', accent: 'sand' },
      { label: '少重複輸入', value: '1', note: '8.3%', accent: 'ink' },
      { label: '少混亂感', value: '1', note: '8.3%', accent: 'ink' },
      { label: '少耗心力', value: '1', note: '8.3%', accent: 'ink' },
    ],
    speakerNotes: [
      '這頁把需求翻回工具設計原則。',
      '先做減少混亂的工具，比做炫技型 AI 更貼近現場。',
    ],
  },
  {
    id: 'slide-10',
    chapter: '10',
    kicker: '結語',
    title: '先幫社工減少整理型耗損，而不是取代社工',
    headline: '工具先幫忙，人仍主責判斷、風險、關係與責任',
    summary:
      '未來如果要談 AI 與電子工具，最適合優先介入的，是整理、彙整、初稿、檢漏、格式轉換與多來源整合，而不是直接接管專業判斷。',
    audienceSummary:
      '這份網站想收在一個很清楚的結論上：先減少整理型耗損，社工才能把時間留給真正需要人的工作。',
    highlights: [
      {
        title: '工具先承接',
        detail: '整理訊息、彙整成表、初稿生成、檢漏、格式轉換、多來源整合。',
      },
      {
        title: '人仍主責',
        detail: '判斷、風險、關係、確認與責任，不應被工具取代。',
      },
    ],
    stats: [
      { label: '工具先幫忙', value: '整理 / 彙整 / 初稿 / 檢漏', accent: 'mist' },
      { label: '仍需由人主責', value: '判斷 / 風險 / 關係 / 責任', accent: 'coral' },
    ],
    speakerNotes: [
      '把量化與質化結果合起來，結論其實很穩定。',
      '最後要停在一句話：先幫社工減少整理型耗損，而不是取代社工。',
    ],
  },
];
