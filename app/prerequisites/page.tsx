'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, Clock, Gavel, Scale, AlertCircle, FileText, ChevronRight, MessageSquare } from 'lucide-react';
import { FadeIn, Banner } from '@/components/ui-shared';

const serif = { fontFamily: "'Noto Serif TC', serif" };

export default function PrerequisitesPage() {
    const [activeTab, setActiveTab] = useState<'case' | 'court'>('case');

    return (
        <div className="min-h-screen bg-[#FAFAFA] text-gray-800 font-sans selection:bg-[#6B8E23]/20 pb-20">
            {/* Header */}
            <div className="bg-white border-b border-gray-100 shadow-sm relative overflow-hidden">
                <div className="absolute right-0 top-0 w-1/3 h-full bg-gradient-to-l from-[#F5EFE4] to-transparent pointer-events-none" />
                <div className="max-w-5xl mx-auto px-6 py-12 md:py-16 relative z-10">
                    <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-[#8B4D35] mb-6 transition-colors bg-gray-50 px-4 py-2 rounded-full text-sm font-bold shadow-sm border border-gray-100">
                        <ArrowLeft size={16} /> 返回首頁
                    </Link>
                    <h1 className="text-3xl md:text-5xl font-black text-gray-900 leading-tight mb-4" style={serif}>
                        先備知識<br className="hidden md:block" />
                        <span className="text-[#8B4D35]">Case & Court Prerequisites</span>
                    </h1>
                    <p className="text-lg text-gray-600 font-medium leading-relaxed max-w-3xl">
                        此區塊整理了「剴剴案背景脈絡」與「開庭流程情境解說」，幫助夥伴們在閱讀現場觀庭筆記前，能具備充足的辨識能力與法制素養。
                    </p>
                </div>
            </div>

            <main className="max-w-5xl mx-auto px-6 pt-12">
                {/* 導覽 Tabs */}
                <div className="flex flex-wrap gap-4 mb-10 border-b border-gray-200 pb-px">
                    <button
                        onClick={() => setActiveTab('case')}
                        className={`pb-4 px-2 text-[18px] font-black transition-colors flex items-center gap-2 ${activeTab === 'case' ? 'text-[#C67B5C] border-b-4 border-[#C67B5C]' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        <FileText size={18} />
                        剴剴案：建議先備知識
                    </button>
                    <button
                        onClick={() => setActiveTab('court')}
                        className={`pb-4 px-2 text-[18px] font-black transition-colors flex items-center gap-2 ${activeTab === 'court' ? 'text-[#6B8E23] border-b-4 border-[#6B8E23]' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        <Scale size={18} />
                        開庭情境與階段說明
                    </button>
                </div>

                <div className="bg-white rounded-[2.5rem] border border-[#E8E0D4] p-8 md:p-12 shadow-sm relative overflow-hidden min-h-[600px]">

                    {/* ──── Tab 1: 剴剴案背景 ──── */}
                    {activeTab === 'case' && (
                        <FadeIn>
                            <div className="absolute top-0 right-0 p-10 text-[#F5EFE4] pointer-events-none mix-blend-multiply opacity-50">
                                <BookOpen size={160} />
                            </div>
                            <div className="relative z-10 space-y-12">

                                <section>
                                    <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3 mb-6" style={serif}>
                                        <AlertCircle className="text-[#C67B5C]" /> 第三方專業調查（監察院報告）
                                    </h2>
                                    <div className="bg-[#FDFBF7] p-6 md:p-8 rounded-3xl border border-[#F0E6D2]">
                                        <p className="text-gray-600 font-medium leading-[1.8] mb-4">
                                            監察院已於 114 年 5 月底發布對本案的調查報告，重點聚焦於體制漏洞與行政過失，是理解「結構性問題」的重要文本。
                                        </p>
                                        <div className="flex flex-col sm:flex-row gap-4">
                                            <div className="flex-1 bg-white border border-[#E8E0D4] p-5 rounded-2xl">
                                                <h4 className="font-black text-gray-800 text-lg mb-1">114.05.29 記者會簡報</h4>
                                                <p className="text-[#8A8078] text-sm font-bold mt-2">（本平台將陸續整理後放上）</p>
                                            </div>
                                            <div className="flex-1 bg-white border border-[#E8E0D4] p-5 rounded-2xl">
                                                <h4 className="font-black text-gray-800 text-lg mb-1">監察院正式調查報告</h4>
                                                <p className="text-[#8A8078] text-sm font-bold mt-2">（本平台將陸續整理後放上）</p>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                <section>
                                    <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3 mb-8" style={serif}>
                                        <Clock className="text-[#C67B5C]" /> 事件大事記 (Timeline)
                                    </h2>
                                    <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-1 before:bg-gradient-to-b before:from-[#F0E6D2] before:to-transparent">
                                        {[
                                            { date: '111/3/17', desc: '新北市中心將 A 童轉介兒盟辦理收出養。' },
                                            { date: '111/5/4', desc: '第一任保母簽訂托育契約。' },
                                            { date: '111/6/29', desc: '生母失聯致程序暫停，兒盟結案。A 童由外婆接回並委託周姓保母照顧。' },
                                            { date: '112/5/8', desc: '決定再次辦理出養。' },
                                            { date: '112/9/1', desc: 'A 童轉送至劉姓保母（本案被告）處安置。' },
                                            { date: '112/9/25 ~ 12/24', desc: '期間發生多次阻止探視、社工回報穩定、直到劉保母通報受傷。' },
                                            { date: '112/12/24', desc: 'A 童不幸死亡。' },
                                        ].map((item, idx) => (
                                            <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                                                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-[#C67B5C] text-white shadow-sm shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10" />
                                                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] bg-white p-5 rounded-2xl border border-[#E8E0D4] shadow-sm hover:shadow-md transition-shadow">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className="text-xs font-black text-white bg-[#C67B5C] px-2 py-1 rounded">{item.date}</span>
                                                    </div>
                                                    <p className="text-[15px] font-bold text-gray-700 leading-relaxed">{item.desc}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                <section>
                                    <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3 mb-6" style={serif}>
                                        <FileText className="text-[#C67B5C]" /> 核心法律文件
                                    </h2>
                                    <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                                        <p className="text-gray-600 font-bold mb-2">判決書基準：</p>
                                        <p className="text-[#8B4D35] font-black text-lg bg-[#F5EFE4] inline-block px-4 py-2 rounded-xl">《臺灣臺北地方法院刑事判決 113 年度國審訴字第 1 號》</p>
                                        <p className="text-sm text-gray-500 mt-2">此為後續判讀開庭紀錄與相關法律攻防的重要基準文本。</p>
                                    </div>
                                </section>
                            </div>
                        </FadeIn>
                    )}

                    {/* ──── Tab 2: 開庭情境與階段說明 ──── */}
                    {activeTab === 'court' && (
                        <FadeIn>
                            <div className="absolute top-0 right-0 p-10 text-[#F9FBE7] pointer-events-none mix-blend-multiply opacity-50">
                                <Scale size={160} />
                            </div>
                            <div className="relative z-10 space-y-12">

                                <div className="text-center max-w-2xl mx-auto mb-12">
                                    <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-4" style={serif}>法庭程序四大階段拆解</h2>
                                    <p className="text-gray-500 font-medium">了解法庭內各階段的動態與法律意義，才不會在閱讀錯綜複雜的逐字稿時迷失方向。</p>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    {[
                                        {
                                            phase: '階段一', title: '審理啟動 (程序確認)', icon: <Gavel size={24} />, color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-100',
                                            items: [
                                                { k: '人別確認', v: '確認檢察官、被告、辯護人是否到場。' },
                                                { k: '權利告知', v: '法官告知被告擁有「緘默權」、「選任辯護人權」及「請求調查有利證據權」，這是程序正義的核心。' },
                                                { k: '身分驗證', v: '確認被告基本資料、精神狀態及是否需要特殊法律扶助。' }
                                            ]
                                        },
                                        {
                                            phase: '階段二', title: '證據整理與意見表達', icon: <FileText size={24} />, color: 'text-purple-500', bg: 'bg-purple-50', border: 'border-purple-100',
                                            items: [
                                                { k: '證據能力確認', v: '爭論特定證據是否具備進入法庭的資格。' },
                                                { k: '意見表示', v: '對於已知的筆錄、照片或文件，雙方表達有無異議。' }
                                            ]
                                        },
                                        {
                                            phase: '階段三', title: '詰問部署 (順序與隔離)', icon: <AlertCircle size={24} />, color: 'text-orange-500', bg: 'bg-orange-50', border: 'border-orange-100',
                                            items: [
                                                { k: '人員安排', v: '決定證人出現的順序。' },
                                                { k: '隔離規則', v: '證人不得在法庭內旁聽其他證人作證，避免證詞受到汙染。' }
                                            ]
                                        },
                                        {
                                            phase: '階段四', title: '交互詰問流程', icon: <MessageSquare size={24} />, color: 'text-[#6B8E23]', bg: 'bg-[#F9FBE7]', border: 'border-[#E9EDDA]',
                                            items: [
                                                { k: '主詰問', v: '己方律師（或檢察官）對己方證人的誘導式或開放式提問。' },
                                                { k: '反詰問', v: '對方對證人進行質疑，旨在發現矛盾或削弱證詞可信度。' },
                                                { k: '覆問', v: '針對反詰問中出現的新問題進行補充。' }
                                            ]
                                        }
                                    ].map((stage, i) => (
                                        <div key={i} className={`p-8 rounded-[2rem] border ${stage.border} ${stage.bg} relative overflow-hidden group hover:shadow-md transition-all`}>
                                            <div className="flex items-center gap-3 mb-6">
                                                <div className={`w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center ${stage.color}`}>
                                                    {stage.icon}
                                                </div>
                                                <div>
                                                    <span className={`text-sm font-black ${stage.color}`}>{stage.phase}</span>
                                                    <h3 className="text-xl font-black text-gray-900" style={serif}>{stage.title}</h3>
                                                </div>
                                            </div>
                                            <div className="space-y-4">
                                                {stage.items.map((item, j) => (
                                                    <div key={j} className="bg-white/60 p-4 rounded-xl">
                                                        <h4 className="font-black text-gray-800 mb-1">{item.k}</h4>
                                                        <p className="text-sm font-medium text-gray-600 leading-relaxed">{item.v}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-8 bg-gray-50 border border-gray-200 p-6 rounded-2xl text-center">
                                    <p className="text-gray-500 font-bold text-sm">
                                        感謝 <a href="https://www.legis-pedia.com/" target="_blank" className="text-[#6B8E23] hover:underline">法律百科</a> 及各專業法實務工作者協助彙整上述法庭情境知識。
                                    </p>
                                </div>

                            </div>
                        </FadeIn>
                    )}
                </div>
            </main>
        </div>
    );
}
