'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Home } from 'lucide-react';
import SubpageHeader from '@/components/SubpageHeader';
import { FadeIn, WarmGradientBg } from '@/components/ui-shared';

export default function NotFound() {
    return (
        <div className="relative min-h-screen overflow-x-hidden bg-[#FBF7F0]">
            <WarmGradientBg />
            <SubpageHeader />

            <div className="relative z-10 flex min-h-[calc(100vh-150px)] flex-col items-center justify-center px-4">
                <FadeIn delay={0} className="text-center">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        className="mb-8"
                    >
                        <div className="inline-block rounded-2xl bg-gradient-to-br from-[#7B8C4E]/10 to-[#C67B5C]/10 p-8">
                            <p className="text-[72px] font-black text-[#7B8C4E]" style={{ fontFamily: "'Noto Serif TC', serif" }}>
                                404
                            </p>
                        </div>
                    </motion.div>

                    <h1
                        className="mb-3 text-[32px] font-black text-[#2D2A26] md:text-[42px]"
                        style={{ fontFamily: "'Noto Serif TC', serif" }}
                    >
                        找不到這個頁面
                    </h1>

                    <p className="mb-8 text-[16px] text-[#5A5347]">
                        你要前往的內容可能已經移動、尚未公開，或是網址輸入錯誤。我們先帶你回到可閱讀的正式頁面。
                    </p>

                    <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                        <Link
                            href="/"
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#7B8C4E] bg-[#7B8C4E] px-6 py-3 text-[15px] font-black text-white transition-all hover:bg-[#6B8E23]"
                        >
                            <Home size={18} />
                            回到首頁
                        </Link>
                        <button
                            onClick={() => window.history.back()}
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#E8E0D4] bg-white px-6 py-3 text-[15px] font-black text-[#5A5347] transition-all hover:bg-[#FBF7F0]"
                        >
                            <ArrowLeft size={18} />
                            返回上一頁
                        </button>
                    </div>
                </FadeIn>
            </div>

            <div className="h-[60px]" />
        </div>
    );
}
