'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import SubpageHeader from '@/components/SubpageHeader';
import { FadeIn, Banner } from '@/components/ui-shared';
import { AlertCircle, ArrowRight, BookOpen, Clock, FileText, Gavel, MessageSquare, Scale } from 'lucide-react';

const serif = { fontFamily: "'Noto Serif TC', serif" };

export default function KnowledgePage() {
    return (
        <div className="min-h-screen bg-[#FBF7F0] pt-20">
            <SubpageHeader />
            <Banner title="先備知識" subtitle="Prerequisites" bg="bg-[#C67B5C]/15" text="text-[#8B4D35]" />
            <section className="max-w-7xl mx-auto px-6 py-12 md:py-20">
                <FadeIn>
                    <div className="bg-white rounded-[2.5rem] border border-[#E8E0D4] p-8 md:p-16 shadow-xl relative overflow-hidden">
                        <div className="max-w-4xl mx-auto mb-12">
                            <h3 className="text-3xl md:text-4xl font-black text-gray-900 mb-6 text-center" style={serif}>閱讀筆記前的準備</h3>
                            <p className="text-[20px] text-[#6B6358] font-medium leading-[1.8] text-center italic">
                                「希望夥伴們理解法庭規則後再往下看，才能在清楚脈絡與規則下判讀，理解開庭中的動力與詰問的背後意義。」
                            </p>
                        </div>

                        <div className="mb-16 pb-12 border-b border-[#E8E0D4]">
                            <div className="flex items-center justify-center gap-3 mb-8">
                                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shadow-sm">
                                    <BookOpen size={20} />
                                </div>
                                <h4 className="text-2xl font-black text-gray-900" style={serif}>Notion 深度閱讀與原始資料</h4>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                                {[
                                    { title: '剴剴案：建議先備知識', desc: '整理本案相關的背景脈絡、重要法律名詞釋義與相關附件下載。', url: 'https://bird-wildebeest-d6d.notion.site/3147e2fdafd880bfb51ce110811c2e34' },
                                    { title: '開庭情境與階段說明', desc: '深入淺出解說法庭配置、發言順序與各階段的法律意義。', url: 'https://bird-wildebeest-d6d.notion.site/3147e2fdafd880e3bb81f280f68680db' },
                                ].map((link, i) => (
                                    <a key={i} href={link.url} target="_blank" rel="noreferrer" className="block group">
                                        <motion.div whileHover={{ y: -5, scale: 1.01 }} className="bg-[#FAF7F2] p-8 rounded-[2rem] border border-[#E8E0D4] group-hover:border-[#7B8C4E] group-hover:bg-white transition-all shadow-sm group-hover:shadow-md h-full">
                                            <h4 className="text-[22px] font-black group-hover:text-[#7B8C4E] transition-colors mb-3" style={serif}>{link.title}</h4>
                                            <p className="text-[15px] text-[#8A8078] font-bold leading-relaxed mb-6">{link.desc}</p>
                                            <span className="text-[#7B8C4E] text-[15px] font-black flex items-center gap-2">前往 Notion 閱讀完整版本 <ArrowRight size={16} /></span>
                                        </motion.div>
                                    </a>
                                ))}
                            </div>
                            <p className="text-center mt-10 text-[15px] text-gray-400 font-bold">
                                感謝 <a href="https://www.legis-pedia.com/" target="_blank" className="text-[#C67B5C] underline hover:text-[#7B8C4E] transition-colors">法律百科</a> 及民眾、專業工作者協助彙整
                            </p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                            <div className="space-y-12">
                                <section>
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="w-12 h-12 rounded-2xl bg-[#C67B5C]/10 flex items-center justify-center text-[#C67B5C]">
                                            <Clock size={24} />
                                        </div>
                                        <h4 className="text-2xl font-black" style={serif}>事件大事記 (Timeline)</h4>
                                    </div>
                                    <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-1 before:bg-gradient-to-b before:from-[#F0E6D2] before:to-transparent">
                                        {[
                                            { date: '111/3/17', desc: '新北市中心將 A 童轉介兒盟辦理收出養。' },
                                            { date: '112/9/1', desc: 'A 童轉送至劉姓保母（本案被告）處安置。' },
                                            { date: '112/12/24', desc: 'A 童不幸死亡。' },
                                            { date: '114/5/29', desc: '監察院發布對本案調查報告。' },
                                        ].map((item, idx) => (
                                            <div key={idx} className="relative flex items-center group pl-12">
                                                <div className="absolute left-0 w-10 h-10 rounded-full border-4 border-white bg-[#C67B5C] text-white shadow-sm flex items-center justify-center z-10" />
                                                <div className="bg-[#FDFBF7] p-5 rounded-2xl border border-[#F0E6D2] w-full hover:shadow-md transition-shadow">
                                                    <span className="text-xs font-black text-white bg-[#C67B5C] px-2 py-1 rounded inline-block mb-2">{item.date}</span>
                                                    <p className="text-[15px] font-bold text-gray-700 leading-relaxed">{item.desc}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <Link href="/knowledge" className="mt-8 inline-flex items-center gap-2 text-[#C67B5C] font-black hover:underline pl-12 pt-4">
                                        查看完整詳細大事記 <ArrowRight size={16} />
                                    </Link>
                                </section>
                            </div>

                            <div className="space-y-12">
                                <section>
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="w-12 h-12 rounded-2xl bg-[#7B8C4E]/10 flex items-center justify-center text-[#7B8C4E]">
                                            <Scale size={24} />
                                        </div>
                                        <h4 className="text-2xl font-black" style={serif}>法庭程序四大階段</h4>
                                    </div>
                                    <div className="grid grid-cols-1 gap-4">
                                        {[
                                            { stage: '階段一', title: '審理啟動 (程序確認)', icon: <Gavel size={20} />, color: 'text-blue-600', bg: 'bg-blue-50' },
                                            { stage: '階段二', title: '證據整理與意見表達', icon: <FileText size={20} />, color: 'text-purple-600', bg: 'bg-purple-50' },
                                            { stage: '階段三', title: '詰問部署 (順序與隔離)', icon: <AlertCircle size={20} />, color: 'text-orange-600', bg: 'bg-orange-50' },
                                            { stage: '階段四', title: '交互詰問流程', icon: <MessageSquare size={20} />, color: 'text-[#5A6E2B]', bg: 'bg-[#F9FBE7]' },
                                        ].map((s, i) => (
                                            <div key={i} className={`${s.bg} p-6 rounded-2xl border border-black/5 flex items-center gap-4 group hover:shadow-md transition-all`}>
                                                <div className={`w-12 h-12 rounded-xl bg-white flex items-center justify-center ${s.color} shadow-sm group-hover:scale-110 transition-transform`}>
                                                    {s.icon}
                                                </div>
                                                <div>
                                                    <span className={`text-xs font-black uppercase tracking-wider ${s.color}`}>{s.stage}</span>
                                                    <h5 className="text-[17px] font-black text-gray-900" style={serif}>{s.title}</h5>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <Link href="/knowledge" className="mt-8 inline-flex items-center gap-2 text-[#7B8C4E] font-black hover:underline pt-4">
                                        查看各階段詳細內容解說 <ArrowRight size={16} />
                                    </Link>
                                </section>
                            </div>
                        </div>
                    </div>
                </FadeIn>
            </section>
        </div>
    );
}
