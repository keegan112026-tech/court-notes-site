import React from 'react';

export const SectionBanner = ({ title, subtitle, bgClass, textClass }) => (
    <div className={`w-full py-10 md:py-12 border-b border-black/5 ${bgClass}`}>
        <div className="max-w-6xl mx-auto px-4 lg:px-8 text-center md:text-left">
            <h3 className={`text-2xl md:text-3xl lg:text-4xl font-black tracking-wide ${textClass}`}>
                {title}
            </h3>
            {subtitle && (
                <p className={`font-bold uppercase tracking-[0.2em] text-xs md:text-sm mt-3 opacity-80 ${textClass}`}>
                    {subtitle}
                </p>
            )}
        </div>
    </div>
);
