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
];

const openingParagraphs2 = [
    '我們清楚彼此都希望世界更好、孩子更好。',
    '在漫長的沉澱與思量後，終於找到了屬於我們的答案，並將這個答案化為實際行動。'
];

const problems = [
    {
        title: '資訊紛亂斷裂、門檻高',
        desc: '資訊紛亂、斷裂、專業壁壘，完整尋找門檻高'
    },
    {
        title: '單一敘事與詮釋壟斷',
        desc: '有條件觀庭者僅少數，雙方敘述封閉於庭上、外界資訊均透過解讀詮釋，觀庭者掌握解釋權、論述各有切入點與場域影響，可獲得關注'
    },
    {
        title: '對立衝突與無法傾聽',
        desc: '各自論述對立、衝突、難以理解彼此，也不去聽對方的語言'
    }
];

const workflow = [
    {
        title: '前期 — 本團隊工作',
        items: ['實際參與所有場次形成筆記', '蒐集觀庭多元筆記校對補缺', '蒐集案整體相關資料']
    },
    {
        title: '呈現',
        items: ['觀庭現場還原筆記', '即時論壇與評論投稿機制', '形成論述探討、交流']
    },
    {
        title: '最後',
        items: ['共構本事件之復原計畫和共識', '透過集體智慧建立新的準則與論述']
    }
];

const goals = [
    { title: '整合資訊', desc: '打破壁壘，降低門檻' },
    { title: '觀庭還原', desc: '身歷其境，完整還原' },
    { title: '觀庭評述', desc: '就本案呈現真實狀況評述' },
    { title: '建構論壇', desc: '匿名交流，平等詮釋' },
    { title: '共構解方', desc: '集體智慧，復原重建' }
];

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-[#FBF7F0]">
            <SubpageHeader variant="dark" />
            
            {/* Section 1: Hero & Opening */}
            <section className="relative w-full overflow-hidden bg-[#0A0A0A] pt-20 text-white">
                <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-[#7B8C4E] via-[#6E8240]/70 to-transparent z-50 pointer-events-none" />

                <div className="relative">
                    <div className="sticky top-0 h-[60vh] w-full overflow-hidden z-0">
                        <motion.div
                            className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-luminosity scale-110"
                            style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=2000")' }}
                            initial={{ scale: 1.2, opacity: 0 }}
                            whileInView={{ scale: 1, opacity: 0.4 }}
                            transition={{ duration: 10, ease: 'easeOut' }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/80" />
                    </div>

                    <div className="relative z-10 -mt-[50vh] pb-[10vh] max-w-5xl mx-auto px-6">
                        <motion.div
                            initial={{ opacity: 0, y: 100 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1.5, ease: 'easeOut' }}
                            className="text-center space-y-8"
                        >
                            <div className="inline-block">
                                <span className="text-[#C67B5C] font-black tracking-[0.4em] uppercase text-sm mb-4 block">About This Project</span>
                                <h2 className="text-6xl md:text-8xl font-black text-white tracking-tighter" style={serif}>計畫緣起</h2>
                                <div className="h-1 w-24 bg-[#C67B5C] mx-auto mt-6" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start text-left">
                                <div className="md:col-span-1 hidden md:block border-l border-white/20 h-full" />
                                <div className="md:col-span-10 text-xl md:text-2xl text-gray-300 leading-[2] font-serif italic space-y-6">
                                    <p className="first-letter:text-5xl first-letter:font-black first-letter:text-white first-letter:mr-3 first-letter:float-left">
                                        事件發生至今，我們觀察到<span className="text-[#C67B5C] font-black mx-1 drop-shadow-sm">社會工作</span>這個職業頻繁出現在民眾的視野裡，相關的話題與交流變得更加頻繁。
                                    </p>
                                    {openingParagraphs.slice(1).map((p, i) => <p key={i}>{p}</p>)}

                                    <div className="py-8 border-y border-white/10 my-8">
                                        <p className="text-white font-black text-2xl md:text-3xl text-center tracking-widest bg-white/5 py-8 px-6 rounded-2xl leading-relaxed" style={serif}>
                                            「 我們希望可以保護彼此，沒有人因此受傷。」<br className="hidden md:block"/>
                                            「我們希望彼此傾聽理解，並可以共構解方，而非各自論述，可以合作而非對立。」
                                        </p>
                                    </div>

                                    {openingParagraphs2.map((p, i) => <p key={i}>{p}</p>)}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Section 2: Problems & Transition */}
            <section className="relative min-h-[60vh] py-24 flex flex-col items-center justify-center bg-black z-20 text-white px-6">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    className="text-center max-w-4xl mx-auto space-y-6"
                >
                    <h3 className="text-4xl md:text-6xl font-black text-white leading-tight mb-6" style={serif}>
                        我們看見了問題<br/>並思考解決的方法
                    </h3>
                    <p className="text-xl md:text-2xl text-gray-400 font-serif italic">
                        我們面對的，不只是資訊不足，而是資訊如何被切割、被壟斷、被各自詮釋後，逐漸讓人失去理解彼此的能力。
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mt-16">
                    {problems.map((p, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: i * 0.2 }}
                            className="bg-white/5 border border-white/10 p-8 rounded-2xl backdrop-blur-sm"
                        >
                            <h4 className="text-2xl font-bold text-[#C67B5C] mb-4" style={serif}>{p.title}</h4>
                            <p className="text-gray-300 leading-relaxed">{p.desc}</p>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.5 }}
                    className="text-center mt-24 max-w-3xl mx-auto"
                >
                    <p className="text-xl md:text-2xl text-gray-400 leading-relaxed mb-12">
                        在雙方獲得的資訊、情境、詮釋均不同，這種「語言不通」的情況下是不可能達成共識、共同合作的。<br/><br/>
                        因此唯有創造大家都能接受的「第三方語言」才有機會尋求和解。
                    </p>
                    <div className="max-w-xl mx-auto h-[1px] bg-gradient-to-r from-transparent via-gray-500 to-transparent my-10" />
                    <h3 className="text-5xl md:text-7xl font-black text-white leading-tight" style={serif}>
                        所以我們決定<br />
                        <span className="text-[#C67B5C] blur-[1px] hover:blur-0 transition-all mt-4 block">「讓事實成為第三方語言」</span>
                    </h3>
                    <p className="text-lg md:text-xl text-gray-500 mt-10">
                        在這樣的背景下，我們開始著手打造這個網站，目標是提供雙方一個理性溝通、突破認知閉鎖的機會。
                    </p>
                </motion.div>
            </section>

            {/* Section 3: Workflow & Platform */}
            <section className="relative w-full overflow-hidden bg-[#0A0A0A] text-white">
                <div className="sticky top-0 h-[60vh] w-full overflow-hidden z-0">
                    <motion.div
                        className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-screen"
                        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1465447142348-e9952c393450?auto=format&fit=crop&q=80&w=2000")' }}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 0.3 }}
                        transition={{ duration: 4 }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#E8E0D4] via-black/90 to-black" />
                </div>

                <div className="relative z-10 -mt-[50vh] pb-24 max-w-5xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1.5 }}
                        className="space-y-16"
                    >
                        <div className="text-center">
                            <h3 className="text-4xl md:text-5xl font-black text-white mb-6" style={serif}>我們團隊將透過</h3>
                            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                                將觀庭、彙整、呈現與共構討論串連成一條清楚的行動路徑，讓這個網站不只是資訊倉庫，而是一套能夠陪伴理解、對照與形成論述的公共工作系統。
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {workflow.map((w, i) => (
                                <div key={i} className="bg-black/40 backdrop-blur-md border border-white/20 p-8 rounded-2xl shadow-xl">
                                    <h4 className="text-2xl font-black text-[#7B8C4E] mb-6 border-b border-white/20 pb-4" style={serif}>{w.title}</h4>
                                    <ul className="space-y-5">
                                        {w.items.map((item, j) => (
                                            <li key={j} className="text-white text-lg md:text-xl font-medium flex items-start drop-shadow-md">
                                                <span className="text-[#C67B5C] mr-3 text-2xl leading-none">•</span>
                                                <span className="leading-relaxed">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>

                        <div className="bg-white/10 backdrop-blur-xl p-8 md:p-12 rounded-[2rem] border border-white/20 shadow-2xl mt-16">
                            <p className="text-white text-lg md:text-xl leading-relaxed text-center mb-10">
                                這裡完善後將彙整這個事件相對真實的文獻，匯集了各種跟事件有關的知識與規則理解，並且提供了可以從還原筆記中直接摘述語句的工作檯，可以對於還原筆記內容進行對照並形成自己的論述。
                            </p>
                            <h4 className="text-2xl font-bold text-center text-[#F0D8B6] mb-8" style={serif}>我們希望以此達到</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6">
                                {goals.map((g, i) => (
                                    <div key={i} className="bg-black/60 p-6 rounded-2xl text-center border border-white/10 shadow-lg hover:bg-black/80 transition-colors">
                                        <h5 className="text-[#C67B5C] text-2xl font-black mb-3" style={serif}>{g.title}</h5>
                                        <p className="text-base md:text-lg text-gray-200 font-medium">{g.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Section 4: Closing */}
            <section className="bg-[#E8E0D4] py-24 px-6 text-[#2F2923]">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    className="max-w-4xl mx-auto space-y-8 text-lg md:text-xl leading-relaxed font-medium"
                >
                    <div className="text-center mb-12">
                        <div className="w-16 h-1 bg-[#C67B5C] mx-auto mb-8" />
                        <h3 className="text-3xl md:text-4xl font-black mb-8" style={serif}>我們團隊將以此為目的竭力努力</h3>
                    </div>

                    <p>
                        <span className="text-4xl md:text-5xl font-black text-red-700 mr-1 align-baseline" style={serif}>但</span>
                        我們並沒有要促成某一方想要的願景或結果，甚至共構解方也不是我們的最終目的。
                    </p>
                    <p className="text-2xl font-bold text-[#8B5A3C] py-4">我們只希望所有答案都是來自「自己」，而非他人詮釋或引導的結果。</p>
                    <p>如果這個網站能順利運行——</p>
                    <p>從此，觀庭筆記不再是少數人的行動，而是我們集體的行動。</p>
                    <p>因此，對事件的詮釋不再由他人轉述，我們每個人都可以尋求自己的答案。</p>

                    <blockquote className="mt-12 p-8 border-l-4 border-[#C67B5C] bg-white/50 rounded-r-2xl shadow-sm">
                        <p className="text-xl md:text-2xl font-bold leading-relaxed" style={serif}>
                            希冀，不管最終是戰、是合、是憤、是悲，決定用什麼方式去應對這個事件的負面效應，那都是在有足夠的資訊後，我們自己的判斷與解讀最後形成屬於自己的.......
                        </p>
                        <div className="mt-12 mb-4 text-center">
                            <span className="relative inline-block">
                                <span className="absolute -inset-6 bg-[#C67B5C]/20 blur-2xl rounded-full z-0"></span>
                                <span className="relative z-10 text-6xl md:text-8xl font-black tracking-widest text-[#8B5A3C] drop-shadow-xl" style={serif}>
                                    「答案」
                                </span>
                            </span>
                        </div>
                    </blockquote>
                </motion.div>
            </section>

        </div>
    );
}
