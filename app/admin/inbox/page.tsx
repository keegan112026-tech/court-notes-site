'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Navbar from '@/components/Navbar';
import AdminConsoleNav from '@/components/admin/AdminConsoleNav';
import { CheckCheck, Link2, MailOpen, Search, Shield } from 'lucide-react';

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

type CurrentAdmin = {
    name: string;
    role: 'owner' | 'reviewer';
};

function formatDate(value: string) {
    const parsed = Date.parse(value);
    if (Number.isNaN(parsed)) return value;
    return new Date(parsed).toLocaleString('zh-TW');
}

export default function AdminInboxPage() {
    const [messages, setMessages] = useState<InboxMessage[]>([]);
    const [currentAdmin, setCurrentAdmin] = useState<CurrentAdmin | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [typeFilter, setTypeFilter] = useState('all');
    const [keyword, setKeyword] = useState('');
    const [note, setNote] = useState('');
    const [workingKey, setWorkingKey] = useState('');

    const loadMessages = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/inbox');
            const data = await res.json();
            if (!data.ok) {
                setError(data.error || '讀取收件匣資料時發生錯誤。');
                return;
            }
            setCurrentAdmin(data.data.currentAdmin || null);
            setMessages(Array.isArray(data.data.messages) ? data.data.messages : []);
        } catch {
            setError('讀取收件匣資料時發生錯誤。');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadMessages();
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

    const handleInboxAction = async (targetId: string, action: 'mark-read' | 'mark-resolved') => {
        const key = `${targetId}-${action}`;
        setWorkingKey(key);
        setMessage('');
        setError('');

        try {
            const res = await fetch('/api/admin/inbox', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ targetId, action, note }),
            });
            const data = await res.json();
            if (!data.ok) {
                setError(data.error || '更新收件狀態時發生錯誤。');
                return;
            }
            setMessage(action === 'mark-resolved' ? '訊息已標記為已處理。' : '訊息已標記為已閱。');
            await loadMessages();
        } catch {
            setError('更新收件狀態時發生錯誤。');
        } finally {
            setWorkingKey('');
        }
    };

    return (
        <div className="min-h-screen bg-[#FBF7F0] pt-24">
            <Navbar />
            <main className="mx-auto max-w-6xl space-y-8 px-6 py-10">
                <section className="rounded-[2rem] border border-[#E8E0D4] bg-white p-8 shadow-sm">
                    <div className="space-y-3">
                        <p className="text-sm font-black uppercase tracking-[0.2em] text-[#8A8078]">Admin Inbox</p>
                        <h1 className="text-4xl font-black text-[#2D2A26]" style={serif}>收件匣</h1>
                        <p className="max-w-3xl text-lg leading-relaxed text-[#6B6358]">
                            這裡集中顯示私密傳訊、聯絡表單、補件與錯誤回報。
                        </p>
                    </div>

                    <div className="mt-6">
                        <AdminConsoleNav current="inbox" />
                    </div>

                    <div className="mt-6 grid gap-4 md:grid-cols-[1fr_220px]">
                        <label className="flex items-center gap-3 rounded-xl border border-gray-200 bg-[#FBF7F0] px-4 py-3">
                            <Search size={16} className="text-[#8A8078]" />
                            <input
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                                placeholder="搜尋主旨、寄件者或內容"
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

                    {error && <p className="mt-4 text-sm font-black text-red-600">{error}</p>}
                    {message && <p className="mt-4 text-sm font-black text-[#6B8E23]">{message}</p>}
                    {currentAdmin && (
                        <p className="mt-3 text-sm font-bold text-[#8A8078]">
                            目前登入：{currentAdmin.name} / {currentAdmin.role}
                        </p>
                    )}
                    <textarea
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        rows={3}
                        placeholder="處理備註（選填），會一起寫入收件紀錄。"
                        className="mt-5 w-full rounded-2xl border border-gray-200 bg-[#FBF7F0] px-4 py-3 text-sm font-medium text-gray-700 outline-none"
                    />
                </section>

                <section className="rounded-[2rem] border border-[#E8E0D4] bg-white p-6 shadow-sm">
                    {loading ? (
                        <p className="text-sm font-bold text-gray-500">讀取中…</p>
                    ) : filteredMessages.length === 0 ? (
                        <p className="text-sm font-bold text-gray-400">目前沒有符合條件的收件資料。</p>
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
                                                    {message.status || '未標記狀態'}
                                                </span>
                                                {message.isSensitive && (
                                                    <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-3 py-1 text-xs font-black text-red-600">
                                                        <Shield size={12} />
                                                        私密
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-xl font-black text-[#2D2A26]" style={serif}>{message.title || '未命名訊息'}</p>
                                            <p className="text-sm font-bold text-[#8A8078]">
                                                {message.senderName || '未提供姓名'}
                                                {message.senderEmail ? ` / ${message.senderEmail}` : ''}
                                            </p>
                                        </div>
                                        <p className="text-xs font-bold text-gray-400">{formatDate(message.createdAt)}</p>
                                    </div>

                                    <p className="whitespace-pre-wrap text-sm leading-7 text-[#5A5347]">{message.content}</p>

                                    <div className="mt-4 flex flex-wrap items-center gap-4 text-sm font-bold text-[#8A8078]">
                                        {message.relatedArticleId && <span>相關文章：{message.relatedArticleId}</span>}
                                        {message.relatedSessionId && <span>相關場次：{message.relatedSessionId}</span>}
                                        {message.handledBy && <span>處理人：{message.handledBy}</span>}
                                        {message.handledAt && <span>處理時間：{formatDate(message.handledAt)}</span>}
                                        {message.attachmentUrl && (
                                            <a
                                                href={message.attachmentUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="inline-flex items-center gap-1 text-[#6B8E23] hover:underline"
                                            >
                                                <Link2 size={14} />
                                                開啟附件連結
                                            </a>
                                        )}
                                    </div>

                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {message.status === '新進' && (
                                            <button
                                                onClick={() => handleInboxAction(message.id, 'mark-read')}
                                                disabled={workingKey === `${message.id}-mark-read`}
                                                className="inline-flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-2 text-sm font-black text-slate-700 hover:bg-slate-200 disabled:opacity-50"
                                            >
                                                <MailOpen size={15} />
                                                標記已閱
                                            </button>
                                        )}
                                        {message.status !== '已結案' && (
                                            <button
                                                onClick={() => handleInboxAction(message.id, 'mark-resolved')}
                                                disabled={workingKey === `${message.id}-mark-resolved`}
                                                className="inline-flex items-center gap-2 rounded-xl bg-[#6B8E23] px-4 py-2 text-sm font-black text-white hover:bg-[#5a781d] disabled:opacity-50"
                                            >
                                                <CheckCheck size={15} />
                                                標記已處理
                                            </button>
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
