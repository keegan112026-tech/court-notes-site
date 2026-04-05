'use client';

import Link from 'next/link';
import React from 'react';
import { ArrowLeft } from 'lucide-react';

const serif = { fontFamily: "'Noto Serif TC', serif" };

type WorkbenchHeaderProps = {
    backHref: string;
    backLabel: string;
    eyebrow: string;
    title: string;
    subtitle: string;
    actions?: React.ReactNode;
};

export default function WorkbenchHeader({
    backHref,
    backLabel,
    eyebrow,
    title,
    subtitle,
    actions,
}: WorkbenchHeaderProps) {
    return (
        <header className="z-10 shrink-0 border-b border-[#E8E0D4] bg-white shadow-sm">
            <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 lg:px-8 lg:py-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div className="space-y-3">
                        <Link
                            href={backHref}
                            className="inline-flex items-center gap-2 rounded-full border border-gray-100 bg-gray-50 px-4 py-2 text-sm font-bold text-gray-500 shadow-sm transition-colors hover:text-[#6B8E23]"
                        >
                            <ArrowLeft size={16} />
                            {backLabel}
                        </Link>

                        <div className="space-y-2">
                            <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[#8A8078]">
                                {eyebrow}
                            </p>
                            <h1 className="text-[28px] font-black leading-tight text-[#2D2A26] md:text-[34px]" style={serif}>
                                {title}
                            </h1>
                            <p className="max-w-3xl text-[14px] font-medium leading-7 text-[#6B6358] md:text-[15px]">
                                {subtitle}
                            </p>
                        </div>
                    </div>

                    {actions ? (
                        <div className="flex flex-wrap items-center gap-3 lg:justify-end">
                            {actions}
                        </div>
                    ) : null}
                </div>
            </div>
        </header>
    );
}
