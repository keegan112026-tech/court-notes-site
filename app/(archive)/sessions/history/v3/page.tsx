'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, useScroll } from 'framer-motion';
import { ArrowLeft, BookOpen, Flame, Gavel } from 'lucide-react';
import { FadeIn } from '@/components/ui-shared';

const serif = { fontFamily: "'Noto Serif TC', serif" };

interface SessionData {
  id: string;
  sessionId: string;
  title: string;
  date: string;
  category: string;
  summary: string;
  hotTopic: boolean;
  participantsCount: number;
}

export default function SessionsHistoryV3Page() {
  const [publishedSessions, setPublishedSessions] = useState<SessionData[]>([]);
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    fetch('/api/sessions')
      .then((r) => r.json())
      .then((d) => {
        if (d.ok) {
          const uniqueSessions = Array.from(new Map(d.data.map((item: any) => [item.sessionId, item])).values());
          setPublishedSessions(uniqueSessions as SessionData[]);
        }
      })
      .catch(() => {});
  }, []);

  const trialSessions = [
    { title: '第1次開庭', date: '2025-11-27', displayDate: '11 月 27 日', topic: '收出養政策與地方政府交接責任', desc: '釐清中央政策下收出養的標準流程，以及新北市社會局與兒盟之間的個案交接資訊是否對等', witnesses: ['徐佩華 (衛福部社家署)', '施盈如 (新北社會局)', '丁雁琪 (天主教福利會)'] },
    { title: '第2次開庭', date: '2025-12-11', displayDate: '12 月 11 日', topic: '醫療端初步判定與兒盟核心督導責任', desc: '急診醫師針對剴剴到院時的第一線觀察；同時詰問陳尚潔的主管（江怡韻），釐清其對陳提交的訪視紀錄是否有實質審核與質疑', witnesses: ['黃聖心 (萬芳醫院)', '李芳玲 (兒盟)', '江怡韻 (兒盟督導)'] },
    { title: '第3次開庭', date: '2025-12-18', displayDate: '12 月 18 日', topic: '兒盟高層管理與內部通報系統', desc: '透過高層與中階主管的證詞，釐清兒盟內部是否存在「為了維持媒合率而忽略風險」或「系統性隱匿」的組織文化', witnesses: ['白麗芳 (前兒盟執行長)', '葉亭希 (兒盟組長)', '葉詩宇 (兒盟督導)'] },
    { title: '第4次開庭', date: '2026-01-22', displayDate: '1 月 22 日', topic: '第一線專業觀察與居托監督缺失', desc: '針對剴剴生前異常脫牙的醫療診斷，以及負責監督保母（劉彩萱）的文山居托中心，為何也未能察覺保母異樣', witnesses: ['蔡函妤 (牙醫師)', '林心慈 (文山居托)', '黃鈴芳 (文山居托督導)'] },
    { title: '第5次開庭', date: '2026-01-29', displayDate: '01 月 29 日', topic: '主管機關行政監督責任', desc: '釐清台北市社會局對合格保母的考核與居家托育服務中心的管理機制是否存在漏洞', witnesses: ['粘羽涵 (北市社會局)'] },
    { title: '加開庭次', date: '2026-02-23', displayDate: '02 月 23 日', topic: '程序進行與準備', desc: '細節待確認或補充' },
    { title: '第十次開庭：最終言詞辯論 (第6次審理程序開庭)', date: '2026-02-26', displayDate: '02 月 26 日', highlight: true, topic: '檢察官論告與辯護律師簡報與陳述還原', desc: '全案辯論終結，檢方依過失致死與偽造文書罪論告，辯護律師進行法理辯護。' },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-20 font-sans text-gray-800 selection:bg-[#6B8E23]/20">
      <motion.div className="fixed left-0 right-0 top-0 z-[100] h-[3px] origin-left" style={{ scaleX: scrollYProgress, background: 'linear-gradient(90deg, #6B8E23, #B8860B, #C67B5C)' }} />

      <div className="relative overflow-hidden border-b border-gray-100 bg-white shadow-sm">
        <div className="pointer-events-none absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-[#F9FBE7] to-transparent" />
        <div className="relative z-10 mx-auto max-w-5xl px-6 py-12 md:py-16">
          <Link href="/sessions/history" className="mb-6 inline-flex items-center gap-2 rounded-full border border-gray-100 bg-gray-50 px-4 py-2 text-sm font-bold text-gray-500 shadow-sm transition-colors hover:text-[#6B8E23]">
            <ArrowLeft size={16} />
            返回歷史版本列表
          </Link>
          <h1 className="mb-4 text-3xl font-black leading-tight text-gray-900 md:text-5xl" style={serif}>
            114年度訴字第51號過失致死等案
            <br className="hidden md:block" />
            <span className="text-[#6B8E23]">俗稱剴剴社工案</span>
          </h1>
          <p className="max-w-3xl text-lg font-medium leading-relaxed text-gray-600">
            依據目前（截至 2026 年 2 月底）的審理進度，兒福聯盟陳姓社工在「剴剴案」中被控過失致死與偽造文書罪，台北地院已完成審理，累計開庭次數與具體日期整理如下：
            <br />
            <span className="mt-2 inline-block bg-[#F9FBE7] px-2 py-0.5 font-bold text-gray-900">陳姓社工於一審期間共計開庭 10 次。</span>
          </p>
        </div>
      </div>

      <section className="mx-auto max-w-4xl space-y-12 px-6 py-12">
        <FadeIn>
          <div className="mb-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-orange-100 bg-orange-50 text-orange-500">
                <Flame size={24} />
              </div>
              <div>
                <h3 className="text-2xl font-black text-gray-900 md:text-3xl" style={serif}>目前已發布的完整筆記</h3>
                <p className="mt-1 font-medium text-gray-500">您可以直接點擊進入閱讀整理好的現場還原與論述：</p>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {publishedSessions.length === 0 && (
                <Link href="/sessions/s-114-1-6" className="block">
                  <motion.div whileHover={{ y: -2, scale: 1.01 }} className="group relative h-full overflow-hidden rounded-[2rem] border-2 border-orange-200 bg-white p-6 shadow-sm transition-all hover:border-orange-400 hover:shadow-xl">
                    <div className="absolute -mr-10 -mt-10 h-32 w-32 rounded-bl-full bg-orange-50 transition-transform group-hover:scale-110" />
                    <div className="relative z-10">
                      <div className="mb-3 flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-orange-500 px-3 py-1 text-xs font-black uppercase tracking-wider text-white shadow-sm">🔥 最新發布</span>
                        <span className="rounded-full bg-orange-100 px-3 py-1 text-sm font-black text-orange-700">2 月 26 日</span>
                      </div>
                      <h4 className="mb-2 text-[20px] font-black leading-tight text-gray-900" style={serif}>第十次開庭：最終言詞辯論</h4>
                      <p className="text-sm font-bold text-gray-600">檢察官論告與辯護律師簡報與陳述還原</p>
                    </div>
                  </motion.div>
                </Link>
              )}
              {publishedSessions.map((ps) => (
                <Link key={ps.id} href={`/sessions/${ps.sessionId}`} className="block">
                  <motion.div whileHover={{ y: -2, scale: 1.01 }} className="group relative h-full overflow-hidden rounded-[2rem] border-2 border-orange-200 bg-white p-6 shadow-sm transition-all hover:border-orange-400 hover:shadow-xl">
                    <div className="absolute -mr-10 -mt-10 h-32 w-32 rounded-bl-full bg-orange-50 transition-transform group-hover:scale-110" />
                    <div className="relative z-10">
                      <div className="mb-3 flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-orange-500 px-3 py-1 text-xs font-black uppercase tracking-wider text-white shadow-sm">最新發布</span>
                        <span className="rounded-full bg-orange-100 px-3 py-1 text-sm font-black text-orange-700">{ps.date}</span>
                      </div>
                      <h4 className="mb-2 text-[20px] font-black leading-tight text-gray-900" style={serif}>{ps.title}</h4>
                      <p className="line-clamp-2 text-sm font-bold text-gray-600">{ps.summary || '包含證人詰問與重要言詞辯論實況'}</p>
                    </div>
                  </motion.div>
                </Link>
              ))}
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
                <h3 className="text-2xl font-black text-gray-900" style={serif}>2024 年至 2025 年：準備程序庭（共 4 次）</h3>
                <p className="mt-1 font-medium text-gray-500">此階段主要進行證據能力確認與不認罪答辯：</p>
              </div>
            </div>
            <div className="grid gap-3 border-l-2 border-gray-100 pl-[1.65rem]">
              {[
                { date: '07 月 17 日', desc: '首度開庭，陳姓社工不認罪。' },
                { date: '08 月 27 日', desc: '第二次準備程序庭。' },
                { date: '10 月 15 日', desc: '第三次準備程序庭。' },
                { date: '12 月 04 日', desc: '第四次準備程序庭。' },
              ].map((s, i) => (
                <div key={i} className="relative -ml-[1.6rem] flex items-start gap-4 rounded-2xl border border-gray-100 bg-gray-50 p-4 text-[16px]">
                  <div className="mt-1.5 h-3 w-3 shrink-0 rounded-full border-2 border-white bg-gray-300" />
                  <div>
                    <span className="mr-2 rounded bg-white px-2 py-1 font-black text-gray-700 shadow-sm">{s.date}</span>
                    <span className="font-medium text-gray-600">{s.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div>
            <div className="mb-8 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#E9EDDA] bg-[#F9FBE7] text-[#6B8E23]">
                <Gavel size={24} />
              </div>
              <div>
                <h3 className="text-2xl font-black text-gray-900" style={serif}>2025 年末至 2026 年：審理程序庭（共 6 次）</h3>
                <p className="mt-1 font-medium text-gray-500">此階段進入實質審理，包括證人詰問與言詞辯論：</p>
              </div>
            </div>

            <div className="relative space-y-4 before:absolute before:inset-y-0 before:left-6 before:w-0.5 before:bg-[#E9EDDA]">
              {trialSessions.map((s, i) => {
                const matchingPublished = publishedSessions.find((ps) => ps.date === s.date) || (s.date === '2026-02-26' ? { sessionId: 's-114-1-6', summary: '審理庭第六場次 論告與最終辯論' } : null);
                const isPublished = !!matchingPublished;
                return (
                  <FadeIn key={i} delay={i * 0.05}>
                    <div className="group relative flex items-center gap-6">
                      <div className={`z-10 h-3 w-3 shrink-0 rounded-full border-2 border-white ${isPublished ? 'bg-[#6B8E23] ring-4 ring-[#F9FBE7]' : 'bg-gray-300'}`} />
                      {isPublished ? (
                        <Link href={`/sessions/${matchingPublished.sessionId}`} className="block flex-1">
                          <motion.div whileHover={{ y: -2, scale: 1.01 }} className="h-full rounded-[2rem] border-2 border-[#E9EDDA] bg-white p-6 shadow-sm transition-all hover:border-[#6B8E23] hover:shadow-xl">
                            <div className="mb-3 flex flex-wrap items-center gap-3">
                              {s.highlight && <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-black uppercase tracking-wider text-orange-700 animate-pulse">最新進展</span>}
                              <span className="rounded-full bg-[#F9FBE7] px-3 py-1 text-sm font-black text-[#6B8E23]">{s.displayDate}</span>
                              <span className="ml-auto text-sm font-bold text-gray-500">點擊進入完整筆記</span>
                            </div>
                            <h4 className="text-[20px] font-black text-gray-900 transition-colors group-hover:text-[#6B8E23] md:text-[22px]" style={serif}>{s.title}</h4>
                            {s.topic && <p className="mt-1 text-[16px] font-bold text-[#6B8E23]">{s.topic}</p>}
                            <p className="mt-2 font-medium leading-relaxed text-gray-600">{matchingPublished.summary || s.desc}</p>
                            {s.witnesses && (
                              <div className="mt-4 rounded-xl border border-gray-100 bg-gray-50 p-3">
                                <p className="mb-1.5 flex items-center gap-1 text-[13px] font-bold text-gray-500"><BookOpen size={14} /> 傳喚證人：</p>
                                <div className="flex flex-wrap gap-2">
                                  {s.witnesses.map((w: string) => <span key={w} className="rounded border border-gray-100 bg-white px-2 py-1 text-[13px] font-black text-gray-700 shadow-sm">{w}</span>)}
                                </div>
                              </div>
                            )}
                          </motion.div>
                        </Link>
                      ) : (
                        <div className="flex flex-1 flex-col justify-between gap-6 rounded-[2rem] border border-gray-100 bg-gray-50/50 p-6 opacity-80 transition-all hover:opacity-100 md:flex-row md:items-start">
                          <div className="flex-1">
                            <div className="mb-2 flex items-center gap-3">
                              <span className="rounded-full bg-gray-200 px-3 py-1 text-sm font-black text-gray-500">{s.displayDate}</span>
                              <span className="rounded-md bg-gray-200 px-2 py-0.5 text-xs font-bold text-gray-500">筆記整理中</span>
                            </div>
                            <h4 className="text-[18px] font-black text-gray-700 md:text-[20px]" style={serif}>{s.title}</h4>
                            {s.topic && <p className="mt-1 line-clamp-1 text-[15px] font-bold text-[#6B8E23]">{s.topic}</p>}
                            {s.desc && <p className="mt-1.5 line-clamp-2 text-[15px] font-medium leading-relaxed text-gray-500">{s.desc}</p>}
                            {s.witnesses && (
                              <div className="mt-3 rounded-xl border border-gray-100 bg-white p-3">
                                <p className="mb-1 flex items-center gap-1 text-[12px] font-bold text-gray-400"><BookOpen size={12} /> 證人：</p>
                                <div className="flex flex-wrap gap-1.5">
                                  {s.witnesses.map((w: string) => <span key={w} className="rounded border border-gray-100 bg-gray-50 px-2 py-0.5 text-[12px] font-black text-gray-600">{w}</span>)}
                                </div>
                              </div>
                            )}
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
              <h2 className="text-2xl font-black text-orange-900 md:text-3xl" style={serif}>一審宣判預告</h2>
              <p className="inline-block rounded-2xl bg-white/60 px-6 py-2 text-[18px] font-bold leading-relaxed text-orange-800/80 md:text-[20px]">
                台北地院已訂於
                <span className="mx-1 text-orange-600 underline decoration-orange-300 underline-offset-4">2026 年 4 月 16 日 下午</span>
                正式宣判一審結果
              </p>
            </div>
          </div>
        </FadeIn>
      </section>
    </div>
  );
}
