'use client';
import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import {
    PenTool, Scale, ShieldAlert, BookOpen, Heart, TrendingUp,
    MessageSquare, ChevronRight, Lock, Eye, ThumbsUp, Flame,
    Gavel, Clock, ArrowRight, ArrowUpRight, Star,
    ExternalLink, BookMarked, Layers, Flag,
    Menu, X, Users, HeartHandshake, Sparkles,
    Send, FileText, MessageCircle, Shield, Zap
} from 'lucide-react';

/* ════════════════════════════════════════
   工具：動態計數器
   ════════════════════════════════════════ */
function AnimatedCounter({ target, duration = 2 }: { target: number; duration?: number }) {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLSpanElement>(null);
    const [started, setStarted] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting && !started) setStarted(true); },
            { threshold: 0.5 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [started]);

    useEffect(() => {
        if (!started) return;
        const steps = 60;
        const increment = target / steps;
        let current = 0;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) { setCount(target); clearInterval(timer); }
            else setCount(Math.floor(current));
        }, (duration * 1000) / steps);
        return () => clearInterval(timer);
    }, [started, target, duration]);

    return <span ref={ref}>{count.toLocaleString()}</span>;
}

/* ════════════════════════════════════════
   工具：Fade-in 動畫
   ════════════════════════════════════════ */
const FadeIn = ({ children, delay = 0, className = '', direction = 'up' }: {
    children: React.ReactNode; delay?: number; className?: string; direction?: 'up' | 'left' | 'right';
}) => {
    const initial = direction === 'up' ? { opacity: 0, y: 30 } : direction === 'left' ? { opacity: 0, x: -30 } : { opacity: 0, x: 30 };
    const animate = { opacity: 1, y: 0, x: 0 };
    return (
        <motion.div initial={initial} whileInView={animate} viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }} className={className}>
            {children}
        </motion.div>
    );
};

/* ════════════════════════════════════════
   工具：漸層動態背景
   ════════════════════════════════════════ */
function AnimatedGradientBg() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%]"
                animate={{ rotate: 360 }} transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
                style={{
                    background: 'conic-gradient(from 0deg at 50% 50%, rgba(107,142,35,0.08) 0deg, rgba(59,130,246,0.06) 90deg, rgba(236,72,153,0.05) 180deg, rgba(168,85,247,0.06) 270deg, rgba(107,142,35,0.08) 360deg)',
                }}
            />
            <div className="absolute top-20 right-20 w-72 h-72 bg-blue-200/20 rounded-full blur-[100px]" />
            <div className="absolute bottom-20 left-20 w-96 h-96 bg-emerald-200/15 rounded-full blur-[120px]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#E8F5E9]/20 rounded-full blur-[100px]" />
        </div>
    );
}

/* ════════════════════════════════════════
   工具：打字機效果
   ════════════════════════════════════════ */
function TypeWriter({ texts, speed = 60 }: { texts: string[]; speed?: number }) {
    const [textIndex, setTextIndex] = useState(0);
    const [charIndex, setCharIndex] = useState(0);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        const current = texts[textIndex];
        const timeout = setTimeout(() => {
            if (!deleting) {
                if (charIndex < current.length) setCharIndex(c => c + 1);
                else setTimeout(() => setDeleting(true), 2000);
            } else {
                if (charIndex > 0) setCharIndex(c => c - 1);
                else { setDeleting(false); setTextIndex(i => (i + 1) % texts.length); }
            }
        }, deleting ? speed / 2 : speed);
        return () => clearTimeout(timeout);
    }, [charIndex, deleting, textIndex, texts, speed]);

    return (
        <span>
            {texts[textIndex].substring(0, charIndex)}
            <motion.span animate={{ opacity: [1, 0] }} transition={{ duration: 0.5, repeat: Infinity }}>|</motion.span>
        </span>
    );
}

/* ════════════════════════════════════════
   主頁面
   ════════════════════════════════════════ */
export default function Demo2Page() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const { scrollYProgress } = useScroll();
    const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
    const heroScale = useTransform(scrollYProgress, [0, 0.15], [1, 0.95]);

    useEffect(() => {
        const h = () => setScrolled(window.scrollY > 40);
        window.addEventListener('scroll', h);
        return () => window.removeEventListener('scroll', h);
    }, []);

    const navLinks = [
        { name: '計畫緣起', href: '#mission' },
        { name: '先備知識', href: '#knowledge' },
        { name: '還原筆記', href: '#notes' },
        { name: '熱門排行', href: '#trending' },
        { name: '論壇', href: '#forum' },
    ];

    /* ─── 假資料：熱門列表 ─── */
    const hotNotes = [
        { rank: 1, title: '檢察官論告——為何聚焦「未依規定訪視」？', likes: 387, views: 2841, session: '第六場次', isHot: true },
        { rank: 2, title: '辯護律師陳述——制度性缺失不應由個人承擔', likes: 342, views: 2103, session: '第六場次', isHot: true },
        { rank: 3, title: '合議庭詰問社工督導——知情不報的灰色地帶', likes: 298, views: 1854, session: '第五場次', isHot: false },
    ];
    const hotComments = [
        { author: '匿名社工A', content: '身為兒保社工五年，這段論告讓我心涼——我們每天做的就是在資源不足下做「最不壞的選擇」...', likes: 156, role: '兒少保護' },
        { author: '匿名社工B', content: '制度面的問題不解決，換誰來做都會出事。辯護律師講到點上了。', likes: 134, role: '安置機構' },
        { author: '匿名心理師', content: '從心理師角度看，這段詰問反映了跨專業溝通的斷裂——社工與心理師之間的語言不同...', likes: 112, role: '諮商心理' },
    ];
    const hotArticles = [
        { title: '從剴剴案看台灣兒少保護體系的結構性困境', author: '跨域共構小組', likes: 231, tag: '專題分析' },
        { title: '社工訪視頻率與風險評估——實務與法規的落差', author: '匿名資深社工', likes: 189, tag: '實務論述' },
        { title: '收出養媒合制度：北中南差異有多大？', author: '匿名社工C', likes: 167, tag: '經驗分享' },
    ];

    return (
        <div className="min-h-screen bg-[#f8faf5] text-gray-800 overflow-x-hidden" style={{ fontFamily: "'Noto Sans TC', 'Inter', system-ui, sans-serif" }}>
            {/* ─── 頂部進度條 ─── */}
            <motion.div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#6B8E23] via-emerald-400 to-blue-400 z-[100] origin-left" style={{ scaleX: scrollYProgress }} />

            {/* ─── Beta Banner ─── */}
            <div className="relative z-50 bg-gradient-to-r from-[#5a781d] via-[#6B8E23] to-[#7da32e] text-white text-xs font-bold text-center py-2.5 tracking-widest shadow-lg">
                <span className="inline-block animate-pulse mr-2 text-yellow-300">●</span>
                目前為 Beta 前導測試版，系統建置與數據對接中
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImEiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+PHBhdGggZD0iTTAgMGg2MHY2MEgweiIgZmlsbD0ibm9uZSIvPjxjaXJjbGUgY3g9IjMwIiBjeT0iMzAiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3QgZmlsbD0idXJsKCNhKSIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIvPjwvc3ZnPg==')] opacity-30" />
            </div>

            {/* ─── Navbar ─── */}
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                className={`sticky top-0 z-40 transition-all duration-500 px-6 lg:px-10 py-3 flex justify-between items-center ${scrolled
                    ? 'bg-white/80 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.08)] border-b border-white/50'
                    : 'bg-white/60 backdrop-blur-md'
                    }`}
            >
                <div className="flex items-center gap-3">
                    <motion.div whileHover={{ rotate: 12 }} className="bg-gradient-to-br from-[#6B8E23] to-emerald-600 p-2.5 rounded-2xl text-white shadow-lg">
                        <PenTool size={22} />
                    </motion.div>
                    <div>
                        <h1 className="text-lg lg:text-xl font-black text-gray-900 tracking-tight leading-none">法庭實況還原與專業共構筆記</h1>
                        <p className="text-[10px] text-gray-400 font-bold tracking-[0.15em] mt-0.5">SOCIAL WORK COURT NOTES</p>
                    </div>
                </div>
                <div className="hidden lg:flex items-center gap-1.5">
                    {navLinks.map((link, i) => (
                        <motion.a key={link.name} href={link.href} whileHover={{ y: -2 }}
                            className="relative px-5 py-2.5 rounded-xl text-sm font-bold text-gray-500 hover:text-[#6B8E23] transition-colors group">
                            {link.name}
                            <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-[#6B8E23] rounded-full group-hover:w-6 transition-all duration-300" />
                        </motion.a>
                    ))}
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                        className="ml-3 bg-gradient-to-r from-[#6B8E23] to-emerald-600 text-white px-6 py-2.5 rounded-xl text-sm font-black shadow-lg shadow-emerald-200/50">
                        我要投稿 ✍️
                    </motion.button>
                </div>
                <button className="lg:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
                    {menuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </motion.nav>

            {/* ─── Hero Section ─── */}
            <motion.section style={{ opacity: heroOpacity, scale: heroScale }}
                className="relative min-h-[90vh] flex items-center justify-center px-4 overflow-hidden">
                <AnimatedGradientBg />

                <div className="max-w-5xl mx-auto text-center relative z-10 space-y-8">
                    <FadeIn>
                        <motion.div whileHover={{ scale: 1.05 }}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-white/70 backdrop-blur-md text-[#6B8E23] rounded-full text-sm font-black tracking-widest border border-[#6B8E23]/15 shadow-lg shadow-emerald-100/50">
                            <Gavel size={16} className="animate-bounce" /> 社會工作與法律的實務共構
                        </motion.div>
                    </FadeIn>

                    <FadeIn delay={0.15}>
                        <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 leading-[1.2] tracking-tight">
                            法庭實況還原
                            <br />
                            <span className="relative inline-block">
                                <span className="bg-gradient-to-r from-[#6B8E23] via-emerald-600 to-teal-600 bg-clip-text text-transparent">專業共構筆記</span>
                                <motion.svg className="absolute -bottom-4 left-0 w-full" height="16" viewBox="0 0 200 16" preserveAspectRatio="none"
                                    initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} transition={{ duration: 1.5, delay: 0.8 }}>
                                    <motion.path d="M4 12 Q 50 2 100 10 Q 150 18 196 8" stroke="url(#grad)" strokeWidth="6" strokeLinecap="round" fill="transparent"
                                        initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} transition={{ duration: 1.5, delay: 0.8 }} />
                                    <defs><linearGradient id="grad"><stop offset="0%" stopColor="#E8F5E9" /><stop offset="100%" stopColor="#C8E6C9" /></linearGradient></defs>
                                </motion.svg>
                            </span>
                            <span className="text-3xl md:text-4xl text-gray-400 font-bold block mt-4">計畫</span>
                        </h2>
                    </FadeIn>

                    <FadeIn delay={0.3} className="text-lg md:text-xl text-gray-500 font-medium leading-[2] max-w-3xl mx-auto">
                        <p className="mb-2">這不只是一份開庭紀錄，而是一場<strong className="text-gray-700">化血淚為滋養</strong>的集體療癒與重建。</p>
                        <p>我們邀請您暫放悲痛，以專業視角重返現場——<br className="hidden md:block" />
                            <span className="text-[#6B8E23] font-bold">
                                <TypeWriter texts={['讓同伴與後輩不再孤單', '唯有直視真實，才能共構解方', '用專業視角為社工實務留下註腳']} speed={80} />
                            </span>
                        </p>
                    </FadeIn>

                    <FadeIn delay={0.45} className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                        <motion.button whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(107,142,35,0.35)' }} whileTap={{ scale: 0.97 }}
                            className="group bg-gradient-to-r from-[#6B8E23] to-emerald-600 text-white px-12 py-6 rounded-2xl font-black text-xl shadow-[0_10px_30px_rgba(107,142,35,0.3)] transition-all relative overflow-hidden">
                            <span className="relative z-10 flex items-center justify-center gap-3">
                                點我看現場還原！
                                <ArrowRight size={22} className="group-hover:translate-x-2 transition-transform" />
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </motion.button>
                    </FadeIn>

                    {/* Hero 統計數字 */}
                    <FadeIn delay={0.6} className="grid grid-cols-3 gap-8 max-w-lg mx-auto pt-8">
                        {[
                            { num: 10, label: '場開庭紀錄', suffix: '' },
                            { num: 6, label: '場已還原', suffix: '' },
                            { num: 1247, label: '則專業留言', suffix: '+' },
                        ].map((stat, i) => (
                            <div key={i} className="text-center">
                                <p className="text-3xl md:text-4xl font-black text-[#6B8E23]">
                                    <AnimatedCounter target={stat.num} />{stat.suffix}
                                </p>
                                <p className="text-xs text-gray-400 font-bold mt-1">{stat.label}</p>
                            </div>
                        ))}
                    </FadeIn>
                </div>

                {/* Hero 底部波浪 */}
                <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
                        <path d="M0 50L48 45C96 40 192 30 288 35C384 40 480 60 576 65C672 70 768 60 864 50C960 40 1056 30 1152 35C1248 40 1344 60 1392 70L1440 80V100H0V50Z" fill="#f8faf5" />
                    </svg>
                </div>
            </motion.section>

            {/* ─── 這個平台在做什麼 ─── */}
            <section className="max-w-6xl mx-auto px-4 py-20" id="mission">
                <FadeIn className="text-center mb-16">
                    <span className="text-sm font-black tracking-[0.4em] text-[#6B8E23]/60 uppercase">What We Do</span>
                    <h3 className="text-4xl md:text-5xl font-black text-gray-900 mt-3">這個平台在做什麼？</h3>
                    <p className="text-lg text-gray-400 font-medium mt-4">四個核心功能，一個共同目標</p>
                </FadeIn>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { icon: <BookMarked size={32} />, label: "整合資訊", desc: "打破壁壘，降低門檻", color: "from-blue-500 to-indigo-600", bg: "bg-blue-50", border: "border-blue-100" },
                        { icon: <Gavel size={32} />, label: "觀庭還原", desc: "身歷其境，完整還原", color: "from-[#6B8E23] to-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100" },
                        { icon: <MessageCircle size={32} />, label: "專業評述", desc: "匿名交流，平等詮釋", color: "from-purple-500 to-violet-600", bg: "bg-purple-50", border: "border-purple-100" },
                        { icon: <Sparkles size={32} />, label: "共構解方", desc: "集體智慧，復原重建", color: "from-amber-500 to-orange-600", bg: "bg-amber-50", border: "border-amber-100" },
                    ].map((item, i) => (
                        <FadeIn key={i} delay={i * 0.12}>
                            <motion.div whileHover={{ y: -8, scale: 1.02 }} transition={{ type: 'spring', stiffness: 300 }}
                                className={`${item.bg} p-8 rounded-[2rem] border ${item.border} shadow-sm hover:shadow-2xl transition-all cursor-pointer group relative overflow-hidden`}>
                                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${item.color} opacity-5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:opacity-10 transition-opacity`} />
                                <div className={`w-16 h-16 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                                    {item.icon}
                                </div>
                                <p className="text-2xl font-black text-gray-900 mb-2">{item.label}</p>
                                <p className="text-sm font-bold text-gray-400">{item.desc}</p>
                            </motion.div>
                        </FadeIn>
                    ))}
                </div>
            </section>

            {/* ─── 🔥 熱門排行榜 ─── */}
            <section className="py-20 relative" id="trending">
                <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-900 to-[#1a1f2e]" />
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImEiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+PHBhdGggZD0iTTAgMGg2MHY2MEgweiIgZmlsbD0ibm9uZSIvPjxjaXJjbGUgY3g9IjMwIiBjeT0iMzAiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IGZpbGw9InVybCgjYSkiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiLz48L3N2Zz4=')] opacity-50" />

                <div className="max-w-6xl mx-auto px-4 relative z-10">
                    <FadeIn className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-5 py-2 bg-orange-500/10 text-orange-400 rounded-full text-sm font-black tracking-widest border border-orange-500/20 mb-4">
                            <Flame size={16} className="animate-pulse" /> 即時熱門
                        </div>
                        <h3 className="text-4xl md:text-5xl font-black text-white">熱門排行榜</h3>
                        <p className="text-gray-500 font-medium mt-3">由社群按讚驅動・即時更新</p>
                    </FadeIn>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* 熱門觀庭筆記 */}
                        <FadeIn>
                            <div className="bg-white/5 backdrop-blur-xl rounded-[2rem] p-6 border border-white/10 shadow-2xl">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center text-white"><BookOpen size={20} /></div>
                                    <h4 className="text-lg font-black text-white">🔥 熱門觀庭筆記</h4>
                                </div>
                                <div className="space-y-4">
                                    {hotNotes.map((note, i) => (
                                        <motion.div key={i} whileHover={{ x: 4 }}
                                            className="group flex items-start gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer">
                                            <span className={`text-2xl font-black shrink-0 w-8 ${i === 0 ? 'text-orange-400' : i === 1 ? 'text-gray-400' : 'text-amber-700'}`}>
                                                {note.rank}
                                            </span>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-bold text-white/90 truncate group-hover:text-[#a5d63a] transition-colors">{note.title}</p>
                                                <div className="flex items-center gap-3 mt-1.5">
                                                    <span className="text-xs text-gray-500 font-bold">{note.session}</span>
                                                    <span className="text-xs text-red-400 flex items-center gap-1"><Heart size={12} fill="currentColor" />{note.likes}</span>
                                                    <span className="text-xs text-gray-500 flex items-center gap-1"><Eye size={12} />{note.views}</span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </FadeIn>

                        {/* 熱門留言 */}
                        <FadeIn delay={0.15}>
                            <div className="bg-white/5 backdrop-blur-xl rounded-[2rem] p-6 border border-white/10 shadow-2xl">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center text-white"><MessageSquare size={20} /></div>
                                    <h4 className="text-lg font-black text-white">💬 熱門專業留言</h4>
                                </div>
                                <div className="space-y-4">
                                    {hotComments.map((c, i) => (
                                        <motion.div key={i} whileHover={{ x: 4 }}
                                            className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-purple-500/30 transition-all cursor-pointer group">
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="w-7 h-7 bg-gradient-to-br from-violet-400 to-purple-500 rounded-lg flex items-center justify-center text-white text-xs font-black">
                                                    {c.author.charAt(c.author.length - 1)}
                                                </div>
                                                <span className="text-xs font-bold text-white/70">{c.author}</span>
                                                <span className="text-[10px] font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-md">{c.role}</span>
                                            </div>
                                            <p className="text-xs text-gray-400 leading-relaxed line-clamp-2 group-hover:text-gray-300 transition-colors">{c.content}</p>
                                            <div className="flex items-center gap-1 mt-2 text-red-400">
                                                <Heart size={12} fill="currentColor" /><span className="text-xs font-bold">{c.likes}</span>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </FadeIn>

                        {/* 熱門文章 */}
                        <FadeIn delay={0.3}>
                            <div className="bg-white/5 backdrop-blur-xl rounded-[2rem] p-6 border border-white/10 shadow-2xl">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center text-white"><FileText size={20} /></div>
                                    <h4 className="text-lg font-black text-white">📰 熱門投稿文章</h4>
                                </div>
                                <div className="space-y-4">
                                    {hotArticles.map((a, i) => (
                                        <motion.div key={i} whileHover={{ x: 4 }}
                                            className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-emerald-500/30 transition-all cursor-pointer group">
                                            <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md">{a.tag}</span>
                                            <p className="text-sm font-bold text-white/90 mt-2 group-hover:text-emerald-300 transition-colors">{a.title}</p>
                                            <div className="flex items-center justify-between mt-3">
                                                <span className="text-xs text-gray-500 font-bold">{a.author}</span>
                                                <span className="text-xs text-red-400 flex items-center gap-1"><Heart size={12} fill="currentColor" />{a.likes}</span>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </FadeIn>
                    </div>
                </div>
            </section>

            {/* ─── 論壇精神 ─── */}
            <section className="py-20 px-4" id="forum">
                <div className="max-w-5xl mx-auto">
                    <FadeIn>
                        <div className="relative bg-gradient-to-br from-emerald-50 via-white to-blue-50 rounded-[3rem] p-10 md:p-16 border border-emerald-100/50 shadow-xl overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#6B8E23]/10 to-transparent rounded-full -translate-y-1/3 translate-x-1/3" />
                            <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-blue-200/20 to-transparent rounded-full translate-y-1/3 -translate-x-1/3" />
                            <div className="relative z-10 text-center md:text-left">
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#6B8E23]/10 text-[#6B8E23] rounded-full text-xs font-black tracking-widest mb-6">
                                    <MessageCircle size={14} /> 論壇精神
                                </div>
                                <h3 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight mb-6">
                                    不造神・重文字<br />匿名化・去權威
                                </h3>
                                <p className="text-lg text-gray-500 font-medium leading-[2] max-w-2xl mb-8">
                                    在這個演算法獎勵情緒、意見領袖壟斷話語權的時代，我們反其道而行。在這裡，不看職級、不分地域，只論專業論述與發言。
                                </p>
                                <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                                    {['經驗分享', '專業討論', '資料補充', '提問', '糾錯回報'].map((tag, i) => (
                                        <motion.span key={tag} whileHover={{ scale: 1.08, y: -2 }}
                                            className="bg-white/80 backdrop-blur-sm text-gray-700 px-5 py-2.5 rounded-xl text-sm font-black border border-gray-200/50 shadow-sm hover:shadow-md hover:border-[#6B8E23]/30 hover:text-[#6B8E23] transition-all cursor-pointer">
                                            {tag}
                                        </motion.span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </FadeIn>
                </div>
            </section>

            {/* ─── 倫理規範 ─── */}
            <section className="py-16 px-4 bg-gradient-to-b from-rose-50/50 to-[#f8faf5]">
                <div className="max-w-6xl mx-auto">
                    <FadeIn className="text-center mb-12">
                        <span className="text-sm font-black tracking-[0.3em] text-rose-400/80 uppercase">Ethics & Guidelines</span>
                        <h3 className="text-3xl md:text-4xl font-black text-gray-900 mt-3">倫理規範與發言守則</h3>
                    </FadeIn>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { icon: <ShieldAlert size={28} />, title: "嚴格去識別化", desc: "徹底移除隱私資訊，禁止揭露真實姓名、居住地或非公開案情細節。", color: "text-rose-500", bg: "bg-rose-50", border: "border-rose-100" },
                            { icon: <Scale size={28} />, title: "聚焦職務非個人", desc: "針對「專業判斷」與「機構制度」討論。嚴禁人身攻擊。", color: "text-[#6B8E23]", bg: "bg-emerald-50", border: "border-emerald-100" },
                            { icon: <Shield size={28} />, title: "遵守法律基礎", desc: "遵守法規與公共秩序。不得發表違法資訊或煽動仇恨。", color: "text-gray-600", bg: "bg-gray-50", border: "border-gray-200" },
                        ].map((rule, i) => (
                            <FadeIn key={i} delay={i * 0.12}>
                                <motion.div whileHover={{ y: -4 }}
                                    className={`${rule.bg} p-8 rounded-[2rem] border ${rule.border} shadow-sm hover:shadow-lg transition-all`}>
                                    <div className={`w-14 h-14 ${rule.bg} ${rule.color} rounded-2xl flex items-center justify-center mb-5 border ${rule.border}`}>
                                        {rule.icon}
                                    </div>
                                    <h4 className="text-xl font-black text-gray-900 mb-3">{rule.title}</h4>
                                    <p className="text-gray-500 font-medium leading-relaxed">{rule.desc}</p>
                                </motion.div>
                            </FadeIn>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── Footer ─── */}
            <footer className="relative bg-gray-950 pt-20 pb-8 px-4 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[1px] bg-gradient-to-r from-transparent via-[#6B8E23]/30 to-transparent" />

                <div className="max-w-6xl mx-auto relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
                        <div className="space-y-5">
                            <div className="flex items-center gap-3">
                                <div className="bg-gradient-to-br from-[#6B8E23] to-emerald-600 p-3 rounded-2xl text-white shadow-lg"><PenTool size={24} /></div>
                                <div>
                                    <p className="text-xl font-black text-white">法庭實況還原</p>
                                    <p className="text-[10px] text-gray-600 font-bold tracking-widest">SOCIAL WORK COURT NOTES</p>
                                </div>
                            </div>
                            <p className="text-sm text-gray-500 font-medium leading-relaxed">本團隊由助人專業與民眾共同組成，利用公餘時間維護平台。</p>
                            <div className="flex flex-wrap gap-2">
                                {['孩想陪你長大聯盟', '兒虐零容忍', '鵝保社工團隊'].map(tag => (
                                    <span key={tag} className="text-[10px] font-bold text-gray-500 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">{tag}</span>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-4">
                            <h5 className="text-xs font-black text-gray-500 uppercase tracking-widest">導覽</h5>
                            <ul className="space-y-3">
                                {['計畫緣起', '先備知識', '還原筆記', '熱門排行', '論壇', '倫理規範'].map(item => (
                                    <li key={item}><a className="text-sm text-gray-400 font-bold hover:text-[#6B8E23] transition-colors flex items-center gap-2 group"><ChevronRight size={14} className="text-gray-600 group-hover:text-[#6B8E23] transition-colors" />{item}</a></li>
                                ))}
                            </ul>
                        </div>
                        <div className="space-y-4">
                            <h5 className="text-xs font-black text-gray-500 uppercase tracking-widest">聯繫我們</h5>
                            <p className="text-sm text-gray-500 font-medium">匿名投稿・資料提供・意見回饋</p>
                            <motion.button whileHover={{ scale: 1.03 }}
                                className="w-full bg-gradient-to-r from-[#6B8E23]/20 to-emerald-600/20 text-[#a5d63a] px-6 py-4 rounded-xl font-black text-sm border border-[#6B8E23]/20 hover:border-[#6B8E23]/40 transition-all flex items-center justify-center gap-2">
                                <Send size={16} /> 匿名傳送訊息
                            </motion.button>
                        </div>
                    </div>
                    <div className="border-t border-white/5 pt-6 text-center">
                        <p className="text-xs text-gray-600 font-bold">© 2026 社工實務觀庭共構小組 ｜ 系統籌備建置中</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
