'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, useScroll, AnimatePresence } from 'framer-motion';
import {
    PenTool, BookOpen, Heart, Eye, MessageSquare, ChevronRight, Flame,
    Gavel, Clock, ArrowRight, BookMarked, Layers, Flag, Menu, X, Users,
    HeartHandshake, Sparkles, Send, FileText, MessageCircle, Shield, Scale, ShieldAlert
} from 'lucide-react';
import { FadeIn, Counter, TypeWriter, Banner, WarmGradientBg } from '@/components/ui-shared';

const serif = { fontFamily: "'Noto Serif TC', serif" };

type SiteStats = { totalSessions: number; restoredSessions: number; approvedComments: number };

export default function Home() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const { scrollYProgress } = useScroll();

    const [cms, setCms] = useState<Record<string, string>>({});
    const [sessions, setSessions] = useState<any[]>([]);
    const [stats, setStats] = useState<SiteStats>({ totalSessions: 0, restoredSessions: 0, approvedComments: 0 });
    const [hotNotes, setHotNotes] = useState<any[]>([]);
    const [hotComments, setHotComments] = useState<any[]>([]);
    const [hotArticles, setHotArticles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const h = () => setScrolled(window.scrollY > 30);
        window.addEventListener('scroll', h); return () => window.removeEventListener('scroll', h);
    }, []);

    useEffect(() => {
        Promise.all([
            fetch('/api/cms').then(r => r.json()),
            fetch('/api/sessions').then(r => r.json()),
            fetch('/api/stats').then(r => r.json()),
            fetch('/api/trending?type=notes').then(r => r.json()),
            fetch('/api/trending?type=comments').then(r => r.json()),
            fetch('/api/trending?type=articles').then(r => r.json()),
        ]).then(([cmsData, sessionsData, statsData, notesData, commentsData, articlesData]) => {
            setCms(cmsData.data || cmsData);
            setSessions(sessionsData.data || sessionsData || []);
            setStats(statsData);
            setHotNotes(notesData);
            setHotComments(commentsData);
            setHotArticles(articlesData);
            setLoading(false);
        }).catch(err => {
            console.error('Error fetching data:', err);
            setLoading(false);
        });
    }, []);

    const navItems = [
        { icon: <BookOpen size={18} />, name: '計畫緣起', href: '#mission' },
        { icon: <BookMarked size={18} />, name: '先備知識', href: '#knowledge' },
        { icon: <Gavel size={18} />, name: '還原筆記', href: '/sessions' },
        { icon: <Flame size={18} />, name: '熱門排行', href: '#trending' },
        { icon: <MessageCircle size={18} />, name: '論壇', href: '/forum' },
        { icon: <Send size={18} />, name: '聯絡我們', href: '/contact' },
    ];

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

    const heroTitle = cms['Hero_Title'] || '法庭實況還原\n專業共構筆記計畫';
    const heroDesc = cms['Hero_Desc_1'] || '這不只是一份開庭紀錄，而是一場化血淚為滋養的集體療癒與重建。';
    const typewriterTexts = (cms['Hero_TypeWriter_Texts'] || '唯有直視真實，才能共構解方|讓同伴與後輩不再孤單|用專業視角為社工實務留下註腳|不造神・重文字・匿名化・去權威').split('|');

    return (
        <div className="min-h-screen overflow-x-hidden" style={{ backgroundColor: '#FBF7F0', color: '#2D2A26', fontSize: '18px' }}>
            {/* 滾動進度條 */}
            <motion.div className="fixed top-0 left-0 right-0 h-[3px] z-[100] origin-left"
                style={{ scaleX: scrollYProgress, background: 'linear-gradient(90deg, #7B8C4E, #B8860B, #C67B5C)' }} />

            {/* Beta Banner */}
            <div className="relative z-50 bg-gradient-to-r from-[#5a6e38] via-[#7B8C4E] to-[#8a9d58] text-white text-[15px] font-bold text-center py-2 tracking-wider shadow-sm">
                <motion.span animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 2, repeat: Infinity }} className="inline-block mr-2 text-yellow-200">●</motion.span>
                目前為 Beta 前導測試版，系統建置與數據對接中
            </div>

            {/* Navbar */}
            <motion.nav initial={{ y: -80 }} animate={{ y: 0 }} transition={{ duration: 0.5, ease: 'easeOut' }}
                className={`sticky top-0 z-40 transition-all duration-300 border-b ${scrolled ? 'bg-[#FBF7F0]/95 backdrop-blur-xl shadow-md border-[#E8E0D4]' : 'bg-[#FBF7F0] border-transparent'}`}>
                <div className="max-w-7xl mx-auto px-6 py-2 flex justify-between items-center">
                    <Link href="/" className="flex items-center gap-3">
                        <motion.div whileHover={{ rotate: 15, scale: 1.1 }} transition={{ type: 'spring', stiffness: 300 }}
                            className="bg-gradient-to-br from-[#7B8C4E] to-[#5a6e38] p-2.5 rounded-xl text-white shadow-md"><PenTool size={22} /></motion.div>
                        <div>
                            <h1 className="text-[20px] font-black leading-tight" style={serif}>法庭實況還原與專業共構筆記</h1>
                            <p className="text-[11px] text-[#A09888] font-bold tracking-[0.15em]">SOCIAL WORK COURT NOTES</p>
                        </div>
                    </Link>
                    <div className="hidden lg:flex items-center gap-0.5">
                        {navItems.map(item => (
                            <Link key={item.name} href={item.href}
                                className="relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-[17px] font-bold text-[#5A5347] hover:text-[#7B8C4E] transition-colors group">
                                {item.icon}<span>{item.name}</span>
                                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 h-[2px] bg-[#7B8C4E] rounded-full w-0 group-hover:w-8 transition-all duration-300" />
                            </Link>
                        ))}
                        <Link href="/forum">
                            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                className="ml-3 bg-gradient-to-r from-[#7B8C4E] to-[#5a6e38] text-white px-6 py-2.5 rounded-xl text-[16px] font-black shadow-lg shadow-[#7B8C4E]/25 hover:shadow-[#7B8C4E]/40 transition-shadow">
                                我要投稿 ✍️
                            </motion.button>
                        </Link>
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
            <section id="mission" className="relative bg-gradient-to-b from-[#F5EFE4] to-[#FBF7F0] pt-10 pb-8 px-6 border-b border-[#E8E0D4] overflow-hidden">
                <WarmGradientBg />
                <div className="max-w-5xl mx-auto relative z-10">
                    <FadeIn>
                        <motion.div whileHover={{ scale: 1.05 }} className="inline-flex items-center gap-2 px-5 py-2 bg-white/60 backdrop-blur-sm text-[#7B8C4E] rounded-full text-[15px] font-black tracking-wider border border-[#7B8C4E]/20 shadow-sm cursor-default">
                            <motion.span animate={{ rotate: [0, -10, 10, 0] }} transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}><Gavel size={16} /></motion.span>
                            社會工作與法律的實務共構
                        </motion.div>
                    </FadeIn>
                    <FadeIn delay={0.1}>
                        <h2 className="mt-5 text-[48px] md:text-[64px] lg:text-[72px] font-black leading-[1.15] tracking-tight" style={serif}>
                            法庭實況還原<br />
                            <span className="relative inline-block text-[#7B8C4E]">專業共構筆記
                                <motion.svg className="absolute -bottom-3 left-0 w-full" height="14" viewBox="0 0 200 14" preserveAspectRatio="none"
                                    initial={{ pathLength: 0, opacity: 0 }} whileInView={{ pathLength: 1, opacity: 1 }} transition={{ duration: 1.8, delay: 0.6, ease: 'easeOut' }}>
                                    <motion.path d="M4 10 Q 50 2 100 8 Q 150 14 196 6" stroke="#C5D9A8" strokeWidth="6" strokeLinecap="round" fill="transparent"
                                        initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} transition={{ duration: 1.8, delay: 0.6 }} />
                                </motion.svg>
                            </span>
                            <span className="text-[#A09888] text-[36px] md:text-[42px] font-bold ml-2">計畫</span>
                        </h2>
                    </FadeIn>
                    <FadeIn delay={0.2}>
                        <div className="mt-5 max-w-3xl text-[20px] md:text-[22px] text-[#6B6358] font-medium leading-[1.9]">
                            <p>這不只是一份開庭紀錄，而是一場<strong className="text-[#2D2A26]">化血淚為滋養</strong>的集體療癒與重建。</p>
                            <p className="mt-2">
                                <span className="text-[#7B8C4E] font-bold">
                                    <TypeWriter texts={['唯有直視真實，才能共構解方', '讓同伴與後輩不再孤單', '用專業視角為社工實務留下註腳', '不造神・重文字・匿名化・去權威']} />
                                </span>
                            </p>
                        </div>
                    </FadeIn>
                    <FadeIn delay={0.3}>
                        <div className="mt-6 flex flex-wrap gap-4 items-center">
                            <Link href="/sessions">
                                <motion.button whileHover={{ scale: 1.05, boxShadow: '0 16px 40px rgba(123,140,78,0.3)' }} whileTap={{ scale: 0.97 }}
                                    className="group relative bg-gradient-to-r from-[#7B8C4E] to-[#5a6e38] text-white px-10 py-4 rounded-2xl text-[22px] font-black shadow-lg shadow-[#7B8C4E]/20 transition-all overflow-hidden">
                                    <span className="relative z-10 flex items-center gap-3">點我看現場還原！ <ArrowRight size={22} className="group-hover:translate-x-2 transition-transform" /></span>
                                </motion.button>
                            </Link>
                            <a href="#about">
                                <motion.span className="px-8 py-4 rounded-2xl text-[20px] font-bold border-2 border-[#D4CCC0] text-[#6B6358] hover:border-[#7B8C4E] hover:text-[#7B8C4E] transition-all inline-block cursor-pointer">計畫說明 ↓</motion.span>
                            </a>
                        </div>
                    </FadeIn>
                    <FadeIn delay={0.4}>
                        <div className="mt-6 flex gap-10 text-center">
                            {[
                                { n: stats.totalSessions, l: '場開庭紀錄' },
                                { n: stats.restoredSessions, l: '場已還原' },
                                { n: stats.approvedComments, l: '則專業留言', s: '+' }
                            ].map((s, i) => (
                                <div key={i}>
                                    <p className="text-[36px] font-black text-[#7B8C4E]" style={serif}><Counter target={s.n} suffix={'s' in s ? s.s as string : undefined} /></p>
                                    <p className="text-[14px] font-bold text-[#A09888]">{s.l}</p>
                                </div>
                            ))}
                        </div>
                    </FadeIn>
                </div>
            </section>

            {/* ═══ What We Do ═══ */}
            <Banner title="這個平台在做什麼？" subtitle="What We Do" bg="bg-[#E8E0D4]" text="text-[#3D3832]" />
            <section className="max-w-7xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {[
                        { icon: <BookMarked size={30} />, label: "整合資訊", desc: "打破壁壘，降低門檻", color: "bg-[#E3EED3]", accent: "text-[#5A6F35]", glow: "hover:shadow-[0_8px_30px_rgba(123,140,78,0.2)]" },
                        { icon: <Eye size={30} />, label: "觀庭還原", desc: "身歷其境，完整還原", color: "bg-[#F5E6D3]", accent: "text-[#A0724E]", glow: "hover:shadow-[0_8px_30px_rgba(198,123,92,0.2)]" },
                        { icon: <Gavel size={30} />, label: "觀庭評述", desc: "就本案呈現真實狀況評述", color: "bg-[#E0DAF0]", accent: "text-[#6B5CA5]", glow: "hover:shadow-[0_8px_30px_rgba(107,92,165,0.2)]" },
                        { icon: <MessageCircle size={30} />, label: "建構論壇", desc: "匿名交流，平等詮釋", color: "bg-[#E3EED3]", accent: "text-[#5A6F35]", glow: "hover:shadow-[0_8px_30px_rgba(123,140,78,0.2)]" },
                        { icon: <Sparkles size={30} />, label: "共構解方", desc: "集體智慧，復原重建", color: "bg-[#FDE8D8]", accent: "text-[#C67B5C]", glow: "hover:shadow-[0_8px_30px_rgba(198,123,92,0.2)]" },
                    ].map((item, i) => (
                        <FadeIn key={i} delay={i * 0.08}>
                            <motion.div whileHover={{ y: -6, scale: 1.02 }} transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                                className={`${item.color} p-6 rounded-2xl border border-black/5 cursor-pointer group transition-shadow ${item.glow} h-full`}>
                                <motion.div whileHover={{ rotate: 8, scale: 1.15 }} transition={{ type: 'spring', stiffness: 400 }}
                                    className={`w-14 h-14 rounded-xl ${item.accent} bg-white/60 flex items-center justify-center mb-3`}>{item.icon}</motion.div>
                                <p className="text-[22px] md:text-[24px] font-black" style={serif}>{item.label}</p>
                                <p className="text-[15px] font-bold text-[#8A8078] mt-2 leading-relaxed h-[45px]">{item.desc}</p>
                            </motion.div>
                        </FadeIn>
                    ))}
                </div>
            </section>

            {/* ═══ 先備知識 ═══ */}
            <Banner title="先備知識" subtitle="Prerequisites" bg="bg-[#C67B5C]/15" text="text-[#8B4D35]" />
            <section id="knowledge" className="max-w-7xl mx-auto px-6 py-8">
                <FadeIn>
                    <div className="bg-white rounded-2xl p-6 md:p-8 border border-[#E8E0D4] shadow-sm">
                        <p className="text-[20px] text-[#6B6358] font-medium leading-[1.8] mb-6">
                            希望夥伴們理解法庭規則後再往下看，才能在清楚脈絡與規則下判讀，理解開庭中的動力與詰問的背後意義。 例：何謂合議庭？為何一場開庭會有三名法官？證人詰問是什麼？
                        </p>
                        <p className="text-[16px] text-[#A09888] font-bold mb-6">感謝 <a href="https://www.legis-pedia.com/" target="_blank" className="text-[#7B8C4E] underline">法律百科</a></p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                                { title: '剴剴案：建議先備知識', desc: '整理本案相關的背景脈絡與重要法律名詞釋義。持續更新中', url: 'https://bird-wildebeest-d6d.notion.site/3147e2fdafd880bfb51ce110811c2e34' },
                                { title: '彙總：開庭情境與階段說明', desc: '深入淺出解說法庭配置、發言順序與各階段的法律意義。', url: 'https://bird-wildebeest-d6d.notion.site/3147e2fdafd880e3bb81f280f68680db' },
                            ].map((link, i) => (
                                <motion.a key={i} href={link.url} target="_blank" whileHover={{ y: -3 }}
                                    className="block bg-[#F5EFE4] p-6 rounded-xl border border-[#E8E0D4] hover:border-[#7B8C4E] transition-all group">
                                    <h4 className="text-[22px] font-black group-hover:text-[#7B8C4E] transition-colors" style={serif}>{link.title}</h4>
                                    <p className="text-[16px] text-[#8A8078] font-bold mt-2">{link.desc}</p>
                                    <span className="text-[#7B8C4E] text-[14px] font-bold mt-3 flex items-center gap-1">閱讀更多 <ArrowRight size={14} /></span>
                                </motion.a>
                            ))}
                        </div>
                    </div>
                </FadeIn>
            </section>

            {/* ═══ 最新還原 ═══ */}
            <Banner title="最新還原場次" subtitle="Latest Restoration" bg="bg-[#E3EED3]" text="text-[#3D5220]" />
            <section className="max-w-7xl mx-auto px-6 py-6">
                <FadeIn>
                    <motion.div whileHover={{ borderColor: '#7B8C4E', boxShadow: '0 12px 40px rgba(123,140,78,0.15)' }}
                        className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border-2 border-[#E8E0D4] flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 transition-all">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                                <motion.span animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}
                                    className="bg-[#C67B5C] text-white text-[14px] font-black px-3 py-1 rounded-lg shadow-sm">最新還原</motion.span>
                                <span className="text-[#7B8C4E] text-[16px] font-bold flex items-center gap-1"><Clock size={16} />2026 年 2 月 26 日</span>
                            </div>
                            <h3 className="text-[28px] md:text-[32px] font-black leading-tight" style={serif}>檢察官論告與辯護律師簡報與陳述還原</h3>
                            <div className="mt-3 bg-[#FBF7F0] p-4 rounded-xl border border-[#E8E0D4]">
                                <p className="text-[18px] font-bold text-[#5A5347]">⚠️ 114年度訴字第51號 過失致死等案（一審審理庭第六場次）</p>
                                <p className="text-[16px] font-bold text-[#8A8078] mt-1 flex items-center gap-2">
                                    <motion.span animate={{ scale: [1, 1.4, 1] }} transition={{ duration: 1.5, repeat: Infinity }} className="w-2 h-2 rounded-full bg-[#7B8C4E] inline-block" />
                                    程序：言詞辯論、檢方論告與最後陳述
                                </p>
                            </div>
                        </div>
                        <Link href="/sessions">
                            <motion.button whileHover={{ scale: 1.05, boxShadow: '0 16px 40px rgba(123,140,78,0.3)' }} whileTap={{ scale: 0.97 }}
                                className="bg-gradient-to-br from-[#7B8C4E] to-[#5a6e38] text-white px-8 py-5 rounded-2xl text-[22px] font-black shadow-lg shrink-0 flex flex-col items-center gap-1">
                                <span>點我看現場還原！</span>
                                <span className="text-[13px] font-bold opacity-80 flex items-center gap-1">立即進入場次全文 <ArrowRight size={14} /></span>
                            </motion.button>
                        </Link>
                    </motion.div>
                </FadeIn>
            </section>

            {/* ═══ 🔥 熱門排行 ═══ */}
            <Banner title="🔥 熱門排行榜" subtitle="Trending — 由社群按讚驅動" bg="bg-[#2D2A26]" text="text-white" />
            <section id="trending" className="bg-gradient-to-b from-[#2D2A26] to-[#1a1816] px-6 py-8">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-5">
                    <FadeIn>
                        <motion.div whileHover={{ y: -4 }} className="bg-white/[0.06] backdrop-blur rounded-2xl p-5 border border-white/10 hover:border-orange-500/30 transition-all hover:shadow-[0_8px_30px_rgba(255,165,0,0.1)]">
                            <div className="flex items-center gap-2 mb-4">
                                <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 2, repeat: Infinity }}
                                    className="w-9 h-9 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center text-white shadow-md"><BookOpen size={18} /></motion.div>
                                <h4 className="text-[20px] font-black text-white" style={serif}>熱門觀庭筆記</h4>
                            </div>
                            {hotNotes.length === 0 ? (
                                <p className="text-white/50 text-center py-6 text-[14px] font-bold">目前尚無熱門觀庭筆記</p>
                            ) : hotNotes.map((n, i) => (
                                <Link key={i} href={n.sessionPageId ? `/sessions/${n.sessionPageId}#${n.lineId}` : '/sessions'} className="block">
                                    <motion.div whileHover={{ x: 4, backgroundColor: 'rgba(255,255,255,0.05)' }}
                                        className="flex items-start gap-3 py-3 border-b border-white/5 last:border-0 cursor-pointer group rounded-lg px-2 transition-colors">
                                        <span className={`text-[28px] font-black w-8 shrink-0 ${i === 0 ? 'text-orange-400' : i === 1 ? 'text-gray-400' : 'text-amber-700'}`} style={serif}>{i + 1}</span>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[16px] font-bold text-white/90 truncate group-hover:text-orange-300 transition-colors">{n.content.substring(0, 30)}...</p>
                                            <div className="flex gap-3 mt-1 text-[14px]">
                                                <span className="text-gray-500 font-bold">{n.sessionName}</span>
                                                <span className="text-red-400 flex items-center gap-1"><Heart size={13} fill="currentColor" />{n.likeCount}</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                </Link>
                            ))}
                        </motion.div>
                    </FadeIn>
                    <FadeIn delay={0.12}>
                        <motion.div whileHover={{ y: -4 }} className="bg-white/[0.06] backdrop-blur rounded-2xl p-5 border border-white/10 hover:border-purple-500/30 transition-all hover:shadow-[0_8px_30px_rgba(139,92,246,0.1)]">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-9 h-9 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center text-white shadow-md"><MessageSquare size={18} /></div>
                                <h4 className="text-[20px] font-black text-white" style={serif}>熱門專業留言</h4>
                            </div>
                            {hotComments.length === 0 ? (
                                <p className="text-white/50 text-center py-6 text-[14px] font-bold">目前尚無專業留言</p>
                            ) : hotComments.map((c, i) => {
                                const s = sessions.find(sess => sess.id === c.targetSessionId);
                                const commentHref = s ? `/sessions/${s.id}${c.targetLineId ? `#${c.targetLineId}` : ''}` : '/sessions';
                                return (
                                    <Link key={i} href={commentHref} className="block mb-3 last:mb-0">
                                        <motion.div whileHover={{ scale: 1.02 }}
                                            className="p-3 rounded-xl bg-white/[0.04] border border-white/5 hover:border-purple-500/20 transition-all cursor-pointer">
                                            <div className="flex flex-wrap items-center gap-2 mb-2">
                                                <div className="w-7 h-7 bg-gradient-to-br from-violet-400 to-purple-500 rounded-lg flex items-center justify-center text-white text-[12px] font-black">{c.author.slice(-1)}</div>
                                                <span className="text-[14px] font-bold text-white/70">{c.author}</span>
                                                <span className="text-[12px] font-bold text-purple-300 bg-purple-500/15 px-2 py-0.5 rounded">{c.role}</span>
                                                {s && (
                                                    <span className="text-[12px] text-blue-300 bg-blue-500/15 px-2 py-0.5 rounded flex flex-wrap items-center gap-1">
                                                        <BookOpen size={10} /> {s.sessionId}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-[14px] text-gray-400 leading-relaxed line-clamp-2">{c.content}</p>
                                            <p className="text-red-400 text-[14px] font-bold flex items-center gap-1 mt-2"><Heart size={13} fill="currentColor" />{c.likes}</p>
                                        </motion.div>
                                    </Link>
                                )
                            })}
                        </motion.div>
                    </FadeIn>
                    <FadeIn delay={0.24}>
                        <motion.div whileHover={{ y: -4 }} className="bg-white/[0.06] backdrop-blur rounded-2xl p-5 border border-white/10 hover:border-emerald-500/30 transition-all hover:shadow-[0_8px_30px_rgba(16,185,129,0.1)]">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center text-white shadow-md"><FileText size={18} /></div>
                                <h4 className="text-[20px] font-black text-white" style={serif}>熱門投稿文章</h4>
                            </div>
                            {hotArticles.length === 0 ? (
                                <p className="text-white/50 text-center py-6 text-[14px] font-bold">目前尚無投稿文章</p>
                            ) : hotArticles.map((a, i) => {
                                const s = sessions.find(sess => sess.id === a.targetSessionId);
                                return (
                                    <Link key={i} href={`/forum#${a.id}`} className="block mb-3 last:mb-0">
                                        <motion.div whileHover={{ scale: 1.02 }}
                                            className="p-3 rounded-xl bg-white/[0.04] border border-white/5 hover:border-emerald-500/20 transition-all cursor-pointer">
                                            <div className="flex flex-wrap items-center gap-2 mb-2">
                                                <span className="text-[12px] font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">{a.category}</span>
                                                {a.targetTopic && (
                                                    <span className="text-[12px] font-black text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded">#{a.targetTopic}</span>
                                                )}
                                                {s && (
                                                    <span className="text-[12px] text-blue-300 bg-blue-500/15 px-2 py-0.5 rounded flex items-center gap-1">
                                                        <BookOpen size={10} /> {s.sessionId}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-[16px] font-bold text-white/90 mt-2 hover:text-emerald-300 transition-colors">{a.title}</p>
                                            <div className="flex justify-between mt-2 text-[14px]">
                                                <span className="text-gray-500 font-bold">{a.author}</span>
                                                <span className="text-red-400 flex items-center gap-1"><Heart size={13} fill="currentColor" />{a.likes}</span>
                                            </div>
                                        </motion.div>
                                    </Link>
                                )
                            })}
                        </motion.div>
                    </FadeIn>
                </div>
            </section>

            {/* ═══ 解決什麼問題 ═══ */}
            <Banner title="我們要解決什麼問題？" subtitle="Problems We Solve" bg="bg-[#E8D5B8]" text="text-[#8B4D35]" />
            <section className="max-w-7xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
                    {/* 背景連動線 */}
                    <div className="hidden md:block absolute top-[40%] left-[15%] right-[15%] h-[2px] bg-gradient-to-r from-[#7B8C4E] via-[#B8860B] to-[#C67B5C] opacity-30 z-0"></div>
                    <motion.div animate={{ scaleX: [0, 1] }} transition={{ duration: 2, repeat: Infinity }} className="hidden md:block absolute top-[40%] left-[15%] right-[15%] h-[2px] bg-gradient-to-r from-[#7B8C4E] via-[#B8860B] to-[#C67B5C] z-0 origin-left"></motion.div>

                    {[
                        { title: "資訊紛亂斷裂、門檻高", desc: "資訊紛亂、斷裂、專業壁壘、完整尋找門檻高", icon: <Layers size={24} className="text-blue-500" /> },
                        { title: "單一敘事與詮釋壟斷", desc: "有條件觀庭者僅少數、雙方敘述封閉於庭上、外界資訊均透過解讀詮釋、觀庭者掌握解釋權、論述各有切入點與立場影響、可獲得關注", icon: <Eye size={24} className="text-[#7B8C4E]" /> },
                        { title: "對立衝突與無法傾聽", desc: "各自論述對立、衝突、難以理解彼此、也不去聽對方的語言", icon: <MessageSquare size={24} className="text-[#C67B5C]" /> },
                    ].map((step, i) => (
                        <FadeIn key={i} delay={i * 0.1} className="relative z-10">
                            <motion.div whileHover={{ y: -5 }} className="bg-white/80 backdrop-blur p-6 rounded-3xl border border-[#E8E0D4] shadow-sm text-center h-full">
                                <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-4 border border-gray-100">{step.icon}</div>
                                <h4 className="text-[20px] font-black mb-3 text-gray-800" style={serif}>{step.title}</h4>
                                <p className="text-[15px] text-[#6B6358] font-bold leading-relaxed">{step.desc}</p>
                            </motion.div>
                        </FadeIn>
                    ))}
                </div>
            </section>

            {/* ═══ 工作流程 ═══ */}
            <Banner title="網站完整功能與操作方式" subtitle="Workflow & Features" bg="bg-[#E0DAF0]" text="text-[#4A3D7B]" />
            <section className="max-w-7xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {[
                        { title: "前期 — 本團隊工作", items: ["實際參與所有場次形成筆記", "蒐集觀庭多元筆記核對補缺", "蒐集彙整本案相關資料"], borderC: "border-l-blue-400", accent: "text-blue-400" },
                        { title: "呈現", items: ["觀庭現場還原筆記", "即時論述與評論投稿機制", "形成論述與探討、交流"], borderC: "border-l-[#7B8C4E]", accent: "text-[#7B8C4E]" },
                        { title: "最後", items: ["共構本事件之復原計畫和共識", "透過集體智慧建立新的準則與論述"], borderC: "border-l-[#C67B5C]", accent: "text-[#C67B5C]" },
                    ].map((step, i) => (
                        <FadeIn key={i} delay={i * 0.1}>
                            <motion.div whileHover={{ y: -4, boxShadow: '0 8px 25px rgba(0,0,0,0.08)' }}
                                className={`bg-white p-6 rounded-2xl border border-[#E8E0D4] border-l-4 ${step.borderC} shadow-sm transition-all h-full`}>
                                <h4 className="text-[24px] font-black mb-4" style={serif}>{step.title}</h4>
                                <ul className="space-y-3">
                                    {step.items.map((item, j) => (
                                        <li key={j} className="text-[17px] text-[#5A5347] font-medium flex items-start gap-2">
                                            <ChevronRight size={18} className={`${step.accent} mt-1 shrink-0`} />{item}
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        </FadeIn>
                    ))}
                </div>
            </section>

            {/* ═══ 計畫緣起 ═══ */}
            <Banner title="計畫緣起" subtitle="About This Project" bg="bg-[#F5E6D3]" text="text-[#7A5C3D]" />
            <section id="about" className="max-w-7xl mx-auto px-6 py-8">
                <FadeIn>
                    <div className="bg-white rounded-2xl p-6 md:p-10 border border-[#E8E0D4] shadow-sm">
                        <div className="space-y-6 text-[18px] md:text-[20px] text-[#5A5347] font-medium leading-[2.1]">
                            <p>{cms.Mission_Para_1 || '剴剴案已成為助人專業領域集體議題，對民眾及助人領域均產生各項影響。'}</p>
                            <p>{cms.Mission_Para_2 || '為了因應衝擊，目前有許多令人尊敬的助人者挺身而出，也引發了各種對話。這些對話並非對立，而是對事件與問題有不同見解的人們，商議朝不同的方向前進，倡議、發聲、行動，不論是替社工報不平、還是與民眾對話、向上抗爭等等，均是為了這個專業群體而努力。未有對錯，均為夥伴。'}</p>
                            <p>{cms.Mission_Para_3 || '我從114年12月11日起開始觀庭，並且加入民眾群組、社工群組、網絡社群，開始學習、觀察、諮詢與訪問，對各種對話與疑惑進行探討、歸因，尋求屬於我自己對事件的理解和問題認定。終於在115年2月26日訂下我對問題的理解，以及我想要去推動的解方。'}</p>

                            <blockquote className="border-l-[6px] border-[#C67B5C] pl-6 md:pl-8 py-4 my-10 bg-[#FDE8D8]/30 rounded-r-3xl" style={serif}>
                                <p className="text-[24px] md:text-[30px] font-black text-[#5A5347] mb-4 leading-relaxed tracking-wide">
                                    {cms.Mission_Quote || '對於我而言——「審判已然開始，審判也早已結束。」'}
                                </p>
                                <p className="text-[18px] font-bold text-[#7A5C3D]">
                                    {cms.Mission_Quote_Sub || '社會大眾與助人專業群體均是悲痛的、憤怒的、受傷的、挫敗的。不論判決結果如何，此間已然滿目瘡痍。'}
                                </p>
                            </blockquote>

                            <p>{cms.Mission_Para_4 || '因此我的出發點，並不想放在糾結對錯與真相上，因為不管對民眾而言還是助人群體而言，傷害與崩壞早已是事實。我想做的是從這個傷害中最務實、最深刻的去探究問題，探討如何修正、優化目前的工作困境，最終共構解方，避免再有人遭逢此難。剴剴、民眾、社工群體，不再遭逢此難。'}</p>
                            <p>{cms.Mission_Para_5 || '更白話來說，我接受傷害早已造成並成定局，討論對錯於事無補。我要做的是從斷垣殘壁中回收價值、吸取經驗，建立新的共識與準則，在哀鴻遍野中開始重建、復原，讓我們的同伴們、後輩們，不再如此。但若要這樣，就要去挖掘創傷，暫時放掉胸中悲痛與委屈，最真實的看待問題。'}</p>

                            <div className="bg-[#E3EED3]/50 p-8 md:p-10 rounded-[2rem] text-[#3D5220] font-black border border-[#C5D9A8] text-center shadow-sm my-10 text-[20px] md:text-[22px] leading-relaxed tracking-wider">
                                {cms.Mission_Highlight || '這是用饅頭（互助、團結）沾著已然流出的血淚，轉化為成長滋糧的殘酷歷程。'}
                            </div>

                            <p>{cms.Mission_Para_6 || '要做到這點，那就必須要先學習先備知識，再從現有資料及開庭歷程中，不經他人包裝詮釋，自己閱覽事情的始末，做出完整、獨立、多元觀點的判讀，才能走到下一步：尋求解方。'}</p>
                        </div>
                    </div>
                </FadeIn>
            </section>

            {/* ═══ 論壇精神 ═══ */}
            <Banner title="專業論壇與經驗交流" subtitle="Forum & Discussion" bg="bg-[#E3EED3]" text="text-[#3D5220]" />
            <section className="max-w-7xl mx-auto px-6 py-8">
                <FadeIn>
                    <div className="bg-white rounded-2xl p-8 border border-[#E8E0D4] shadow-sm">
                        <h3 className="text-[32px] font-black leading-tight mb-4" style={serif}>不造神・重文字<br />匿名化・去權威</h3>
                        <p className="text-[20px] text-[#6B6358] font-medium leading-[1.8] max-w-3xl mb-6">在這個演算法獎勵情緒、意見領袖壟斷話語權的時代，我們反其道而行。在這裡，不看職級、不分地域，只論專業論述與發言。</p>
                        <div className="flex flex-wrap gap-2">
                            {['經驗分享', '專業討論', '資料補充', '提問', '糾錯回報'].map(tag => (
                                <Link key={tag} href="/forum">
                                    <motion.span whileHover={{ scale: 1.08, y: -3 }} transition={{ type: 'spring', stiffness: 400 }}
                                        className="bg-[#E3EED3] text-[#3D5220] px-5 py-2.5 rounded-xl text-[16px] font-black border border-[#C5D9A8] hover:bg-[#7B8C4E] hover:text-white hover:border-[#7B8C4E] transition-colors cursor-pointer shadow-sm hover:shadow-md inline-block">{tag}</motion.span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </FadeIn>
            </section>

            {/* ═══ 匿名聯絡 ═══ */}
            <Banner title="匿名聯絡與資料提供" subtitle="Anonymous Contact" bg="bg-[#FDE8D8]" text="text-[#8B4D35]" />
            <section className="max-w-7xl mx-auto px-6 py-6">
                <FadeIn>
                    <div className="bg-white rounded-2xl p-6 md:p-8 border border-[#E8E0D4] shadow-sm flex flex-col md:flex-row items-center gap-6">
                        <motion.div animate={{ y: [0, -4, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                            className="w-16 h-16 shrink-0 bg-[#FDE8D8] text-[#C67B5C] rounded-2xl flex items-center justify-center shadow-sm"><Send size={32} /></motion.div>
                        <div>
                            <h4 className="text-[26px] font-black" style={serif}>安全匿名的向我們傳遞訊息</h4>
                            <p className="text-[18px] text-[#6B6358] font-medium leading-relaxed mt-2">無論是逐字稿投稿、資料補充、意見回饋或糾錯回報，您都可以匿名透過此管道向團隊傳達。</p>
                        </div>
                        <Link href="/contact">
                            <motion.button whileHover={{ scale: 1.05, boxShadow: '0 12px 30px rgba(198,123,92,0.25)' }} whileTap={{ scale: 0.97 }}
                                className="bg-gradient-to-r from-[#C67B5C] to-[#a8634a] text-white px-8 py-4 rounded-2xl text-[20px] font-black shrink-0 shadow-lg transition-all">開始傳送 →</motion.button>
                        </Link>
                    </div>
                </FadeIn>
            </section>

            {/* ═══ 倫理規範 ═══ */}
            <Banner title="倫理規範與發言守則" subtitle="Ethics & Guidelines" bg="bg-[#F5E0E0]" text="text-[#8B3535]" />
            <section className="max-w-7xl mx-auto px-6 py-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                        { icon: <ShieldAlert size={26} />, title: "嚴格去識別化", desc: "徹底移除隱私資訊。禁止揭露真實姓名、居住地或非公開案情細節。", bg: "bg-red-50", accent: "text-red-500", border: "border-red-100" },
                        { icon: <Scale size={26} />, title: "聚焦職務非個人", desc: "針對「專業判斷」與「機構制度」進行討論。嚴禁人身攻擊。", bg: "bg-emerald-50", accent: "text-[#7B8C4E]", border: "border-emerald-100" },
                        { icon: <Shield size={26} />, title: "遵守法律基礎", desc: "遵守法規與公共秩序。不得發表違法資訊或煽動仇恨言論。", bg: "bg-gray-50", accent: "text-gray-600", border: "border-gray-200" },
                    ].map((r, i) => (
                        <FadeIn key={i} delay={i * 0.08}>
                            <motion.div whileHover={{ y: -4 }} className={`${r.bg} p-6 rounded-2xl border ${r.border} transition-all`}>
                                <motion.div whileHover={{ rotate: 8 }} className={`w-12 h-12 rounded-xl ${r.accent} bg-white/80 flex items-center justify-center mb-3`}>{r.icon}</motion.div>
                                <h4 className="text-[22px] font-black mb-2" style={serif}>{r.title}</h4>
                                <p className="text-[17px] text-[#6B6358] font-medium leading-relaxed">{r.desc}</p>
                            </motion.div>
                        </FadeIn>
                    ))}
                </div>
            </section>

            {/* ═══ 團隊鳴謝 ═══ */}
            <Banner title="團隊介紹與特別鳴謝" subtitle="Acknowledgments" bg="bg-[#F5E6D3]" text="text-[#7A5C3D]" />
            <section className="max-w-7xl mx-auto px-6 py-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <FadeIn>
                        <motion.div whileHover={{ y: -3 }} className="bg-white p-6 rounded-2xl border border-[#E8E0D4] hover:shadow-md transition-all">
                            <div className="w-12 h-12 bg-[#F5E6D3] text-[#B8860B] rounded-xl flex items-center justify-center mb-3"><Users size={24} /></div>
                            <h4 className="text-[24px] font-black mb-3" style={serif}>團隊介紹與聲明</h4>
                            <p className="text-[18px] text-[#5A5347] font-medium leading-[1.8]">本團隊成員皆為現職社工、心理、輔導等實務工作者，利用公餘時間維護平台。若更新與除錯進度較緩，尚請海涵見諒。</p>
                        </motion.div>
                    </FadeIn>
                    <FadeIn delay={0.1}>
                        <motion.div whileHover={{ y: -3 }} className="bg-white p-6 rounded-2xl border border-[#E8E0D4] hover:shadow-md transition-all">
                            <div className="w-12 h-12 bg-[#F5E6D3] text-[#B8860B] rounded-xl flex items-center justify-center mb-3"><HeartHandshake size={24} /></div>
                            <h4 className="text-[24px] font-black mb-3" style={serif}>感謝民眾線上社群支持</h4>
                            <div className="flex flex-wrap gap-2 mb-3">
                                {['孩想陪你長大聯盟', '兒虐零容忍', '孩想陪你長大', '鵝保社工團隊'].map((t, i) => (
                                    <motion.span key={t} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                                        transition={{ delay: 0.3 + i * 0.1 }}
                                        className="bg-[#F5E6D3] text-[#7A5C3D] px-4 py-2 rounded-xl text-[15px] font-black border border-[#E8D5B8] shadow-sm">✨ {t}</motion.span>
                                ))}
                            </div>
                            <p className="text-[18px] text-[#5A5347] font-medium leading-[1.8]">感謝以上等社群之熱心民眾、專業人員提供各項資料及建議，協力共構本筆記。</p>
                        </motion.div>
                    </FadeIn>
                </div>
            </section>

            {/* ═══ Footer ═══ */}
            <footer className="bg-[#2D2A26] mt-4 pt-10 pb-6 px-6 text-white">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-8">
                    <div>
                        <p className="text-[22px] font-black" style={serif}>法庭實況還原與專業共構筆記</p>
                        <p className="text-[12px] text-[#8A8078] mt-1 font-bold tracking-widest">SOCIAL WORK COURT NOTES</p>
                        <p className="text-[16px] text-[#8A8078] mt-3 max-w-md">本團隊由助人專業與民眾共同組成，利用公餘時間維護平台。</p>
                    </div>
                    <div className="grid grid-cols-2 gap-8 text-[16px]">
                        <div>
                            <h5 className="text-[12px] font-black text-[#8A8078] uppercase tracking-widest mb-3">導覽</h5>
                            <ul className="space-y-2 font-bold text-[#A09888]">
                                {[
                                    { name: '計畫緣起', href: '#mission' },
                                    { name: '先備知識', href: '#knowledge' },
                                    { name: '還原筆記', href: '/sessions' },
                                    { name: '熱門排行', href: '#trending' },
                                    { name: '論壇', href: '/forum' },
                                ].map(x => <li key={x.name}><Link href={x.href} className="hover:text-[#B8D468] transition-colors">{x.name}</Link></li>)}
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
                    <p className="text-[13px] text-[#6B6358] font-bold">© 2026 社工實務觀庭共構小組 ｜ 系統籌備建置中</p>
                </div>
            </footer>
        </div>
    );
}
