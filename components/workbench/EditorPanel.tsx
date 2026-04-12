'use client';

import React from 'react';
import { AlertCircle, Maximize2, PenTool } from 'lucide-react';
import { EditorContent, Editor } from '@tiptap/react';

interface Props {
    editor: Editor | null;
    isMobileLayout: boolean;
    articleTitle: string;
    authorName: string;
    contactEmail: string;
    submitState: string;
    editorLength: number;
    onTitleChange: (v: string) => void;
    onAuthorChange: (v: string) => void;
    onEmailChange: (v: string) => void;
}

export default function EditorPanel({
    editor,
    isMobileLayout,
    articleTitle,
    authorName,
    contactEmail,
    submitState,
    editorLength,
    onTitleChange,
    onAuthorChange,
    onEmailChange,
}: Props) {
    return (
        <div className={`flex flex-col bg-white ${isMobileLayout ? 'overflow-hidden rounded-2xl border border-gray-200 shadow-sm' : 'h-full'}`}>
            {/* 頂部標題列 */}
            <div className="flex shrink-0 items-center justify-between border-b border-gray-100 bg-[#F9FBE7]/50 p-4">
                <h2 className="flex items-center gap-2 text-sm font-black text-[#6B8E23]">
                    <PenTool size={16} /> 共構編輯
                </h2>
                <div className="flex items-center gap-2 rounded bg-orange-50 px-2 py-1 text-[10px] font-bold text-orange-600">
                    <AlertCircle size={12} /> 引用會自動標記來源
                </div>
            </div>

            {/* 工具列 */}
            <div className="shrink-0 overflow-x-auto border-b border-gray-100 bg-gray-50 p-2 px-4">
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => editor?.chain().focus().toggleBold().run()}
                        className={`rounded p-1.5 text-sm font-bold ${editor?.isActive('bold') ? 'bg-gray-200 text-gray-900' : 'text-gray-600 hover:bg-gray-200'}`}
                    >
                        B
                    </button>
                    <button
                        onClick={() => editor?.chain().focus().toggleItalic().run()}
                        className={`rounded p-1.5 text-sm font-serif italic ${editor?.isActive('italic') ? 'bg-gray-200 text-gray-900' : 'text-gray-600 hover:bg-gray-200'}`}
                    >
                        I
                    </button>
                    <div className="mx-1 h-4 w-px bg-gray-300" />
                    <div className="px-2 text-[10px] font-bold text-gray-400">
                        可從左側逐字稿快速插入引用
                    </div>
                </div>
            </div>

            {/* 投稿欄位 */}
            <div className="space-y-3 border-b border-gray-100 bg-white p-4">
                <input
                    value={articleTitle}
                    onChange={(e) => onTitleChange(e.target.value)}
                    placeholder="文章標題"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-bold text-gray-800 outline-none focus:border-[#6B8E23]"
                />
                <input
                    value={authorName}
                    onChange={(e) => onAuthorChange(e.target.value)}
                    placeholder="署名名稱（可匿名或填寫職稱）"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 outline-none focus:border-[#6B8E23]"
                />
                <input
                    value={contactEmail}
                    onChange={(e) => onEmailChange(e.target.value)}
                    placeholder="聯絡信箱（選填） Email"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 outline-none focus:border-[#6B8E23]"
                    inputMode="email"
                />
                {submitState && <p className="text-xs font-bold text-[#6B8E23]">{submitState}</p>}
            </div>

            {/* 編輯器主體 */}
            <div className={`relative ${isMobileLayout ? 'min-h-[28rem]' : 'flex-1 overflow-y-auto custom-scrollbar'}`}>
                <EditorContent editor={editor} className="workspace-editor h-full" />
                {!editor?.getText() && (
                    <div className="pointer-events-none absolute inset-x-0 top-1/3 -z-10 flex flex-col items-center justify-center text-gray-300">
                        <Maximize2 size={48} className="mb-4 opacity-50" />
                        <p className="text-sm font-bold opacity-70">開始整理你的觀庭觀點與專業筆記</p>
                    </div>
                )}
            </div>

            {/* 字數計數 */}
            <div className="flex items-center justify-end gap-2 border-t border-gray-100 bg-white px-4 py-2">
                {editorLength >= 9000 && editorLength < 10000 && (
                    <span className="text-[11px] font-bold text-amber-600">即將達到字數上限</span>
                )}
                {editorLength >= 10000 && (
                    <span className="text-[11px] font-bold text-red-600">已達上限，請精簡後再送出</span>
                )}
                <span className={`text-[11px] font-black tabular-nums ${
                    editorLength >= 10000 ? 'text-red-500' : editorLength >= 9000 ? 'text-amber-500' : 'text-gray-400'
                }`}>
                    {editorLength} / 10000
                </span>
            </div>
        </div>
    );
}
