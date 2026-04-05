import React from 'react';

type InternalRouteBannerProps = {
    label: string;
    description: string;
};

export default function InternalRouteBanner({ label, description }: InternalRouteBannerProps) {
    return (
        <div className="border-b border-[#E8DCC7] bg-[#FFF8EF] px-4 py-3 text-[#7A5C3D] shadow-sm">
            <div className="mx-auto flex max-w-7xl flex-col gap-1 md:flex-row md:items-center md:justify-between">
                <p className="text-[12px] font-black uppercase tracking-[0.22em]">{label}</p>
                <p className="text-[14px] font-bold leading-relaxed">{description}</p>
            </div>
        </div>
    );
}
