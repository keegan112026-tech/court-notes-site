'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, PenTool } from 'lucide-react';

const serif = { fontFamily: "'Noto Serif TC', serif" };

interface Props {
    title: string;
    mobileMode: 'read' | 'inline' | 'edit';
    filledCount: number;
    mergeConfirming: boolean;
    onMergeConfirmStart: () => void;
    onMergeConfirmCancel: () => void;
    onMergeConfirm: () => void;
}

export default function MobileReadHeader({
    title,
    mobileMode,
    filledCount,
    mergeConfirming,
    onMergeConfirmStart,
    onMergeConfirmCancel,
    onMergeConfirm,
}: Props) {
    return (
        <header className="shrink-0 border-b border-[#E8E0D4] bg-white shadow-sm">
            <div className="flex items-center gap-2 px-3 py-3">
                <Link
                    href="/sessions"
                    className="inline-flex shrink-0 items-center gap-1 rounded-full border border-gray-100 bg-gray-50 px-3 py-1.5 text-sm font-bold text-gray-500 shadow-sm transition-colors hover:text-[#6B8E23]"
                >
                    <ArrowLeft size={15} /> 返回
                </Link>
                <h1 className="flex-1 truncate text-[14px] font-black text-[#2D2A26]" style={serif}>
                    {title || '載入中'}
                </h1>

                {mobileMode === 'inline' && filledCount > 0 && (
                    <div className="flex shrink-0 items-center gap-1.5">
                        {mergeConfirming ? (
                            <>
                                <button
                                    type="button"
                                    onClick={onMergeConfirmCancel}
                                    className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-[12px] font-bold text-gray-500"
                                >
                                    取消
                                </button>
                                <button
                                    type="button"
                                    onClick={onMergeConfirm}
                                    className="rounded-lg bg-[#6B8E23] px-3 py-1.5 text-[12px] font-black text-white shadow-sm"
                                >
                                    確定彙整
                                </button>
                            </>
                        ) : (
                            <button
                                type="button"
                                onClick={onMergeConfirmStart}
                                className="flex items-center gap-1.5 rounded-lg bg-[#F0F7E0] px-3 py-1.5 text-[12px] font-black text-[#4A5E28] ring-1 ring-[#C9D9A3]"
                            >
                                <PenTool size={12} />
                                已填 {filledCount} 段 → 彙整
                            </button>
                        )}
                    </div>
                )}
            </div>
        </header>
    );
}
