'use client';
import React from 'react';
import { motion } from 'framer-motion';
import {
    Gavel,
    Scale,
    Search,
    Users,
    Award,
    BookOpen,
    MessageCircle,
    ArrowRight,
    FileText,
    ShieldCheck,
    Mic2,
    AlertCircle,
    Clock
} from 'lucide-react';
import Link from 'next/link';

const serif = { fontFamily: "'Noto Serif TC', serif" };

const DictionaryLink = ({ title, url, desc, icon: Icon }: any) => (
    <motion.a
        href={url}
        target="_blank"
        rel="noreferrer"
        whileHover={{ y: -8, scale: 1.02 }}
        className="group relative bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.05)] hover:shadow-[0_40px_80px_rgba(0,0,0,0.1)] transition-all overflow-hidden"
    >
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-50/50 to-transparent rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform" />
        <div className="relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-[#1A1A1A] text-white flex items-center justify-center mb-6 shadow-xl group-hover:rotate-6 transition-transform">
                <Icon size={28} />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-3 group-hover:text-blue-600 transition-colors" style={serif}>{title}</h3>
            <p className="text-gray-500 font-bold text-sm leading-relaxed mb-6">{desc}</p>
            <div className="flex items-center gap-2 text-blue-600 font-black text-xs uppercase tracking-widest">
                詳閱法律百科 <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
        </div>
    </motion.a>
);

const StepCard = ({ num, title, content, icon: Icon, active = false }: any) => (
    <div className={`relative flex items-start gap-8 p-10 rounded-[3rem] transition-all border ${active ? 'bg-white shadow-2xl border-white scale-105 z-10' : 'bg-white/40 border-transparent blur-[0.5px] opacity-60'}`}>
        <div className={`w-16 h-16 rounded-3xl flex items-center justify-center shrink-0 ${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-gray-200 text-gray-400'}`}>
            <Icon size={32} />
        </div>
        <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
                <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded ${active ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'}`}>Phase 0{num}</span>
                <h4 className="text-2xl font-black text-gray-900" style={serif}>{title}</h4>
            </div>
            <p className={`text-base font-bold leading-relaxed ${active ? 'text-gray-600' : 'text-gray-400'}`}>{content}</p>
        </div>
    </div>
);

export default function BeautifyDemo() {
    return (
        <div className="min-h-screen bg-[#F0F2F5] selection:bg-blue-200">
            {/* Hero Section with Cinematic Glassmorphism */}
            <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-b from-[#0A1128]/80 to-[#F0F2F5] z-10" />
                    <div
                        className="w-full h-full bg-cover bg-center"
                        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=2070")' }}
                    />
                </div>

                <div className="relative z-20 max-w-5xl mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1 }}
                    >
                        <span className="bg-blue-500/20 backdrop-blur-md border border-blue-400/30 text-blue-200 px-6 py-2 rounded-full text-xs font-black uppercase tracking-[0.3em] mb-8 inline-block shadow-2xl shadow-blue-500/10">
                            Beautification Showcase
                        </span>
                        <h1 className="text-5xl md:text-8xl font-black text-white leading-[1.1] tracking-tight mb-8" style={serif}>
                            開庭情境與<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-indigo-200">階段說明書</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-blue-100/70 font-medium leading-relaxed max-w-2xl mx-auto mb-12">
                            透過專業視覺引導與資訊分層，將厚重的法律知識轉化為身歷其境的互動體驗。
                        </p>
                        <div className="flex flex-wrap justify-center gap-6">
                            <button className="bg-white text-gray-900 px-10 py-5 rounded-[2rem] text-lg font-black shadow-2xl hover:scale-105 transition-transform">
                                開始探索
                            </button>
                            <button className="bg-white/10 backdrop-blur-xl text-white border border-white/20 px-10 py-5 rounded-[2rem] text-lg font-black hover:bg-white/20 transition-all">
                                預覽簡報
                            </button>
                        </div>
                    </motion.div>
                </div>

                {/* Floating Decorative Elements */}
                <div className="absolute left-10 top-1/2 -translate-y-1/2 w-px h-64 bg-gradient-to-b from-transparent via-blue-400/20 to-transparent" />
                <div className="absolute right-10 top-1/2 -translate-y-1/2 w-px h-64 bg-gradient-to-b from-transparent via-blue-400/20 to-transparent" />
            </section>

            {/* Legal Encyclopedia - Premium Cards Grid */}
            <section className="relative z-30 -mt-24 max-w-7xl mx-auto px-6 pb-32">
                <div className="text-center mb-16 px-6">
                    <h2 className="text-sm font-black text-blue-600 uppercase tracking-[0.4em] mb-4">Core Concepts</h2>
                    <p className="text-3xl font-black text-gray-900" style={serif}>法律辭典與專業術語</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <DictionaryLink
                        title="合議庭"
                        desc="Collegiate Bench. 由多名法官組成，共同審理案件的機制。"
                        url="https://www.legis-pedia.com/dictionary/3822"
                        icon={Scale}
                    />
                    <DictionaryLink
                        title="國判法官"
                        desc="Lay Judge. 邀請一般國民與專業法官共同參與審判的制度。"
                        url="https://www.legis-pedia.com/dictionary/4121"
                        icon={Users}
                    />
                    <DictionaryLink
                        title="審判長"
                        desc="Presiding Judge. 合議庭中負責指揮訴訟程序的首席法官。"
                        url="https://www.legis-pedia.com/dictionary/4370"
                        icon={Gavel}
                    />
                    <DictionaryLink
                        title="檢察官"
                        desc="Prosecutor. 代表國家行使追訴權，維護法律正義的核心司法人員。"
                        url="https://www.legis-pedia.com/dictionary/3731"
                        icon={ShieldCheck}
                    />
                    <DictionaryLink
                        title="交互詰問"
                        desc="Examination. 包含主詰問與反詰問，旨在發現真實的法庭對質流程。"
                        url="https://www.legis-pedia.com/dictionary/3415"
                        icon={MessageCircle}
                    />
                    <DictionaryLink
                        title="刑事判決"
                        desc="Criminal Judgment. 法院針對被告是否有罪及其刑責所做的最終裁決。"
                        url="https://www.legis-pedia.com/dictionary/3732"
                        icon={FileText}
                    />
                </div>
            </section>

            {/* Trial Timeline - Immersive Section */}
            <section className="bg-white py-32 overflow-hidden">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-20 items-center">
                        <div className="space-y-12">
                            <div>
                                <span className="text-blue-600 font-black text-xs uppercase tracking-widest bg-blue-50 px-3 py-1 rounded">Interactive Guide</span>
                                <h2 className="text-4xl md:text-5xl font-black text-gray-900 mt-6 mb-8 leading-tight" style={serif}>
                                    開庭流程四大節點<br />
                                    <span className="text-gray-400">實務操作拆解</span>
                                </h2>
                                <div className="h-1 w-24 bg-blue-600 rounded-full" />
                            </div>

                            <div className="space-y-6">
                                <StepCard
                                    num={1} title="審理啟動 (程序確認)"
                                    content="法官核對被告身分，確認檢辯雙方到場情形，並告知法規權利。"
                                    icon={Gavel}
                                    active={true}
                                />
                                <StepCard
                                    num={2} title="證據整理與意見"
                                    content="針對先行調查之證據表達意見，確保資訊之正確性與合法性。"
                                    icon={Search}
                                />
                                <StepCard
                                    num={3} title="證人隔離程序"
                                    content="隔離尚未詰問之證人，建立資訊防火牆，避免證詞互相污染。"
                                    icon={AlertCircle}
                                />
                                <StepCard
                                    num={4} title="具結與詰問"
                                    content="證人簽署真實義務具結書，正式進入主詰問與反詰問環節。"
                                    icon={Mic2}
                                />
                            </div>
                        </div>

                        <div className="relative">
                            <div className="aspect-[4/5] bg-[#F7F8FA] rounded-[4rem] overflow-hidden shadow-inner relative group border-8 border-white p-4">
                                <div className="w-full h-full bg-cover bg-center rounded-[3rem]" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=2070")' }} />
                                <div className="absolute inset-x-8 bottom-8 bg-white/90 backdrop-blur-md p-8 rounded-[2rem] shadow-2xl">
                                    <h5 className="font-black text-gray-900 text-lg mb-2">專業法律百科支援</h5>
                                    <p className="text-sm font-bold text-gray-500 leading-relaxed">上述流程皆依據法律實務整理，旨在降低一般社會大眾之資訊獲取門檻。</p>
                                </div>
                            </div>
                            <div className="absolute -top-12 -right-12 w-48 h-48 bg-blue-400/10 blur-[100px] rounded-full" />
                            <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-indigo-400/10 blur-[100px] rounded-full" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer Design Example */}
            <footer className="bg-gray-900 text-white py-20">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <BookOpen size={48} className="mx-auto mb-8 text-blue-400 opacity-50" />
                    <h3 className="text-3xl font-black mb-6" style={serif}>讓法律實務，成為專業成長的滋養</h3>
                    <p className="text-gray-400 font-bold max-w-xl mx-auto mb-12">本頁面僅作為美化示範，展示如何將文字資料轉化為具備「驚艷感」的數位體驗。</p>
                    <div className="w-full h-px bg-white/10 mb-12" />
                    <p className="text-xs font-black uppercase tracking-[0.5em] text-white/30">© 2026 Court Notes Reconstruction Project</p>
                </div>
            </footer>
        </div>
    );
}
