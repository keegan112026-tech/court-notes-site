import type { Metadata } from 'next';
import React from 'react';
import InternalRouteBanner from '@/components/InternalRouteBanner';

export const metadata: Metadata = {
    robots: {
        index: false,
        follow: false,
    },
};

export default function SessionsHistoryLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <InternalRouteBanner
                label="Internal Archive"
                description="這是歷史版面參考頁，供回溯與對照使用，不屬於正式網站資訊架構。"
            />
            {children}
        </>
    );
}
