'use client';

import React from 'react';
import { Flag } from 'lucide-react';
import { LocalTranscriptLine } from '@/lib/local-data';

const serif = { fontFamily: "'Noto Serif TC', serif" };

interface Props {
    transcript: LocalTranscriptLine[];
    inlineNotes: Record<string, string>;
    expandedLineId: string | null;
    onExpandToggle: (_lineId: string) => void;
    onNoteChange: (_lineId: string, _value: string) => void;
    onReport: (_lineId: string, _speaker: string, _content: string) => void;
}

export default function InlinePanel({
    transcript,
    inlineNotes,
    expandedLineId,
    onExpandToggle,
    onNoteChange,
    onReport,
}: Props) {
    return (
        <div className="space-y-2">
            {transcript.length === 0 ? (
                <div className="py-20 text-center text-sm font-bold text-gray-400">目前尚無逐字內容</div>
            ) : transcript.map((item, idx) => {
                const lineId = item.lineId || item.id;
                const isStage = item.type === 'stage';
                const speakerLabel = item.speaker || item.role || '未標示';
                const isExpanded = expandedLineId === lineId;
                const noteValue = inlineNotes[lineId] || '';
                const hasFilled = noteValue.trim().length > 0;

                if (isStage) {
                    return (
                        <div key={item.id || idx} className="py-4 text-center">
                            <span className="rounded-full border border-[#6B8E23]/20 bg-[#F9FBE7] px-5 py-1.5 text-[11px] font-black tracking-widest text-[#6B8E23]">
                                {item.content}
                            </span>
                        </div>
                    );
                }

                return (
                    <div key={item.id} id={`inline-line-${lineId}`}>
                        <div
                            onClick={() => onExpandToggle(lineId)}
                            className={`cursor-pointer rounded-[1.5rem] border p-5 transition-all ${
                                hasFilled
                                    ? 'border-[#C9D9A3] bg-[#F9FBE7]'
                                    : isExpanded
                                        ? 'border-[#DDE6C8] bg-white shadow-md'
                                        : 'border-transparent hover:border-gray-200 hover:bg-white hover:shadow-sm'
                            }`}
                        >
                            <div className="flex items-start gap-3">
                                <div className="shrink-0 pt-0.5 text-[11px] font-black uppercase tracking-widest text-[#6B8E23] lg:w-24">
                                    {speakerLabel}
                                </div>
                                <p className="flex-1 text-[15px] font-medium leading-[1.8] text-gray-700" style={serif}>
                                    {item.content}
                                </p>
                                <div className="flex shrink-0 items-center gap-1">
                                    <button
                                        type="button"
                                        onClick={(e) => { e.stopPropagation(); onReport(lineId, speakerLabel, item.content); }}
                                        className="rounded-full p-1 text-gray-300 hover:text-orange-400"
                                        aria-label="回報此段錯誤"
                                    >
                                        <Flag size={12} />
                                    </button>
                                    <span className={`text-[11px] font-black transition-colors ${hasFilled ? 'text-[#6B8E23]' : 'text-gray-300'}`}>
                                        {hasFilled ? '✓' : '+'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {isExpanded && (
                            <div className="mx-2 mb-2 rounded-b-[1.5rem] rounded-t-lg border border-[#DDE6C8] border-t-0 bg-white px-4 pb-4 pt-3 shadow-sm">
                                <p className="mb-2 text-[11px] font-black text-[#8A8078]">
                                    針對這段話，寫下你的觀點、感受或分析
                                </p>
                                <textarea
                                    value={noteValue}
                                    onChange={(e) => onNoteChange(lineId, e.target.value)}
                                    placeholder="例如：這段問答中，法官的切入點是⋯⋯"
                                    rows={4}
                                    className="w-full resize-none rounded-xl border border-gray-200 bg-[#FAFEF5] px-4 py-3 text-[14px] font-medium leading-[1.8] text-gray-800 outline-none focus:border-[#6B8E23] focus:ring-1 focus:ring-[#6B8E23]/20"
                                />
                                <div className="mt-2 flex justify-end">
                                    <button
                                        type="button"
                                        onClick={() => onExpandToggle(lineId)}
                                        className="rounded-lg px-4 py-2 text-[13px] font-black text-[#6B8E23] hover:bg-[#F4FAEB]"
                                    >
                                        {noteValue.trim() ? '儲存並收起' : '收起'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
