'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, useScroll } from 'framer-motion';
import { BookOpen, Flame, Gavel, PenTool } from 'lucide-react';
import SubpageHeader from '@/components/SubpageHeader';
import { FadeIn } from '@/components/ui-shared';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

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

export default function SessionsPage() {
  const [publishedSessions, setPublishedSessions] = useState<SessionData[]>([]);
  const [loading, setLoading] = useState(true);
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    fetch('/api/sessions')
      .then((r) => r.json())
      .then((d) => {
        if (d.ok) {
          const uniqueSessions = Array.from(
            new Map(d.data.map((item: SessionData) => [item.sessionId, item])).values(),
          );
          setPublishedSessions(uniqueSessions as SessionData[]);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const latestPublished = publishedSessions[0];

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-20 font-sans text-gray-800 selection:bg-[#6B8E23]/20">
      <motion.div
        className="fixed left-0 right-0 top-0 z-[100] h-[3px] origin-left"
        style={{
          scaleX: scrollYProgress,
          background: 'linear-gradient(90deg, #6B8E23, #B8860B, #C67B5C)',
        }}
      />

      <SubpageHeader />

      <div className="relative overflow-hidden border-b border-gray-100 bg-white shadow-sm">
        <div className="pointer-events-none absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-[#F9FBE7] to-transparent" />
        <div className="relative z-10 mx-auto max-w-5xl px-6 py-12 md:py-16">
          <h1 className="mb-4 text-3xl font-black leading-tight text-gray-900 md:text-5xl" style={serif}>
            114年度訴字第51號過失致死等案
            <br className="hidden md:block" />
            <span className="text-[#6B8E23]">俗稱剴剴社工案</span>
          </h1>
          <p className="max-w-3xl text-lg font-medium leading-relaxed text-gray-600">
            依據目前（截至 2026 年 3 月底）彙整附件可確認的審理進度，兒福聯盟陳姓社工在「剴剴案」中被控過失致死與偽造文書罪，台北地院已完成審理，累計庭期與具體日期整理如下：
            <br />
            <span className="mt-2 inline-block bg-[#F9FBE7] px-2 py-0.5 font-bold text-gray-900">
              陳姓社工於一審期間目前可確認審理程序庭（共 7 次），另已公告將於 2026 年 4 月 16 日宣判。
            </span>
          </p>
        </div>
      </div>

      <section className="mx-auto max-w-4xl space-y-12 px-6 py-12">
        <FadeIn>
          <div className="mb-8">
            <div className="mb-6 overflow-hidden rounded-[2.25rem] border border-[#F1DDC0] bg-gradient-to-r from-[#FFF6EC] via-white to-[#F9FBE7] shadow-sm">
              <div className="flex flex-col gap-5 p-6 md:p-7">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-orange-100 bg-orange-50 text-orange-500">
                    <Flame size={24} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-gray-900 md:text-3xl" style={serif}>
                      目前已發布的完整筆記
                    </h3>
                    <p className="mt-1 text-[17px] font-bold leading-relaxed text-[#6A6257]">
                      您可以直接點擊進入閱覽觀庭還原筆記並編輯論述
                    </p>
                  </div>
                </div>

                <div className="rounded-[1.6rem] border border-[#E7E1D7] bg-white/75 px-5 py-4 shadow-[0_10px_24px_rgba(164,136,96,0.08)]">
                  <p className="text-sm font-black tracking-[0.18em] text-[#7A8745]">工作檯導覽</p>
                  <p className="mt-2 text-[15px] font-bold leading-relaxed text-[#6A6257]">
                    下方為各場次還原筆記（工作檯），右側為跨場次工作檯，可同時調用多場次還原筆記進行編輯論述，歡迎使用。
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              {loading ? (
                <>
                  <div className="rounded-[2rem] border border-[#E8E0D4] bg-white px-6 py-5 text-[16px] font-bold text-[#8A8078] shadow-sm">
                    正在載入已發布筆記...
                  </div>
                  <div className="rounded-[2rem] border border-[#E9EDDA] bg-gradient-to-br from-[#F9FBE7] via-white to-[#F3F7E5] p-6 shadow-sm">
                    <p className="text-[15px] font-bold text-[#5D6A3C]">跨場次工作檯資訊整理中...</p>
                  </div>
                </>
              ) : (
                <>
                  {publishedSessions.length === 0 ? (
                    <Link href="/sessions/s-114-1-6" className="block h-full">
                      <motion.div
                        whileHover={{ y: -2, scale: 1.01 }}
                        className="group relative flex h-full min-h-[280px] overflow-hidden rounded-[2rem] border-2 border-orange-200 bg-white p-6 shadow-sm transition-all hover:border-orange-400 hover:shadow-xl"
                      >
                        <div className="absolute -mr-10 -mt-10 h-32 w-32 rounded-bl-full bg-orange-50 transition-transform group-hover:scale-110" />
                        <div className="relative z-10 flex h-full flex-col">
                          <div className="mb-3 flex flex-wrap items-center gap-2">
                            <span className="rounded-full bg-orange-500 px-3 py-1 text-xs font-black uppercase tracking-wider text-white shadow-sm">
                              最新發布
                            </span>
                            <span className="rounded-full bg-orange-100 px-3 py-1 text-sm font-black text-orange-700">02 月 26 日</span>
                          </div>
                          <h4 className="mb-3 text-[20px] font-black leading-tight text-gray-900 md:text-[24px]" style={serif}>
                            第六場次：最終言詞辯論
                          </h4>
                          <p className="text-[15px] font-bold leading-relaxed text-gray-600">
                            檢察官論告與辯護律師簡報陳述還原
                          </p>
                          <div className="mt-5 rounded-2xl border border-orange-100 bg-[#FFF9F2] p-4 text-sm font-bold leading-relaxed text-[#8A6235]">
                            收束至最終言詞辯論與最後陳述的核心場次，適合作為進入完整還原筆記與論述編修的起點。
                          </div>
                          <div className="mt-auto pt-4 text-sm font-black text-[#6B8E23]">點擊開啟工作檯 →</div>
                        </div>
                      </motion.div>
                    </Link>
                  ) : (
                    <Link href={`/sessions/${publishedSessions[0].sessionId}`} className="block h-full">
                      <motion.div
                        whileHover={{ y: -2, scale: 1.01 }}
                        className="group relative flex h-full min-h-[280px] overflow-hidden rounded-[2rem] border-2 border-orange-200 bg-white p-6 shadow-sm transition-all hover:border-orange-400 hover:shadow-xl"
                      >
                        <div className="absolute -mr-10 -mt-10 h-32 w-32 rounded-bl-full bg-orange-50 transition-transform group-hover:scale-110" />
                        <div className="relative z-10 flex h-full flex-col">
                          <div className="mb-3 flex flex-wrap items-center gap-2">
                            <span className="rounded-full bg-orange-500 px-3 py-1 text-xs font-black uppercase tracking-wider text-white shadow-sm">
                              最新發布
                            </span>
                            <span className="rounded-full bg-orange-100 px-3 py-1 text-sm font-black text-orange-700">
                              {publishedSessions[0].date}
                            </span>
                          </div>
                          <h4 className="mb-3 text-[20px] font-black leading-tight text-gray-900 md:text-[24px]" style={serif}>
                            {publishedSessions[0].title}
                          </h4>
                          <p className="text-[15px] font-bold leading-relaxed text-gray-600">
                            {publishedSessions[0].summary || '包含證人詰問與重要言詞辯論實況'}
                          </p>
                          <div className="mt-5 rounded-2xl border border-orange-100 bg-[#FFF9F2] p-4 text-sm font-bold leading-relaxed text-[#8A6235]">
                            直接進入該場次工作檯，閱覽已整理完成的還原筆記，並在同頁面進行編輯與論述整理。
                          </div>
                          <div className="mt-auto pt-4 text-sm font-black text-[#6B8E23]">點擊開啟工作檯 →</div>
                        </div>
                      </motion.div>
                    </Link>
                  )}

                  <motion.div
                    whileHover={{ y: -2, scale: 1.01 }}
                    className="relative h-full min-h-[280px] overflow-hidden rounded-[2rem] border border-[#E9EDDA] bg-gradient-to-br from-[#F9FBE7] via-white to-[#F3F7E5] p-6 shadow-sm"
                  >
                    <div className="absolute -right-12 -top-12 h-28 w-28 rounded-full bg-[#E6F0C6] blur-2xl" />
                    <div className="relative z-10 flex h-full flex-col">
                      <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#6B8E23] px-3 py-1 text-xs font-black tracking-[0.2em] text-white">
                        多場次共構
                      </div>
                      <h4 className="text-[20px] font-black text-gray-900 md:text-[24px]" style={serif}>
                        跨場次工作檯
                      </h4>
                      <p className="mt-3 text-[15px] font-medium leading-relaxed text-gray-600">
                        此為跨場次工作檯，可同時調用多場次還原筆記進行編輯論述，歡迎使用。
                      </p>
                      <div className="mt-5 rounded-2xl border border-[#E9EDDA] bg-white/85 p-4 text-sm font-bold leading-relaxed text-[#5D6A3C]">
                        可在同一篇論述中整合不同場次筆記、比對內容脈絡，形成跨場次的完整觀庭共構筆記。
                      </div>
                      <Link
                        href="/sessions/compose"
                        className="mt-auto inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-[#7B8C4E] to-[#5A6F35] px-5 py-4 text-[15px] font-black text-white shadow-[0_10px_24px_rgba(123,140,78,0.22)] transition-transform hover:scale-[1.01]"
                      >
                        開啟跨場次工作檯
                      </Link>
                    </div>
                  </motion.div>
                </>
              )}
            </div>
          </div>
        </FadeIn>

        <FadeIn>
          <div className="rounded-[2rem] border border-gray-100 bg-white p-8 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
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
            <Accordion type="single" collapsible className="grid gap-4 md:grid-cols-2">
              {preparationHearings.map((hearing, index) => (
                <AccordionItem key={hearing.date} value={`prep-${index}`}>
                  <motion.div
                    whileHover={{ y: -2, scale: 1.01 }}
                    className="overflow-hidden rounded-[2rem] border border-gray-100 bg-gradient-to-br from-white to-[#FBFBFB] shadow-sm transition-shadow hover:shadow-md"
                  >
                    <AccordionTrigger className="px-5 py-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-gray-200 bg-white text-gray-400">
                          <BookOpen size={18} />
                        </div>
                        <div>
                          <span className="inline-flex rounded-xl bg-white px-3 py-2 text-sm font-black text-gray-700 shadow-sm">
                            {hearing.date}
                          </span>
                          <p className="mt-2 text-[15px] font-bold leading-relaxed text-gray-700">
                            {hearing.desc}
                          </p>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-5 pb-5">
                      <div className="rounded-[1.35rem] border border-[#E8E3D9] bg-[#FFFDF8] p-4 text-[14px] font-medium leading-relaxed text-[#6A6257]">
                        此階段為正式審理前的程序整理與證據能力確認，相關筆記尚未整理為獨立工作檯，但可作為理解後續審理節奏的重要前情資訊。
                      </div>
                    </AccordionContent>
                  </motion.div>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
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
                  (hearing.date === '2026-02-26'
                    ? { sessionId: 's-114-1-6', summary: '審理庭第六場次 論告與最終辯論還原' }
                    : null);

                const isPublished = !!matchingPublished;
                const witnessLabels = hearing.witnesses.length > 0 ? hearing.witnesses : ['無證人'];

                return (
                  <FadeIn key={`${hearing.date}-${hearing.title}`} delay={i * 0.05}>
                    <div className="group relative flex items-center gap-6">
                      <div
                        className={`z-10 h-3 w-3 shrink-0 rounded-full border-2 border-white ${
                          isPublished ? 'bg-[#6B8E23] ring-4 ring-[#F9FBE7]' : 'bg-gray-300'
                        }`}
                      />

                      {isPublished ? (
                        <Link href={`/sessions/${matchingPublished.sessionId}`} className="block flex-1">
                          <motion.div
                            whileHover={{ y: -2, scale: 1.01 }}
                            className="h-full rounded-[2rem] border-2 border-[#E9EDDA] bg-white p-6 shadow-sm transition-all hover:border-[#6B8E23] hover:shadow-xl"
                          >
                            <div className="mb-3 flex flex-wrap items-center gap-3">
                              {hearing.highlight && (
                                <span className="animate-pulse rounded-full bg-orange-100 px-3 py-1 text-xs font-black uppercase tracking-wider text-orange-700">
                                  最新進展
                                </span>
                              )}
                              <span className="rounded-full bg-[#F9FBE7] px-3 py-1 text-sm font-black text-[#6B8E23]">
                                {hearing.displayDate}
                              </span>
                              <span className="ml-auto text-sm font-bold text-gray-500">點擊進入完整筆記</span>
                            </div>
                            <h4
                              className="text-[20px] font-black text-gray-900 transition-colors group-hover:text-[#6B8E23] md:text-[22px]"
                              style={serif}
                            >
                              {hearing.title}
                            </h4>
                            {hearing.topic && <p className="mt-1 text-[16px] font-bold text-[#6B8E23]">{hearing.topic}</p>}
                            <p className="mt-2 font-medium leading-relaxed text-gray-600">
                              {matchingPublished.summary || hearing.desc}
                            </p>
                            <div className="mt-4 rounded-xl border border-gray-100 bg-gray-50 p-3">
                              <p className="mb-1.5 flex items-center gap-1 text-[13px] font-bold text-gray-500">
                                <BookOpen size={14} />
                                傳喚證人：
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {witnessLabels.map((witness) => (
                                  <span
                                    key={witness}
                                    className={`rounded-xl border px-3 py-2 text-[13px] font-black shadow-sm ${
                                      witness === '無證人' ? 'border-gray-200 bg-white text-gray-500' : getWitnessStyle(witness)
                                    }`}
                                  >
                                    {witness}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </motion.div>
                        </Link>
                      ) : (
                        <motion.div
                          whileHover={{ y: -2, scale: 1.01 }}
                          className="flex-1 rounded-[2rem] border-2 border-gray-200 bg-white p-6 shadow-sm transition-all hover:border-[#B8C88B] hover:shadow-xl"
                        >
                          <div className="mb-3 flex flex-wrap items-center gap-3">
                            <span className="rounded-full bg-gray-200 px-3 py-1 text-sm font-black text-gray-500">{hearing.displayDate}</span>
                            <span className="inline-flex items-center gap-1 rounded-full bg-[#EEF3E1] px-3 py-1 text-xs font-black uppercase tracking-wider text-[#6B8E23]">
                              <PenTool size={12} />
                              筆記整理中
                            </span>
                          </div>
                          <h4 className="text-[20px] font-black text-gray-900 md:text-[22px]" style={serif}>
                            {hearing.title}
                          </h4>
                          {hearing.topic && <p className="mt-1 text-[16px] font-bold text-[#6B8E23]">{hearing.topic}</p>}
                          {hearing.desc && <p className="mt-2 font-medium leading-relaxed text-gray-600">{hearing.desc}</p>}
                          <div className="mt-4 rounded-xl border border-gray-100 bg-gray-50 p-3">
                            <p className="mb-1.5 flex items-center gap-1 text-[13px] font-bold text-gray-500">
                              <BookOpen size={14} />
                              傳喚證人：
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {witnessLabels.map((witness) => (
                                <span
                                  key={witness}
                                  className={`rounded-xl border px-3 py-2 text-[13px] font-black shadow-sm ${
                                    witness === '無證人' ? 'border-gray-200 bg-white text-gray-500' : getWitnessStyle(witness)
                                  }`}
                                >
                                  {witness}
                                </span>
                              ))}
                            </div>
                          </div>
                        </motion.div>
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
                <span className="mx-1 text-orange-600 underline decoration-orange-300 underline-offset-4">
                  2026 年 4 月 16 日 下午
                </span>
                正式宣判一審結果
              </p>
            </div>
          </div>
        </FadeIn>
      </section>
    </div>
  );
}
