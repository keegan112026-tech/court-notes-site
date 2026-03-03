'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, MessageSquare, ThumbsUp, Calendar, User, Tag, Send, Heart } from 'lucide-react';
import { FadeIn, LikeButton } from '@/components/ui-shared';

const serif = { fontFamily: "'Noto Serif TC', serif" };

export default function ForumPostPage() {
    const params = useParams();
    const postId = params.id as string;

    const [post, setPost] = useState<any>(null);
    const [comments, setComments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [newComment, setNewComment] = useState('');
    const [authorName, setAuthorName] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [submitMsg, setSubmitMsg] = useState('');

    useEffect(() => {
        fetch(`/api/forum/${postId}`)
            .then(r => r.json())
            .then(data => {
                if (data.ok) {
                    setPost(data.data.post);
                    setComments(data.data.comments || []);
                } else {
                    setError(data.error || '無法載入文章');
                }
            })
            .catch(() => setError('網路錯誤'))
            .finally(() => setLoading(false));
    }, [postId]);

    const handleSubmitComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        setSubmitting(true);
        try {
            // Re-using the same comment endpoint, but type '文章留言' isn't explicitly defined in api/comments/route.ts.
            // Oh, we should probably update api/comments/route.ts to take 'type' param, 
            // or we will just use targetLineId as the article ID. Let's just create the comment with default type in API. 
            // Actually, we'll need to modify the api/comments to allow type='文章留言'. Let's do it in a sec.
            const res = await fetch('/api/comments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ targetLineId: postId, author: authorName, content: newComment, type: '文章留言' }),
            });
            const data = await res.json();
            if (data.ok) {
                setSubmitMsg('✅ 留言已送出，待審核後顯示');
                setComments([...comments, { id: `local-${Date.now()}`, author: authorName || '匿名夥伴', content: newComment, likes: 0, createdAt: new Date().toISOString() }]);
                setNewComment('');
                setTimeout(() => setSubmitMsg(''), 3000);
            } else {
                setSubmitMsg(`❌ ${data.error}`);
            }
        } catch { setSubmitMsg('❌ 網路錯誤'); } finally { setSubmitting(false); }
    };

    if (loading) return <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center font-bold text-gray-500">載入中...</div>;
    if (error || !post) return (
        <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center space-y-4">
            <h2 className="text-2xl font-black text-gray-800" style={serif}>{error || '文章不存在'}</h2>
            <Link href="/forum" className="text-[#6B8E23] hover:underline font-bold">返回論壇列表</Link>
        </div>
    );

    const formattedDate = new Date(post.createdAt).toLocaleDateString('zh-TW', { year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <div className="min-h-screen bg-[#FAFAFA] text-gray-800 font-sans selection:bg-[#6B8E23]/20 pb-20">
            {/* Header */}
            <div className="bg-white border-b border-gray-100 shadow-sm relative overflow-hidden">
                <div className="absolute right-0 top-0 w-1/3 h-full bg-gradient-to-l from-[#F9FBE7] to-transparent pointer-events-none" />
                <div className="max-w-4xl mx-auto px-6 py-8 relative z-10">
                    <Link href="/forum" className="inline-flex items-center gap-2 text-gray-500 hover:text-[#6B8E23] mb-6 transition-colors bg-gray-50 px-4 py-2 rounded-full text-sm font-bold shadow-sm border border-gray-100">
                        <ArrowLeft size={16} /> 返回論壇
                    </Link>
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                        <span className="bg-[#E9EDDA] text-[#6B8E23] px-3 py-1 rounded-full text-sm font-black tracking-widest">{post.category}</span>
                        {post.targetTopic && <span className="bg-orange-50 text-orange-600 px-3 py-1 rounded-full text-sm font-bold border border-orange-100">#{post.targetTopic}</span>}
                    </div>
                    <h1 className="text-3xl md:text-5xl font-black text-gray-900 leading-tight mb-6" style={serif}>
                        {post.title}
                    </h1>
                    <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 font-medium">
                        <span className="flex items-center gap-1.5"><User size={16} /> {post.author}</span>
                        <span className="flex items-center gap-1.5"><Calendar size={16} /> {formattedDate}</span>
                        <LikeButton initialCount={post.likes} targetId={post.id} targetType="interactions" size="sm" />
                    </div>
                </div>
            </div>

            <main className="max-w-3xl mx-auto px-6 pt-12">
                <FadeIn>
                    <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-sm border border-gray-100 mb-12">
                        <div className="prose prose-lg prose-p:leading-[2] prose-p:text-gray-700 prose-a:text-[#6B8E23] max-w-none whitespace-pre-wrap">
                            {post.content}
                        </div>
                    </div>
                </FadeIn>

                <FadeIn delay={0.1}>
                    <div className="space-y-8">
                        <h3 className="text-2xl font-black text-gray-900 flex items-center gap-2" style={serif}>
                            <MessageSquare className="text-[#6B8E23]" /> 專業迴響 ({comments.length})
                        </h3>

                        {/* Comments List */}
                        <div className="space-y-4">
                            {comments.length === 0 ? (
                                <p className="text-gray-400 font-bold text-center py-8 bg-gray-50 rounded-2xl border border-gray-100">目前尚無迴響，歡迎發表您的見解。</p>
                            ) : (
                                comments.map((c, i) => (
                                    <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-black text-[#6B8E23] bg-[#F9FBE7] px-2 py-1 rounded">{c.author}</span>
                                            <span className="text-[11px] font-bold text-gray-400">{new Date(c.createdAt).toLocaleString('zh-TW', { year: 'numeric', month: 'numeric', day: 'numeric' })}</span>
                                        </div>
                                        <p className="text-[15px] font-medium text-gray-700 leading-relaxed whitespace-pre-wrap">{c.content}</p>
                                        <div className="flex items-center gap-4 pt-2">
                                            <LikeButton initialCount={c.likes} targetId={c.id} targetType="interactions" size="sm" />
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Comment Form */}
                        <div className="bg-gray-50 p-6 md:p-8 rounded-[2rem] border border-gray-100 mt-8">
                            <h4 className="text-lg font-black text-gray-800 mb-4" style={serif}>發表見解</h4>
                            {submitMsg ? (
                                <div className="text-center py-6 font-bold text-[#6B8E23] text-lg bg-[#F9FBE7] rounded-xl">{submitMsg}</div>
                            ) : (
                                <form onSubmit={handleSubmitComment} className="space-y-4">
                                    <input type="text" value={authorName} onChange={(e) => setAuthorName(e.target.value)} placeholder="您的身分稱呼（如：社工督導），不填將顯示匿名夥伴" className="w-full bg-white p-4 rounded-xl border border-gray-200 focus:border-[#6B8E23] outline-none font-bold text-gray-700 text-sm" />
                                    <textarea required rows={4} value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="請輸入您對這篇文章的想法..." className="w-full bg-white p-4 rounded-xl border border-gray-200 focus:border-[#6B8E23] outline-none font-medium text-gray-700 text-sm resize-none" />
                                    <button type="submit" disabled={submitting} className="w-full bg-[#6B8E23] text-white py-4 rounded-xl font-black shadow-md hover:scale-[1.01] transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                                        {submitting ? '送出中...' : '送出留言'} <Send size={16} />
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </FadeIn>
            </main>
        </div>
    );
}
