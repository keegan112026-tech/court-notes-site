'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import SubpageHeader from '@/components/SubpageHeader';
import { Heart, TrendingUp } from 'lucide-react';

const serif = { fontFamily: "'Noto Serif TC', serif" };

export default function RankingsPage() {
    const [articles, setArticles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/trending?type=articles')
            .then((res) => res.json())
            .then((data) => setArticles(Array.isArray(data) ? data : []))
            .catch(() => setArticles([]))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 pt-24">
            <SubpageHeader />
            <main className="mx-auto max-w-5xl space-y-8 px-6 py-12">
                <div>
                    <h1 className="mb-3 text-4xl font-black text-gray-900" style={serif}>公開文章排行榜</h1>
                    <p className="text-lg leading-relaxed text-gray-600">
                        依據文章互動與整體熱度整理目前的公開文章排序，方便快速查找近期被閱讀與討論的內容。
                    </p>
                </div>

                <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
                    {loading ? (
                        <p className="text-lg font-bold text-gray-500">載入中...</p>
                    ) : articles.length === 0 ? (
                        <p className="text-lg leading-relaxed text-gray-600">目前尚無可供排序的公開文章。</p>
                    ) : (
                        <div className="space-y-4">
                            {articles.map((article, index) => (
                                <Link key={article.id} href={`/forum/${article.id}`} className="block">
                                    <div className="rounded-2xl border border-gray-100 p-5 transition-all hover:border-[#6B8E23]/30 hover:shadow-sm">
                                        <div className="mb-2 flex flex-wrap items-center gap-3">
                                            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#F9FBE7] font-black text-[#6B8E23]">
                                                {index + 1}
                                            </span>
                                            <span className="inline-flex items-center gap-1 rounded-full bg-[#F9FBE7] px-3 py-1 text-sm font-black text-[#6B8E23]">
                                                <TrendingUp size={14} /> 熱門文章
                                            </span>
                                            <span className="inline-flex items-center gap-1 text-sm font-bold text-gray-500">
                                                <Heart size={14} /> {article.likes}
                                            </span>
                                        </div>

                                        <h2 className="mb-2 text-2xl font-black text-gray-900" style={serif}>{article.title}</h2>
                                        <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-gray-500">
                                            <span>{article.author}</span>
                                            {article.targetSessionId && <span>{article.targetSessionId}</span>}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
