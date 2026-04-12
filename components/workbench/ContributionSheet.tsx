'use client';

import React from 'react';
import Link from 'next/link';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';

const serif = { fontFamily: "'Noto Serif TC', serif" };

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    isMobileLayout: boolean;
    onStartWriting: () => void;
}

export default function ContributionSheet({ open, onOpenChange, isMobileLayout, onStartWriting }: Props) {
    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent
                side="bottom"
                className="max-h-[85dvh] overflow-y-auto rounded-t-3xl border-t border-[#DDE6C8] bg-white px-6 py-8"
            >
                <SheetHeader className="mb-6 text-left">
                    <SheetTitle
                        className="text-[24px] font-black text-[#2D2A26]"
                        style={serif}
                    >
                        書寫屬於你的觀庭筆記
                    </SheetTitle>
                </SheetHeader>
                <div className="space-y-4 text-[15px] font-medium leading-[1.9] text-[#5A5347]">
                    <p>
                        所有人都可以透過我們竭力還原的現場實錄，書寫自己的觀庭筆記，進行自己的理解與論述。
                    </p>
                    <p>
                        你可以一邊閱讀對話內容，一邊進行標註、書寫心得，進一步形成可公開發表的共構筆記。
                    </p>
                    <p>
                        筆記屬於個人，反思、感觸可以是論述、策論——我們沒有傾向，只要求去識別化、不洩漏個資。
                    </p>
                    <p className="rounded-xl border border-[#F0E5D8] bg-[#FFF8F2] px-4 py-3 text-[14px] text-[#8A7060]">
                        ＊設有審核機制，單純避免違法內容（辱罵、個資洩漏），不控制立場或觀點。
                    </p>
                </div>
                <div className="mt-8 flex flex-wrap gap-3">
                    <Link
                        href="/guide"
                        onClick={() => onOpenChange(false)}
                        className="inline-flex items-center gap-2 rounded-2xl bg-[#6B8E23] px-6 py-3 text-[15px] font-black text-white shadow-md transition-colors hover:bg-[#5a781d]"
                    >
                        查看投稿說明
                    </Link>
                    <button
                        onClick={() => {
                            onOpenChange(false);
                            if (isMobileLayout) onStartWriting();
                        }}
                        className="rounded-2xl border border-[#DDE6C8] bg-[#F4FAEB] px-6 py-3 text-[15px] font-black text-[#5A6F35] transition-colors hover:bg-[#E8F5D0]"
                    >
                        {isMobileLayout ? '直接開始書寫' : '關閉'}
                    </button>
                </div>
            </SheetContent>
        </Sheet>
    );
}
