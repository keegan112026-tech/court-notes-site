'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, BookOpen, ExternalLink, FileText, Heart, HeartHandshake, Layers3, Users } from 'lucide-react';
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

const sourceAcknowledgementPanels = [
  {
    id: 'team',
    title: '團隊介紹與特別鳴謝',
    hint: '民眾與專業合作、社群協力',
    icon: Users,
    cardClass: 'bg-[#E3EED3] border-[#D6E3B2] hover:border-[#BCCC80]',
    iconClass: 'text-[#6B8E23]',
  },
  {
    id: 'sources',
    title: '各場次還原筆記 ─ 資料來源',
    hint: '公開資料、匿名筆記、協力整理',
    icon: FileText,
    cardClass: 'bg-[#FFF4EA] border-[#F2D5BD] hover:border-[#E2B98B]',
    iconClass: 'text-[#C67B5C]',
  },
] as const;

const communityAcknowledgements = [
  '孩想陪你長大聯盟',
  '兒虐零容忍',
  '孩想陪你長大',
  '鵝保社工團隊',
];

const miracleLinks = [
  'https://docs.google.com/document/d/1Dj11LCinbNl9rZIHtBtpg2Tok-rdCM3P2YFGLThtLcs/edit?fbclid=IwY2xjawRAEB1leHRuA2FlbQIxMABicmlkETFEUjZQZ2hGUHFoYmd4NEtnc3J0YwZhcHBfaWQQMjIyMDM5MTc4ODIwMDg5MgABHhEdKyELgnd4GE6e_s8pPYsngZYGZDw-PCwho-PaO9t1lrvQk5w0umxLP1Ia_aem_xCzz1FraM5_dtYugq69Q8Q&tab=t.0',
  'https://docs.google.com/document/d/1Dj11LCinbNl9rZIHtBtpg2Tok-rdCM3P2YFGLThtLcs/edit?fbclid=IwY2xjawRAEqZleHRuA2FlbQIxMABicmlkETFEUjZQZ2hGUHFoYmd4NEtnc3J0YwZhcHBfaWQQMjIyMDM5MTc4ODIwMDg5MgABHoW9u-0tO4lv_im_bX8RRPZt9cpFDODun6flh7ylz1yp6zaOW_w1qOyH_gJW_aem_31vt_0k5b5xY5vB30aUlqg&tab=t.0',
  'https://docs.google.com/document/d/1hLVpWoBfHjx1gc3Cp5fJp04r12Qm8eqe3-2Aspqt6go/edit?fbclid=IwY2xjawRAExpleHRuA2FlbQIxMABicmlkETFEUjZQZ2hGUHFoYmd4NEtnc3J0YwZhcHBfaWQQMjIyMDM5MTc4ODIwMDg5MgABHrbbkHeHUnva0b6LpnO8ZZxnkA4Wp2S3IiMDGAHrmHyZPBR3EdUXP-Vy79eQ_aem_Vf8TWU5bgVrE2W19myJZXQ&tab=t.0',
  'https://docs.google.com/document/d/17H3k5KOieY-SXZTmtpSiAK_tehVQ5Ymc/edit?fbclid=IwY2xjawRAEztleHRuA2FlbQIxMABicmlkETFEUjZQZ2hGUHFoYmd4NEtnc3J0YwZhcHBfaWQQMjIyMDM5MTc4ODIwMDg5MgABHlR5FNZFy1cH0RnqNkqYwM6cYrqtCFVojd41q8F2Y_oCl9AV-2cHyRphRurZ_aem_Qe1mVbjrIGIdlSYvN1etkg',
];

const yangLinks = [
  { label: '2025.11.27', href: 'https://www.facebook.com/share/p/1E3eF55Tgy/' },
  { label: '2025.12.11（連結一）', href: 'https://www.facebook.com/share/p/1ApdYVxWiX/' },
  { label: '2025.12.11（連結二）', href: 'https://www.facebook.com/share/p/1CKZoEkjWC/' },
  { label: '2025.12.18（連結一）', href: 'https://www.facebook.com/share/p/17Muyr8Rae/' },
  { label: '2025.12.18（連結二）', href: 'https://www.facebook.com/share/p/18VZAgyP1u/' },
];

function renderSourceAcknowledgementShelf(panelId: string) {
  if (panelId === 'team') {
    return (
      <div className="space-y-5">
        <div className="rounded-[1.55rem] border border-[#E8E0D4] bg-white px-5 py-5 shadow-sm">
          <h4 className="text-[28px] font-black leading-tight text-[#2D2A26]" style={serif}>
            團隊介紹與特別鳴謝
          </h4>
          <div className="mt-4 space-y-3 text-[16px] font-medium leading-[1.9] text-[#5A5347]">
            <p>本計畫是民眾與專業合作之結果。</p>
            <p>本團隊成員皆為現職社工、心理、輔導等實務工作者，利用公餘時間維護平台。若更新與除錯進度較緩，尚請海涵見諒。</p>
            <p>感謝民眾線上社群支持，提供資料及協助各項整理：</p>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {communityAcknowledgements.map((name) => (
              <div key={name} className="rounded-[1.25rem] border border-[#D6E3B2] bg-[#F9FBE7] px-4 py-4 shadow-sm">
                <div className="text-[22px]">✨</div>
                <p className="mt-2 text-[17px] font-black text-[#2D2A26]" style={serif}>{name}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-[15px] font-bold leading-[1.85] text-[#6B6358]">
            感謝以上等社群之熱心民眾、專業人員團隊提供各項資料及建議，協力共構本筆記。
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-[1.55rem] border border-[#E8E0D4] bg-white px-5 py-5 shadow-sm">
        <h4 className="text-[28px] font-black leading-tight text-[#2D2A26]" style={serif}>
          各場次還原筆記 ─ 資料來源
        </h4>
        <div className="mt-4 space-y-3 text-[16px] font-medium leading-[1.9] text-[#5A5347]">
          <p>本計畫還原筆記為蒐集各方公開資料及匿名提供之現場筆記，佐以專業團隊之原子筆記、共同討論，盡力還原當庭問題語序、回答內容以及各項細節，最後共同審核後發出。</p>
          <p className="font-black text-[#2D2A26]">特別感謝（依筆畫排序）：</p>
        </div>

        <div className="mt-5 space-y-4">
          <div className="rounded-[1.25rem] border border-[#EFDCCB] bg-[#FFF9F4] px-4 py-4">
            <p className="text-[16px] font-black text-[#2D2A26]">感謝 Miracle Lin 與其社工夥伴團隊公開文字資料供參。</p>
            <div className="mt-3 grid gap-2 md:grid-cols-2">
              {miracleLinks.map((href, index) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-between gap-3 rounded-xl border border-[#EBD6C1] bg-white px-4 py-3 text-[14px] font-bold text-[#6B6358] transition-colors hover:border-[#C67B5C] hover:text-[#A45F42]"
                >
                  <span>Google 文件資料 {index + 1}</span>
                  <ExternalLink size={14} />
                </a>
              ))}
            </div>
          </div>

          <div className="rounded-[1.25rem] border border-[#E7E1F1] bg-[#FCFAFF] px-4 py-4">
            <p className="text-[16px] font-black text-[#2D2A26]">感謝 沈曜逸（沈後山）現任臺北市社會工作人員職業工會理事長，其彙整並公開之資料。</p>
            <a
              href="https://www.facebook.com/share/p/1E7AbdezGi/"
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex items-center gap-2 rounded-xl border border-[#D8CCE8] bg-white px-4 py-3 text-[14px] font-bold text-[#6B5CA5] transition-colors hover:border-[#B5A3D6]"
            >
              查看公開貼文
              <ExternalLink size={14} />
            </a>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-[1.25rem] border border-[#DCE7BA] bg-[#F9FBE7] px-4 py-4">
              <p className="text-[16px] font-black text-[#2D2A26]">感謝 兒虐零容忍 民眾社群協助整理及提供資料。</p>
              <p className="mt-2 text-[15px] font-medium leading-[1.85] text-[#5A5347]">感謝 孩想陪你長大聯盟 民眾與專業人員團隊提供資料及各項支持協助。</p>
            </div>
            <div className="rounded-[1.25rem] border border-[#DCE7BA] bg-[#F9FBE7] px-4 py-4">
              <p className="text-[16px] font-black text-[#2D2A26]">感謝「鵝保社工團隊」提供當庭原子筆記。</p>
              <p className="mt-2 text-[15px] font-medium leading-[1.85] text-[#5A5347]">也感謝所有匿名提供各項資料及協助整理者。</p>
            </div>
          </div>

          <div className="rounded-[1.25rem] border border-[#E8E0D4] bg-white px-4 py-4">
            <p className="text-[16px] font-black text-[#2D2A26]">感謝 楊仁敘 公開之多筆庭審旁聽逐字紀錄。</p>
            <div className="mt-3 grid gap-2 md:grid-cols-2 xl:grid-cols-3">
              {yangLinks.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-between gap-3 rounded-xl border border-[#E8E0D4] bg-[#FFFEFC] px-4 py-3 text-[14px] font-bold text-[#6B6358] transition-colors hover:border-[#7B8C4E] hover:text-[#5A6F35]"
                >
                  <span>{item.label}</span>
                  <ExternalLink size={14} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ForumPage() {
  const [posts, setPosts] = useState<ForumArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [sourcePanel, setSourcePanel] = useState<(typeof sourceAcknowledgementPanels)[number]['id']>('team');

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
            <div className="grid gap-5 xl:grid-cols-[0.88fr_1.12fr] xl:items-start">
              <div className="min-w-0">
                <div className="inline-flex items-center gap-2 rounded-full border border-[#DDE6C8] bg-[#F9FBE7] px-4 py-2 text-[13px] font-black tracking-[0.14em] text-[#6B8E23]">
                  <HeartHandshake size={14} />
                  本計畫資料來源與鳴謝
                </div>
                <div className="mt-4 space-y-3">
                  <h2 className="text-[36px] font-black leading-tight text-[#2D2A26]" style={serif}>
                    本計畫資料來源與鳴謝
                  </h2>
                  <p className="text-[16px] font-medium leading-[1.85] text-[#6B6358]">
                    本計畫是民眾與專業合作之結果，以下整理團隊介紹、特別鳴謝，以及各場次還原筆記的資料來源與協力整理脈絡。
                  </p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {sourceAcknowledgementPanels.map((panel) => {
                  const Icon = panel.icon;
                  const isActive = panel.id === sourcePanel;

                  return (
                    <button
                      key={panel.id}
                      type="button"
                      onClick={() => setSourcePanel(panel.id)}
                      className={`rounded-[1.35rem] border p-4 text-left shadow-sm transition-all ${panel.cardClass} ${
                        isActive ? 'scale-[1.01] shadow-md ring-2 ring-white/70' : 'hover:-translate-y-0.5'
                      }`}
                    >
                      <div className={`mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white/75 ${panel.iconClass}`}>
                        <Icon size={20} />
                      </div>
                      <p className="text-[19px] font-black leading-tight text-[#2D2A26]" style={serif}>
                        {panel.title}
                      </p>
                      <p className="mt-2 text-[13px] font-bold leading-[1.8] text-[#6B6358]">
                        {panel.hint}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-7 rounded-[2rem] border border-[#E8E0D4] bg-[#FFFEFC] p-5 md:p-6">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={sourcePanel}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {renderSourceAcknowledgementShelf(sourcePanel)}
                </motion.div>
              </AnimatePresence>
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
