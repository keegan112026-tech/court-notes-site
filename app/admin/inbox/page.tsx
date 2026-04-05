'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Navbar from '@/components/Navbar';
import { Link2, Search, Shield } from 'lucide-react';

const serif = { fontFamily: "'Noto Serif TC', serif" };

type InboxMessage = {
    id: string;
    title: string;
    messageType: string;
    senderName: string;
    senderEmail?: string;
    content: string;
    attachmentUrl?: string;
    isSensitive: boolean;
    status: string;
    internalNote?: string;
    createdAt: string;
    handledBy?: string;
    handledAt?: string;
    relatedArticleId?: string;
    relatedSessionId?: string;
};

function formatDate(value: string) {
    const parsed = Date.parse(value);
    if (Number.isNaN(parsed)) return value;
    return new Date(parsed).toLocaleString('zh-TW');
}

export default function AdminInboxPage() {
    const [messages, setMessages] = useState<InboxMessage[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [typeFilter, setTypeFilter] = useState('all');
    const [keyword, setKeyword] = useState('');

    useEffect(() => {
        fetch('/api/admin/inbox')
            .then((res) => res.json())
            .then((data) => {
                if (!data.ok) {
                    setError(data.error || '讀取 Inbox 訊息失敗。');
                    return;
                }
                setMessages(Array.isArray(data.data.messages) ? data.data.messages : []);
            })
            .catch(() => setError('讀取 Inbox 訊息失敗。'))
            .finally(() => setLoading(false));
    }, []);

    const typeOptions = useMemo(() => {
        const values = Array.from(new Set(messages.map((message) => message.messageType).filter(Boolean)));
        return ['all', ...values];
    }, [messages]);

    const filteredMessages = useMemo(() => {
        return messages.filter((message) => {
            const typeMatch = typeFilter === 'all' || message.messageType === typeFilter;
            const text = `${message.title} ${message.senderName} ${message.content} ${message.relatedSessionId || ''} ${message.relatedArticleId || ''}`.toLowerCase();
            const keywordMatch = !keyword.trim() || text.includes(keyword.trim().toLowerCase());
            return typeMatch && keywordMatch;
        });
    }, [messages, keyword, typeFilter]);

    return (
        <div className="min-h-screen bg-[#FBF7F0] pt-24">
            <Navbar />
            <main className="mx-auto max-w-6xl space-y-8 px-6 py-10">
                <section className="rounded-[2rem] border border-[#E8E0D4] bg-white p-8 shadow-sm">
                    <div className="space-y-3">
                        <p className="text-sm font-black uppercase tracking-[0.2em] text-[#8A8078]">Admin Inbox</p>
                        <h1 className="text-4xl font-black text-[#2D2A26]" style={serif}>Inbox 與回報訊息</h1>
                        <p className="max-w-3xl text-lg leading-relaxed text-[#6B6358]">
                            這裡整理一般聯絡、錯誤回報、內容更正、使用建議與私密傳訊。
                        </p>
                    </div>

                    <div className="mt-6 grid gap-4 md:grid-cols-[1fr_220px]">
                        <label className="flex items-center gap-3 rounded-xl border border-gray-200 bg-[#FBF7F0] px-4 py-3">
                            <Search size={16} className="text-[#8A8078]" />
                            <input
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                                placeholder="搜尋主旨、內容或關聯資訊"
                                className="w-full bg-transparent text-sm font-medium text-gray-700 outline-none"
                            />
                        </label>

                        <select
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value)}
                            className="rounded-xl border border-gray-200 bg-[#FBF7F0] px-4 py-3 text-sm font-bold text-gray-700 outline-none"
                        >
                            {typeOptions.map((type) => (
                                <option key={type} value={type}>
                                    {type === 'all' ? '全部類型' : type}
                                </option>
                            ))}
                        </select>
                    </div>
                </section>

                <section className="rounded-[2rem] border border-[#E8E0D4] bg-white p-6 shadow-sm">
                    {loading ? (
                        <p className="text-sm font-bold text-gray-500">載入中...</p>
                    ) : error ? (
                        <p className="text-sm font-bold text-red-600">{error}</p>
                    ) : filteredMessages.length === 0 ? (
                        <p className="text-sm font-bold text-gray-400">目前沒有符合條件的訊息。</p>
                    ) : (
                        <div className="space-y-4">
                            {filteredMessages.map((message) => (
                                <div key={message.id} className="rounded-2xl border border-gray-100 bg-[#FFFEFC] p-5">
                                    <div className="mb-3 flex flex-wrap items-start justify-between gap-4">
                                        <div className="space-y-2">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span className="rounded-full bg-[#FDE8D8] px-3 py-1 text-xs font-black text-[#C67B5C]">
                                                    {message.messageType || '未分類'}
                                                </span>
                                                <span className="rounded-full bg-[#F3F6EA] px-3 py-1 text-xs font-black text-[#5A6F35]">
                                                    {message.status || '未設定狀態'}
                                                </span>
                                                {message.isSensitive && (
                                                    <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-3 py-1 text-xs font-black text-red-600">
                                                        <Shield size={12} />
                                                        敏感
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-xl font-black text-[#2D2A26]" style={serif}>{message.title || '未命名訊息'}</p>
                                            <p className="text-sm font-bold text-[#8A8078]">
                                                {message.senderName || '匿名'}
                                                {message.senderEmail ? ` ・ ${message.senderEmail}` : ''}
                                            </p>
                                        </div>
                                        <p className="text-xs font-bold text-gray-400">{formatDate(message.createdAt)}</p>
                                    </div>

                                    <p className="whitespace-pre-wrap text-sm leading-7 text-[#5A5347]">{message.content}</p>

                                    <div className="mt-4 flex flex-wrap items-center gap-4 text-sm font-bold text-[#8A8078]">
                                        {message.relatedArticleId && <span>關聯文章：{message.relatedArticleId}</span>}
                                        {message.relatedSessionId && <span>關聯場次：{message.relatedSessionId}</span>}
                                        {message.handledBy && <span>處理者：{message.handledBy}</span>}
                                        {message.attachmentUrl && (
                                            <a
                                                href={message.attachmentUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="inline-flex items-center gap-1 text-[#6B8E23] hover:underline"
                                            >
                                                <Link2 size={14} />
                                                查看附件
                                            </a>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}
