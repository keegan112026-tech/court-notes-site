'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    PenTool, Scale, ShieldAlert, BookOpen,
    MessageSquare, ChevronRight, Lock,
    Gavel, Clock, ArrowRight,
    ExternalLink, BookMarked, Layers, Flag,
    Menu, X, Users, HeartHandshake, Sparkles,
    Send, FileText, MessageCircle
} from 'lucide-react';

/* ─── 粉彩橫幅 Section Banner ─── */
const SectionBanner = ({ title, subtitle, bgClass, textClass }: {
    title: string; subtitle?: string; bgClass: string; textClass: string;
}) => (
    <div className={`w-full py-10 md:py-14 ${bgClass} border-b border-black/5`}>
        <div className="max-w-6xl mx-auto px-4 lg:px-8 text-center md:text-left">
            <h3 className={`text-2xl md:text-3xl lg:text-4xl font-black tracking-wide ${textClass}`}>
                {title}
            </h3>
            {subtitle && (
                <p className={`font-bold uppercase tracking-[0.2em] text-xs md:text-sm mt-3 opacity-70 ${textClass}`}>
                    {subtitle}
                </p>
            )}
        </div>
    </div>
);

/* ─── Fade-in 動畫容器─── */
const FadeIn = ({ children, delay = 0, className = '' }: {
    children: React.ReactNode; delay?: number; className?: string;
}) => (
    <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.5, delay, ease: 'easeOut' }}
        className={className}
    >
        {children}
    </motion.div>
);

export default function DemoPage() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const h = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', h);
        return () => window.removeEventListener('scroll', h);
    }, []);

    const navLinks = [
        { name: '計畫緣起', href: '#mission' },
        { name: '先備知識', href: '#knowledge' },
        { name: '還原筆記', href: '#notes' },
        { name: '論壇', href: '#forum' },
        { name: '團隊鳴謝', href: '#acknowledgments' },
    ];

    return (
        <div className="min-h-screen bg-[#FDFBF7] text-gray-800 font-sans">
            {/* ─── Beta Banner ─── */}
            <div className="bg-[#6B8E23] text-white text-xs font-bold text-center py-2.5 tracking-widest relative z-50 shadow-sm">
                <span className="inline-block animate-pulse mr-2">●</span>
                目前為 Beta 前導測試版，系統建置與數據對接中
            </div>

            {/* ─── Navbar ─── */}
            <nav className={`sticky top-0 z-40 transition-all duration-300 px-4 lg:px-8 py-3.5 flex justify-between items-center bg-white/95 backdrop-blur-md border-b border-gray-100 ${scrolled ? 'shadow-md' : ''}`}>
                <div className="flex items-center gap-3">
                    <div className="bg-[#6B8E23] p-2 rounded-xl text-white shadow-sm">
                        <PenTool size={20} />
                    </div>
                    <h1 className="text-lg lg:text-xl font-black text-gray-900 tracking-tight leading-none">
                        法庭實況還原與專業共構筆記
                    </h1>
                </div>
                <div className="hidden md:flex items-center gap-2">
                    {navLinks.map(link => (
                        <a key={link.name} href={link.href}
                            className="bg-gray-50/80 hover:bg-[#F9FBE7] text-gray-600 hover:text-[#6B8E23] px-4 py-2 rounded-xl text-sm font-bold transition-all border border-transparent hover:border-[#6B8E23]/20">
                            {link.name}
                        </a>
                    ))}
                </div>
                <button className="md:hidden p-2 bg-gray-50 rounded-xl text-gray-600" onClick={() => setMenuOpen(!menuOpen)}>
                    {menuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </nav>

            {/* ─── Mobile Menu ─── */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed inset-0 z-40 bg-white p-8 pt-28 space-y-4 md:hidden"
                    >
                        {navLinks.map(link => (
                            <a key={link.name} href={link.href} onClick={() => setMenuOpen(false)}
                                className="block bg-gray-50 text-gray-800 p-4 rounded-2xl text-xl font-black text-center border border-gray-100 hover:text-[#6B8E23]">
                                {link.name}
                            </a>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ─── Hero ─── */}
            <section className="bg-white pt-16 pb-20 px-4 rounded-b-[3rem] shadow-sm border-b border-gray-100 relative overflow-hidden">
                <div className="absolute top-10 left-10 w-40 h-40 bg-blue-50 rounded-full blur-3xl opacity-50 pointer-events-none" />
                <div className="absolute bottom-10 right-10 w-48 h-48 bg-[#F9FBE7] rounded-full blur-3xl opacity-60 pointer-events-none" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-olive-50/30 to-transparent rounded-full pointer-events-none" />

                <FadeIn className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
                    <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#F9FBE7] text-[#6B8E23] rounded-full text-sm font-black tracking-widest border border-[#6B8E23]/20 shadow-sm">
                        <Gavel size={16} /> 社會工作與法律的實務共構
                    </div>

                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 leading-[1.3] tracking-tight">
                        法庭實況還原
                        <span className="hidden md:inline">與</span>
                        <br className="md:hidden" />
                        <span className="text-[#6B8E23] relative inline-block mt-2 md:mt-4">
                            專業共構筆記計畫
                            <svg className="absolute -bottom-3 left-0 w-full" height="14" viewBox="0 0 100 14" preserveAspectRatio="none">
                                <path d="M2 10 Q 50 2 98 10" stroke="#E1EAB6" strokeWidth="8" strokeLinecap="round" fill="transparent" opacity="0.8" />
                            </svg>
                        </span>
                    </h2>

                    <div className="text-[17px] md:text-lg text-gray-500 font-medium leading-[1.9] max-w-2xl mx-auto space-y-4 pt-4">
                        <p>這不只是一份開庭紀錄，而是一場化血淚為滋養的集體療癒與重建。</p>
                        <p>我們邀請您暫放悲痛，以專業視角重返現場，透過法庭對話的檢視與辨讀，為社工實務留下寶貴的註腳。唯有直視真實，我們才能共構解方，讓同伴與後輩不再孤單。</p>
                    </div>

                    <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
                        <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                            className="group inline-flex items-center justify-center gap-3 bg-[#6B8E23] text-white px-10 py-5 rounded-2xl font-black text-xl shadow-[0_8px_25px_rgba(107,142,35,0.3)] hover:bg-[#5a781d] hover:shadow-[0_12px_30px_rgba(107,142,35,0.4)] transition-all"
                        >
                            點我看現場還原！
                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </motion.button>
                        <a href="#mission" className="inline-flex items-center justify-center gap-2 px-8 py-5 rounded-2xl border-2 border-gray-200 text-gray-600 font-bold text-lg hover:border-[#6B8E23]/40 hover:text-[#6B8E23] transition-all">
                            計畫說明
                        </a>
                    </div>
                </FadeIn>
            </section>

            {/* ─── 一看就知道這網站要幹嘛 ─── */}
            <section className="max-w-5xl mx-auto px-4 py-16">
                <FadeIn className="text-center mb-12">
                    <p className="text-sm font-black tracking-[0.3em] text-[#6B8E23] uppercase mb-4">What We Do</p>
                    <h3 className="text-2xl md:text-3xl font-black text-gray-900">這個平台在做什麼？</h3>
                </FadeIn>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {[
                        { icon: <BookMarked size={28} />, label: "整合資訊", desc: "打破壁壘" },
                        { icon: <Gavel size={28} />, label: "觀庭還原", desc: "身歷其境" },
                        { icon: <MessageCircle size={28} />, label: "專業評述", desc: "匿名交流" },
                        { icon: <Sparkles size={28} />, label: "共構解方", desc: "集體智慧" },
                    ].map((item, i) => (
                        <FadeIn key={i} delay={i * 0.1}>
                            <motion.div
                                whileHover={{ y: -4 }}
                                className="bg-white p-6 md:p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-lg transition-all text-center group"
                            >
                                <div className="w-14 h-14 mx-auto bg-[#F9FBE7] text-[#6B8E23] rounded-2xl flex items-center justify-center mb-5 border border-[#6B8E23]/10 group-hover:bg-[#6B8E23] group-hover:text-white transition-colors">
                                    {item.icon}
                                </div>
                                <p className="text-lg font-black text-gray-900 mb-1">{item.label}</p>
                                <p className="text-sm font-bold text-gray-400">{item.desc}</p>
                            </motion.div>
                        </FadeIn>
                    ))}
                </div>
                <FadeIn delay={0.4}>
                    <div className="flex items-center justify-center gap-1 mt-8">
                        {[0, 1, 2].map(i => (
                            <ChevronRight key={i} size={20} className="text-[#6B8E23]/30" />
                        ))}
                    </div>
                </FadeIn>
            </section>

            {/* ─── 最新還原 ─── */}
            <FadeIn className="max-w-4xl mx-auto px-4 pb-16">
                <motion.div
                    whileHover={{ borderColor: 'rgba(107,142,35,0.4)' }}
                    className="bg-white rounded-[2rem] p-8 md:p-10 shadow-[0_15px_40px_rgba(0,0,0,0.06)] border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-8 transition-colors"
                >
                    <div className="flex-1 space-y-5 w-full">
                        <div className="flex items-center gap-3">
                            <span className="bg-orange-500 text-white text-xs font-black px-3 py-1.5 rounded-lg tracking-widest shadow-sm">最新還原</span>
                            <span className="text-[#6B8E23] font-bold text-sm flex items-center gap-1.5"><Clock size={16} /> 2026 年 2 月 26 日</span>
                        </div>
                        <h3 className="text-2xl md:text-3xl font-black text-gray-900 leading-tight">檢察官論告與辯護律師<br />簡報與陳述還原</h3>
                        <div className="bg-gray-50/80 p-5 rounded-2xl border border-gray-100 space-y-3">
                            <div className="flex items-start gap-2.5 text-base font-bold text-gray-800">
                                <span className="text-orange-500 mt-0.5">⚠️</span>
                                114年度訴字第51號 過失致死等案 (一審審理庭第六場次)
                            </div>
                            <div className="flex items-center gap-2 text-sm font-bold text-gray-500">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#6B8E23]" />
                                程序：言詞辯論、檢方論告與最後陳述
                            </div>
                        </div>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className="w-full md:w-auto bg-[#6B8E23] text-white px-8 py-5 rounded-2xl font-black text-xl shadow-[0_8px_20px_rgba(107,142,35,0.25)] hover:bg-[#5a781d] transition-all flex flex-col items-center gap-1 shrink-0"
                    >
                        <span>點我看現場還原！</span>
                        <span className="text-xs font-bold opacity-90 flex items-center gap-1">立即進入場次全文 <ArrowRight size={14} /></span>
                    </motion.button>
                </motion.div>
            </FadeIn>

            {/* ─── 工作流程 ─── */}
            <SectionBanner title="網站完整功能與操作方式" subtitle="Workflow & Features" bgClass="bg-[#F5F3FF]" textClass="text-[#4C1D95]" />
            <div className="max-w-6xl mx-auto px-4 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { icon: <Layers size={32} />, title: "前期 - 本團隊", color: "blue", items: ["本團隊實際參與所有場次形成筆記", "蒐集觀庭多元筆記核對補缺", "蒐集彙整本案相關資料"] },
                        { icon: <MessageSquare size={32} />, title: "呈現", color: "olive", items: ["觀庭現場還原筆記", "即時論述與評論投稿機制", "形成論述與探討、交流"] },
                        { icon: <Flag size={32} />, title: "最後", color: "orange", items: ["共構本事件之復原計畫和共識", "透過集體智慧建立新的準則與論述"] },
                    ].map((step, i) => (
                        <FadeIn key={i} delay={i * 0.15}>
                            <motion.div
                                whileHover={{ y: -6 }}
                                className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all relative"
                            >
                                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 border ${step.color === 'blue'
                                    ? 'bg-blue-50 text-blue-500 border-blue-100/50'
                                    : step.color === 'olive'
                                        ? 'bg-[#F9FBE7] text-[#6B8E23] border-[#6B8E23]/20'
                                        : 'bg-orange-50 text-orange-500 border-orange-100/50'
                                    }`}>
                                    {step.icon}
                                </div>
                                <h4 className="text-2xl font-black text-gray-900 mb-5">{step.title}</h4>
                                <ul className="space-y-4">
                                    {step.items.map((item, j) => (
                                        <li key={j} className="flex items-start gap-3 text-[16px] text-gray-600 font-bold leading-relaxed">
                                            <span className={`mt-1 ${step.color === 'blue' ? 'text-blue-500' : step.color === 'olive' ? 'text-[#6B8E23]' : 'text-orange-500'}`}>
                                                {step.color === 'olive' ? '✔️' : '•'}
                                            </span>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                                {i < 2 && (
                                    <div className="hidden md:block absolute -right-6 top-1/2 -translate-y-1/2 text-gray-200 z-10">
                                        <ChevronRight size={36} />
                                    </div>
                                )}
                            </motion.div>
                        </FadeIn>
                    ))}
                </div>
            </div>

            {/* ─── 論壇預告 ─── */}
            <SectionBanner title="專業論壇與經驗交流" subtitle="Forum & Discussion" bgClass="bg-[#ECFDF5]" textClass="text-[#065F46]" />
            <div className="max-w-4xl mx-auto px-4 py-12">
                <FadeIn>
                    <div className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-gray-100 shadow-sm text-center">
                        <div className="w-20 h-20 mx-auto bg-[#ECFDF5] text-[#065F46] rounded-3xl flex items-center justify-center mb-6 border border-emerald-100">
                            <MessageCircle size={36} />
                        </div>
                        <h4 className="text-2xl font-black text-gray-900 mb-4">匿名投稿 · 專業對話 · 經驗共享</h4>
                        <p className="text-lg text-gray-500 font-medium max-w-2xl mx-auto leading-relaxed mb-8">
                            我們期許回歸「舊式論壇」的精神——不造神、重文字、匿名化、去權威。在這裡，不看職級、不分地域，只論專業論述與發言。
                        </p>
                        <div className="flex flex-wrap gap-3 justify-center">
                            {['經驗分享', '專業討論', '資料補充', '提問', '糾錯回報'].map(tag => (
                                <span key={tag} className="bg-[#ECFDF5] text-[#065F46] px-4 py-2 rounded-xl text-sm font-black border border-emerald-200/50">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </FadeIn>
            </div>

            {/* ─── 匿名聯絡 ─── */}
            <SectionBanner title="匿名聯絡與資料提供" subtitle="Anonymous Contact" bgClass="bg-[#FFF7ED]" textClass="text-[#9A3412]" />
            <div className="max-w-4xl mx-auto px-4 py-12">
                <FadeIn>
                    <div className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-gray-100 shadow-sm">
                        <div className="flex flex-col md:flex-row items-center gap-8">
                            <div className="w-20 h-20 shrink-0 bg-orange-50 text-orange-500 rounded-3xl flex items-center justify-center border border-orange-100">
                                <Send size={36} />
                            </div>
                            <div className="text-center md:text-left">
                                <h4 className="text-2xl font-black text-gray-900 mb-3">安全匿名的向我們傳遞訊息</h4>
                                <p className="text-lg text-gray-500 font-medium leading-relaxed">
                                    無論是逐字稿投稿、資料補充、意見回饋或糾錯回報，您都可以匿名（或選擇性留下聯絡方式）透過此管道向團隊傳達。
                                </p>
                            </div>
                        </div>
                    </div>
                </FadeIn>
            </div>

            {/* ─── 團隊鳴謝 ─── */}
            <SectionBanner title="團隊介紹與特別鳴謝" subtitle="Acknowledgments" bgClass="bg-[#FEFCE8]" textClass="text-[#A16207]" />
            <div className="max-w-6xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <FadeIn>
                        <div className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-[#FDE68A]/60 shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-14 h-14 bg-[#FEFCE8] text-[#D97706] rounded-2xl flex items-center justify-center mb-6 border border-[#FDE68A]/50"><Users size={26} /></div>
                            <h4 className="text-2xl font-black text-gray-900 mb-4">團隊介紹與聲明</h4>
                            <p className="text-[17px] text-gray-700 font-medium leading-[1.9]">本團隊成員皆為現職社工、心理、輔導等實務工作者，利用公餘時間維護平台。若更新與除錯進度較緩，尚請海涵見諒。</p>
                        </div>
                    </FadeIn>
                    <FadeIn delay={0.15}>
                        <div className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-[#FDE68A]/60 shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-14 h-14 bg-[#FEFCE8] text-[#D97706] rounded-2xl flex items-center justify-center mb-6 border border-[#FDE68A]/50"><HeartHandshake size={26} /></div>
                            <h4 className="text-2xl font-black text-gray-900 mb-5">感謝民眾線上社群支持</h4>
                            <div className="flex flex-wrap gap-2.5 mb-4">
                                {['孩想陪你長大聯盟', '兒虐零容忍', '孩想陪你長大', '鵝保社工團隊'].map(tag => (
                                    <span key={tag} className="bg-[#FEF9C3] text-[#A16207] px-4 py-2 rounded-xl text-sm font-black border border-[#FDE047]/50 shadow-sm">
                                        ✨ {tag}
                                    </span>
                                ))}
                            </div>
                            <p className="text-[17px] text-gray-600 font-bold leading-[1.9]">感謝以上等社群之熱心民眾、專業人員提供各項資料及建議，協力共構本筆記。</p>
                        </div>
                    </FadeIn>
                </div>
            </div>

            {/* ─── Footer ─── */}
            <footer className="bg-gray-900 py-16 px-4 text-white rounded-t-[3rem]">
                <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10 text-center md:text-left">
                    <div className="space-y-4">
                        <div className="bg-white/10 w-16 h-16 rounded-2xl flex items-center justify-center text-white mx-auto md:mx-0"><PenTool size={28} /></div>
                        <p className="text-2xl font-black tracking-tight">法庭實況還原與專業共構筆記</p>
                        <p className="text-[11px] text-[#A5B198] font-black uppercase tracking-widest">Social Work Court Notes</p>
                    </div>
                    <div className="grid grid-cols-2 gap-10">
                        <div className="space-y-4">
                            <h5 className="text-[10px] font-bold text-[#A5B198] uppercase tracking-widest">網站導覽</h5>
                            <ul className="text-sm font-bold space-y-3">
                                <li><a href="#mission" className="text-gray-400 hover:text-white transition-colors">計畫緣起</a></li>
                                <li><a href="#knowledge" className="text-gray-400 hover:text-white transition-colors">先備知識</a></li>
                                <li><a href="#notes" className="text-gray-400 hover:text-white transition-colors">還原筆記</a></li>
                                <li><a href="#forum" className="text-gray-400 hover:text-white transition-colors">論壇</a></li>
                            </ul>
                        </div>
                        <div className="space-y-4">
                            <h5 className="text-[10px] font-bold text-[#A5B198] uppercase tracking-widest">聯繫我們</h5>
                            <div className="flex justify-center md:justify-start gap-4">
                                <button className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#6B8E23] transition-colors"><MessageSquare size={18} /></button>
                                <button className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#6B8E23] transition-colors"><ExternalLink size={18} /></button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="max-w-5xl mx-auto mt-12 pt-6 border-t border-white/10 text-center">
                    <p className="text-xs text-[#A5B198] font-bold tracking-wider">© 2026 社工實務觀庭共構小組 ｜ 系統籌備建置中</p>
                </div>
            </footer>
        </div>
    );
}
