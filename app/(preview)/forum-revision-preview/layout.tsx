import type { Metadata } from 'next';
import React from 'react';
import InternalRouteBanner from '@/components/InternalRouteBanner';

export const metadata: Metadata = {
    robots: {
        index: false,
        follow: false,
    },
};

export default function ForumRevisionPreviewLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <InternalRouteBanner
                label="Internal Preview"
                description="這是觀庭筆記匯集區前導區的重構草圖，用來確認『先看規範，再進文章』是否適合正式站。"
            />
            {children}
        </>
    );
}
