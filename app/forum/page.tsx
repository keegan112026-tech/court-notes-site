'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, FileText, Heart, Layers3 } from 'lucide-react';
import { FadeIn } from '@/components/ui-shared';
import SubpageHeader from '@/components/SubpageHeader';
import { getSessionDisplayTitle } from '@/lib/local-data';

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

const principleCards = [
  {
    title: '嚴格去識別化',
    desc: '徹底移除隱私資訊。禁止揭露真實姓名、居住地或非公開案情細節。',
    tone: 'bg-[#FFF5F5] border-[#F3D8D8] text-[#B65656]',
  },
  {
    title: '聚焦職務非個人',
    desc: '針對「專業判斷」與「機制制度」進行討論，嚴禁人身攻擊。',
    tone: 'bg-[#F5FAEB] border-[#D7E5BB] text-[#5A6F35]',
  },
  {
    title: '遵守法律基礎',
    desc: '遵守法規與公共秩序，不得散布違法資訊或煽動仇恨言論。',
    tone: 'bg-[#F6F8FB] border-[#D9E1EC] text-[#4F5D71]',
  },
];

const topicTags = ['經驗分享', '專業討論', '資料補充', '提問', '糾錯回報'];

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
              跨場次工作檯
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
                  共構筆記呈現
                </h2>
                <p className="text-[17px] font-medium leading-relaxed text-[#6B6358]">
                  這裡是所有人共同建構的觀庭筆記匯集區，歡迎閱讀、比對與跨場次分享。
                </p>
                <p className="text-[17px] font-medium leading-relaxed text-[#6B6358]">
                  這裡收錄經審核後公開的觀庭共構文章，可由單一場次或跨場次工作檯整理而成。
                </p>
                <p className="text-[16px] font-medium leading-relaxed text-[#8A8078]">
                  為了維持專業論述的品質並守護實務工作者的法律安全，在投稿文章或發表專業見解前，請務必先閱讀平台限制與規範。
                </p>
              </div>
            </div>

            <div className="mt-8 rounded-[2rem] border border-[#E8E0D4] bg-[#FFFEFC] p-6">
              <h3 className="mb-4 text-[30px] font-black leading-tight text-[#2D2A26]" style={serif}>
                不造神・重文字・匿名化・去權威
              </h3>
              <p className="mb-6 max-w-3xl text-[20px] font-medium leading-[1.8] text-[#6B6358]">
                在這個演算法獎勵情緒、意見領袖聲量壓過討論的時代，我們反其道而行。在這裡，不看職級、不分地域，只談專業論述與發言。
              </p>
              <div className="grid gap-3 md:grid-cols-3">
                {principleCards.map((item) => (
                  <div key={item.title} className={`rounded-2xl border p-4 ${item.tone}`}>
                    <p className="text-[18px] font-black" style={serif}>{item.title}</p>
                    <p className="mt-2 text-[14px] font-bold leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                {topicTags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-xl border border-[#D7E5BB] bg-[#F9FBE7] px-4 py-2 text-[14px] font-black text-[#5A6F35]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </FadeIn>

        <div className="space-y-4">
          {loading ? (
            <div className="py-16 text-center">
              <p className="text-[20px] font-bold text-[#8A8078]">正在載入觀庭筆記匯集內容…</p>
            </div>
          ) : posts.length === 0 ? (
            <FadeIn>
              <div className="rounded-2xl border border-[#E8E0D4] bg-white py-16 text-center">
                <FileText size={48} className="mx-auto mb-4 text-[#D4CCC0]" />
                <p className="text-[20px] font-black text-[#8A8078]" style={serif}>
                  目前還沒有已公開的觀庭筆記
                </p>
                <p className="mt-2 text-[16px] text-[#A09888]">歡迎從工作檯投稿，經審核後將會出現在這裡。</p>
              </div>
            </FadeIn>
          ) : (
            posts.map((post, i) => (
              <FadeIn key={post.id} delay={i * 0.05}>
                <motion.div
                  whileHover={{ y: -2 }}
                  className="rounded-2xl border border-[#E8E0D4] bg-white p-6 transition-all hover:shadow-md"
                >
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <span className="rounded-lg bg-[#E3EED3] px-3 py-1 text-[13px] font-black text-[#3D5220]">
                      {articleTypeLabel(post.articleType)}
                    </span>
                    {post.targetSessionId && (
                      <span className="flex items-center gap-1 rounded-lg bg-blue-50 px-3 py-1 text-[13px] font-black text-blue-700">
                        <BookOpen size={12} />
                        主要場次：{getSessionDisplayTitle(post.targetSessionId)}
                      </span>
                    )}
                    {post.sourceSessionIds && post.sourceSessionIds.length > 1 && (
                      <span className="flex items-center gap-1 rounded-lg bg-[#F9FBE7] px-3 py-1 text-[13px] font-black text-[#5A6F35]">
                        <Layers3 size={12} />
                        引用 {post.sourceSessionIds.length} 個場次
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
                          {getSessionDisplayTitle(sessionId)}
                        </span>
                      ))}
                    </div>
                  )}

                  <Link href={`/forum/${post.id}`} prefetch={false} className="block">
                    <h3 className="text-[22px] font-black transition-colors hover:text-[#5A6F35]" style={serif}>
                      {post.title}
                    </h3>
                  </Link>
                  <p className="mt-2 line-clamp-3 text-[17px] font-medium text-[#6B6358]">{stripHtml(post.content)}</p>

                  <div className="mt-4 flex items-center gap-4 text-[14px] font-bold text-[#A09888]">
                    <span className="inline-flex items-center gap-1">
                      <Heart size={14} />
                      {post.likes}
                    </span>
                    <Link href={`/forum/${post.id}`} prefetch={false} className="text-[#5A6F35] hover:underline">
                      前往單篇文章
                    </Link>
                  </div>
                </motion.div>
              </FadeIn>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
