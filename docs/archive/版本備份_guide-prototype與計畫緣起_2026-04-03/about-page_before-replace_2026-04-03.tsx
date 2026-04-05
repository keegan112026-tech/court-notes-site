'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';

const serif = { fontFamily: "'Noto Serif TC', serif" };

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-[#FBF7F0]">
            <Navbar />
            <section className="relative w-full overflow-hidden bg-[#0A0A0A] pt-20 text-white">
                <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-[#FBF7F0] to-transparent z-50 pointer-events-none" />

                <div className="relative">
                    <div className="sticky top-0 h-[60vh] w-full overflow-hidden z-0">
                        <motion.div
                            className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-luminosity scale-110"
                            style={{ backgroundImage: 'url("/images/about_solemn_bg.png")' }}
                            initial={{ scale: 1.2, opacity: 0 }}
                            whileInView={{ scale: 1, opacity: 0.4 }}
                            transition={{ duration: 10, ease: "easeOut" }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/80" />
                    </div>

                    <div className="relative z-10 -mt-[50vh] pb-[5vh] max-w-5xl mx-auto px-6">
                        <motion.div
                            initial={{ opacity: 0, y: 100 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
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
                                        剴剴案已成為助人專業領域集體議題，對民眾及助人領域均產生各項影響。為了因應衝擊，目前有許多令人尊敬的助人者挺身而出，也引發了各種對話。
                                    </p>
                                    <p>
                                        這些對話並非對立，而是對事件與問題有不同見解的人們，商議朝不同的方向前進，倡議、發聲、行動，不論是替社工報不平、還是與民眾對話、向上抗爭等等，均是為了這個專業群體而努力。
                                    </p>
                                    <div className="py-6 border-y border-white/10">
                                        <p className="text-white font-black text-2xl md:text-3xl text-center tracking-widest bg-white/5 py-4 rounded-lg">
                                            「 未有對錯，均為夥伴。」
                                        </p>
                                    </div>
                                    <p>
                                        我從114年12月11日起開始觀庭，並且加入民眾群組、社工群組、網絡社群，開始學習、觀察、諮詢與訪問，對各種對話與疑惑進行探討、歸因，尋求屬於我自己對事件的理解和問題認定。終於在115年2月26日訂下我對問題的理解，以及我想要去推動的解方。
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    <div className="relative min-h-[40vh] py-16 flex items-center justify-center bg-black z-20">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 2 }}
                            className="text-center px-6"
                        >
                            <h3 className="text-5xl md:text-8xl font-black text-white leading-tight mb-8" style={serif}>
                                「審判已然開始，<br />
                                <span className="text-red-900/80 blur-[1px] hover:blur-0 transition-all">審判也早已結束。」</span>
                            </h3>
                            <div className="max-w-2xl mx-auto h-[1px] bg-gradient-to-r from-transparent via-gray-500 to-transparent my-6" />
                            <p className="text-xl md:text-2xl text-gray-500 font-bold tracking-widest italic">
                                社會大眾與助人專業群體均是悲痛的、憤怒的、受傷的、挫敗的。<br />
                                不論判決結果如何，此間已然滿目瘡痍。
                            </p>
                        </motion.div>
                    </div>

                    <div className="sticky top-0 h-[60vh] w-full overflow-hidden z-0">
                        <motion.div
                            className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-screen"
                            style={{ backgroundImage: 'url("/images/about_hope_bg.png")' }}
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 0.3 }}
                            transition={{ duration: 4 }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#E8E0D4] via-black/90 to-black" />
                    </div>

                    <div className="relative z-10 -mt-[50vh] pb-12 max-w-4xl mx-auto px-6">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 1.5 }}
                            className="space-y-8"
                        >
                            <div className="space-y-6 text-xl md:text-2xl text-gray-300 leading-[2] font-medium">
                                <p>因此我的出發點，並不想放在糾結對錯與真相上，因為傷害與崩壞早已是事實。我想做的是從這個傷害中最務實、最深刻地去探究問題，探討如何修正、優化目前的工作困境，最終共構解方，避免再有人遭逢此難。</p>

                                <blockquote className="relative py-8 px-10 bg-white/5 backdrop-blur-md rounded-[2rem] border border-white/10 shadow-2xl overflow-hidden">
                                    <div className="absolute left-0 top-0 w-2 h-full bg-[#7B8C4E]" />
                                    <span className="absolute top-4 right-8 text-9xl text-white/5 font-serif italic select-none">"</span>
                                    <p className="text-2xl md:text-3xl text-white font-black leading-relaxed relative z-10" style={serif}>
                                        我要做的是從斷垣殘壁中回收價值、吸取經驗，建立新的共識與準則，在哀鴻遍野中開始重建、復原，讓我們的同伴們、後輩們，不再如此。
                                    </p>
                                </blockquote>

                                <div className="text-center py-10">
                                    <p className="italic text-[#C67B5C] font-black text-3xl md:text-4xl tracking-tighter leading-tight">
                                        這是用饅頭沾著已然流出的血淚，<br />
                                        轉化為成長滋糧的殘酷歷程。
                                    </p>
                                    <div className="mt-8 flex justify-center gap-2">
                                        {[1, 2, 3].map(i => <div key={i} className="w-2 h-2 rounded-full bg-[#C67B5C]/40" />)}
                                    </div>
                                </div>

                                <div className="bg-white/80 backdrop-blur-xl p-8 md:p-12 rounded-[2rem] border border-white shadow-2xl text-center">
                                    <p className="text-[#3D3832] font-black text-[22px] md:text-[24px] leading-relaxed">
                                        要做到這點，那就必須要先學習先備知識，<br />
                                        再從不經他人包裝詮釋的始末中做出判讀，<br />
                                        <span className="text-[#7B8C4E] text-4xl block mt-6 drop-shadow-sm" style={serif}>一起走到下一步：尋求解方。</span>
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>

                <div className="h-16 bg-gradient-to-t from-[#FBF7F0] to-transparent" />
            </section>
        </div>
    );
}
