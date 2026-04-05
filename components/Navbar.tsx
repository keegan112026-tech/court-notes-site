'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, PenTool } from 'lucide-react';
import { PUBLIC_NAV_ITEMS, SITE_NAME } from '@/lib/public-site';

export default function Navbar() {
    const pathname = usePathname();

    return (
        <nav className="fixed inset-x-0 top-0 z-50 flex items-center justify-between border-b border-[#EBE7E0] bg-white/95 px-4 py-3 shadow-sm backdrop-blur lg:px-12">
            <Link href="/" className="flex items-center gap-2">
                <div className="rounded-xl bg-[#6B8E23] p-1.5 text-white shadow-md">
                    <PenTool size={20} />
                </div>
                <div>
                    <h1 className="text-xl font-black tracking-tighter text-[#2D2A26]">{SITE_NAME}</h1>
                    <p className="text-[10px] font-bold tracking-[0.22em] text-gray-400">SOCIAL WORK COURT NOTES</p>
                </div>
            </Link>

            <div className="hidden items-center gap-6 lg:flex">
                {PUBLIC_NAV_ITEMS.filter((link) => link.href !== '/contact').map((link) => {
                    const active = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`text-sm font-bold transition-colors hover:text-[#6B8E23] ${
                                active ? 'text-[#6B8E23]' : 'text-gray-500'
                            }`}
                        >
                            {link.name}
                        </Link>
                    );
                })}
            </div>

            <div className="flex items-center gap-4">
                <Link href="/contact" className="hidden text-xs font-bold text-gray-500 hover:text-[#6B8E23] lg:block">
                    聯絡與回報
                </Link>
                <Link
                    href="/sessions"
                    className="rounded-full bg-[#6B8E23] px-6 py-2 text-xs font-black text-white shadow-[0_4px_15px_rgba(107,142,35,0.4)] transition-all hover:scale-105 hover:bg-[#5a781d]"
                >
                    前往還原筆記
                </Link>
                <button className="lg:hidden" aria-label="Open menu">
                    <Menu size={24} className="text-gray-600" />
                </button>
            </div>
        </nav>
    );
}
