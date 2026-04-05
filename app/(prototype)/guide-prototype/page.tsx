'use client';

import React from 'react';
import { motion } from 'framer-motion';
import SubpageHeader from '@/components/SubpageHeader';

const serif = { fontFamily: "'Noto Serif TC', serif" };

const openingParagraphs = [
    '事件發生至今，我們觀察到社會工作這個職業頻繁出現在民眾的視野裡，相關的話題與交流變得更加頻繁。',
    '然而「講著不同語言」、「活在不同邏輯脈絡裡的人們」雖然都基立於相同的事件，可資訊的取得與視角、觀點完全平行，交流往往演變成衝突並加深對彼此的惡感。',
    '拉遠來看，我們都持續受傷著，隨著這個事件不斷演進，彼此都在受傷著。',
    '本團隊自114年12月11日首次觀庭後，開始就社會工作夥伴進行訪談與文獻探討，並積極與民眾社群互動對話，過程中不斷思索目前因本事件影起的負面效應，應如何去歸因並找到一個可以善盡專業責任、展現專業正面姿態的具體行動。',
    '透過不斷的對話，作為社會工作者的一員，我們深知那些創傷與壓迫、困境；同時我們也聽到民眾對於失序悲痛，需要對於真相的釐清和獲得秩序。',
    '我們希望可以保護彼此，沒有人因此受傷，可以合作而非對立，我們希望彼此傾聽理解，並可以共構解方，而非各自論述。',
    '我們清楚彼此都希望世界更好、孩子更好。',
    '在漫長的沉澱與思量後，終於找到了屬於我們的答案，並將這個答案化為實際行動。',
];

const problems = [
    {
        title: '資訊紛亂斷裂、門檻高',
        desc: '資訊紛亂、斷裂、專業壁壘，完整尋找門檻高',
    },
    {
        title: '單一敘事與詮釋壟斷',
        desc: '有條件觀庭者僅少數，雙方敘述封閉於庭上、外界資訊均透過解讀詮釋，觀庭者掌握解釋權、論述各有切入點與場域影響，可獲得關注',
    },
    {
        title: '對立衝突與無法傾聽',
        desc: '各自論述對立、衝突、難以理解彼此，也不去聽對方的語言',
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
    },
    {
        title: '呈現',
        items: [
            '觀庭現場還原筆記',
            '即時論壇與評論投稿機制',
            '形成論述探討、交流',
        ],
    },
    {
        title: '最後',
        items: [
            '共構本事件之復原計畫和共識',
            '透過集體智慧建立新的準則與論述',
        ],
    },
];

const goals = [
    ['整合資訊', '打破壁壘，降低門檻'],
    ['觀庭還原', '身歷其境，完整還原'],
    ['觀庭評述', '就本案呈現真實狀況評述'],
    ['建構論壇', '匿名交流，平等詮釋'],
    ['共構解方', '集體智慧，復原重建'],
];

const closingParagraphs = [
    '我們團隊將以此為目的竭力努力',
    '但我們並沒有要促成某一方想要的願景或結果，甚至共構解方也不是我們的最終目的。',
    '我們只希望所有答案都是來自「自己」，而非他人詮釋或引導的結果。',
    '如果這個網站能順利運行-',
    '從此，觀庭筆記不再是少數人的行動，而是我們集體的行動。',
    '因此，對事件的詮釋不再由他人轉述，我們每個人都可以尋求自己的答案。',
    '希冀，不管最終是戰、是合、是憤、是悲，決定用什麼方式去應對這個事件的負面效應，那都是在有足夠的資訊後，我們自己的判斷與解讀最後形成屬於自己的「答案」。',
];

function SectionLabel({ en, zh }: { en: string; zh: string }) {
    return (
        <div className="space-y-3">
            <div className="h-px w-20 bg-[#C67B5C]" />
            <p className="text-[#C67B5C] text-sm font-black tracking-[0.28em] uppercase">{en}</p>
            <h2 className="text-3xl md:text-5xl font-black text-[#2F2923] leading-tight" style={serif}>
                {zh}
            </h2>
        </div>
    );
}

export default function GuidePrototypePage() {
    return (
        <div className="min-h-screen bg-[#FBF7F0]">
            <SubpageHeader variant="dark" />

            <section className="relative overflow-hidden bg-[#0A0A0A] pt-20 text-white">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(198,123,92,0.18),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(123,140,78,0.12),transparent_34%)]" />
                <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-[#7B8C4E] via-[#6E8240]/70 to-transparent pointer-events-none z-20" />

                <div className="sticky top-0 h-[64vh] w-full overflow-hidden">
                    <motion.div
                        className="absolute inset-0 bg-cover bg-center opacity-35 mix-blend-luminosity scale-110"
                        style={{ backgroundImage: 'url("/images/about_solemn_bg.png")' }}
                        initial={{ scale: 1.15, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 0.35 }}
                        transition={{ duration: 8, ease: 'easeOut' }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/40 to-black/88" />
                </div>

                <div className="relative z-10 -mt-[52vh] max-w-5xl mx-auto px-6 pb-[10vh]">
                    <motion.div
                        initial={{ opacity: 0, y: 80 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.2, ease: 'easeOut' }}
                        className="text-center"
                    >
                        <span className="text-[#C67B5C] font-black tracking-[0.4em] uppercase text-sm mb-4 block">Project Intention</span>
                        <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter" style={serif}>計畫初衷</h1>
                        <div className="h-1 w-24 bg-[#C67B5C] mx-auto mt-6 mb-12" />

                        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 text-left">
                            <div className="md:col-span-1 hidden md:block border-l border-white/20" />
                            <div className="md:col-span-10 space-y-7 text-xl md:text-2xl leading-[2] font-serif italic text-[#E5DED4]">
                                <p className="first-letter:text-5xl first-letter:font-black first-letter:text-white first-letter:mr-3 first-letter:float-left">
                                    {openingParagraphs[0]}
                                </p>
                                {openingParagraphs.slice(1, 5).map((paragraph) => (
                                    <p key={paragraph}>{paragraph}</p>
                                ))}

                                <motion.blockquote
                                    initial={{ opacity: 0, scale: 0.96 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.8 }}
                                    className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/6 px-8 py-8 shadow-[0_18px_60px_rgba(0,0,0,0.24)]"
                                >
                                    <div className="absolute inset-y-0 left-0 w-1.5 bg-[#C67B5C]" />
                                    <p className="text-2xl md:text-3xl font-black leading-[1.7] text-white" style={serif}>
                                        我們希望可以保護彼此，
                                        <br />
                                        沒有人因此受傷，
                                        <br />
                                        可以合作而非對立。
                                    </p>
                                    <p className="mt-6 text-lg md:text-xl leading-[1.9] text-[#E5DED4]">
                                        我們希望彼此傾聽理解，並可以共構解方，而非各自論述。
                                    </p>
                                </motion.blockquote>

                                {openingParagraphs.slice(6).map((paragraph) => (
                                    <p key={paragraph}>{paragraph}</p>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            <section className="relative overflow-hidden bg-black text-white py-20 md:py-28">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(198,123,92,0.18),transparent_28%),radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_52%)]" />
                <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
                    <motion.h2
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1 }}
                        className="text-4xl md:text-7xl lg:text-[5.4rem] font-black leading-[1.12] tracking-tight"
                        style={serif}
                    >
                        我們看見了問題
                        <br />
                        <span className="inline-block text-[#F0D8B6] drop-shadow-[0_0_24px_rgba(240,216,182,0.25)]">
                            並思考解決的方法
                        </span>
                    </motion.h2>
                    <div className="max-w-3xl mx-auto h-px bg-gradient-to-r from-transparent via-gray-500 to-transparent my-8" />
                    <motion.p
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.9, delay: 0.15 }}
                        className="text-xl md:text-2xl font-black tracking-[0.24em] text-[#F0D8B6]"
                    >
                        讓事實成為第三方語言
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.9, delay: 0.25 }}
                        className="mt-6 space-y-4 text-base md:text-xl leading-[1.95] text-gray-300 max-w-4xl mx-auto"
                    >
                        <p>在雙方獲得的資訊、情境、詮釋均不同，這種「語言不通」的情況下是不可能達成共識、共同合作的。</p>
                        <p>因此唯有創造大家都能接受的「第三方語言」才有機會尋求和解。</p>
                        <p>在這樣的背景下，我們開始著手打造這個網站，目標是提供雙方一個理性溝通、突破認知閉鎖的機會。</p>
                    </motion.div>
                </div>
            </section>

            <section className="relative bg-[#FBF7F0] py-16 md:py-20">
                <div className="max-w-6xl mx-auto px-6 space-y-14">
                    <motion.div
                        initial={{ opacity: 0, y: 28 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                        className="grid grid-cols-1 lg:grid-cols-[0.95fr_1.05fr] gap-10 items-start"
                    >
                        <div className="lg:sticky lg:top-24">
                            <SectionLabel en="Problems We Solve" zh="所以這個網站要解決的問題是" />
                            <div className="mt-8 text-[17px] md:text-[19px] leading-[1.95] text-[#5D5549] font-medium">
                                <p>我們面對的，不只是資訊不足，而是資訊如何被切割、被壟斷、被各自詮釋後，逐漸讓人失去理解彼此的能力。</p>
                            </div>
                        </div>

                        <div className="space-y-8">
                            {problems.map((item, index) => (
                                <motion.article
                                    key={item.title}
                                    initial={{ opacity: 0, x: 28 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.55, delay: index * 0.08 }}
                                    className="relative overflow-hidden rounded-[2rem] border border-[#E9DCC8] bg-white p-8 shadow-[0_18px_55px_rgba(31,20,10,0.08)]"
                                >
                                    <div className="absolute inset-y-0 left-0 w-1.5 bg-[#C67B5C]" />
                                    <h3 className="text-[28px] md:text-[34px] font-black text-[#2F2923] leading-tight" style={serif}>{item.title}</h3>
                                    <p className="mt-5 text-[17px] md:text-[18px] leading-[1.95] text-[#62584D] font-medium">{item.desc}</p>
                                </motion.article>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 28 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.05 }}
                        className="rounded-[2.2rem] overflow-hidden bg-[#15100C] text-white shadow-[0_24px_70px_rgba(0,0,0,0.24)]"
                    >
                        <div className="grid grid-cols-1 lg:grid-cols-[0.88fr_1.12fr]">
                            <div className="px-8 py-10 md:px-10 md:py-12 bg-[radial-gradient(circle_at_top_left,rgba(198,123,92,0.18),transparent_42%),radial-gradient(circle_at_bottom_right,rgba(123,140,78,0.16),transparent_34%)]">
                                <SectionLabel en="Workflow & Features" zh="我們團隊將透過" />
                                <div className="mt-8 text-[17px] md:text-[19px] leading-[1.95] text-[#E9DED3] font-medium">
                                    <p>將觀庭、彙整、呈現與共構討論串連成一條清楚的行動路徑，讓這個網站不只是資訊倉庫，而是一套能夠陪伴理解、對照與形成論述的公共工作系統。</p>
                                </div>
                            </div>

                            <div className="px-8 py-8 md:px-10 md:py-10 space-y-6">
                                {workflow.map((block, index) => (
                                    <motion.div
                                        key={block.title}
                                        initial={{ opacity: 0, x: 24 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.5, delay: index * 0.08 }}
                                        className="border-b border-white/12 pb-6 last:border-b-0 last:pb-0"
                                    >
                                        <h3 className="text-[28px] md:text-[34px] font-black text-white mb-4" style={serif}>{block.title}</h3>
                                        <div className="space-y-3">
                                            {block.items.map((item) => (
                                                <p key={item} className="text-[16px] md:text-[17px] leading-[1.9] text-[#F0E8DF] font-medium">
                                                    {item}
                                                </p>
                                            ))}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 28 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.08 }}
                        className="rounded-[2rem] border border-[#E9DCC8] bg-white p-8 md:p-10 shadow-[0_18px_55px_rgba(31,20,10,0.08)]"
                    >
                        <SectionLabel en="Reference & Working Platform" zh="這裡完善後將彙整這個事件相對真實的文獻" />
                        <div className="mt-8 space-y-4 text-[17px] md:text-[19px] leading-[1.95] text-[#5D5549] font-medium max-w-4xl">
                            <p>匯集了各種跟事件有關的知識與規則理解，並且提供了可以從還原筆記中直接摘述語句的工作檯，可以對於還原筆記內容進行對照並形成自己的論述。</p>
                            <p>我們希望以此達到</p>
                        </div>

                        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
                            {goals.map(([title, desc], index) => (
                                <motion.div
                                    key={title}
                                    initial={{ opacity: 0, y: 18 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.45, delay: index * 0.05 }}
                                    className="rounded-[1.5rem] border border-[#EEE2D1] bg-[#FBF7F0] p-5"
                                >
                                    <h3 className="text-[24px] font-black text-[#2F2923]" style={serif}>{title}</h3>
                                    <p className="mt-3 text-[15px] leading-[1.8] text-[#6A6054] font-medium">{desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.section
                        initial={{ opacity: 0, y: 28 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.1 }}
                        className="rounded-[2rem] overflow-hidden border border-[#E3D7C7] bg-[#FFF9F0] shadow-[0_18px_55px_rgba(38,23,12,0.12)]"
                    >
                        <div className="px-8 py-8 md:px-10 md:py-10 border-b border-[#E7DDCE] bg-[linear-gradient(135deg,rgba(255,255,255,0.72),rgba(245,232,214,0.76))]">
                            <p className="text-[#8B5A3C] text-sm font-black tracking-[0.28em] uppercase">Closing Intention</p>
                            <h2 className="text-[28px] md:text-[40px] font-black text-[#3D3832] mt-3 leading-tight" style={serif}>
                                最終希望達到的目的，
                                <br className="hidden md:block" />
                                也是我們對這個網站的期許。
                            </h2>
                        </div>
                        <div className="px-8 py-8 md:px-10 md:py-10 space-y-4 text-[17px] md:text-[18px] leading-[2] text-[#554D43]">
                            {closingParagraphs.map((paragraph) => (
                                <p key={paragraph}>{paragraph}</p>
                            ))}
                        </div>
                    </motion.section>
                </div>
            </section>
        </div>
    );
}
