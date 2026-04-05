'use client';
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

/* ── FadeIn ── */
export const FadeIn = ({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) => (
    <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-30px' }}
        transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }} className={className}>{children}</motion.div>
);

/* ── Counter ── */
export function Counter({ target, suffix = '' }: { target: number; suffix?: string }) {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLSpanElement>(null);
    const [started, setStarted] = useState(false);
    useEffect(() => {
        const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStarted(true); }, { threshold: 0.5 });
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, []);
    useEffect(() => {
        if (!started) return;
        let cur = 0; const inc = target / 50;
        const t = setInterval(() => { cur += inc; if (cur >= target) { setCount(target); clearInterval(t); } else setCount(Math.floor(cur)); }, 30);
        return () => clearInterval(t);
    }, [started, target]);
    return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

/* ── TypeWriter ── */
export function TypeWriter({ texts, speed = 70 }: { texts: string[]; speed?: number }) {
    const [ti, setTi] = useState(0);
    const [ci, setCi] = useState(0);
    const [del, setDel] = useState(false);
    useEffect(() => {
        const cur = texts[ti];
        const t = setTimeout(() => {
            if (!del) { if (ci < cur.length) setCi(c => c + 1); else setTimeout(() => setDel(true), 2200); }
            else { if (ci > 0) setCi(c => c - 1); else { setDel(false); setTi(i => (i + 1) % texts.length); } }
        }, del ? speed / 2 : speed);
        return () => clearTimeout(t);
    }, [ci, del, ti, texts, speed]);
    return <>{texts[ti].substring(0, ci)}<motion.span animate={{ opacity: [1, 0] }} transition={{ duration: 0.5, repeat: Infinity }} className="text-[#C67B5C]">|</motion.span></>;
}

/* ── Banner ── */
export const Banner = ({ title, subtitle, bg, text }: { title: string; subtitle: string; bg: string; text: string }) => (
    <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
        className={`${bg} py-6 border-y border-black/5`}>
        <div className="max-w-7xl mx-auto px-6">
            <h3 className={`text-[28px] md:text-[36px] font-black ${text}`} style={{ fontFamily: "'Noto Serif TC', serif" }}>{title}</h3>
            <p className={`text-[13px] font-bold tracking-[0.25em] uppercase mt-1 opacity-60 ${text}`}>{subtitle}</p>
        </div>
    </motion.div>
);

/* ── WarmGradientBg ── */
export function WarmGradientBg() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%]"
                animate={{ rotate: 360 }} transition={{ duration: 80, repeat: Infinity, ease: 'linear' }}
                style={{ background: 'conic-gradient(from 0deg at 50% 50%, rgba(123,140,78,0.06) 0deg, rgba(198,123,92,0.05) 120deg, rgba(184,134,11,0.04) 240deg, rgba(123,140,78,0.06) 360deg)' }}
            />
            <div className="absolute top-10 right-20 w-56 h-56 bg-[#E3EED3]/30 rounded-full blur-[80px]" />
            <div className="absolute bottom-10 left-20 w-72 h-72 bg-[#F5E6D3]/30 rounded-full blur-[100px]" />
        </div>
    );
}

/* ── FontLoader ── */
export function FontLoader() {
    return (
        <>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;700;900&family=Noto+Serif+TC:wght@400;700;900&display=swap" rel="stylesheet" />
        </>
    );
}

/* ── LikeButton ── */
export function LikeButton({ targetId, targetType, initialCount = 0, size = 'sm' }: {
    targetId: string; targetType: 'transcripts' | 'interactions' | 'forum'; initialCount?: number; size?: 'sm' | 'md'
}) {
    const [count, setCount] = useState(initialCount);
    const [liked, setLiked] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem(`liked:${targetId}`);
        if (stored) setLiked(true);
    }, [targetId]);

    const handleLike = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (liked || loading) return;
        setLoading(true);
        try {
            const res = await fetch('/api/like', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ targetId, targetType }),
            });
            const data = await res.json();
            if (data.ok) {
                setCount(data.data.newCount);
                setLiked(true);
                localStorage.setItem(`liked:${targetId}`, '1');
            }
        } catch { /* silent */ } finally { setLoading(false); }
    };

    const cls = size === 'md'
        ? 'px-4 py-2 text-[16px] gap-2 rounded-xl'
        : 'px-3 py-1.5 text-[13px] gap-1.5 rounded-lg';

    return (
        <motion.button whileTap={{ scale: 0.9 }} onClick={handleLike} disabled={liked || loading}
            className={`inline-flex items-center font-bold border transition-all ${cls} ${liked
                ? 'bg-red-50 text-red-400 border-red-200 cursor-default'
                : 'bg-white/80 text-gray-400 border-gray-200 hover:text-red-400 hover:border-red-200 cursor-pointer'
                }`}>
            <span>{liked ? '❤️' : '🤍'}</span>
            <span>{count}</span>
        </motion.button>
    );
}
