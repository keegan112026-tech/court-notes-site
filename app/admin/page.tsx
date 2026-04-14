'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import AdminConsoleNav from '@/components/admin/AdminConsoleNav';
import {
    Check,
    FileText,
    Inbox,
    Layers3,
    MessageSquare,
    Shield,
} from 'lucide-react';

const serif = { fontFamily: "'Noto Serif TC', serif" };

type CurrentAdmin = {
    name: string;
    role: 'owner' | 'reviewer';
};

type DashboardSummary = {
    pendingArticles: number;
    pendingComments: number;
    readyToPublishArticles: number;
    publishedArticles: number;
    totalArticles: number;
    totalComments: number;
    newInbox: number;
    processingInbox: number;
    resolvedInbox: number;
    totalInbox: number;
};

type DashboardData = {
    currentAdmin: CurrentAdmin | null;
    summary: DashboardSummary;
    recent: {
        pendingArticles: Array<{
            id: string;
            title: string;
            author: string;
            createdAt: string;
            status: string;
            targetSessionId?: string;
        }>;
        pendingComments: Array<{
            id: string;
            author: string;
            content: string;
            createdAt: string;
            status: string;
            targetLineId: string;
        }>;
        inboxMessages: Array<{
            id: string;
            title: string;
            senderName: string;
            messageType: string;
            createdAt: string;
            status: string;
        }>;
    };
};

const emptySummary: DashboardSummary = {
    pendingArticles: 0,
    pendingComments: 0,
    readyToPublishArticles: 0,
    publishedArticles: 0,
    totalArticles: 0,
    totalComments: 0,
    newInbox: 0,
    processingInbox: 0,
    resolvedInbox: 0,
    totalInbox: 0,
};

function formatDate(value: string) {
    const parsed = Date.parse(value);
    if (Number.isNaN(parsed)) return value;
    return new Date(parsed).toLocaleString('zh-TW');
}

export default function AdminDashboardPage() {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            setError('');
            try {
                const res = await fetch('/api/admin/dashboard');
                const payload = await res.json();
                if (!payload.ok) {
                    setError(payload.error || '讀取營運控台時發生錯誤。');
                    return;
                }
                setData(payload.data);
            } catch {
                setError('讀取營運控台時發生錯誤。');
            } finally {
                setLoading(false);
            }
        };

        load();
    }, []);

    const summary = data?.summary || emptySummary;

    return (
        <div className="min-h-screen bg-[#FBF7F0] pt-24">
            <Navbar />
            <main className="mx-auto max-w-6xl space-y-8 px-6 py-10">
                <section className="rounded-[2rem] border border-[#E8E0D4] bg-white p-8 shadow-sm">
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                        <div className="space-y-3">
                            <p className="text-sm font-black uppercase tracking-[0.2em] text-[#8A8078]">Admin Console</p>
                            <h1 className="text-4xl font-black text-[#2D2A26]" style={serif}>營運控台</h1>
                            <p className="max-w-3xl text-lg leading-relaxed text-[#6B6358]">
                                這裡是後台總入口。先看待審、待發布與收件狀態，再決定要前往待審核、文章管理、留言管理或收件匣。
                            </p>
                        </div>

                        <div className="min-w-[220px] rounded-2xl border border-[#DDE6C8] bg-[#F9FBE7] px-4 py-3">
                            <div className="flex items-center gap-2 text-sm font-black text-[#5A6F35]">
                                <Shield size={16} />
                                目前登入身份
                            </div>
                            <p className="mt-1 text-lg font-black text-[#2D2A26]">{data?.currentAdmin?.name || '讀取中…'}</p>
                            <p className="text-sm font-bold uppercase tracking-[0.12em] text-[#8A8078]">{data?.currentAdmin?.role || 'unknown'}</p>
                        </div>
                    </div>

                    <div className="mt-6">
                        <AdminConsoleNav current="dashboard" />
                    </div>

                    {error && (
                        <div className="mt-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-black text-red-600">
                            {error}
                        </div>
                    )}
                </section>

                <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <div className="rounded-[2rem] border border-[#E8E0D4] bg-white p-5 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#E3EED3] text-[#3D5220]">
                                <Check size={21} />
                            </div>
                            <div>
                                <p className="text-sm font-black text-[#8A8078]">待審核</p>
                                <p className="text-3xl font-black text-[#2D2A26]">{loading ? '…' : summary.pendingArticles + summary.pendingComments}</p>
                            </div>
                        </div>
                        <p className="mt-3 text-sm font-medium leading-7 text-[#6B6358]">
                            文章 {summary.pendingArticles} 篇，留言 {summary.pendingComments} 則
                        </p>
                    </div>

                    <div className="rounded-[2rem] border border-[#E8E0D4] bg-white p-5 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#FDE8D8] text-[#C67B5C]">
                                <FileText size={21} />
                            </div>
                            <div>
                                <p className="text-sm font-black text-[#8A8078]">文章狀態</p>
                                <p className="text-3xl font-black text-[#2D2A26]">{loading ? '…' : summary.readyToPublishArticles}</p>
                            </div>
                        </div>
                        <p className="mt-3 text-sm font-medium leading-7 text-[#6B6358]">
                            待發布 {summary.readyToPublishArticles} 篇，已發布 {summary.publishedArticles} 篇
                        </p>
                    </div>

                    <div className="rounded-[2rem] border border-[#E8E0D4] bg-white p-5 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#E9F0FF] text-[#4D6CB3]">
                                <MessageSquare size={21} />
                            </div>
                            <div>
                                <p className="text-sm font-black text-[#8A8078]">留言總量</p>
                                <p className="text-3xl font-black text-[#2D2A26]">{loading ? '…' : summary.totalComments}</p>
                            </div>
                        </div>
                        <p className="mt-3 text-sm font-medium leading-7 text-[#6B6358]">
                            用來檢查待審、已閱與已核准的留言流量
                        </p>
                    </div>

                    <div className="rounded-[2rem] border border-[#E8E0D4] bg-white p-5 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F5EFE4] text-[#8A8078]">
                                <Inbox size={21} />
                            </div>
                            <div>
                                <p className="text-sm font-black text-[#8A8078]">收件匣</p>
                                <p className="text-3xl font-black text-[#2D2A26]">{loading ? '…' : summary.newInbox}</p>
                            </div>
                        </div>
                        <p className="mt-3 text-sm font-medium leading-7 text-[#6B6358]">
                            新進 {summary.newInbox} 筆，處理中 {summary.processingInbox} 筆，已結案 {summary.resolvedInbox} 筆
                        </p>
                    </div>
                </section>

                <section className="rounded-[2rem] border border-[#E8E0D4] bg-white p-6 shadow-sm">
                    <div className="mb-5 flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F9FBE7] text-[#6B8E23]">
                            <Layers3 size={20} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-[#2D2A26]" style={serif}>工作分流</h2>
                            <p className="text-sm font-bold text-[#8A8078]">先確認當前工作，再進入對應管理頁。</p>
                        </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                        <Link href="/admin/review" className="rounded-2xl border border-[#E8E0D4] bg-[#FFFEFC] p-5 transition hover:border-[#D6E3BA] hover:shadow-sm">
                            <p className="text-lg font-black text-[#2D2A26]">待審核</p>
                            <p className="mt-2 text-sm leading-7 text-[#6B6358]">先處理新進文章與待審留言，避免前台與後台狀態脫鉤。</p>
                        </Link>
                        <Link href="/admin/articles" className="rounded-2xl border border-[#E8E0D4] bg-[#FFFEFC] p-5 transition hover:border-[#D6E3BA] hover:shadow-sm">
                            <p className="text-lg font-black text-[#2D2A26]">文章管理</p>
                            <p className="mt-2 text-sm leading-7 text-[#6B6358]">統一管理待發布、已發布、退回修改與封存文章。</p>
                        </Link>
                        <Link href="/admin/comments" className="rounded-2xl border border-[#E8E0D4] bg-[#FFFEFC] p-5 transition hover:border-[#D6E3BA] hover:shadow-sm">
                            <p className="text-lg font-black text-[#2D2A26]">留言管理</p>
                            <p className="mt-2 text-sm leading-7 text-[#6B6358]">集中檢查已閱、待審、已核准與刪除留言的狀態。</p>
                        </Link>
                        <Link href="/admin/inbox" className="rounded-2xl border border-[#E8E0D4] bg-[#FFFEFC] p-5 transition hover:border-[#D6E3BA] hover:shadow-sm">
                            <p className="text-lg font-black text-[#2D2A26]">收件匣</p>
                            <p className="mt-2 text-sm leading-7 text-[#6B6358]">看私密傳訊、聯絡補件與錯誤回報，並標記已閱與已處理。</p>
                        </Link>
                    </div>
                </section>

                <section className="grid gap-6 xl:grid-cols-3">
                    <div className="rounded-[2rem] border border-[#E8E0D4] bg-white p-6 shadow-sm">
                        <h3 className="text-xl font-black text-[#2D2A26]" style={serif}>最新待審文章</h3>
                        <div className="mt-4 space-y-3">
                            {loading ? (
                                <p className="text-sm font-bold text-gray-500">讀取中…</p>
                            ) : (data?.recent.pendingArticles.length || 0) === 0 ? (
                                <p className="text-sm font-bold text-gray-400">目前沒有待審文章。</p>
                            ) : data?.recent.pendingArticles.map((item) => (
                                <div key={item.id} className="rounded-2xl border border-gray-100 bg-[#FFFEFC] p-4">
                                    <p className="text-base font-black text-[#2D2A26]">{item.title}</p>
                                    <p className="mt-1 text-sm font-bold text-[#8A8078]">{item.author || '匿名投稿'} / {item.targetSessionId || '未指定場次'}</p>
                                    <p className="mt-2 text-xs font-bold text-gray-400">{formatDate(item.createdAt)}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-[2rem] border border-[#E8E0D4] bg-white p-6 shadow-sm">
                        <h3 className="text-xl font-black text-[#2D2A26]" style={serif}>最新待審留言</h3>
                        <div className="mt-4 space-y-3">
                            {loading ? (
                                <p className="text-sm font-bold text-gray-500">讀取中…</p>
                            ) : (data?.recent.pendingComments.length || 0) === 0 ? (
                                <p className="text-sm font-bold text-gray-400">目前沒有待審留言。</p>
                            ) : data?.recent.pendingComments.map((item) => (
                                <div key={item.id} className="rounded-2xl border border-gray-100 bg-[#FFFEFC] p-4">
                                    <p className="text-base font-black text-[#2D2A26]">{item.author || '匿名留言'}</p>
                                    <p className="mt-1 line-clamp-3 text-sm leading-7 text-[#6B6358]">{item.content}</p>
                                    <p className="mt-2 text-xs font-bold text-gray-400">{formatDate(item.createdAt)}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-[2rem] border border-[#E8E0D4] bg-white p-6 shadow-sm">
                        <h3 className="text-xl font-black text-[#2D2A26]" style={serif}>最新收件訊息</h3>
                        <div className="mt-4 space-y-3">
                            {loading ? (
                                <p className="text-sm font-bold text-gray-500">讀取中…</p>
                            ) : (data?.recent.inboxMessages.length || 0) === 0 ? (
                                <p className="text-sm font-bold text-gray-400">目前沒有收件資料。</p>
                            ) : data?.recent.inboxMessages.map((item) => (
                                <div key={item.id} className="rounded-2xl border border-gray-100 bg-[#FFFEFC] p-4">
                                    <p className="text-base font-black text-[#2D2A26]">{item.title || '未命名訊息'}</p>
                                    <p className="mt-1 text-sm font-bold text-[#8A8078]">{item.senderName || '未提供姓名'} / {item.messageType || '未分類'}</p>
                                    <p className="mt-2 text-xs font-bold text-gray-400">{formatDate(item.createdAt)}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
