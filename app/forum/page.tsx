'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { PenTool, Gavel, Send, MessageCircle, Filter, Menu, X, ArrowLeft, Flame, BookOpen } from 'lucide-react';
import { FadeIn, Banner } from '@/components/ui-shared';

const serif = { fontFamily: "'Noto Serif TC', serif" };

export default function ForumPage() {
    const [posts, setPosts] = useState<any[]>([]);
    const [sessionsList, setSessionsList] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ author: '', title: '', content: '', category: '經驗分享', topic: '制度探討', targetSessionSid: '' });
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        Promise.all([
            fetch('/api/forum').then(r => r.json()),
            fetch('/api/sessions').then(r => r.json())
        ]).then(([forumData, sessionsData]) => {
            if (forumData.ok) setPosts(forumData.data);
            if (sessionsData.ok) setSessionsList(sessionsData.data);
        }).catch(() => { }).finally(() => setLoading(false));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title.trim() || !formData.content.trim()) return;
        setSubmitting(true);
        try {
            const res = await fetch('/api/forum', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (data.ok) {
                setSubmitted(true);
                setFormData({ author: '', title: '', content: '', category: '經驗分享', topic: '制度探討', targetSessionSid: '' });
                setTimeout(() => { setSubmitted(false); setShowForm(false); }, 3000);
            }
        } catch { } finally { setSubmitting(false); }
    };

    const categories = ['經驗分享', '專業討論', '資料補充', '提問', '糾錯回報'];
    const topics = ['制度探討', '實務經驗', '倫理界線', '流程爭議', '資源配置', '其他'];

    return (
        <div className="min-h-screen" style={{ backgroundColor: '#FBF7F0', color: '#2D2A26' }}>
            <div className="bg-gradient-to-b from-[#E3EED3] to-[#FBF7F0] border-b border-[#E8E0D4]">
                <div className="max-w-4xl mx-auto px-6 py-8">
                    <Link href="/" className="text-[#7B8C4E] text-[16px] font-bold flex items-center gap-1 mb-4 hover:underline"><ArrowLeft size={16} /> 返回首頁</Link>
                    <h1 className="text-[42px] md:text-[56px] font-black" style={serif}>專業論壇</h1>
                    <p className="text-[20px] text-[#6B6358] font-medium mt-2">不造神・重文字・匿名化・去權威</p>
                </div>
            </div>

            <section className="max-w-4xl mx-auto px-6 py-8">
                {/* 投稿按鈕 */}
                <FadeIn>
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex flex-wrap gap-2">
                            {categories.map(c => (
                                <span key={c} className="bg-[#E3EED3] text-[#3D5220] px-4 py-2 rounded-xl text-[15px] font-black border border-[#C5D9A8]">{c}</span>
                            ))}
                        </div>
                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setShowForm(!showForm)}
                            className="bg-gradient-to-r from-[#7B8C4E] to-[#5a6e38] text-white px-6 py-3 rounded-xl text-[16px] font-black shadow-lg">
                            {showForm ? '收起' : '我要投稿 ✍️'}
                        </motion.button>
                    </div>
                </FadeIn>

                {/* 投稿表單 */}
                {showForm && (
                    <FadeIn>
                        <div className="bg-white rounded-2xl p-6 md:p-8 border border-[#E8E0D4] shadow-sm mb-8">
                            {submitted ? (
                                <div className="text-center py-8">
                                    <p className="text-[24px] font-black text-[#7B8C4E]" style={serif}>✅ 投稿已送出！</p>
                                    <p className="text-[18px] text-[#8A8078] mt-2">待審核後即會顯示在論壇中</p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-[14px] font-black text-[#8A8078] mb-1">您的稱呼（選填，留空=匿名）</label>
                                            <input value={formData.author} onChange={e => setFormData({ ...formData, author: e.target.value })}
                                                className="w-full bg-[#FBF7F0] border border-[#E8E0D4] rounded-xl px-4 py-3 text-[17px] focus:outline-none focus:ring-2 focus:ring-[#7B8C4E]"
                                                placeholder="e.g. 兒保社工 C" />
                                        </div>
                                        <div>
                                            <label className="block text-[14px] font-black text-[#8A8078] mb-1">分類</label>
                                            <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}
                                                className="w-full bg-[#FBF7F0] border border-[#E8E0D4] rounded-xl px-4 py-3 text-[17px] focus:outline-none focus:ring-2 focus:ring-[#7B8C4E]">
                                                {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-[14px] font-black text-[#8A8078] mb-1">主題標籤</label>
                                            <select value={formData.topic} onChange={e => setFormData({ ...formData, topic: e.target.value })}
                                                className="w-full bg-[#FBF7F0] border border-[#E8E0D4] rounded-xl px-4 py-3 text-[17px] focus:outline-none focus:ring-2 focus:ring-[#7B8C4E]">
                                                {topics.map(t => <option key={t} value={t}>{t}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-[14px] font-black text-[#8A8078] mb-1">關聯場次（選填）</label>
                                            <select value={formData.targetSessionSid} onChange={e => setFormData({ ...formData, targetSessionSid: e.target.value })}
                                                className="w-full bg-[#FBF7F0] border border-[#E8E0D4] rounded-xl px-4 py-3 text-[17px] focus:outline-none focus:ring-2 focus:ring-[#7B8C4E] truncate">
                                                <option value="">-- 不指定場次 --</option>
                                                {sessionsList.map(s => <option key={s.sessionId} value={s.sessionId}>{s.sessionId} - {s.title}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[14px] font-black text-[#8A8078] mb-1">標題 *</label>
                                        <input value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required
                                            className="w-full bg-[#FBF7F0] border border-[#E8E0D4] rounded-xl px-4 py-3 text-[17px] focus:outline-none focus:ring-2 focus:ring-[#7B8C4E]"
                                            placeholder="請輸入投稿標題" />
                                    </div>
                                    <div>
                                        <label className="block text-[14px] font-black text-[#8A8078] mb-1">內容 *</label>
                                        <textarea value={formData.content} onChange={e => setFormData({ ...formData, content: e.target.value })} required rows={6}
                                            className="w-full bg-[#FBF7F0] border border-[#E8E0D4] rounded-xl px-4 py-3 text-[17px] focus:outline-none focus:ring-2 focus:ring-[#7B8C4E] resize-y"
                                            placeholder="請輸入您的專業觀察、經驗分享或討論..." />
                                    </div>
                                    <motion.button type="submit" disabled={submitting} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                        className="w-full bg-gradient-to-r from-[#7B8C4E] to-[#5a6e38] text-white py-4 rounded-xl text-[18px] font-black shadow-lg disabled:opacity-50">
                                        {submitting ? '送出中...' : '送出審核'}
                                    </motion.button>
                                    <p className="text-[14px] text-[#A09888] font-bold text-center">所有投稿需經審核後才會公開顯示</p>
                                </form>
                            )}
                        </div>
                    </FadeIn>
                )}

                {/* 帖子列表 */}
                <div className="space-y-4">
                    {loading ? (
                        <div className="text-center py-16">
                            <p className="text-[20px] text-[#8A8078] font-bold">載入中...</p>
                        </div>
                    ) : posts.length === 0 ? (
                        <FadeIn>
                            <div className="text-center py-16 bg-white rounded-2xl border border-[#E8E0D4]">
                                <MessageCircle size={48} className="mx-auto text-[#D4CCC0] mb-4" />
                                <p className="text-[20px] font-black text-[#8A8078]" style={serif}>論壇尚無已發布文章</p>
                                <p className="text-[16px] text-[#A09888] mt-2">成為第一位投稿的人吧！</p>
                            </div>
                        </FadeIn>
                    ) : (
                        posts.map((post, i) => (
                            <FadeIn key={post.id} delay={i * 0.05}>
                                <Link href={`/forum/${post.id}`} className="block">
                                    <motion.div whileHover={{ y: -2 }}
                                        className="bg-white p-6 rounded-2xl border border-[#E8E0D4] hover:shadow-md transition-all cursor-pointer">
                                        <div className="flex flex-wrap items-center gap-2 mb-3">
                                            <span className="bg-[#E3EED3] text-[#3D5220] px-3 py-1 rounded-lg text-[13px] font-black">{post.category}</span>
                                            {post.targetTopic && (
                                                <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-lg text-[13px] font-black">#{post.targetTopic}</span>
                                            )}
                                            {post.targetSessionId && (
                                                <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg text-[13px] font-black flex items-center gap-1">
                                                    <BookOpen size={12} /> 關聯場次
                                                </span>
                                            )}
                                            <div className="flex-1"></div>
                                            <span className="text-[14px] text-[#A09888] font-bold">{post.author || '匿名'}</span>
                                            <span className="text-[12px] text-[#D4CCC0]">{new Date(post.createdAt).toLocaleDateString('zh-TW')}</span>
                                        </div>
                                        <h3 className="text-[22px] font-black" style={serif}>{post.title}</h3>
                                        <p className="text-[17px] text-[#6B6358] font-medium mt-2 line-clamp-3">{post.content}</p>
                                        <div className="flex items-center gap-4 mt-4 text-[14px] font-bold text-[#A09888]">
                                            <span>❤️ {post.likes}</span>
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
