'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, FileText, Heart, Layers3, MessageSquare } from 'lucide-react';
import { FadeIn } from '@/components/ui-shared';
import SubpageHeader from '@/components/SubpageHeader';

const serif = { fontFamily: "'Noto Serif TC', serif" };

type ForumArticle = {
    id: string;
    title: string;
    author: string;
    content: string;
    likes: number;
    createdAt: string;
    targetSessionId?: string;
    sourceSessionIds?: string[];
};

function stripHtml(html: string) {
    return html.replace(/<[^>]+>/g, '').trim();
}

export default function ForumPage() {
    const [posts, setPosts] = useState<ForumArticle[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/forum')
            .then((r) => r.json())
            .then((forumData) => {
                if (forumData.ok && Array.isArray(forumData.data)) {
                    setPosts(forumData.data);
                    return;
                }
                setPosts([]);
            })
            .catch(() => setPosts([]))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="min-h-screen text-[#2D2A26]" style={{ backgroundColor: '#FBF7F0' }}>
            <SubpageHeader />
            <div className="border-b border-[#E8E0D4] bg-gradient-to-b from-[#E3EED3] to-[#FBF7F0]">
                <div className="mx-auto max-w-4xl px-6 py-8">
                    <Link href="/" className="mb-4 flex items-center gap-1 text-[16px] font-bold text-[#7B8C4E] hover:underline">
                        <ArrowLeft size={16} />
                        返回首頁
                    </Link>
                    <h1 className="text-[42px] font-black md:text-[56px]" style={serif}>公開文章</h1>
                    <p className="mt-2 text-[20px] font-medium text-[#6B6358]">
                        這裡收錄經審核後公開的觀庭共構文章，可由單一場次或跨場次工作檯整理而成。
                    </p>
                    <div className="mt-5 flex flex-wrap gap-3">
                        <Link
                            href="/sessions"
                            className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-black text-[#6B8E23] shadow-sm ring-1 ring-[#DDE6C8] hover:bg-[#F9FBE7]"
                        >
                            <BookOpen size={16} />
                            查看場次
                        </Link>
                        <Link
                            href="/sessions/compose"
                            className="inline-flex items-center gap-2 rounded-full bg-[#6B8E23] px-4 py-2 text-sm font-black text-white shadow-sm hover:bg-[#5d7c1f]"
                        >
                            <Layers3 size={16} />
                            跨場次工作檯
                        </Link>
                    </div>
                </div>
            </div>

            <section className="mx-auto max-w-4xl px-6 py-8">
                <FadeIn>
                    <div className="mb-8 rounded-3xl border border-[#E8E0D4] bg-white p-6 shadow-sm md:p-8">
                        <div className="flex items-start gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#E3EED3] text-[#3D5220]">
                                <FileText size={24} />
                            </div>
                            <div className="space-y-2">
                                <h2 className="text-[24px] font-black text-[#2D2A26]" style={serif}>共構筆記呈現</h2>
                                <p className="text-[17px] font-medium leading-relaxed text-[#6B6358]">
                                    這是所有人共同建構的觀庭筆記，歡迎閱覽分享！
                                </p>
                                <p className="text-[17px] font-medium leading-relaxed text-[#6B6358]">
                                    這裡收錄經審核後公開的觀庭共構文章，可由單一場次或跨場次工作檯整理而成。
                                </p>
                                <p className="text-[16px] font-medium leading-relaxed text-[#8A8078]">
                                    為了維持專業論述的品質並守護實務工作者的法律安全，在投稿文章或發表專業見解前，請務必了解我們的「去識別化」及「免責原則」。
                                </p>
                            </div>
                        </div>
                    </div>
                </FadeIn>

                <FadeIn delay={0.06}>
                    <div className="mb-8 rounded-3xl border border-[#DDE6C8] bg-white p-6 shadow-sm md:p-8">
                        <h2 className="text-[30px] font-black leading-tight mb-4 text-[#2D2A26]" style={serif}>不造神・重文字<br />匿名化・去權威</h2>
                        <p className="text-[20px] text-[#6B6358] font-medium leading-[1.8] max-w-3xl mb-6">在這個演算法獎勵情緒、意見領袖壟斷話語權的時代，我們反其道而行。在這裡，不看職級、不分地域，只論專業論述與發言。</p>
                        <div className="flex flex-wrap gap-2">
                            {['經驗分享', '專業討論', '資料補充', '提問', '糾錯回報'].map(tag => (
                                <span
                                    key={tag}
                                    className="bg-[#E3EED3] text-[#3D5220] px-5 py-2.5 rounded-xl text-[16px] font-black border border-[#C5D9A8] shadow-sm inline-block"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </FadeIn>

                <div className="space-y-4">
                    {loading ? (
                        <div className="py-16 text-center">
                            <p className="text-[20px] font-bold text-[#8A8078]">載入文章中...</p>
                        </div>
                    ) : posts.length === 0 ? (
                        <FadeIn>
                            <div className="rounded-2xl border border-[#E8E0D4] bg-white py-16 text-center">
                                <FileText size={48} className="mx-auto mb-4 text-[#D4CCC0]" />
                                <p className="text-[20px] font-black text-[#8A8078]" style={serif}>目前尚無已公開文章</p>
                                <p className="mt-2 text-[16px] text-[#A09888]">待審核稿件完成後，會在這裡集中展示。</p>
                            </div>
                        </FadeIn>
                    ) : (
                        posts.map((post, i) => (
                            <FadeIn key={post.id} delay={i * 0.05}>
                                <Link href={`/forum/${post.id}`} className="block">
                                    <motion.div
                                        whileHover={{ y: -2 }}
                                        className="cursor-pointer rounded-2xl border border-[#E8E0D4] bg-white p-6 transition-all hover:shadow-md"
                                    >
                                        <div className="mb-3 flex flex-wrap items-center gap-2">
                                            <span className="rounded-lg bg-[#E3EED3] px-3 py-1 text-[13px] font-black text-[#3D5220]">
                                                已發布文章
                                            </span>
                                            {post.targetSessionId && (
                                                <span className="flex items-center gap-1 rounded-lg bg-blue-50 px-3 py-1 text-[13px] font-black text-blue-700">
                                                    <BookOpen size={12} />
                                                    主要場次 {post.targetSessionId}
                                                </span>
                                            )}
                                            {post.sourceSessionIds && post.sourceSessionIds.length > 1 && (
                                                <span className="flex items-center gap-1 rounded-lg bg-[#F9FBE7] px-3 py-1 text-[13px] font-black text-[#5A6F35]">
                                                    <Layers3 size={12} />
                                                    來源 {post.sourceSessionIds.length} 個場次
                                                </span>
                                            )}
                                            <div className="flex-1" />
                                            <span className="text-[14px] font-bold text-[#A09888]">{post.author || '匿名投稿'}</span>
                                            <span className="text-[12px] text-[#D4CCC0]">
                                                {new Date(post.createdAt).toLocaleDateString('zh-TW')}
                                            </span>
                                        </div>

                                        {post.sourceSessionIds && post.sourceSessionIds.length > 0 && (
                                            <div className="mb-3 flex flex-wrap gap-2">
                                                {post.sourceSessionIds.map((sessionId) => (
                                                    <span
                                                        key={sessionId}
                                                        className="rounded-full bg-[#F5F1E8] px-3 py-1 text-[12px] font-black text-[#6B6358]"
                                                    >
                                                        {sessionId}
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        <h3 className="text-[22px] font-black" style={serif}>{post.title}</h3>
                                        <p className="mt-2 line-clamp-3 text-[17px] font-medium text-[#6B6358]">
                                            {stripHtml(post.content)}
                                        </p>

                                        <div className="mt-4 flex items-center gap-4 text-[14px] font-bold text-[#A09888]">
                                            <span className="inline-flex items-center gap-1">
                                                <Heart size={14} />
                                                {post.likes}
                                            </span>
                                            <span className="inline-flex items-center gap-1">
                                                <MessageSquare size={14} />
                                                留言互動
                                            </span>
                                        </div>
                                    </motion.div>
                                </Link>
                            </FadeIn>
                        ))
                    )}
                </div>
            </section>
        </div>
    );
}
