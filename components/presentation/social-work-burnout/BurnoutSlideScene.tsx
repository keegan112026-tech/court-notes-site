'use client';

import { motion } from 'framer-motion';
import {
  AlertCircle,
  ArrowRight,
  Bot,
  CalendarDays,
  Check,
  Clock3,
  FileSpreadsheet,
  FileText,
  FolderOpen,
  MessageSquare,
  NotebookPen,
  Phone,
  ScanSearch,
  ShieldCheck,
  Sparkles,
  Workflow,
} from 'lucide-react';
import type { SlideContent } from '@/data/presentations/social-work-burnout';

type SceneVariant = 'audience' | 'focused';

function reveal(variant: SceneVariant, delay = 0) {
  if (variant === 'focused') {
    return {
      initial: { opacity: 0, y: 24 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.58, ease: 'easeOut' as const, delay },
    };
  }

  return {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-80px' },
    transition: { duration: 0.44, ease: 'easeOut' as const, delay },
  };
}

function stat(slide: SlideContent, label: string) {
  return slide.stats.find((item) => item.label === label)?.value ?? '';
}

function statNote(slide: SlideContent, label: string) {
  return slide.stats.find((item) => item.label === label)?.note ?? '';
}

function SceneFrame({
  variant,
  children,
}: {
  variant: SceneVariant;
  children: React.ReactNode;
}) {
  return (
    <div
      className={[
        'relative overflow-hidden rounded-[30px] border border-[#c8d3dd] bg-[linear-gradient(160deg,rgba(248,247,242,0.98),rgba(235,242,246,0.92))] shadow-[0_30px_90px_rgba(75,102,124,0.14)]',
        variant === 'focused' ? 'min-h-[440px] p-6 md:min-h-[520px] md:p-8' : 'min-h-[340px] p-5 md:min-h-[420px] md:p-7',
      ].join(' ')}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-[radial-gradient(circle_at_top_left,rgba(226,135,106,0.16),transparent_55%)]" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-52 w-52 rounded-full bg-[radial-gradient(circle,rgba(77,112,137,0.13),transparent_70%)]" />
      {children}
    </div>
  );
}

function Pill({
  label,
  value,
  tone = 'mist',
}: {
  label: string;
  value: string;
  tone?: 'mist' | 'coral' | 'sand';
}) {
  const toneClass =
    tone === 'coral'
      ? 'border-[#e6a18a] bg-[#fff1ea] text-[#9b4c3a]'
      : tone === 'sand'
        ? 'border-[#d6c7b6] bg-[#fcf7f1] text-[#6d5c4f]'
        : 'border-[#bfd0db] bg-[#f1f7fb] text-[#446178]';

  return (
    <div className={`rounded-2xl border px-4 py-3 ${toneClass}`}>
      <div className="text-[11px] font-bold tracking-[0.18em] text-current/70 uppercase">{label}</div>
      <div className="mt-1 text-lg font-black leading-none md:text-[1.65rem]">{value}</div>
    </div>
  );
}

function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-5">
      <div className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#6d879a]">{title}</div>
      {subtitle ? <div className="mt-2 text-sm leading-relaxed text-[#506679]">{subtitle}</div> : null}
    </div>
  );
}

function FlowStep({
  label,
  icon,
  accent,
}: {
  label: string;
  icon: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <div
      className={[
        'flex min-w-[112px] flex-col items-center gap-3 rounded-[22px] border px-4 py-5 text-center',
        accent
          ? 'border-[#e6a18a] bg-[#fff0e8] text-[#98503f]'
          : 'border-[#c7d2dc] bg-white/80 text-[#446178]',
      ].join(' ')}
    >
      <div
        className={[
          'flex h-12 w-12 items-center justify-center rounded-2xl',
          accent ? 'bg-[#f5d4c8]' : 'bg-[#edf4f8]',
        ].join(' ')}
      >
        {icon}
      </div>
      <div className="text-sm font-black">{label}</div>
    </div>
  );
}

function DataSourceCard({
  label,
  icon,
}: {
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-[#d3ddd8] bg-white/85 px-4 py-4 text-[#49606f] shadow-[0_12px_24px_rgba(90,110,122,0.08)]">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#eff4f7] text-[#5b788f]">{icon}</div>
        <div className="text-sm font-bold">{label}</div>
      </div>
    </div>
  );
}

function BarRow({
  label,
  value,
  percentage,
  accent = 'mist',
}: {
  label: string;
  value: string;
  percentage: number;
  accent?: 'mist' | 'coral' | 'sand';
}) {
  const barClass =
    accent === 'coral'
      ? 'from-[#ea9c82] to-[#e2876a]'
      : accent === 'sand'
        ? 'from-[#d9cab8] to-[#bfaa94]'
        : 'from-[#97b4c8] to-[#6b8aa3]';

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-4 text-sm">
        <span className="font-semibold text-[#3f5767]">{label}</span>
        <span className="font-black text-[#2f4452]">{value}</span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-white/80">
        <div className={`h-full rounded-full bg-gradient-to-r ${barClass}`} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}

function SlideOneScene({ slide, variant }: { slide: SlideContent; variant: SceneVariant }) {
  return (
    <SceneFrame variant={variant}>
      <div className="relative flex h-full flex-col justify-between gap-8">
        <motion.div {...reveal(variant)} className="max-w-2xl">
          <SectionTitle title="主命題" subtitle="服務做完以後，真正耗心力的整理鏈才開始。" />
          <div className="flex flex-wrap gap-3">
            <Pill label="有效案例" value={stat(slide, '有效案例')} tone="coral" />
            <Pill label="工作節點" value="5 段" tone="mist" />
          </div>
        </motion.div>

        <div className="grid gap-4 md:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr_auto_1fr]">
          {[
            { label: '服務', icon: <ShieldCheck size={20} /> },
            { label: '整理', icon: <FolderOpen size={20} /> },
            { label: '核對', icon: <ScanSearch size={20} /> },
            { label: '補寫', icon: <NotebookPen size={20} /> },
            { label: '匯整', icon: <FileText size={20} /> },
          ].map((item, index, arr) => (
            <motion.div key={item.label} {...reveal(variant, 0.08 + index * 0.07)} className="contents">
              <FlowStep label={item.label} icon={item.icon} accent={item.label === '匯整'} />
              {index < arr.length - 1 ? (
                <div className="hidden items-center justify-center md:flex">
                  <ArrowRight className="text-[#c7907d]" size={22} />
                </div>
              ) : null}
            </motion.div>
          ))}
        </div>

        <motion.div {...reveal(variant, 0.34)} className="flex justify-end">
          <div className="rounded-2xl border border-[#d8cabf] bg-white/75 px-4 py-3 text-right">
            <div className="text-[11px] uppercase tracking-[0.2em] text-[#8f7d71]">資料口徑</div>
            <div className="mt-1 text-sm font-semibold text-[#5f544d]">{slide.sourceNote}</div>
          </div>
        </motion.div>
      </div>
    </SceneFrame>
  );
}

function SlideTwoScene({ variant }: { slide: SlideContent; variant: SceneVariant }) {
  return (
    <SceneFrame variant={variant}>
      <div className="grid h-full gap-8 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] md:items-center">
        <div className="space-y-4">
          <SectionTitle title="分析口徑" subtitle="先把資料怎麼留下來說清楚，才能避免誤把壓力當成個人表現。" />
          {[
            { label: '原始提交', value: '18', width: 'w-full', tone: 'mist' as const },
            { label: '扣除測試', value: '17', width: 'w-[82%]', tone: 'sand' as const },
            { label: '有效案例', value: '12', width: 'w-[62%]', tone: 'coral' as const },
          ].map((row, index) => (
            <motion.div
              key={row.label}
              {...reveal(variant, 0.08 + index * 0.08)}
              className={`${row.width} rounded-[24px] border px-5 py-5 ${
                row.tone === 'coral'
                  ? 'border-[#e8a28d] bg-[#fff0e8] text-[#9b4d3b]'
                  : row.tone === 'sand'
                    ? 'border-[#d7cabd] bg-[#faf6ef] text-[#6d5e53]'
                    : 'border-[#c7d5df] bg-white/80 text-[#476275]'
              }`}
            >
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm font-semibold">{row.label}</span>
                <span className="text-3xl font-black">{row.value}</span>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          {...reveal(variant, 0.28)}
          className="rounded-[28px] border border-[#d3dad6] bg-white/70 p-6 md:p-8"
        >
          <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#6c8799]">詮釋方式</div>
          <div className="mt-4 text-3xl font-black leading-snug text-[#314552] md:text-[2.5rem]">
            不是評分，
            <br />
            是拆解。
          </div>
          <div className="mt-4 text-base leading-relaxed text-[#566d7d]">
            重點不是誰快、誰慢，而是把工作拆開來看，找出哪些結構反覆製造耗損。
          </div>
        </motion.div>
      </div>
    </SceneFrame>
  );
}

function SlideThreeScene({ slide, variant }: { slide: SlideContent; variant: SceneVariant }) {
  return (
    <SceneFrame variant={variant}>
      <div className="grid h-full gap-5 md:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <motion.div
          {...reveal(variant)}
          className="rounded-[28px] border border-[#e3c0af] bg-[linear-gradient(160deg,rgba(255,245,238,0.94),rgba(255,255,255,0.8))] p-6"
        >
          <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#b06b56]">主要切入點</div>
          <div className="mt-6 text-6xl font-black leading-none text-[#9c533f] md:text-7xl">{stat(slide, '最麻煩先開始')}</div>
          <div className="mt-3 text-lg font-bold text-[#814638]">先從最麻煩的地方開始</div>
          <div className="mt-4 rounded-2xl bg-white/75 px-4 py-3 text-sm leading-relaxed text-[#725f58]">
            {statNote(slide, '最麻煩先開始')} 的案例，並不是先畫完整流程，而是先處理最卡的那一段。
          </div>
        </motion.div>

        <div className="grid gap-5 md:grid-rows-[auto_1fr]">
          <div className="grid gap-5 sm:grid-cols-2">
            {[
              {
                label: '整段流程切入',
                value: stat(slide, '整段流程切入'),
                note: statNote(slide, '整段流程切入'),
                tone: 'mist' as const,
              },
              {
                label: '單一工作切入',
                value: stat(slide, '單一工作切入'),
                note: statNote(slide, '單一工作切入'),
                tone: 'sand' as const,
              },
            ].map((card, index) => (
              <motion.div key={card.label} {...reveal(variant, 0.1 + index * 0.08)} className="rounded-[24px] border border-[#d0dce3] bg-white/80 p-5">
                <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#6f889a]">{card.label}</div>
                <div className="mt-4 text-4xl font-black text-[#355061]">{card.value}</div>
                <div className="mt-2 text-sm text-[#5f7280]">{card.note}</div>
              </motion.div>
            ))}
          </div>

          <motion.div
            {...reveal(variant, 0.24)}
            className="rounded-[28px] border border-[#c8d4de] bg-[#eef5f8] p-6"
          >
            <div className="flex items-start justify-between gap-6">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#6f8a9a]">日常性</div>
                <div className="mt-3 text-5xl font-black leading-none text-[#355264]">{stat(slide, '經常會遇到')}</div>
                <div className="mt-2 text-base font-bold text-[#446072]">是日常任務，不是偶發事故</div>
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/80 text-[#5d7a91]">
                <CalendarDays size={26} />
              </div>
            </div>
            <div className="mt-5 flex gap-2">
              {Array.from({ length: 12 }).map((_, index) => (
                <div
                  key={index}
                  className={`h-10 flex-1 rounded-xl border ${
                    index < 11 ? 'border-[#97b4c8] bg-[#cfe0ea]' : 'border-[#e2d5c7] bg-[#f6efe6]'
                  }`}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </SceneFrame>
  );
}

function SlideFourScene({ slide, variant }: { slide: SlideContent; variant: SceneVariant }) {
  const nodes = [
    { label: 'Word', value: '15', x: '8%', y: '18%' },
    { label: 'Excel', value: '14', x: '68%', y: '12%' },
    { label: 'AI 工具', value: '10', x: '74%', y: '58%' },
    { label: 'LINE', value: '10', x: '14%', y: '63%' },
    { label: '政府系統', value: '7', x: '38%', y: '8%' },
    { label: '內部系統', value: '6', x: '58%', y: '78%' },
    { label: '紙本資料', value: '6', x: '0%', y: '78%' },
    { label: '電話', value: '3', x: '86%', y: '34%' },
  ];

  return (
    <SceneFrame variant={variant}>
      <div className="grid h-full gap-8 md:grid-cols-[minmax(0,0.86fr)_minmax(0,1.14fr)]">
        <motion.div {...reveal(variant)} className="space-y-5">
          <SectionTitle title="步驟感 vs. 複雜度" subtitle="表面上看起來只有 2 步左右，但每一步背後都在跨工具切換。" />
          <div className="rounded-[28px] border border-[#e5c4b4] bg-[#fff0e8] p-6">
            <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#a8614d]">平均步驟數</div>
            <div className="mt-5 text-6xl font-black leading-none text-[#a0533f] md:text-7xl">{stat(slide, '平均步驟數')}</div>
            <div className="mt-3 text-base font-semibold text-[#7c4d40]">中位數 {stat(slide, '中位數')}</div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Pill label="Word" value={stat(slide, 'Word')} tone="sand" />
            <Pill label="Excel" value={stat(slide, 'Excel')} tone="sand" />
            <Pill label="AI 工具" value={stat(slide, 'AI 工具')} tone="mist" />
            <Pill label="LINE" value={stat(slide, 'LINE')} tone="coral" />
          </div>
        </motion.div>

        <div className="relative min-h-[320px] rounded-[28px] border border-[#c8d4de] bg-white/70 p-5">
          {nodes.map((node, index) => (
            <motion.div
              key={node.label}
              {...reveal(variant, 0.08 + index * 0.05)}
              className="absolute"
              style={{ left: node.x, top: node.y }}
            >
              <div className="rounded-[24px] border border-[#cbd9e3] bg-white/90 px-4 py-3 shadow-[0_10px_24px_rgba(83,105,123,0.1)]">
                <div className="text-xs font-bold uppercase tracking-[0.15em] text-[#6a879c]">{node.label}</div>
                <div className="mt-1 text-2xl font-black text-[#355061]">{node.value}</div>
              </div>
            </motion.div>
          ))}

          <motion.div
            {...reveal(variant, 0.18)}
            className="absolute left-1/2 top-1/2 z-10 flex h-28 w-28 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[#e6a38f] bg-[#fff4ef] text-center shadow-[0_18px_30px_rgba(164,97,78,0.16)]"
          >
            <div>
              <div className="text-3xl font-black leading-none text-[#a14d3c]">{stat(slide, '平均步驟數')}</div>
              <div className="mt-1 text-xs font-bold uppercase tracking-[0.18em] text-[#8d6556]">看似很少</div>
            </div>
          </motion.div>

          <svg className="absolute inset-0 h-full w-full text-[#b6c9d7]" viewBox="0 0 100 100" preserveAspectRatio="none">
            {[
              ['20', '24'],
              ['82', '18'],
              ['86', '62'],
              ['22', '66'],
              ['48', '14'],
              ['68', '82'],
              ['12', '84'],
              ['94', '40'],
            ].map((point, index) => (
              <line key={index} x1="50" y1="50" x2={point[0]} y2={point[1]} stroke="currentColor" strokeWidth="1.3" strokeDasharray="2 2" />
            ))}
          </svg>
        </div>
      </div>
    </SceneFrame>
  );
}

function SlideFiveScene({ slide, variant }: { slide: SlideContent; variant: SceneVariant }) {
  const points = [
    { label: '最低', value: stat(slide, '最低'), left: '2%', tone: 'sand' as const },
    { label: '排除高值後平均', value: stat(slide, '排除高值後平均'), left: '7%', tone: 'mist' as const },
    { label: '中位數', value: stat(slide, '中位數'), left: '11%', tone: 'mist' as const },
    { label: '平均月耗時', value: stat(slide, '平均月耗時'), left: '18%', tone: 'coral' as const },
    { label: '最高', value: stat(slide, '最高'), left: '95%', tone: 'coral' as const },
  ];

  return (
    <SceneFrame variant={variant}>
      <div className="grid h-full gap-7 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:items-center">
        <motion.div {...reveal(variant)} className="space-y-4">
          <SectionTitle title="耗時分布" subtitle="不能只看平均值，還要看任務之間被拉開到多遠。" />
          <div className="grid gap-3 sm:grid-cols-2">
            <Pill label="平均月耗時" value={stat(slide, '平均月耗時')} tone="coral" />
            <Pill label="中位數" value={stat(slide, '中位數')} tone="mist" />
            <Pill label="最低" value={stat(slide, '最低')} tone="sand" />
            <Pill label="最高" value={stat(slide, '最高')} tone="coral" />
          </div>
        </motion.div>

        <motion.div
          {...reveal(variant, 0.14)}
          className="rounded-[30px] border border-[#cdd8e1] bg-white/80 p-6"
        >
          <div className="relative pt-12">
            <div className="h-4 rounded-full bg-[linear-gradient(90deg,#d5c7ba_0%,#a7c0d0_25%,#7e9fb6_45%,#d89a82_100%)]" />
            {points.map((point, index) => (
              <motion.div
                key={point.label}
                {...reveal(variant, 0.2 + index * 0.06)}
                className="absolute top-0 -translate-x-1/2"
                style={{ left: point.left }}
              >
                <div className="flex flex-col items-center gap-2">
                  <div
                    className={`rounded-2xl border px-3 py-2 text-center ${
                      point.tone === 'coral'
                        ? 'border-[#e6a18a] bg-[#fff1ea] text-[#9b4d3b]'
                        : point.tone === 'sand'
                          ? 'border-[#d6cabd] bg-[#faf6ef] text-[#6f5f54]'
                          : 'border-[#c6d5df] bg-[#f2f7fb] text-[#456275]'
                    }`}
                  >
                    <div className="text-[10px] font-bold uppercase tracking-[0.16em]">{point.label}</div>
                    <div className="mt-1 text-sm font-black">{point.value}</div>
                  </div>
                  <div className="h-8 w-px bg-[#9bb6c7]" />
                </div>
              </motion.div>
            ))}
          </div>
          <div className="mt-8 rounded-2xl border border-[#d9e2e6] bg-[#f7fafc] px-4 py-3 text-sm leading-relaxed text-[#556a7a]">
            高耗時任務一旦長出來，會快速把整體平均往上拉，也更容易成為整理型耗損的核心來源。
          </div>
        </motion.div>
      </div>
    </SceneFrame>
  );
}

function SlideSixScene({ variant }: { variant: SceneVariant }) {
  return (
    <SceneFrame variant={variant}>
      <div className="grid h-full gap-6 md:grid-cols-[minmax(0,0.85fr)_auto_minmax(0,1fr)] md:items-center">
        <motion.div {...reveal(variant)} className="space-y-3">
          <SectionTitle title="來源端" subtitle="資料不是放在同一個地方，而是散落在各種載體裡。" />
          <div className="grid gap-3 sm:grid-cols-2">
            <DataSourceCard label="Excel" icon={<FileSpreadsheet size={20} />} />
            <DataSourceCard label="Word" icon={<FileText size={20} />} />
            <DataSourceCard label="LINE" icon={<MessageSquare size={20} />} />
            <DataSourceCard label="紙本與表單" icon={<NotebookPen size={20} />} />
          </div>
        </motion.div>

        <motion.div {...reveal(variant, 0.14)} className="flex items-center justify-center">
          <div className="flex flex-col gap-3 text-[#c28471]">
            {[0, 1, 2, 3].map((index) => (
              <ArrowRight key={index} size={28} />
            ))}
          </div>
        </motion.div>

        <motion.div {...reveal(variant, 0.22)} className="space-y-4">
          <SectionTitle title="整理流程" subtitle="抓資料、分類、改格式、核對之後，才變成一份可以交出去的成果。" />
          <div className="grid gap-3 sm:grid-cols-2">
            {['抓資料', '分類', '改格式', '核對', '報表輸出'].map((step, index) => (
              <div key={step} className="rounded-2xl border border-[#d0dae3] bg-white/80 px-4 py-4">
                <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#7f95a4]">Step {index + 1}</div>
                <div className="mt-2 text-lg font-black text-[#385364]">{step}</div>
              </div>
            ))}
          </div>
          <div className="rounded-[26px] border border-[#bfcfdb] bg-[#eef4f8] p-5">
            <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#6f8897]">輸出結果</div>
            <div className="mt-3 rounded-2xl border border-[#d1dce4] bg-white px-4 py-4 text-[#3f5868]">
              一份整齊、欄位一致、能交付的報表或成果資料
            </div>
          </div>
        </motion.div>
      </div>
    </SceneFrame>
  );
}

function SlideSevenScene({ variant }: { variant: SceneVariant }) {
  return (
    <SceneFrame variant={variant}>
      <div className="grid h-full gap-5 md:grid-cols-2">
        <motion.div {...reveal(variant)} className="rounded-[28px] border border-[#d1dbe3] bg-white/82 p-6">
          <SectionTitle title="系統核對與統計" subtitle="做過，不等於完成，還要能被統計與回看。" />
          <div className="space-y-3">
            {[
              '先確認有沒有登錄',
              '逐筆比對服務量',
              '怕漏欄位與分類',
              '最後要對得起來',
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-2xl bg-[#f5f9fb] px-4 py-3 text-[#486273]">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#6f8ea4]">
                  <Check size={16} />
                </div>
                <div className="text-sm font-semibold">{item}</div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div {...reveal(variant, 0.14)} className="rounded-[28px] border border-[#e0d2c5] bg-[#fbf4ed] p-6">
          <SectionTitle title="個案時間軸" subtitle="今天的資訊要能接上明天，工作才算真的被承接。" />
          <div className="relative mt-8">
            <div className="absolute left-5 top-0 bottom-0 w-px bg-[#d3bfaf]" />
            {[
              { label: 'LINE 訊息', icon: <MessageSquare size={18} /> },
              { label: '電話聯繫', icon: <Phone size={18} /> },
              { label: '紙本與手寫', icon: <NotebookPen size={18} /> },
              { label: '系統補記', icon: <FileText size={18} /> },
            ].map((item) => (
              <div key={item.label} className="relative mb-5 flex items-start gap-4 pl-1">
                <div className="z-10 flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-[#9f624c] shadow-sm">
                  {item.icon}
                </div>
                <div className="rounded-2xl border border-[#e4d6c8] bg-white/80 px-4 py-3 text-sm font-semibold text-[#7d5a4d]">
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </SceneFrame>
  );
}

function SlideEightScene({ variant }: { variant: SceneVariant }) {
  return (
    <SceneFrame variant={variant}>
      <div className="grid h-full gap-6 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,0.9fr)] md:items-center">
        <motion.div {...reveal(variant)} className="grid gap-4 sm:grid-cols-2">
          <DataSourceCard label="LINE 對話" icon={<MessageSquare size={20} />} />
          <DataSourceCard label="手寫筆記" icon={<NotebookPen size={20} />} />
          <DataSourceCard label="錄音內容" icon={<Clock3 size={20} />} />
          <DataSourceCard label="電話 / 家屬 / 單位" icon={<Phone size={20} />} />
        </motion.div>

        <motion.div {...reveal(variant, 0.18)} className="flex items-center justify-center">
          <Workflow className="text-[#d18d77]" size={40} />
        </motion.div>

        <motion.div {...reveal(variant, 0.26)} className="space-y-4">
          <SectionTitle title="正式紀錄生成" subtitle="零散資訊不會自己長成正式紀錄，必須有人回溯、整理、重組與確認。" />
          <div className="rounded-[28px] border border-[#cfdbe4] bg-white/85 p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#708a9b]">正式紀錄</div>
                <div className="mt-3 text-2xl font-black text-[#355061]">既要如實，又要統整</div>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eef4f7] text-[#5d7a8e]">
                <FileText size={22} />
              </div>
            </div>
            <div className="mt-4 rounded-2xl bg-[#f7fafb] px-4 py-4 text-sm leading-relaxed text-[#546979]">
              既要快，又不能漏。尤其在突發事件處遇情境中，正式紀錄還必須能承接後續責任。
            </div>
          </div>
          <div className="rounded-2xl border border-[#ead1c3] bg-[#fff3ec] px-4 py-3 text-sm font-semibold text-[#875343]">
            零散資訊 → 正式紀錄 → 後續服務延續
          </div>
        </motion.div>
      </div>
    </SceneFrame>
  );
}

function SlideNineScene({ variant }: { variant: SceneVariant }) {
  return (
    <SceneFrame variant={variant}>
      <div className="grid h-full gap-5 md:grid-cols-2">
        <motion.div {...reveal(variant)} className="rounded-[28px] border border-[#d0dce4] bg-white/82 p-6">
          <SectionTitle title="最希望被幫什麼" subtitle="第一線最常提到的，是流程簡化與資料彙整，不是炫技功能。" />
          <div className="space-y-4">
            <BarRow label="簡化整體流程" value="4" percentage={100} accent="coral" />
            <BarRow label="彙整成表" value="4" percentage={100} accent="mist" />
            <BarRow label="生成初稿" value="2" percentage={50} accent="sand" />
            <BarRow label="找出漏掉資訊" value="1" percentage={25} accent="mist" />
            <BarRow label="整理內容" value="1" percentage={25} accent="sand" />
          </div>
        </motion.div>

        <motion.div {...reveal(variant, 0.14)} className="rounded-[28px] border border-[#e1d1c5] bg-[#fbf4ed] p-6">
          <SectionTitle title="最想節省的是什麼" subtitle="大家想省下的不只時間，還有來回確認、出錯與混亂感。" />
          <div className="space-y-4">
            <BarRow label="時間" value="4" percentage={100} accent="coral" />
            <BarRow label="來回確認次數" value="3" percentage={75} accent="mist" />
            <BarRow label="出錯機率" value="2" percentage={50} accent="sand" />
            <BarRow label="重複輸入" value="1" percentage={25} accent="mist" />
            <BarRow label="混亂感" value="1" percentage={25} accent="sand" />
            <BarRow label="心力" value="1" percentage={25} accent="mist" />
          </div>
        </motion.div>
      </div>
    </SceneFrame>
  );
}

function SlideTenScene({ variant }: { variant: SceneVariant }) {
  return (
    <SceneFrame variant={variant}>
      <div className="grid h-full gap-6 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:items-center">
        <motion.div {...reveal(variant)} className="space-y-4">
          <SectionTitle title="工具先幫忙" subtitle="優先承接整理型耗損，減少重工與怕漏怕錯。" />
          {[
            { label: '整理訊息', icon: <Sparkles size={18} /> },
            { label: '彙整成表', icon: <FileSpreadsheet size={18} /> },
            { label: '初稿生成', icon: <Bot size={18} /> },
            { label: '檢漏與格式轉換', icon: <ScanSearch size={18} /> },
            { label: '多來源整合', icon: <FolderOpen size={18} /> },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-3 rounded-2xl border border-[#cad9e2] bg-white/82 px-4 py-4 text-[#456174]">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#eef4f8]">{item.icon}</div>
              <div className="text-sm font-semibold">{item.label}</div>
            </div>
          ))}
        </motion.div>

        <motion.div {...reveal(variant, 0.12)} className="flex items-center justify-center">
          <div className="rounded-full border border-[#dbc8ba] bg-white/75 px-5 py-3 text-center">
            <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8c7368]">原則</div>
            <div className="mt-2 text-sm font-black text-[#64564d]">輔助，而非取代</div>
          </div>
        </motion.div>

        <motion.div {...reveal(variant, 0.2)} className="space-y-4">
          <SectionTitle title="仍需由人主責" subtitle="專業判斷、風險評估、關係工作與責任承擔，不能直接外包給工具。" />
          {[
            { label: '判斷與選擇', icon: <AlertCircle size={18} /> },
            { label: '風險與界線', icon: <ShieldCheck size={18} /> },
            { label: '關係與陪伴', icon: <MessageSquare size={18} /> },
            { label: '確認與責任', icon: <FileText size={18} /> },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-3 rounded-2xl border border-[#e1d1c5] bg-[#fff6f1] px-4 py-4 text-[#835444]">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/85">{item.icon}</div>
              <div className="text-sm font-semibold">{item.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </SceneFrame>
  );
}

export function BurnoutSlideScene({
  slide,
  variant,
}: {
  slide: SlideContent;
  variant: SceneVariant;
}) {
  switch (slide.id) {
    case 'slide-01':
      return <SlideOneScene slide={slide} variant={variant} />;
    case 'slide-02':
      return <SlideTwoScene slide={slide} variant={variant} />;
    case 'slide-03':
      return <SlideThreeScene slide={slide} variant={variant} />;
    case 'slide-04':
      return <SlideFourScene slide={slide} variant={variant} />;
    case 'slide-05':
      return <SlideFiveScene slide={slide} variant={variant} />;
    case 'slide-06':
      return <SlideSixScene variant={variant} />;
    case 'slide-07':
      return <SlideSevenScene variant={variant} />;
    case 'slide-08':
      return <SlideEightScene variant={variant} />;
    case 'slide-09':
      return <SlideNineScene variant={variant} />;
    case 'slide-10':
      return <SlideTenScene variant={variant} />;
    default:
      return null;
  }
}
