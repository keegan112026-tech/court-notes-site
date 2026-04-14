'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import AdminConsoleNav from '@/components/admin/AdminConsoleNav';
import { Archive, Check, Layers3, Search, Trash2, Undo2 } from 'lucide-react';

const serif = { fontFamily: "'Noto Serif TC', serif" };

type AdminArticle = {
    id: string;
    title: string;
    author: string;
    contactEmail?: string;
    category: string;
    targetSessionId: string;
    sourceSessionIds?: string[];
    status: string;
    likes: number;
    createdAt: string;
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

export default function AdminArticlesPage() {
    const [articles, setArticles] = useState<AdminArticle[]>([]);
    const [currentAdmin, setCurrentAdmin] = useState<CurrentAdmin | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [keyword, setKeyword] = useState('');
    const [note, setNote] = useState('');
    const [workingKey, setWorkingKey] = useState('');

    const loadArticles = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/articles');
            const data = await res.json();
            if (!data.ok) {
                setError(data.error || '讀取文章管理資料時發生錯誤。');
                return;
            }

            setCurrentAdmin(data.data.currentAdmin || null);
            setArticles(Array.isArray(data.data.articles) ? data.data.articles : []);
        } catch {
            setError('讀取文章管理資料時發生錯誤。');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadArticles();
    }, []);

    const filteredArticles = useMemo(() => {
        return articles.filter((article) => {
            const statusMatch = statusFilter === 'all' || article.status === statusFilter;
            const text = `${article.title} ${article.author} ${article.targetSessionId} ${(article.sourceSessionIds || []).join(' ')}`.toLowerCase();
            const keywordMatch = !keyword.trim() || text.includes(keyword.trim().toLowerCase());
            return statusMatch && keywordMatch;
        });
    }, [articles, keyword, statusFilter]);

    const statusOptions = useMemo(() => {
        const values = Array.from(new Set(articles.map((article) => article.status).filter(Boolean)));
        return ['all', ...values];
    }, [articles]);

    const handleArticleAction = async (targetId: string, action: 'approve' | 'reject' | 'delete') => {
        const key = `${targetId}-${action}`;
        setWorkingKey(key);
        setMessage('');
        setError('');

        try {
            const res = await fetch('/api/admin/articles', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ targetId, action, note }),
            });
            const data = await res.json();

            if (!data.ok) {
                setError(data.error || '更新文章狀態時發生錯誤。');
                return;
            }

            if (action === 'approve') setMessage('文章已設為待發布。請執行正式發布流程後再上線。');
            if (action === 'reject') setMessage('文章已退回修改。');
            if (action === 'delete') setMessage('文章已封存刪除。');

            await loadArticles();
        } catch {
            setError('更新文章狀態時發生錯誤。');
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
                        <p className="text-sm font-black uppercase tracking-[0.2em] text-[#8A8078]">Admin Articles</p>
                        <h1 className="text-4xl font-black text-[#2D2A26]" style={serif}>文章管理</h1>
                        <p className="max-w-3xl text-lg leading-relaxed text-[#6B6358]">
                            這裡管理全部文章，包含待審、待發布、已發布、退回修改與封存內容。
                        </p>
                    </div>

                    <div className="mt-6">
                        <AdminConsoleNav current="articles" />
                    </div>

                    <div className="mt-6 grid gap-4 md:grid-cols-[1fr_220px]">
                        <label className="flex items-center gap-3 rounded-xl border border-gray-200 bg-[#FBF7F0] px-4 py-3">
                            <Search size={16} className="text-[#8A8078]" />
                            <input
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                                placeholder="搜尋標題、作者或場次"
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
                        placeholder="可先填寫管理備註，之後核准、退回或封存時會一起記錄。"
                        className="mt-4 min-h-[96px] w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 outline-none focus:border-[#6B8E23]"
                    />

                    <div className="mt-4 rounded-2xl border border-[#E8E0D4] bg-[#FBF7F0] px-4 py-3 text-sm font-medium leading-7 text-[#6B6358]">
                        <p className="font-black text-[#2D2A26]">正式發布提醒</p>
                        <p>文章在這裡設為「待發布」後，仍需由本地發布流程匯出 snapshot 並重新部署，才會出現在匯集區前台。</p>
                    </div>

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
                    ) : filteredArticles.length === 0 ? (
                        <p className="text-sm font-bold text-gray-400">目前找不到符合條件的文章。</p>
                    ) : (
                        <div className="space-y-4">
                            {filteredArticles.map((article) => (
                                <div key={article.id} className="rounded-2xl border border-gray-100 bg-[#FFFEFC] p-5">
                                    <div className="mb-3 flex flex-wrap items-start justify-between gap-4">
                                        <div className="space-y-2">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span className="rounded-full bg-[#E3EED3] px-3 py-1 text-xs font-black text-[#3D5220]">
                                                    {article.status || '未標記狀態'}
                                                </span>
                                                {article.targetSessionId && (
                                                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-blue-700">
                                                        主要場次 {article.targetSessionId}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-xl font-black text-[#2D2A26]" style={serif}>{article.title}</p>
                                            <p className="text-sm font-bold text-[#8A8078]">
                                                {article.author || '匿名投稿'} / 類型：{article.category || '未分類'}
                                            </p>
                                        </div>
                                        <p className="text-xs font-bold text-gray-400">{formatDate(article.createdAt)}</p>
                                    </div>

                                    {article.sourceSessionIds && article.sourceSessionIds.length > 0 && (
                                        <div className="mb-4 flex flex-wrap items-center gap-2">
                                            <span className="inline-flex items-center gap-1 text-sm font-black text-[#6B6358]">
                                                <Layers3 size={14} />
                                                來源場次
                                            </span>
                                            {article.sourceSessionIds.map((sessionId) => (
                                                <span key={sessionId} className="rounded-full bg-[#F3F6EA] px-3 py-1 text-xs font-black text-[#5A6F35]">
                                                    {sessionId}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    <div className="flex flex-wrap items-center gap-4 text-sm font-bold text-[#8A8078]">
                                        <span>按讚數：{article.likes}</span>
                                        {article.contactEmail && <span>聯絡信箱：{article.contactEmail}</span>}
                                        {article.status === '已發布' && (
                                            <Link href={`/forum/${article.id}`} className="text-[#6B8E23] hover:underline">
                                                查看公開頁
                                            </Link>
                                        )}
                                    </div>

                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {article.status !== '已發布' && (
                                            <button
                                                onClick={() => handleArticleAction(article.id, 'approve')}
                                                disabled={workingKey === `${article.id}-approve`}
                                                className="inline-flex items-center gap-2 rounded-xl bg-[#6B8E23] px-4 py-2 text-sm font-black text-white hover:bg-[#5a781d] disabled:opacity-50"
                                            >
                                                <Check size={15} />
                                                設為待發布
                                            </button>
                                        )}
                                        {article.status !== '退回修改' && article.status !== '已封存' && (
                                            <button
                                                onClick={() => handleArticleAction(article.id, 'reject')}
                                                disabled={workingKey === `${article.id}-reject`}
                                                className="inline-flex items-center gap-2 rounded-xl bg-amber-100 px-4 py-2 text-sm font-black text-amber-700 hover:bg-amber-200 disabled:opacity-50"
                                            >
                                                <Undo2 size={15} />
                                                退回修改
                                            </button>
                                        )}
                                        {currentAdmin?.role === 'owner' && article.status !== '已封存' && (
                                            <button
                                                onClick={() => handleArticleAction(article.id, 'delete')}
                                                disabled={workingKey === `${article.id}-delete`}
                                                className="inline-flex items-center gap-2 rounded-xl bg-red-50 px-4 py-2 text-sm font-black text-red-600 hover:bg-red-100 disabled:opacity-50"
                                            >
                                                <Archive size={15} />
                                                封存刪除
                                            </button>
                                        )}
                                        {currentAdmin?.role === 'owner' && article.status === '已封存' && (
                                            <span className="inline-flex items-center gap-2 rounded-xl bg-gray-100 px-4 py-2 text-sm font-black text-gray-500">
                                                <Trash2 size={15} />
                                                已封存
                                            </span>
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
