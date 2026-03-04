'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, useScroll } from 'framer-motion';
import { PenTool, Gavel, Clock, ArrowRight, ArrowLeft, Filter, BookOpen, Flame } from 'lucide-react';
import { FadeIn, Banner } from '@/components/ui-shared';

const serif = { fontFamily: "'Noto Serif TC', serif" };

interface SessionData {
    id: string; sessionId: string; title: string; date: string;
    category: string; summary: string; hotTopic: boolean; participantsCount: number;
}

export default function SessionsPage() {
    const [publishedSessions, setPublishedSessions] = useState<SessionData[]>([]);
    const [loading, setLoading] = useState(true);
    const { scrollYProgress } = useScroll();

    useEffect(() => {
        fetch('/api/sessions').then(r => r.json()).then(d => {
            if (d.ok) {
                // Deduplicate sessions by sessionId to prevent duplicate cards
                const uniqueSessions = Array.from(new Map(d.data.map((item: any) => [item.sessionId, item])).values());
                setPublishedSessions(uniqueSessions as SessionData[]);
            }
        }).catch(() => { }).finally(() => setLoading(false));
    }, []);

    const trialSessions = [
        {
            title: '第1次開庭', date: '2025-11-27', displayDate: '11 月 27 日',
            topic: '收出養政策與地方政府交接責任', desc: '釐清中央政策下收出養的標準流程，以及新北市社會局與兒盟之間的個案交接資訊是否對等',
            witnesses: ['徐佩華 (衛福部社家署)', '施盈如 (新北社會局)', '丁雁琪 (天主教福利會)']
        },
        {
            title: '第2次開庭', date: '2025-12-11', displayDate: '12 月 11 日',
            topic: '醫療端初步判定與兒盟核心督導責任', desc: '急診醫師針對剴剴到院時的第一線觀察；同時詰問陳尚潔的主管（江怡韻），釐清其對陳提交的訪視紀錄是否有實質審核與質疑',
            witnesses: ['黃聖心 (萬芳醫院)', '李芳玲 (兒盟)', '江怡韻 (兒盟督導)']
        },
        {
            title: '第3次開庭', date: '2025-12-18', displayDate: '12 月 18 日',
            topic: '兒盟高層管理與內部通報系統', desc: '透過高層與中階主管的證詞，釐清兒盟內部是否存在「為了維持媒合率而忽略風險」或「系統性隱匿」的組織文化',
            witnesses: ['白麗芳 (前兒盟執行長)', '葉亭希 (兒盟組長)', '葉詩宇 (兒盟督導)']
        },
        {
            title: '第4次開庭', date: '2026-01-22', displayDate: '1 月 22 日',
            topic: '第一線專業觀察與居托監督缺失', desc: '針對剴剴生前異常脫牙的醫療診斷，以及負責監督保母（劉彩萱）的文山居托中心，為何也未能察覺保母異樣',
            witnesses: ['蔡函妤 (牙醫師)', '林心慈 (文山居托)', '黃鈴芳 (文山居托督導)']
        },
        {
            title: '第5次開庭', date: '2026-01-29', displayDate: '01 月 29 日',
            topic: '主管機關行政監督責任', desc: '釐清台北市社會局對合格保母的考核與居家托育服務中心的管理機制是否存在漏洞',
            witnesses: ['粘羽涵 (北市社會局)']
        },
        {
            title: '加開庭次', date: '2026-02-23', displayDate: '02 月 23 日',
            topic: '程序進行與準備', desc: '細節待確認或補充'
        },
        {
            title: '第十次開庭：最終言詞辯論 (第6次審理程序開庭)', date: '2026-02-26', displayDate: '02 月 26 日', highlight: true,
            topic: '檢察官論告與辯護律師簡報與陳述還原', desc: '全案辯論終結，檢方依過失致死與偽造文書罪論告，辯護律師進行法理辯護。'
        }
    ];

    return (
        <div className="min-h-screen bg-[#FAFAFA] text-gray-800 font-sans selection:bg-[#6B8E23]/20 pb-20">
            <motion.div className="fixed top-0 left-0 right-0 h-[3px] z-[100] origin-left"
                style={{ scaleX: scrollYProgress, background: 'linear-gradient(90deg, #6B8E23, #B8860B, #C67B5C)' }} />

            {/* Header */}
            <div className="bg-white border-b border-gray-100 shadow-sm relative overflow-hidden">
                <div className="absolute right-0 top-0 w-1/3 h-full bg-gradient-to-l from-[#F9FBE7] to-transparent pointer-events-none" />
                <div className="max-w-5xl mx-auto px-6 py-12 md:py-16 relative z-10">
                    <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-[#6B8E23] mb-6 transition-colors bg-gray-50 px-4 py-2 rounded-full text-sm font-bold shadow-sm border border-gray-100">
                        <ArrowLeft size={16} /> 返回首頁
                    </Link>
                    <h1 className="text-3xl md:text-5xl font-black text-gray-900 leading-tight mb-4" style={serif}>
                        114年度訴字第51號過失致死等案<br className="hidden md:block" />
                        <span className="text-[#6B8E23]">俗稱剴剴社工案</span>
                    </h1>
                    <p className="text-lg text-gray-600 font-medium leading-relaxed max-w-3xl">
                        依據目前（截至 2026 年 2 月底）的審理進度，兒福聯盟陳姓社工在「剴剴案」中被控過失致死與偽造文書罪，台北地院已完成審理，累計開庭次數與具體日期整理如下：<br />
                        <span className="font-bold text-gray-900 bg-[#F9FBE7] px-2 py-0.5 mt-2 inline-block">陳姓社工於一審期間共計開庭 10 次。</span>
                    </p>
                </div>
            </div>

            <section className="max-w-4xl mx-auto px-6 py-12 space-y-12">
                {/* 📌 已發布重點場次 */}
                <FadeIn>
                    <div className="mb-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center border border-orange-100">
                                <Flame size={24} />
                            </div>
                            <div>
                                <h3 className="text-2xl md:text-3xl font-black text-gray-900" style={serif}>
                                    目前已發布的完整筆記
                                </h3>
                                <p className="text-gray-500 font-medium mt-1">您可以直接點擊進入閱讀整理好的現場還原與論述：</p>
                            </div>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                            {publishedSessions.length === 0 && (
                                <Link href="/sessions/s-114-1-6" className="block">
                                    <motion.div whileHover={{ y: -2, scale: 1.01 }} className="bg-white p-6 rounded-[2rem] border-2 border-orange-200 hover:border-orange-400 shadow-sm hover:shadow-xl transition-all h-full relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-bl-full -mr-10 -mt-10 group-hover:scale-110 transition-transform"></div>
                                        <div className="relative z-10">
                                            <div className="flex flex-wrap items-center gap-2 mb-3">
                                                <span className="bg-orange-500 text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">🔥 最新發布</span>
                                                <span className="text-orange-700 font-black bg-orange-100 px-3 py-1 rounded-full text-sm">2 月 26 日</span>
                                            </div>
                                            <h4 className="text-[20px] font-black text-gray-900 mb-2 leading-tight" style={serif}>第十次開庭：最終言詞辯論</h4>
                                            <p className="text-gray-600 font-bold text-sm">檢察官論告與辯護律師簡報與陳述還原</p>
                                        </div>
                                    </motion.div>
                                </Link>
                            )}
                            {publishedSessions.map(ps => (
                                <Link key={ps.id} href={`/sessions/${ps.sessionId}`} className="block">
                                    <motion.div whileHover={{ y: -2, scale: 1.01 }} className="bg-white p-6 rounded-[2rem] border-2 border-orange-200 hover:border-orange-400 shadow-sm hover:shadow-xl transition-all h-full relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-bl-full -mr-10 -mt-10 group-hover:scale-110 transition-transform"></div>
                                        <div className="relative z-10">
                                            <div className="flex flex-wrap items-center gap-2 mb-3">
                                                <span className="bg-orange-500 text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">最新發布</span>
                                                <span className="text-orange-700 font-black bg-orange-100 px-3 py-1 rounded-full text-sm">{ps.date}</span>
                                            </div>
                                            <h4 className="text-[20px] font-black text-gray-900 mb-2 leading-tight" style={serif}>{ps.title}</h4>
                                            <p className="text-gray-600 font-bold text-sm line-clamp-2">{ps.summary || '包含證人詰問與重要言詞辯論實況'}</p>
                                        </div>
                                    </motion.div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </FadeIn>

                {/* 準備程序庭 */}
                <FadeIn>
                    <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-gray-50 text-gray-400 rounded-2xl flex items-center justify-center border border-gray-200">
                                <BookOpen size={24} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-gray-900" style={serif}>
                                    2024 年至 2025 年：準備程序庭（共 4 次）
                                </h3>
                                <p className="text-gray-500 font-medium mt-1">此階段主要進行證據能力確認與不認罪答辯：</p>
                            </div>
                        </div>
                        <div className="grid gap-3 pl-[1.65rem] border-l-2 border-gray-100">
                            {[
                                { date: '07 月 17 日', desc: '首度開庭，陳姓社工不認罪。' },
                                { date: '08 月 27 日', desc: '第二次準備程序庭。' },
                                { date: '10 月 15 日', desc: '第三次準備程序庭。' },
                                { date: '12 月 04 日', desc: '第四次準備程序庭。' },
                            ].map((s, i) => (
                                <div key={i} className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-[16px] relative flex items-start -ml-[1.6rem] gap-4">
                                    <div className="w-3 h-3 bg-gray-300 rounded-full mt-1.5 border-2 border-white shrink-0" />
                                    <div>
                                        <span className="font-black text-gray-700 bg-white px-2 py-1 rounded shadow-sm mr-2">{s.date}</span>
                                        <span className="text-gray-600 font-medium">{s.desc}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </FadeIn>

                {/* 審理程序庭 */}
                <FadeIn delay={0.1}>
                    <div>
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-12 h-12 bg-[#F9FBE7] text-[#6B8E23] rounded-2xl flex items-center justify-center border border-[#E9EDDA]">
                                <Gavel size={24} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-gray-900" style={serif}>
                                    2025 年末至 2026 年：審理程序庭（共 6 次）
                                </h3>
                                <p className="text-gray-500 font-medium mt-1">此階段進入實質審理，包括證人詰問與言詞辯論：</p>
                            </div>
                        </div>

                        <div className="space-y-4 relative before:absolute before:inset-y-0 before:left-6 before:w-0.5 before:bg-[#E9EDDA]">
                            {trialSessions.map((s, i) => {
                                // 判斷這個 session 在 Notion 中是否有已發布的資料（暫以日期作比對，或假設最後一場就是 s-114-1-6）
                                const matchingPublished = publishedSessions.find(ps => ps.date === s.date) ||
                                    (s.date === '2026-02-26' ? { sessionId: 's-114-1-6', summary: '審理庭第六場次 論告與最終辯論' } : null);
                                const isPublished = !!matchingPublished;

                                return (
                                    <FadeIn key={i} delay={i * 0.05}>
                                        <div className="relative flex items-center gap-6 group">
                                            <div className={`w-3 h-3 rounded-full border-2 border-white z-10 shrink-0 ${isPublished ? 'bg-[#6B8E23] ring-4 ring-[#F9FBE7]' : 'bg-gray-300'}`} />

                                            {isPublished ? (
                                                <Link href={`/sessions/${matchingPublished.sessionId}`} className="flex-1 block">
                                                    <motion.div whileHover={{ y: -2, scale: 1.01 }} className="bg-white p-6 rounded-[2rem] border-2 border-[#E9EDDA] hover:border-[#6B8E23] shadow-sm hover:shadow-xl transition-all h-full">
                                                        <div className="flex flex-wrap items-center gap-3 mb-3">
                                                            {s.highlight && <span className="bg-orange-100 text-orange-700 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider animate-pulse">最新進展</span>}
                                                            <span className="text-[#6B8E23] font-black bg-[#F9FBE7] px-3 py-1 rounded-full text-sm">{s.displayDate}</span>
                                                            <span className="text-gray-500 font-bold text-sm ml-auto">點擊進入完整筆記</span>
                                                        </div>
                                                        <h4 className="text-[20px] md:text-[22px] font-black text-gray-900 group-hover:text-[#6B8E23] transition-colors" style={serif}>{s.title}</h4>
                                                        {s.topic && <p className="text-[#6B8E23] font-bold text-[16px] mt-1">{s.topic}</p>}
                                                        <p className="text-gray-600 font-medium mt-2 leading-relaxed">{matchingPublished.summary || s.desc}</p>
                                                        {s.witnesses && (
                                                            <div className="mt-4 bg-gray-50 p-3 rounded-xl border border-gray-100">
                                                                <p className="text-[13px] font-bold text-gray-500 mb-1.5 flex items-center gap-1"><BookOpen size={14} /> 傳喚證人：</p>
                                                                <div className="flex flex-wrap gap-2">
                                                                    {s.witnesses.map((w: string) => <span key={w} className="bg-white px-2 py-1 rounded text-[13px] font-black text-gray-700 shadow-sm border border-gray-100">{w}</span>)}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </motion.div>
                                                </Link>
                                            ) : (
                                                <div className="flex-1 bg-gray-50/50 p-6 rounded-[2rem] border border-gray-100 opacity-80 flex flex-col md:flex-row md:items-start justify-between gap-6 transition-all hover:opacity-100">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <span className="text-gray-500 font-black bg-gray-200 px-3 py-1 rounded-full text-sm">{s.displayDate}</span>
                                                            <span className="inline-flex items-center gap-1 bg-gray-200 text-gray-500 px-2 py-0.5 rounded-md text-xs font-bold">
                                                                <PenTool size={12} /> 筆記整理中
                                                            </span>
                                                        </div>
                                                        <h4 className="text-[18px] md:text-[20px] font-black text-gray-700" style={serif}>{s.title}</h4>
                                                        {s.topic && <p className="text-[#6B8E23] font-bold text-[15px] mt-1 line-clamp-1">{s.topic}</p>}
                                                        {s.desc && <p className="text-gray-500 font-medium mt-1.5 text-[15px] leading-relaxed line-clamp-2">{s.desc}</p>}
                                                        {s.witnesses && (
                                                            <div className="mt-3 bg-white p-3 rounded-xl border border-gray-100">
                                                                <p className="text-[12px] font-bold text-gray-400 mb-1 flex items-center gap-1"><BookOpen size={12} /> 證人：</p>
                                                                <div className="flex flex-wrap gap-1.5">
                                                                    {s.witnesses.map((w: string) => <span key={w} className="bg-gray-50 px-2 py-0.5 rounded text-[12px] font-black text-gray-600 border border-gray-100">{w}</span>)}
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

                {/* 宣判資訊 */}
                <FadeIn delay={0.2}>
                    <div className="mt-12 bg-gradient-to-br from-orange-50 to-[#FFF7ED] p-8 md:p-10 rounded-[2.5rem] border border-orange-100 text-center shadow-inner relative overflow-hidden">
                        <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-orange-200/40 rounded-full blur-3xl mix-blend-multiply" />
                        <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-40 h-40 bg-[#F9FBE7]/80 rounded-full blur-3xl mix-blend-multiply" />
                        <div className="relative z-10 space-y-4">
                            <Gavel size={48} className="mx-auto text-orange-400 mb-2 opactiy-80" />
                            <h2 className="text-2xl md:text-3xl font-black text-orange-900" style={serif}>一審宣判預告</h2>
                            <p className="text-[18px] md:text-[20px] font-bold text-orange-800/80 leading-relaxed bg-white/60 inline-block px-6 py-2 rounded-2xl">
                                台北地院已訂於 <span className="text-orange-600 underline decoration-orange-300 underline-offset-4">2026 年 4 月 16 日 下午</span> 正式宣判一審結果
                            </p>
                        </div>
                    </div>
                </FadeIn>
            </section>
        </div>
    );
}
