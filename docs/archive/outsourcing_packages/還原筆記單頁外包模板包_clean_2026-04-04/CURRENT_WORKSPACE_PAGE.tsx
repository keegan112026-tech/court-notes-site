'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
    AlertCircle,
    ArrowLeft,
    BookOpen,
    Maximize2,
    PenTool,
    Quote,
    Send,
    Share2,
} from 'lucide-react';
import { Node as TiptapNode } from '@tiptap/core';
import { EditorContent, useEditor } from '@tiptap/react';
import Placeholder from '@tiptap/extension-placeholder';
import StarterKit from '@tiptap/starter-kit';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { getLocalSessionDetail, getTranscriptCitationMap } from '@/lib/local-data';

const serif = { fontFamily: "'Noto Serif TC', serif" };

const CitationChip = TiptapNode.create({
    name: 'citation',
    group: 'inline',
    inline: true,
    atom: true,
    selectable: true,

    addAttributes() {
        return {
            lineId: {
                default: '',
                parseHTML: (element) => element.getAttribute('data-line') || '',
                renderHTML: (attributes) => ({ 'data-line': attributes.lineId }),
            },
            sessionId: {
                default: '',
                parseHTML: (element) => element.getAttribute('data-session') || '',
                renderHTML: (attributes) => ({ 'data-session': attributes.sessionId }),
            },
            speaker: {
                default: '',
                parseHTML: (element) => element.getAttribute('data-speaker') || '',
                renderHTML: (attributes) => ({ 'data-speaker': attributes.speaker }),
            },
            label: {
                default: '',
                parseHTML: (element) => element.textContent || '',
                renderHTML: () => ({}),
            },
        };
    },

    parseHTML() {
        return [{ tag: 'cite[data-line][data-session]' }];
    },

    renderHTML({ node, HTMLAttributes }) {
        const { lineId, sessionId, speaker, label } = node.attrs;

        return [
            'cite',
            {
                ...HTMLAttributes,
                'data-line': lineId,
                'data-session': sessionId,
                'data-speaker': speaker,
            },
            label || '[引用]',
        ];
    },

    renderText({ node }) {
        return node.attrs.label || '[引用]';
    },
});

type CitationPreview = {
    lineId: string;
    speaker: string;
    content: string;
    top: number;
    left: number;
};

export default function SessionWorkspacePage() {
    const params = useParams();
    const sessionId = params.id as string;

    const sessionBundle = useMemo(() => getLocalSessionDetail(sessionId), [sessionId]);
    const transcriptMap = useMemo(() => getTranscriptCitationMap(sessionId), [sessionId]);

    const [isCopied, setIsCopied] = useState(false);
    const [authorName, setAuthorName] = useState('');
    const [contactEmail, setContactEmail] = useState('');
    const [articleTitle, setArticleTitle] = useState('');
    const [submitState, setSubmitState] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [activeLineId, setActiveLineId] = useState('');
    const [citationPreview, setCitationPreview] = useState<CitationPreview | null>(null);

    const transcriptContainerRef = useRef<HTMLDivElement>(null);
    const activeLineTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const transcript = sessionBundle?.transcripts || [];
    const session = sessionBundle?.metadata || null;

    const editor = useEditor({
        extensions: [
            CitationChip,
            StarterKit,
            Placeholder.configure({
                placeholder: '請在這裡撰寫文章內容。點擊左側逐字稿段落可插入引用，引用可滑出原文並點擊回到對應段落。',
            }),
        ],
        content: '',
        immediatelyRender: false,
        editorProps: {
            attributes: {
                class: 'prose prose-sm md:prose-base focus:outline-none min-h-[500px] max-w-none text-gray-700 leading-[1.85] p-6',
            },
        },
    });

    const jumpToLine = (lineId: string) => {
        if (!lineId) return;

        setActiveLineId(lineId);
        const target = document.getElementById(`line-${lineId}`);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        if (activeLineTimerRef.current) {
            clearTimeout(activeLineTimerRef.current);
        }

        activeLineTimerRef.current = setTimeout(() => {
            setActiveLineId((current) => (current === lineId ? '' : current));
        }, 2200);
    };

    useEffect(() => {
        return () => {
            if (activeLineTimerRef.current) {
                clearTimeout(activeLineTimerRef.current);
            }
        };
    }, []);

    useEffect(() => {
        if (!editor) return;

        const root = editor.view.dom as HTMLElement;

        const getCitationElement = (target: EventTarget | null) => {
            if (!(target instanceof HTMLElement)) return null;
            return target.closest('cite[data-line][data-session]') as HTMLElement | null;
        };

        const showCitationPreview = (cite: HTMLElement) => {
            const lineId = cite.getAttribute('data-line') || '';
            const line = transcriptMap[lineId];
            if (!line?.content) return;

            const rect = cite.getBoundingClientRect();
            const cardWidth = 340;
            const left = Math.min(Math.max(16, rect.left), Math.max(16, window.innerWidth - cardWidth - 16));
            const showAbove = rect.bottom + 220 > window.innerHeight;

            setCitationPreview({
                lineId,
                speaker: line.speaker || line.role || '未標示發言者',
                content: line.content,
                left,
                top: showAbove ? rect.top - 14 : rect.bottom + 14,
            });
        };

        const onMouseOver = (event: MouseEvent) => {
            const cite = getCitationElement(event.target);
            if (!cite) return;
            showCitationPreview(cite);
        };

        const onMouseMove = (event: MouseEvent) => {
            const cite = getCitationElement(event.target);
            if (!cite) return;
            showCitationPreview(cite);
        };

        const onMouseOut = (event: MouseEvent) => {
            const cite = getCitationElement(event.target);
            if (!cite) return;

            const nextTarget = event.relatedTarget;
            if (nextTarget instanceof globalThis.Node && cite.contains(nextTarget)) return;

            const lineId = cite.getAttribute('data-line') || '';
            setCitationPreview((current) => (current?.lineId === lineId ? null : current));
        };

        const onClick = (event: MouseEvent) => {
            const cite = getCitationElement(event.target);
            if (!cite) return;

            event.preventDefault();
            event.stopPropagation();

            const lineId = cite.getAttribute('data-line') || '';
            jumpToLine(lineId);
        };

        root.addEventListener('mouseover', onMouseOver);
        root.addEventListener('mousemove', onMouseMove);
        root.addEventListener('mouseout', onMouseOut);
        root.addEventListener('click', onClick);

        return () => {
            root.removeEventListener('mouseover', onMouseOver);
            root.removeEventListener('mousemove', onMouseMove);
            root.removeEventListener('mouseout', onMouseOut);
            root.removeEventListener('click', onClick);
            setCitationPreview(null);
        };
    }, [editor, transcriptMap]);

    const handleShare = async () => {
        await navigator.clipboard.writeText(window.location.href);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    const handleInjectCitation = (lineId: string) => {
        if (!editor) return;

        const line = transcriptMap[lineId];
        const shortId = lineId.replace(/^p/i, '');
        const speaker = line?.speaker || line?.role || '未標示發言者';

        editor
            .chain()
            .focus()
            .insertContent({
                type: 'citation',
                attrs: {
                    lineId,
                    sessionId,
                    speaker,
                    label: `[引用:${shortId}]`,
                },
            })
            .insertContent(' ')
            .run();

        jumpToLine(lineId);
    };

    const submitArticle = async () => {
        if (!editor) return;

        const content = editor.getHTML().trim();
        if (!articleTitle.trim() || !content) {
            setSubmitState('請先填寫文章標題與內容。');
            return;
        }

        setSubmitting(true);
        setSubmitState('');

        try {
            const res = await fetch('/api/submit-article', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    author: authorName,
                    contactEmail,
                    title: articleTitle,
                    content,
                    sessionId,
                    sourceSessionIds: [sessionId],
                }),
            });
            const data = await res.json();

            if (data.ok) {
                setSubmitState('文章已送出，待審核後會進入公開文章區。');
                return;
            }

            setSubmitState(data.error || '送出失敗，請稍後再試。');
        } catch {
            setSubmitState('送出失敗，請稍後再試。');
        } finally {
            setSubmitting(false);
        }
    };

    if (!sessionBundle) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#FAFAFA] font-bold text-gray-600">
                找不到這個場次資料。
            </div>
        );
    }

    return (
        <div className="flex h-screen flex-col overflow-hidden bg-[#FAFAFA] font-sans selection:bg-[#6B8E23]/20">
            <header className="z-10 flex shrink-0 items-center justify-between border-b border-gray-100 bg-white px-4 py-3 shadow-sm lg:px-8">
                <div className="flex items-center gap-4">
                    <Link href="/sessions" className="rounded-xl bg-gray-50 p-2 transition-colors hover:bg-gray-100">
                        <ArrowLeft size={20} className="text-gray-600" />
                    </Link>
                    <div>
                        <h1 className="flex items-center gap-2 text-sm font-black tracking-tight text-gray-900 lg:text-lg">
                            觀庭共構工作檯
                            <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs text-orange-700">{sessionId}</span>
                        </h1>
                        <p className="mt-0.5 text-[11px] font-bold text-gray-400">
                            {session ? session.title : '載入場次資訊中...'}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={handleShare}
                        className="flex items-center gap-2 rounded-xl bg-gray-100 px-4 py-2 text-xs font-bold text-gray-600 transition-colors hover:bg-gray-200"
                    >
                        <Share2 size={14} /> {isCopied ? '已複製連結' : '分享工作檯'}
                    </button>
                    <button
                        onClick={submitArticle}
                        disabled={submitting}
                        className="flex items-center gap-2 rounded-xl bg-[#6B8E23] px-5 py-2 text-xs font-bold text-white shadow-md transition-colors hover:bg-[#5a781d] disabled:opacity-60"
                    >
                        <Send size={14} /> {submitting ? '送出中...' : '送出審核'}
                    </button>
                </div>
            </header>

            <main className="flex-1 overflow-hidden p-4 lg:p-6">
                <ResizablePanelGroup direction="horizontal" className="h-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                    <ResizablePanel defaultSize={50} minSize={30} className="flex flex-col bg-white">
                        <div className="flex shrink-0 items-center justify-between gap-2 border-b border-gray-100 bg-gray-50 p-4">
                            <h2 className="flex items-center gap-2 text-sm font-black text-gray-700">
                                <BookOpen size={16} className="text-[#6B8E23]" /> 庭次逐字內容
                            </h2>
                            <span className="rounded border border-gray-100 bg-white px-2 py-1 text-[10px] font-bold text-gray-400">
                                點擊段落即可插入引用
                            </span>
                        </div>

                        <div
                            ref={transcriptContainerRef}
                            className="custom-scrollbar relative flex-1 space-y-2 overflow-y-auto bg-gradient-to-b from-white to-[#FAFAFA] p-6 md:p-8"
                        >
                            {transcript.length === 0 ? (
                                <div className="animate-pulse py-20 text-center text-sm font-bold text-gray-400">
                                    目前沒有可顯示的逐字稿內容。
                                </div>
                            ) : transcript.map((item, idx) => {
                                const lineId = item.lineId || item.id;
                                const isStage = item.type === 'stage';
                                const speakerLabel = item.speaker || item.role || '未標示發言者';
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
                                        onClick={() => handleInjectCitation(lineId)}
                                        className={`group relative cursor-pointer rounded-[1.5rem] border p-5 transition-all md:p-6 ${
                                            isActive
                                                ? 'border-[#C9D9A3] bg-[#F9FBE7] shadow-md ring-2 ring-[#DDE6C8]'
                                                : 'border-transparent hover:border-gray-200 hover:bg-white hover:shadow-md'
                                        }`}
                                        title="點擊可插入引用"
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

                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 transition-opacity group-hover:opacity-100">
                                            <div className="rounded-full bg-[#6B8E23] p-2 text-white shadow-lg">
                                                <Quote size={14} />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </ResizablePanel>

                    <ResizableHandle withHandle className="font-bold transition-all hover:bg-[#6B8E23]/20" />

                    <ResizablePanel defaultSize={50} minSize={30} className="flex flex-col bg-white">
                        <div className="flex shrink-0 items-center justify-between border-b border-gray-100 bg-[#F9FBE7]/50 p-4">
                            <h2 className="flex items-center gap-2 text-sm font-black text-[#6B8E23]">
                                <PenTool size={16} /> 共構文章編輯區
                            </h2>
                            <div className="flex items-center gap-2 rounded bg-orange-50 px-2 py-1 text-[10px] font-bold text-orange-600">
                                <AlertCircle size={12} /> 送出後會先進入審核
                            </div>
                        </div>

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
                                    右側引用可滑出段落預覽，點擊後會回到左側原始段落。
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3 border-b border-gray-100 bg-white p-4">
                            <input
                                value={articleTitle}
                                onChange={(e) => setArticleTitle(e.target.value)}
                                placeholder="文章標題"
                                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-bold text-gray-800 outline-none focus:border-[#6B8E23]"
                            />
                            <input
                                value={authorName}
                                onChange={(e) => setAuthorName(e.target.value)}
                                placeholder="作者名稱，可填組織、角色或匿名代稱"
                                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 outline-none focus:border-[#6B8E23]"
                            />
                            <input
                                value={contactEmail}
                                onChange={(e) => setContactEmail(e.target.value)}
                                placeholder="電子信箱（選填，不公開，僅供後續聯繫與修改確認）"
                                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 outline-none focus:border-[#6B8E23]"
                                inputMode="email"
                            />
                            {submitState && <p className="text-xs font-bold text-[#6B8E23]">{submitState}</p>}
                        </div>

                        <div className="relative flex-1 overflow-y-auto custom-scrollbar">
                            <EditorContent editor={editor} className="workspace-editor h-full" />

                            {!editor?.getText() && (
                                <div className="pointer-events-none absolute inset-x-0 top-1/3 -z-10 flex flex-col items-center justify-center text-gray-300">
                                    <Maximize2 size={48} className="mb-4 opacity-50" />
                                    <p className="text-sm font-bold opacity-70">從左側逐字稿插入引用，開始撰寫你的共構文章。</p>
                                </div>
                            )}
                        </div>
                    </ResizablePanel>
                </ResizablePanelGroup>
            </main>

            {citationPreview && (
                <div
                    className="pointer-events-none fixed z-[80] w-[340px]"
                    style={{
                        left: citationPreview.left,
                        top: citationPreview.top,
                        transform: citationPreview.top > window.innerHeight / 2 ? 'translateY(-100%)' : 'none',
                    }}
                >
                    <div className="rounded-2xl border border-[#DDE6C8] bg-white/95 px-4 py-3 shadow-[0_16px_40px_rgba(45,42,38,0.14)] backdrop-blur">
                        <div className="mb-2 flex items-center justify-between gap-3">
                            <span className="rounded-full bg-[#F9FBE7] px-2 py-1 text-[12px] font-black text-[#6B8E23]">
                                引用段落預覽
                            </span>
                            <span className="text-[11px] font-bold text-[#8A8078]">
                                {sessionId} / {citationPreview.lineId}
                            </span>
                        </div>
                        <p className="mb-1 text-[12px] font-black text-[#5A5347]">{citationPreview.speaker}</p>
                        <p className="text-[14px] leading-6 text-[#3F3A34]">{citationPreview.content}</p>
                    </div>
                </div>
            )}

            <style jsx global>{`
                .ProseMirror p.is-editor-empty:first-child::before {
                    color: #adb5bd;
                    content: attr(data-placeholder);
                    float: left;
                    height: 0;
                    pointer-events: none;
                }

                .workspace-editor cite[data-line][data-session] {
                    display: inline-block;
                    margin: 0 0.15rem;
                    padding: 0.15rem 0.5rem;
                    border-radius: 999px;
                    background: #f9fbe7;
                    color: #6b8e23;
                    font-style: normal;
                    font-weight: 800;
                    cursor: pointer;
                    box-shadow: inset 0 0 0 1px rgba(107, 142, 35, 0.18);
                    transition: transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;
                }

                .workspace-editor cite[data-line][data-session]:hover {
                    background: #eef5d6;
                    box-shadow: inset 0 0 0 1px rgba(107, 142, 35, 0.28), 0 4px 14px rgba(107, 142, 35, 0.12);
                    transform: translateY(-1px);
                }
            `}</style>
        </div>
    );
}
