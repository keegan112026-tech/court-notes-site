'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Scale, Gavel, Shield, User, ShieldAlert,
  FileText, ChevronDown, EarOff, PenTool, ExternalLink,
  ChevronRight, BookOpen, HelpCircle, AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import Dog from '@/components/Dog';

const serif = { fontFamily: "'Noto Serif TC', serif" };

// ─────────────────────────────────────────────────────────────────
// 通用元件：引述來源 Badge
// ─────────────────────────────────────────────────────────────────
function CiteBadge({ label, href }: { label: string; href: string }) {
  return (
    <a
      href={href} target="_blank" rel="noreferrer"
      onClick={e => e.stopPropagation()}
      className="inline-flex items-center gap-1 text-[10px] font-black tracking-wider uppercase
                 bg-white/5 border border-white/15 text-gray-500 hover:text-white hover:bg-white/10 hover:border-white/30
                 px-2 py-0.5 rounded-full transition-all cursor-pointer ml-1.5 align-middle whitespace-nowrap"
    >
      <ExternalLink size={8} />
      {label}
    </a>
  );
}

// ─────────────────────────────────────────────────────────────────
// 通用元件：引述段落
// ─────────────────────────────────────────────────────────────────
function SourceQuote({ quote, source, href }: { quote: string; source: string; href: string }) {
  return (
    <blockquote className="border-l-2 border-white/15 pl-4 my-4 group">
      <p className="text-gray-400 text-sm leading-relaxed italic">{quote}</p>
      <a href={href} target="_blank" rel="noreferrer"
         className="mt-1.5 inline-flex items-center gap-1 text-[11px] text-gray-600 group-hover:text-gray-300 transition-colors">
        <ExternalLink size={9} />
        資料來源：{source}
      </a>
    </blockquote>
  );
}

// ─────────────────────────────────────────────────────────────────
// 可展開角色卡片
// ─────────────────────────────────────────────────────────────────
function RoleCard({
  icon, title, subtitle, color, bg, border,
  summary, detail, citations
}: {
  icon: React.ReactNode; title: string; subtitle: string;
  color: string; bg: string; border: string;
  summary: string; detail: string;
  citations?: { label: string; href: string }[];
}) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.65 }} viewport={{ once: true, margin: '-60px' }}
      className={`rounded-2xl border ${border} bg-black/40 backdrop-blur-md cursor-pointer select-none`}
      onClick={() => setOpen(v => !v)}
    >
      <div className="p-7">
        <div className={`flex items-center gap-4 mb-3 ${color}`}>
          <div className={`p-3 rounded-xl ${bg} shrink-0`}>{icon}</div>
          <div>
            <h3 className="text-xl font-black leading-tight" style={serif}>{title}</h3>
            <p className="text-xs text-gray-500 tracking-widest uppercase mt-0.5">{subtitle}</p>
          </div>
          <ChevronDown size={18} className={`ml-auto text-gray-500 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
        </div>
        <p className="text-gray-300 leading-relaxed text-base">{summary}</p>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}
            className={`overflow-hidden border-t ${border}`}
          >
            <div className="p-7 pt-5">
              <p className="text-gray-400 leading-relaxed text-sm">{detail}</p>
              {citations && citations.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="text-[10px] text-gray-600 uppercase tracking-widest self-center">延伸閱讀：</span>
                  {citations.map(c => (
                    <a key={c.href} href={c.href} target="_blank" rel="noreferrer"
                       onClick={e => e.stopPropagation()}
                       className="inline-flex items-center gap-1 text-[11px] text-gray-500 hover:text-white border border-white/10 hover:border-white/25 px-2.5 py-1 rounded-lg transition-all">
                      <ExternalLink size={9} /> {c.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────
// 資料
// ─────────────────────────────────────────────────────────────────
const roles = [
  {
    id: 'judge', title: '法官 ／ 合議庭', subtitle: 'Judge / Collegiate Court',
    icon: <Gavel size={28} />, color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/25',
    summary: '居中聽審、主持程序與依法裁判的主體。負責根據合法調查所得的證據，在法定程序下形成判斷、作成裁判。',
    detail: '刑事案件是否由單一法官或合議庭審理，需依案件類型與適用程序判斷。就一般第一審通常程序而言，多由三位法官組成合議庭共同審理，但法律另有例外規定。在合議庭中，審判長負責指揮程序進行；受命法官主導準備程序；陪席法官共同參與審理、評議與裁判形成。',
    citations: [{ label: '合議庭（法律百科）', href: 'https://www.legis-pedia.com/dictionary/3822' }],
  },
  {
    id: 'prosecutor', title: '檢察官', subtitle: 'Prosecutor',
    icon: <Scale size={28} />, color: 'text-purple-400', bg: 'bg-purple-400/10', border: 'border-purple-400/25',
    summary: '代表國家行使追訴權。在無罪推定原則下，承擔舉證責任，必須提出充分、合法的證據，積極證明被告的犯罪事實。',
    detail: '在法庭上，檢察官負責陳述案件主張、聲請調查證據、進行詰問，以及在辯論終結前提出論告與量刑意見。由於檢察官負有客觀義務，對被告有利與不利的情形，依法都應一併注意。',
    citations: [
      { label: '檢察官（法律百科）', href: 'https://www.legis-pedia.com/dictionary/3731' },
      { label: '論告（司法院辭典）', href: 'https://terms.judicial.gov.tw/TermContent.aspx?TRMTERM=%E8%AB%96%E5%91%8A&SYS=M' },
    ],
  },
  {
    id: 'defendant', title: '被告', subtitle: 'Defendant',
    icon: <User size={28} />, color: 'text-gray-300', bg: 'bg-white/8', border: 'border-white/20',
    summary: '刑事訴訟中的防禦主體，也是程序保障的核心對象。受無罪推定原則保障，無須違背自己意思而為陳述。',
    detail: '被告享有多項重要訴訟權利：得保持緘默（法院不得僅因緘默而為不利判斷）、得選任辯護人、得請求調查有利證據。這些防禦性權利的存在，是確保審判公平的基礎。',
    citations: [{ label: '無罪答辯（法律百科）', href: 'https://www.legis-pedia.com/dictionary/180' }],
  },
  {
    id: 'defense', title: '辯護律師', subtitle: 'Defense Counsel',
    icon: <Shield size={28} />, color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/25',
    summary: '協助被告行使防禦權，確保程序正當與審判公平。辯護人不是在「幫壞人脫罪」，而是在確保整個審判過程符合程序正義。',
    detail: '辯護人會透過閱卷、提出法律意見、聲請調查有利證據、反詰問檢方證人，以及在辯論中指出證據與論理上的不足，協助法院檢驗檢方主張是否已達到定罪所需的程度。',
    citations: [{ label: '辯護人（法律百科）', href: 'https://www.legis-pedia.com/dictionary/303' }],
  },
  {
    id: 'witness', title: '證人', subtitle: 'Witness',
    icon: <User size={28} />, color: 'text-[#C67B5C]', bg: 'bg-[#C67B5C]/10', border: 'border-[#C67B5C]/30',
    summary: '就待證事實提供陳述的人。原則上應針對自己親身見聞的事實作證，並接受法庭中的訊問與詰問。',
    detail: '除法律另有規定外，在他人案件中原則上有作證義務；但法律也針對特定情形設有拒絕證言權，例如一定親屬關係、自陷刑責風險或受秘密義務拘束等情況。證詞是否可信，不只看內容本身，也看它是否能承受詰問檢驗並與其他證據互相印證。',
    citations: [
      { label: '證人義務（法律百科）', href: 'https://www.legis-pedia.com/article/remedy-procedure/837' },
      { label: '拒絕證言（法律百科）', href: 'https://www.legis-pedia.com/article/remedy-procedure/838' },
    ],
  },
  {
    id: 'staff', title: '書記官・通譯・法警', subtitle: 'Court Support Staff',
    icon: <FileText size={28} />, color: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/25',
    summary: '維持法庭正常運作的基石人員。書記官製作筆錄、通譯確保聽審權、法警維持秩序，往往不在聚光燈下，卻是整個審判能夠合法推進的重要支柱。',
    detail: '書記官負責詳實製作法庭筆錄，是整個訴訟程序的記錄與存證核心；通譯負責在有語言障礙的場合提供語言轉換；法警負責維持法庭秩序、執行戒護與其他安全協助工作。',
    citations: [],
  },
];

const stages = [
  {
    label: '準備程序', tag: '前置', color: 'text-gray-400', accent: 'border-gray-600', dot: 'bg-gray-500',
    task: '整理爭點，設定戰場邊界',
    detail: '在正式集中審理前，法院得先行準備程序，整理案件爭點、確認雙方主張、處理證據能力與調查方式，讓正式開庭時能更聚焦。這個階段的重點，不在於完整攻防，而是先把案件真正有爭執的地方整理清楚。',
    tip: '觀庭時可能不一定會看到這個階段；有時是在主開庭前的另一庭完成。',
  },
  {
    label: '程序啟動與權利告知', tag: '第一階段', color: 'text-blue-400', accent: 'border-blue-500', dot: 'bg-blue-500',
    task: '確認角色、確立法律基礎',
    detail: '正式審判開始後，法院會確認相關程序角色是否到庭，並依法告知被告重要權利，例如得保持緘默、得選任辯護人，以及得請求調查有利證據。這一步，是整場審判合法展開的基礎。',
    tip: '聽到「現在告知被告……」時，代表審判正式開始了。',
  },
  {
    label: '案件主張與證據整理', tag: '第二階段', color: 'text-purple-400', accent: 'border-purple-500', dot: 'bg-purple-500',
    task: '各方表態，確認戰線',
    detail: '此時，檢察官會陳述案件的主要內容，雙方也可能就現有證據、爭執事項與後續調查順序進一步確認。觀庭時，可以注意目前雙方究竟在爭執什麼：是事實本身、證據可信度，還是法律評價。',
    tip: '注意分辨「主張」和「證明」的差異——主張是立場，證明才需要證據支撐。',
  },
  {
    label: '證據調查與交互詰問', tag: '第三階段', color: 'text-[#C67B5C]', accent: 'border-[#C67B5C]', dot: 'bg-[#C67B5C]',
    task: '法庭核心交鋒，直接檢驗事實',
    detail: '這通常是法庭上最具張力的階段。雙方透過證人、鑑定、文書、勘驗結果或其他證據，讓法庭直接接觸案件中的事實材料，並在程序中接受檢驗。其中最關鍵的環節，就是交互詰問——同一名證人會依一定順序接受不同方向的提問。',
    tip: '這個階段可能最長，也最需要你理解詰問機制。請先閱讀下方第三章。',
    isCore: true,
  },
  {
    label: '論告、辯論與被告最後陳述', tag: '第四階段', color: 'text-amber-400', accent: 'border-amber-500', dot: 'bg-amber-500',
    task: '總結評價，走向裁判',
    detail: '當證據調查完成後，案件會進入總結性的辯論階段。檢察官提出論告與量刑意見；辯護人提出辯護；被告則有最後陳述的機會。此時，法庭開始整體評價整體證據是否已達到可作成裁判的程度。',
    tip: '論告是檢察官的「總結」，辯論是辯護人的「最終防線」，最後陳述是被告唯一直接對法官說話的機會。',
  },
];

const crossExamRounds = [
  {
    num: '01', title: '主詰問', en: 'Direct Examination', by: '由聲請傳喚方提問',
    color: 'text-blue-400', border: 'border-blue-500/30', bg: 'bg-blue-500/5',
    purpose: '讓證人有系統地陳述對己方有利的事實內容，建立基礎敘事。',
    rule: '禁止誘導詰問', ruleColor: 'text-red-400 bg-red-500/10 border-red-500/30',
    note: '此時問的問題必須是開放性的，不可在問題中暗示答案。',
    cite: { label: '主詰問（法律百科）', href: 'https://www.legis-pedia.com/dictionary/792' },
  },
  {
    num: '02', title: '反詰問', en: 'Cross-Examination', by: '由對造方提問',
    color: 'text-purple-400', border: 'border-purple-500/30', bg: 'bg-purple-500/5',
    purpose: '檢驗證詞的可信度，揭露矛盾，或引出被隱瞞、未提及的重要事實。',
    rule: '允許誘導詰問', ruleColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    note: '此時對造面對的是「敵性證人」，法律允許用包含答案的問題來壓力測試。',
    cite: { label: '反詰問（法律百科）', href: 'https://www.legis-pedia.com/dictionary/3417' },
  },
  {
    num: '03', title: '覆主詰問', en: 'Redirect Examination', by: '由原聲請方再提問',
    color: 'text-blue-400', border: 'border-blue-500/30', bg: 'bg-blue-500/5',
    purpose: '針對反詰問中被動搖或產生誤解的部分，進行修復與澄清。',
    rule: '禁止誘導詰問', ruleColor: 'text-red-400 bg-red-500/10 border-red-500/30',
    note: '範圍限於反詰問所衍生的問題，不能無限擴大到全新話題。',
    cite: null,
  },
  {
    num: '04', title: '覆反詰問', en: 'Recross-Examination', by: '由對造方最後提問',
    color: 'text-purple-400', border: 'border-purple-500/30', bg: 'bg-purple-500/5',
    purpose: '就覆主詰問中新出現的內容，進行最後辨明與確認。',
    rule: '允許誘導詰問', ruleColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    note: '範圍嚴格限於覆主詰問新增的內容，不能重複反詰問已問過的議題。',
    cite: null,
  },
];

const observeQuestions = [
  { q: '現在進行到哪個程序階段？', a: '先辨識目前是在準備程序、證據調查，還是最後辯論。知道法庭現在在哪個階段，才能知道眼前發言的功能與意義。不同階段的陳述，在法律上的地位也不相同。', icon: <BookOpen size={18} /> },
  { q: '誰正在主導這一段的法庭節奏？', a: '有時是檢察官在建立起訴主張，有時是辯護人在拆解證據可信度，有時則是審判長在維持程序秩序、處理界線爭議。主導者的立場，影響著你解讀當下對話的方式。', icon: <User size={18} /> },
  { q: '這個問題，是在試圖證明什麼事實？', a: '法庭上的每個問題都在服務某個待證事實。有些問題是在建立事實，有些是在補漏洞，有些則是在打擊證詞可信度。問對方「你當時在哪裡」和「你有沒有看到」，背後的策略可能完全不同。', icon: <HelpCircle size={18} /> },
  { q: '為什麼此刻提出異議？', a: '異議出現，通常意味著某一條程序規則正在被爭執。與其只看場面是否緊張，更重要的是辨識：對方認為哪條規則被碰到了——是誘導詰問、傳聞證據、還是問題超出範圍？', icon: <AlertCircle size={18} /> },
  { q: '哪些是主張，哪些才是證明？', a: '在法庭上，不是誰講得大聲、講得流暢就比較有力。真正重要的是：哪些內容有證據支持、哪些內容經得起詰問與比對，哪些則仍只是單方立場。這個分辨能力，是觀庭的核心素養。', icon: <Scale size={18} /> },
];

// ─────────────────────────────────────────────────────────────────
// 主頁面
// ─────────────────────────────────────────────────────────────────
export default function PrerequisitesPage() {
  const [openStage, setOpenStage] = useState<number | null>(null);
  const [openQ, setOpenQ] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white selection:bg-[#C67B5C]/40 selection:text-white pb-24">
      <Dog />

      {/* ─── Hero ─── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0F2540]/25 via-black to-black z-0" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center_top,rgba(198,123,92,0.08),transparent_50%)] z-0" />

        <motion.div
          initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, ease: 'easeOut' }}
          className="relative z-10 text-center max-w-4xl mx-auto space-y-8"
        >
          <motion.div
            animate={{ y: [0, -5, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-white/10 bg-white/5 text-[#C67B5C]"
          >
            <Scale size={38} />
          </motion.div>

          <p className="text-[#C67B5C] font-black tracking-[0.35em] uppercase text-xs md:text-sm">
            Court Observation Guide ／ 觀庭共構筆記計畫
          </p>
          <h1 className="text-5xl md:text-7xl font-black leading-tight tracking-tight" style={serif}>
            觀庭前新手教程
          </h1>
          <h2 className="text-lg md:text-2xl font-medium text-gray-400 tracking-wide">
            刑事法庭實務與程序理解
          </h2>
          <div className="h-px w-24 bg-gradient-to-r from-transparent via-[#C67B5C] to-transparent mx-auto" />

          <div className="max-w-2xl mx-auto space-y-5 text-left">
            <p className="text-lg md:text-xl text-gray-300 font-serif leading-relaxed">
              要看懂法庭上的攻防與節奏，先從理解刑事審判的基本規則開始。
            </p>
            <p className="text-base text-gray-500 leading-[1.9]">
              刑事法庭不是一個只靠立場與情緒運作的地方。每一次發問、每一次回答、每一次異議與裁定，
              都發生在一套有順序、有界線的程序裡。
            </p>
            <p className="text-base text-gray-500 leading-[1.9]">
              這份行前教學，將帶你認識刑事法庭中的角色、程序與證據攻防。當你真正坐進法庭旁聽時，
              不只是在看一場對話，而是能看懂：現在進行到哪一步、誰在承擔什麼任務、哪個問題為什麼重要、
              某次異議又是在守住哪一道程序界線。
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <a href="#chapter-1" className="inline-flex items-center gap-2 bg-[#C67B5C] hover:bg-[#b86b4d] text-white font-black px-7 py-3.5 rounded-full transition-colors text-sm tracking-wider">
              開始認識法庭 <ChevronRight size={16} />
            </a>
            <Link href="/sessions" className="inline-flex items-center gap-2 border border-white/15 hover:border-white/30 text-gray-300 hover:text-white font-black px-7 py-3.5 rounded-full transition-all text-sm tracking-wider">
              學完後進入還原筆記 <ChevronRight size={16} />
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5, duration: 1 }}
          className="absolute bottom-10 flex flex-col items-center text-gray-600"
        >
          <span className="text-[10px] uppercase tracking-[0.3em] mb-2">Scroll</span>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
            <ChevronDown size={18} />
          </motion.div>
        </motion.div>
      </section>

      {/* ─── Chapter 1：角色 ─── */}
      <section id="chapter-1" className="relative py-24 px-6 border-t border-white/8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16">
            <p className="text-[#C67B5C] text-xs font-black tracking-[0.4em] uppercase mb-3">Chapter 01</p>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4" style={serif}>核心法庭角色與職司解析</h2>
            <p className="text-gray-500 text-lg max-w-2xl leading-relaxed">
              在刑事法庭裡，每一個席位都對應著不同的程序功能。
              理解角色分工，是理解整場審判如何運作的第一步。
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            {/* 法庭座位示意圖 */}
            <div className="hidden lg:flex sticky top-28 flex-col items-center justify-between p-10 bg-white/[0.03] border border-white/8 rounded-3xl min-h-[480px]">
              <div className="w-full flex justify-center pb-6 border-b border-white/8">
                <div className="flex flex-col items-center gap-1.5">
                  <Gavel className="text-blue-400" size={32} />
                  <span className="text-xs tracking-widest text-blue-400 font-bold uppercase">法臺 ／ 合議庭</span>
                </div>
              </div>
              <div className="w-full flex justify-between items-center py-8">
                <div className="flex flex-col items-center gap-1.5 border-r border-white/10 pr-8">
                  <Shield className="text-emerald-400" size={26} />
                  <span className="text-xs text-emerald-400 font-bold">辯護席</span>
                  <User className="text-gray-400 mt-2" size={22} />
                  <span className="text-xs text-gray-400 font-bold">被告席</span>
                </div>
                <div className="flex flex-col items-center gap-1.5 bg-[#C67B5C]/10 border border-[#C67B5C]/20 rounded-2xl p-4">
                  <User className="text-[#C67B5C]" size={26} />
                  <span className="text-xs text-[#C67B5C] font-bold text-center">應訊臺<br/>（證人席）</span>
                </div>
                <div className="flex flex-col items-center gap-1.5 border-l border-white/10 pl-8">
                  <Scale className="text-purple-400" size={26} />
                  <span className="text-xs text-purple-400 font-bold">檢察官席</span>
                </div>
              </div>
              <div className="w-full flex justify-center pt-6 border-t border-white/8">
                <div className="flex items-center gap-3 text-amber-400/60">
                  <FileText size={18} />
                  <span className="text-xs tracking-widest font-bold uppercase">書記席・通譯・法警</span>
                </div>
              </div>
              <p className="text-[10px] text-gray-700 tracking-widest mt-4 uppercase">法庭空間抽象示意圖</p>
            </div>

            {/* 角色卡片 */}
            <div className="space-y-4">
              <p className="text-xs text-gray-600 uppercase tracking-widest mb-4">點擊角色卡片查看詳細職司說明</p>
              {roles.map(r => <RoleCard key={r.id} {...r} />)}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Chapter 2：審理進程 ─── */}
      <section id="chapter-2" className="relative py-24 px-6 bg-white/[0.02] border-y border-white/8">
        <div className="max-w-5xl mx-auto">
          <div className="mb-16">
            <p className="text-[#C67B5C] text-xs font-black tracking-[0.4em] uppercase mb-3">Chapter 02</p>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4" style={serif}>審理進程與階段任務</h2>
            <p className="text-gray-500 text-lg max-w-2xl leading-relaxed">
              刑事審判不是混亂的言語攻防，而是一套有順序、有節點的程序。
              對旁聽者來說，最重要的第一件事，是辨識法庭現在走到哪一步。
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-5 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent" />
            <div className="space-y-4">
              {stages.map((s, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.55, delay: i * 0.07 }}>
                  <button
                    onClick={() => setOpenStage(openStage === i ? null : i)}
                    className={`w-full text-left pl-14 pr-6 py-5 rounded-2xl border transition-all relative
                      ${openStage === i ? `bg-white/5 ${s.accent} border-opacity-40` : 'border-white/5 bg-black/20 hover:bg-white/[0.03] hover:border-white/10'}
                      ${s.isCore ? 'ring-1 ring-[#C67B5C]/20' : ''}`}
                  >
                    <div className={`absolute left-4 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full ${s.dot} shadow-lg`} />
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-3 mb-1.5">
                          <span className={`text-[11px] font-black tracking-widest uppercase ${s.color}`}>{s.tag}</span>
                          {s.isCore && <span className="text-[10px] font-black bg-[#C67B5C]/20 text-[#C67B5C] px-2 py-0.5 rounded-full">核心交鋒</span>}
                        </div>
                        <h3 className="text-lg font-black text-white" style={serif}>{s.label}</h3>
                        <p className="text-gray-500 text-sm mt-1">{s.task}</p>
                      </div>
                      <ChevronDown size={16} className={`shrink-0 mt-1 text-gray-600 transition-transform duration-300 ${openStage === i ? 'rotate-180' : ''}`} />
                    </div>
                  </button>
                  <AnimatePresence>
                    {openStage === i && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.28 }} className="overflow-hidden">
                        <div className="pl-14 pr-6 py-5 ml-px border-l border-white/5">
                          <p className="text-gray-300 leading-relaxed text-base mb-4">{s.detail}</p>
                          <div className="flex items-start gap-2 bg-white/[0.03] border border-white/8 rounded-xl px-4 py-3">
                            <BookOpen size={13} className="text-gray-600 mt-0.5 shrink-0" />
                            <p className="text-gray-600 text-xs leading-relaxed">{s.tip}</p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Chapter 3：交互詰問 ─── */}
      <section id="chapter-3" className="relative py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="mb-16">
            <p className="text-[#C67B5C] text-xs font-black tracking-[0.4em] uppercase mb-3">Chapter 03</p>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4" style={serif}>發現真實的交互詰問</h2>
            <p className="text-gray-500 text-lg max-w-2xl leading-relaxed">
              交互詰問，是刑事審判中最重要的證據檢驗機制之一。
              法庭之所以不只看書面資料，而要讓證人當庭接受提問，
              正是因為真實必須經得起追問、比對與檢驗。
            </p>
            <div className="mt-3">
              <CiteBadge label="詰問（法律百科）" href="https://www.legis-pedia.com/dictionary/3415" />
              <CiteBadge label="交互詰問（法律百科）" href="https://www.legis-pedia.com/dictionary/4809" />
            </div>
          </div>

          {/* 3A：兩道防線 */}
          <h3 className="text-2xl font-black text-white mb-6" style={serif}>作證前的兩道程序防線</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-14">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.55 }} className="bg-black/50 border border-white/8 p-7 rounded-2xl">
              <div className="flex items-center gap-3 mb-4">
                <EarOff className="text-[#C67B5C]" size={28} />
                <div>
                  <h4 className="text-lg font-black text-white" style={serif}>隔離訊問</h4>
                  <span className="text-[10px] text-gray-500 uppercase tracking-widest">Sequestration</span>
                </div>
              </div>
              <p className="text-gray-400 leading-relaxed text-sm mb-3">
                <span className="text-gray-200 font-bold">防止證詞污染的資訊防火牆。</span>
                <br />
                尚未作證的證人通常需在庭外等候，避免先聽見其他人的陳述後再調整自己的說法，降低記憶受到暗示或串供的風險。
              </p>
              <SourceQuote
                quote="人的記憶會受時間、壓力、暗示與外在資訊影響，因此法律為證人作證設下多道程序防線。"
                source="觀庭共構筆記計畫整理"
                href="#"
              />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.55, delay: 0.12 }} className="bg-black/50 border border-white/8 p-7 rounded-2xl">
              <div className="flex items-center gap-3 mb-4">
                <PenTool className="text-blue-400" size={28} />
                <div>
                  <h4 className="text-lg font-black text-white" style={serif}>具結程序</h4>
                  <span className="text-[10px] text-gray-500 uppercase tracking-widest">The Affirmation</span>
                </div>
              </div>
              <p className="text-gray-400 leading-relaxed text-sm">
                <span className="text-gray-200 font-bold">真實義務的法律承諾。</span>
                <br />
                證人作證前，依法須進行具結，承諾「據實陳述，絕無匿、飾、增、減」。
                完成具結後，若有虛偽陳述，將面臨偽證罪的刑事處罰。
              </p>
            </motion.div>
          </div>

          {/* 3B：四回合 */}
          <h3 className="text-2xl font-black text-white mb-2" style={serif}>交互詰問的四個回合</h3>
          <p className="text-gray-500 text-sm mb-8">同一名證人出庭後，通常會依一定順序接受雙方提問。</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-12">
            {crossExamRounds.map((r, i) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.07 }} className={`${r.bg} border ${r.border} p-7 rounded-2xl`}>
                <div className="flex items-start justify-between mb-3">
                  <span className="text-3xl font-black text-white/10 leading-none">{r.num}</span>
                  <span className={`text-[10px] border font-black px-2.5 py-1 rounded-full ${r.ruleColor}`}>{r.rule}</span>
                </div>
                <h4 className={`text-lg font-black mb-0.5 ${r.color}`} style={serif}>{r.title}</h4>
                <p className="text-xs text-gray-600 mb-3">{r.en} ／ {r.by}</p>
                <p className="text-gray-300 text-sm leading-relaxed mb-3">{r.purpose}</p>
                <p className="text-gray-600 text-xs leading-relaxed">{r.note}</p>
                {r.cite && <div className="mt-3"><CiteBadge label={r.cite.label} href={r.cite.href} /></div>}
              </motion.div>
            ))}
          </div>

          {/* 3C：誘導詰問 */}
          <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-7 mb-12">
            <div className="flex items-center gap-3 mb-4">
              <HelpCircle size={20} className="text-amber-400 shrink-0" />
              <h4 className="font-black text-white text-base">什麼是誘導詰問？</h4>
              <CiteBadge label="誘導詰問（法律百科）" href="https://www.legis-pedia.com/dictionary/3421" />
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              誘導詰問是指，發問的人對受詰問者暗示希望得到的回答，在問題中就已經包含答案——讓對方依照問題的暗示內容作答，而非獨立回憶。
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-red-500/5 border border-red-500/15 rounded-xl p-4">
                <p className="text-red-400 text-xs font-black uppercase tracking-wider mb-2">誘導詰問範例</p>
                <p className="text-gray-400 text-sm italic">「你當時有看到被告在案發當天晚上七點到被害人住的社區，對吧？」</p>
                <p className="text-gray-600 text-xs mt-2">—— 問題中已預設了「時間」、「地點」、「對象」三個事實。</p>
              </div>
              <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-xl p-4">
                <p className="text-emerald-400 text-xs font-black uppercase tracking-wider mb-2">非誘導詰問範例</p>
                <p className="text-gray-400 text-sm italic">「你當天晚上看到了什麼？」</p>
                <p className="text-gray-600 text-xs mt-2">—— 開放式提問，由證人自己回憶與陳述。</p>
              </div>
            </div>
          </div>

          {/* 3D：異議 */}
          <div className="relative overflow-hidden bg-black/40 border border-[#8B2E2E]/30 rounded-2xl p-7">
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#8B2E2E] rounded-full blur-3xl opacity-10 -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="flex items-center gap-3 mb-4">
              <ShieldAlert className="text-[#8B2E2E]" size={28} />
              <h4 className="text-lg font-black text-white" style={serif}>異議：程序中的即時防線</h4>
              <span className="text-[10px] text-gray-500 uppercase tracking-widest">Objection</span>
            </div>
            <p className="text-gray-400 leading-relaxed text-sm mb-4">
              當一方認為對方的提問或回答違反規則時，可以立即提出異議。
              異議不是單純的打斷，而是法庭程序中的防守機制。
              異議提出後，審判長應即時處理；在裁定前，證人原則上應暫停回答。
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-2">
              {['誘導詰問', '傳聞證據', '問題超出範圍', '重複詰問', '問題不明確', '假設性問題'].map(tag => (
                <span key={tag} className="text-xs text-gray-500 bg-white/[0.03] border border-white/8 px-3 py-1.5 rounded-lg text-center">{tag}</span>
              ))}
            </div>
            <p className="text-gray-700 text-xs mt-3">常見異議事由（不限於此）</p>
          </div>
        </div>
      </section>

      {/* ─── Chapter 4：觀庭方法 ─── */}
      <section id="chapter-4" className="relative py-24 px-6 bg-white/[0.02] border-t border-white/8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <p className="text-[#C67B5C] text-xs font-black tracking-[0.4em] uppercase mb-3">Chapter 04</p>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4" style={serif}>旁聽時的閱讀方法</h2>
            <p className="text-gray-500 text-lg leading-relaxed">
              當你真正坐進法庭，不一定需要背出所有程序名稱，
              但可以先抓住這五個觀察方向。
            </p>
          </div>

          <div className="space-y-3 mb-14">
            {observeQuestions.map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45, delay: i * 0.06 }}>
                <button
                  onClick={() => setOpenQ(openQ === i ? null : i)}
                  className={`w-full text-left border rounded-2xl transition-all ${openQ === i ? 'bg-white/5 border-white/15' : 'bg-black/20 border-white/5 hover:bg-white/[0.03] hover:border-white/10'}`}
                >
                  <div className="flex items-center gap-5 px-7 py-5">
                    <span className="text-2xl font-black text-[#C67B5C]/30 italic leading-none shrink-0">0{i + 1}</span>
                    <span className="text-base md:text-lg text-gray-200 font-bold flex-1 text-left leading-snug">{item.q}</span>
                    <ChevronDown size={16} className={`shrink-0 text-gray-600 transition-transform duration-300 ${openQ === i ? 'rotate-180' : ''}`} />
                  </div>
                </button>
                <AnimatePresence>
                  {openQ === i && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.28 }} className="overflow-hidden">
                      <div className="px-7 pb-6 pt-2 border-x border-b border-white/8 rounded-b-2xl -mt-1 bg-white/[0.02]">
                        <p className="text-gray-400 leading-relaxed text-base pl-[3.25rem]">{item.a}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          {/* 摘要卡 + 進入觀庭 CTA */}
          <motion.div
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="bg-gradient-to-br from-[#C67B5C]/10 via-black/40 to-black/60 border border-[#C67B5C]/20 rounded-3xl p-8 md:p-10"
          >
            <div className="flex items-center gap-3 mb-6">
              <BookOpen size={20} className="text-[#C67B5C]" />
              <h4 className="font-black text-white text-lg" style={serif}>觀庭前複習摘要</h4>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              {[
                ['法官', '根據合法調查的證據裁判，不預設立場'],
                ['檢察官', '承擔舉證責任，客觀義務不允許偏頗'],
                ['辯護人', '不是幫壞人脫罪，而是確保程序正義'],
                ['證人', '只陳述親身見聞，接受詰問檢驗'],
                ['主詰問', '建立敘事，禁止誘導'],
                ['反詰問', '壓力測試，允許誘導'],
              ].map(([t, d]) => (
                <div key={t} className="bg-white/[0.03] border border-white/8 rounded-xl p-4">
                  <p className="text-[#C67B5C] text-xs font-black uppercase tracking-wider mb-1">{t}</p>
                  <p className="text-gray-400 text-sm leading-relaxed">{d}</p>
                </div>
              ))}
            </div>
            <Link
              href="/sessions"
              className="flex items-center justify-center gap-3 w-full bg-[#C67B5C] hover:bg-[#b86b4d] text-white font-black py-4 px-8 rounded-2xl transition-colors text-base tracking-wide"
            >
              完成！現在進入觀庭還原筆記 <ChevronRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ─── 頁尾聲明 ─── */}
      <footer className="relative py-16 px-6 border-t border-white/8">
        <div className="max-w-4xl mx-auto space-y-10">
          <div className="bg-white/[0.02] border border-white/8 rounded-2xl p-7">
            <div className="flex items-start gap-3 mb-3">
              <AlertCircle size={16} className="text-gray-600 mt-0.5 shrink-0" />
              <p className="text-gray-600 text-xs font-black uppercase tracking-widest">教學聲明與使用邊界</p>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              本頁面內容為刑事法庭程序與觀庭基礎知識之一般性教學整理，目的在於協助讀者理解法庭中的角色分工、
              程序節奏與證據檢驗方式。內容不構成個案法律意見，具體案件之審理方式仍應以適用法令、法院裁定、
              個案情形及審判長之訴訟指揮為準。
            </p>
          </div>

          <div>
            <p className="text-gray-600 text-xs font-black uppercase tracking-widest mb-5">引述與延伸閱讀來源</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                { label: '合議庭', href: 'https://www.legis-pedia.com/dictionary/3822' },
                { label: '檢察官', href: 'https://www.legis-pedia.com/dictionary/3731' },
                { label: '辯護人', href: 'https://www.legis-pedia.com/dictionary/303' },
                { label: '證人義務與拒絕證言（上）', href: 'https://www.legis-pedia.com/article/remedy-procedure/837' },
                { label: '證人義務與拒絕證言（下）', href: 'https://www.legis-pedia.com/article/remedy-procedure/838' },
                { label: '詰問', href: 'https://www.legis-pedia.com/dictionary/3415' },
                { label: '主詰問', href: 'https://www.legis-pedia.com/dictionary/792' },
                { label: '反詰問', href: 'https://www.legis-pedia.com/dictionary/3417' },
                { label: '誘導詰問', href: 'https://www.legis-pedia.com/dictionary/3421' },
                { label: '交互詰問', href: 'https://www.legis-pedia.com/dictionary/4809' },
                { label: '無罪答辯', href: 'https://www.legis-pedia.com/dictionary/180' },
                { label: '論告（司法院辭典）', href: 'https://terms.judicial.gov.tw/TermContent.aspx?TRMTERM=%E8%AB%96%E5%91%8A&SYS=M' },
              ].map(s => (
                <a key={s.href} href={s.href} target="_blank" rel="noreferrer"
                   className="flex items-center gap-2 text-gray-600 hover:text-gray-300 text-xs transition-colors py-1.5 border-b border-white/[0.04]">
                  <ExternalLink size={10} className="shrink-0" />
                  {s.label}
                  <span className="text-gray-800 ml-auto text-[10px]">法律百科 / 司法院</span>
                </a>
              ))}
            </div>
          </div>

          <div className="text-center pt-4 space-y-3">
            <p className="text-gray-700 text-xs tracking-widest uppercase">觀庭還原筆記共構平台</p>
            <Link
              href="/sessions"
              className="inline-flex items-center gap-2 text-[#C67B5C] hover:text-white text-sm font-black transition-colors"
            >
              前往還原筆記工作台 <ChevronRight size={14} />
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
