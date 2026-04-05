'use client';

import React from 'react';
import { motion } from 'framer-motion';
import SubpageHeader from '@/components/SubpageHeader';
import { Banner, FadeIn } from '@/components/ui-shared';
import {
    BookMarked,
    ChevronRight,
    Eye,
    Gavel,
    Layers,
    MessageCircle,
    MessageSquare,
    Scale,
    Shield,
    ShieldAlert,
    Sparkles,
} from 'lucide-react';

const serif = { fontFamily: "'Noto Serif TC', serif" };

const ethicsCards = [
    {
        icon: <ShieldAlert size={26} />,
        title: '嚴格去識別化',
        desc: '徹底移除隱私資訊。禁止揭露真實姓名、居住地或非公開案情細節。',
        bg: 'bg-red-50',
        accent: 'text-red-500',
        border: 'border-red-100',
    },
    {
        icon: <Scale size={26} />,
        title: '聚焦職務非個人',
        desc: '針對「專業判斷」與「機構制度」進行討論。嚴禁人身攻擊。',
        bg: 'bg-emerald-50',
        accent: 'text-[#7B8C4E]',
        border: 'border-emerald-100',
    },
    {
        icon: <Shield size={26} />,
        title: '遵守法律基礎',
        desc: '遵守法規與公共秩序。不得發表違法資訊 or 煽動仇恨言論。',
        bg: 'bg-gray-50',
        accent: 'text-gray-600',
        border: 'border-gray-200',
    },
];

const workflow = [
    {
        title: '前期 — 本團隊工作',
        items: [
            '實際參與所有場次形成筆記',
            '蒐集觀庭多元筆記校對補缺',
            '蒐集案整體相關資料',
        ],
        borderC: 'border-l-blue-400',
        accent: 'text-blue-400',
    },
    {
        title: '呈現',
        items: ['觀庭現場還原筆記', '即時論壇與評論投稿機制', '形成論述探討、交流'],
        borderC: 'border-l-[#7B8C4E]',
        accent: 'text-[#7B8C4E]',
    },
    {
        title: '最後',
        items: ['共構本事件之還原計畫和共識', '透過集體智慧建立新的準則與論述'],
        borderC: 'border-l-[#C67B5C]',
        accent: 'text-[#C67B5C]',
    },
];

const whatWeDo = [
    { icon: <BookMarked size={30} />, label: '整合資訊', desc: '打破壁壘，降低門檻', color: 'bg-[#E3EED3]', accent: 'text-[#5A6F35]' },
    { icon: <Eye size={30} />, label: '觀庭還原', desc: '身歷其境，完整還原', color: 'bg-[#F5E6D3]', accent: 'text-[#A0724E]' },
    { icon: <Gavel size={30} />, label: '觀庭評述', desc: '就本案呈現真實狀況評述', color: 'bg-[#E0DAF0]', accent: 'text-[#6B5CA5]' },
    { icon: <MessageCircle size={30} />, label: '建構論壇', desc: '匿名交流，平等詮釋', color: 'bg-[#E3EED3]', accent: 'text-[#5A6F35]' },
    { icon: <Sparkles size={30} />, label: '共構解方', desc: '集體智慧，復原重建', color: 'bg-[#FDE8D8]', accent: 'text-[#C67B5C]' },
];

const problems = [
    {
        icon: <Layers size={24} className="text-blue-500" />,
        title: '資訊紛亂斷裂、門檻高',
        desc: '資訊紛亂、斷裂、專業壁壘，完整尋找門檻高',
    },
    {
        icon: <Eye size={24} className="text-[#7B8C4E]" />,
        title: '單一敘事與詮釋壟斷',
        desc: '有條件觀庭者僅少數，雙方敘述封閉於庭上、外界資訊均透過解讀詮釋，觀庭者掌握解釋權、論述各有切入點與場域影響，可獲得關注',
    },
    {
        icon: <MessageSquare size={24} className="text-[#C67B5C]" />,
        title: '對立衝突與無法傾聽',
        desc: '各自論述對立、衝突、難以理解彼此，也不去聽對方的語言',
    },
];

export default function GuidePage() {
    return (
        <div className="min-h-screen bg-[#FBF7F0] pt-20">
            <SubpageHeader />

            <Banner title="平台規範" subtitle="Platform Rules" bg="bg-orange-50" text="text-orange-600" />
            <section className="max-w-7xl mx-auto px-6 py-8">
                <FadeIn>
                    <div className="bg-white rounded-2xl p-6 md:p-8 border border-orange-100 shadow-sm">
                        <div className="max-w-3xl">
                            <h3 className="text-[24px] md:text-[30px] font-black text-gray-900 mb-3" style={serif}>發言與共構守則</h3>
                            <div className="space-y-4 text-[16px] md:text-[18px] text-[#5D5549] font-medium leading-relaxed">
                                <p>本網站還原筆記取自網路夥伴本身手記筆記提供，以及本網站團隊觀庭筆記本網站徵集。</p>
                                <p>為了維持專業論述的品質並守護實務工作者的法律安全，在投稿文章或發表專業見解前，請務必了解我們的「去識別化」及「免責原則」。</p>
                            </div>
                        </div>
                    </div>
                </FadeIn>
            </section>

            <Banner title="倫理規範與發言守則" subtitle="Ethics & Guidelines" bg="bg-[#F5E0E0]" text="text-[#8B3535]" />
            <section className="max-w-7xl mx-auto px-6 py-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {ethicsCards.map((card, i) => (
                        <FadeIn key={card.title} delay={i * 0.08}>
                            <motion.div whileHover={{ y: -4 }} className={`${card.bg} p-6 rounded-2xl border ${card.border} transition-all`}>
                                <motion.div whileHover={{ rotate: 8 }} className={`w-12 h-12 rounded-xl ${card.accent} bg-white/80 flex items-center justify-center mb-3`}>
                                    {card.icon}
                                </motion.div>
                                <h4 className="text-[22px] font-black mb-2 text-gray-900" style={serif}>{card.title}</h4>
                                <p className="text-[17px] text-[#6B6358] font-medium leading-relaxed">{card.desc}</p>
                            </motion.div>
                        </FadeIn>
                    ))}
                </div>
            </section>

            <Banner title="平台運作模式" subtitle="Workflow & Features" bg="bg-[#E0DAF0]" text="text-[#4A3D7B]" />
            <section className="max-w-7xl mx-auto px-6 py-8 pb-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {workflow.map((step, i) => (
                        <FadeIn key={step.title} delay={i * 0.1}>
                            <motion.div
                                whileHover={{ y: -4, boxShadow: '0 8px 25px rgba(0,0,0,0.08)' }}
                                className={`bg-white p-6 rounded-2xl border border-[#E8E0D4] border-l-4 ${step.borderC} shadow-sm transition-all h-full`}
                            >
                                <h4 className="text-[24px] font-black mb-4 text-gray-900" style={serif}>{step.title}</h4>
                                <ul className="space-y-3">
                                    {step.items.map((item) => (
                                        <li key={item} className="text-[17px] text-[#5A5347] font-medium flex items-start gap-2">
                                            <ChevronRight size={18} className={`${step.accent} mt-1 shrink-0`} />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        </FadeIn>
                    ))}
                </div>
            </section>

            <Banner title="這個平台在做什麼？" subtitle="What We Do" bg="bg-[#E8E0D4]" text="text-[#3D3832]" />
            <section className="max-w-7xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {whatWeDo.map((item, i) => (
                        <FadeIn key={item.label} delay={i * 0.08}>
                            <motion.div
                                whileHover={{ y: -6, scale: 1.02 }}
                                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                                className={`${item.color} p-6 rounded-2xl border border-black/5 cursor-pointer group transition-shadow h-full`}
                            >
                                <motion.div
                                    whileHover={{ rotate: 8, scale: 1.15 }}
                                    transition={{ type: 'spring', stiffness: 400 }}
                                    className={`w-14 h-14 rounded-xl ${item.accent} bg-white/60 flex items-center justify-center mb-3`}
                                >
                                    {item.icon}
                                </motion.div>
                                <p className="text-[22px] md:text-[24px] font-black text-[#2F2923]" style={serif}>{item.label}</p>
                                <p className="text-[15px] font-bold text-[#8A8078] mt-2 leading-relaxed">{item.desc}</p>
                            </motion.div>
                        </FadeIn>
                    ))}
                </div>
            </section>

            <Banner title="我們要解決什麼問題？" subtitle="Problems We Solve" bg="bg-[#E8D5B8]" text="text-[#8B4D35]" />
            <section className="max-w-7xl mx-auto px-6 py-8 pb-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
                    <div className="hidden md:block absolute top-[40%] left-[15%] right-[15%] h-[2px] bg-gradient-to-r from-[#7B8C4E] via-[#B8860B] to-[#C67B5C] opacity-30 z-0"></div>
                    <motion.div
                        animate={{ scaleX: [0, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="hidden md:block absolute top-[40%] left-[15%] right-[15%] h-[2px] bg-gradient-to-r from-[#7B8C4E] via-[#B8860B] to-[#C67B5C] z-0 origin-left"
                    />

                    {problems.map((step, i) => (
                        <FadeIn key={step.title} delay={i * 0.1} className="relative z-10">
                            <motion.div whileHover={{ y: -5 }} className="bg-white/80 backdrop-blur p-6 rounded-3xl border border-[#E8E0D4] shadow-sm text-center h-full">
                                <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-4 border border-gray-100">{step.icon}</div>
                                <h4 className="text-[20px] font-black mb-3 text-gray-800" style={serif}>{step.title}</h4>
                                <p className="text-[15px] text-[#6B6358] font-bold leading-relaxed">{step.desc}</p>
                            </motion.div>
                        </FadeIn>
                    ))}
                </div>
            </section>
        </div>
    );
}
