'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Send, Shield, FileText, MessageCircle } from 'lucide-react';
import { FadeIn, Banner } from '@/components/ui-shared';

const serif = { fontFamily: "'Noto Serif TC', serif" };

export default function ContactPage() {
    const [formData, setFormData] = useState({ name: '', category: '意見回饋', content: '', attachmentUrl: '' });
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');

    const categories = ['逐字稿提供', '資料補充', '意見回饋', '糾錯回報', '其他'];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.content.trim()) return;
        setSubmitting(true); setError('');
        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (data.ok) {
                setSubmitted(true);
                setFormData({ name: '', category: '意見回饋', content: '', attachmentUrl: '' });
            } else {
                setError(data.error || '提交失敗，請稍後再試');
            }
        } catch { setError('網路錯誤，請稍後再試'); } finally { setSubmitting(false); }
    };

    return (
        <div className="min-h-screen" style={{ backgroundColor: '#FBF7F0', color: '#2D2A26' }}>
            <div className="bg-gradient-to-b from-[#FDE8D8] to-[#FBF7F0] border-b border-[#E8E0D4]">
                <div className="max-w-3xl mx-auto px-6 py-8">
                    <Link href="/" className="text-[#C67B5C] text-[16px] font-bold flex items-center gap-1 mb-4 hover:underline"><ArrowLeft size={16} /> 返回首頁</Link>
                    <h1 className="text-[42px] md:text-[56px] font-black" style={serif}>匿名聯絡</h1>
                    <p className="text-[20px] text-[#6B6358] font-medium mt-2">安全匿名的向我們傳遞訊息</p>
                </div>
            </div>

            <section className="max-w-3xl mx-auto px-6 py-8">
                <FadeIn>
                    <div className="bg-white rounded-2xl p-8 border border-[#E8E0D4] shadow-sm mb-6">
                        <div className="flex items-start gap-4 mb-6 p-4 bg-[#E3EED3] rounded-xl border border-[#C5D9A8]">
                            <Shield size={24} className="text-[#7B8C4E] mt-1 shrink-0" />
                            <div>
                                <p className="text-[18px] font-black text-[#3D5220]">您的隱私受到保護</p>
                                <p className="text-[16px] text-[#5A5347] mt-1">此表單不收集任何可識別個人身份的資訊。所有欄位均為選填（除訊息內容外），您可完全匿名提交。</p>
                            </div>
                        </div>

                        {submitted ? (
                            <div className="text-center py-12">
                                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
                                    <Send size={48} className="mx-auto text-[#7B8C4E] mb-4" />
                                </motion.div>
                                <p className="text-[28px] font-black text-[#7B8C4E]" style={serif}>訊息已送出！</p>
                                <p className="text-[18px] text-[#8A8078] mt-2">感謝您的回饋，團隊將盡快處理。</p>
                                <motion.button whileHover={{ scale: 1.05 }} onClick={() => setSubmitted(false)}
                                    className="mt-6 bg-[#7B8C4E] text-white px-6 py-3 rounded-xl font-black">再次傳送</motion.button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[14px] font-black text-[#8A8078] mb-1">您的稱呼（選填）</label>
                                        <input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full bg-[#FBF7F0] border border-[#E8E0D4] rounded-xl px-4 py-3 text-[17px] focus:outline-none focus:ring-2 focus:ring-[#C67B5C]"
                                            placeholder="留空即為匿名" />
                                    </div>
                                    <div>
                                        <label className="block text-[14px] font-black text-[#8A8078] mb-1">訊息分類</label>
                                        <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}
                                            className="w-full bg-[#FBF7F0] border border-[#E8E0D4] rounded-xl px-4 py-3 text-[17px] focus:outline-none focus:ring-2 focus:ring-[#C67B5C]">
                                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[14px] font-black text-[#8A8078] mb-1">訊息內容 *</label>
                                    <textarea value={formData.content} onChange={e => setFormData({ ...formData, content: e.target.value })} required rows={8}
                                        className="w-full bg-[#FBF7F0] border border-[#E8E0D4] rounded-xl px-4 py-3 text-[17px] focus:outline-none focus:ring-2 focus:ring-[#C67B5C] resize-y"
                                        placeholder="請輸入您要傳達的內容..." />
                                </div>
                                <div>
                                    <label className="block text-[14px] font-black text-[#8A8078] mb-1">附件連結（選填，可貼 Google Drive 連結）</label>
                                    <input value={formData.attachmentUrl} onChange={e => setFormData({ ...formData, attachmentUrl: e.target.value })}
                                        className="w-full bg-[#FBF7F0] border border-[#E8E0D4] rounded-xl px-4 py-3 text-[17px] focus:outline-none focus:ring-2 focus:ring-[#C67B5C]"
                                        placeholder="https://drive.google.com/..." />
                                </div>
                                {error && <p className="text-red-500 text-[15px] font-bold bg-red-50 p-3 rounded-xl">{error}</p>}
                                <motion.button type="submit" disabled={submitting} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                    className="w-full bg-gradient-to-r from-[#C67B5C] to-[#a8634a] text-white py-4 rounded-xl text-[20px] font-black shadow-lg disabled:opacity-50">
                                    {submitting ? '傳送中...' : '開始傳送 →'}
                                </motion.button>
                            </form>
                        )}
                    </div>
                </FadeIn>

                {/* 聯絡說明 */}
                <FadeIn delay={0.1}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                            { icon: <FileText size={22} />, title: '逐字稿投稿', desc: '提供您的觀庭筆記或逐字稿補充' },
                            { icon: <MessageCircle size={22} />, title: '意見回饋', desc: '對平台功能或內容提出建議' },
                            { icon: <Shield size={22} />, title: '糾錯回報', desc: '發現內容錯誤或遺漏，協助修正' },
                        ].map((item, i) => (
                            <div key={i} className="bg-white p-5 rounded-2xl border border-[#E8E0D4] text-center">
                                <div className="w-12 h-12 bg-[#FDE8D8] text-[#C67B5C] rounded-xl flex items-center justify-center mx-auto mb-3">{item.icon}</div>
                                <p className="text-[18px] font-black" style={serif}>{item.title}</p>
                                <p className="text-[15px] text-[#8A8078] font-bold mt-1">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </FadeIn>
            </section>
        </div>
    );
}
