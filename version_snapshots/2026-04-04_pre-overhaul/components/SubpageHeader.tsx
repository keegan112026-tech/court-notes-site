'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, Gavel, Layers, MessageCircle, PenTool, Send, ShieldAlert } from 'lucide-react';

const navLinks = [
    { name: '計畫緣起', href: '/about', icon: <BookOpen size={18} /> },
    { name: '平台使用說明與規範', href: '/guide', icon: <ShieldAlert size={18} /> },
    { name: '先備知識', href: '/knowledge', icon: <Layers size={18} /> },
    { name: '還原筆記', href: '/sessions', icon: <Gavel size={18} /> },
    { name: '論壇交流', href: '/forum', icon: <MessageCircle size={18} /> },
    { name: '聯絡我們', href: '/contact', icon: <Send size={18} /> },
];

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
                    目前為 Beta 前導測試版，系統建置與數據對接中
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
                                <h1 className={`text-[18px] font-black tracking-tight lg:text-[20px] ${dark ? 'text-[#F3ECE1]' : 'text-[#2D2A26]'}`}>法庭實況還原與專業共構筆記</h1>
                                <p className={`text-[10px] font-black tracking-[0.24em] ${dark ? 'text-[#B6AA9A]' : 'text-[#A09888]'}`}>SOCIAL WORK COURT NOTES</p>
                            </div>
                        </Link>

                        <div className="hidden items-center gap-1 lg:flex">
                            {navLinks.map((link) => {
                                const active = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
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
                                        <span className={dark ? (active ? 'text-[#C6DB8C]' : 'text-[#B89B7D]') : (active ? 'text-[#6B8E23]' : 'text-[#8B7A63]')}>{link.icon}</span>
                                        {link.name}
                                    </Link>
                                );
                            })}
                        </div>

                        <Link
                            href="/sessions"
                            className="shrink-0 rounded-2xl bg-gradient-to-r from-[#7B8C4E] to-[#5A6F35] px-5 py-3 text-[15px] font-black text-white shadow-[0_10px_24px_rgba(123,140,78,0.25)] transition-all hover:scale-[1.02]"
                        >
                            我要投稿 ✍️
                        </Link>
                    </div>
                </nav>
            </div>
            <div aria-hidden="true" className="h-[106px] md:h-[108px]" />
        </>
    );
}
