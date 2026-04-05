import React, { useState, useEffect } from 'react';
import {
    PenTool, Scale, ShieldAlert, BookOpen,
    MessageSquare, ChevronRight, Lock,
    Gavel, Clock, ArrowRight,
    ExternalLink, BookMarked, Layers, Flag,
    Menu, X, Users, HeartHandshake
} from 'lucide-react';
import { SectionBanner } from './SectionBanner';

export const HomeView = ({ onEnterTranscript, onComingSoon }) => {
    const [scrolled, setScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: '計畫緣起', href: '#mission' },
        { name: '先備知識', href: '#knowledge' },
        { name: '還原筆記', href: '#notes' },
        { name: '團隊與鳴謝', href: '#acknowledgments' },
        { name: '倫理規範', href: '#rules' },
    ];

    return (
        <div className="animate-in fade-in duration-700">
            <div className="bg-[#6B8E23] text-white text-xs font-bold text-center py-2.5 tracking-widest relative z-50 shadow-sm">
                <span className="inline-block animate-pulse mr-2">●</span>
                目前為 Beta 前導測試版，系統建置與數據對接中
            </div>

            <nav className={`sticky top-0 z-40 transition-all duration-300 px-4 lg:px-8 py-3.5 flex justify-between items-center bg-white border-b border-gray-100 ${scrolled ? 'shadow-sm' : ''}`}>
                <div className="flex items-center gap-3">
                    <div className="bg-[#6B8E23] p-1.5 lg:p-2 rounded-xl text-white shadow-sm">
                        <PenTool size={20} />
                    </div>
                    <div>
                        <h1 className="text-lg lg:text-xl font-black text-gray-900 tracking-tight leading-none">
                            法庭實況還原與專業共構筆記
                        </h1>
                    </div>
                </div>
                <div className="hidden md:flex items-center gap-2">
                    {navLinks.map(link => (
                        <a key={link.name} href={link.href} className="bg-gray-50/80 hover:bg-[#F9FBE7] text-gray-600 hover:text-[#6B8E23] px-4 py-2 rounded-xl text-sm font-bold transition-all border border-transparent hover:border-[#6B8E23]/20">
                            {link.name}
                        </a>
                    ))}
                </div>
                <div className="lg:hidden flex items-center">
                    <button className="text-gray-600 p-2 bg-gray-50 rounded-xl" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </nav>

            {isMenuOpen && (
                <div className="fixed inset-0 z-40 bg-white p-8 pt-24 space-y-4 animate-in slide-in-from-top duration-300 md:hidden border-b border-gray-100 shadow-xl">
                    {navLinks.map(link => (
                        <a key={link.name} href={link.href} onClick={() => setIsMenuOpen(false)} className="block bg-gray-50 text-gray-800 p-4 rounded-2xl text-xl font-black text-center border border-gray-100 hover:text-[#6B8E23]">
                            {link.name}
                        </a>
                    ))}
                </div>
            )}

            <section className="bg-white pt-16 pb-16 px-4 rounded-b-[3rem] shadow-sm border-b border-gray-100 relative overflow-hidden">
                <div className="absolute top-10 left-10 w-32 h-32 bg-blue-50 rounded-full blur-3xl opacity-60 pointer-events-none"></div>
                <div className="absolute bottom-10 right-10 w-40 h-40 bg-[#F9FBE7] rounded-full blur-3xl opacity-60 pointer-events-none"></div>
                <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
                    <div className="inline-flex items-center gap-2 px-5 py-2 bg-[#F9FBE7] text-[#6B8E23] rounded-full text-sm font-black tracking-widest border border-[#6B8E23]/20 shadow-sm">
                        <Gavel size={16} /> 社會工作與法律的實務共構
                    </div>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 leading-[1.3] tracking-tight">
                        法庭實況還原<span className="hidden md:inline">與</span><br className="md:hidden" />
                        <span className="text-[#6B8E23] relative inline-block mt-2 md:mt-4">
                            專業共構筆記計畫
                            <svg className="absolute -bottom-3 left-0 w-full" height="14" viewBox="0 0 100 14" preserveAspectRatio="none">
                                <path d="M2 10 Q 50 2 98 10" stroke="#E1EAB6" strokeWidth="8" strokeLinecap="round" fill="transparent" opacity="0.8" />
                            </svg>
                        </span>
                    </h2>
                    <div className="text-[17px] md:text-lg text-gray-500 font-medium leading-[1.9] max-w-2xl mx-auto space-y-4 pt-6">
                        <p>這不只是一份開庭紀錄，而是一場化血淚為滋養的集體療癒與重建。</p>
                        <p>我們邀請您暫放悲痛，以專業視角重返現場，透過法庭對話的檢視與辨讀，為社工實務留下寶貴的註腳。唯有直視真實，我們才能共構解方，讓同伴與後輩不再孤單。</p>
                    </div>
                    <div className="pt-6">
                        <button onClick={onEnterTranscript} className="group relative inline-flex items-center justify-center gap-3 bg-[#6B8E23] text-white px-10 py-5 rounded-2xl font-black text-xl shadow-[0_8px_25px_rgba(107,142,35,0.3)] hover:bg-[#5a781d] hover:scale-[1.02] hover:shadow-[0_12px_30px_rgba(107,142,35,0.4)] transition-all">
                            點我看現場還原！
                        </button>
                    </div>
                </div>
            </section>

            <main className="w-full flex flex-col gap-20 md:gap-24 py-16 overflow-hidden">
                <section className="max-w-4xl mx-auto px-4 lg:px-8 w-full animate-in zoom-in-95 duration-700">
                    <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-[0_15px_40px_rgba(0,0,0,0.06)] border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-8 group hover:border-[#6B8E23]/30 transition-colors">
                        <div className="flex-1 space-y-5 w-full">
                            <div className="flex items-center gap-3">
                                <span className="bg-orange-500 text-white text-xs font-black px-3 py-1.5 rounded-lg tracking-widest shadow-sm">最新還原</span>
                                <span className="text-[#6B8E23] font-bold text-sm flex items-center gap-1.5"><Clock size={16} /> 2026 年 2 月 26 日</span>
                            </div>
                            <h3 className="text-2xl md:text-3xl font-black text-gray-900 leading-tight">檢察官論告與辯護律師<br />簡報與陳述還原</h3>
                            <div className="bg-gray-50/80 p-5 rounded-2xl border border-gray-100 space-y-3">
                                <div className="flex items-start gap-2.5 text-base font-bold text-gray-800">
                                    <span className="text-orange-500 mt-0.5">⚠️</span>
                                    <span>114年度訴字第51號 過失致死等案 (一審審理庭第六場次)</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm font-bold text-gray-500">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#6B8E23]"></span>
                                    <span>程序：言詞辯論、檢方論告與最後陳述</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col items-center shrink-0 w-full md:w-auto">
                            <button onClick={onEnterTranscript} className="w-full md:w-auto bg-[#6B8E23] text-white px-8 py-5 rounded-2xl font-black text-xl shadow-[0_8px_20px_rgba(107,142,35,0.25)] hover:bg-[#5a781d] hover:scale-[1.02] transition-all flex flex-col items-center gap-1">
                                <span>點我看現場還原！</span>
                                <span className="text-xs font-bold opacity-90 flex items-center gap-1">立即進入場次全文 <ArrowRight size={14} /></span>
                            </button>
                        </div>
                    </div>
                </section>

                <section className="w-full">
                    <SectionBanner title="網站完整功能與操作方式" subtitle="Workflow & Features" bgClass="bg-[#F5F3FF]" textClass="text-[#4C1D95]" />
                    <div className="max-w-6xl mx-auto px-4 lg:px-8 w-full mt-10">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-gray-100 shadow-sm relative hover:shadow-md transition-shadow">
                                <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mb-8 border border-blue-100/50"><Layers size={32} /></div>
                                <h4 className="text-2xl font-black text-gray-900 mb-5">前期 - 本團隊</h4>
                                <ul className="space-y-4 text-[16px] text-gray-600 font-bold leading-relaxed">
                                    <li className="flex items-start gap-3"><span className="text-blue-500 mt-1">•</span> 本團隊實際參與所有場次形成筆記</li>
                                    <li className="flex items-start gap-3"><span className="text-blue-500 mt-1">•</span> 蒐集觀庭多元筆記核對補缺</li>
                                    <li className="flex items-start gap-3"><span className="text-blue-500 mt-1">•</span> 蒐集彙整本案相關資料</li>
                                </ul>
                                <div className="hidden md:block absolute -right-6 top-1/2 -translate-y-1/2 text-gray-200 z-10"><ChevronRight size={36} /></div>
                            </div>
                            <div className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-gray-100 shadow-sm relative hover:shadow-md transition-shadow">
                                <div className="w-16 h-16 bg-[#F9FBE7] text-[#6B8E23] rounded-2xl flex items-center justify-center mb-8 border border-[#6B8E23]/20"><MessageSquare size={32} /></div>
                                <h4 className="text-2xl font-black text-gray-900 mb-5">呈現</h4>
                                <ul className="space-y-5 text-[16px] text-gray-700 font-bold leading-relaxed">
                                    <li className="flex items-start gap-3"><span className="text-[#6B8E23] mt-1">✔️</span> 觀庭現場還原筆記</li>
                                    <li className="flex items-start gap-3"><span className="text-[#6B8E23] mt-1">✔️</span><div>即時論述與評論投稿機制<br /><span className="text-sm text-orange-500 font-black tracking-wider block mt-1.5">(已建置，測試中)</span></div></li>
                                    <li className="flex items-start gap-3"><span className="text-[#6B8E23] mt-1">✔️</span> 形成論述與探討、交流</li>
                                </ul>
                                <div className="hidden md:block absolute -right-6 top-1/2 -translate-y-1/2 text-gray-200 z-10"><ChevronRight size={36} /></div>
                            </div>
                            <div className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-gray-100 shadow-sm relative hover:shadow-md transition-shadow">
                                <div className="w-16 h-16 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center mb-8 border border-orange-100/50"><Flag size={32} /></div>
                                <h4 className="text-2xl font-black text-gray-900 mb-5">最後</h4>
                                <p className="text-[16px] text-gray-600 font-bold leading-[2]">共構本事件之復原計畫和共識。透過集體智慧，建立新的準則與論述。</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="knowledge" className="w-full">
                    <SectionBanner title="觀庭前先備知識一覽" subtitle="Essential Knowledge" bgClass="bg-[#EFF6FF]" textClass="text-[#1E40AF]" />
                    <div className="max-w-5xl mx-auto px-4 lg:px-8 w-full mt-10">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                            <p className="text-[16px] text-gray-700 font-medium bg-white p-6 rounded-2xl shadow-sm border border-gray-100 leading-relaxed max-w-3xl">
                                希望夥伴們理解法庭規則後再往下看，才能在清楚脈絡與規則下判讀，理解開庭中的動力與詰問的背後意義。
                                <br /><span className="text-gray-400 font-bold text-sm mt-2 block">例：何謂合議庭？為何一場開庭會有三名法官？證人詰問是什麼？</span>
                            </p>
                            <div className="shrink-0">
                                <a href="https://www.legis-pedia.com/" target="_blank" rel="noopener noreferrer" className="text-sm font-black text-gray-500 hover:text-blue-600 flex items-center gap-1.5 bg-white px-5 py-3 rounded-xl shadow-sm border border-gray-100 transition-colors">
                                    感謝 法律百科 <ExternalLink size={16} />
                                </a>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <a href="https://bird-wildebeest-d6d.notion.site/3147e2fdafd880bfb51ce110811c2e34" target="_blank" rel="noopener noreferrer" className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:border-blue-300 hover:shadow-md transition-all group">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500 border border-blue-100/50"><BookMarked size={24} /></div>
                                    <ExternalLink size={20} className="text-gray-300 group-hover:text-blue-500" />
                                </div>
                                <h5 className="font-black text-2xl text-gray-900 group-hover:text-blue-600 transition-colors mb-3">剴剴案：建議先備知識</h5>
                                <p className="text-[16px] text-gray-600 font-medium leading-relaxed">整理本案相關的背景脈絡與重要法律名詞釋義。</p>
                                <div className="mt-5 inline-block bg-blue-50 text-blue-600 text-[11px] font-black uppercase tracking-widest px-4 py-1.5 rounded-lg">持續更新中</div>
                            </a>
                            <a href="https://bird-wildebeest-d6d.notion.site/3147e2fdafd880e3bb81f280f68680db" target="_blank" rel="noopener noreferrer" className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:border-blue-300 hover:shadow-md transition-all group">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500 border border-blue-100/50"><Scale size={24} /></div>
                                    <ExternalLink size={20} className="text-gray-300 group-hover:text-blue-500" />
                                </div>
                                <h5 className="font-black text-2xl text-gray-900 group-hover:text-blue-600 transition-colors mb-3">彙總：開庭情境與階段說明</h5>
                                <p className="text-[16px] text-gray-600 font-medium leading-relaxed">深入淺出解說法庭配置、發言順序與各階段的法律意義。</p>
                            </a>
                        </div>
                    </div>
                </section>

                <section id="notes" className="w-full">
                    <SectionBanner title="開庭還原筆記" subtitle="Session Notes Archive" bgClass="bg-[#F4F7E6]" textClass="text-[#3F5314]" />
                    <div className="max-w-5xl mx-auto px-4 lg:px-8 w-full mt-10 space-y-6">
                        <button onClick={onEnterTranscript} className="w-full text-left bg-white p-6 md:p-10 rounded-[2.5rem] border border-gray-100 shadow-sm hover:border-[#6B8E23]/50 hover:shadow-lg transition-all group flex flex-col md:flex-row md:items-center justify-between gap-8">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <span className="bg-[#F9FBE7] text-[#6B8E23] text-sm font-black px-4 py-1.5 rounded-lg border border-[#6B8E23]/20">114年度訴字第51號</span>
                                    <span className="text-sm font-bold text-gray-400">2026.02.26</span>
                                </div>
                                <h4 className="text-2xl md:text-3xl font-black text-gray-900 group-hover:text-[#6B8E23] transition-colors leading-tight">過失致死等案 (一審審理庭第六場次)</h4>
                                <p className="text-[17px] font-bold text-gray-500">檢察官論告與辯護律師、被告最後陳述</p>
                            </div>
                            <div className="flex flex-col items-start md:items-end gap-4 shrink-0">
                                <span className="text-red-500 text-xs font-black tracking-widest animate-pulse flex items-center gap-2 bg-red-50 px-4 py-2 rounded-xl border border-red-100">
                                    <span className="w-2 h-2 bg-red-500 rounded-full"></span> 目前僅有一場
                                </span>
                                <div className="text-[#6B8E23] bg-[#F9FBE7] px-8 py-4 rounded-2xl text-base font-black flex items-center gap-2 group-hover:bg-[#6B8E23] group-hover:text-white transition-colors">
                                    閱讀還原筆記 <ArrowRight size={18} />
                                </div>
                            </div>
                        </button>
                        <div className="w-full bg-gray-50/80 p-8 md:p-10 rounded-[2.5rem] border border-gray-200 border-dashed flex flex-col md:flex-row md:items-center justify-between gap-6 opacity-80 cursor-not-allowed">
                            <div className="space-y-3">
                                <h4 className="text-xl font-black text-gray-600 flex items-center gap-3"><Lock size={20} className="text-gray-400" /> 觀庭共構筆記投稿功能</h4>
                                <p className="text-base font-bold text-gray-500 md:ml-8">系統資料庫與介面建置測試中，暫未開放。</p>
                            </div>
                            <span className="bg-gray-200 text-gray-500 text-sm font-black px-6 py-3 rounded-xl uppercase tracking-widest shrink-0">功能即將上線</span>
                        </div>
                    </div>
                </section>

                <section id="mission" className="w-full">
                    <SectionBanner title="計畫緣起與目標" subtitle="Our Mission" bgClass="bg-[#FFF7ED]" textClass="text-[#9A3412]" />
                    <div className="max-w-4xl mx-auto px-4 lg:px-8 w-full mt-10">
                        <div className="bg-white rounded-[3rem] p-8 md:p-14 lg:p-16 shadow-sm border border-gray-100">
                            <div className="text-[17px] md:text-[19px] text-gray-700 font-medium leading-[2.1] space-y-6">
                                <p>剴剴案已成為助人專業領域集體議題，對民眾及助人領域均產生各項影響。</p>
                                <p>為了因應衝擊，目前有許多令人尊敬的助人者挺身而出，也引發了各種對話。這些對話並非對立，而是對事件與問題有不同見解的人們，商議朝不同的方向前進，倡議、發聲、行動，不論是替社工報不平、還是與民眾對話、向上抗爭等等，均是為了這個專業群體而努力。未有對錯，均為夥伴。</p>
                                <p>我從114年12月11日起開始觀庭，並且加入民眾群組、社工群組、網絡社群，開始學習、觀察、諮詢與訪問，對各種對話與疑惑進行探討、歸因，尋求屬於我自己對事件的理解和問題認定。終於在115年2月26日訂下我對問題的理解，以及我想要去推動的解方。</p>
                                <blockquote className="border-l-[6px] border-[#6B8E23] pl-6 md:pl-8 py-3 my-10 bg-[#F9FBE7]/50 rounded-r-3xl font-serif">
                                    <p className="text-2xl md:text-3xl font-black text-gray-900 mb-4 leading-relaxed">對於我而言——<br className="md:hidden" />「審判已然開始，審判也早已結束。」</p>
                                    <p className="text-lg font-medium text-gray-600">社會大眾與助人專業群體均是悲痛的、憤怒的、受傷的、挫敗的。不論判決結果如何，此間已然滿目瘡痍。</p>
                                </blockquote>
                                <p>因此我的出發點，並不想放在糾結對錯與真相上，因為不管對民眾而言還是助人群體而言，傷害與崩壞早已是事實。</p>
                                <p>我想做的是從這個傷害中最務實、最深刻的去探究問題，探討如何修正、優化目前的工作困境，最終共構解方，避免再有人遭逢此難。<strong className="text-gray-900 font-black border-b-[3px] border-[#6B8E23]/40 pb-0.5 ml-1">剴剴、民眾、社工群體，不再遭逢此難。</strong></p>
                                <p>更白話來說，我接受傷害早已造成並成定局，討論對錯於事無補。我要做的是從斷垣殘壁中回收價值、吸取經驗，建立新的共識與準則，在哀鴻遍野中開始重建、復原，讓我們的同伴們、後輩們，不再如此。但若要這樣，就要去挖掘創傷，暫時放掉胸中悲痛與委屈，最真實的看待問題。</p>
                                <div className="bg-gray-50 p-8 md:p-10 rounded-[2rem] text-gray-800 font-black border border-gray-100 text-center shadow-sm my-10 text-xl leading-relaxed">這是用饅頭（互助、團結）沾著已然流出的血淚，<br className="hidden md:block" />轉化為成長滋糧的殘酷歷程。</div>
                                <p>要做到這點，那就必須要先學習先備知識，再從現有資料及開庭歷程中，<strong className="text-gray-900 font-black bg-orange-50 px-2 py-1 rounded-md mx-1">不經他人包裝詮釋，自己閱覽事情的始末</strong>，做出完整、獨立、多元觀點的判讀，才能走到下一步：尋求解方。</p>
                            </div>
                            <div className="mt-16 pt-12 border-t border-gray-100">
                                <h4 className="text-3xl font-black text-gray-900 mb-10 text-center">這個網站計畫的目的</h4>
                                <ul className="space-y-5 text-lg text-gray-700 font-bold max-w-3xl mx-auto">
                                    {[
                                        { title: "確保資訊透明且全面", desc: "避免去脈絡化與片面擷取。" },
                                        { title: "整合理解本事件所需知識與資訊", desc: "降低資訊獲取門檻、避免壁壘與落差。" },
                                        { title: "資訊交流", desc: "提供各助人工作網絡匿名資訊交流之場域。" },
                                        { title: "專業去魅", desc: "多元領域共同建構專業知識解說與評說，增進跨領域交流。" },
                                        { title: "筆記共構", desc: "所有人均可透過法庭情境還原，建立自己的論說與筆記。專業開庭實況還原筆記非少數參與者提供，而是由全體專業人員共構。", highlight: true }
                                    ].map((item, idx) => (
                                        <li key={idx} className={`flex items-start gap-5 p-6 rounded-3xl border transition-all ${item.highlight ? 'bg-[#F9FBE7] border-[#6B8E23]/30 shadow-sm' : 'bg-white border-gray-100 hover:shadow-sm'}`}>
                                            <span className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-black text-lg ${item.highlight ? 'bg-[#6B8E23] text-white' : 'bg-gray-100 text-gray-400'}`}>{idx + 1}</span>
                                            <div className="mt-1">
                                                <span className={`font-black block mb-2 text-xl ${item.highlight ? 'text-[#6B8E23]' : 'text-gray-900'}`}>{item.title}</span>
                                                <span className="text-gray-500 font-medium leading-relaxed">{item.desc}</span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="acknowledgments" className="w-full">
                    <SectionBanner title="團隊介紹與特別鳴謝" subtitle="Acknowledgments" bgClass="bg-[#FEFCE8]" textClass="text-[#A16207]" />
                    <div className="max-w-6xl mx-auto px-4 lg:px-8 w-full mt-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-[#FDE68A]/60 shadow-sm hover:shadow-md transition-shadow relative">
                                <div className="w-14 h-14 bg-[#FEFCE8] text-[#D97706] rounded-2xl flex items-center justify-center mb-6 border border-[#FDE68A]/50"><Users size={26} /></div>
                                <h4 className="text-2xl font-black text-gray-900 mb-4">團隊介紹與聲明</h4>
                                <p className="text-[17px] text-gray-700 font-medium leading-[1.9]">本團隊由助人專業與民眾共同組成，均利用下班、照顧家人剩餘時間進行本計劃，故更新進度較慢，敬請海涵。</p>
                            </div>
                            <div className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-[#FDE68A]/60 shadow-sm hover:shadow-md transition-shadow relative">
                                <div className="w-14 h-14 bg-[#FEFCE8] text-[#D97706] rounded-2xl flex items-center justify-center mb-6 border border-[#FDE68A]/50"><HeartHandshake size={26} /></div>
                                <h4 className="text-2xl font-black text-gray-900 mb-5">感謝線上社群支持</h4>
                                <div className="space-y-5 text-[17px] text-gray-700 font-medium leading-[1.9]">
                                    <div className="flex flex-wrap gap-2.5">
                                        <span className="bg-[#FEF9C3] text-[#A16207] px-4 py-2 rounded-xl text-sm font-black border border-[#FDE047]/50 shadow-sm">✨ 孩想陪你長大聯盟</span>
                                        <span className="bg-[#FEF9C3] text-[#A16207] px-4 py-2 rounded-xl text-sm font-black border border-[#FDE047]/50 shadow-sm">✨ 兒虐零容忍</span>
                                        <span className="bg-[#FEF9C3] text-[#A16207] px-4 py-2 rounded-xl text-sm font-black border border-[#FDE047]/50 shadow-sm">✨ 孩想陪你長大</span>
                                        <span className="bg-[#FEF9C3] text-[#A16207] px-4 py-2 rounded-xl text-sm font-black border border-[#FDE047]/50 shadow-sm">✨ 鵝保社工團隊</span>
                                    </div>
                                    <p className="pt-2 font-bold text-gray-600">感謝以上等社群之熱心民眾、專業人員提供各項資料及建議，協力共構本筆記。</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="rules" className="w-full pb-10">
                    <SectionBanner title="投稿與評述倫理規範" subtitle="Ethics and Guidelines" bgClass="bg-[#FFF1F2]" textClass="text-[#9F1239]" />
                    <div className="max-w-6xl mx-auto px-4 lg:px-8 w-full mt-10">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-red-50 shadow-sm hover:shadow-md transition-shadow">
                                <div className="space-y-5">
                                    <ShieldAlert size={36} className="text-red-500" />
                                    <h4 className="text-2xl font-black text-gray-900">1. 嚴格去識別化</h4>
                                    <p className="text-[16px] text-gray-600 leading-relaxed font-bold">提及具體個案時，必須徹底移除隱私資訊。禁止揭露真實姓名、居住地或非公開案情細節。</p>
                                </div>
                            </div>
                            <div className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-[#EBE7E0] shadow-sm hover:shadow-md transition-shadow">
                                <div className="space-y-5">
                                    <Scale size={36} className="text-[#6B8E23]" />
                                    <h4 className="text-2xl font-black text-gray-900">2. 聚焦職務非個人</h4>
                                    <p className="text-[16px] text-gray-600 leading-relaxed font-bold">目標是檢討機制，評論應針對「專業判斷」、「處遇邏輯」進行討論。嚴禁非理性辱罵或人身攻擊。</p>
                                </div>
                            </div>
                            <div className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                <div className="space-y-5">
                                    <BookOpen size={36} className="text-gray-500" />
                                    <h4 className="text-2xl font-black text-gray-900">3. 遵守法律基礎</h4>
                                    <p className="text-[16px] text-gray-600 leading-relaxed font-bold">遵守法規與公共秩序是論述的基礎。不得發表違反法律之資訊，或煽動任何仇恨言論。</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="bg-gray-900 py-16 px-4 text-white rounded-t-[3rem]">
                <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10 text-center md:text-left">
                    <div className="space-y-4">
                        <div className="bg-white/10 w-16 h-16 rounded-2xl flex items-center justify-center text-white mx-auto md:mx-0"><PenTool size={28} /></div>
                        <div>
                            <p className="text-2xl font-black tracking-tight text-white">法庭實況還原與專業共構筆記</p>
                            <p className="text-[11px] text-[#A5B198] font-black uppercase mt-1 tracking-widest">Social Work Court Notes</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-10">
                        <div className="space-y-4">
                            <h5 className="text-[10px] font-bold text-[#A5B198] uppercase tracking-widest">網站導覽</h5>
                            <ul className="text-sm font-bold space-y-3">
                                <li><a href="#mission" className="hover:text-white transition-colors">計畫緣起</a></li>
                                <li><a href="#knowledge" className="hover:text-white transition-colors">先備知識</a></li>
                                <li><a href="#notes" className="hover:text-white transition-colors">還原筆記</a></li>
                                <li><a href="#acknowledgments" className="hover:text-white transition-colors">團隊鳴謝</a></li>
                            </ul>
                        </div>
                        <div className="space-y-4">
                            <h5 className="text-[10px] font-bold text-[#A5B198] uppercase tracking-widest">聯繫我們</h5>
                            <div className="flex justify-center md:justify-start gap-4">
                                <button onClick={onComingSoon} className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#6B8E23] transition-colors"><MessageSquare size={18} /></button>
                                <button onClick={onComingSoon} className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#6B8E23] transition-colors"><ExternalLink size={18} /></button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="max-w-5xl mx-auto mt-12 pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-[#A5B198] font-bold tracking-wider">© 2026 社工實務觀庭共構小組 ｜ 系統籌備建置中</p>
                    <div className="flex gap-6 text-xs font-bold text-[#A5B198]">
                        <a href="#" onClick={onComingSoon} className="hover:text-white transition-colors">隱私權政策</a>
                        <a href="#" onClick={onComingSoon} className="hover:text-white transition-colors">使用條款</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};
