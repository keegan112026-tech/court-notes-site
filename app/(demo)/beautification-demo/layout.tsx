import type { Metadata } from 'next';
import React from 'react';
import InternalRouteBanner from '@/components/InternalRouteBanner';

export const metadata: Metadata = {
    robots: {
        index: false,
        follow: false,
    },
};

export default function BeautificationDemoLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <InternalRouteBanner
                label="Internal Demo"
                description="這是內部 demo 頁，供視覺或互動實驗使用，不屬於正式網站內容。"
            />
            {children}
        </>
    );
}
