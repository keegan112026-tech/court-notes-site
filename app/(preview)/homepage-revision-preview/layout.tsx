import type { Metadata } from 'next';
import React from 'react';
import InternalRouteBanner from '@/components/InternalRouteBanner';

export const metadata: Metadata = {
    robots: {
        index: false,
        follow: false,
    },
};

export default function HomepageRevisionPreviewLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <InternalRouteBanner
                label="Internal Preview"
                description="這是首頁大改前的簡易示範頁，只用來確認版位、節奏與區塊銜接，不代表正式內容已定稿。"
            />
            {children}
        </>
    );
}
