'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { AlertCircle, Home, RotateCcw } from 'lucide-react';
import { useEffect } from 'react';
import SubpageHeader from '@/components/SubpageHeader';
import { FadeIn, WarmGradientBg } from '@/components/ui-shared';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error('Page error:', error);
    }, [error]);

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
                        <div className="inline-block rounded-2xl bg-gradient-to-br from-[#C67B5C]/10 to-[#8A9A58]/10 p-8">
                            <AlertCircle className="mx-auto h-16 w-16 text-[#C67B5C]" />
                        </div>
                    </motion.div>

                    <h1
                        className="mb-3 text-[32px] font-black text-[#2D2A26] md:text-[42px]"
                        style={{ fontFamily: "'Noto Serif TC', serif" }}
                    >
                        頁面暫時發生錯誤
                    </h1>

                    <p className="mb-2 text-[16px] text-[#5A5347]">
                        這一頁剛剛沒有順利載入。我們已保留導覽入口，你可以重試一次，或先回到首頁繼續閱讀。
                    </p>
                    {process.env.NODE_ENV === 'development' && error.message && (
                        <p className="mb-6 rounded-lg border border-[#E8D5CC] bg-[#FFF5F0] p-3 font-mono text-[13px] text-[#C67B5C]">
                            {error.message}
                        </p>
                    )}

                    <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                        <button
                            onClick={() => reset()}
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#7B8C4E] bg-[#7B8C4E] px-6 py-3 text-[15px] font-black text-white transition-all hover:bg-[#6B8E23]"
                        >
                            <RotateCcw size={18} />
                            重新整理頁面
                        </button>
                        <Link
                            href="/"
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#E8E0D4] bg-white px-6 py-3 text-[15px] font-black text-[#5A5347] transition-all hover:bg-[#FBF7F0]"
                        >
                            <Home size={18} />
                            回到首頁
                        </Link>
                    </div>
                </FadeIn>
            </div>

            <div className="h-[60px]" />
        </div>
    );
}
