'use client';

import { motion } from 'framer-motion';
import SubpageHeader from '@/components/SubpageHeader';
import { Banner, FadeIn } from '@/components/ui-shared';
import { GUIDE_PAGE_NAME } from '@/lib/public-site';
import {
  BookMarked,
  ChevronRight,
  Eye,
  Gavel,
  Layers,
  MessageCircle,
  Scale,
  Shield,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';

const serif = { fontFamily: "'Noto Serif TC', serif" };

const ethicsCards = [
  {
    icon: <ShieldAlert size={26} />,
    title: '嚴格去識別化',
    desc: '徹底移除隱私資訊。禁止揭露真實姓名、居住地或非公開案情細節。',
    bg: 'bg-red-50',
    accent: 'text-red-500',
    border: 'border-red-100',
  },
  {
    icon: <Scale size={26} />,
    title: '聚焦職務非個人',
    desc: '針對「專業判斷」與「機制制度」進行討論，嚴禁人身攻擊。',
    bg: 'bg-emerald-50',
    accent: 'text-[#7B8C4E]',
    border: 'border-emerald-100',
  },
  {
    icon: <Shield size={26} />,
    title: '遵守法律基礎',
    desc: '遵守法規與公共秩序，不得發表違法資訊或煽動仇恨言論。',
    bg: 'bg-gray-50',
    accent: 'text-gray-600',
    border: 'border-gray-200',
  },
];

const workflow = [
  {
    title: '前期｜團隊整理',
    items: ['實際參與所有場次形成筆記', '蒐集觀庭多元筆記校對補缺', '蒐集案件整體相關資料'],
    borderC: 'border-l-blue-400',
    accent: 'text-blue-400',
  },
  {
    title: '呈現',
    items: ['還原現場還原筆記', '工作檯投稿與審核發布機制', '形成論述探討與交流'],
    borderC: 'border-l-[#7B8C4E]',
    accent: 'text-[#7B8C4E]',
  },
  {
    title: '最後',
    items: ['共構本事件之還原計畫與共識', '透過集體智慧建立新的準則與論述'],
    borderC: 'border-l-[#C67B5C]',
    accent: 'text-[#C67B5C]',
  },
];

const whatWeDo = [
  { icon: <BookMarked size={30} />, label: '整合資訊', desc: '打破壁壘，降低門檻', color: 'bg-[#E3EED3]', accent: 'text-[#5A6F35]' },
  { icon: <Eye size={30} />, label: '觀庭還原', desc: '身歷其境，完整還原', color: 'bg-[#F5E6D3]', accent: 'text-[#A0724E]' },
  { icon: <Gavel size={30} />, label: '觀庭評述', desc: '就本案呈現真實狀況評論', color: 'bg-[#E0DAF0]', accent: 'text-[#6B5CA5]' },
  { icon: <MessageCircle size={30} />, label: '建構交流', desc: '匿名交流，平等詮釋', color: 'bg-[#E3EED3]', accent: 'text-[#5A6F35]' },
  { icon: <Sparkles size={30} />, label: '共構解方', desc: '集體智慧，復原重建', color: 'bg-[#FDE8D8]', accent: 'text-[#C67B5C]' },
];

const problems = [
  {
    icon: <Layers size={24} className="text-blue-500" />,
    title: '資訊取得門檻高',
    desc: '法庭相關資訊分散且零碎，一般讀者往往難以取得完整脈絡。',
  },
  {
    icon: <Eye size={24} className="text-[#7B8C4E]" />,
    title: '原始筆記難以完整理解',
    desc: '若缺乏程序背景、詰問脈絡與對照材料，很容易只看見片段而忽略整體。',
  },
  {
    icon: <MessageCircle size={24} className="text-[#C67B5C]" />,
    title: '對話容易流於情緒與片段',
    desc: '若沒有共同規範與可回扣的文字基礎，討論很容易偏離事實與專業分析。',
  },
];

export default function GuidePage() {
  return (
    <div className="min-h-screen bg-[#FBF7F0] pt-20">
      <SubpageHeader />

      <div id="guide-rules">
        <Banner title={GUIDE_PAGE_NAME} subtitle="Platform Limits & Guidelines" bg="bg-orange-50" text="text-orange-600" />
      </div>
      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <FadeIn>
            <div className="rounded-2xl border border-orange-100 bg-white p-6 shadow-sm md:p-8">
              <div className="inline-flex items-center rounded-full bg-orange-50 px-4 py-2 text-[12px] font-black tracking-[0.18em] text-orange-600">
                重要
              </div>
              <div className="mt-4 space-y-4 text-[16px] font-medium leading-relaxed text-[#5D5549] md:text-[18px]">
                <p>
                  本計畫旨在提供相對還原現場之還原筆記，並佐以相關法庭知能、案情資訊彙整，降低取得資料與學習先備知識之門檻，使大眾均能從具備法庭現場詰問交互脈絡、可核對證人間陳述之異同、亦希望幫助檢閱陳述之一致性。避免由個人認知偏誤所導致之斷章取義或避重就輕、立場詮釋。
                </p>
                <p>
                  剴剴案屬於公眾與社會工作群體的重大事件，對社會集體均造成影響，我們望能透過立基於「事實」而產生的對話與交流，來尋找共識與解方。
                </p>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.08}>
            <div className="rounded-2xl border border-[#E8DCC7] bg-white p-6 shadow-sm md:p-8">
              <h3 className="mb-4 text-[24px] font-black text-gray-900 md:text-[28px]" style={serif}>計畫限制</h3>
              <div className="space-y-4 text-[16px] font-medium leading-relaxed text-[#5D5549] md:text-[17px]">
                <p>本團隊會善盡網站管理責任，並恪守原則，但仍有以下限制：</p>
                <p>
                  本網站還原筆記由本團隊觀庭手記並蒐集各社群民眾、社工網路夥伴公開之類文字稿，亦有夥伴進行文件提供，本團隊歷時多月進行核對與拼湊，盡力還原開庭詰問與論告等對話語順、情境、前後文，竭力提供相對還原之還原筆記，但仍有限制，可能會有錯漏，還望大眾海涵。
                </p>
                <p>
                  本團隊由實務工作者與育兒民眾等等組成，利用下班時間及假日空暇進行本計畫，故審閱及處理問題速度受限，亦請各位諒解。
                </p>
              </div>
            </div>
          </FadeIn>
        </div>

        <FadeIn delay={0.14}>
          <div className="mt-5 rounded-2xl border border-[#F1DDC0] bg-gradient-to-r from-[#FFF7E8] via-[#FFFDF7] to-[#F9FBE7] px-6 py-5 shadow-sm">
            <p className="text-[15px] font-bold leading-[1.9] text-[#6B6358] md:text-[16px]">
              因為都是大家下班育兒時間騰出時間維護和審閱網站，還請大家幫忙避免批評謾罵、洩漏個資或吵架到脆、靠北社工、滴卡、IG 之類的平台，我們這裡就心平氣和地講，也讓我們這些中年社畜好過一些哈（鞠躬）
            </p>
          </div>
        </FadeIn>

        <FadeIn>
          <div className="mt-5 rounded-2xl border border-orange-100 bg-white p-6 shadow-sm md:p-8">
            <div className="max-w-3xl">
              <h3 className="mb-3 text-[24px] font-black text-gray-900 md:text-[30px]" style={serif}>這個平台在做什麼？</h3>
              <div className="space-y-4 text-[16px] font-medium leading-relaxed text-[#5D5549] md:text-[18px]">
                <p>
                  本網站不是即時論壇，也不是立場表態牆，而是以觀庭現場還原筆記、先備知識與經審核公開的共構文章為核心的知識平台。
                </p>
                <p>
                  我們希望把零散的觀庭記錄、知能背景與討論脈絡整理成可閱讀、可比對、可回扣原始文字的公共資料。
                </p>
              </div>
            </div>
          </div>
        </FadeIn>
      </section>

      <div id="guide-ethics">
        <Banner title="倫理規範與發言守則" subtitle="Ethics & Guidelines" bg="bg-[#F5E0E0]" text="text-[#8B3535]" />
      </div>
      <section className="mx-auto max-w-7xl px-6 py-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {ethicsCards.map((card, i) => (
            <FadeIn key={card.title} delay={i * 0.08}>
              <motion.div whileHover={{ y: -4 }} className={`${card.bg} rounded-2xl border p-6 transition-all ${card.border}`}>
                <motion.div whileHover={{ rotate: 8 }} className={`mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-white/80 ${card.accent}`}>
                  {card.icon}
                </motion.div>
                <h4 className="mb-2 text-[22px] font-black text-gray-900" style={serif}>{card.title}</h4>
                <p className="text-[17px] font-medium leading-relaxed text-[#6B6358]">{card.desc}</p>
              </motion.div>
            </FadeIn>
          ))}
        </div>
      </section>

      <div id="guide-workflow">
        <Banner title="平台運作模式" subtitle="Workflow & Features" bg="bg-[#E0DAF0]" text="text-[#4A3D7B]" />
      </div>
      <section className="mx-auto max-w-7xl px-6 py-8 pb-12">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {workflow.map((step, i) => (
            <FadeIn key={step.title} delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -4, boxShadow: '0 8px 25px rgba(0,0,0,0.08)' }}
                className={`h-full rounded-2xl border border-[#E8E0D4] border-l-4 bg-white p-6 shadow-sm transition-all ${step.borderC}`}
              >
                <h4 className="mb-4 text-[24px] font-black text-gray-900" style={serif}>{step.title}</h4>
                <ul className="space-y-3">
                  {step.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-[17px] font-medium text-[#5A5347]">
                      <ChevronRight size={18} className={`mt-1 shrink-0 ${step.accent}`} />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </FadeIn>
          ))}
        </div>
      </section>

      <div id="guide-what-we-do">
        <Banner title="這個平台在做什麼？" subtitle="What We Do" bg="bg-[#E8E0D4]" text="text-[#3D3832]" />
      </div>
      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-5">
          {whatWeDo.map((item, i) => (
            <FadeIn key={item.label} delay={i * 0.08}>
              <motion.div
                whileHover={{ y: -6, scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                className={`h-full cursor-pointer rounded-2xl border border-black/5 p-6 transition-shadow ${item.color}`}
              >
                <motion.div
                  whileHover={{ rotate: 8, scale: 1.15 }}
                  transition={{ type: 'spring', stiffness: 400 }}
                  className={`mb-3 flex h-14 w-14 items-center justify-center rounded-xl bg-white/60 ${item.accent}`}
                >
                  {item.icon}
                </motion.div>
                <p className="text-[22px] font-black text-[#2F2923] md:text-[24px]" style={serif}>{item.label}</p>
                <p className="mt-2 text-[15px] font-bold leading-relaxed text-[#8A8078]">{item.desc}</p>
              </motion.div>
            </FadeIn>
          ))}
        </div>
      </section>

      <div id="guide-problems">
        <Banner title="我們要解決什麼問題？" subtitle="Problems We Solve" bg="bg-[#E8D5B8]" text="text-[#8B4D35]" />
      </div>
      <section className="mx-auto max-w-7xl px-6 py-8 pb-12">
        <div className="relative grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="absolute left-[15%] right-[15%] top-[40%] z-0 hidden h-[2px] bg-gradient-to-r from-[#7B8C4E] via-[#B8860B] to-[#C67B5C] opacity-30 md:block"></div>
          <motion.div
            animate={{ scaleX: [0, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute left-[15%] right-[15%] top-[40%] z-0 hidden h-[2px] origin-left bg-gradient-to-r from-[#7B8C4E] via-[#B8860B] to-[#C67B5C] md:block"
          />

          {problems.map((step, i) => (
            <FadeIn key={step.title} delay={i * 0.1} className="relative z-10">
              <motion.div whileHover={{ y: -5 }} className="h-full rounded-3xl border border-[#E8E0D4] bg-white/80 p-6 text-center shadow-sm backdrop-blur">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-gray-100 bg-gray-50">
                  {step.icon}
                </div>
                <h4 className="mb-3 text-[20px] font-black text-gray-800" style={serif}>{step.title}</h4>
                <p className="text-[15px] font-bold leading-relaxed text-[#6B6358]">{step.desc}</p>
              </motion.div>
            </FadeIn>
          ))}
        </div>
      </section>
    </div>
  );
}
