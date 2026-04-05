'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Navbar from '@/components/Navbar';
import AdminConsoleNav from '@/components/admin/AdminConsoleNav';
import { Check, Eye, MessageSquare, Search, Trash2, Undo2 } from 'lucide-react';

const serif = { fontFamily: "'Noto Serif TC', serif" };

type AdminComment = {
    id: string;
    targetLineId: string;
    author: string;
    content: string;
    likes: number;
    status: string;
    createdAt: string;
    type: string;
    targetSessionId?: string;
    reviewedAt?: string;
    reviewedBy?: string;
    reviewNote?: string;
};

type CurrentAdmin = {
    name: string;
    role: 'owner' | 'reviewer';
};

function formatDate(value: string) {
    const parsed = Date.parse(value);
    if (Number.isNaN(parsed)) return value;
    return new Date(parsed).toLocaleString('zh-TW');
}

export default function AdminCommentsPage() {
    const [comments, setComments] = useState<AdminComment[]>([]);
    const [currentAdmin, setCurrentAdmin] = useState<CurrentAdmin | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [keyword, setKeyword] = useState('');
    const [note, setNote] = useState('');
    const [workingKey, setWorkingKey] = useState('');

    const loadComments = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/comments');
            const data = await res.json();
            if (!data.ok) {
                setError(data.error || '讀取留言管理資料時發生錯誤。');
                return;
            }

            setCurrentAdmin(data.data.currentAdmin || null);
            setComments(Array.isArray(data.data.comments) ? data.data.comments : []);
        } catch {
            setError('讀取留言管理資料時發生錯誤。');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadComments();
    }, []);

    const filteredComments = useMemo(() => {
        return comments.filter((comment) => {
            const statusMatch = statusFilter === 'all' || comment.status === statusFilter;
            const text = `${comment.author} ${comment.content} ${comment.targetLineId} ${comment.targetSessionId || ''}`.toLowerCase();
            const keywordMatch = !keyword.trim() || text.includes(keyword.trim().toLowerCase());
            return statusMatch && keywordMatch;
        });
    }, [comments, keyword, statusFilter]);

    const statusOptions = useMemo(() => {
        const values = Array.from(new Set(comments.map((comment) => comment.status).filter(Boolean)));
        return ['all', ...values];
    }, [comments]);

    const handleCommentAction = async (targetId: string, action: 'approve' | 'reject' | 'delete' | 'mark-read') => {
        const key = `${targetId}-${action}`;
        setWorkingKey(key);
        setMessage('');
        setError('');

        try {
            const res = await fetch('/api/admin/comments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ targetId, action, note }),
            });
            const data = await res.json();
            if (!data.ok) {
                setError(data.error || '更新留言狀態時發生錯誤。');
                return;
            }

            if (action === 'approve') setMessage('留言已核准。');
            if (action === 'reject') setMessage('留言已退回。');
            if (action === 'delete') setMessage('留言已刪除。');
            if (action === 'mark-read') setMessage('留言已標記為已閱。');

            await loadComments();
        } catch {
            setError('更新留言狀態時發生錯誤。');
        } finally {
            setWorkingKey('');
        }
    };

    return (
        <div className="min-h-screen bg-[#FBF7F0] pt-24">
            <Navbar />
            <main className="mx-auto max-w-6xl space-y-8 px-6 py-10">
                <section className="rounded-[2rem] border border-[#E8E0D4] bg-white p-8 shadow-sm">
                    <div className="space-y-3">
                        <p className="text-sm font-black uppercase tracking-[0.2em] text-[#8A8078]">Admin Comments</p>
                        <h1 className="text-4xl font-black text-[#2D2A26]" style={serif}>留言管理</h1>
                        <p className="max-w-3xl text-lg leading-relaxed text-[#6B6358]">
                            這裡集中處理全部留言，包含待審、已核准、退回與刪除狀態。
                        </p>
                    </div>

                    <div className="mt-6">
                        <AdminConsoleNav current="comments" />
                    </div>

                    <div className="mt-6 grid gap-4 md:grid-cols-[1fr_220px]">
                        <label className="flex items-center gap-3 rounded-xl border border-gray-200 bg-[#FBF7F0] px-4 py-3">
                            <Search size={16} className="text-[#8A8078]" />
                            <input
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                                placeholder="搜尋留言內容、作者或文章 ID"
                                className="w-full bg-transparent text-sm font-medium text-gray-700 outline-none"
                            />
                        </label>

                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="rounded-xl border border-gray-200 bg-[#FBF7F0] px-4 py-3 text-sm font-bold text-gray-700 outline-none"
                        >
                            {statusOptions.map((status) => (
                                <option key={status} value={status}>
                                    {status === 'all' ? '全部狀態' : status}
                                </option>
                            ))}
                        </select>
                    </div>

                    <textarea
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="可先填寫留言審核備註。"
                        className="mt-4 min-h-[96px] w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 outline-none focus:border-[#6B8E23]"
                    />

                    {message && <p className="mt-4 text-sm font-black text-[#5A6F35]">{message}</p>}
                    {error && <p className="mt-2 text-sm font-black text-red-600">{error}</p>}
                    {currentAdmin && (
                        <p className="mt-3 text-sm font-bold text-[#8A8078]">
                            目前登入：{currentAdmin.name} / {currentAdmin.role}
                        </p>
                    )}
                </section>

                <section className="rounded-[2rem] border border-[#E8E0D4] bg-white p-6 shadow-sm">
                    {loading ? (
                        <p className="text-sm font-bold text-gray-500">讀取中…</p>
                    ) : filteredComments.length === 0 ? (
                        <p className="text-sm font-bold text-gray-400">目前找不到符合條件的留言。</p>
                    ) : (
                        <div className="space-y-4">
                            {filteredComments.map((comment) => (
                                <div key={comment.id} className="rounded-2xl border border-gray-100 bg-[#FFFEFC] p-5">
                                    <div className="mb-2 flex items-start justify-between gap-4">
                                        <div>
                                            <div className="mb-2 flex flex-wrap items-center gap-2">
                                                <span className="rounded-full bg-[#FDE8D8] px-3 py-1 text-xs font-black text-[#C67B5C]">
                                                    {comment.type || '未分類'}
                                                </span>
                                                <span className="rounded-full bg-[#F3F6EA] px-3 py-1 text-xs font-black text-[#5A6F35]">
                                                    {comment.status || '未標記狀態'}
                                                </span>
                                                {comment.status === '待審核' && comment.reviewedAt && (
                                                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">
                                                        已閱待處理
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-base font-black text-[#2D2A26]">{comment.author || '匿名留言'}</p>
                                            <p className="text-sm font-bold text-[#8A8078]">
                                                文章 ID：{comment.targetLineId}
                                                {comment.targetSessionId ? ` / 場次：${comment.targetSessionId}` : ''}
                                            </p>
                                        </div>
                                        <p className="text-xs font-bold text-gray-400">{formatDate(comment.createdAt)}</p>
                                    </div>

                                    <p className="whitespace-pre-wrap text-sm leading-7 text-[#5A5347]">{comment.content}</p>

                                    <div className="mt-4 flex flex-wrap items-center gap-4 text-sm font-bold text-[#8A8078]">
                                        <span>按讚數：{comment.likes}</span>
                                        {comment.reviewedBy && <span>審核者：{comment.reviewedBy}</span>}
                                        {comment.reviewedAt && <span>審核時間：{formatDate(comment.reviewedAt)}</span>}
                                    </div>

                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {comment.status === '待審核' && (
                                            <button
                                                onClick={() => handleCommentAction(comment.id, 'mark-read')}
                                                disabled={workingKey === `${comment.id}-mark-read`}
                                                className="inline-flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-2 text-sm font-black text-slate-700 hover:bg-slate-200 disabled:opacity-50"
                                            >
                                                <Eye size={15} />
                                                標記已閱
                                            </button>
                                        )}
                                        {comment.status !== '已核准' && (
                                            <button
                                                onClick={() => handleCommentAction(comment.id, 'approve')}
                                                disabled={workingKey === `${comment.id}-approve`}
                                                className="inline-flex items-center gap-2 rounded-xl bg-[#6B8E23] px-4 py-2 text-sm font-black text-white hover:bg-[#5a781d] disabled:opacity-50"
                                            >
                                                <Check size={15} />
                                                核准
                                            </button>
                                        )}
                                        {comment.status !== '退回' && comment.status !== '已刪除' && (
                                            <button
                                                onClick={() => handleCommentAction(comment.id, 'reject')}
                                                disabled={workingKey === `${comment.id}-reject`}
                                                className="inline-flex items-center gap-2 rounded-xl bg-amber-100 px-4 py-2 text-sm font-black text-amber-700 hover:bg-amber-200 disabled:opacity-50"
                                            >
                                                <Undo2 size={15} />
                                                退回
                                            </button>
                                        )}
                                        {currentAdmin?.role === 'owner' && comment.status !== '已刪除' && (
                                            <button
                                                onClick={() => handleCommentAction(comment.id, 'delete')}
                                                disabled={workingKey === `${comment.id}-delete`}
                                                className="inline-flex items-center gap-2 rounded-xl bg-red-50 px-4 py-2 text-sm font-black text-red-600 hover:bg-red-100 disabled:opacity-50"
                                            >
                                                <Trash2 size={15} />
                                                刪除
                                            </button>
                                        )}
                                        {comment.targetLineId && (
                                            <a
                                                href={`/forum/${comment.targetLineId}`}
                                                className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm font-black text-gray-600 hover:border-[#6B8E23] hover:text-[#6B8E23]"
                                            >
                                                <MessageSquare size={15} />
                                                查看文章
                                            </a>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}
