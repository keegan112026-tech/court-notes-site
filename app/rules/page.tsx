'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, FileText, CheckCircle, ShieldAlert, Sparkles, AlertTriangle } from 'lucide-react';
import { FadeIn } from '@/components/ui-shared';

const serif = { fontFamily: "'Noto Serif TC', serif" };

export default function RulesPage() {
    const [activeTab, setActiveTab] = useState<'posting' | 'commenting'>('posting');

    return (
        <div className="min-h-screen bg-[#FAFAFA] text-gray-800 font-sans selection:bg-[#6B8E23]/20 pb-20">
            {/* Header */}
            <div className="bg-white border-b border-gray-100 shadow-sm relative overflow-hidden">
                <div className="absolute right-0 top-0 w-1/3 h-full bg-gradient-to-l from-orange-50 to-transparent pointer-events-none" />
                <div className="max-w-4xl mx-auto px-6 py-12 md:py-16 relative z-10">
                    <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-orange-500 mb-6 transition-colors bg-gray-50 px-4 py-2 rounded-full text-sm font-bold shadow-sm border border-gray-100">
                        <ArrowLeft size={16} /> 返回首頁
                    </Link>
                    <h1 className="text-3xl md:text-5xl font-black text-gray-900 leading-tight mb-4" style={serif}>
                        平台規範與守則<br className="hidden md:block" />
                        <span className="text-orange-500">Platform Rules</span>
                    </h1>
                    <p className="text-lg text-gray-600 font-medium leading-relaxed max-w-2xl">
                        為了確保專業論述的品質，並守護每一位實務工作者的法律安全，請在參與討論前詳閱以下規範。
                    </p>
                </div>
            </div>

            <main className="max-w-4xl mx-auto px-6 pt-12">
                {/* 導覽 Tabs */}
                <div className="flex flex-wrap gap-4 mb-10 border-b border-gray-200 pb-px">
                    <button
                        onClick={() => setActiveTab('posting')}
                        className={`pb-4 px-2 text-[18px] font-black transition-colors ${activeTab === 'posting' ? 'text-orange-600 border-b-4 border-orange-500' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        <FileText size={18} className="inline-block mr-2 mb-1" />
                        投稿須知與平台承諾
                    </button>
                    <button
                        onClick={() => setActiveTab('commenting')}
                        className={`pb-4 px-2 text-[18px] font-black transition-colors ${activeTab === 'commenting' ? 'text-[#6B8E23] border-b-4 border-[#6B8E23]' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        <ShieldAlert size={18} className="inline-block mr-2 mb-1" />
                        留言注意事項
                    </button>
                </div>

                <div className="bg-white rounded-[2rem] border border-gray-100 p-8 md:p-12 shadow-sm relative overflow-hidden min-h-[500px]">
                    {activeTab === 'posting' && (
                        <FadeIn>
                            <div className="absolute top-0 right-0 p-8 text-orange-100 pointer-events-none">
                                <FileText size={120} />
                            </div>
                            <div className="relative z-10 space-y-10">
                                <section>
                                    <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3 mb-6" style={serif}>
                                        <Sparkles className="text-orange-500" /> 投稿形式與授權
                                    </h2>
                                    <div className="space-y-4 text-gray-600 leading-[1.8] font-medium p-6 bg-orange-50/50 rounded-2xl border border-orange-100/50">
                                        <p><strong className="text-gray-900">1. 身份與形式：</strong> 開放社工相關專業人員投稿。作者可自由選擇「實名」或「匿名」發表。</p>
                                        <p><strong className="text-gray-900">2. 授權聲明：</strong> 投稿即視為授權本平台進行排版、編輯與公開發布。若內容涉及高度敏感或需進一步查證之實務細節，平台保有查證或暫緩發布之權利。</p>
                                    </div>
                                </section>

                                <section>
                                    <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3 mb-6" style={serif}>
                                        <CheckCircle className="text-orange-500" /> 徵稿範疇與目的
                                    </h2>
                                    <div className="space-y-4 text-gray-600 leading-[1.8] font-medium p-6 bg-gray-50 rounded-2xl border border-gray-100">
                                        <p>本計畫旨在匯集專業量能，讓社會大眾能從「實務視角」理解法庭中的交鋒。我們誠摯邀請對於本次案件有感、有見解的社工與相關專業人員，針對以下面向賜稿：</p>
                                        <ul className="list-disc pl-6 space-y-2 text-gray-700 font-bold">
                                            <li><span className="text-orange-600">實務經驗共鳴：</span>在您過往的實務經驗中，是否曾面臨類似的困境或挑戰？您是如何克服或反思的？</li>
                                            <li><span className="text-orange-600">專業視角補充：</span>針對法庭探討的議題（例如：收出養流程、醫療辨識、機構管理、督導機制等），您是否有不同或更深入的見解？</li>
                                            <li><span className="text-orange-600">制度與流程檢討：</span>除了個人實施層面，您認為現行制度（如訪視規範、通報機制等）是否有結構性的問題需要改善？</li>
                                            <li><span className="text-orange-600">對未來的期許：</span>這起事件帶來了哪些啟示？我們應如何建立更完善的保護網，避免憾事重演？</li>
                                        </ul>
                                    </div>
                                </section>
                            </div>
                        </FadeIn>
                    )}

                    {activeTab === 'commenting' && (
                        <FadeIn>
                            <div className="absolute top-0 right-0 p-8 text-[#E9EDDA] pointer-events-none">
                                <ShieldAlert size={120} />
                            </div>
                            <div className="relative z-10 space-y-10">
                                <section>
                                    <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3 mb-6" style={serif}>
                                        <AlertTriangle className="text-[#6B8E23]" /> 留言原則：專業、理性、守法
                                    </h2>
                                    <div className="space-y-6 text-gray-600 leading-[1.8] font-medium p-6 bg-[#F9FBE7] rounded-2xl border border-[#E9EDDA]/50">
                                        <div>
                                            <h3 className="text-lg font-black text-gray-900 mb-2">1. 嚴格去識別化（最重要）：</h3>
                                            <p>留言內容<strong className="text-red-600">嚴禁</strong>揭露案主、家屬、社工或相關人員之真實姓名、詳細地址或任何足以辨識身分之資訊。違反此規定者，平台將立即刪除留言，並可能報請相關單位處理。</p>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-black text-gray-900 mb-2">2. 聚焦專業討論，拒絕公審：</h3>
                                            <p>本平台鼓勵針對「專業判斷」、「處遇邏輯」、「制度缺漏」進行建設性討論，而非情緒宣洩。請避免針對特定個人進行人身攻擊、非理性謾罵或臆測性的道德指控。</p>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-black text-gray-900 mb-2">3. 尊重多元觀點：</h3>
                                            <p>實務工作牽涉複雜面向，請以開放心態傾聽不同專業（如社工、醫療、法律）的意見，理性交流，切勿相互攻訐。</p>
                                        </div>
                                    </div>
                                </section>

                                <section>
                                    <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3 mb-6" style={serif}>
                                        <CheckCircle className="text-[#6B8E23]" /> 平台審核與免責聲明
                                    </h2>
                                    <div className="space-y-4 text-gray-600 leading-[1.8] font-medium p-6 bg-gray-50 rounded-2xl border border-gray-100">
                                        <ul className="list-disc pl-6 space-y-3">
                                            <li><strong className="text-gray-900">先審後發機制：</strong>為避免不當發言造成二次傷害或法律爭議，本平台目前採取「先審後發」機制。您的留言在送出後，需經管理員確認未違反上述規範才會公開顯示。</li>
                                            <li><strong className="text-gray-900">個人言論責任：</strong>留言內容不代表本平台立場。留言者應對其發表內容自負法律責任（包括但不限於妨害名譽、違反個資法等）。</li>
                                            <li><strong className="text-gray-900">刪除與隱藏權利：</strong>若留言經舉報或管理員認定有違反規範之虞，平台保有隨時隱藏、修改或刪除該留言的權利，且不另行通知。</li>
                                        </ul>
                                    </div>
                                </section>
                            </div>
                        </FadeIn>
                    )}
                </div>
            </main>
        </div>
    );
}
