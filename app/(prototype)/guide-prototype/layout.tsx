import type { Metadata } from 'next';
import React from 'react';
import InternalRouteBanner from '@/components/InternalRouteBanner';

export const metadata: Metadata = {
    robots: {
        index: false,
        follow: false,
    },
};

export default function GuidePrototypeLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <InternalRouteBanner
                label="Internal Prototype"
                description="這是內部 prototype 頁，供版型與內容測試使用，非正式資訊架構的一部分。"
            />
            {children}
        </>
    );
}
