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
  articleType?: string;
};

function stripHtml(html: string) {
  return html.replace(/<[^>]+>/g, '').trim();
}

function articleTypeLabel(type?: string) {
  if (type === 'multi-session' || type === '跨場次') return '跨場次整合';
  if (type === 'thematic' || type === '專題') return '專題論述';
  return '單場次筆記';
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
          <h1 className="text-[42px] font-black md:text-[56px]" style={serif}>
            觀庭筆記匯集區
          </h1>
          <p className="mt-2 text-[20px] font-medium text-[#6B6358]">
            這裡收錄經審核後公開的觀庭共構文章，可由單一場次或跨場次工作檯整理而成。
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/sessions"
              className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-black text-[#6B8E23] shadow-sm ring-1 ring-[#DDE6C8] transition-all hover:-translate-y-0.5 hover:bg-[#F9FBE7] hover:shadow-md"
            >
              <BookOpen size={16} />
              查看場次
            </Link>
            <Link
              href="/sessions/compose"
              className="inline-flex items-center gap-2 rounded-full bg-[#6B8E23] px-4 py-2 text-sm font-black text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-[#5d7c1f] hover:shadow-md"
            >
              <Layers3 size={16} />
              跨場工作檯
            </Link>
          </div>
        </div>
      </div>

      <section className="mx-auto max-w-4xl px-6 py-8">
        <FadeIn>
          <motion.div
            whileHover={{ y: -3 }}
            className="mb-8 rounded-3xl border border-[#DDE6C8] bg-white p-6 shadow-sm transition-all hover:shadow-md md:p-8"
          >
            <div className="flex items-start gap-4">
              <motion.div
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#E3EED3] text-[#3D5220]"
              >
                <FileText size={24} />
              </motion.div>
              <div className="space-y-3">
                <h2 className="text-[24px] font-black text-[#2D2A26]" style={serif}>
                  這裡是公開後的觀庭共構文章區
                </h2>
                <p className="text-[17px] font-medium leading-relaxed text-[#6B6358]">
                  文章會先經過審核，再公開到這裡。你可以把它理解成「觀庭還原筆記之後形成的論述區」，
                  而不是即時聊天室或一般論壇。
                </p>
                <p className="text-[17px] font-medium leading-relaxed text-[#6B6358]">
                  若你想直接回到原始場次脈絡，請先到筆記總覽頁；若要撰寫跨場次整合內容，請使用跨場工作檯。
                </p>
                <p className="text-[16px] font-medium leading-relaxed text-[#8A8078]">
                  這裡的文章應以事實、場次脈絡與可回扣原始筆記為核心，避免單純立場式發言。
                </p>
              </div>
            </div>

            <div className="mt-8 rounded-[2rem] border border-[#E8E0D4] bg-[#FFFEFC] p-6">
              <h2 className="mb-4 text-[30px] font-black leading-tight text-[#2D2A26]" style={serif}>
                匯集區閱讀原則
              </h2>
              <p className="mb-6 max-w-3xl text-[20px] font-medium leading-[1.8] text-[#6B6358]">
                文章可整理單一場次，也可整合多場次觀庭筆記；閱讀時請特別注意來源場次、證詞脈絡與文章類型。
              </p>
              <div className="grid gap-3 md:grid-cols-3">
                {[
                  { title: '回扣原始筆記', desc: '每篇文章都應能回到場次、證詞或觀庭脈絡，而不是憑空評論。', tone: 'bg-[#FFF5F5] border-[#F3D8D8] text-[#B65656]' },
                  { title: '聚焦專業內容', desc: '鼓勵整理制度、流程、判斷與觀庭脈絡，避免情緒性擴散。', tone: 'bg-[#F5FAEB] border-[#D7E5BB] text-[#5A6F35]' },
                  { title: '遵守平台規範', desc: '匿名化、去識別化、遵守法律基礎，讓這裡維持可閱讀與可討論。', tone: 'bg-[#F6F8FB] border-[#D9E1EC] text-[#4F5D71]' },
                ].map((item) => (
                  <div key={item.title} className={`rounded-2xl border p-4 ${item.tone}`}>
                    <p className="text-[18px] font-black" style={serif}>{item.title}</p>
                    <p className="mt-2 text-[14px] font-bold leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </FadeIn>

        <div className="space-y-4">
          {loading ? (
            <div className="py-16 text-center">
              <p className="text-[20px] font-bold text-[#8A8078]">讀取匯集區文章中…</p>
            </div>
          ) : posts.length === 0 ? (
            <FadeIn>
              <div className="rounded-2xl border border-[#E8E0D4] bg-white py-16 text-center">
                <FileText size={48} className="mx-auto mb-4 text-[#D4CCC0]" />
                <p className="text-[20px] font-black text-[#8A8078]" style={serif}>
                  目前還沒有已公開文章
                </p>
                <p className="mt-2 text-[16px] text-[#A09888]">文章審核通過後，會顯示在這裡。</p>
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
                        {articleTypeLabel(post.articleType)}
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
                          涵蓋 {post.sourceSessionIds.length} 場次
                        </span>
                      )}
                      <div className="flex-1" />
                      <span className="text-[14px] font-bold text-[#A09888]">{post.author || '匿名作者'}</span>
                      <span className="text-[12px] text-[#D4CCC0]">{new Date(post.createdAt).toLocaleDateString('zh-TW')}</span>
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

                    <h3 className="text-[22px] font-black" style={serif}>
                      {post.title}
                    </h3>
                    <p className="mt-2 line-clamp-3 text-[17px] font-medium text-[#6B6358]">{stripHtml(post.content)}</p>

                    <div className="mt-4 flex items-center gap-4 text-[14px] font-bold text-[#A09888]">
                      <span className="inline-flex items-center gap-1">
                        <Heart size={14} />
                        {post.likes}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <MessageSquare size={14} />
                        留言請進單篇頁
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
