'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, useScroll } from 'framer-motion';
import { PenTool, Gavel, Clock, ArrowRight, ArrowLeft, Filter, BookOpen } from 'lucide-react';
import { FadeIn, Banner } from '@/components/ui-shared';

const serif = { fontFamily: "'Noto Serif TC', serif" };

interface SessionData {
    id: string; sessionId: string; title: string; date: string;
    category: string; summary: string; hotTopic: boolean; participantsCount: number;
}

export default function SessionsPage() {
    const [sessions, setSessions] = useState<SessionData[]>([]);
    const [loading, setLoading] = useState(true);
    const { scrollYProgress } = useScroll();

    useEffect(() => {
        fetch('/api/sessions').then(r => r.json()).then(d => {
            if (d.ok) setSessions(d.data);
        }).catch(() => { }).finally(() => setLoading(false));
    }, []);

    /* Fallback demo data if Notion has no published sessions yet */
    const displaySessions: SessionData[] = sessions.length > 0 ? sessions : [
        { id: '1', sessionId: 'session-6', title: '檢察官論告與辯護律師簡報與陳述還原', date: '2026-02-26', category: '兒少', summary: '114年度訴字第51號 過失致死等案（一審審理庭第六場次）', hotTopic: true, participantsCount: 5 },
        { id: '2', sessionId: 'session-5', title: '合議庭詰問社工督導——知情不報的灰色地帶', date: '2026-01-29', category: '兒少', summary: '一審審理庭第五場次', hotTopic: false, participantsCount: 4 },
    ];

    return (
        <div className="min-h-screen" style={{ backgroundColor: '#FBF7F0', color: '#2D2A26' }}>
            <motion.div className="fixed top-0 left-0 right-0 h-[3px] z-[100] origin-left"
                style={{ scaleX: scrollYProgress, background: 'linear-gradient(90deg, #7B8C4E, #B8860B, #C67B5C)' }} />

            {/* Header */}
            <div className="bg-gradient-to-b from-[#F5EFE4] to-[#FBF7F0] border-b border-[#E8E0D4]">
                <div className="max-w-5xl mx-auto px-6 py-8">
                    <Link href="/" className="text-[#7B8C4E] text-[16px] font-bold flex items-center gap-1 mb-4 hover:underline">
                        <ArrowLeft size={16} /> 返回首頁
                    </Link>
                    <h1 className="text-[42px] md:text-[56px] font-black" style={serif}>開庭還原筆記</h1>
                    <p className="text-[20px] text-[#6B6358] font-medium mt-2">114年度訴字第51號 過失致死等案 — 陳姓社工於一審期間共計開庭 10 次</p>
                </div>
            </div>

            {/* 開庭時間線 */}
            <Banner title="場次列表" subtitle="Court Sessions Timeline" bg="bg-[#E3EED3]" text="text-[#3D5220]" />

            <section className="max-w-5xl mx-auto px-6 py-8">
                {/* 準備程序庭 */}
                <FadeIn>
                    <div className="mb-8">
                        <h3 className="text-[24px] font-black mb-4 flex items-center gap-2" style={serif}>
                            <span className="w-3 h-3 rounded-full bg-gray-400 inline-block" /> 2024 年至 2025 年：準備程序庭（共 4 次）
                        </h3>
                        <div className="grid gap-3 pl-5 border-l-2 border-gray-200">
                            {[
                                { date: '7 月 17 日', desc: '首度開庭，陳姓社工不認罪。' },
                                { date: '8 月 27 日', desc: '第二次準備程序庭。' },
                                { date: '10 月 15 日', desc: '第三次準備程序庭。' },
                                { date: '12 月 4 日', desc: '第四次準備程序庭。' },
                            ].map((s, i) => (
                                <div key={i} className="bg-white p-4 rounded-xl border border-[#E8E0D4] text-[16px]">
                                    <span className="font-black text-[#8A8078]">{s.date}</span> — <span className="text-[#5A5347] font-medium">{s.desc}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </FadeIn>

                {/* 審理程序庭 */}
                <FadeIn delay={0.1}>
                    <div className="mb-8">
                        <h3 className="text-[24px] font-black mb-4 flex items-center gap-2" style={serif}>
                            <span className="w-3 h-3 rounded-full bg-[#7B8C4E] inline-block" /> 2025 年末至 2026 年：審理程序庭（共 5 次）
                        </h3>
                        <div className="grid gap-3 pl-5 border-l-2 border-[#7B8C4E]">
                            {displaySessions.map((s, i) => (
                                <FadeIn key={s.id} delay={i * 0.05}>
                                    <Link href={`/sessions/${s.sessionId}`}>
                                        <motion.div whileHover={{ y: -3, borderColor: '#7B8C4E', boxShadow: '0 8px 25px rgba(123,140,78,0.15)' }}
                                            className="bg-white p-6 rounded-2xl border-2 border-[#E8E0D4] cursor-pointer transition-all group">
                                            <div className="flex items-center gap-3 mb-2">
                                                {s.hotTopic && (
                                                    <motion.span animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}
                                                        className="bg-[#C67B5C] text-white text-[13px] font-black px-3 py-1 rounded-lg shadow-sm">最新還原</motion.span>
                                                )}
                                                <span className="text-[#7B8C4E] text-[15px] font-bold flex items-center gap-1"><Clock size={15} />{s.date}</span>
                                                <span className="text-[12px] font-black text-white bg-[#7B8C4E] px-2 py-0.5 rounded">{s.category}</span>
                                            </div>
                                            <h4 className="text-[24px] font-black group-hover:text-[#7B8C4E] transition-colors" style={serif}>{s.title}</h4>
                                            <p className="text-[16px] font-bold text-[#8A8078] mt-2">{s.summary}</p>
                                            <span className="text-[#7B8C4E] text-[14px] font-bold mt-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                進入場次全文 <ArrowRight size={14} />
                                            </span>
                                        </motion.div>
                                    </Link>
                                </FadeIn>
                            ))}
                        </div>
                    </div>
                </FadeIn>

                {/* 宣判資訊 */}
                <FadeIn>
                    <div className="bg-[#FDE8D8] p-6 rounded-2xl border border-[#E8D5B8] text-center">
                        <p className="text-[20px] font-black text-[#8B4D35]" style={serif}>台北地院已訂於 2026 年 4 月 16 日 下午正式宣判一審結果</p>
                    </div>
                </FadeIn>
            </section>
        </div>
    );
}
