'use client';

import React, { RefObject } from 'react';
import { BookOpen, Flag, Quote } from 'lucide-react';
import { LocalTranscriptLine } from '@/lib/local-data';

const serif = { fontFamily: "'Noto Serif TC', serif" };

interface Props {
    transcript: LocalTranscriptLine[];
    isMobileLayout: boolean;
    activeLineId: string;
    transcriptContainerRef: RefObject<HTMLDivElement>;
    onInjectCitation: (lineId: string) => void;
    onReport: (lineId: string, speaker: string, content: string) => void;
}

export default function TranscriptPanel({
    transcript,
    isMobileLayout,
    activeLineId,
    transcriptContainerRef,
    onInjectCitation,
    onReport,
}: Props) {
    return (
        <div className={`flex flex-col bg-white ${isMobileLayout ? 'overflow-hidden rounded-2xl border border-gray-200 shadow-sm' : 'h-full'}`}>
            <div className="flex shrink-0 items-center justify-between gap-2 border-b border-gray-100 bg-gray-50 p-4">
                <h2 className="flex items-center gap-2 text-sm font-black text-gray-700">
                    <BookOpen size={16} className="text-[#6B8E23]" /> 逐字紀錄
                </h2>
                <span className="rounded border border-gray-100 bg-white px-2 py-1 text-[10px] font-bold text-gray-400">
                    點擊段落可引用
                </span>
            </div>

            <div
                ref={transcriptContainerRef}
                className={`custom-scrollbar relative space-y-2 bg-gradient-to-b from-white to-[#FAFAFA] ${
                    isMobileLayout ? 'max-h-none p-4' : 'flex-1 overflow-y-auto p-6 md:p-8'
                }`}
            >
                {transcript.length === 0 ? (
                    <div className="animate-pulse py-20 text-center text-sm font-bold text-gray-400">
                        目前尚無逐字內容
                    </div>
                ) : transcript.map((item, idx) => {
                    const lineId = item.lineId || item.id;
                    const isStage = item.type === 'stage';
                    const speakerLabel = item.speaker || item.role || '未標示';
                    const isActive = activeLineId === lineId;

                    if (isStage) {
                        return (
                            <div key={item.id || idx} className="py-6 text-center">
                                <span className="rounded-full border border-[#6B8E23]/20 bg-[#F9FBE7] px-5 py-1.5 text-[11px] font-black tracking-widest text-[#6B8E23]">
                                    {item.content}
                                </span>
                            </div>
                        );
                    }

                    return (
                        <div
                            key={item.id}
                            id={`line-${lineId}`}
                            onClick={() => onInjectCitation(lineId)}
                            className={`group relative cursor-pointer rounded-[1.5rem] border p-5 transition-all md:p-6 ${
                                isActive
                                    ? 'border-[#C9D9A3] bg-[#F9FBE7] shadow-md ring-2 ring-[#DDE6C8]'
                                    : 'border-transparent hover:border-gray-200 hover:bg-white hover:shadow-md'
                            }`}
                            title="點擊即可插入引用"
                        >
                            <div className="flex flex-col gap-2 lg:flex-row lg:gap-6">
                                <div className="shrink-0 pt-1 text-[12px] font-black uppercase tracking-widest text-[#6B8E23] lg:w-24">
                                    {speakerLabel}
                                </div>
                                <div className="flex-1">
                                    <p className="text-[15px] font-medium leading-[1.8] text-gray-700 md:text-[16px]" style={serif}>
                                        {item.content}
                                    </p>
                                </div>
                            </div>

                            {!isMobileLayout ? (
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5 opacity-0 transition-opacity group-hover:opacity-100">
                                    <button
                                        type="button"
                                        onClick={(e) => { e.stopPropagation(); onReport(lineId, speakerLabel, item.content); }}
                                        title="回報此段錯誤"
                                        className="rounded-full bg-white p-2 text-gray-400 shadow-md ring-1 ring-gray-200 hover:text-orange-500"
                                    >
                                        <Flag size={13} />
                                    </button>
                                    <div className="rounded-full bg-[#6B8E23] p-2 text-white shadow-lg">
                                        <Quote size={14} />
                                    </div>
                                </div>
                            ) : (
                                <button
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); onReport(lineId, speakerLabel, item.content); }}
                                    className="absolute right-3 top-3 rounded-full p-1 text-gray-300 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100"
                                    aria-label="回報此段錯誤"
                                >
                                    <Flag size={12} />
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
