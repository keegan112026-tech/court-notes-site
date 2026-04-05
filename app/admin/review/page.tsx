'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import AdminConsoleNav from '@/components/admin/AdminConsoleNav';
import {
    AlertCircle,
    Check,
    ChevronDown,
    ChevronUp,
    FileText,
    LogOut,
    Mail,
    MessageSquare,
    Shield,
    Trash2,
    X,
} from 'lucide-react';

const serif = { fontFamily: "'Noto Serif TC', serif" };

type PendingArticle = {
    id: string;
    title: string;
    author: string;
    contactEmail?: string;
    targetSessionId: string;
    sourceSessionIds?: string[];
    createdAt: string;
    content: string;
};

type PendingComment = {
    id: string;
    author: string;
    content: string;
    targetLineId: string;
    createdAt: string;
    type: string;
};

type CurrentAdmin = {
    name: string;
    role: 'owner' | 'reviewer';
};

function stripHtml(html: string) {
    return html.replace(/<[^>]+>/g, '').trim();
}

function formatDate(value: string) {
    const parsed = Date.parse(value);
    if (Number.isNaN(parsed)) return value;
    return new Date(parsed).toLocaleString('zh-TW');
}

export default function AdminReviewPage() {
    const [currentAdmin, setCurrentAdmin] = useState<CurrentAdmin | null>(null);
    const [note, setNote] = useState('');
    const [pendingArticles, setPendingArticles] = useState<PendingArticle[]>([]);
    const [pendingComments, setPendingComments] = useState<PendingComment[]>([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [workingKey, setWorkingKey] = useState('');
    const [expandedArticleId, setExpandedArticleId] = useState<string | null>(null);

    const loadPending = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/review');
            const data = await res.json();

            if (!data.ok) {
                setMessage(data.error || '讀取待審資料時發生錯誤。');
                return;
            }

            setCurrentAdmin(data.data.currentAdmin || null);
            setPendingArticles(Array.isArray(data.data.pendingArticles) ? data.data.pendingArticles : []);
            setPendingComments(Array.isArray(data.data.pendingComments) ? data.data.pendingComments : []);
        } catch {
            setMessage('讀取待審資料時發生錯誤。');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPending();
    }, []);

    const handleLogout = async () => {
        await fetch('/api/admin/session', { method: 'DELETE' });
        window.location.href = '/admin/login';
    };

    const handleReview = async (
        targetType: 'article' | 'comment',
        targetId: string,
        action: 'approve' | 'reject' | 'delete'
    ) => {
        const key = `${targetType}-${targetId}-${action}`;
        setWorkingKey(key);
        setMessage('');

        try {
            const res = await fetch('/api/admin/review', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    targetType,
                    targetId,
                    action,
                    note,
                }),
            });
            const data = await res.json();

            if (!data.ok) {
                setMessage(data.error || '更新審核狀態時發生錯誤。');
                return;
            }

            if (action === 'approve') setMessage('已核准並更新狀態。');
            if (action === 'reject') setMessage('已退回修改。');
            if (action === 'delete') setMessage('已封存刪除。');

            await loadPending();
        } catch {
            setMessage('更新審核狀態時發生錯誤。');
        } finally {
            setWorkingKey('');
        }
    };

    return (
        <div className="min-h-screen bg-[#FBF7F0] pt-24">
            <Navbar />
            <main className="mx-auto max-w-6xl space-y-8 px-6 py-10">
                <section className="rounded-[2rem] border border-[#E8E0D4] bg-white p-8 shadow-sm">
                    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                        <div className="space-y-3">
                            <p className="text-sm font-black uppercase tracking-[0.2em] text-[#8A8078]">Admin Review</p>
                            <h1 className="text-4xl font-black text-[#2D2A26]" style={serif}>待審核</h1>
                            <p className="max-w-3xl text-lg leading-relaxed text-[#6B6358]">
                                這裡只處理待審文章與待審留言。已上架文章請到文章管理，私密傳訊請到收件匣。
                            </p>
                        </div>

                        <div className="flex flex-col gap-3 md:items-end">
                            <div className="min-w-[220px] rounded-2xl border border-[#DDE6C8] bg-[#F9FBE7] px-4 py-3">
                                <div className="flex items-center gap-2 text-sm font-black text-[#5A6F35]">
                                    <Shield size={16} />
                                    目前登入身份
                                </div>
                                <p className="mt-1 text-lg font-black text-[#2D2A26]">{currentAdmin?.name || '尚未登入'}</p>
                                <p className="text-sm font-bold uppercase tracking-[0.12em] text-[#8A8078]">{currentAdmin?.role || 'unknown'}</p>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm font-black text-gray-600 hover:border-[#C67B5C] hover:text-[#C67B5C]"
                            >
                                <LogOut size={16} />
                                登出
                            </button>
                        </div>
                    </div>

                    <AdminConsoleNav current="review" />

                    <input
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="可先填寫審核備註，會同步寫入審查紀錄。"
                        className="mt-6 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 outline-none focus:border-[#6B8E23]"
                    />

                    {message && (
                        <div className="mt-4 flex items-center gap-2 rounded-xl border border-[#DDE6C8] bg-[#F9FBE7] px-4 py-3 text-sm font-bold text-[#5A6F35]">
                            <AlertCircle size={16} />
                            {message}
                        </div>
                    )}
                </section>

                <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                    <div className="rounded-[2rem] border border-[#E8E0D4] bg-white p-6 shadow-sm">
                        <div className="mb-5 flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#E3EED3] text-[#3D5220]">
                                <FileText size={22} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-[#2D2A26]" style={serif}>待審文章</h2>
                                <p className="text-sm font-bold text-[#8A8078]">{pendingArticles.length} 篇</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {loading ? (
                                <p className="text-sm font-bold text-gray-500">讀取中…</p>
                            ) : pendingArticles.length === 0 ? (
                                <p className="text-sm font-bold text-gray-400">目前沒有待審文章。</p>
                            ) : pendingArticles.map((article) => (
                                <div key={article.id} className="rounded-2xl border border-gray-100 bg-[#FFFEFC] p-5">
                                    <div className="mb-3 flex items-start justify-between gap-4">
                                        <div className="space-y-2">
                                            <p className="text-lg font-black text-[#2D2A26]" style={serif}>{article.title}</p>
                                            <p className="text-sm font-bold text-[#8A8078]">
                                                {article.author || '匿名投稿'} / 主要場次 {article.targetSessionId || '未指定'}
                                            </p>
                                        </div>
                                        <p className="text-xs font-bold text-gray-400">{formatDate(article.createdAt)}</p>
                                    </div>

                                    <div className="mb-4 space-y-2 text-sm">
                                        {article.sourceSessionIds && article.sourceSessionIds.length > 0 && (
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span className="font-black text-[#6B6358]">來源場次</span>
                                                {article.sourceSessionIds.map((sessionId) => (
                                                    <span
                                                        key={sessionId}
                                                        className="rounded-full bg-[#F3F6EA] px-3 py-1 text-xs font-black text-[#5A6F35]"
                                                    >
                                                        {sessionId}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                        {article.contactEmail && (
                                            <div className="flex items-center gap-2 text-[#6B6358]">
                                                <Mail size={14} />
                                                <span className="font-black">聯絡信箱</span>
                                                <span className="font-medium">{article.contactEmail}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className={`text-sm leading-7 text-[#5A5347] ${expandedArticleId === article.id ? '' : 'line-clamp-4'}`}>
                                        {stripHtml(article.content)}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setExpandedArticleId(expandedArticleId === article.id ? null : article.id)}
                                        className="mt-1 inline-flex items-center gap-1 text-xs font-black text-[#6B8E23] hover:text-[#5a781d]"
                                    >
                                        {expandedArticleId === article.id
                                            ? <><ChevronUp size={13} /> 收合</>
                                            : <><ChevronDown size={13} /> 展開全文</>
                                        }
                                    </button>

                                    <div className="mt-4 flex flex-wrap gap-2">
                                        <button
                                            onClick={() => handleReview('article', article.id, 'approve')}
                                            disabled={workingKey === `article-${article.id}-approve`}
                                            className="inline-flex items-center gap-2 rounded-xl bg-[#6B8E23] px-4 py-2 text-sm font-black text-white hover:bg-[#5a781d] disabled:opacity-50"
                                        >
                                            <Check size={15} />
                                            核准
                                        </button>
                                        <button
                                            onClick={() => handleReview('article', article.id, 'reject')}
                                            disabled={workingKey === `article-${article.id}-reject`}
                                            className="inline-flex items-center gap-2 rounded-xl bg-amber-100 px-4 py-2 text-sm font-black text-amber-700 hover:bg-amber-200 disabled:opacity-50"
                                        >
                                            <X size={15} />
                                            退回
                                        </button>
                                        {currentAdmin?.role === 'owner' && (
                                            <button
                                                onClick={() => handleReview('article', article.id, 'delete')}
                                                disabled={workingKey === `article-${article.id}-delete`}
                                                className="inline-flex items-center gap-2 rounded-xl bg-red-50 px-4 py-2 text-sm font-black text-red-600 hover:bg-red-100 disabled:opacity-50"
                                            >
                                                <Trash2 size={15} />
                                                刪除
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-[2rem] border border-[#E8E0D4] bg-white p-6 shadow-sm">
                        <div className="mb-5 flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#FDE8D8] text-[#C67B5C]">
                                <MessageSquare size={22} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-[#2D2A26]" style={serif}>待審留言</h2>
                                <p className="text-sm font-bold text-[#8A8078]">{pendingComments.length} 則</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {loading ? (
                                <p className="text-sm font-bold text-gray-500">讀取中…</p>
                            ) : pendingComments.length === 0 ? (
                                <p className="text-sm font-bold text-gray-400">目前沒有待審留言。</p>
                            ) : pendingComments.map((comment) => (
                                <div key={comment.id} className="rounded-2xl border border-gray-100 bg-[#FFFEFC] p-5">
                                    <div className="mb-2 flex items-start justify-between gap-4">
                                        <div>
                                            <p className="text-base font-black text-[#2D2A26]">{comment.author || '匿名留言'}</p>
                                            <p className="text-sm font-bold text-[#8A8078]">
                                                文章 ID：{comment.targetLineId} / 類型：{comment.type}
                                            </p>
                                        </div>
                                        <p className="text-xs font-bold text-gray-400">{formatDate(comment.createdAt)}</p>
                                    </div>
                                    <p className="whitespace-pre-wrap text-sm leading-7 text-[#5A5347]">{comment.content}</p>

                                    <div className="mt-4 flex flex-wrap gap-2">
                                        <button
                                            onClick={() => handleReview('comment', comment.id, 'approve')}
                                            disabled={workingKey === `comment-${comment.id}-approve`}
                                            className="inline-flex items-center gap-2 rounded-xl bg-[#6B8E23] px-4 py-2 text-sm font-black text-white hover:bg-[#5a781d] disabled:opacity-50"
                                        >
                                            <Check size={15} />
                                            核准
                                        </button>
                                        <button
                                            onClick={() => handleReview('comment', comment.id, 'reject')}
                                            disabled={workingKey === `comment-${comment.id}-reject`}
                                            className="inline-flex items-center gap-2 rounded-xl bg-amber-100 px-4 py-2 text-sm font-black text-amber-700 hover:bg-amber-200 disabled:opacity-50"
                                        >
                                            <X size={15} />
                                            退回
                                        </button>
                                        {currentAdmin?.role === 'owner' && (
                                            <button
                                                onClick={() => handleReview('comment', comment.id, 'delete')}
                                                disabled={workingKey === `comment-${comment.id}-delete`}
                                                className="inline-flex items-center gap-2 rounded-xl bg-red-50 px-4 py-2 text-sm font-black text-red-600 hover:bg-red-100 disabled:opacity-50"
                                            >
                                                <Trash2 size={15} />
                                                刪除
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
