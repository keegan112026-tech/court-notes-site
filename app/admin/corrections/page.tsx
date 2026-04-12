'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Navbar from '@/components/Navbar';
import AdminConsoleNav from '@/components/admin/AdminConsoleNav';
import { CheckCheck, ChevronDown, ChevronUp, ExternalLink, Flag, History, Pencil, X } from 'lucide-react';

const serif = { fontFamily: "'Noto Serif TC', serif" };

type InboxMessage = {
    id: string;
    title: string;
    messageType: string;
    senderName: string;
    content: string;
    status: string;
    createdAt: string;
    relatedSessionId?: string;
    internalNote?: string;
};

type PatchRecord = {
    patchedAt: string;
    sessionId: string;
    lineId: string;
    patchedBy: string;
    reason: string;
    originalContent: string;
    newContent: string;
};

type AdminRole = 'owner' | 'reviewer';

function parseReport(content: string) {
    // 解析 Flag 回報格式：「場次：XXX｜發言者：XXX｜段落 ID：XXX\n\n原文：XXX\n\n回報問題：XXX」
    const sessionMatch = content.match(/場次：([^\s｜]+)/);
    const speakerMatch = content.match(/發言者：([^｜\n]+)/);
    const lineIdMatch = content.match(/段落 ID：([^\n]+)/);
    const originalMatch = content.match(/原文：([\s\S]+?)(?=\n\n回報問題：)/);
    const problemMatch = content.match(/回報問題：([\s\S]+)$/);

    return {
        sessionId: sessionMatch?.[1]?.trim() || '',
        speaker: speakerMatch?.[1]?.trim() || '',
        lineId: lineIdMatch?.[1]?.trim() || '',
        originalText: originalMatch?.[1]?.trim() || '',
        problem: problemMatch?.[1]?.trim() || content,
    };
}

function formatDate(value: string) {
    const parsed = Date.parse(value);
    if (Number.isNaN(parsed)) return value;
    return new Date(parsed).toLocaleString('zh-TW');
}

export default function CorrectionsPage() {
    const [messages, setMessages] = useState<InboxMessage[]>([]);
    const [patches, setPatches] = useState<PatchRecord[]>([]);
    const [adminRole, setAdminRole] = useState<AdminRole | null>(null);
    const [adminName, setAdminName] = useState('');
    const [loading, setLoading] = useState(true);
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editContent, setEditContent] = useState('');
    const [editReason, setEditReason] = useState('');
    const [working, setWorking] = useState(false);
    const [feedback, setFeedback] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
    const [showPatchLog, setShowPatchLog] = useState(false);

    const load = async () => {
        setLoading(true);
        try {
            const [inboxRes, patchRes] = await Promise.all([
                fetch('/api/admin/inbox'),
                fetch('/api/admin/session-patch/log'),
            ]);
            const inboxData = await inboxRes.json();
            const patchData = await patchRes.json();

            if (inboxData.ok) {
                setAdminRole(inboxData.data.currentAdmin?.role || null);
                setAdminName(inboxData.data.currentAdmin?.name || '');
                const corrections = (inboxData.data.messages as InboxMessage[]).filter(
                    m => m.messageType === '內容更正'
                );
                setMessages(corrections);
            }
            if (patchData.ok) setPatches(patchData.data);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    const handleMarkResolved = async (targetId: string) => {
        setWorking(true);
        setFeedback(null);
        try {
            const res = await fetch('/api/admin/inbox', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ targetId, action: 'mark-resolved', note: '已於內容更正頁面處理。' }),
            });
            const data = await res.json();
            if (data.ok) { setFeedback({ type: 'ok', text: '已標記為已處理。' }); await load(); }
            else setFeedback({ type: 'err', text: data.error || '操作失敗。' });
        } finally { setWorking(false); }
    };

    const handlePatch = async (sessionId: string, lineId: string) => {
        if (!editContent.trim()) return;
        setWorking(true);
        setFeedback(null);
        try {
            const res = await fetch('/api/admin/session-patch', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sessionId, lineId, newContent: editContent.trim(), reason: editReason.trim() }),
            });
            const data = await res.json();
            if (data.ok) {
                setFeedback({ type: 'ok', text: `段落 ${lineId} 已修正，修訂紀錄已寫入。` });
                setEditingId(null);
                setEditContent('');
                setEditReason('');
                await load();
            } else {
                setFeedback({ type: 'err', text: data.error || '修訂失敗。' });
            }
        } finally { setWorking(false); }
    };

    const pendingMessages = useMemo(
        () => messages.filter(m => m.status !== '已結案'),
        [messages]
    );
    const resolvedMessages = useMemo(
        () => messages.filter(m => m.status === '已結案'),
        [messages]
    );

    return (
        <div className="min-h-screen bg-[#FBF7F0] pt-24">
            <Navbar />
            <main className="mx-auto max-w-6xl space-y-8 px-6 py-10">
                {/* Header */}
                <section className="rounded-[2rem] border border-[#E8E0D4] bg-white p-8 shadow-sm">
                    <div className="space-y-3">
                        <p className="text-sm font-black uppercase tracking-[0.2em] text-[#8A8078]">Admin / Corrections</p>
                        <h1 className="text-4xl font-black text-[#2D2A26]" style={serif}>內容更正</h1>
                        <p className="max-w-3xl text-lg leading-relaxed text-[#6B6358]">
                            管理讀者回報的逐字稿段落錯誤，並由 owner 就地修訂原始 JSON，修訂記錄自動寫入 audit log。
                        </p>
                        {adminName && (
                            <p className="text-sm font-bold text-[#8A8078]">
                                目前登入：{adminName} / <span className={adminRole === 'owner' ? 'text-[#6B8E23]' : 'text-amber-600'}>{adminRole}</span>
                                {adminRole === 'reviewer' && <span className="ml-2 text-amber-600">（僅可標記狀態，修訂需 owner 權限）</span>}
                            </p>
                        )}
                    </div>
                    <div className="mt-6">
                        <AdminConsoleNav current="corrections" />
                    </div>
                </section>

                {/* Feedback */}
                {feedback && (
                    <div className={`rounded-2xl px-5 py-4 text-sm font-bold ${feedback.type === 'ok' ? 'bg-[#F0F7E0] text-[#4A5E28]' : 'bg-red-50 text-red-600'}`}>
                        {feedback.text}
                    </div>
                )}

                {/* 待處理回報 */}
                <section className="rounded-[2rem] border border-orange-100 bg-white p-6 shadow-sm">
                    <div className="mb-5 flex items-center gap-3">
                        <Flag size={18} className="text-orange-500" />
                        <h2 className="text-xl font-black text-[#2D2A26]" style={serif}>待處理回報</h2>
                        <span className="rounded-full bg-orange-100 px-3 py-0.5 text-sm font-black text-orange-600">
                            {pendingMessages.length}
                        </span>
                    </div>

                    {loading ? (
                        <p className="text-sm font-bold text-gray-400">讀取中…</p>
                    ) : pendingMessages.length === 0 ? (
                        <p className="text-sm font-bold text-gray-400">目前沒有待處理的回報。</p>
                    ) : (
                        <div className="space-y-4">
                            {pendingMessages.map(msg => {
                                const parsed = parseReport(msg.content);
                                const isExpanded = expandedId === msg.id;
                                const isEditing = editingId === msg.id;

                                return (
                                    <div key={msg.id} className="rounded-2xl border border-orange-100 bg-[#FFFAF7] p-5">
                                        {/* 頂部 */}
                                        <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
                                            <div className="space-y-1">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-black text-orange-600">
                                                        {msg.status}
                                                    </span>
                                                    {parsed.sessionId && (
                                                        <a
                                                            href={`/sessions/${parsed.sessionId}`}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="inline-flex items-center gap-1 rounded-full bg-[#F0F7E0] px-3 py-1 text-xs font-black text-[#4A5E28] hover:underline"
                                                        >
                                                            {parsed.sessionId} <ExternalLink size={11} />
                                                        </a>
                                                    )}
                                                    {parsed.lineId && (
                                                        <span className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-bold text-gray-500">
                                                            段落 {parsed.lineId}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-sm font-bold text-[#8A8078]">
                                                    回報者：{msg.senderName || '匿名'} · {formatDate(msg.createdAt)}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => setExpandedId(isExpanded ? null : msg.id)}
                                                className="text-gray-400 hover:text-gray-600"
                                            >
                                                {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                            </button>
                                        </div>

                                        {/* 回報問題摘要 */}
                                        <div className="rounded-xl border border-orange-100 bg-white p-4">
                                            {parsed.speaker && (
                                                <p className="mb-1 text-[11px] font-black uppercase tracking-widest text-orange-500">{parsed.speaker}</p>
                                            )}
                                            {parsed.originalText && (
                                                <p className="mb-2 text-[13px] font-medium leading-[1.8] text-gray-500 line-clamp-2" style={serif}>
                                                    原文：{parsed.originalText}
                                                </p>
                                            )}
                                            <p className="text-[14px] font-bold leading-[1.8] text-[#2D2A26]">
                                                問題：{parsed.problem}
                                            </p>
                                        </div>

                                        {/* 展開：修訂編輯 */}
                                        {isExpanded && (
                                            <div className="mt-4 space-y-3">
                                                {adminRole === 'owner' && parsed.sessionId && parsed.lineId && (
                                                    <>
                                                        {!isEditing ? (
                                                            <button
                                                                onClick={() => {
                                                                    setEditingId(msg.id);
                                                                    setEditContent(parsed.originalText);
                                                                    setEditReason('');
                                                                }}
                                                                className="inline-flex items-center gap-2 rounded-xl bg-[#6B8E23] px-4 py-2 text-sm font-black text-white hover:bg-[#5a781d]"
                                                            >
                                                                <Pencil size={14} /> 修訂此段內容
                                                            </button>
                                                        ) : (
                                                            <div className="space-y-3 rounded-2xl border border-[#DDE6C8] bg-[#FAFEF5] p-4">
                                                                <p className="text-[12px] font-black text-[#6B8E23]">修訂段落 {parsed.lineId}</p>
                                                                <textarea
                                                                    value={editContent}
                                                                    onChange={e => setEditContent(e.target.value)}
                                                                    rows={5}
                                                                    className="w-full resize-none rounded-xl border border-[#DDE6C8] px-4 py-3 text-[14px] font-medium leading-[1.8] outline-none focus:border-[#6B8E23]"
                                                                    placeholder="修正後的逐字稿內容"
                                                                />
                                                                <input
                                                                    value={editReason}
                                                                    onChange={e => setEditReason(e.target.value)}
                                                                    className="w-full rounded-xl border border-gray-200 px-4 py-2 text-[13px] outline-none focus:border-[#6B8E23]"
                                                                    placeholder="修訂原因（選填，會寫入 audit log）"
                                                                />
                                                                <div className="flex gap-2">
                                                                    <button
                                                                        onClick={() => handlePatch(parsed.sessionId, parsed.lineId)}
                                                                        disabled={working || !editContent.trim()}
                                                                        className="inline-flex items-center gap-2 rounded-xl bg-[#6B8E23] px-4 py-2 text-sm font-black text-white hover:bg-[#5a781d] disabled:opacity-50"
                                                                    >
                                                                        <CheckCheck size={14} /> 確認修訂
                                                                    </button>
                                                                    <button
                                                                        onClick={() => { setEditingId(null); setEditContent(''); }}
                                                                        className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm font-bold text-gray-500 hover:bg-gray-50"
                                                                    >
                                                                        <X size={14} /> 取消
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </>
                                                )}

                                                <button
                                                    onClick={() => handleMarkResolved(msg.id)}
                                                    disabled={working}
                                                    className="inline-flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-2 text-sm font-black text-slate-700 hover:bg-slate-200 disabled:opacity-50"
                                                >
                                                    <CheckCheck size={14} /> 標記已處理（不修訂）
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </section>

                {/* Audit Log */}
                <section className="rounded-[2rem] border border-[#E8E0D4] bg-white p-6 shadow-sm">
                    <button
                        onClick={() => setShowPatchLog(!showPatchLog)}
                        className="flex w-full items-center justify-between gap-3"
                    >
                        <div className="flex items-center gap-3">
                            <History size={18} className="text-[#6B8E23]" />
                            <h2 className="text-xl font-black text-[#2D2A26]" style={serif}>修訂紀錄 Audit Log</h2>
                            <span className="rounded-full bg-[#F0F7E0] px-3 py-0.5 text-sm font-black text-[#4A5E28]">
                                {patches.length}
                            </span>
                        </div>
                        {showPatchLog ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
                    </button>

                    {showPatchLog && (
                        <div className="mt-5 space-y-3">
                            {patches.length === 0 ? (
                                <p className="text-sm font-bold text-gray-400">尚無修訂紀錄。</p>
                            ) : patches.map((patch, i) => (
                                <div key={i} className="rounded-2xl border border-gray-100 bg-[#FAFAFA] p-4">
                                    <div className="mb-2 flex flex-wrap items-center gap-2 text-xs font-black text-gray-500">
                                        <span>{formatDate(patch.patchedAt)}</span>
                                        <span>·</span>
                                        <span className="text-[#6B8E23]">{patch.patchedBy}</span>
                                        <span>·</span>
                                        <a
                                            href={`/sessions/${patch.sessionId}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex items-center gap-1 hover:underline"
                                        >
                                            {patch.sessionId} <ExternalLink size={10} />
                                        </a>
                                        <span>·</span>
                                        <span>段落 {patch.lineId}</span>
                                    </div>
                                    {patch.reason && (
                                        <p className="mb-2 text-[12px] font-bold text-amber-700">原因：{patch.reason}</p>
                                    )}
                                    <div className="grid gap-2 md:grid-cols-2">
                                        <div className="rounded-xl bg-red-50 px-3 py-2">
                                            <p className="mb-1 text-[10px] font-black text-red-400">原文</p>
                                            <p className="text-[13px] font-medium leading-[1.7] text-red-700 line-clamp-3" style={serif}>{patch.originalContent}</p>
                                        </div>
                                        <div className="rounded-xl bg-[#F0F7E0] px-3 py-2">
                                            <p className="mb-1 text-[10px] font-black text-[#6B8E23]">修正後</p>
                                            <p className="text-[13px] font-medium leading-[1.7] text-[#2D2A26] line-clamp-3" style={serif}>{patch.newContent}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* 已結案 */}
                {resolvedMessages.length > 0 && (
                    <section className="rounded-[2rem] border border-[#E8E0D4] bg-white p-6 shadow-sm">
                        <h2 className="mb-4 flex items-center gap-2 text-lg font-black text-gray-500" style={serif}>
                            <CheckCheck size={16} /> 已結案（{resolvedMessages.length}）
                        </h2>
                        <div className="space-y-2">
                            {resolvedMessages.map(msg => {
                                const parsed = parseReport(msg.content);
                                return (
                                    <div key={msg.id} className="flex flex-wrap items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm text-gray-500">
                                        <span className="font-bold">{formatDate(msg.createdAt)}</span>
                                        {parsed.sessionId && <span className="font-black text-[#6B8E23]">{parsed.sessionId}</span>}
                                        {parsed.lineId && <span>段落 {parsed.lineId}</span>}
                                        <span className="flex-1 truncate">{parsed.problem}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                )}
            </main>
        </div>
    );
}
