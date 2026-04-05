import type { Metadata } from 'next';
import React from 'react';
import InternalRouteBanner from '@/components/InternalRouteBanner';

export const metadata: Metadata = {
    robots: {
        index: false,
        follow: false,
    },
};

export default function ProjectIntentionPrototypeLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <InternalRouteBanner
                label="Internal Prototype"
                description="這是內部 prototype 頁，供敘事與視覺方向測試使用，非正式資訊架構的一部分。"
            />
            {children}
        </>
    );
}
