'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import SubpageHeader from '@/components/SubpageHeader';
import WorkbenchHeader from '@/components/workbench/WorkbenchHeader';
import TranscriptPanel from '@/components/workbench/TranscriptPanel';
import InlinePanel from '@/components/workbench/InlinePanel';
import EditorPanel from '@/components/workbench/EditorPanel';
import MobileReadHeader from '@/components/workbench/MobileReadHeader';
import OnboardingOverlay from '@/components/workbench/OnboardingOverlay';
import ReportSheet, { ReportSegment } from '@/components/workbench/ReportSheet';
import ContributionSheet from '@/components/workbench/ContributionSheet';
import { CitationChip } from '@/components/workbench/CitationChip';
import { BookOpen, PenTool, Quote, Send, Share2, X } from 'lucide-react';
import { EditorContent, useEditor } from '@tiptap/react';
import Placeholder from '@tiptap/extension-placeholder';
import StarterKit from '@tiptap/starter-kit';
import { toast } from 'sonner';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { getLocalSessionDetail, getSessionDisplayTitle, getTranscriptCitationMap } from '@/lib/local-data';

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

    // ── 基本狀態 ──
    const [isCopied, setIsCopied] = useState(false);
    const [authorName, setAuthorName] = useState('');
    const [contactEmail, setContactEmail] = useState('');
    const [articleTitle, setArticleTitle] = useState('');
    const [submitState, setSubmitState] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [activeLineId, setActiveLineId] = useState('');
    const [editorLength, setEditorLength] = useState(0);
    const [citationPreview, setCitationPreview] = useState<CitationPreview | null>(null);
    const [isMobileLayout, setIsMobileLayout] = useState(false);
    const [mobilePanel, setMobilePanel] = useState<'transcript' | 'editor'>('transcript');

    // ── 浮動提示 ──
    const [floatingBarVisible, setFloatingBarVisible] = useState(false);
    const [floatingBarDismissed, setFloatingBarDismissed] = useState(false);
    const [contributionSheetOpen, setContributionSheetOpen] = useState(false);

    // ── 三模式 ──
    const [mobileMode, setMobileMode] = useState<'read' | 'inline' | 'edit'>('read');
    const [inlineNotes, setInlineNotes] = useState<Record<string, string>>({});
    const [expandedLineId, setExpandedLineId] = useState<string | null>(null);
    const [mergeConfirming, setMergeConfirming] = useState(false);
    const [mergedCount, setMergedCount] = useState(0);

    // ── 首次教學 ──
    const [showOnboarding, setShowOnboarding] = useState(false);

    // ── 桌面左欄模式 ──
    const [desktopLeftMode, setDesktopLeftMode] = useState<'transcript' | 'inline'>('transcript');

    // ── 回報 ──
    const [reportSheetOpen, setReportSheetOpen] = useState(false);
    const [reportSegment, setReportSegment] = useState<ReportSegment | null>(null);
    const [reportText, setReportText] = useState('');
    const [reportSubmitting, setReportSubmitting] = useState(false);
    const [reportSubmitted, setReportSubmitted] = useState(false);

    const transcriptContainerRef = useRef<HTMLDivElement>(null);
    const activeLineTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const transcript = sessionBundle?.transcripts || [];
    const session = sessionBundle?.metadata || null;
    const filledCount = Object.values(inlineNotes).filter(v => v.trim()).length;

    // ── Tiptap editor ──
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
        onUpdate: ({ editor: e }) => setEditorLength(e.getText().length),
        editorProps: {
            attributes: {
                class: 'prose prose-sm md:prose-base focus:outline-none min-h-[500px] max-w-none text-gray-700 leading-[1.85] p-6',
            },
        },
    });

    // ── Effects ──
    const jumpToLine = (lineId: string) => {
        if (!lineId) return;
        setActiveLineId(lineId);
        const target = document.getElementById(`line-${lineId}`);
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        if (activeLineTimerRef.current) clearTimeout(activeLineTimerRef.current);
        activeLineTimerRef.current = setTimeout(() => {
            setActiveLineId((current) => (current === lineId ? '' : current));
        }, 2200);
    };

    useEffect(() => {
        return () => { if (activeLineTimerRef.current) clearTimeout(activeLineTimerRef.current); };
    }, []);

    useEffect(() => {
        const syncViewport = () => setIsMobileLayout(window.innerWidth < 1024);
        syncViewport();
        window.addEventListener('resize', syncViewport);
        return () => window.removeEventListener('resize', syncViewport);
    }, []);

    useEffect(() => {
        if (!isMobileLayout) return;
        const seen = localStorage.getItem('session-onboarding-seen');
        if (!seen) setShowOnboarding(true);
    }, [isMobileLayout]);

    useEffect(() => {
        const handleScroll = () => {
            if (floatingBarDismissed || mobileMode !== 'read') { setFloatingBarVisible(false); return; }
            const y = window.scrollY;
            setFloatingBarVisible(y > 200 && y < 600);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [floatingBarDismissed, mobileMode]);

    // ── Citation preview (desktop) ──
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

        const onMouseOver = (e: MouseEvent) => { const c = getCitationElement(e.target); if (c) showCitationPreview(c); };
        const onMouseOut = (e: MouseEvent) => {
            const c = getCitationElement(e.target);
            if (!c) return;
            if (e.relatedTarget instanceof globalThis.Node && c.contains(e.relatedTarget)) return;
            const lineId = c.getAttribute('data-line') || '';
            setCitationPreview(cur => cur?.lineId === lineId ? null : cur);
        };
        const onClick = (e: MouseEvent) => {
            const c = getCitationElement(e.target);
            if (!c) return;
            e.preventDefault(); e.stopPropagation();
            jumpToLine(c.getAttribute('data-line') || '');
        };

        root.addEventListener('mouseover', onMouseOver);
        root.addEventListener('mouseout', onMouseOut);
        root.addEventListener('click', onClick);
        return () => {
            root.removeEventListener('mouseover', onMouseOver);
            root.removeEventListener('mouseout', onMouseOut);
            root.removeEventListener('click', onClick);
            setCitationPreview(null);
        };
    }, [editor, transcriptMap]);

    // ── Handlers ──
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
        editor.chain().focus().insertContent({
            type: 'citation',
            attrs: { lineId, sessionId, speaker, label: `[引用:${shortId}]` },
        }).insertContent(' ').run();
        jumpToLine(lineId);
    };

    const dismissOnboarding = () => {
        localStorage.setItem('session-onboarding-seen', '1');
        setShowOnboarding(false);
    };

    const openReport = (lineId: string, speaker: string, content: string) => {
        setReportSegment({ lineId, speaker, content });
        setReportText('');
        setReportSubmitted(false);
        setReportSheetOpen(true);
    };

    const submitReport = async () => {
        if (!reportSegment || !reportText.trim()) return;
        setReportSubmitting(true);
        try {
            await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: '', email: '', category: '內容更正',
                    content: `【段落回報】場次：${sessionId}｜發言者：${reportSegment.speaker}｜段落 ID：${reportSegment.lineId}\n\n原文：${reportSegment.content}\n\n回報問題：${reportText.trim()}`,
                    attachmentUrl: '',
                }),
            });
        } catch { /* silent */ } finally {
            setReportSubmitted(true);
            setReportSubmitting(false);
        }
    };

    const mergeInlineNotes = () => {
        if (!editor) return;
        const filledLines = transcript.filter(
            item => item.type !== 'stage' && inlineNotes[(item.lineId || item.id)]?.trim()
        );
        if (filledLines.length === 0) return;
        editor.commands.clearContent();
        filledLines.forEach(item => {
            const lineId = item.lineId || item.id;
            const note = inlineNotes[lineId]?.trim();
            if (!note) return;
            const speaker = item.speaker || item.role || '未標示發言者';
            editor.chain().insertContent({ type: 'citation', attrs: { lineId, sessionId, speaker, label: `[引用：${speaker}]` } }).run();
            editor.commands.insertContent(' ');
            editor.commands.insertContent(`<p>${note}</p>`);
        });
        setMergedCount(filledLines.length);
        setMergeConfirming(false);
        if (isMobileLayout) {
            setMobileMode('edit');
            setMobilePanel('editor');
        } else {
            // 桌面版：彙整後切換左欄回逐字紀錄，右欄編輯器已常駐
            setDesktopLeftMode('transcript');
        }
    };

    const submitArticle = async () => {
        if (!editor) return;
        const content = editor.getHTML().trim();
        if (!articleTitle.trim() || !content) { setSubmitState('請先填寫文章標題與內容。'); return; }
        setSubmitting(true); setSubmitState('');
        try {
            const res = await fetch('/api/submit-article', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ author: authorName, contactEmail, title: articleTitle, content, sessionId, sourceSessionIds: [sessionId] }),
            });
            const data = await res.json();
            if (data.ok) {
                const message = data.message || '文章已送出，待審核後會進入觀庭筆記匯集區。';
                setSubmitState(message); toast.success(message);
                setArticleTitle(''); setAuthorName(''); setContactEmail('');
                editor.commands.clearContent(true); setMergedCount(0);
                return;
            }
            const message = data.error || '送出失敗，請稍後再試。';
            setSubmitState(message); toast.error(message);
        } catch {
            const message = '送出失敗，請稍後再試。';
            setSubmitState(message); toast.error(message);
        } finally { setSubmitting(false); }
    };

    if (!sessionBundle) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#FAFAFA] font-bold text-gray-600">
                找不到這個場次資料。
            </div>
        );
    }

    // ── 模式說明提示 ──
    const modeHintRead = (
        <div className="mb-3 rounded-xl bg-[#F4F1EC] px-4 py-2.5 text-[13px] font-medium leading-snug text-[#6B5A4A]">
            閱讀逐字紀錄。想書寫筆記？點上方「<span className="font-black text-[#4A5E28]">逐段填寫</span>」逐段記錄，或直接進入「<span className="font-black text-[#4A5E28]">書寫筆記</span>」自由撰寫。
        </div>
    );

    const modeHintInline = (
        <div className="mb-3 rounded-xl border border-[#DDE6C8] bg-[#F0F7E0] px-4 py-2.5 text-[13px] font-medium leading-snug text-[#4A5E28]">
            點擊任一段落開啟填寫框，寫下你的觀點或感受。
            {filledCount > 0
                ? <span className="font-black"> 已填 {filledCount} 段——點右上角「已填 {filledCount} 段 → 彙整」整合筆記進入編輯。</span>
                : <span> 填完後點右上角「<span className="font-black">已填 N 段 → 彙整</span>」整合筆記進入編輯。</span>
            }
        </div>
    );

    const modeHintEdit = mergedCount > 0 ? (
        <div className="rounded-2xl border border-[#C9D9A3] bg-[#F0F7E0] px-4 py-3">
            <p className="text-[13px] font-black text-[#4A5E28]">✓ 已彙整 {mergedCount} 段筆記，內容已放入編輯區</p>
            <p className="mt-0.5 text-[12px] font-medium text-[#5A6F35]">切換到「共構編輯」確認內容、填寫標題後，點「<span className="font-black">送出審核</span>」即完成。</p>
        </div>
    ) : (
        <div className="rounded-xl bg-[#F4F1EC] px-4 py-2.5 text-[13px] font-medium leading-snug text-[#6B5A4A]">
            切換到「<span className="font-black text-[#4A5E28]">逐字紀錄</span>」點擊段落可插入引用；整理完成後填寫標題，點「<span className="font-black text-[#4A5E28]">送出審核</span>」提交。
        </div>
    );

    return (
        <>
            <SubpageHeader variant="light" />
            <div className="flex min-h-screen flex-col bg-[#FAFAFA] font-sans selection:bg-[#6B8E23]/20 lg:h-screen lg:overflow-hidden">

                {/* ── Header ── */}
                {isMobileLayout && mobileMode !== 'edit' ? (
                    <MobileReadHeader
                        title={session ? getSessionDisplayTitle(sessionId) : '載入中'}
                        mobileMode={mobileMode}
                        filledCount={filledCount}
                        mergeConfirming={mergeConfirming}
                        onMergeConfirmStart={() => setMergeConfirming(true)}
                        onMergeConfirmCancel={() => setMergeConfirming(false)}
                        onMergeConfirm={mergeInlineNotes}
                    />
                ) : (
                    <WorkbenchHeader
                        backHref="/sessions"
                        backLabel="返回筆記總覽頁"
                        eyebrow="單場次工作檯"
                        title={session ? getSessionDisplayTitle(sessionId) : '載入場次資訊中'}
                        subtitle="可直接在左側逐字紀錄插入引用，整理單一場次的觀庭共構筆記與專業論述。"
                        actions={
                            <>
                                <button
                                    onClick={handleShare}
                                    className="flex items-center gap-2 rounded-xl bg-gray-100 px-4 py-2 text-xs font-bold text-gray-600 transition-colors hover:bg-gray-200"
                                >
                                    <Share2 size={14} /> {isCopied ? '已複製' : '複製連結'}
                                </button>
                                <button
                                    onClick={submitArticle}
                                    disabled={submitting || editorLength > 10000}
                                    className="flex items-center gap-2 rounded-xl bg-[#6B8E23] px-5 py-2 text-xs font-bold text-white shadow-md transition-colors hover:bg-[#5a781d] disabled:opacity-60"
                                >
                                    <Send size={14} /> {submitting ? '送出中...' : '送出審核'}
                                </button>
                            </>
                        }
                    />
                )}

                <main className="flex-1 overflow-visible lg:overflow-hidden lg:p-6">
                    {isMobileLayout ? (
                        <>
                            {/* ── 三模式切換 Tab ── */}
                            <div className="sticky top-0 z-20 border-b border-[#E8E0D4] bg-white px-3 py-2 shadow-sm">
                                <div className="grid grid-cols-3 gap-1 rounded-xl bg-[#F4F1EC] p-1">
                                    <button
                                        type="button"
                                        onClick={() => setMobileMode('read')}
                                        className={`flex items-center justify-center gap-1 rounded-lg py-2.5 text-xs font-black transition-all ${mobileMode === 'read' ? 'bg-white text-[#2D2A26] shadow-sm' : 'text-[#8A8078]'}`}
                                    >
                                        <BookOpen size={13} /> 閱讀
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => { setMobileMode('inline'); setMergeConfirming(false); }}
                                        className={`flex items-center justify-center gap-1 rounded-lg py-2.5 text-xs font-black transition-all ${mobileMode === 'inline' ? 'bg-[#F0F7E0] text-[#4A5E28] shadow-sm ring-1 ring-[#C9D9A3]' : 'text-[#8A8078]'}`}
                                    >
                                        <Quote size={13} /> 逐段填寫{filledCount > 0 && <span className="ml-1 rounded-full bg-[#6B8E23] px-1.5 py-0.5 text-[10px] text-white">{filledCount}</span>}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setMobileMode('edit')}
                                        className={`flex items-center justify-center gap-1 rounded-lg py-2.5 text-xs font-black transition-all ${mobileMode === 'edit' ? 'bg-[#6B8E23] text-white shadow-sm' : 'text-[#6B8E23]'}`}
                                    >
                                        <PenTool size={13} /> 書寫筆記
                                    </button>
                                </div>
                            </div>

                            {/* ── 閱讀模式 ── */}
                            {mobileMode === 'read' && (
                                <div className="p-4">
                                    {modeHintRead}
                                    <TranscriptPanel
                                        transcript={transcript}
                                        isMobileLayout={isMobileLayout}
                                        activeLineId={activeLineId}
                                        transcriptContainerRef={transcriptContainerRef}
                                        onInjectCitation={handleInjectCitation}
                                        onReport={openReport}
                                    />
                                </div>
                            )}

                            {/* ── 逐段填寫模式 ── */}
                            {mobileMode === 'inline' && (
                                <div className="p-4">
                                    {modeHintInline}
                                    <InlinePanel
                                        transcript={transcript}
                                        inlineNotes={inlineNotes}
                                        expandedLineId={expandedLineId}
                                        onExpandToggle={(id) => setExpandedLineId(expandedLineId === id ? null : id)}
                                        onNoteChange={(id, val) => setInlineNotes(prev => ({ ...prev, [id]: val }))}
                                        onReport={openReport}
                                    />
                                </div>
                            )}

                            {/* ── 書寫筆記模式 ── */}
                            {mobileMode === 'edit' && (
                                <div className="space-y-3 p-4">
                                    {modeHintEdit}
                                    <div className="grid grid-cols-2 gap-2 rounded-2xl border border-[#DDE6C8] bg-white p-2 shadow-sm">
                                        <button
                                            type="button"
                                            onClick={() => setMobilePanel('transcript')}
                                            className={`rounded-xl px-4 py-3 text-sm font-black transition-colors ${mobilePanel === 'transcript' ? 'bg-[#6B8E23] text-white shadow-sm' : 'bg-[#F8F6F1] text-[#6B8E23]'}`}
                                        >
                                            逐字紀錄（可引用）
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setMobilePanel('editor')}
                                            className={`rounded-xl px-4 py-3 text-sm font-black transition-colors ${mobilePanel === 'editor' ? 'bg-[#6B8E23] text-white shadow-sm' : 'bg-[#F8F6F1] text-[#6B8E23]'}`}
                                        >
                                            共構編輯
                                        </button>
                                    </div>
                                    {mobilePanel === 'transcript' ? (
                                        <TranscriptPanel
                                            transcript={transcript}
                                            isMobileLayout={isMobileLayout}
                                            activeLineId={activeLineId}
                                            transcriptContainerRef={transcriptContainerRef}
                                            onInjectCitation={handleInjectCitation}
                                            onReport={openReport}
                                        />
                                    ) : (
                                        <EditorPanel
                                            editor={editor}
                                            isMobileLayout={isMobileLayout}
                                            articleTitle={articleTitle}
                                            authorName={authorName}
                                            contactEmail={contactEmail}
                                            submitState={submitState}
                                            editorLength={editorLength}
                                            onTitleChange={setArticleTitle}
                                            onAuthorChange={setAuthorName}
                                            onEmailChange={setContactEmail}
                                        />
                                    )}
                                </div>
                            )}
                        </>
                    ) : (
                        /* ── 桌面版：左右分欄 ── */
                        <ResizablePanelGroup direction="horizontal" className="h-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                            <ResizablePanel defaultSize={50} minSize={30} className="flex flex-col bg-white">
                                {/* 桌面左欄模式切換 */}
                                <div className="flex shrink-0 items-center justify-between border-b border-[#F0EBE3] bg-[#FAFAF7] px-4 py-2">
                                    <div className="flex gap-1 rounded-xl bg-[#F4F1EC] p-1">
                                        <button
                                            type="button"
                                            onClick={() => setDesktopLeftMode('transcript')}
                                            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-black transition-all ${desktopLeftMode === 'transcript' ? 'bg-white text-[#2D2A26] shadow-sm' : 'text-[#8A8078] hover:text-[#4A3F35]'}`}
                                        >
                                            <BookOpen size={12} /> 逐字紀錄
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setDesktopLeftMode('inline')}
                                            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-black transition-all ${desktopLeftMode === 'inline' ? 'bg-[#F0F7E0] text-[#4A5E28] shadow-sm ring-1 ring-[#C9D9A3]' : 'text-[#8A8078] hover:text-[#4A5E28]'}`}
                                        >
                                            <Quote size={12} /> 逐段填寫
                                            {filledCount > 0 && <span className="ml-0.5 rounded-full bg-[#6B8E23] px-1.5 py-0.5 text-[10px] text-white">{filledCount}</span>}
                                        </button>
                                    </div>
                                    {/* 桌面版彙整按鈕 */}
                                    {desktopLeftMode === 'inline' && filledCount > 0 && (
                                        <button
                                            type="button"
                                            onClick={() => { mergeInlineNotes(); }}
                                            className="rounded-xl bg-[#6B8E23] px-3 py-1.5 text-xs font-black text-white shadow-sm transition-colors hover:bg-[#5a781d]"
                                        >
                                            已填 {filledCount} 段 → 彙整進編輯區
                                        </button>
                                    )}
                                </div>
                                {desktopLeftMode === 'transcript' ? (
                                    <TranscriptPanel
                                        transcript={transcript}
                                        isMobileLayout={false}
                                        activeLineId={activeLineId}
                                        transcriptContainerRef={transcriptContainerRef}
                                        onInjectCitation={handleInjectCitation}
                                        onReport={openReport}
                                    />
                                ) : (
                                    <div className="flex-1 overflow-y-auto px-4 py-3 custom-scrollbar">
                                        {modeHintInline}
                                        <InlinePanel
                                            transcript={transcript}
                                            inlineNotes={inlineNotes}
                                            expandedLineId={expandedLineId}
                                            onExpandToggle={(id) => setExpandedLineId(expandedLineId === id ? null : id)}
                                            onNoteChange={(id, val) => setInlineNotes(prev => ({ ...prev, [id]: val }))}
                                            onReport={openReport}
                                        />
                                    </div>
                                )}
                            </ResizablePanel>
                            <ResizableHandle withHandle className="font-bold transition-all hover:bg-[#6B8E23]/20" />
                            <ResizablePanel defaultSize={50} minSize={30} className="flex flex-col bg-white">
                                <EditorPanel
                                    editor={editor}
                                    isMobileLayout={false}
                                    articleTitle={articleTitle}
                                    authorName={authorName}
                                    contactEmail={contactEmail}
                                    submitState={submitState}
                                    editorLength={editorLength}
                                    onTitleChange={setArticleTitle}
                                    onAuthorChange={setAuthorName}
                                    onEmailChange={setContactEmail}
                                />
                            </ResizablePanel>
                        </ResizablePanelGroup>
                    )}
                </main>

                {/* ── 引用預覽（桌面） ── */}
                {!isMobileLayout && citationPreview && (
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
                                <span className="rounded-full bg-[#F9FBE7] px-2 py-1 text-[12px] font-black text-[#6B8E23]">引用預覽</span>
                                <span className="text-[11px] font-bold text-[#8A8078]">
                                    {getSessionDisplayTitle(sessionId)} / {citationPreview.lineId}
                                </span>
                            </div>
                            <p className="mb-1 text-[12px] font-black text-[#5A5347]">{citationPreview.speaker}</p>
                            <p className="text-[14px] leading-6 text-[#3F3A34]">{citationPreview.content}</p>
                        </div>
                    </div>
                )}

                {/* ── 浮動投稿引導 ── */}
                {floatingBarVisible && !floatingBarDismissed && (
                    <div className="fixed inset-x-0 bottom-0 z-[70] flex items-center justify-between gap-3 border-t border-[#DDE6C8] bg-white/95 px-4 py-3 shadow-[0_-4px_20px_rgba(107,142,35,0.12)] backdrop-blur-sm md:px-8">
                        <p className="min-w-0 flex-1 text-[15px] font-bold leading-snug text-[#4A5E28] md:text-[16px]">
                            你也可以去探究、感受、書寫——創建屬於你的觀庭筆記
                        </p>
                        <div className="flex shrink-0 items-center gap-2">
                            <button
                                onClick={() => setContributionSheetOpen(true)}
                                className="rounded-xl bg-[#6B8E23] px-4 py-2 text-[13px] font-black text-white shadow-md transition-colors hover:bg-[#5a781d]"
                            >
                                怎麼開始？
                            </button>
                            <button
                                onClick={() => { setFloatingBarDismissed(true); setFloatingBarVisible(false); }}
                                aria-label="關閉提示"
                                className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    </div>
                )}

                {/* ── Sheets & Overlays ── */}
                <ContributionSheet
                    open={contributionSheetOpen}
                    onOpenChange={setContributionSheetOpen}
                    isMobileLayout={isMobileLayout}
                    onStartWriting={() => { setMobileMode('edit'); setMobilePanel('editor'); }}
                />

                <ReportSheet
                    open={reportSheetOpen}
                    onOpenChange={(open) => { setReportSheetOpen(open); if (!open) setReportSubmitted(false); }}
                    segment={reportSegment}
                    text={reportText}
                    onTextChange={setReportText}
                    submitting={reportSubmitting}
                    submitted={reportSubmitted}
                    onSubmit={submitReport}
                />

                <OnboardingOverlay
                    show={showOnboarding && isMobileLayout}
                    onDismiss={dismissOnboarding}
                />
            </div>

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
                    transform: translateY(-1px);
                    box-shadow: inset 0 0 0 1px rgba(107, 142, 35, 0.35), 0 4px 12px rgba(107, 142, 35, 0.18);
                    background: #f0f7e0;
                }

                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #ddd6cf; border-radius: 999px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #c5bcb4; }
            `}</style>
        </>
    );
}
