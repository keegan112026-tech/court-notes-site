import type { Metadata } from 'next';
import React from 'react';
import InternalRouteBanner from '@/components/InternalRouteBanner';

export const metadata: Metadata = {
    robots: {
        index: false,
        follow: false,
    },
};

export default function Demo2Layout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <InternalRouteBanner
                label="Internal Demo"
                description="這是內部 demo 頁，供功能或樣式測試使用，不屬於正式網站內容。"
            />
            {children}
        </>
    );
}
