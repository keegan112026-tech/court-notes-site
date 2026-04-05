'use client';

import Link from 'next/link';
import { ArrowLeft, ExternalLink, History } from 'lucide-react';

const versions = [
  {
    slug: 'v1',
    title: '版本一｜Next.js 14 初期版',
    commit: '1b09911',
    summary: '較早期的開庭還原筆記頁，整體結構較簡潔，重點放在場次時間線與已發布筆記入口。',
  },
  {
    slug: 'v2',
    title: '版本二｜留言與 Notion 整合期',
    commit: 'ab06679',
    summary: '開始出現較完整的發佈卡片、準備程序庭與審理程序庭時間線，以及更明確的視覺層級。',
  },
  {
    slug: 'v3',
    title: '版本三｜重構後時間線版',
    commit: 'a6f2d74',
    summary: '較成熟的時間線與重點卡片組合版本，已接近你前面提過可能喜歡的塊狀公版方向。',
  },
];

export default function SessionsHistoryIndexPage() {
  return (
    <main className="min-h-screen bg-[#fbf7f0] text-[#2d2a26]">
      <div className="mx-auto max-w-5xl px-6 py-12 md:py-16">
        <Link
          href="/sessions"
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#e8e0d4] bg-white px-4 py-2 text-sm font-bold text-[#6b6358] shadow-sm transition-colors hover:text-[#7b8c4e]"
        >
          <ArrowLeft size={16} />
          返回目前版本的還原筆記
        </Link>

        <div className="mb-10 flex items-start gap-4">
          <div className="mt-1 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e3eed3] text-[#7b8c4e]">
            <History size={24} />
          </div>
          <div>
            <h1
              className="text-3xl font-black md:text-5xl"
              style={{ fontFamily: "'Noto Serif TC', serif" }}
            >
              還原筆記歷史版本預覽
            </h1>
            <p className="mt-3 max-w-3xl text-[17px] font-medium leading-relaxed text-[#6b6358]">
              這裡整理的是前幾個獨立的設計版本，目的是讓你直接比對版型與節奏。這些頁面不會影響現在的
              <span className="mx-1 rounded bg-[#f3efe7] px-2 py-0.5 font-bold text-[#7b8c4e]">/sessions</span>
              ，我們可以安心挑出你喜歡的元素再整合回主線。
            </p>
          </div>
        </div>

        <div className="grid gap-5">
          {versions.map((version) => (
            <div
              key={version.slug}
              className="rounded-[2rem] border border-[#e8e0d4] bg-white p-6 shadow-[0_14px_40px_rgba(45,42,38,0.06)]"
            >
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-[#f9fbe7] px-3 py-1 text-sm font-black text-[#7b8c4e]">
                  {version.commit}
                </span>
                <h2
                  className="text-2xl font-black text-[#2d2a26]"
                  style={{ fontFamily: "'Noto Serif TC', serif" }}
                >
                  {version.title}
                </h2>
              </div>
              <p className="mb-5 text-[16px] font-medium leading-relaxed text-[#5a5347]">
                {version.summary}
              </p>
              <Link
                href={`/sessions/history/${version.slug}`}
                className="inline-flex items-center gap-2 rounded-full bg-[#7b8c4e] px-5 py-3 text-sm font-black text-white shadow-sm transition-transform hover:-translate-y-0.5"
              >
                查看這個版本
                <ExternalLink size={16} />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
