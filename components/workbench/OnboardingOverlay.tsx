'use client';

import React from 'react';
import { BookOpen, PenTool, Quote, X } from 'lucide-react';

const serif = { fontFamily: "'Noto Serif TC', serif" };

interface Props {
    show: boolean;
    onDismiss: () => void;
}

export default function OnboardingOverlay({ show, onDismiss }: Props) {
    if (!show) return null;

    return (
        <div className="fixed inset-0 z-[90] flex items-end justify-center bg-black/40 backdrop-blur-sm">
            <div className="w-full max-w-lg rounded-t-3xl bg-white px-6 pb-10 pt-8 shadow-2xl">
                <div className="mb-5 flex items-center justify-between">
                    <h2 className="text-[20px] font-black text-[#2D2A26]" style={serif}>
                        快速上手
                    </h2>
                    <button
                        onClick={onDismiss}
                        aria-label="關閉"
                        className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100"
                    >
                        <X size={18} />
                    </button>
                </div>
                <div className="space-y-4">
                    <div className="flex gap-4 rounded-2xl bg-[#F4F1EC] p-4">
                        <div className="shrink-0 rounded-xl bg-white p-2.5 shadow-sm">
                            <BookOpen size={18} className="text-[#6B8E23]" />
                        </div>
                        <div>
                            <p className="text-[14px] font-black text-[#2D2A26]">閱讀</p>
                            <p className="mt-0.5 text-[13px] font-medium leading-snug text-[#6B5A4A]">
                                閱讀逐字紀錄，了解法庭現場。
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-4 rounded-2xl border border-[#DDE6C8] bg-[#F0F7E0] p-4">
                        <div className="shrink-0 rounded-xl bg-white p-2.5 shadow-sm">
                            <Quote size={18} className="text-[#6B8E23]" />
                        </div>
                        <div>
                            <p className="text-[14px] font-black text-[#2D2A26]">逐段填寫</p>
                            <p className="mt-0.5 text-[13px] font-medium leading-snug text-[#4A5E28]">
                                點擊任一段落填寫觀點。填完後點「彙整」，筆記會自動帶入編輯器。
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-4 rounded-2xl bg-[#6B8E23]/10 p-4">
                        <div className="shrink-0 rounded-xl bg-white p-2.5 shadow-sm">
                            <PenTool size={18} className="text-[#6B8E23]" />
                        </div>
                        <div>
                            <p className="text-[14px] font-black text-[#2D2A26]">書寫筆記</p>
                            <p className="mt-0.5 text-[13px] font-medium leading-snug text-[#4A5E28]">
                                自由撰寫或整理筆記。填標題後送出審核，通過即公開在觀庭筆記匯集區。
                            </p>
                        </div>
                    </div>
                </div>
                <button
                    onClick={onDismiss}
                    className="mt-6 w-full rounded-2xl bg-[#6B8E23] py-3.5 text-[15px] font-black text-white shadow-md transition-colors hover:bg-[#5a781d]"
                >
                    開始閱讀
                </button>
            </div>
        </div>
    );
}
