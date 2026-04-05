'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LockKeyhole } from 'lucide-react';

const serif = { fontFamily: "'Noto Serif TC', serif" };

export default function AdminLoginClient({ nextPath }: { nextPath: string }) {
    const router = useRouter();
    const [token, setToken] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');

        try {
            const res = await fetch('/api/admin/session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token }),
            });
            const data = await res.json();

            if (!data.ok) {
                setError(data.error || '登入失敗。');
                return;
            }

            router.push(nextPath);
            router.refresh();
        } catch {
            setError('登入失敗。');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#FBF7F0] px-6">
            <div className="w-full max-w-md rounded-[2rem] border border-[#E8E0D4] bg-white p-8 shadow-sm">
                <div className="mb-6 flex flex-col items-center text-center">
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E3EED3] text-[#3D5220]">
                        <LockKeyhole size={28} />
                    </div>
                    <p className="text-sm font-black uppercase tracking-[0.2em] text-[#8A8078]">Admin Access</p>
                    <h1 className="mt-2 text-3xl font-black text-[#2D2A26]" style={serif}>管理後台登入</h1>
                    <p className="mt-3 text-sm leading-7 text-[#6B6358]">
                        請輸入管理後台登入碼。登入後可進入文章與留言的審查頁面。
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="password"
                        value={token}
                        onChange={(e) => setToken(e.target.value)}
                        placeholder="請輸入登入碼"
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 outline-none focus:border-[#6B8E23]"
                    />

                    {error && (
                        <p className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-bold text-red-600">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full rounded-xl bg-[#6B8E23] py-3 text-sm font-black text-white hover:bg-[#5a781d] disabled:opacity-50"
                    >
                        {submitting ? '登入中...' : '進入管理後台'}
                    </button>
                </form>
            </div>
        </div>
    );
}
