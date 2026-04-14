'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, FileText, Heart, Layers3 } from 'lucide-react';
import { FadeIn } from '@/components/ui-shared';
import SubpageHeader from '@/components/SubpageHeader';
import SourceAcknowledgementShelf from '@/components/SourceAcknowledgementShelf';
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

        <SourceAcknowledgementShelf className="mt-10" />
      </section>
    </div>
  );
}
