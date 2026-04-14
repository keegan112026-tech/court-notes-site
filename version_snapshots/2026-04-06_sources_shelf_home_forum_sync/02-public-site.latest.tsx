import type { LucideIcon } from 'lucide-react';
import { BookOpen, FileText, Gavel, Layers, MessageCircle, Send, ShieldAlert } from 'lucide-react';

export const SITE_NAME = '觀庭還原筆記共構平台';
export const SITE_TAGLINE = 'SOCIAL WORK COURT NOTES';
export const SITE_DESCRIPTION =
  '提供相對還原的法庭現場筆記、法庭知能與共構論述，降低大眾理解司法與社工實務的門檻。';
export const SITE_TITLE_SUFFIX = '社工共構觀庭筆記平台';
export const GUIDE_PAGE_NAME = '平台限制與規範';
export const BETA_NOTICE = '目前為 Beta 前導測試版，系統建置與數據對接中';
export const TEAM_BLURB = '本團隊由助人專業與民眾共同組成，利用公餘時間維護平台。';
export const COPYRIGHT_NOTICE = '© 2026 觀庭還原筆記共構平台';

export type PublicNavItem = {
  name: string;
  href: string;
  icon: LucideIcon;
  homeIconClass: string;
};

export const PUBLIC_NAV_ITEMS: PublicNavItem[] = [
  { name: '計畫緣起', href: '/about', icon: BookOpen, homeIconClass: 'w-5 h-5 text-[#8B4D35]' },
  { name: GUIDE_PAGE_NAME, href: '/guide', icon: ShieldAlert, homeIconClass: 'w-5 h-5 text-[#7B8C4E]' },
  { name: '先備知識', href: '/knowledge', icon: Layers, homeIconClass: 'w-5 h-5 text-[#6B5CA5]' },
  { name: '還原筆記', href: '/sessions', icon: Gavel, homeIconClass: 'w-5 h-5 text-[#C67B5C]' },
  { name: '鳴謝與資料來源', href: '/#sources-acknowledgements', icon: FileText, homeIconClass: 'w-5 h-5 text-[#B8860B]' },
  { name: '觀庭筆記匯集區', href: '/forum', icon: MessageCircle, homeIconClass: 'w-5 h-5 text-[#5A6F35]' },
  { name: '聯絡我們', href: '/contact', icon: Send, homeIconClass: 'w-5 h-5 text-[#2D2A26]' },
];

export const FOOTER_NAV_ITEMS = PUBLIC_NAV_ITEMS.filter((item) => item.href !== '/contact');
