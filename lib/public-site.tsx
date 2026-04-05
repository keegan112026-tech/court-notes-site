import type { LucideIcon } from 'lucide-react';
import { BookOpen, Gavel, Layers, MessageCircle, Send, ShieldAlert, Trophy } from 'lucide-react';

export const SITE_NAME = '觀庭還原筆記共構平台';
export const SITE_TAGLINE = 'SOCIAL WORK COURT NOTES';
export const SITE_DESCRIPTION =
  '以社工觀庭與公開共構為核心，整理可閱讀、可追索、可持續更新的法庭還原筆記與專業文章。';
export const SITE_TITLE_SUFFIX = '社工觀庭與公開共構平台';
export const GUIDE_PAGE_NAME = '平台限制與規範';
export const BETA_NOTICE = '本站目前為 Beta 測試版，內容與版型仍會持續調整。';
export const TEAM_BLURB = '本團隊由助人專業與民眾共同組成，利用公餘時間維護平台。';
export const COPYRIGHT_NOTICE = '© 2026 觀庭還原筆記共構平台 ｜ 系統持續整理與更新中';

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
  { name: '熱門排行', href: '/rankings', icon: Trophy, homeIconClass: 'w-5 h-5 text-[#C67B5C]' },
  { name: '論壇交流', href: '/forum', icon: MessageCircle, homeIconClass: 'w-5 h-5 text-[#5A6F35]' },
  { name: '聯絡我們', href: '/contact', icon: Send, homeIconClass: 'w-5 h-5 text-[#2D2A26]' },
];

export const FOOTER_NAV_ITEMS = PUBLIC_NAV_ITEMS.filter((item) => item.href !== '/contact');
