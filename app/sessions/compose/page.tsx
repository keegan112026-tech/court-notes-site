'use client';

import React, { useMemo, useState } from 'react';
import { ChevronDown, Quote, Send } from 'lucide-react';
import { EditorContent, useEditor } from '@tiptap/react';
import Placeholder from '@tiptap/extension-placeholder';
import StarterKit from '@tiptap/starter-kit';
import { Node as TiptapNode } from '@tiptap/core';
import { toast } from 'sonner';
import SubpageHeader from '@/components/SubpageHeader';
import WorkbenchHeader from '@/components/workbench/WorkbenchHeader';
import { getLocalSessionDetail, getLocalSessionsIndex, getSessionDisplayTitle, getTranscriptCitationMap } from '@/lib/local-data';

const CitationChip = TiptapNode.create({
    name: 'citation',
    group: 'inline',
    inline: true,
    atom: true,
    selectable: true,
    addAttributes() {
        return {
            lineId: { default: '' },
            sessionId: { default: '' },
            speaker: { default: '' },
            label: { default: '' },
        };
    },
    parseHTML() {
        return [{ tag: 'cite[data-line][data-session]' }];
    },
    renderHTML({ node, HTMLAttributes }) {
        const { lineId, sessionId, speaker, label } = node.attrs;
        return ['cite', { ...HTMLAttributes, 'data-line': lineId, 'data-session': sessionId, 'data-speaker': speaker }, label || '[引用]'];
    },
});

export default function CrossSessionComposePage() {
    const sessions = useMemo(() => getLocalSessionsIndex(), []);
    const [activeSessionId, setActiveSessionId] = useState(sessions[0]?.id || '');
    const [articleTitle, setArticleTitle] = useState('');
    const [authorName, setAuthorName] = useState('');
    const [contactEmail, setContactEmail] = useState('');
    const [submitState, setSubmitState] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [sourceSessionIds, setSourceSessionIds] = useState<string[]>([]);
    const [editorLength, setEditorLength] = useState(0);

    const sessionBundle = useMemo(() => getLocalSessionDetail(activeSessionId), [activeSessionId]);
    const transcriptMap = useMemo(() => getTranscriptCitationMap(activeSessionId), [activeSessionId]);
    const transcript = sessionBundle?.transcripts || [];
    const activeSessionTitle = activeSessionId ? getSessionDisplayTitle(activeSessionId) : '';

    const editor = useEditor({
        extensions: [
            CitationChip,
            StarterKit,
            Placeholder.configure({
                placeholder: '這裡是跨場次共通工作檯。你可以切換左側場次，將不同場次的逐字段落引入同一篇綜合論述。',
            }),
        ],
        content: '',
        immediatelyRender: false,
        onUpdate: ({ editor: e }) => setEditorLength(e.getText().length),
    });

    const insertCitation = (lineId: string) => {
        if (!editor || !activeSessionId) return;
        const line = transcriptMap[lineId];
        const shortId = lineId.replace(/^p/i, '');
        const speaker = line?.speaker || line?.role || '未標記發言者';
        const label = `[${activeSessionId}:${shortId}]`;

        editor
            .chain()
            .focus()
            .insertContent({
                type: 'citation',
                attrs: {
                    lineId,
                    sessionId: activeSessionId,
                    speaker,
                    label,
                },
            })
            .insertContent(' ')
            .run();

        setSourceSessionIds((current) => (current.includes(activeSessionId) ? current : [...current, activeSessionId]));
    };

    const handleSubmit = async () => {
        if (!editor || !activeSessionId) return;

        setSubmitting(true);
        setSubmitState('');
        try {
            const res = await fetch('/api/submit-article', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: articleTitle,
                    author: authorName,
                    contactEmail,
                    content: editor.getHTML(),
                    sessionId: activeSessionId,
                    sourceSessionIds: sourceSessionIds.length ? sourceSessionIds : [activeSessionId],
                }),
            });
            const data = await res.json();
            if (data.ok) {
                const message = data.message || '投稿已送出，待審核後發布。';
                setSubmitState(message);
                toast.success(message);
                setArticleTitle('');
                setAuthorName('');
                setContactEmail('');
                setSourceSessionIds([activeSessionId]);
                editor.commands.clearContent(true);
                return;
            }

            const message = data.error || '送出失敗，請稍後再試。';
            setSubmitState(message);
            toast.error(message);
        } catch {
            const message = '送出失敗，請稍後再試。';
            setSubmitState(message);
            toast.error(message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <SubpageHeader variant="light" />
            <div className="flex min-h-screen flex-col bg-[#FAFAFA] text-[#2D2A26]">
            <WorkbenchHeader
                backHref="/sessions"
                backLabel="返回筆記總覽頁"
                eyebrow="跨場工作檯"
                title="跨場次觀庭共構工作檯"
                subtitle={activeSessionTitle ? `目前可切換引用來源場次：${activeSessionTitle}。你可以整合多場次逐字稿，形成跨場次的完整論述。` : '可切換不同庭次逐字稿，整合多場次還原筆記並撰寫綜合性論述。'}
                actions={
                    <button
                        onClick={handleSubmit}
                        disabled={submitting || editorLength > 10000}
                        className="inline-flex items-center gap-2 rounded-xl bg-[#6B8E23] px-5 py-3 text-xs font-black text-white shadow-md disabled:opacity-50"
                    >
                        <Send size={16} />
                        {submitting ? '送出中...' : '送出審核'}
                    </button>
                }
            />

            <main className="grid flex-1 gap-0 lg:min-h-0 lg:grid-cols-[420px_1fr]">
                <aside className="border-r border-gray-200 bg-white">
                    <div className="p-4 border-b border-gray-200">
                        <label className="text-xs font-black text-[#8A8078] block mb-2">目前引用來源場次</label>
                        <div className="relative">
                            <select
                                value={activeSessionId}
                                onChange={(e) => setActiveSessionId(e.target.value)}
                                className="w-full appearance-none rounded-xl border border-gray-200 bg-white px-4 py-3 pr-10 font-bold outline-none focus:border-[#6B8E23]"
                            >
                                {sessions.map((session) => (
                                    <option key={session.id} value={session.id}>
                                        {getSessionDisplayTitle(session.id)}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A8078]" />
                        </div>
                    </div>
                    <div className="p-4 space-y-3 overflow-y-auto max-h-[calc(100vh-170px)]">
                        {transcript.map((item) => {
                            const lineId = item.lineId || item.id;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => insertCitation(lineId)}
                                    className="w-full text-left rounded-2xl border border-transparent hover:border-gray-200 hover:bg-[#FAFAFA] p-4 transition"
                                >
                                    <div className="text-xs font-black text-[#6B8E23] mb-2">{item.speaker || item.role || '未標記發言者'}</div>
                                    <div className="text-sm leading-7 text-[#3F3A34]">{item.content}</div>
                                    <div className="mt-3 text-xs font-black text-[#8A8078] inline-flex items-center gap-1">
                                        <Quote size={12} />
                                        點擊插入引用
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </aside>

                <section className="p-6">
                    <div className="bg-white border border-gray-200 rounded-[2rem] overflow-hidden shadow-sm">
                        <div className="p-4 border-b border-gray-100 bg-[#F9FBE7]/40 text-sm font-bold text-[#6B8E23]">
                            綜合論述編輯區
                        </div>
                        <div className="p-4 border-b border-gray-100 space-y-3">
                            <input
                                value={articleTitle}
                                onChange={(e) => setArticleTitle(e.target.value)}
                                placeholder="文章標題"
                                className="w-full rounded-xl border border-gray-200 px-4 py-3"
                            />
                            <input
                                value={authorName}
                                onChange={(e) => setAuthorName(e.target.value)}
                                placeholder="作者名稱，可填組織、角色或匿名代稱"
                                className="w-full rounded-xl border border-gray-200 px-4 py-3"
                            />
                            <input
                                value={contactEmail}
                                onChange={(e) => setContactEmail(e.target.value)}
                                placeholder="電子信箱（非必填，不會公開，僅供後續修改或異動聯繫）"
                                className="w-full rounded-xl border border-gray-200 px-4 py-3"
                            />
                            <div className="text-xs font-bold text-[#8A8078]">
                                已引用場次：{sourceSessionIds.length ? sourceSessionIds.map((id) => getSessionDisplayTitle(id)).join('、') : '尚未引用'}
                            </div>
                            {submitState && <div className="text-sm font-bold text-[#6B8E23]">{submitState}</div>}
                        </div>
                        <div className="p-6">
                            <EditorContent editor={editor} className="workspace-editor min-h-[420px]" />
                            <div className="mt-3 flex items-center justify-end gap-2 border-t border-gray-100 pt-3">
                                {editorLength >= 9000 && editorLength < 10000 && (
                                    <span className="text-xs font-bold text-amber-600">即將達到字數上限</span>
                                )}
                                {editorLength >= 10000 && (
                                    <span className="text-xs font-bold text-red-600">已達 10000 字上限，請精簡內容</span>
                                )}
                                <span className={`text-xs font-black tabular-nums ${
                                    editorLength >= 10000 ? 'text-red-500' : editorLength >= 9000 ? 'text-amber-500' : 'text-gray-400'
                                }`}>
                                    {editorLength} / 10000
                                </span>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            </div>

            <style jsx global>{`
                .workspace-editor .ProseMirror {
                    min-height: 420px;
                    outline: none;
                    color: #3f3a34;
                    line-height: 1.9;
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
                    box-shadow: inset 0 0 0 1px rgba(107, 142, 35, 0.18);
                }
            `}</style>
        </>
    );
}
