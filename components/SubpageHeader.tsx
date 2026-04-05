'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, PenTool } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { BETA_NOTICE, PUBLIC_NAV_ITEMS, SITE_NAME, SITE_TAGLINE } from '@/lib/public-site';

type SubpageHeaderProps = {
    variant?: 'light' | 'dark';
};

export default function SubpageHeader({ variant = 'light' }: SubpageHeaderProps) {
    const pathname = usePathname();
    const dark = variant === 'dark';

    return (
        <>
            <div className="fixed inset-x-0 top-0 z-50">
                <div className="bg-gradient-to-r from-[#6E8240] via-[#7B8C4E] to-[#8A9A58] px-4 py-2 text-center text-[14px] font-black tracking-wide text-white shadow-sm">
                    <span className="mr-2 inline-block h-3 w-3 rounded-full bg-[#D8D07A] align-middle" />
                    {BETA_NOTICE}
                </div>
                <nav
                    className={`px-4 py-3 lg:px-10 ${
                        dark
                            ? 'border-b border-[#A7B67A]/18 bg-[linear-gradient(180deg,rgba(122,140,78,0.96),rgba(96,112,59,0.96))] shadow-[0_8px_18px_rgba(0,0,0,0.14)]'
                            : 'border-b border-[#E8E0D4] bg-[#FBF7F0] shadow-[0_4px_12px_rgba(45,42,38,0.06)]'
                    }`}
                >
                    <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
                        <Link href="/" className="flex items-center gap-3">
                            <div className="rounded-2xl bg-gradient-to-br from-[#7B8C4E] to-[#5A6F35] p-2.5 text-white shadow-md">
                                <PenTool size={20} />
                            </div>
                            <div className="leading-tight">
                                <h1 className={`text-[18px] font-black tracking-tight lg:text-[20px] ${dark ? 'text-[#F3ECE1]' : 'text-[#2D2A26]'}`}>
                                    {SITE_NAME}
                                </h1>
                                <p className={`text-[10px] font-black tracking-[0.24em] ${dark ? 'text-[#B6AA9A]' : 'text-[#A09888]'}`}>
                                    {SITE_TAGLINE}
                                </p>
                            </div>
                        </Link>

                        <div className="hidden flex-1 items-center justify-end gap-1 lg:flex">
                            {PUBLIC_NAV_ITEMS.map((link) => {
                                const active = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
                                const Icon = link.icon;

                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-[15px] font-black transition-all ${
                                            dark
                                                ? active
                                                    ? 'bg-[#7B8C4E]/18 text-[#C6DB8C]'
                                                    : 'text-[#DDD0BF] hover:bg-white/8 hover:text-[#D7E8A3]'
                                                : active
                                                    ? 'bg-[#7B8C4E]/10 text-[#6B8E23]'
                                                    : 'text-[#5A5347] hover:bg-[#7B8C4E]/8 hover:text-[#6B8E23]'
                                        }`}
                                    >
                                        <span
                                            className={
                                                dark
                                                    ? active
                                                        ? 'text-[#C6DB8C]'
                                                        : 'text-[#B89B7D]'
                                                    : active
                                                        ? 'text-[#6B8E23]'
                                                        : 'text-[#8B7A63]'
                                            }
                                        >
                                            <Icon size={18} />
                                        </span>
                                        {link.name}
                                    </Link>
                                );
                            })}
                        </div>

                        <div className="lg:hidden">
                            <Sheet>
                                <SheetTrigger asChild>
                                    <button
                                        aria-label="開啟網站導覽"
                                        className={`rounded-xl p-2 transition-colors ${
                                            dark ? 'text-[#DDD0BF] hover:bg-white/10' : 'text-[#5A5347] hover:bg-[#7B8C4E]/10'
                                        }`}
                                    >
                                        <Menu size={24} />
                                    </button>
                                </SheetTrigger>
                                <SheetContent side="right" className="w-[280px] bg-[#FBF7F0] p-0">
                                    <div className="flex items-center gap-3 border-b border-[#E8E0D4] px-5 py-4">
                                        <div className="rounded-xl bg-gradient-to-br from-[#7B8C4E] to-[#5A6F35] p-2 text-white shadow-sm">
                                            <PenTool size={16} />
                                        </div>
                                        <span className="text-[15px] font-black text-[#2D2A26]">{SITE_NAME}</span>
                                    </div>
                                    <nav className="flex flex-col gap-1 px-3 py-3">
                                        {PUBLIC_NAV_ITEMS.map((link) => {
                                            const active = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
                                            const Icon = link.icon;

                                            return (
                                                <Link
                                                    key={link.href}
                                                    href={link.href}
                                                    className={`flex items-center gap-3 rounded-xl px-4 py-3 text-[15px] font-black transition-all ${
                                                        active
                                                            ? 'bg-[#7B8C4E]/12 text-[#6B8E23]'
                                                            : 'text-[#5A5347] hover:bg-[#7B8C4E]/8 hover:text-[#6B8E23]'
                                                    }`}
                                                >
                                                    <span className={active ? 'text-[#6B8E23]' : 'text-[#8B7A63]'}>
                                                        <Icon size={18} />
                                                    </span>
                                                    {link.name}
                                                </Link>
                                            );
                                        })}
                                    </nav>
                                </SheetContent>
                            </Sheet>
                        </div>
                    </div>
                </nav>
            </div>
            <div aria-hidden="true" className="h-[106px] md:h-[108px]" />
        </>
    );
}
