'use client';

import React from 'react';
import { Flag } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';

const serif = { fontFamily: "'Noto Serif TC', serif" };

export interface ReportSegment {
    lineId: string;
    speaker: string;
    content: string;
}

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    segment: ReportSegment | null;
    text: string;
    onTextChange: (text: string) => void;
    submitting: boolean;
    submitted: boolean;
    onSubmit: () => void;
}

export default function ReportSheet({
    open,
    onOpenChange,
    segment,
    text,
    onTextChange,
    submitting,
    submitted,
    onSubmit,
}: Props) {
    return (
        <Sheet open={open} onOpenChange={(v) => { onOpenChange(v); }}>
            <SheetContent
                side="bottom"
                className="max-h-[80dvh] overflow-y-auto rounded-t-3xl border-t border-orange-100 bg-white px-6 py-8"
            >
                <SheetHeader className="mb-5 text-left">
                    <SheetTitle className="flex items-center gap-2 text-[18px] font-black text-[#2D2A26]">
                        <Flag size={16} className="text-orange-500" /> 回報此段內容問題
                    </SheetTitle>
                </SheetHeader>

                {submitted ? (
                    <div className="py-8 text-center">
                        <p className="text-[20px] font-black text-[#6B8E23]">已送出，謝謝你的回報</p>
                        <p className="mt-2 text-[14px] font-medium text-gray-500">我們會盡快確認並更正。</p>
                        <button
                            onClick={() => onOpenChange(false)}
                            className="mt-6 rounded-2xl bg-[#6B8E23] px-8 py-3 text-[14px] font-black text-white"
                        >
                            關閉
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {segment && (
                            <div className="rounded-xl border border-orange-100 bg-orange-50 p-4">
                                <p className="mb-1 text-[11px] font-black uppercase tracking-widest text-orange-600">
                                    {segment.speaker}
                                </p>
                                <p
                                    className="line-clamp-3 text-[14px] font-medium leading-[1.8] text-gray-700"
                                    style={serif}
                                >
                                    {segment.content}
                                </p>
                            </div>
                        )}
                        <div>
                            <label className="mb-1 block text-[13px] font-black text-gray-500">說明問題</label>
                            <textarea
                                value={text}
                                onChange={(e) => onTextChange(e.target.value)}
                                placeholder="例如：這段文字有誤，應該是⋯⋯"
                                rows={4}
                                className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-[14px] font-medium leading-[1.8] outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-200"
                            />
                        </div>
                        <button
                            type="button"
                            onClick={onSubmit}
                            disabled={submitting || !text.trim()}
                            className="w-full rounded-2xl bg-orange-500 py-3 text-[15px] font-black text-white shadow-sm transition-colors hover:bg-orange-600 disabled:opacity-50"
                        >
                            {submitting ? '送出中…' : '送出回報'}
                        </button>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    );
}
