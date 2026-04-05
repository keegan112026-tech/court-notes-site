'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, FileText, MessageCircle, Send, Shield } from 'lucide-react';
import { FadeIn } from '@/components/ui-shared';
import SubpageHeader from '@/components/SubpageHeader';

const serif = { fontFamily: "'Noto Serif TC', serif" };

const categories = ['一般聯絡', '錯誤回報', '內容更正', '使用建議與回饋', '私密傳訊'] as const;

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: '一般聯絡',
    content: '',
    attachmentUrl: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const isPrivate = useMemo(() => formData.category === '私密傳訊', [formData.category]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.content.trim()) return;

    setSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.ok) {
        setSubmitted(true);
        setFormData({
          name: '',
          email: '',
          category: '一般聯絡',
          content: '',
          attachmentUrl: '',
        });
      } else {
        setError(data.error || '送出失敗，請稍後再試。');
      }
    } catch {
      setError('送出失敗，請稍後再試。');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen text-[#2D2A26]" style={{ backgroundColor: '#FBF7F0' }}>
      <SubpageHeader />
      <div className="border-b border-[#E8E0D4] bg-gradient-to-b from-[#FDE8D8] to-[#FBF7F0]">
        <div className="mx-auto max-w-3xl px-6 py-8">
          <Link href="/" className="mb-4 flex items-center gap-1 text-[16px] font-bold text-[#C67B5C] hover:underline">
            <ArrowLeft size={16} />
            返回首頁
          </Link>
          <h1 className="text-[42px] font-black md:text-[56px]" style={serif}>
            聯絡我們
          </h1>
          <p className="mt-2 text-[20px] font-medium text-[#6B6358]">
            這裡提供一般聯絡、錯誤回報、內容更正、使用建議與回饋，以及私密傳訊入口。
          </p>
        </div>
      </div>

      <section className="mx-auto max-w-3xl px-6 py-8">
        <FadeIn>
          <div className="mb-6 rounded-2xl border border-[#E8E0D4] bg-white p-8 shadow-sm">
            <motion.div
              whileHover={{ y: -2 }}
              className="mb-6 flex items-start gap-4 rounded-xl border border-[#C5D9A8] bg-[#E3EED3] p-4 shadow-sm transition-all hover:shadow-md"
            >
              <motion.div
                animate={{ scale: [1, 1.06, 1] }}
                transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
                className="mt-1 shrink-0 text-[#7B8C4E]"
              >
                <Shield size={24} />
              </motion.div>
              <div>
                <p className="text-[18px] font-black text-[#3D5220]">私密傳訊說明</p>
                <p className="mt-1 text-[16px] text-[#5A5347]">
                  此為私密傳訊，您的傳訊不會公開。您可選擇是否留下姓名或信箱，若有文獻或證據提供也歡迎一併附上。
                </p>
              </div>
            </motion.div>

            {submitted ? (
              <div className="py-12 text-center">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
                  <Send size={48} className="mx-auto mb-4 text-[#7B8C4E]" />
                </motion.div>
                <p className="text-[28px] font-black text-[#7B8C4E]" style={serif}>訊息已送出</p>
                <p className="mt-2 text-[18px] text-[#8A8078]">我們已收到你的訊息，後續會依內容與類型進行處理。</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setSubmitted(false)}
                  className="mt-6 rounded-xl bg-[#7B8C4E] px-6 py-3 font-black text-white"
                >
                  再送一則
                </motion.button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-[14px] font-black text-[#8A8078]">姓名或代稱</label>
                    <input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full rounded-xl border border-[#E8E0D4] bg-[#FBF7F0] px-4 py-3 text-[17px] focus:outline-none focus:ring-2 focus:ring-[#C67B5C]"
                      placeholder="可匿名"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-[14px] font-black text-[#8A8078]">電子信箱</label>
                    <input
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full rounded-xl border border-[#E8E0D4] bg-[#FBF7F0] px-4 py-3 text-[17px] focus:outline-none focus:ring-2 focus:ring-[#C67B5C]"
                      placeholder="選填"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-[14px] font-black text-[#8A8078]">類型</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full rounded-xl border border-[#E8E0D4] bg-[#FBF7F0] px-4 py-3 text-[17px] focus:outline-none focus:ring-2 focus:ring-[#C67B5C]"
                  >
                    {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-[14px] font-black text-[#8A8078]">訊息內容 *</label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    required
                    rows={8}
                    className="w-full resize-y rounded-xl border border-[#E8E0D4] bg-[#FBF7F0] px-4 py-3 text-[17px] focus:outline-none focus:ring-2 focus:ring-[#C67B5C]"
                    placeholder={
                      isPrivate
                        ? '這裡可填寫需要保密的內容、補充說明或私下聯繫事項。'
                        : '這裡可以填寫聯絡事項、錯誤回報、內容更正或使用建議。'
                    }
                  />
                  <p className="mt-2 text-xs font-bold text-[#8A8078]">內容上限 3000 字</p>
                </div>

                <div>
                  <label className="mb-1 block text-[14px] font-black text-[#8A8078]">附件連結</label>
                  <input
                    value={formData.attachmentUrl}
                    onChange={(e) => setFormData({ ...formData, attachmentUrl: e.target.value })}
                    className="w-full rounded-xl border border-[#E8E0D4] bg-[#FBF7F0] px-4 py-3 text-[17px] focus:outline-none focus:ring-2 focus:ring-[#C67B5C]"
                    placeholder="可貼上雲端硬碟或檔案連結"
                  />
                  <p className="mt-2 text-xs font-bold text-[#8A8078]">
                    若有文獻、證據或截圖，請提供可供管理端查看的連結。
                  </p>
                </div>

                {error && <p className="rounded-xl bg-red-50 p-3 text-[15px] font-bold text-red-500">{error}</p>}

                <motion.button
                  type="submit"
                  disabled={submitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-[#C67B5C] to-[#a8634a] py-4 text-[20px] font-black text-white shadow-lg disabled:opacity-50"
                >
                  <motion.span
                    aria-hidden="true"
                    animate={{ x: ['-140%', '140%'] }}
                    transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute inset-y-0 left-0 w-20 bg-white/15 blur-xl"
                  />
                  {submitting ? '送出中…' : '送出訊息'}
                </motion.button>
              </form>
            )}
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {[
              { icon: <FileText size={22} />, title: '內容更正', desc: '針對文章內容、場次資訊或關鍵資料提供補充與更正。' },
              { icon: <MessageCircle size={22} />, title: '使用建議', desc: '回報使用體驗、提出功能建議，幫助我們把網站做得更穩。' },
              { icon: <Shield size={22} />, title: '私密傳訊', desc: '若需保密聯繫、補充證據或提供敏感內容，請使用這個入口。' },
            ].map((item) => (
              <motion.div
                key={item.title}
                whileHover={{ y: -3 }}
                className="rounded-2xl border border-[#E8E0D4] bg-white p-5 text-center shadow-sm transition-all hover:shadow-md"
              >
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[#FDE8D8] text-[#C67B5C]">{item.icon}</div>
                <p className="text-[18px] font-black" style={serif}>{item.title}</p>
                <p className="mt-1 text-[15px] font-bold text-[#8A8078]">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </FadeIn>
      </section>
    </div>
  );
}
