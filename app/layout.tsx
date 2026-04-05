import type { Metadata } from 'next';
import { Toaster } from 'sonner';
import './globals.css';
import { SITE_DESCRIPTION, SITE_NAME, SITE_TITLE_SUFFIX } from '@/lib/public-site';

const siteUrl = 'https://court-notes-site.vercel.app';

export const metadata: Metadata = {
    metadataBase: new URL(siteUrl),
    title: `${SITE_NAME} | ${SITE_TITLE_SUFFIX}`,
    description: SITE_DESCRIPTION,
    keywords: ['社工', '觀庭', '還原筆記', '共構平台', '法庭觀察', '兒少保護'],
    alternates: {
        canonical: '/',
    },
    openGraph: {
        type: 'website',
        url: siteUrl,
        title: SITE_NAME,
        description: SITE_DESCRIPTION,
        siteName: SITE_NAME,
        locale: 'zh_TW',
    },
    twitter: {
        card: 'summary_large_image',
        title: SITE_NAME,
        description: SITE_DESCRIPTION,
    },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="zh-TW">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;700;900&family=Noto+Serif+TC:wght@400;700;900&display=swap"
                    rel="stylesheet"
                />
            </head>
            <body style={{ fontFamily: "'Noto Sans TC', sans-serif" }}>
                {children}
                <Toaster
                    position="top-center"
                    richColors
                    closeButton
                    toastOptions={{
                        className: 'border border-[#E8E0D4] bg-white text-[#2D2A26]',
                    }}
                />
            </body>
        </html>
    );
}
