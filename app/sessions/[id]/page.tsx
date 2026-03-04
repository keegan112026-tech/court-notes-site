'use client';
import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, MessageSquare, User, X, ArrowRight, Info, ChevronRight, Gavel, FileText, AlertCircle, Share2, HeartHandshake, Bookmark, PenTool, ThumbsUp, ShieldAlert, Send, ChevronDown, BookOpen, Calendar, Users } from 'lucide-react';
import { FadeIn, LikeButton } from '@/components/ui-shared';

const serif = { fontFamily: "'Noto Serif TC', serif" };

/* ── role colors ── */
const ROLE_COLORS: Record<string, { text: string; bg: string; border: string }> = {
    '法官🔴': { text: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' },
    '檢察官🟣': { text: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200' },
    '社工🟢': { text: 'text-[#7B8C4E]', bg: 'bg-emerald-50', border: 'border-emerald-200' },
    '辯護人🔵': { text: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
};
function roleStyle(role: string) {
    return ROLE_COLORS[role] || { text: 'text-gray-500', bg: 'bg-gray-50', border: 'border-gray-200' };
}



const CollapsibleBox = ({ title, children, colorTheme, icon: Icon }: { title: string, children: React.ReactNode, colorTheme: 'green' | 'blue' | 'orange' | 'purple' | 'gray', icon?: any }) => {
    const [isOpen, setIsOpen] = useState(false);
    const themes = {
        green: "bg-[#F9FBE7] text-[#6B8E23] border-[#E9EDDA]",
        blue: "bg-[#EFF6FF] text-[#1E40AF] border-[#DBEAFE]",
        orange: "bg-[#FFF7ED] text-[#9A3412] border-[#FFEDD5]",
        purple: "bg-[#F5F3FF] text-[#4C1D95] border-[#EDE9FE]",
        gray: "bg-gray-100 text-gray-700 border-gray-200"
    };
    const theme = themes[colorTheme] || themes.gray;

    return (
        <div className="mb-4 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex w-full items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl border shadow-sm ${theme}`}>
                        {Icon && <Icon size={20} />}
                    </div>
                    <span className="text-lg font-black text-gray-800">{title}</span>
                </div>
                <ChevronDown className={`text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="animate-in fade-in slide-in-from-top-2 border-t border-gray-50 p-6 md:p-8 text-[16px] md:text-[17px] text-gray-600 leading-[1.9] font-medium">
                    {children}
                </div>
            )}
        </div>
    );
};

export default function SessionDetailPage() {
    const params = useParams();
    const sessionId = params.id as string;

    const [transcript, setTranscript] = useState([] as any[]);
    const [session, setSession] = useState<any>(null);
    const [selectedParagraph, setSelectedParagraph] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Fetch dynamic data
    useEffect(() => {
        fetch(`/api/transcripts/${sessionId}`)
            .then(res => res.json())
            .then(data => {
                if (data.ok) {
                    setTranscript(data.data.transcripts || []);
                    setSession(data.data.session || null);
                    const mappedComments = (data.data.comments || []).map((c: any) => ({
                        id: c.id,
                        pId: c.targetLineId,
                        author: c.author,
                        content: c.content,
                        targetTopic: c.targetTopic,
                        likes: c.likes,
                        time: new Date(c.createdAt).toLocaleString('zh-TW', { hour12: false })
                    }));
                    setComments(mappedComments);
                }
            })
            .catch(console.error);
    }, [sessionId]);

    // Handle auto-scrolling to hash anchor when transcript is loaded
    useEffect(() => {
        if (transcript.length > 0) {
            const hash = window.location.hash;
            if (hash && hash.startsWith('#line-')) {
                setTimeout(() => {
                    const el = document.getElementById(hash.substring(1));
                    if (el) {
                        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        // Extract the logical ID to select it automatically
                        const pId = hash.replace('#line-', '');
                        setSelectedParagraph(pId);
                    }
                }, 500); // Give rendering a moment
            }
        }
    }, [transcript]);
    const [newComment, setNewComment] = useState('');
    const [authorName, setAuthorName] = useState('');
    const [topic, setTopic] = useState('制度探討');
    const [submitting, setSubmitting] = useState(false);
    const [submitMsg, setSubmitMsg] = useState('');
    const [comments, setComments] = useState<any[]>([]);

    const filteredComments = useMemo(() => {
        if (!selectedParagraph) return comments;
        return comments.filter(c => c.pId === selectedParagraph);
    }, [selectedParagraph, comments]);

    const openCommentModal = (pId: string) => {
        setSelectedParagraph(pId);
        setIsModalOpen(true);
    };

    const handleSubmitComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        setSubmitting(true);
        try {
            const res = await fetch('/api/comments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ targetLineId: selectedParagraph, author: authorName, content: newComment, sessionId, topic }),
            });
            const data = await res.json();
            if (data.ok) {
                setSubmitMsg('✅ 留言已送出，待審核後顯示');
                setComments([{ id: `local-${Date.now()}`, pId: selectedParagraph || '', author: authorName || '匿名夥伴', content: newComment, targetTopic: topic, likes: 0, time: '剛剛（待審核）' }, ...comments]);
                setNewComment('');
                setTimeout(() => { setIsModalOpen(false); setSubmitMsg(''); }, 2000);
            } else {
                setSubmitMsg(`❌ ${data.error}`);
            }
        } catch { setSubmitMsg('❌ 網路錯誤'); } finally { setSubmitting(false); }
    };

    const [isCopied, setIsCopied] = useState(false);

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    return (
        <div className="min-h-screen bg-[#FAFAFA] text-gray-800 font-sans selection:bg-[#6B8E23]/20 pb-20">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-white border-b border-gray-100 px-4 lg:px-10 py-4 flex justify-between items-center shadow-sm">
                <div className="flex items-center gap-4">
                    <Link href="/sessions" className="p-2 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors">
                        <ArrowLeft size={22} className="text-gray-600" />
                    </Link>
                    <h1 className="text-base lg:text-xl font-black text-gray-900 tracking-tight">法庭實況還原與專業共構筆記</h1>
                </div>
                <button
                    onClick={handleShare}
                    className="flex items-center gap-2 bg-[#6B8E23] text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm hover:bg-[#5a781d] transition-colors"
                >
                    <Share2 size={16} />
                    {isCopied ? '已複製連結！' : '分享連結'}
                </button>
            </header>

            <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 px-4 lg:px-8 pt-8">
                {/* 左側：主體內容區 (8/12) */}
                <div className="lg:col-span-8 space-y-8">

                    <div className="text-center py-8 border-b border-gray-100 space-y-4">
                        <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-gray-900 leading-tight">
                            {session ? session.title : '載入中...'}
                        </h2>
                        <div className="flex items-center justify-center gap-2">
                            <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-[13px] font-bold">{session?.category || '分類載入中'}</span>
                            <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-[13px] font-bold">{session?.date || '日期載入中'}</span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <CollapsibleBox title="本場次介紹與重點" colorTheme="green" icon={BookOpen}>
                            <p className="whitespace-pre-wrap">{session?.summary || '載入中...'}</p>
                        </CollapsibleBox>
                        <CollapsibleBox title="法庭人物與角色" colorTheme="gray" icon={Users}>
                            <p>審判長：吳家桐 ｜ 被告：陳尚潔社工師 ｜ 辯護律師：蔡宜臻、朱浩文等</p>
                        </CollapsibleBox>
                    </div>

                    <div className="space-y-6 pt-6">
                        <div className="inline-flex items-center gap-3 bg-[#E9EDDA] px-5 py-2.5 rounded-xl border-l-[6px] border-[#6B8E23] shadow-sm mb-4">
                            <h3 className="text-2xl font-black text-gray-900">開庭實況還原筆記</h3>
                        </div>

                        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden p-6 md:p-10 space-y-2">
                            {transcript.map((item: any, idx) => {
                                const isStage = item.type === 'stage' || item.role === '系統/旁白';
                                if (isStage) {
                                    return (
                                        <div key={item.id || idx} className="py-8 text-center">
                                            <span className="bg-[#F9FBE7] text-[#6B8E23] px-6 py-2 rounded-full text-sm font-black border border-[#6B8E23]/20 uppercase tracking-widest">{item.content}</span>
                                        </div>
                                    );
                                }
                                const isSelected = selectedParagraph === item.id;
                                const roleIdStr = item.role || '未知';

                                return (
                                    <div
                                        key={item.id}
                                        id={`line-${item.id}`}
                                        onClick={() => setSelectedParagraph(isSelected ? null : item.id)}
                                        className={`group relative p-6 md:p-8 rounded-[1.8rem] transition-all cursor-pointer ${isSelected ? 'bg-[#F9FBE7] ring-1 ring-[#6B8E23]/30 shadow-inner' : 'hover:bg-gray-50 border border-transparent hover:border-gray-100'
                                            }`}
                                    >
                                        <div className="flex flex-col md:flex-row gap-2 md:gap-8">
                                            <div className={`shrink-0 md:w-16 text-[14px] font-black pt-1.5 uppercase tracking-widest ${roleIdStr.includes('法官') || roleIdStr.includes('審判長') || roleIdStr.includes('🔴') ? 'text-orange-600' : 'text-[#6B8E23]'}`}>
                                                {roleIdStr.replace(/[🔴🟣🟢🔵]/g, '')}
                                            </div>
                                            <div className="flex-1">
                                                {item.action && <span className="text-[11px] font-black text-gray-400 mb-1 block">({item.action})</span>}
                                                <p className={`text-[17px] md:text-[18px] leading-[1.9] ${isSelected ? 'text-gray-900 font-bold' : 'text-[#4A4743] font-medium'}`} style={serif}>
                                                    {item.content}
                                                </p>
                                            </div>
                                        </div>
                                        {comments.some(c => c.pId === item.id) && (
                                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-12 bg-[#6B8E23] rounded-full opacity-60" />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* 右側：專業註記區 (4/12) */}
                <div className="col-span-1 lg:col-span-4 relative mt-8 lg:mt-0">
                    <div className="sticky top-28 space-y-6">
                        <div className="bg-white rounded-[2rem] p-6 shadow-md border border-gray-100 overflow-hidden">
                            <h3 className="text-xl font-black text-gray-900 flex items-center gap-2 mb-6 border-b border-gray-50 pb-4">
                                <MessageSquare className="text-[#6B8E23]" /> 專業論述共構
                                <span className="bg-gray-100 text-gray-400 text-[10px] px-2 py-0.5 rounded-full ml-auto">{filteredComments.length}</span>
                            </h3>

                            {selectedParagraph ? (
                                <div className="space-y-6 animate-in fade-in">
                                    <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 p-2 rounded-lg text-center">正在回應段落：{selectedParagraph.replace('p', '')}</p>

                                    <div className="space-y-4 max-h-[450px] overflow-y-auto pr-2 custom-scrollbar">
                                        {filteredComments.length === 0 ? (
                                            <div className="py-12 text-center space-y-3">
                                                <PenTool size={32} className="mx-auto text-gray-200" />
                                                <p className="text-sm font-bold text-gray-400 leading-relaxed">目前此段落尚無專業註記，<br />期待您的實務見解。</p>
                                            </div>
                                        ) : (
                                            filteredComments.map(comment => (
                                                <div key={comment.id} className="bg-[#FAFAFA] p-5 rounded-2xl border border-gray-100 shadow-sm space-y-3">
                                                    <div className="flex justify-between items-center">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-xs font-black text-[#6B8E23] bg-[#F9FBE7] px-2 py-1 rounded">{comment.author}</span>
                                                            {comment.targetTopic && <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded border border-orange-100">#{comment.targetTopic}</span>}
                                                        </div>
                                                        <span className="text-[10px] font-bold text-gray-300">{comment.time}</span>
                                                    </div>
                                                    <p className="text-sm font-medium text-gray-600 leading-relaxed italic">「{comment.content}」</p>
                                                    <div className="flex items-center gap-4 mt-1">
                                                        <LikeButton initialCount={comment.likes} targetId={comment.id} targetType="interactions" size="sm" />
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>

                                    <button onClick={() => setIsModalOpen(true)} className="w-full bg-[#6B8E23] text-white py-4 rounded-2xl font-black text-sm shadow-lg hover:scale-[1.02] transition-all flex items-center justify-center gap-2">
                                        <PenTool size={16} /> 發表專業見解
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
                                    <h4 className="text-[13px] font-black text-gray-400 bg-gray-50 px-4 py-2 rounded-xl text-center uppercase tracking-widest">本場次所有專業論述</h4>
                                    <div className="space-y-3 max-h-[450px] overflow-y-auto pr-2 custom-scrollbar">
                                        {comments.length === 0 ? (
                                            <div className="py-12 text-center space-y-3">
                                                <MessageSquare size={32} className="mx-auto text-gray-200" />
                                                <p className="text-sm font-bold text-gray-400 leading-relaxed">目前尚無整體留言，<br />點擊左側段落即可發表見解。</p>
                                            </div>
                                        ) : comments.map(comment => (
                                            <div
                                                key={`all-${comment.id}`}
                                                onClick={() => {
                                                    setSelectedParagraph(comment.pId);
                                                    setTimeout(() => {
                                                        const el = document.getElementById(`line-${comment.pId}`);
                                                        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                                    }, 100);
                                                }}
                                                className="bg-white p-4 rounded-xl cursor-pointer hover:bg-[#F9FBE7] hover:border-[#6B8E23]/50 transition-all border border-gray-100 shadow-sm"
                                            >
                                                <div className="flex justify-between items-center mb-2">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[11px] font-black text-[#6B8E23] bg-[#E9EDDA] px-2 py-0.5 rounded">{comment.author}</span>
                                                        {comment.targetTopic && <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded border border-orange-100">#{comment.targetTopic}</span>}
                                                    </div>
                                                    <span className="text-[10px] text-gray-400 font-bold">{comment.time}</span>
                                                </div>
                                                <p className="text-[13px] font-medium text-gray-600 line-clamp-3 leading-relaxed">「{comment.content}」</p>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-8 bg-orange-50 p-5 rounded-2xl border border-orange-100">
                                        <h4 className="text-[14px] font-black text-orange-800 mb-3 flex items-center gap-2">
                                            <Info size={16} /> 平台發文規範與承諾
                                        </h4>
                                        <div className="text-[12px] text-orange-700/80 leading-relaxed font-medium space-y-2">
                                            <p><strong className="text-orange-900 block mb-0.5">1. 嚴格去識別化（最重要）：</strong>嚴禁揭露案主、家屬、社工或相關人員之真實姓名、詳細地址或任何足以辨識身分之隱私資訊。</p>
                                            <p><strong className="text-orange-900 block mt-3 mb-0.5">2. 聚焦專業，拒絕公審：</strong>鼓勵針對「專業判斷」、「處遇邏輯」進行討論。避免針對特定個人進行人身攻擊、非理性謾罵或臆測性的道德指控。</p>
                                            <p><strong className="text-orange-900 block mt-3 mb-0.5">3. 先審後發機制：</strong>為保護當事人在未經查證下遭受二次傷害免除法律紛爭，平台目前採取「先審後發」，僅攔截明顯違法或人身攻擊內容。</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            {/* 投稿 Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-md animate-in fade-in" onClick={() => setIsModalOpen(false)} />
                    <div className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in">
                        <div className="bg-[#6B8E23] p-8 text-white relative">
                            <button onClick={() => setIsModalOpen(false)} className="absolute right-6 top-6 hover:bg-white/20 p-2 rounded-full transition-colors"><X size={20} /></button>
                            <h3 className="text-2xl font-black mb-1">發表專業見解</h3>
                            <p className="text-xs opacity-80 font-bold uppercase tracking-widest">正在回應段落：{selectedParagraph?.replace('p', '')}</p>
                        </div>
                        {submitMsg ? (
                            <div className="p-12 text-center text-xl font-bold text-[#6B8E23]">{submitMsg}</div>
                        ) : (
                            <form onSubmit={handleSubmitComment} className="p-8 space-y-6">
                                <div>
                                    <label className="text-xs font-black text-gray-400 uppercase ml-1 block mb-2">您的身分稱呼 (例如：資深社工)</label>
                                    <input type="text" value={authorName} onChange={(e) => setAuthorName(e.target.value)} placeholder="不留則顯示「匿名夥伴」" className="w-full bg-gray-50 p-4 rounded-2xl border border-transparent focus:border-[#6B8E23] outline-none font-bold text-gray-700" />
                                </div>
                                <div>
                                    <label className="text-xs font-black text-gray-400 uppercase ml-1 block mb-2">討論主題 *</label>
                                    <select value={topic} onChange={(e) => setTopic(e.target.value)} className="w-full bg-gray-50 p-4 rounded-2xl border border-transparent focus:border-[#6B8E23] outline-none font-bold text-gray-700">
                                        {['制度探討', '實務經驗', '倫理界線', '流程爭議', '資源配置', '其他'].map(t => <option key={t} value={t}>{t}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-black text-gray-400 uppercase ml-1 block mb-2">見解論述內容 *</label>
                                    <textarea required rows={5} value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="請輸入關於此對話的專業判讀或建議..." className="w-full bg-gray-50 p-4 rounded-2xl border border-transparent focus:border-[#6B8E23] outline-none font-medium text-gray-600 resize-none leading-relaxed" />
                                </div>
                                <div className="flex items-start gap-2 bg-orange-50 p-4 rounded-xl text-[11px] text-orange-800 font-medium">
                                    <ShieldAlert size={16} className="shrink-0" />
                                    送出即確認內容符合「去識別化」原則，不揭露個案隱私。
                                </div>
                                <button type="submit" disabled={submitting} className="w-full bg-[#6B8E23] text-white py-5 rounded-3xl font-black text-lg shadow-xl flex items-center justify-center gap-3 hover:scale-[1.02] transition-all disabled:opacity-50">
                                    {submitting ? '處理中...' : '確認送出註記'} <Send size={20} />
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
