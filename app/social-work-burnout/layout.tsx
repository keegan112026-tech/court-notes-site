import type { Metadata } from 'next';
import { PRESENTATION_SUBTITLE, PRESENTATION_TITLE } from '@/data/presentations/social-work-burnout';

export const metadata: Metadata = {
  title: `${PRESENTATION_TITLE} | 互動式教學簡報`,
  description: PRESENTATION_SUBTITLE,
  alternates: {
    canonical: '/social-work-burnout',
  },
  openGraph: {
    title: PRESENTATION_TITLE,
    description: PRESENTATION_SUBTITLE,
    url: 'https://court-notes-site.vercel.app/social-work-burnout',
    type: 'article',
    locale: 'zh_TW',
  },
  twitter: {
    card: 'summary_large_image',
    title: PRESENTATION_TITLE,
    description: PRESENTATION_SUBTITLE,
  },
};

export default function SocialWorkBurnoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
