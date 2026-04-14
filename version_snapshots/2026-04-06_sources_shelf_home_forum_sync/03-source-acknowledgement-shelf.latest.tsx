'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ExternalLink, FileText, HeartHandshake, Users } from 'lucide-react';
import { FadeIn } from '@/components/ui-shared';

const serif = { fontFamily: "'Noto Serif TC', serif" };

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

function renderSourceAcknowledgementShelf(panelId: (typeof sourceAcknowledgementPanels)[number]['id']) {
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
                <p className="mt-2 text-[17px] font-black text-[#2D2A26]" style={serif}>
                  {name}
                </p>
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

type SourceAcknowledgementShelfProps = {
  sectionId?: string;
  title?: string;
  description?: string;
  className?: string;
};

export default function SourceAcknowledgementShelf({
  sectionId,
  title = '本計畫資料來源與鳴謝',
  description = '本計畫是民眾與專業合作之結果，以下整理團隊介紹、特別鳴謝，以及各場次還原筆記的資料來源與協力整理脈絡。',
  className = '',
}: SourceAcknowledgementShelfProps) {
  const [sourcePanel, setSourcePanel] = useState<(typeof sourceAcknowledgementPanels)[number]['id']>('team');

  return (
    <FadeIn>
      <motion.div
        id={sectionId}
        whileHover={{ y: -3 }}
        className={`scroll-mt-36 rounded-3xl border border-[#DDE6C8] bg-white p-6 shadow-sm transition-all hover:shadow-md md:p-8 ${className}`}
      >
        <div className="grid gap-5 xl:grid-cols-[0.88fr_1.12fr] xl:items-start">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#DDE6C8] bg-[#F9FBE7] px-4 py-2 text-[13px] font-black tracking-[0.14em] text-[#6B8E23]">
              <HeartHandshake size={14} />
              本計畫資料來源與鳴謝
            </div>
            <div className="mt-4 space-y-3">
              <h2 className="text-[36px] font-black leading-tight text-[#2D2A26]" style={serif}>
                {title}
              </h2>
              <p className="text-[16px] font-medium leading-[1.85] text-[#6B6358]">{description}</p>
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
  );
}
