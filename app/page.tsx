'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, useScroll, AnimatePresence } from 'framer-motion';
import {
    PenTool, BookOpen, Heart, Eye, MessageSquare, Flame,
    Gavel, ArrowRight, Menu, X, ChevronLeft, ChevronRight,
    HeartHandshake, Send, MessageCircle, FileText
} from 'lucide-react';
import { FadeIn, Counter, Banner, WarmGradientBg } from '@/components/ui-shared';
import SessionsOverviewSection from '@/components/SessionsOverviewSection';
import SourceAcknowledgementShelf from '@/components/SourceAcknowledgementShelf';
import { Skeleton } from '@/components/ui/skeleton';
import { BETA_NOTICE, COPYRIGHT_NOTICE, FOOTER_NAV_ITEMS, PUBLIC_NAV_ITEMS, SITE_NAME, SITE_TAGLINE, TEAM_BLURB } from '@/lib/public-site';

const serif = { fontFamily: "'Noto Serif TC', serif" };

type SiteStats = { totalSessions: number; restoredSessions: number; publishedArticles: number };

function normalizeArrayPayload<T>(payload: unknown): T[] {
    if (Array.isArray(payload)) return payload as T[];
    if (payload && typeof payload === 'object' && 'data' in payload) {
        const nested = (payload as { data?: unknown }).data;
        return Array.isArray(nested) ? (nested as T[]) : [];
    }
    return [];
}

function normalizeStatsPayload(payload: unknown, sessionsFallback: any[]): SiteStats {
    const safeObject = payload && typeof payload === 'object' ? payload as Partial<SiteStats> : {};
    const totalSessions = typeof safeObject.totalSessions === 'number' ? safeObject.totalSessions : sessionsFallback.length;
    const restoredSessions = typeof safeObject.restoredSessions === 'number' ? safeObject.restoredSessions : sessionsFallback.length;
    const publishedArticles = typeof safeObject.publishedArticles === 'number' ? safeObject.publishedArticles : 0;
    return { totalSessions, restoredSessions, publishedArticles };
}



const homepageGuideWorkflow = [
    {
        title: '前期 — 本團隊工作',
        items: ['實際參與所有場次形成筆記', '蒐集觀庭多元筆記校對補缺', '蒐集案整體相關資料'],
        border: 'border-l-blue-400',
        accent: 'text-blue-400',
    },
    {
        title: '呈現',
        items: ['觀庭現場還原筆記', '即時論壇與評論投稿機制', '形成論述探討、交流'],
        border: 'border-l-[#7B8C4E]',
        accent: 'text-[#7B8C4E]',
    },
    {
        title: '最後',
        items: ['共構本事件之還原計畫和共識', '透過集體智慧建立新的準則與論述'],
        border: 'border-l-[#C67B5C]',
        accent: 'text-[#C67B5C]',
    },
];


export default function Home() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const { scrollYProgress } = useScroll();
    const [heroSessionIndex, setHeroSessionIndex] = useState(0);

    const [sessions, setSessions] = useState<any[]>([]);
    const [stats, setStats] = useState<SiteStats>({ totalSessions: 0, restoredSessions: 0, publishedArticles: 0 });
    const [hotNotes, setHotNotes] = useState<any[]>([]);
    const [hotComments, setHotComments] = useState<any[]>([]);
    const [hotArticles, setHotArticles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const h = () => setScrolled(window.scrollY > 30);
        window.addEventListener('scroll', h); return () => window.removeEventListener('scroll', h);
    }, []);

    useEffect(() => {
        let cancelled = false;

        const fetchJson = async (url: string) => {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Failed to fetch ${url}: ${response.status}`);
            }
            return response.json();
        };

        async function loadHomepageData() {
            const [sessionsResult, statsResult, notesResult, commentsResult, articlesResult] = await Promise.allSettled([
                fetchJson('/api/sessions'),
                fetchJson('/api/stats'),
                fetchJson('/api/trending?type=notes'),
                fetchJson('/api/trending?type=comments'),
                fetchJson('/api/trending?type=articles'),
            ]);

            if (cancelled) return;

            const resolvedSessions = sessionsResult.status === 'fulfilled' ? normalizeArrayPayload<any>(sessionsResult.value) : [];
            const resolvedStats = statsResult.status === 'fulfilled'
                ? normalizeStatsPayload(statsResult.value, resolvedSessions)
                : normalizeStatsPayload(null, resolvedSessions);
            const resolvedNotes = notesResult.status === 'fulfilled' ? normalizeArrayPayload<any>(notesResult.value) : [];
            const resolvedComments = commentsResult.status === 'fulfilled' ? normalizeArrayPayload<any>(commentsResult.value) : [];
            const resolvedArticles = articlesResult.status === 'fulfilled' ? normalizeArrayPayload<any>(articlesResult.value) : [];

            if (sessionsResult.status === 'rejected') console.error('Error fetching sessions:', sessionsResult.reason);
            if (statsResult.status === 'rejected') console.error('Error fetching stats:', statsResult.reason);
            if (notesResult.status === 'rejected') console.error('Error fetching trending notes:', notesResult.reason);
            if (commentsResult.status === 'rejected') console.error('Error fetching trending comments:', commentsResult.reason);
            if (articlesResult.status === 'rejected') console.error('Error fetching trending articles:', articlesResult.reason);

            setSessions(resolvedSessions);
            setStats(resolvedStats);
            setHotNotes(resolvedNotes);
            setHotComments(resolvedComments);
            setHotArticles(resolvedArticles);
            setLoading(false);
        }

        loadHomepageData();

        return () => {
            cancelled = true;
        };
    }, []);

    useEffect(() => {
        if (sessions.length === 0) return;
        setHeroSessionIndex((current) => Math.min(current, sessions.length - 1));
    }, [sessions.length]);

    useEffect(() => {
        if (sessions.length <= 1) return;

        const timer = window.setInterval(() => {
            setHeroSessionIndex((current) => (current + 1) % sessions.length);
        }, 6500);

        return () => window.clearInterval(timer);
    }, [sessions.length]);

    const navItems = PUBLIC_NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        return { ...item, icon: <Icon className={item.homeIconClass} /> };
    });
    const activeHeroSession = sessions[heroSessionIndex];

    function goToPreviousHeroSession() {
        if (sessions.length <= 1) return;
        setHeroSessionIndex((current) => (current === 0 ? sessions.length - 1 : current - 1));
    }

    function goToNextHeroSession() {
        if (sessions.length <= 1) return;
        setHeroSessionIndex((current) => (current + 1) % sessions.length);
    }

    /* ── Demo data (will be replaced by Notion CMS when entries exist) ── */
    // const hotNotes = [
    //     { rank: 1, title: '檢察官論告——為何聚焦「未依規定訪視」？', likes: 387, views: 2841, session: '第六場次' },
    //     { rank: 2, title: '辯護律師陳述——制度性缺失不應由個人承擔', likes: 342, views: 2103, session: '第六場次' },
    //     { rank: 3, title: '合議庭詰問社工督導——知情不報的灰色地帶', likes: 298, views: 1854, session: '第五場次' },
    // ];
    // const hotComments = [
    //     { author: '匿名社工A', content: '身為兒保社工五年，這段論告讓我心涼——我們每天做的就是在資源不足下做「最不壞的選擇」...', likes: 156, role: '兒少保護' },
    //     { author: '匿名社工B', content: '制度面的問題不解決，換誰來做都會出事。辯護律師講到點上了。', likes: 134, role: '安置機構' },
    //     { author: '匿名心理師', content: '從心理師角度看，這段詰問反映了跨專業溝通的斷裂——社工與心理師之間的語言不同...', likes: 112, role: '諮商心理' },
    // ];
    // const hotArticles = [
    //     { title: '從剴剴案看台灣兒少保護體系的結構性困境', author: '跨域共構小組', likes: 231, tag: '專題分析' },
    //     { title: '社工訪視頻率與風險評估——實務與法規的落差', author: '匿名資深社工', likes: 189, tag: '實務論述' },
    //     { title: '收出養媒合制度：北中南差異有多大？', author: '匿名社工C', likes: 167, tag: '經驗分享' },
    // ];

    return (
        <div className="min-h-screen overflow-x-hidden" style={{ backgroundColor: '#FBF7F0', color: '#2D2A26', fontSize: '18px' }}>
            {/* 滾動進度條 */}
            <motion.div className="fixed top-0 left-0 right-0 h-[3px] z-[100] origin-left"
                style={{ scaleX: scrollYProgress, background: 'linear-gradient(90deg, #7B8C4E, #B8860B, #C67B5C)' }} />

            {/* Beta Banner */}
            <div className="relative z-50 bg-gradient-to-r from-[#5a6e38] via-[#7B8C4E] to-[#8a9d58] text-white text-[15px] font-bold text-center py-2 tracking-wider shadow-sm">
                <motion.span animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 2, repeat: Infinity }} className="inline-block mr-2 text-yellow-200">●</motion.span>
                {BETA_NOTICE}
            </div>

            {/* Navbar */}
            <motion.nav initial={{ y: -80 }} animate={{ y: 0 }} transition={{ duration: 0.5, ease: 'easeOut' }}
                className={`sticky top-0 z-40 transition-all duration-300 border-b ${scrolled ? 'bg-[#FBF7F0]/95 backdrop-blur-xl shadow-md border-[#E8E0D4]' : 'bg-[#FBF7F0] border-transparent'}`}>
                <div className="max-w-7xl mx-auto px-6 py-2 flex justify-between items-center">
                    <Link href="/" className="flex items-center gap-3">
                        <motion.div whileHover={{ rotate: 15, scale: 1.1 }} transition={{ type: 'spring', stiffness: 300 }}
                            className="bg-gradient-to-br from-[#7B8C4E] to-[#5a6e38] p-2.5 rounded-xl text-white shadow-md"><PenTool size={22} /></motion.div>
                        <div>
                            <h1 className="text-[20px] font-black leading-tight" style={serif}>{SITE_NAME}</h1>
                            <p className="text-[11px] text-[#A09888] font-bold tracking-[0.15em]">{SITE_TAGLINE}</p>
                        </div>
                    </Link>
                    <div className="hidden lg:flex items-center gap-0">
                        {navItems.map(item => (
                            <Link key={item.name} href={item.href}
                                className="relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-[15px] font-bold text-[#5A5347] hover:text-[#7B8C4E] hover:bg-[#7B8C4E]/8 transition-all group whitespace-nowrap">
                                {item.icon}<span>{item.name}</span>
                                <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 h-[2px] bg-[#7B8C4E] rounded-full w-0 group-hover:w-6 transition-all duration-300" />
                            </Link>
                        ))}
                    </div>
                    <button className="lg:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={28} /> : <Menu size={28} />}</button>
                </div>
                <AnimatePresence>
                    {menuOpen && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                            className="lg:hidden bg-[#FBF7F0] border-t border-[#E8E0D4] overflow-hidden">
                            <div className="p-4 space-y-1">
                                {navItems.map(item => (
                                    <Link key={item.name} href={item.href} onClick={() => setMenuOpen(false)}
                                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-[20px] font-bold text-[#5A5347] hover:bg-[#7B8C4E]/10">{item.icon}{item.name}</Link>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.nav>

            {/* ═══ Hero ═══ */}
            <section id="mission" className="relative overflow-hidden border-b border-[#E8E0D4] bg-gradient-to-b from-[#F5EFE4] to-[#FBF7F0] px-6 pt-10 pb-8">
                <WarmGradientBg />
                <div className="relative z-10 mx-auto grid max-w-7xl gap-7 xl:grid-cols-[1.08fr_0.92fr] xl:items-start">
                    <div className="min-w-0">
                        <FadeIn>
                            <motion.div whileHover={{ scale: 1.05 }} className="inline-flex items-center gap-2 rounded-full border border-[#7B8C4E]/20 bg-white/60 px-5 py-2 text-[15px] font-black tracking-wider text-[#7B8C4E] shadow-sm cursor-default backdrop-blur-sm">
                                <motion.span animate={{ rotate: [0, -10, 10, 0] }} transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}><Gavel size={16} /></motion.span>
                                專業人員與大眾的事件論述共構
                            </motion.div>
                        </FadeIn>
                        <FadeIn delay={0.1}>
                            <h2 className="mt-5 text-[48px] font-black leading-[1.1] tracking-tight md:text-[64px] lg:text-[72px]" style={serif}>
                                <span className="block">觀庭還原筆記</span>
                                <span className="relative inline-block text-[#7B8C4E]">共構平台
                                    <motion.svg className="absolute -bottom-3 left-0 w-full" height="14" viewBox="0 0 200 14" preserveAspectRatio="none"
                                        initial={{ pathLength: 0, opacity: 0 }} whileInView={{ pathLength: 1, opacity: 1 }} transition={{ duration: 1.8, delay: 0.6, ease: 'easeOut' }}>
                                        <motion.path d="M4 10 Q 50 2 100 8 Q 150 14 196 6" stroke="#C5D9A8" strokeWidth="6" strokeLinecap="round" fill="transparent"
                                            initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} transition={{ duration: 1.8, delay: 0.6 }} />
                                    </motion.svg>
                                </span>
                            </h2>
                        </FadeIn>
                        <FadeIn delay={0.2}>
                            <div className="mt-5 max-w-3xl text-[20px] md:text-[22px] text-[#6B6358] font-medium leading-[1.9]">
                                <p>讓事情變得具體。讓資訊透明。<br className="hidden md:block" />讓每個人有機會自己去閱讀、辨認、探索——找到屬於你的答案。</p>
                            </div>
                        </FadeIn>
                        <FadeIn delay={0.3}>
                            <div className="mt-6 flex flex-wrap items-center gap-4">
                                <Link href="/sessions">
                                    <motion.button whileHover={{ scale: 1.05, boxShadow: '0 16px 40px rgba(123,140,78,0.3)' }} whileTap={{ scale: 0.97 }}
                                        className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#7B8C4E] to-[#5a6e38] px-10 py-4 text-[22px] font-black text-white shadow-lg shadow-[#7B8C4E]/20 transition-all">
                                        <span className="relative z-10 flex items-center gap-3">進入還原筆記 <ArrowRight size={22} className="group-hover:translate-x-2 transition-transform" /></span>
                                    </motion.button>
                                </Link>
                                <Link href="/about">
                                    <motion.span className="inline-block cursor-pointer rounded-2xl border-2 border-[#D4CCC0] px-8 py-4 text-[20px] font-bold text-[#6B6358] transition-all hover:border-[#7B8C4E] hover:text-[#7B8C4E]">了解這個計畫 →</motion.span>
                                </Link>
                            </div>
                        </FadeIn>
                        <FadeIn delay={0.4}>
                            <div className="mt-6 flex gap-10 text-center">
                                {[
                                    { n: stats.totalSessions, l: '場開庭紀錄' },
                                    { n: stats.restoredSessions, l: '場已還原' },
                                    { n: stats.publishedArticles, l: '篇觀點文章', s: '+' }
                                ].map((s, i) => (
                                    <div key={i}>
                                        <div className="flex min-h-[54px] items-center justify-center">
                                            {loading ? (
                                                <Skeleton className="h-10 w-20 rounded-xl bg-[#E4EBCF]" />
                                            ) : (
                                                <p className="text-[36px] font-black text-[#7B8C4E]" style={serif}>
                                                    <Counter target={s.n} suffix={'s' in s ? s.s as string : undefined} />
                                                </p>
                                            )}
                                        </div>
                                        <p className="text-[14px] font-bold text-[#A09888]">{s.l}</p>
                                    </div>
                                ))}
                            </div>
                        </FadeIn>
                    </div>

                    <FadeIn delay={0.18}>
                        <motion.div whileHover={{ y: -4, boxShadow: '0 18px 42px rgba(123,140,78,0.12)' }} className="relative self-start overflow-hidden rounded-[2rem] border border-[#E8E0D4] bg-white/90 shadow-md">
                            <motion.div
                                aria-hidden="true"
                                animate={{ opacity: [0.18, 0.32, 0.18], scale: [1, 1.05, 1] }}
                                transition={{ duration: 5.6, repeat: Infinity, ease: 'easeInOut' }}
                                className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[#DCE7AE] blur-3xl"
                            />
                            <div className="relative z-10 px-5 py-4">
                                <div className="inline-flex items-center gap-2 rounded-full bg-[#FFF4E5] px-3.5 py-1.5 text-[12px] font-black tracking-[0.16em] text-[#C67B5C]">
                                    <Flame size={14} />
                                    完整筆記櫥窗
                                </div>
                                <h3 className="mt-3.5 text-[24px] font-black leading-[1.18] text-[#2D2A26]" style={serif}>
                                    目前已發布的完整筆記
                                    <br />
                                    與跨場次工作檯
                                </h3>
                                <p className="mt-2.5 text-[14px] font-medium leading-[1.85] text-[#6B6358]">
                                    以下是目前最新還原筆記，點入即可撰寫觀庭共構筆記喔！
                                </p>

                                <div className="mt-4 overflow-hidden rounded-[1.65rem] border border-[#E8E0D4] bg-gradient-to-br from-white via-[#FFFDF8] to-[#F7F3E8] p-4 shadow-[0_12px_32px_rgba(65,56,44,0.08)]">
                                    <div className="mb-3 flex items-center justify-between">
                                        <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#A4A098]">內容預覽</p>
                                        {sessions.length > 1 && (
                                            <div className="flex items-center gap-2">
                                                <button
                                                    type="button"
                                                    aria-label="查看上一筆首頁完整筆記"
                                                    onClick={goToPreviousHeroSession}
                                                    className="inline-flex h-8 w-8 items-center justify-center rounded-2xl border border-[#E8E0D4] bg-white text-[#7B8C4E] transition-colors hover:bg-[#F5FAEB]"
                                                >
                                                    <ChevronLeft size={15} />
                                                </button>
                                                <button
                                                    type="button"
                                                    aria-label="查看下一筆首頁完整筆記"
                                                    onClick={goToNextHeroSession}
                                                    className="inline-flex h-8 w-8 items-center justify-center rounded-2xl border border-[#E8E0D4] bg-white text-[#7B8C4E] transition-colors hover:bg-[#F5FAEB]"
                                                >
                                                    <ChevronRight size={15} />
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {loading ? (
                                        <div className="space-y-4">
                                            <Skeleton className="h-7 w-28 rounded-full bg-[#F4E7D9]" />
                                            <Skeleton className="h-8 w-full rounded-2xl bg-[#F6EEE3]" />
                                            <Skeleton className="h-8 w-5/6 rounded-2xl bg-[#F6EEE3]" />
                                            <Skeleton className="h-32 w-full rounded-[1.5rem] bg-[#F7F3E8]" />
                                        </div>
                                    ) : (
                                        <>
                                            <AnimatePresence mode="wait" initial={false}>
                                                <motion.div
                                                    key={activeHeroSession?.sessionId ?? 'fallback'}
                                                    initial={{ opacity: 0, x: 18 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    exit={{ opacity: 0, x: -18 }}
                                                    transition={{ duration: 0.24, ease: 'easeInOut' }}
                                                    className="rounded-[1.45rem] border border-[#F1DDC0] bg-[#FFF9F2] p-4"
                                                >
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <span className="rounded-full bg-[#C67B5C] px-3 py-1 text-xs font-black uppercase tracking-wider text-white shadow-sm">
                                                            單場次
                                                        </span>
                                                        <span className="rounded-full bg-orange-100 px-3 py-1 text-sm font-black text-orange-700">
                                                            {activeHeroSession?.date ?? '2026-02-26'}
                                                        </span>
                                                    </div>
                                                    <h4 className="mt-3 text-[22px] font-black leading-tight text-[#2D2A26]" style={serif}>
                                                        {activeHeroSession?.title ?? '第六場次：最終言詞辯論'}
                                                    </h4>
                                                    <p className="mt-2.5 text-[14px] font-medium leading-[1.85] text-[#6B6358]">
                                                        {activeHeroSession?.summary ?? '檢察官論告與辯護律師簡報陳述還原。'}
                                                    </p>
                                                    <Link
                                                        href={activeHeroSession ? `/sessions/${activeHeroSession.sessionId}` : '/sessions'}
                                                        className="mt-4 inline-flex items-center gap-2 text-[14px] font-black text-[#6B8E23]"
                                                    >
                                                        點擊閱覽完整筆記
                                                        <ArrowRight size={16} />
                                                    </Link>
                                                </motion.div>
                                            </AnimatePresence>

                                            {sessions.length > 1 && (
                                                <div className="mt-3 flex items-center justify-center gap-2">
                                                    {sessions.map((session, index) => (
                                                        <button
                                                            key={session.sessionId ?? index}
                                                            type="button"
                                                            aria-label={`切換到首頁第 ${index + 1} 筆完整筆記`}
                                                            onClick={() => setHeroSessionIndex(index)}
                                                            className={`h-2.5 rounded-full transition-all ${index === heroSessionIndex ? 'w-8 bg-[#7B8C4E]' : 'w-2.5 bg-[#DAD4C8] hover:bg-[#C3CF9D]'}`}
                                                        />
                                                    ))}
                                                </div>
                                            )}

                                            <div className="mt-3 overflow-hidden rounded-[1.3rem] border border-[#E8E0D4] bg-white shadow-sm">
                                                <Link
                                                    href="/prerequisites"
                                                    className="group flex items-center justify-between px-4 py-3 transition-colors hover:bg-[#F9FBE7]"
                                                >
                                                    <p className="min-w-0 text-[15px] font-black leading-tight text-[#2D2A26] md:text-[16px]" style={serif}>
                                                        先進行教學再進入觀庭筆記共構（推薦）
                                                    </p>
                                                    <span className="ml-4 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-2xl bg-[#F9FBE7] text-[#7B8C4E] transition-transform group-hover:translate-x-1">
                                                        <ArrowRight size={14} />
                                                    </span>
                                                </Link>

                                                <div className="h-px bg-[#EEE6DA]" />

                                                <Link
                                                    href="/sessions/compose"
                                                    className="group flex items-center justify-between px-4 py-3 transition-colors hover:bg-[#FFFDF8]"
                                                >
                                                    <p className="min-w-0 text-[15px] font-black leading-tight text-[#2D2A26] md:text-[16px]" style={serif}>
                                                        直接進入觀庭筆記共構（跨場次版面）
                                                    </p>
                                                    <span className="ml-4 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-2xl border border-[#D8D1C5] bg-[#FFFDF8] text-[#6B6358] transition-transform group-hover:translate-x-1">
                                                        <ArrowRight size={14} />
                                                    </span>
                                                </Link>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </FadeIn>
                </div>
            </section>

            {/* ═══ 這個計畫在做什麼 ═══ */}
            <section className="bg-[#FBF7F0] px-6 pb-10 pt-2">
                <div className="mx-auto max-w-7xl">
                    <FadeIn>
                        <div className="mb-8 text-center">
                            <p className="text-[12px] font-black uppercase tracking-[0.24em] text-[#7B8C4E]">About This Initiative</p>
                            <h2 className="mt-3 text-[34px] font-black text-[#2D2A26] md:text-[42px]" style={serif}>這個計畫在做什麼</h2>
                            <p className="mx-auto mt-3 max-w-2xl text-[17px] font-medium leading-[1.9] text-[#6B6358]">
                                我們面對的，是資訊破碎、理解困難、對立難解的現實；我們嘗試的，是讓資訊更具體、讓每個人都能自己去看、去想、去感受。
                            </p>
                        </div>
                    </FadeIn>

                    {/* 問題 ↔ 回應 */}
                    <div className="grid gap-4 md:grid-cols-3">
                        <FadeIn delay={0.05}>
                            <div className="rounded-[1.8rem] border border-[#E8E0D4] bg-white p-5 shadow-sm">
                                <div className="mb-3 text-[11px] font-black uppercase tracking-[0.18em] text-[#A09888]">我們面對的</div>
                                <h4 className="text-[19px] font-black text-[#2D2A26]" style={serif}>資訊紛亂斷裂、門檻高</h4>
                                <p className="mt-2 text-[14px] font-medium leading-[1.85] text-[#6B6358]">資訊紛亂、斷裂、專業壁壘，完整尋找門檻高</p>
                                <div className="mt-4 flex items-center gap-2 rounded-[1.2rem] border border-[#E3EED3] bg-[#F4FAEB] px-4 py-3">
                                    <BookOpen size={14} className="shrink-0 text-[#5A6F35]" />
                                    <span className="text-[13px] font-black text-[#5A6F35]">整合資訊，降低門檻</span>
                                </div>
                            </div>
                        </FadeIn>
                        <FadeIn delay={0.1}>
                            <div className="rounded-[1.8rem] border border-[#E8E0D4] bg-white p-5 shadow-sm">
                                <div className="mb-3 text-[11px] font-black uppercase tracking-[0.18em] text-[#A09888]">我們面對的</div>
                                <h4 className="text-[19px] font-black text-[#2D2A26]" style={serif}>單一敘事、詮釋壟斷</h4>
                                <p className="mt-2 text-[14px] font-medium leading-[1.85] text-[#6B6358]">有條件觀庭者僅少數，外界資訊均透過解讀詮釋，掌握解釋權</p>
                                <div className="mt-4 flex items-center gap-2 rounded-[1.2rem] border border-[#F5E6D3] bg-[#FFF4ED] px-4 py-3">
                                    <Eye size={14} className="shrink-0 text-[#A0724E]" />
                                    <span className="text-[13px] font-black text-[#A0724E]">觀庭還原，提供脈絡</span>
                                </div>
                            </div>
                        </FadeIn>
                        <FadeIn delay={0.15}>
                            <div className="rounded-[1.8rem] border border-[#E8E0D4] bg-white p-5 shadow-sm">
                                <div className="mb-3 text-[11px] font-black uppercase tracking-[0.18em] text-[#A09888]">我們面對的</div>
                                <h4 className="text-[19px] font-black text-[#2D2A26]" style={serif}>對立衝突、無法傾聽</h4>
                                <p className="mt-2 text-[14px] font-medium leading-[1.85] text-[#6B6358]">各自論述對立衝突，難以理解彼此，也不去聽對方的語言</p>
                                <div className="mt-4 flex items-center gap-2 rounded-[1.2rem] border border-[#FDE8D8] bg-[#FFF6F3] px-4 py-3">
                                    <HeartHandshake size={14} className="shrink-0 text-[#C67B5C]" />
                                    <span className="text-[13px] font-black text-[#C67B5C]">共構論述，建立交集</span>
                                </div>
                            </div>
                        </FadeIn>
                    </div>

                    {/* 資料怎麼來的 */}
                    <FadeIn delay={0.2}>
                        <div className="mt-6 overflow-hidden rounded-[2rem] border border-[#E8DCC7] bg-gradient-to-r from-[#FFF7E8] via-white to-[#F4F9E8] p-6 shadow-sm">
                            <p className="text-[12px] font-black uppercase tracking-[0.24em] text-[#B8860B]">How We Work</p>
                            <h3 className="mt-2 text-[24px] font-black text-[#2D2A26]" style={serif}>這份還原筆記是怎麼來的？</h3>
                            <div className="mt-5 grid gap-4 md:grid-cols-3">
                                {homepageGuideWorkflow.map((step) => (
                                    <div key={step.title} className={`rounded-[1.45rem] border border-[#E8E0D4] border-l-4 bg-white p-5 shadow-sm ${step.border}`}>
                                        <h4 className="text-[18px] font-black text-[#2D2A26]" style={serif}>{step.title}</h4>
                                        <ul className="mt-3 space-y-2">
                                            {step.items.map((item) => (
                                                <li key={item} className="flex items-start gap-2 text-[14px] font-medium leading-[1.8] text-[#5A5347]">
                                                    <ChevronRight size={14} className={`mt-1 shrink-0 ${step.accent}`} />
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </FadeIn>
                </div>
            </section>

            <SessionsOverviewSection embedded />

            {/* ═══ 🔥 熱門入口 ═══ */}
            <Banner title="熱門入口" subtitle="Trending Entry Points" bg="bg-[#F1ECE2]" text="text-[#5D5448]" />
            <section id="trending" className="bg-gradient-to-b from-[#F7F3EC] to-[#FBF7F0] px-6 py-8">
                <div className="max-w-7xl mx-auto mb-6 rounded-[1.8rem] border border-[#E8E0D4] bg-white p-5 shadow-sm">
                    <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                        <div>
                            <p className="text-[12px] font-black uppercase tracking-[0.24em] text-[#7B8C4E]">Hot Entry Points</p>
                            <h3 className="mt-2 text-[28px] font-black text-[#2D2A26]" style={serif}>首頁先看最熱入口，完整內容留在各自正式頁</h3>
                            <p className="mt-2 max-w-3xl text-[16px] font-medium leading-[1.8] text-[#6B6358]">
                                這裡只保留最受關注的還原筆記、專業留言與公開文章入口。若要完整閱覽，請進入還原筆記總覽、論壇與排行榜。
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <Link href="/sessions" className="rounded-2xl border border-[#D7E5BB] bg-[#F9FBE7] px-5 py-3 text-[15px] font-black text-[#5A6F35] transition-all hover:-translate-y-0.5 hover:bg-[#EEF6DA]">
                                還原筆記總覽
                            </Link>
                            <Link href="/forum" className="rounded-2xl border border-[#E8E0D4] bg-white px-5 py-3 text-[15px] font-black text-[#5A5347] transition-all hover:-translate-y-0.5 hover:bg-[#FFFDF8]">
                                公開文章
                            </Link>
                            <Link href="/rankings" className="rounded-2xl border border-[#E8E0D4] bg-white px-5 py-3 text-[15px] font-black text-[#5A5347] transition-all hover:-translate-y-0.5 hover:bg-[#FFFDF8]">
                                查看完整排行
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-5">
                    <FadeIn>
                        <motion.div whileHover={{ y: -4 }} className="rounded-2xl border border-[#E8E0D4] bg-white p-5 transition-all hover:border-orange-200 hover:shadow-[0_10px_30px_rgba(255,165,0,0.08)]">
                            <div className="flex items-center gap-2 mb-4">
                                <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 2, repeat: Infinity }}
                                    className="w-9 h-9 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center text-white shadow-md"><BookOpen size={18} /></motion.div>
                                <h4 className="text-[20px] font-black text-[#2D2A26]" style={serif}>最受關注的對話紀錄</h4>
                            </div>
                            {loading ? (
                                <div className="space-y-3">
                                    <Skeleton className="h-8 w-24 rounded-full bg-orange-100" />
                                    <Skeleton className="h-6 w-full rounded-xl bg-[#F7E7D8]" />
                                    <Skeleton className="h-6 w-5/6 rounded-xl bg-[#F7E7D8]" />
                                    <Skeleton className="h-4 w-2/3 rounded-xl bg-[#F7E7D8]" />
                                </div>
                            ) : hotNotes.length === 0 ? (
                                <p className="text-[#8A8078] text-center py-6 text-[14px] font-bold">目前尚無熱門觀庭筆記</p>
                            ) : (() => {
                                const n = hotNotes[0];
                                const s = sessions.find(sess => sess.id === n.sessionPageId);
                                const noteHref = s ? `/sessions/${s.sessionId}#line-${n.lineId || n.id}` : '/sessions';
                                return (
                                    <Link href={noteHref} className="block">
                                        <motion.div whileHover={{ x: 4, backgroundColor: 'rgba(255,255,255,0.05)' }}
                                            className="cursor-pointer rounded-[1.5rem] border border-[#F1E3D2] bg-[#FFFDF9] p-4 transition-colors">
                                            <div className="mb-3 flex items-center gap-2">
                                                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-orange-500/15 text-[16px] font-black text-orange-400">1</span>
                                                <span className="rounded-full bg-orange-500/10 px-3 py-1 text-[12px] font-black text-orange-300">本週最熱筆記</span>
                                            </div>
                                            <p className="text-[17px] font-black leading-relaxed text-[#2D2A26]">{n.content.substring(0, 56)}...</p>
                                            <div className="mt-3 flex items-center justify-between gap-3 text-[14px]">
                                                <span className="truncate font-bold text-gray-500">{s ? s.title : '還原筆記'}</span>
                                                {typeof n.likeCount === 'number' ? (
                                                    <span className="shrink-0 text-red-400 flex items-center gap-1"><Heart size={13} fill="currentColor" />{n.likeCount}</span>
                                                ) : null}
                                            </div>
                                        </motion.div>
                                    </Link>
                                );
                            })()}
                        </motion.div>
                    </FadeIn>
                    <FadeIn delay={0.12}>
                        <motion.div whileHover={{ y: -4 }} className="rounded-2xl border border-[#E8E0D4] bg-white p-5 transition-all hover:border-purple-200 hover:shadow-[0_10px_30px_rgba(139,92,246,0.08)]">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-9 h-9 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center text-white shadow-md"><MessageSquare size={18} /></div>
                                <h4 className="text-[20px] font-black text-[#2D2A26]" style={serif}>熱門專業留言</h4>
                            </div>
                            {loading ? (
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <Skeleton className="h-8 w-8 rounded-lg bg-violet-100" />
                                        <Skeleton className="h-5 w-32 rounded-lg bg-[#EAE4F8]" />
                                    </div>
                                    <Skeleton className="h-5 w-full rounded-xl bg-[#EAE4F8]" />
                                    <Skeleton className="h-5 w-5/6 rounded-xl bg-[#EAE4F8]" />
                                    <Skeleton className="h-4 w-2/3 rounded-xl bg-[#EAE4F8]" />
                                </div>
                            ) : hotComments.length === 0 ? (
                                <p className="text-[#8A8078] text-center py-6 text-[14px] font-bold">目前尚無專業留言</p>
                            ) : (() => {
                                const c = hotComments[0];
                                const s = sessions.find(sess => sess.id === c.targetSessionId);
                                const commentHref = s ? `/sessions/${s.sessionId}${c.targetLineId ? `#line-${c.targetLineId}` : ''}` : '/sessions';
                                return (
                                    <Link href={commentHref} className="block">
                                        <motion.div whileHover={{ scale: 1.02 }}
                                            className="rounded-[1.5rem] border border-[#ECE7F8] bg-[#FDFBFF] p-4 transition-all cursor-pointer">
                                            <div className="mb-3 flex flex-wrap items-center gap-2">
                                                <div className="w-8 h-8 bg-gradient-to-br from-violet-400 to-purple-500 rounded-lg flex items-center justify-center text-white text-[12px] font-black">{c.author.slice(-1)}</div>
                                                <span className="text-[14px] font-bold text-[#5A5347]">{c.author}</span>
                                                <span className="text-[12px] font-bold text-purple-300 bg-purple-500/15 px-2 py-0.5 rounded">{c.role}</span>
                                            </div>
                                            <p className="text-[15px] text-[#6B6358] leading-relaxed line-clamp-3">{c.content}</p>
                                            <div className="mt-3 flex items-center justify-between gap-3 text-[14px]">
                                                <span className="truncate font-bold text-gray-500">{s ? s.title : '還原筆記留言'}</span>
                                                <span className="shrink-0 text-red-400 flex items-center gap-1"><Heart size={13} fill="currentColor" />{c.likes}</span>
                                            </div>
                                        </motion.div>
                                    </Link>
                                )
                            })()}
                        </motion.div>
                    </FadeIn>
                    <FadeIn delay={0.24}>
                        <motion.div whileHover={{ y: -4 }} className="rounded-2xl border border-[#E8E0D4] bg-white p-5 transition-all hover:border-emerald-200 hover:shadow-[0_10px_30px_rgba(16,185,129,0.08)]">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center text-white shadow-md"><FileText size={18} /></div>
                                <h4 className="text-[20px] font-black text-[#2D2A26]" style={serif}>熱門投稿文章</h4>
                            </div>
                            {loading ? (
                                <div className="space-y-3">
                                    <Skeleton className="h-8 w-24 rounded-full bg-emerald-100" />
                                    <Skeleton className="h-6 w-full rounded-xl bg-[#DDEFE7]" />
                                    <Skeleton className="h-6 w-4/5 rounded-xl bg-[#DDEFE7]" />
                                    <Skeleton className="h-4 w-1/2 rounded-xl bg-[#DDEFE7]" />
                                </div>
                            ) : hotArticles.length === 0 ? (
                                <p className="text-[#8A8078] text-center py-6 text-[14px] font-bold">目前尚無投稿文章</p>
                            ) : (() => {
                                const a = hotArticles[0];
                                const s = sessions.find(sess => sess.id === a.targetSessionId);
                                return (
                                    <Link href={`/forum/${a.id}`} className="block">
                                        <motion.div whileHover={{ scale: 1.02 }}
                                            className="rounded-[1.5rem] border border-[#D9EEE5] bg-[#FBFFFD] p-4 transition-all cursor-pointer">
                                            <div className="mb-3 flex flex-wrap items-center gap-2">
                                                <span className="text-[12px] font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">{a.category}</span>
                                                {s && (
                                                    <span className="text-[12px] text-blue-300 bg-blue-500/15 px-2 py-0.5 rounded flex items-center gap-1">
                                                        <BookOpen size={10} /> {s.sessionId}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-[17px] font-bold text-[#2D2A26] leading-relaxed hover:text-emerald-600 transition-colors">{a.title}</p>
                                            <div className="mt-3 flex items-center justify-between gap-3 text-[14px]">
                                                <span className="truncate font-bold text-gray-500">{a.author}</span>
                                                <span className="shrink-0 text-red-400 flex items-center gap-1"><Heart size={13} fill="currentColor" />{a.likes}</span>
                                            </div>
                                        </motion.div>
                                    </Link>
                                )
                            })()}
                        </motion.div>
                    </FadeIn>
                </div>
            </section>

            {/* ═══ 想一起書寫？ ═══ */}
            <Banner title="想一起書寫？" subtitle="Join the Community" bg="bg-[#EEF6DA]" text="text-[#4A5E28]" />
            <section className="bg-[#F4FAE8] px-6 py-10">
                <div className="mx-auto max-w-4xl text-center">
                    <FadeIn>
                        <p className="text-[12px] font-black uppercase tracking-[0.24em] text-[#7B8C4E]">Start Contributing</p>
                        <h2 className="mt-3 text-[34px] font-black text-[#2D2A26] md:text-[42px]" style={serif}>想一起書寫？</h2>
                        <p className="mt-3 text-[18px] font-medium leading-[1.9] text-[#6B6358]">
                            所有人都可以去探究、去感受、去書寫。
                        </p>
                    </FadeIn>
                    <FadeIn delay={0.1}>
                        <div className="mt-8 grid gap-4 text-left md:grid-cols-3">
                            {([
                                { step: '01', label: '閱讀還原筆記', desc: '進入任一場次，閱讀完整的開庭還原內容', icon: BookOpen },
                                { step: '02', label: '書寫你的觀點', desc: '針對逐字稿書寫自己的理解、感受與論述', icon: PenTool },
                                { step: '03', label: '送審後公開發表', desc: '通過審閱後，你的筆記將和還原記錄一起呈現', icon: Send },
                            ] as const).map((s) => {
                                const Icon = s.icon;
                                return (
                                    <div key={s.step} className="rounded-[1.6rem] border border-[#D7E5BB] bg-white p-5 shadow-sm">
                                        <div className="mb-3 text-[34px] font-black text-[#D7E5BB]" style={serif}>{s.step}</div>
                                        <div className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#F4FAEB] text-[#5A6F35]">
                                            <Icon size={18} />
                                        </div>
                                        <h4 className="text-[17px] font-black text-[#2D2A26]" style={serif}>{s.label}</h4>
                                        <p className="mt-1.5 text-[14px] font-medium leading-[1.8] text-[#6B6358]">{s.desc}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </FadeIn>
                    <FadeIn delay={0.2}>
                        <div className="mt-8">
                            <Link href="/guide">
                                <motion.button whileHover={{ scale: 1.04, boxShadow: '0 16px 40px rgba(123,140,78,0.25)' }} whileTap={{ scale: 0.97 }}
                                    className="group rounded-2xl bg-gradient-to-r from-[#7B8C4E] to-[#5a6e38] px-10 py-4 text-[19px] font-black text-white shadow-lg shadow-[#7B8C4E]/20">
                                    <span className="flex items-center gap-3">了解如何投稿 <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" /></span>
                                </motion.button>
                            </Link>
                        </div>
                    </FadeIn>
                </div>
            </section>

            {/* ═══ 聯絡與支持 ═══ */}
            <Banner title="聯絡與支持" subtitle="Contact & Acknowledgments" bg="bg-[#F4ECDE]" text="text-[#7A5C3D]" />
            <section className="max-w-7xl mx-auto px-6 py-6">
                <div className="mb-5 rounded-[1.8rem] border border-[#E8DCC7] bg-white px-6 py-5 shadow-sm">
                    <p className="text-[12px] font-black uppercase tracking-[0.24em] text-[#B8860B]">Support & Contact</p>
                    <h3 className="mt-2 text-[28px] font-black text-[#2D2A26]" style={serif}>需要補充資料、匿名回饋，或想理解這個計畫由誰維護？</h3>
                    <p className="mt-2 max-w-4xl text-[16px] font-medium leading-[1.85] text-[#5A5347]">
                        首頁先保留最常用的聯絡與支持入口。更完整的匿名傳送、私密回報與後續互動，請進入聯絡頁。
                    </p>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                    <FadeIn>
                        <motion.div whileHover={{ y: -3 }} className="h-full rounded-[2rem] border border-[#E8DCC7] bg-white p-6 shadow-sm transition-all hover:shadow-md">
                            <div className="flex flex-col md:flex-row md:items-start gap-5">
                                <motion.div
                                    animate={{ y: [0, -4, 0] }}
                                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                                    className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#FDE8D8] text-[#C67B5C] shadow-sm"
                                >
                                    <Send size={26} />
                                </motion.div>
                                <div className="flex-1">
                                    <p className="text-[12px] font-black uppercase tracking-[0.24em] text-[#C67B5C]">Anonymous Contact</p>
                                    <h4 className="mt-2 text-[26px] font-black text-[#2D2A26]" style={serif}>匿名聯絡與資料提供</h4>
                                    <p className="mt-3 text-[17px] font-medium leading-[1.8] text-[#5A5347]">
                                        無論是逐字稿投稿、資料補充、意見回饋或糾錯回報，您都可以匿名透過此管道向團隊傳達。
                                    </p>
                                    <div className="mt-5 flex flex-wrap gap-3">
                                        {['逐字稿投稿', '資料補充', '意見回饋', '糾錯回報'].map((item) => (
                                            <span key={item} className="rounded-xl border border-[#EFD7C4] bg-[#FFF8F2] px-4 py-2 text-[15px] font-black text-[#A86545]">
                                                {item}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="mt-6 flex items-center justify-between gap-4 border-t border-[#F0E5D8] pt-5">
                                <p className="text-[14px] font-bold leading-relaxed text-[#8A8078]">
                                    需要私密回報、補充資料、或直接聯絡團隊時，請從這裡進入。
                                </p>
                                <Link href="/contact">
                                    <motion.div
                                        whileHover={{ scale: 1.02, boxShadow: '0 12px 30px rgba(198,123,92,0.20)' }}
                                        whileTap={{ scale: 0.98 }}
                                        className="inline-flex shrink-0 items-center gap-3 rounded-2xl bg-gradient-to-r from-[#C67B5C] to-[#a8634a] px-6 py-3 text-[17px] font-black text-white shadow-lg"
                                    >
                                        開始匿名傳送
                                        <ArrowRight size={18} />
                                    </motion.div>
                                </Link>
                            </div>
                        </motion.div>
                    </FadeIn>

                    <FadeIn delay={0.1}>
                        <motion.div whileHover={{ y: -3 }} className="h-full rounded-[2rem] border border-[#E8DCC7] bg-white p-6 shadow-sm transition-all hover:shadow-md">
                            <div className="flex items-start gap-4">
                                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#F5E6D3] text-[#B8860B] shadow-sm">
                                    <HeartHandshake size={24} />
                                </div>
                                <div>
                                    <p className="text-[12px] font-black uppercase tracking-[0.24em] text-[#B8860B]">Acknowledgments</p>
                                    <h4 className="mt-2 text-[26px] font-black text-[#2D2A26]" style={serif}>團隊介紹與特別鳴謝</h4>
                                    <p className="mt-3 text-[17px] font-medium leading-[1.8] text-[#5A5347]">
                                        本團隊成員皆為現職社工、心理、輔導等實務工作者，利用公餘時間維護平台。若更新與除錯進度較緩，尚請海涵見諒。
                                    </p>
                                </div>
                            </div>

                            <div className="mt-6 rounded-[1.6rem] border border-[#E8D5B8] bg-[#FFF8EF] p-5">
                                <p className="text-[17px] font-black text-[#7A5C3D]" style={serif}>感謝民眾線上社群支持</p>
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {['孩想陪你長大聯盟', '兒虐零容忍', '孩想陪你長大', '鵝保社工團隊'].map((t, i) => (
                                        <motion.span
                                            key={t}
                                            initial={{ opacity: 0, y: 10 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: 0.2 + i * 0.08 }}
                                            className="rounded-xl border border-[#E8D5B8] bg-[#F5E6D3] px-4 py-2 text-[14px] font-black text-[#7A5C3D] shadow-sm"
                                        >
                                            ✨ {t}
                                        </motion.span>
                                    ))}
                                </div>
                                <p className="mt-4 text-[16px] font-medium leading-[1.8] text-[#5A5347]">
                                    感謝以上等社群之熱心民眾、專業人員提供各項資料及建議，協力共構本筆記。
                                </p>
                            </div>
                        </motion.div>
                    </FadeIn>
                </div>
            </section>

            <section id="sources-acknowledgements" className="max-w-7xl mx-auto scroll-mt-36 px-6 py-6">
                <SourceAcknowledgementShelf />
            </section>

            {/* ═══ Footer ═══ */}
            <footer className="bg-[#2D2A26] mt-4 pt-10 pb-6 px-6 text-white">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-8">
                    <div>
                        <p className="text-[22px] font-black" style={serif}>{SITE_NAME}</p>
                        <p className="text-[12px] text-[#8A8078] mt-1 font-bold tracking-widest">{SITE_TAGLINE}</p>
                        <p className="text-[16px] text-[#8A8078] mt-3 max-w-md">{TEAM_BLURB}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-8 text-[16px]">
                        <div>
                            <h5 className="text-[12px] font-black text-[#8A8078] uppercase tracking-widest mb-3">導覽</h5>
                            <ul className="space-y-2 font-bold text-[#A09888]">
                                {FOOTER_NAV_ITEMS.map((item) => (
                                    <li key={item.name}>
                                        <Link href={item.href} className="hover:text-[#B8D468] transition-colors">
                                            {item.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h5 className="text-[12px] font-black text-[#8A8078] uppercase tracking-widest mb-3">聯繫</h5>
                            <Link href="/contact">
                                <motion.button whileHover={{ scale: 1.03 }}
                                    className="bg-white/10 text-white px-6 py-3 rounded-xl text-[16px] font-bold hover:bg-[#7B8C4E] transition-colors flex items-center gap-2 border border-white/10 hover:border-[#7B8C4E]">
                                    <Send size={16} />匿名傳送
                                </motion.button>
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto mt-8 pt-4 border-t border-white/10 text-center">
                    <p className="text-[13px] text-[#6B6358] font-bold">{COPYRIGHT_NOTICE}</p>
                </div>
            </footer>
        </div >
    );
}
