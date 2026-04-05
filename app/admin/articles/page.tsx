'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { Layers3, Search } from 'lucide-react';

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

function formatDate(value: string) {
    const parsed = Date.parse(value);
    if (Number.isNaN(parsed)) return value;
    return new Date(parsed).toLocaleString('zh-TW');
}

export default function AdminArticlesPage() {
    const [articles, setArticles] = useState<AdminArticle[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [keyword, setKeyword] = useState('');

    useEffect(() => {
        fetch('/api/admin/articles')
            .then((res) => res.json())
            .then((data) => {
                if (!data.ok) {
                    setError(data.error || '讀取文章總覽失敗。');
                    return;
                }
                setArticles(Array.isArray(data.data.articles) ? data.data.articles : []);
            })
            .catch(() => setError('讀取文章總覽失敗。'))
            .finally(() => setLoading(false));
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

    return (
        <div className="min-h-screen bg-[#FBF7F0] pt-24">
            <Navbar />
            <main className="mx-auto max-w-6xl space-y-8 px-6 py-10">
                <section className="rounded-[2rem] border border-[#E8E0D4] bg-white p-8 shadow-sm">
                    <div className="space-y-3">
                        <p className="text-sm font-black uppercase tracking-[0.2em] text-[#8A8078]">Admin Articles</p>
                        <h1 className="text-4xl font-black text-[#2D2A26]" style={serif}>文章總覽</h1>
                        <p className="max-w-3xl text-lg leading-relaxed text-[#6B6358]">
                            這裡可查看所有文章狀態，包含待審、已發布、退回修改與其他狀態。
                        </p>
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
                </section>

                <section className="rounded-[2rem] border border-[#E8E0D4] bg-white p-6 shadow-sm">
                    {loading ? (
                        <p className="text-sm font-bold text-gray-500">載入中...</p>
                    ) : error ? (
                        <p className="text-sm font-bold text-red-600">{error}</p>
                    ) : filteredArticles.length === 0 ? (
                        <p className="text-sm font-bold text-gray-400">目前沒有符合條件的文章。</p>
                    ) : (
                        <div className="space-y-4">
                            {filteredArticles.map((article) => (
                                <div key={article.id} className="rounded-2xl border border-gray-100 bg-[#FFFEFC] p-5">
                                    <div className="mb-3 flex flex-wrap items-start justify-between gap-4">
                                        <div className="space-y-2">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span className="rounded-full bg-[#E3EED3] px-3 py-1 text-xs font-black text-[#3D5220]">
                                                    {article.status || '未設定狀態'}
                                                </span>
                                                {article.targetSessionId && (
                                                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-blue-700">
                                                        主要場次 {article.targetSessionId}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-xl font-black text-[#2D2A26]" style={serif}>{article.title}</p>
                                            <p className="text-sm font-bold text-[#8A8078]">
                                                {article.author || '匿名作者'} ・ {article.category || '未分類'}
                                            </p>
                                        </div>
                                        <p className="text-xs font-bold text-gray-400">{formatDate(article.createdAt)}</p>
                                    </div>

                                    {article.sourceSessionIds && article.sourceSessionIds.length > 0 && (
                                        <div className="mb-4 flex flex-wrap items-center gap-2">
                                            <span className="inline-flex items-center gap-1 text-sm font-black text-[#6B6358]">
                                                <Layers3 size={14} />
                                                引用來源場次
                                            </span>
                                            {article.sourceSessionIds.map((sessionId) => (
                                                <span key={sessionId} className="rounded-full bg-[#F3F6EA] px-3 py-1 text-xs font-black text-[#5A6F35]">
                                                    {sessionId}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    <div className="flex flex-wrap items-center gap-4 text-sm font-bold text-[#8A8078]">
                                        <span>按讚數 {article.likes}</span>
                                        {article.contactEmail && <span>聯絡信箱：{article.contactEmail}</span>}
                                        <Link href={`/forum/${article.id}`} className="text-[#6B8E23] hover:underline">
                                            查看公開文章
                                        </Link>
                                        <Link href="/admin/review" className="text-[#C67B5C] hover:underline">
                                            前往審查頁
                                        </Link>
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
