'use client';
import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import {
    PenTool, BookOpen, Heart, Eye,
    MessageSquare, ChevronRight, Flame,
    Gavel, Clock, ArrowRight,
    BookMarked, Layers, Flag,
    Menu, X, Users, HeartHandshake, Sparkles,
    Send, FileText, MessageCircle, Shield, Scale, ShieldAlert
} from 'lucide-react';

/* ══ Google Fonts ══ */
function FontLoader() {
    return (
        <>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;700;900&family=Noto+Serif+TC:wght@400;700;900&display=swap" rel="stylesheet" />
        </>
    );
}

/* ══ 動態計數器 ══ */
function Counter({ target, suffix = '' }: { target: number; suffix?: string }) {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLSpanElement>(null);
    const [started, setStarted] = useState(false);
    useEffect(() => {
        const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStarted(true); }, { threshold: 0.5 });
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, []);
    useEffect(() => {
        if (!started) return;
        let cur = 0; const inc = target / 50;
        const t = setInterval(() => { cur += inc; if (cur >= target) { setCount(target); clearInterval(t); } else setCount(Math.floor(cur)); }, 30);
        return () => clearInterval(t);
    }, [started, target]);
    return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

/* ══ 打字機效果 ══ */
function TypeWriter({ texts, speed = 70 }: { texts: string[]; speed?: number }) {
    const [ti, setTi] = useState(0);
    const [ci, setCi] = useState(0);
    const [del, setDel] = useState(false);
    useEffect(() => {
        const cur = texts[ti];
        const t = setTimeout(() => {
            if (!del) { if (ci < cur.length) setCi(c => c + 1); else setTimeout(() => setDel(true), 2200); }
            else { if (ci > 0) setCi(c => c - 1); else { setDel(false); setTi(i => (i + 1) % texts.length); } }
        }, del ? speed / 2 : speed);
        return () => clearTimeout(t);
    }, [ci, del, ti, texts, speed]);
    return <>{texts[ti].substring(0, ci)}<motion.span animate={{ opacity: [1, 0] }} transition={{ duration: 0.5, repeat: Infinity }} className="text-[#C67B5C]">|</motion.span></>;
}

/* ══ Fade-in ══ */
const FadeIn = ({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) => (
    <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-30px' }}
        transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }} className={className}>{children}</motion.div>
);

/* ══ 溫暖漸層背景動畫 ══ */
function WarmGradientBg() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%]"
                animate={{ rotate: 360 }} transition={{ duration: 80, repeat: Infinity, ease: 'linear' }}
                style={{ background: 'conic-gradient(from 0deg at 50% 50%, rgba(123,140,78,0.06) 0deg, rgba(198,123,92,0.05) 120deg, rgba(184,134,11,0.04) 240deg, rgba(123,140,78,0.06) 360deg)' }}
            />
            <div className="absolute top-10 right-20 w-56 h-56 bg-[#E3EED3]/30 rounded-full blur-[80px]" />
            <div className="absolute bottom-10 left-20 w-72 h-72 bg-[#F5E6D3]/30 rounded-full blur-[100px]" />
        </div>
    );
}

/* ══ 粉彩橫幅 ══ */
const Banner = ({ title, subtitle, bg, text }: { title: string; subtitle: string; bg: string; text: string }) => (
    <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
        className={`${bg} py-6 border-y border-black/5`}>
        <div className="max-w-7xl mx-auto px-6">
            <h3 className={`text-[28px] md:text-[36px] font-black ${text}`} style={{ fontFamily: "'Noto Serif TC', serif" }}>{title}</h3>
            <p className={`text-[13px] font-bold tracking-[0.25em] uppercase mt-1 opacity-60 ${text}`}>{subtitle}</p>
        </div>
    </motion.div>
);

/* ══════════════════════
   主頁面
   ══════════════════════ */
export default function Demo4Page() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const { scrollYProgress } = useScroll();

    useEffect(() => {
        const h = () => setScrolled(window.scrollY > 30);
        window.addEventListener('scroll', h); return () => window.removeEventListener('scroll', h);
    }, []);

    const navItems = [
        { icon: <BookOpen size={18} />, name: '計畫緣起' },
        { icon: <BookMarked size={18} />, name: '先備知識' },
        { icon: <Gavel size={18} />, name: '還原筆記' },
        { icon: <Flame size={18} />, name: '熱門排行' },
        { icon: <MessageCircle size={18} />, name: '論壇' },
        { icon: <Send size={18} />, name: '聯絡我們' },
    ];

    const hotNotes = [
        { rank: 1, title: '檢察官論告——為何聚焦「未依規定訪視」？', likes: 387, views: 2841, session: '第六場次' },
        { rank: 2, title: '辯護律師陳述——制度性缺失不應由個人承擔', likes: 342, views: 2103, session: '第六場次' },
        { rank: 3, title: '合議庭詰問社工督導——知情不報的灰色地帶', likes: 298, views: 1854, session: '第五場次' },
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

    const serif = { fontFamily: "'Noto Serif TC', serif" };

    return (
        <div className="min-h-screen overflow-x-hidden" style={{ fontFamily: "'Noto Sans TC', sans-serif", backgroundColor: '#FBF7F0', color: '#2D2A26', fontSize: '18px' }}>
            <FontLoader />

            {/* 滾動進度條 */}
            <motion.div className="fixed top-0 left-0 right-0 h-[3px] z-[100] origin-left"
                style={{ scaleX: scrollYProgress, background: 'linear-gradient(90deg, #7B8C4E, #B8860B, #C67B5C)' }} />

            {/* ═══ Beta Banner ═══ */}
            <div className="relative z-50 bg-gradient-to-r from-[#5a6e38] via-[#7B8C4E] to-[#8a9d58] text-white text-[15px] font-bold text-center py-2 tracking-wider shadow-sm">
                <motion.span animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 2, repeat: Infinity }} className="inline-block mr-2 text-yellow-200">●</motion.span>
                目前為 Beta 前導測試版，系統建置與數據對接中
            </div>

            {/* ═══ Navbar ═══ */}
            <motion.nav initial={{ y: -80 }} animate={{ y: 0 }} transition={{ duration: 0.5, ease: 'easeOut' }}
                className={`sticky top-0 z-40 transition-all duration-300 border-b ${scrolled ? 'bg-[#FBF7F0]/95 backdrop-blur-xl shadow-md border-[#E8E0D4]' : 'bg-[#FBF7F0] border-transparent'}`}>
                <div className="max-w-7xl mx-auto px-6 py-2 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <motion.div whileHover={{ rotate: 15, scale: 1.1 }} transition={{ type: 'spring', stiffness: 300 }}
                            className="bg-gradient-to-br from-[#7B8C4E] to-[#5a6e38] p-2.5 rounded-xl text-white shadow-md"><PenTool size={22} /></motion.div>
                        <div>
                            <h1 className="text-[20px] font-black leading-tight" style={serif}>法庭實況還原與專業共構筆記</h1>
                            <p className="text-[11px] text-[#A09888] font-bold tracking-[0.15em]">SOCIAL WORK COURT NOTES</p>
                        </div>
                    </div>
                    <div className="hidden lg:flex items-center gap-0.5">
                        {navItems.map(item => (
                            <motion.a key={item.name} href="#" whileHover={{ y: -2 }}
                                className="relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-[17px] font-bold text-[#5A5347] hover:text-[#7B8C4E] transition-colors group">
                                {item.icon}<span>{item.name}</span>
                                <motion.span className="absolute bottom-1 left-1/2 -translate-x-1/2 h-[2px] bg-[#7B8C4E] rounded-full w-0 group-hover:w-8 transition-all duration-300" />
                            </motion.a>
                        ))}
                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                            className="ml-3 bg-gradient-to-r from-[#7B8C4E] to-[#5a6e38] text-white px-6 py-2.5 rounded-xl text-[16px] font-black shadow-lg shadow-[#7B8C4E]/25 hover:shadow-[#7B8C4E]/40 transition-shadow">
                            我要投稿 ✍️
                        </motion.button>
                    </div>
                    <button className="lg:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={28} /> : <Menu size={28} />}</button>
                </div>
                <AnimatePresence>
                    {menuOpen && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                            className="lg:hidden bg-[#FBF7F0] border-t border-[#E8E0D4] overflow-hidden">
                            <div className="p-4 space-y-1">
                                {navItems.map(item => (
                                    <a key={item.name} href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-[20px] font-bold text-[#5A5347] hover:bg-[#7B8C4E]/10">{item.icon}{item.name}</a>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.nav>

            {/* ═══ Hero ═══ */}
            <section className="relative bg-gradient-to-b from-[#F5EFE4] to-[#FBF7F0] pt-10 pb-8 px-6 border-b border-[#E8E0D4] overflow-hidden">
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
                            法庭實況還原
                            <br />
                            <span className="relative inline-block text-[#7B8C4E]">
                                專業共構筆記
                                <motion.svg className="absolute -bottom-3 left-0 w-full" height="14" viewBox="0 0 200 14" preserveAspectRatio="none"
                                    initial={{ pathLength: 0, opacity: 0 }} whileInView={{ pathLength: 1, opacity: 1 }}
                                    transition={{ duration: 1.8, delay: 0.6, ease: 'easeOut' }}>
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
                            <motion.button whileHover={{ scale: 1.05, boxShadow: '0 16px 40px rgba(123,140,78,0.3)' }} whileTap={{ scale: 0.97 }}
                                className="group relative bg-gradient-to-r from-[#7B8C4E] to-[#5a6e38] text-white px-10 py-4 rounded-2xl text-[22px] font-black shadow-lg shadow-[#7B8C4E]/20 transition-all overflow-hidden">
                                <span className="relative z-10 flex items-center gap-3">點我看現場還原！ <ArrowRight size={22} className="group-hover:translate-x-2 transition-transform" /></span>
                                <motion.div className="absolute inset-0 bg-gradient-to-r from-[#5a6e38] to-[#4a5d2e] opacity-0 group-hover:opacity-100 transition-opacity" />
                            </motion.button>
                            <motion.a href="#" whileHover={{ y: -2 }}
                                className="px-8 py-4 rounded-2xl text-[20px] font-bold border-2 border-[#D4CCC0] text-[#6B6358] hover:border-[#7B8C4E] hover:text-[#7B8C4E] transition-all">計畫說明 ↓</motion.a>
                        </div>
                    </FadeIn>
                    <FadeIn delay={0.4}>
                        <div className="mt-6 flex gap-10 text-center">
                            {[{ n: 10, l: '場開庭紀錄' }, { n: 6, l: '場已還原' }, { n: 1247, l: '則專業留言', s: '+' }].map((s, i) => (
                                <div key={i}>
                                    <p className="text-[36px] font-black text-[#7B8C4E]" style={serif}><Counter target={s.n} suffix={s.s} /></p>
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
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        { icon: <BookMarked size={30} />, label: "整合資訊", desc: "打破壁壘，降低門檻", color: "bg-[#E3EED3]", accent: "text-[#5A6F35]", glow: "hover:shadow-[0_8px_30px_rgba(123,140,78,0.2)]" },
                        { icon: <Gavel size={30} />, label: "觀庭還原", desc: "身歷其境，完整還原", color: "bg-[#F5E6D3]", accent: "text-[#A0724E]", glow: "hover:shadow-[0_8px_30px_rgba(198,123,92,0.2)]" },
                        { icon: <MessageCircle size={30} />, label: "專業評述", desc: "匿名交流，平等詮釋", color: "bg-[#E0DAF0]", accent: "text-[#6B5CA5]", glow: "hover:shadow-[0_8px_30px_rgba(107,92,165,0.2)]" },
                        { icon: <Sparkles size={30} />, label: "共構解方", desc: "集體智慧，復原重建", color: "bg-[#FDE8D8]", accent: "text-[#C67B5C]", glow: "hover:shadow-[0_8px_30px_rgba(198,123,92,0.2)]" },
                    ].map((item, i) => (
                        <FadeIn key={i} delay={i * 0.08}>
                            <motion.div whileHover={{ y: -6, scale: 1.02 }} transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                                className={`${item.color} p-6 rounded-2xl border border-black/5 cursor-pointer group transition-shadow ${item.glow}`}>
                                <motion.div whileHover={{ rotate: 8, scale: 1.15 }} transition={{ type: 'spring', stiffness: 400 }}
                                    className={`w-14 h-14 rounded-xl ${item.accent} bg-white/60 flex items-center justify-center mb-3`}>{item.icon}</motion.div>
                                <p className="text-[24px] font-black" style={serif}>{item.label}</p>
                                <p className="text-[16px] font-bold text-[#8A8078] mt-1">{item.desc}</p>
                            </motion.div>
                        </FadeIn>
                    ))}
                </div>
            </section>

            {/* ═══ 最新還原 ═══ */}
            <Banner title="最新還原場次" subtitle="Latest Restoration" bg="bg-[#C67B5C]/15" text="text-[#8B4D35]" />
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
                            <h3 className="text-[28px] md:text-[32px] font-black leading-tight" style={serif}>
                                檢察官論告與辯護律師簡報與陳述還原
                            </h3>
                            <div className="mt-3 bg-[#FBF7F0] p-4 rounded-xl border border-[#E8E0D4]">
                                <p className="text-[18px] font-bold text-[#5A5347]">⚠️ 114年度訴字第51號 過失致死等案（一審審理庭第六場次）</p>
                                <p className="text-[16px] font-bold text-[#8A8078] mt-1 flex items-center gap-2">
                                    <motion.span animate={{ scale: [1, 1.4, 1] }} transition={{ duration: 1.5, repeat: Infinity }} className="w-2 h-2 rounded-full bg-[#7B8C4E] inline-block" />
                                    程序：言詞辯論、檢方論告與最後陳述
                                </p>
                            </div>
                        </div>
                        <motion.button whileHover={{ scale: 1.05, boxShadow: '0 16px 40px rgba(123,140,78,0.3)' }} whileTap={{ scale: 0.97 }}
                            className="bg-gradient-to-br from-[#7B8C4E] to-[#5a6e38] text-white px-8 py-5 rounded-2xl text-[22px] font-black shadow-lg shrink-0 flex flex-col items-center gap-1">
                            <span>點我看現場還原！</span>
                            <span className="text-[13px] font-bold opacity-80 flex items-center gap-1">立即進入場次全文 <ArrowRight size={14} /></span>
                        </motion.button>
                    </motion.div>
                </FadeIn>
            </section>

            {/* ═══ 🔥 熱門排行 ═══ */}
            <Banner title="🔥 熱門排行榜" subtitle="Trending — 由社群按讚驅動" bg="bg-[#2D2A26]" text="text-white" />
            <section className="bg-gradient-to-b from-[#2D2A26] to-[#1a1816] px-6 py-8">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-5">
                    {/* 熱門觀庭筆記 */}
                    <FadeIn>
                        <motion.div whileHover={{ y: -4 }} className="bg-white/[0.06] backdrop-blur rounded-2xl p-5 border border-white/10 hover:border-orange-500/30 transition-all hover:shadow-[0_8px_30px_rgba(255,165,0,0.1)]">
                            <div className="flex items-center gap-2 mb-4">
                                <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 2, repeat: Infinity }}
                                    className="w-9 h-9 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center text-white shadow-md"><BookOpen size={18} /></motion.div>
                                <h4 className="text-[20px] font-black text-white" style={serif}>熱門觀庭筆記</h4>
                            </div>
                            {hotNotes.map((n, i) => (
                                <motion.div key={i} whileHover={{ x: 4, backgroundColor: 'rgba(255,255,255,0.05)' }}
                                    className="flex items-start gap-3 py-3 border-b border-white/5 last:border-0 cursor-pointer group rounded-lg px-2 transition-colors">
                                    <span className={`text-[28px] font-black w-8 shrink-0 ${i === 0 ? 'text-orange-400' : i === 1 ? 'text-gray-400' : 'text-amber-700'}`} style={serif}>{n.rank}</span>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[16px] font-bold text-white/90 truncate group-hover:text-orange-300 transition-colors">{n.title}</p>
                                        <div className="flex gap-3 mt-1 text-[14px]">
                                            <span className="text-gray-500 font-bold">{n.session}</span>
                                            <span className="text-red-400 flex items-center gap-1"><Heart size={13} fill="currentColor" />{n.likes}</span>
                                            <span className="text-gray-500 flex items-center gap-1"><Eye size={13} />{n.views}</span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </FadeIn>
                    {/* 熱門留言 */}
                    <FadeIn delay={0.12}>
                        <motion.div whileHover={{ y: -4 }} className="bg-white/[0.06] backdrop-blur rounded-2xl p-5 border border-white/10 hover:border-purple-500/30 transition-all hover:shadow-[0_8px_30px_rgba(139,92,246,0.1)]">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-9 h-9 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center text-white shadow-md"><MessageSquare size={18} /></div>
                                <h4 className="text-[20px] font-black text-white" style={serif}>熱門專業留言</h4>
                            </div>
                            {hotComments.map((c, i) => (
                                <motion.div key={i} whileHover={{ scale: 1.02 }}
                                    className="p-3 rounded-xl bg-white/[0.04] border border-white/5 mb-3 last:mb-0 hover:border-purple-500/20 transition-all">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-7 h-7 bg-gradient-to-br from-violet-400 to-purple-500 rounded-lg flex items-center justify-center text-white text-[12px] font-black">{c.author.slice(-1)}</div>
                                        <span className="text-[14px] font-bold text-white/70">{c.author}</span>
                                        <span className="text-[12px] font-bold text-purple-300 bg-purple-500/15 px-2 py-0.5 rounded">{c.role}</span>
                                    </div>
                                    <p className="text-[14px] text-gray-400 leading-relaxed line-clamp-2">{c.content}</p>
                                    <p className="text-red-400 text-[14px] font-bold flex items-center gap-1 mt-2"><Heart size={13} fill="currentColor" />{c.likes}</p>
                                </motion.div>
                            ))}
                        </motion.div>
                    </FadeIn>
                    {/* 熱門文章 */}
                    <FadeIn delay={0.24}>
                        <motion.div whileHover={{ y: -4 }} className="bg-white/[0.06] backdrop-blur rounded-2xl p-5 border border-white/10 hover:border-emerald-500/30 transition-all hover:shadow-[0_8px_30px_rgba(16,185,129,0.1)]">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center text-white shadow-md"><FileText size={18} /></div>
                                <h4 className="text-[20px] font-black text-white" style={serif}>熱門投稿文章</h4>
                            </div>
                            {hotArticles.map((a, i) => (
                                <motion.div key={i} whileHover={{ scale: 1.02 }}
                                    className="p-3 rounded-xl bg-white/[0.04] border border-white/5 mb-3 last:mb-0 hover:border-emerald-500/20 transition-all cursor-pointer">
                                    <span className="text-[12px] font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">{a.tag}</span>
                                    <p className="text-[16px] font-bold text-white/90 mt-2 hover:text-emerald-300 transition-colors">{a.title}</p>
                                    <div className="flex justify-between mt-2 text-[14px]">
                                        <span className="text-gray-500 font-bold">{a.author}</span>
                                        <span className="text-red-400 flex items-center gap-1"><Heart size={13} fill="currentColor" />{a.likes}</span>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </FadeIn>
                </div>
            </section>

            {/* ═══ 工作流程 ═══ */}
            <Banner title="網站完整功能與操作方式" subtitle="Workflow & Features" bg="bg-[#E0DAF0]" text="text-[#4A3D7B]" />
            <section className="max-w-7xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {[
                        { icon: <Layers size={28} />, title: "前期 — 本團隊", items: ["實際參與所有場次形成筆記", "蒐集觀庭多元筆記核對補缺", "蒐集彙整本案相關資料"], borderC: "border-l-blue-400", accent: "text-blue-400" },
                        { icon: <MessageSquare size={28} />, title: "呈現", items: ["觀庭現場還原筆記", "即時論述與評論投稿機制", "形成論述與探討、交流"], borderC: "border-l-[#7B8C4E]", accent: "text-[#7B8C4E]" },
                        { icon: <Flag size={28} />, title: "最後", items: ["共構本事件之復原計畫和共識", "透過集體智慧建立新的準則與論述"], borderC: "border-l-[#C67B5C]", accent: "text-[#C67B5C]" },
                    ].map((step, i) => (
                        <FadeIn key={i} delay={i * 0.1}>
                            <motion.div whileHover={{ y: -4, boxShadow: '0 8px 25px rgba(0,0,0,0.08)' }}
                                className={`bg-white p-6 rounded-2xl border border-[#E8E0D4] border-l-4 ${step.borderC} shadow-sm transition-all`}>
                                <h4 className="text-[24px] font-black mb-4" style={serif}>{step.title}</h4>
                                <ul className="space-y-3">
                                    {step.items.map((item, j) => (
                                        <li key={j} className="text-[18px] text-[#5A5347] font-medium flex items-start gap-2">
                                            <ChevronRight size={18} className={`${step.accent} mt-1 shrink-0`} />{item}
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        </FadeIn>
                    ))}
                </div>
            </section>

            {/* ═══ 論壇精神 ═══ */}
            <Banner title="專業論壇與經驗交流" subtitle="Forum & Discussion" bg="bg-[#E3EED3]" text="text-[#3D5220]" />
            <section className="max-w-7xl mx-auto px-6 py-8">
                <FadeIn>
                    <div className="bg-white rounded-2xl p-8 border border-[#E8E0D4] shadow-sm">
                        <h3 className="text-[32px] font-black leading-tight mb-4" style={serif}>不造神・重文字<br />匿名化・去權威</h3>
                        <p className="text-[20px] text-[#6B6358] font-medium leading-[1.8] max-w-3xl mb-6">在這個演算法獎勵情緒、意見領袖壟斷話語權的時代，我們反其道而行。在這裡，不看職級、不分地域，只論專業論述與發言。</p>
                        <div className="flex flex-wrap gap-2">
                            {['經驗分享', '專業討論', '資料補充', '提問', '糾錯回報'].map((tag, i) => (
                                <motion.span key={tag} whileHover={{ scale: 1.08, y: -3 }} transition={{ type: 'spring', stiffness: 400 }}
                                    className="bg-[#E3EED3] text-[#3D5220] px-5 py-2.5 rounded-xl text-[16px] font-black border border-[#C5D9A8] hover:bg-[#7B8C4E] hover:text-white hover:border-[#7B8C4E] transition-colors cursor-pointer shadow-sm hover:shadow-md">{tag}</motion.span>
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
                        <motion.button whileHover={{ scale: 1.05, boxShadow: '0 12px 30px rgba(198,123,92,0.25)' }} whileTap={{ scale: 0.97 }}
                            className="bg-gradient-to-r from-[#C67B5C] to-[#a8634a] text-white px-8 py-4 rounded-2xl text-[20px] font-black shrink-0 shadow-lg transition-all">開始傳送 →</motion.button>
                    </div>
                </FadeIn>
            </section>

            {/* ═══ 倫理規範 ═══ */}
            <Banner title="倫理規範與發言守則" subtitle="Ethics & Guidelines" bg="bg-[#F5E0E0]" text="text-[#8B3535]" />
            <section className="max-w-7xl mx-auto px-6 py-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                        { icon: <ShieldAlert size={26} />, title: "嚴格去識別化", desc: "徹底移除隱私資訊。禁止揭露真實姓名、居住地或非公開案情細節。", bg: "bg-red-50", accent: "text-red-500", border: "border-red-100", glow: "hover:shadow-[0_6px_20px_rgba(239,68,68,0.1)]" },
                        { icon: <Scale size={26} />, title: "聚焦職務非個人", desc: "針對「專業判斷」與「機構制度」進行討論。嚴禁人身攻擊。", bg: "bg-emerald-50", accent: "text-[#7B8C4E]", border: "border-emerald-100", glow: "hover:shadow-[0_6px_20px_rgba(123,140,78,0.1)]" },
                        { icon: <Shield size={26} />, title: "遵守法律基礎", desc: "遵守法規與公共秩序。不得發表違法資訊或煽動仇恨言論。", bg: "bg-gray-50", accent: "text-gray-600", border: "border-gray-200", glow: "hover:shadow-[0_6px_20px_rgba(0,0,0,0.06)]" },
                    ].map((r, i) => (
                        <FadeIn key={i} delay={i * 0.08}>
                            <motion.div whileHover={{ y: -4 }} className={`${r.bg} p-6 rounded-2xl border ${r.border} transition-all ${r.glow}`}>
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
                                {['計畫緣起', '先備知識', '還原筆記', '熱門排行', '論壇'].map(x => <li key={x}><a className="hover:text-[#B8D468] transition-colors">{x}</a></li>)}
                            </ul>
                        </div>
                        <div>
                            <h5 className="text-[12px] font-black text-[#8A8078] uppercase tracking-widest mb-3">聯繫</h5>
                            <motion.button whileHover={{ scale: 1.03 }}
                                className="bg-white/10 text-white px-6 py-3 rounded-xl text-[16px] font-bold hover:bg-[#7B8C4E] transition-colors flex items-center gap-2 border border-white/10 hover:border-[#7B8C4E]">
                                <Send size={16} />匿名傳送
                            </motion.button>
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
