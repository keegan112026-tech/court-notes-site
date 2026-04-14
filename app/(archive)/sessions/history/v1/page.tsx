'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, useScroll } from 'framer-motion';
import { ArrowLeft, ArrowRight, Clock } from 'lucide-react';
import { Banner, FadeIn } from '@/components/ui-shared';

const serif = { fontFamily: "'Noto Serif TC', serif" };

interface SessionData {
  id: string;
  sessionId: string;
  title: string;
  date: string;
  category: string;
  summary: string;
  hotTopic: boolean;
  participantsCount: number;
}

export default function SessionsHistoryV1Page() {
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    fetch('/api/sessions')
      .then((r) => r.json())
      .then((d) => {
        if (d.ok) setSessions(d.data);
      })
      .catch(() => {});
  }, []);

  const displaySessions: SessionData[] =
    sessions.length > 0
      ? sessions
      : [
          {
            id: '1',
            sessionId: 's-114-1-6',
            title: '檢察官論告與辯護律師簡報與陳述還原',
            date: '2026-02-26',
            category: '兒少',
            summary: '114年度訴字第51號 過失致死等案（一審審理庭第六場次）',
            hotTopic: true,
            participantsCount: 5,
          },
          {
            id: '2',
            sessionId: 's-114-1-5',
            title: '合議庭詰問社工督導——知情不報的灰色地帶',
            date: '2026-01-29',
            category: '兒少',
            summary: '一審審理庭第五場次',
            hotTopic: false,
            participantsCount: 4,
          },
        ];

  return (
    <div className="min-h-screen bg-[#FBF7F0]" style={{ color: '#2D2A26' }}>
      <motion.div
        className="fixed left-0 right-0 top-0 z-[100] h-[3px] origin-left"
        style={{
          scaleX: scrollYProgress,
          background: 'linear-gradient(90deg, #7B8C4E, #B8860B, #C67B5C)',
        }}
      />

      <div className="border-b border-[#E8E0D4] bg-gradient-to-b from-[#F5EFE4] to-[#FBF7F0]">
        <div className="mx-auto max-w-5xl px-6 py-8">
          <Link
            href="/sessions/history"
            className="mb-4 flex items-center gap-1 text-[16px] font-bold text-[#7B8C4E] hover:underline"
          >
            <ArrowLeft size={16} />
            返回歷史版本列表
          </Link>
          <h1 className="text-[42px] font-black md:text-[56px]" style={serif}>
            開庭還原筆記
          </h1>
          <p className="mt-2 text-[20px] font-medium text-[#6B6358]">
            114年度訴字第51號 過失致死等案 — 陳姓社工於一審期間共計開庭 10 次
          </p>
        </div>
      </div>

      <Banner title="場次列表" subtitle="Court Sessions Timeline" bg="bg-[#E3EED3]" text="text-[#3D5220]" />

      <section className="mx-auto max-w-5xl space-y-8 px-6 py-8">
        <FadeIn>
          <div className="mb-8">
            <h3 className="mb-4 flex items-center gap-2 text-[24px] font-black" style={serif}>
              <span className="inline-block h-3 w-3 rounded-full bg-gray-400" />
              2024 年至 2025 年：準備程序庭（共 4 次）
            </h3>
            <div className="grid gap-3 border-l-2 border-gray-200 pl-5">
              {[
                { date: '7 月 17 日', desc: '首度開庭，陳姓社工不認罪。' },
                { date: '8 月 27 日', desc: '第二次準備程序庭。' },
                { date: '10 月 15 日', desc: '第三次準備程序庭。' },
                { date: '12 月 4 日', desc: '第四次準備程序庭。' },
              ].map((s, i) => (
                <div key={i} className="rounded-xl border border-[#E8E0D4] bg-white p-4 text-[16px]">
                  <span className="font-black text-[#8A8078]">{s.date}</span> —
                  <span className="ml-1 font-medium text-[#5A5347]">{s.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="mb-8">
            <h3 className="mb-4 flex items-center gap-2 text-[24px] font-black" style={serif}>
              <span className="inline-block h-3 w-3 rounded-full bg-[#7B8C4E]" />
              2025 年末至 2026 年：審理程序庭（共 5 次）
            </h3>
            <div className="grid gap-3 border-l-2 border-[#7B8C4E] pl-5">
              {displaySessions.map((s, i) => (
                <FadeIn key={s.id} delay={i * 0.05}>
                  <Link href={`/sessions/${s.sessionId}`}>
                    <motion.div
                      whileHover={{
                        y: -3,
                        borderColor: '#7B8C4E',
                        boxShadow: '0 8px 25px rgba(123,140,78,0.15)',
                      }}
                      className="group cursor-pointer rounded-2xl border-2 border-[#E8E0D4] bg-white p-6 transition-all"
                    >
                      <div className="mb-2 flex items-center gap-3">
                        {s.hotTopic && (
                          <motion.span
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="rounded-lg bg-[#C67B5C] px-3 py-1 text-[13px] font-black text-white shadow-sm"
                          >
                            最新還原
                          </motion.span>
                        )}
                        <span className="flex items-center gap-1 text-[15px] font-bold text-[#7B8C4E]">
                          <Clock size={15} />
                          {s.date}
                        </span>
                        <span className="rounded bg-[#7B8C4E] px-2 py-0.5 text-[12px] font-black text-white">
                          {s.category}
                        </span>
                      </div>
                      <h4 className="text-[24px] font-black transition-colors group-hover:text-[#7B8C4E]" style={serif}>
                        {s.title}
                      </h4>
                      <p className="mt-2 text-[16px] font-bold text-[#8A8078]">{s.summary}</p>
                      <span className="mt-3 flex items-center gap-1 text-[14px] font-bold text-[#7B8C4E] opacity-0 transition-opacity group-hover:opacity-100">
                        進入場次全文
                        <ArrowRight size={14} />
                      </span>
                    </motion.div>
                  </Link>
                </FadeIn>
              ))}
            </div>
          </div>
        </FadeIn>

        <FadeIn>
          <div className="rounded-2xl border border-[#E8D5B8] bg-[#FDE8D8] p-6 text-center">
            <p className="text-[20px] font-black text-[#8B4D35]" style={serif}>
              台北地院已訂於 2026 年 4 月 16 日 正式宣判一審結果
            </p>
          </div>
        </FadeIn>
      </section>
    </div>
  );
}
