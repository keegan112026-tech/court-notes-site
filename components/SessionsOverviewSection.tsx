'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, BookOpen, ChevronLeft, ChevronRight, Flame, Gavel, GraduationCap, Layers, PenTool, Scale, Shield, ShieldAlert } from 'lucide-react';
import { FadeIn } from '@/components/ui-shared';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const serif = { fontFamily: "'Noto Serif TC', serif" };

interface SessionData {
  id: string;
  sessionId: string;
  title: string;
  date: string;
  category?: string;
  summary?: string;
  hotTopic?: boolean;
  participantsCount?: number;
}

const preparationHearings = [
  { date: '07 月 17 日', desc: '首度開庭，陳姓社工不認罪。' },
  { date: '08 月 27 日', desc: '第二次準備程序庭，持續整理卷證與後續訴訟攻防方向。' },
  { date: '10 月 15 日', desc: '第三次準備程序庭，釐清證據能力與後續審理節奏。' },
  { date: '12 月 04 日', desc: '第四次準備程序庭，完成重要節點，後續正式進入實質審理。' },
];

const trialHearings = [
  {
    title: '第1次開庭',
    date: '2025-11-27',
    displayDate: '11 月 27 日',
    topic: '收出養政策與地方政府交接責任',
    desc: '釐清中央政策下收出養的標準流程，以及新北市社會局與兒盟之間的個案交接資訊是否對等。',
    witnesses: ['徐佩華（衛福部社家署）', '施盈如（新北社會局）', '丁雁琪（天主教福利會）'],
  },
  {
    title: '第2次開庭',
    date: '2025-12-11',
    displayDate: '12 月 11 日',
    topic: '醫療端初步判定與兒盟核心督導責任',
    desc: '從急診第一線觀察與督導審核責任切入，整理醫療端與兒盟體系的關鍵證詞。',
    witnesses: ['黃聖心（萬芳醫院）', '李芳玲（兒盟）', '江怡韻（兒盟督導）'],
  },
  {
    title: '第3次開庭',
    date: '2025-12-18',
    displayDate: '12 月 18 日',
    topic: '兒盟高層管理與內部通報系統',
    desc: '透過高層與中階主管證詞，檢視內部文化、風險資訊與系統通報機制。',
    witnesses: ['白麗芳（前兒盟執行長）', '葉亭希（兒盟組長）', '葉詩宇（兒盟督導）'],
  },
  {
    title: '第4次開庭',
    date: '2026-01-22',
    displayDate: '1 月 22 日',
    topic: '第一線專業觀察與居托監督缺失',
    desc: '針對醫療診斷與居家托育監督流程，對照第一線專業觀察與責任鏈結。',
    witnesses: ['蔡函妤（牙醫師）', '林心慈（文山居托）', '黃鈴芳（文山居托督導）'],
  },
  {
    title: '第5次開庭',
    date: '2026-01-29',
    displayDate: '01 月 29 日',
    topic: '主管機關行政監督責任',
    desc: '整理台北市社會局對居家托育中心與合格保母之監督責任。',
    witnesses: ['粘羽涵（北市社會局）'],
  },
  {
    title: '加開庭次',
    date: '2026-02-23',
    displayDate: '02 月 23 日',
    topic: '全日審理程序：勘驗影像／訊問被告',
    desc: '該日重點為勘驗相關影像內容，並訊問被告；依你提供的報告脈絡，這場可理解為包含牙醫錄影的勘驗程序。',
    witnesses: [],
  },
  {
    title: '第六場次：最終言詞辯論',
    date: '2026-02-26',
    displayDate: '02 月 26 日',
    topic: '檢察官論告與辯護律師簡報陳述還原',
    desc: '全案辯論終結，檢方與辯方皆提出總結性陳述與法律論辯。',
    witnesses: [],
    highlight: true,
  },
];

const guidePanels = [
  {
    id: 'rules',
    title: '平台規範',
    shortLabel: '規範',
    icon: <ShieldAlert size={14} />,
    accentClass: 'border-[#F0D4D1] bg-[#FDF3F2]',
    content: (
      <div className="space-y-3">
        <h4 className="text-[28px] font-black leading-tight text-[#2D2A26]" style={serif}>平台規範</h4>
        <p className="text-[16px] font-medium leading-[1.9] text-[#5A5347]">
          本網站還原筆記取自網路夥伴本身手記筆記提供，以及本網站團隊觀庭筆記本網站徵集。為了維持專業論述的品質並守護實務工作者的法律安全，在投稿文章或發表專業見解前，請務必了解我們的「去識別化」及「免責原則」。
        </p>
      </div>
    ),
  },
  {
    id: 'ethics',
    title: '倫理規範與發言守則',
    shortLabel: '倫理',
    icon: <Shield size={14} />,
    accentClass: 'border-[#DDE4F2] bg-[#F5F8FF]',
    content: (
      <div className="space-y-4">
        <h4 className="text-[28px] font-black leading-tight text-[#2D2A26]" style={serif}>倫理規範與發言守則</h4>
        <div className="grid gap-3">
          {[
            ['嚴格去識別化', '徹底移除隱私資訊。禁止揭露真實姓名、居住地或非公開案情細節。'],
            ['聚焦職務非個人', '針對「專業判斷」與「機構制度」進行討論。嚴禁人身攻擊。'],
            ['遵守法律基礎', '遵守法規與公共秩序。不得發表違法資訊或煽動仇恨言論。'],
          ].map(([title, body]) => (
            <div key={title} className="rounded-[1.25rem] border border-[#E5E8F1] bg-white px-4 py-3">
              <p className="text-[16px] font-black text-[#2D2A26]">{title}</p>
              <p className="mt-1 text-[14px] font-bold leading-[1.8] text-[#5A5347]">{body}</p>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 'workflow',
    title: '平台運作模式',
    shortLabel: '運作',
    icon: <Scale size={14} />,
    accentClass: 'border-[#DCE8BF] bg-[#F7FBE8]',
    content: (
      <div className="space-y-4">
        <h4 className="text-[28px] font-black leading-tight text-[#2D2A26]" style={serif}>平台運作模式</h4>
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            ['前期', '實際參與所有場次形成筆記，蒐集觀庭多元筆記校對補缺，蒐集案整體相關資料。'],
            ['呈現', '觀庭現場還原筆記、即時論壇與評論投稿機制，形成論述探討與交流。'],
            ['最後', '共構本事件之復原計畫和共識，透過集體智慧建立新的準則與論述。'],
          ].map(([title, body]) => (
            <div key={title} className="rounded-[1.25rem] border border-[#E0E9C6] bg-white px-4 py-3">
              <p className="text-[16px] font-black text-[#2D2A26]">{title}</p>
              <p className="mt-1 text-[14px] font-bold leading-[1.8] text-[#5A5347]">{body}</p>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 'what-we-do',
    title: '這個平台在做什麼？',
    shortLabel: '平台在做什麼',
    icon: <Layers size={14} />,
    accentClass: 'border-[#ECDDBF] bg-[#FFF8EE]',
    content: (
      <div className="space-y-4">
        <h4 className="text-[28px] font-black leading-tight text-[#2D2A26]" style={serif}>這個平台在做什麼？</h4>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            ['整合資訊', '打破壁壘，降低門檻。'],
            ['觀庭還原', '身歷其境，完整還原。'],
            ['觀庭評述', '就本案呈現真實狀況評述。'],
            ['建構論壇', '匿名交流，平等詮釋。'],
            ['共構解方', '集體智慧，復原重建。'],
          ].map(([title, body]) => (
            <div key={title} className="rounded-[1.25rem] border border-[#EFE3CE] bg-white px-4 py-3">
              <p className="text-[16px] font-black text-[#2D2A26]">{title}</p>
              <p className="mt-1 text-[14px] font-bold leading-[1.8] text-[#5A5347]">{body}</p>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 'problems',
    title: '我們要解決什麼問題？',
    shortLabel: '問題',
    icon: <AlertCircle size={14} />,
    accentClass: 'border-[#EADFC8] bg-[#FFF8F0]',
    content: (
      <div className="space-y-4">
        <h4 className="text-[28px] font-black leading-tight text-[#2D2A26]" style={serif}>我們要解決什麼問題？</h4>
        <p className="text-[16px] font-medium leading-[1.9] text-[#5A5347]">
          我們面對的，不只是資訊不足，而是資訊如何被切割、被壟斷、被各自詮釋後，逐漸讓人失去理解彼此的能力。
        </p>
        <div className="grid gap-3">
          {[
            ['資訊紛亂斷裂、門檻高', '資訊紛亂、斷裂、專業壁壘，完整尋找門檻高。'],
            ['單一敘事與詮釋壟斷', '有條件觀庭者僅少數，雙方敘述封閉於庭上、外界資訊均透過解讀詮釋。'],
            ['對立衝突與無法傾聽', '各自論述對立、衝突、難以理解彼此，也不去聽對方的語言。'],
          ].map(([title, body]) => (
            <div key={title} className="rounded-[1.25rem] border border-[#EFE3CE] bg-white px-4 py-3">
              <p className="text-[16px] font-black text-[#2D2A26]">{title}</p>
              <p className="mt-1 text-[14px] font-bold leading-[1.8] text-[#5A5347]">{body}</p>
            </div>
          ))}
        </div>
        <p className="text-[15px] font-black leading-[1.8] text-[#7B8C4E]">
          因此唯有創造大家都能接受的「第三方語言」，才有機會尋求合作與和解。
        </p>
      </div>
    ),
  },
];

function getWitnessStyle(witness: string) {
  if (['粘羽涵（北市社會局）', '施盈如（新北社會局）'].includes(witness)) {
    return 'border-[#BFD7B1] bg-[#ECF7E8] text-[#4D6B3C]';
  }

  if (['徐佩華（衛福部社家署）', '丁雁琪（天主教福利會）', '黃聖心（萬芳醫院）', '蔡函妤（牙醫師）'].includes(witness)) {
    return 'border-[#E5D9C8] bg-[#F8F1E6] text-[#6C5641]';
  }

  if (['林心慈（文山居托）', '黃鈴芳（文山居托督導）'].includes(witness)) {
    return 'border-[#BFD5F0] bg-[#EAF4FF] text-[#466989]';
  }

  if (
    [
      '白麗芳（前兒盟執行長）',
      '葉亭希（兒盟組長）',
      '葉詩宇（兒盟督導）',
      '李芳玲（兒盟）',
      '江怡韻（兒盟督導）',
    ].includes(witness)
  ) {
    return 'border-[#E7B3B3] bg-[#FDECEC] text-[#9A4343]';
  }

  return 'border-gray-200 bg-gray-50 text-gray-700';
}

function getWitnessHint(witness: string) {
  if (['粘羽涵（北市社會局）', '施盈如（新北社會局）'].includes(witness)) {
    return '政府社政體系證人群組，以淡綠色標記。';
  }

  if (['徐佩華（衛福部社家署）', '丁雁琪（天主教福利會）', '黃聖心（萬芳醫院）', '蔡函妤（牙醫師）'].includes(witness)) {
    return '跨機構或專業端證人群組，以米白色標記。';
  }

  if (['林心慈（文山居托）', '黃鈴芳（文山居托督導）'].includes(witness)) {
    return '居托系統相關證人群組，以淡藍色標記。';
  }

  if (
    [
      '白麗芳（前兒盟執行長）',
      '葉亭希（兒盟組長）',
      '葉詩宇（兒盟督導）',
      '李芳玲（兒盟）',
      '江怡韻（兒盟督導）',
    ].includes(witness)
  ) {
    return '兒盟相關證人群組，以紅色標記。';
  }

  if (witness === '無證人') {
    return '該場次未列證人，以中性標籤呈現。';
  }

  return '證人分類資料。';
}

export default function SessionsOverviewSection({ embedded = false }: { embedded?: boolean }) {
  const [publishedSessions, setPublishedSessions] = useState<SessionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPreparationExpanded, setIsPreparationExpanded] = useState(false);
  const [isPreparationPeek, setIsPreparationPeek] = useState(false);
  const [publishedIndex, setPublishedIndex] = useState(0);
  const [guidePanel, setGuidePanel] = useState(guidePanels[0].id);
  const [guidePanelDirection, setGuidePanelDirection] = useState(1);

  useEffect(() => {
    fetch('/api/sessions')
      .then((r) => r.json())
      .then((d) => {
        if (d.ok) {
          const uniqueSessions = Array.from(new Map(d.data.map((item: SessionData) => [item.sessionId, item])).values());
          setPublishedSessions(uniqueSessions as SessionData[]);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (publishedSessions.length === 0) return;
    setPublishedIndex((current) => Math.min(current, publishedSessions.length - 1));
  }, [publishedSessions]);

  useEffect(() => {
    if (publishedSessions.length <= 1) return;

    const timer = window.setInterval(() => {
      setPublishedIndex((current) => (current + 1) % publishedSessions.length);
    }, 6500);

    return () => window.clearInterval(timer);
  }, [publishedSessions.length]);

  function goToPreviousPublished() {
    if (publishedSessions.length <= 1) return;
    setPublishedIndex((current) => (current === 0 ? publishedSessions.length - 1 : current - 1));
  }

  function goToNextPublished() {
    if (publishedSessions.length <= 1) return;
    setPublishedIndex((current) => (current + 1) % publishedSessions.length);
  }

  function goToGuidePanel(nextId: string) {
    setGuidePanelDirection(guidePanels.findIndex((panel) => panel.id === nextId) > guidePanels.findIndex((panel) => panel.id === guidePanel) ? 1 : -1);
    setGuidePanel(nextId);
  }

  function goToPreviousGuidePanel() {
    const currentIndex = guidePanels.findIndex((panel) => panel.id === guidePanel);
    const nextIndex = currentIndex === 0 ? guidePanels.length - 1 : currentIndex - 1;
    setGuidePanelDirection(-1);
    setGuidePanel(guidePanels[nextIndex].id);
  }

  function goToNextGuidePanel() {
    const currentIndex = guidePanels.findIndex((panel) => panel.id === guidePanel);
    const nextIndex = (currentIndex + 1) % guidePanels.length;
    setGuidePanelDirection(1);
    setGuidePanel(guidePanels[nextIndex].id);
  }

  const latestPublished = publishedSessions[0];
  const activePublished = publishedSessions[publishedIndex];
  const isPreparationOpen = isPreparationExpanded || isPreparationPeek;
  const publishedOrderLabel = useMemo(() => {
    if (!activePublished) return '';
    return publishedIndex === 0 ? '最新發布' : `第 ${publishedIndex + 1} 筆`;
  }, [activePublished, publishedIndex]);

  return (
    <TooltipProvider delayDuration={120}>
      <div className={embedded ? 'bg-[#FBF7F0]' : 'min-h-screen bg-[#FAFAFA] pb-20 font-sans text-gray-800 selection:bg-[#6B8E23]/20'}>
        <section className="mx-auto max-w-7xl space-y-12 px-6 py-12">
          <FadeIn>
            <div className="overflow-hidden rounded-[2.25rem] border border-[#F1DDC0] bg-gradient-to-r from-[#FFF6EC] via-white to-[#F9FBE7] shadow-sm">
              <div className="p-7 md:p-8">
                <div className="grid gap-8">
                  <div>
                    <h2 className="text-[34px] font-black leading-tight text-gray-900 md:text-[48px]" style={serif}>
                      114年度訴字第51號過失致死等案
                      <br />
                      <span className="text-[#6B8E23]">俗稱剴剴社工案</span>
                    </h2>
                    <p className="mt-4 max-w-4xl text-[17px] font-medium leading-[1.9] text-[#5A5347]">
                      依據目前（截至 2026 年 3 月底）彙整附件可確認的審理進度，兒福聯盟陳姓社工在「剴剴案」中被控過失致死與偽造文書罪，台北地院已完成審理，累計庭期與具體日期整理如下：
                    </p>
                    <p className="mt-3 inline-block bg-[#F9FBE7] px-2 py-0.5 text-[17px] font-bold leading-relaxed text-gray-900">
                      陳姓社工於一審期間目前可確認審理程序庭（共 7 次），另已公告將於 2026 年 4 月 16 日宣判。
                    </p>
                  </div>

                  <motion.div whileHover={{ y: -4, boxShadow: '0 18px 42px rgba(123,140,78,0.12)' }} className="hidden relative self-start overflow-hidden rounded-[2rem] border border-[#E8E0D4] bg-white/90 shadow-md">
                    <motion.div
                      aria-hidden="true"
                      animate={{ opacity: [0.18, 0.32, 0.18], scale: [1, 1.05, 1] }}
                      transition={{ duration: 5.6, repeat: Infinity, ease: 'easeInOut' }}
                      className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[#DCE7AE] blur-3xl"
                    />
                    <div className="relative z-10 px-6 py-5">
                      <div className="inline-flex items-center gap-2 rounded-full bg-[#F9FBE7] px-4 py-2 text-[13px] font-black tracking-[0.16em] text-[#6B8E23]">
                        <ShieldAlert size={14} />
                        本站須知
                      </div>
                      <h3 className="mt-4 text-[26px] font-black leading-tight text-[#2D2A26]" style={serif}>
                        平台規範與閱讀方式
                        <br />
                        在還原筆記頁直接可讀
                      </h3>
                      <p className="mt-3 text-[15px] font-medium leading-[1.9] text-[#6B6358]">
                        這裡直接收進平台規範、倫理守則、平台運作模式與問題意識。使用上方標籤切換，即可在固定櫥窗內閱讀。
                      </p>

                      <div className="mt-5 flex flex-wrap gap-2">
                        {guidePanels.map((panel) => {
                          const active = guidePanel === panel.id;
                          return (
                            <button
                              key={panel.id}
                              type="button"
                              onMouseEnter={() => goToGuidePanel(panel.id)}
                              onClick={() => goToGuidePanel(panel.id)}
                              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-[14px] font-black transition-all ${active ? 'bg-[#7B8C4E] text-white shadow-sm' : 'bg-[#F6F1E7] text-[#6B6358] hover:bg-[#EEF4DB] hover:text-[#5A6F35]'}`}
                            >
                              <span className={active ? 'text-white' : ''}>{panel.icon}</span>
                              <span>{panel.shortLabel}</span>
                            </button>
                          );
                        })}
                      </div>

                      <div className="mt-4 overflow-hidden rounded-[1.75rem] border border-[#E8E0D4] bg-gradient-to-br from-white via-[#FFFDF8] to-[#F7F3E8] p-5 shadow-[0_12px_32px_rgba(65,56,44,0.08)]">
                        <div className="mb-4 flex items-center justify-between">
                          <p className="text-[12px] font-black uppercase tracking-[0.24em] text-[#A4A098]">內容櫥窗</p>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              aria-label="查看上一個本站須知主題"
                              onClick={goToPreviousGuidePanel}
                              className="inline-flex h-9 w-9 items-center justify-center rounded-2xl border border-[#E8E0D4] bg-white text-[#7B8C4E] transition-colors hover:bg-[#F5FAEB]"
                            >
                              <ChevronLeft size={17} />
                            </button>
                            <button
                              type="button"
                              aria-label="查看下一個本站須知主題"
                              onClick={goToNextGuidePanel}
                              className="inline-flex h-9 w-9 items-center justify-center rounded-2xl border border-[#E8E0D4] bg-white text-[#7B8C4E] transition-colors hover:bg-[#F5FAEB]"
                            >
                              <ChevronRight size={17} />
                            </button>
                          </div>
                        </div>

                        <div className="min-h-[360px] overflow-hidden">
                          <AnimatePresence mode="wait" initial={false}>
                            {guidePanels
                              .filter((panel) => panel.id === guidePanel)
                              .map((panel) => (
                                <motion.div
                                  key={panel.id}
                                  initial={{ opacity: 0, x: guidePanelDirection > 0 ? 42 : -42 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  exit={{ opacity: 0, x: guidePanelDirection > 0 ? -42 : 42 }}
                                  transition={{ duration: 0.24, ease: 'easeInOut' }}
                                  className={`h-full rounded-[1.5rem] border p-4 ${panel.accentClass}`}
                                >
                                  {panel.content}
                                </motion.div>
                              ))}
                          </AnimatePresence>
                        </div>

                        <div className="mt-4 flex items-center justify-center gap-2">
                          {guidePanels.map((panel) => (
                            <button
                              key={panel.id}
                              type="button"
                              aria-label={`切換到${panel.title}`}
                              onClick={() => goToGuidePanel(panel.id)}
                              className={`h-2.5 rounded-full transition-all ${guidePanel === panel.id ? 'w-8 bg-[#7B8C4E]' : 'w-2.5 bg-[#DAD4C8] hover:bg-[#C3CF9D]'}`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.03}>
            <div className="overflow-hidden rounded-[2.25rem] border border-[#F1DDC0] bg-gradient-to-r from-[#FFF6EC] via-white to-[#F9FBE7] shadow-sm">
              <div className="p-6 md:p-7">
                <div className="mb-6 flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-orange-100 bg-orange-50 text-orange-500">
                    <Flame size={24} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-gray-900 md:text-3xl" style={serif}>
                      目前已發布的完整筆記
                    </h3>
                    <p className="mt-1 text-[17px] font-bold leading-relaxed text-[#6A6257]">您可以直接點擊進入閱覽觀庭還原筆記並編輯論述</p>
                  </div>
                </div>

                <div className="mb-6 rounded-[1.6rem] border border-[#E7E1D7] bg-white/75 px-5 py-4 shadow-[0_10px_24px_rgba(164,136,96,0.08)]">
                  <p className="text-sm font-black tracking-[0.18em] text-[#7A8745]">工作檯導覽</p>
                  <p className="mt-2 text-[15px] font-bold leading-relaxed text-[#6A6257]">
                    左側為已公開的還原筆記輪轉櫥窗，右側為跨場次工作檯；可先閱讀已完成的單場次筆記，也可直接進入多場次共構。
                  </p>
                </div>

                {/* 觀庭前教程長條入口 */}
                <Link href="/prerequisites" className="group mb-4 flex items-center justify-between gap-4 rounded-[1.4rem] border border-[#D7E5BB] bg-gradient-to-r from-[#F9FBE7] to-[#F0F7DC] px-5 py-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#7B8C4E] hover:shadow-md">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#7B8C4E] text-white shadow-sm">
                      <GraduationCap size={18} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#7B8C4E]">推薦先閱讀</p>
                      <p className="text-[15px] font-black leading-tight text-[#2D2A26] truncate" style={serif}>觀庭前新手教程：刑事法庭實務與程序理解</p>
                    </div>
                  </div>
                  <span className="shrink-0 inline-flex h-9 w-9 items-center justify-center rounded-2xl border border-[#D7E5BB] bg-white text-[#7B8C4E] shadow-sm transition-transform group-hover:translate-x-1">
                    <ChevronRight size={16} />
                  </span>
                </Link>

                <div className="grid items-stretch gap-4 lg:grid-cols-2">
                {loading ? (
                  <>
                    <div className="flex min-h-[320px] items-center rounded-[2rem] border border-[#E8E0D4] bg-white px-6 py-5 text-[16px] font-bold text-[#8A8078] shadow-sm">
                      正在載入已發布筆記...
                    </div>
                    <div className="flex min-h-[320px] items-center rounded-[2rem] border border-[#E9EDDA] bg-gradient-to-br from-[#F9FBE7] via-white to-[#F3F7E5] p-6 shadow-sm">
                      <p className="text-[15px] font-bold text-[#5D6A3C]">跨場次工作檯資訊整理中...</p>
                    </div>
                  </>
                ) : (
                  <>
                    {publishedSessions.length === 0 ? (
                      <Link href="/sessions/s-114-1-6" className="block h-full">
                        <motion.div whileHover={{ y: -2, scale: 1.01 }} className="group relative flex h-full min-h-[320px] overflow-hidden rounded-[2rem] border-2 border-orange-200 bg-white p-6 shadow-sm transition-all hover:border-orange-400 hover:shadow-xl">
                          <div className="absolute -mr-10 -mt-10 h-32 w-32 rounded-bl-full bg-orange-50 transition-transform group-hover:scale-110" />
                          <div className="relative z-10 flex h-full flex-col">
                            <div className="mb-3 flex flex-wrap items-center gap-2">
                              <span className="rounded-full bg-orange-500 px-3 py-1 text-xs font-black uppercase tracking-wider text-white shadow-sm">最新發布</span>
                              <span className="rounded-full bg-orange-100 px-3 py-1 text-sm font-black text-orange-700">02 月 26 日</span>
                            </div>
                            <h4 className="mb-3 text-[20px] font-black leading-tight text-gray-900 md:text-[24px]" style={serif}>
                              第六場次：最終言詞辯論
                            </h4>
                            <p className="text-[15px] font-bold leading-relaxed text-gray-600">檢察官論告與辯護律師簡報陳述還原</p>
                            <div className="mt-5 rounded-2xl border border-orange-100 bg-[#FFF9F2] p-4 text-sm font-bold leading-relaxed text-[#8A6235]">
                              收束至最終言詞辯論與最後陳述的核心場次，適合作為進入完整還原筆記與論述編修的起點。
                            </div>
                            <div className="mt-auto pt-4 text-sm font-black text-[#6B8E23]">點擊開啟工作檯 →</div>
                          </div>
                        </motion.div>
                      </Link>
                    ) : (
                      <motion.div whileHover={{ y: -2, scale: 1.01 }} className="group relative flex h-full min-h-[320px] overflow-hidden rounded-[2rem] border-2 border-orange-200 bg-white p-6 shadow-sm transition-all hover:border-orange-400 hover:shadow-xl">
                        <div className="absolute -mr-10 -mt-10 h-32 w-32 rounded-bl-full bg-orange-50 transition-transform group-hover:scale-110" />
                        <div className="relative z-10 flex h-full w-full flex-col">
                          <div className="mb-4 flex items-start justify-between gap-4">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="rounded-full bg-orange-500 px-3 py-1 text-xs font-black uppercase tracking-wider text-white shadow-sm">{publishedOrderLabel}</span>
                              <span className="rounded-full bg-orange-100 px-3 py-1 text-sm font-black text-orange-700">{activePublished?.date}</span>
                            </div>
                            {publishedSessions.length > 1 && (
                              <div className="flex items-center gap-2">
                                <button type="button" aria-label="查看上一筆已發布還原筆記" onClick={goToPreviousPublished} className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-orange-100 bg-[#FFF9F2] text-orange-600 transition-colors hover:bg-orange-100">
                                  <ChevronLeft size={18} />
                                </button>
                                <button type="button" aria-label="查看下一筆已發布還原筆記" onClick={goToNextPublished} className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-orange-100 bg-[#FFF9F2] text-orange-600 transition-colors hover:bg-orange-100">
                                  <ChevronRight size={18} />
                                </button>
                              </div>
                            )}
                          </div>

                          <AnimatePresence mode="wait">
                            {activePublished && (
                              <motion.div
                                key={activePublished.sessionId}
                                initial={{ opacity: 0, x: 18 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -18 }}
                                transition={{ duration: 0.28, ease: 'easeOut' }}
                                className="flex h-full flex-col"
                              >
                                <Link href={`/sessions/${activePublished.sessionId}`} className="block h-full">
                                  <div className="flex h-full flex-col">
                                    <h4 className="mb-3 text-[20px] font-black leading-tight text-gray-900 md:text-[24px]" style={serif}>
                                      {activePublished.title}
                                    </h4>
                                    <p className="text-[15px] font-bold leading-relaxed text-gray-600">{activePublished.summary || '包含證人詰問與重要言詞辯論實況'}</p>
                                    <div className="mt-5 rounded-2xl border border-orange-100 bg-[#FFF9F2] p-4 text-sm font-bold leading-relaxed text-[#8A6235]">
                                      直接進入該場次工作檯，閱覽已整理完成的還原筆記，並在同頁面進行編輯與論述整理。
                                    </div>
                                    <div className="mt-auto pt-4 text-sm font-black text-[#6B8E23]">點擊開啟工作檯 →</div>
                                  </div>
                                </Link>
                              </motion.div>
                            )}
                          </AnimatePresence>

                          {publishedSessions.length > 1 && (
                            <div className="mt-5 flex items-center justify-center gap-2">
                              {publishedSessions.map((session, index) => (
                                <button
                                  key={session.sessionId}
                                  type="button"
                                  aria-label={`切換到第 ${index + 1} 筆已發布筆記`}
                                  onClick={() => setPublishedIndex(index)}
                                  className={`h-2.5 rounded-full transition-all ${index === publishedIndex ? 'w-8 bg-orange-500' : 'w-2.5 bg-orange-200 hover:bg-orange-300'}`}
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}

                    <motion.div whileHover={{ y: -2, scale: 1.01 }} className="relative h-full min-h-[320px] overflow-hidden rounded-[2rem] border border-[#E9EDDA] bg-gradient-to-br from-[#F9FBE7] via-white to-[#F3F7E5] p-6 shadow-sm">
                      <div className="absolute -right-12 -top-12 h-28 w-28 rounded-full bg-[#E6F0C6] blur-2xl" />
                      <div className="relative z-10 flex h-full flex-col">
                        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#6B8E23] px-3 py-1 text-xs font-black tracking-[0.2em] text-white">多場次共構</div>
                        <h4 className="text-[20px] font-black text-gray-900 md:text-[24px]" style={serif}>
                          跨場次工作檯
                        </h4>
                        <p className="mt-3 text-[15px] font-medium leading-relaxed text-gray-600">此為跨場次工作檯，可同時調用多場次還原筆記進行編輯論述，歡迎使用。</p>
                        <div className="mt-5 rounded-2xl border border-[#E9EDDA] bg-white/85 p-4 text-sm font-bold leading-relaxed text-[#5D6A3C]">
                          可在同一篇論述中整合不同場次筆記、比對內容脈絡，形成跨場次的完整觀庭共構筆記。
                        </div>
                        <Link href="/prerequisites" className="mt-auto mb-3 group flex items-center justify-between rounded-2xl border border-[#D7E5BB] bg-[#F9FBE7] px-4 py-3 text-[14px] font-black text-[#5A6F35] transition-all hover:bg-[#EEF6DA] hover:border-[#7B8C4E]">
                          <div className="flex items-center gap-2">
                            <GraduationCap size={16} />
                            <span style={serif}>先看觀庭前教程（推薦）</span>
                          </div>
                          <ChevronRight size={14} className="transition-transform group-hover:translate-x-1" />
                        </Link>
                        <Link href="/sessions/compose" className="inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-[#7B8C4E] to-[#5A6F35] px-5 py-4 text-[15px] font-black text-white shadow-[0_10px_24px_rgba(123,140,78,0.22)] transition-transform hover:scale-[1.01]">
                          開啟跨場次工作檯
                        </Link>
                      </div>
                    </motion.div>
                  </>
                )}
                </div>
              </div>
            </div>
          </FadeIn>

          <FadeIn>
            <motion.div layout className="rounded-[2rem] border border-gray-100 bg-white p-8 shadow-sm">
              <div className="flex items-start justify-between gap-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-gray-200 bg-gray-50 text-gray-400">
                    <BookOpen size={24} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-gray-900" style={serif}>
                      2024 年至 2025 年：準備程序庭（共 4 次）
                    </h3>
                    <p className="mt-1 font-medium text-gray-500">此階段主要進行證據能力確認與不認罪答辯：</p>
                  </div>
                </div>

                <button
                  type="button"
                  aria-expanded={isPreparationOpen}
                  aria-label="展開準備程序庭"
                  onClick={() => setIsPreparationExpanded((current) => !current)}
                  onMouseEnter={() => setIsPreparationPeek(true)}
                  onMouseLeave={() => setIsPreparationPeek(false)}
                  className="mt-1 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#DCE6BF] bg-[#F9FBE7] text-[#6B8E23] shadow-sm transition-colors hover:bg-[#F1F6DB]"
                >
                  <motion.div animate={{ rotate: isPreparationOpen ? 180 : 0, y: isPreparationOpen ? 1 : 0 }} transition={{ type: 'spring', stiffness: 320, damping: 22 }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </motion.div>
                </button>
              </div>

              <AnimatePresence initial={false}>
                {isPreparationOpen && (
                  <motion.div
                    key="preparation-grid"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.22, ease: 'easeOut' }}
                    className="mt-6 grid gap-4 md:grid-cols-2"
                    onMouseEnter={() => setIsPreparationPeek(true)}
                    onMouseLeave={() => setIsPreparationPeek(false)}
                  >
                    {preparationHearings.map((hearing) => (
                      <motion.div key={hearing.date} whileHover={{ y: -2, scale: 1.01 }} className="overflow-hidden rounded-[2rem] border border-gray-100 bg-gradient-to-br from-white to-[#FBFBFB] px-5 py-5 shadow-sm transition-shadow hover:shadow-md">
                        <div className="flex items-start gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-gray-200 bg-white text-gray-400">
                            <BookOpen size={18} />
                          </div>
                          <div>
                            <span className="inline-flex rounded-xl bg-white px-3 py-2 text-sm font-black text-gray-700 shadow-sm">{hearing.date}</span>
                            <p className="mt-2 text-[15px] font-bold leading-relaxed text-gray-700">{hearing.desc}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div>
              <div className="mb-8 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#E9EDDA] bg-[#F9FBE7] text-[#6B8E23]">
                  <Gavel size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-gray-900" style={serif}>
                    2025 年末至 2026 年：審理程序庭（共 7 次）
                  </h3>
                  <p className="mt-1 font-medium text-gray-500">此階段進入實質審理，包括證人詰問與言詞辯論：</p>
                </div>
              </div>

              <div className="relative space-y-4 before:absolute before:inset-y-0 before:left-6 before:w-0.5 before:bg-[#E9EDDA]">
                {trialHearings.map((hearing, i) => {
                  const matchingPublished =
                    publishedSessions.find((ps) => ps.date === hearing.date) ||
                    (hearing.date === latestPublished?.date ? latestPublished : null) ||
                    (hearing.date === '2026-02-26' ? { sessionId: 's-114-1-6', summary: '審理庭第六場次 論告與最終辯論還原' } : null);

                  const isPublished = !!matchingPublished;
                  const witnessLabels = hearing.witnesses.length > 0 ? hearing.witnesses : ['無證人'];

                  return (
                    <FadeIn key={`${hearing.date}-${hearing.title}`} delay={i * 0.05}>
                      <div className="group relative flex items-center gap-6">
                        <div className={`z-10 h-3 w-3 shrink-0 rounded-full border-2 border-white ${isPublished ? "bg-[#6B8E23] ring-4 ring-[#F9FBE7]" : "bg-[#C9C3B8] ring-4 ring-[#F5F1E8]"}`} />

                        {isPublished ? (
                          <Link href={`/sessions/${matchingPublished.sessionId}`} className="block flex-1">
                            <motion.div whileHover={{ y: -2, scale: 1.01 }} className="h-full rounded-[2rem] border-2 border-[#E9EDDA] bg-white p-6 shadow-sm transition-all hover:border-[#6B8E23] hover:shadow-xl">
                              <div className="mb-3 flex flex-wrap items-center gap-3">
                                {hearing.highlight && <span className="animate-pulse rounded-full bg-orange-100 px-3 py-1 text-xs font-black uppercase tracking-wider text-orange-700">最新進展</span>}
                                <span className="rounded-full bg-[#F9FBE7] px-3 py-1 text-sm font-black text-[#6B8E23]">{hearing.displayDate}</span>
                                <span className="ml-auto inline-flex items-center rounded-full bg-[#6B8E23] px-3 py-1 text-xs font-black tracking-[0.16em] text-white shadow-sm">已公開完整筆記</span>
                              </div>
                              <h4 className="text-[20px] font-black text-gray-900 transition-colors group-hover:text-[#6B8E23] md:text-[22px]" style={serif}>
                                {hearing.title}
                              </h4>
                              {hearing.topic && <p className="mt-1 text-[16px] font-bold text-[#6B8E23]">{hearing.topic}</p>}
                              <p className="mt-2 font-medium leading-relaxed text-gray-600">{matchingPublished.summary || hearing.desc}</p>
                              <div className="mt-4 rounded-xl border border-gray-100 bg-gray-50 p-3">
                                <p className="mb-1.5 flex items-center gap-1 text-[13px] font-bold text-gray-500">
                                  <BookOpen size={14} />
                                  傳喚證人：
                                </p>
                                <div className="flex flex-wrap gap-2">
                                  {witnessLabels.map((witness) => (
                                    <Tooltip key={witness}>
                                      <TooltipTrigger asChild>
                                        <span className={`rounded-xl border px-3 py-2 text-[13px] font-black shadow-sm transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-md ${witness === "無證人" ? "border-gray-200 bg-white text-gray-500" : getWitnessStyle(witness)}`}>
                                          {witness}
                                        </span>
                                      </TooltipTrigger>
                                      <TooltipContent className="max-w-[220px]">{getWitnessHint(witness)}</TooltipContent>
                                    </Tooltip>
                                  ))}
                                </div>
                              </div>
                              <div className="mt-4 text-sm font-black text-[#6B8E23]">點擊進入完整筆記</div>
                            </motion.div>
                          </Link>
                        ) : (
                          <div className="relative flex-1 overflow-hidden rounded-[2rem] border-2 border-[#D9D4CA] bg-[#F4F1EA] p-6 shadow-sm grayscale-[0.22]">
                            <div className="absolute right-5 top-5 rotate-[7deg] rounded-full border border-[#E6E0D6] bg-[#D9D1C6] px-4 py-1.5 text-[11px] font-black tracking-[0.18em] text-[#6F6559] shadow-sm">
                              彙整審核中
                            </div>
                            <div className="mb-3 flex flex-wrap items-center gap-3">
                              <span className="rounded-full bg-[#E3DED4] px-3 py-1 text-sm font-black text-[#7A7166]">{hearing.displayDate}</span>
                              <span className="inline-flex items-center gap-1 rounded-full border border-[#DDD6CA] bg-[#ECE7DE] px-3 py-1 text-xs font-black uppercase tracking-wider text-[#7A7166]">
                                <PenTool size={12} />
                                筆記整理中
                              </span>
                            </div>
                            <h4 className="text-[20px] font-black text-[#403A34] md:text-[22px]" style={serif}>
                              {hearing.title}
                            </h4>
                            {hearing.topic && <p className="mt-1 text-[16px] font-bold text-[#7B746B]">{hearing.topic}</p>}
                            {hearing.desc && <p className="mt-2 font-medium leading-relaxed text-[#6E665C]">{hearing.desc}</p>}
                            <div className="mt-4 rounded-xl border border-[#E4DED4] bg-[#F8F6F1] p-3">
                              <p className="mb-1.5 flex items-center gap-1 text-[13px] font-bold text-[#8A8175]">
                                <BookOpen size={14} />
                                傳喚證人：
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {witnessLabels.map((witness) => (
                                  <Tooltip key={witness}>
                                    <TooltipTrigger asChild>
                                      <span className={`rounded-xl border px-3 py-2 text-[13px] font-black shadow-sm ${witness === "無證人" ? "border-[#DDD6CA] bg-white text-[#8A8175]" : `${getWitnessStyle(witness)} opacity-80`}`}>
                                        {witness}
                                      </span>
                                    </TooltipTrigger>
                                    <TooltipContent className="max-w-[220px]">{getWitnessHint(witness)}</TooltipContent>
                                  </Tooltip>
                                ))}
                              </div>
                            </div>
                            <div className="mt-4 inline-flex items-center rounded-full border border-[#D7D0C3] bg-white/80 px-4 py-2 text-sm font-black text-[#7A7166]">
                              完整筆記尚在整理與審核中
                            </div>
                          </div>
                        )}
                      </div>
                    </FadeIn>
                  );
                })}
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="relative mt-12 overflow-hidden rounded-[2.5rem] border border-orange-100 bg-gradient-to-br from-orange-50 to-[#FFF7ED] p-8 text-center shadow-inner md:p-10">
              <div className="absolute -mr-10 -mt-10 h-40 w-40 rounded-full bg-orange-200/40 blur-3xl mix-blend-multiply" />
              <div className="absolute -mb-10 -ml-10 h-40 w-40 rounded-full bg-[#F9FBE7]/80 blur-3xl mix-blend-multiply" />
              <div className="relative z-10 space-y-4">
                <Gavel size={48} className="mx-auto mb-2 text-orange-400" />
                <h2 className="text-2xl font-black text-orange-900 md:text-3xl" style={serif}>
                  一審宣判預告
                </h2>
                <p className="inline-block rounded-2xl bg-white/60 px-6 py-2 text-[18px] font-bold leading-relaxed text-orange-800/80 md:text-[20px]">
                  台北地院已訂於
                  <span className="mx-1 text-orange-600 underline decoration-orange-300 underline-offset-4">2026 年 4 月 16 日</span>
                  正式宣判一審結果
                </p>
              </div>
            </div>
          </FadeIn>
        </section>
      </div>
    </TooltipProvider>
  );
}
