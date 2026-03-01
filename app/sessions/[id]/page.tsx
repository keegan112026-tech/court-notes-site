'use client';
import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, MessageSquare, User, X, ArrowRight, Info, ChevronRight } from 'lucide-react';
import { FadeIn, LikeButton } from '@/components/ui-shared';

const serif = { fontFamily: "'Noto Serif TC', serif" };

/* ── role colors ── */
const ROLE_COLORS: Record<string, { text: string; bg: string; border: string }> = {
    '法官': { text: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' },
    '檢察官': { text: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200' },
    '社工': { text: 'text-[#7B8C4E]', bg: 'bg-emerald-50', border: 'border-emerald-200' },
    '辯護人': { text: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
    '系統/旁白': { text: 'text-gray-500', bg: 'bg-gray-100', border: 'border-gray-300' },
};
function roleStyle(role: string | undefined) {
    if (!role) return { text: 'text-gray-600', bg: 'bg-gray-50', border: 'border-gray-200' };
    return ROLE_COLORS[role] || { text: 'text-gray-700', bg: 'bg-gray-50', border: 'border-gray-200' };
}

// --- 收縮介面方框元件 ---
const CollapsibleBox = ({ title, children, colorTheme, icon: Icon }: any) => {
    const [isOpen, setIsOpen] = useState(false);
    const themes: any = {
        green: "bg-[#F9FBE7] text-[#7B8C4E] border-[#E9EDDA]",
        blue: "bg-[#EFF6FF] text-[#1E40AF] border-[#DBEAFE]",
        orange: "bg-[#FFF7ED] text-[#9A3412] border-[#FFEDD5]",
        purple: "bg-[#F5F3FF] text-[#4C1D95] border-[#EDE9FE]",
        gray: "bg-gray-100 text-gray-700 border-gray-200"
    };
    const theme = themes[colorTheme] || themes.gray;

    return (
        <div className="mb-4 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all">
            <button onClick={() => setIsOpen(!isOpen)} className="flex w-full items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl border shadow-sm ${theme}`}>
                        {Icon && <Icon size={20} />}
                    </div>
                    <span className="text-[17px] font-black text-[#3D3832]" style={serif}>{title}</span>
                </div>
                <ChevronRight className={`text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`} />
            </button>
            {isOpen && (
                <div className="border-t border-gray-50 p-6 md:p-8 text-[16px] text-[#5A5347] leading-[1.9] font-medium">
                    {children}
                </div>
            )}
        </div>
    );
};

export default function SessionDetailPage() {
    const params = useParams();
    const sessionId = params.id as string;

    const [sessionData, setSessionData] = useState<any>(null);
    const [transcript, setTranscript] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [selectedParagraph, setSelectedParagraph] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Comments states
    const [commentsCache, setCommentsCache] = useState<Record<string, any[]>>({});
    const [commentsLoading, setCommentsLoading] = useState(false);

    // Form states
    const [newComment, setNewComment] = useState('');
    const [authorName, setAuthorName] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [submitMsg, setSubmitMsg] = useState('');

    useEffect(() => {
        if (!sessionId) return;
        setLoading(true);
        fetch(`/api/transcripts/${sessionId}`)
            .then(res => res.json())
            .then(data => {
                if (data.ok) {
                    setSessionData(data.data.session);
                    setTranscript(data.data.transcripts || []);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to load transcript:", err);
                setLoading(false);
            });
    }, [sessionId]);

    const filteredComments = useMemo(() => {
        if (!selectedParagraph) return [];
        return commentsCache[selectedParagraph] || [];
    }, [selectedParagraph, commentsCache]);

    const loadCommentsForLine = async (pId: string) => {
        // Line ID mapping fallback for Notion Line_ID resolving
        const transcriptItem = transcript.find(t => t.id === pId || t.lineId === pId);
        if (!transcriptItem) return;

        setCommentsLoading(true);
        try {
            const res = await fetch(`/api/comments?lineId=${transcriptItem.id}`);
            const data = await res.json();
            if (data.ok) {
                setCommentsCache(prev => ({ ...prev, [pId]: data.data }));
            }
        } catch (err) {
            console.error("Failed to load comments:", err);
        }
        setCommentsLoading(false);
    };

    const openCommentModal = (pId: string) => {
        setSelectedParagraph(pId);
        setIsModalOpen(true);
        setSubmitMsg('');
        if (!commentsCache[pId]) {
            loadCommentsForLine(pId);
        }
    };

    const handleSubmitComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim() || !selectedParagraph) return;

        // Find line ID for Notion target
        const transcriptItem = transcript.find(t => t.id === selectedParagraph || t.lineId === selectedParagraph);
        if (!transcriptItem) return;

        setSubmitting(true);
        try {
            const res = await fetch('/api/comments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ targetLineId: transcriptItem.id, author: authorName, content: newComment }),
            });
            const data = await res.json();
            if (data.ok) {
                setSubmitMsg('✅ 留言已送出，待審核後顯示');

                // Optimistically update cache
                const newCommentObj = { id: `local-${Date.now()}`, targetLineId: transcriptItem.id, author: authorName || '匿名夥伴', content: newComment, likes: 0, status: 'Pending', createdAt: new Date().toISOString() };
                setCommentsCache(prev => ({
                    ...prev,
                    [selectedParagraph]: [newCommentObj, ...(prev[selectedParagraph] || [])]
                }));

                setNewComment('');
                setTimeout(() => { setIsModalOpen(false); setSubmitMsg(''); }, 2000);
            } else {
                setSubmitMsg(`❌ ${data.error}`);
            }
        } catch (err: any) {
            setSubmitMsg(`❌ 系統錯誤: ${err.message}`);
        }
    };

    return (
        <div className="min-h-screen" style={{ backgroundColor: '#FBF7F0', color: '#2D2A26' }}>
            {/* Comment Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                        className="bg-white rounded-2xl p-6 md:p-8 w-full max-w-lg shadow-2xl">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-[22px] font-black" style={serif}>發表見解</h3>
                            <button onClick={() => setIsModalOpen(false)}><X className="text-gray-400 hover:text-red-500" /></button>
                        </div>
                        {submitMsg ? (
                            <p className="text-center py-8 text-[20px] font-bold">{submitMsg}</p>
                        ) : (
                            <form onSubmit={handleSubmitComment} className="space-y-4">
                                <div>
                                    <label className="block text-[14px] font-black text-[#8A8078] mb-1">您的稱呼（選填）</label>
                                    <input value={authorName} onChange={e => setAuthorName(e.target.value)}
                                        className="w-full bg-[#FBF7F0] border border-[#E8E0D4] rounded-xl px-4 py-3 text-[17px] focus:outline-none focus:ring-2 focus:ring-[#7B8C4E]"
                                        placeholder="e.g. 兒保社工 C" />
                                </div>
                                <div>
                                    <label className="block text-[14px] font-black text-[#8A8078] mb-1">見解內容 *</label>
                                    <textarea value={newComment} onChange={e => setNewComment(e.target.value)} required rows={5}
                                        className="w-full bg-[#FBF7F0] border border-[#E8E0D4] rounded-xl px-4 py-3 text-[17px] focus:outline-none focus:ring-2 focus:ring-[#7B8C4E] resize-y"
                                        placeholder="請輸入您的專業觀察..." />
                                </div>
                                <motion.button type="submit" disabled={submitting} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                    className="w-full bg-gradient-to-r from-[#7B8C4E] to-[#5a6e38] text-white py-4 rounded-xl text-[18px] font-black shadow-lg disabled:opacity-50">
                                    {submitting ? '送出中...' : '送出審核'}
                                </motion.button>
                                <p className="text-[13px] text-[#A09888] text-center font-bold">留言需經審核後才會顯示</p>
                            </form>
                        )}
                    </motion.div>
                </div>
            )}

            {/* Header */}
            <div className="bg-gradient-to-b from-[#F5EFE4] to-[#FBF7F0] border-b border-[#E8E0D4]">
                <div className="max-w-7xl mx-auto px-6 py-6">
                    <Link href="/sessions" className="text-[#7B8C4E] text-[16px] font-bold flex items-center gap-1 mb-3 hover:underline"><ArrowLeft size={16} /> 返回場次列表</Link>
                    {loading ? (
                        <h1 className="text-[32px] md:text-[42px] font-black leading-tight text-[#8A8078]" style={serif}>載入中...</h1>
                    ) : (
                        <>
                            <h1 className="text-[32px] md:text-[42px] font-black leading-tight" style={serif}>{sessionData?.title}</h1>
                            <div className="flex flex-wrap items-center gap-3 mt-3">
                                {sessionData?.status && (
                                    <span className={`text-[14px] font-black px-3 py-1 rounded-lg ${sessionData.status === '已發布' ? 'bg-[#7B8C4E] text-white' : 'bg-[#E8E0D4] text-[#8A8078]'}`}>
                                        {sessionData.status}
                                    </span>
                                )}
                                {sessionData?.category && <span className="bg-[#C67B5C] text-white text-[14px] font-black px-3 py-1 rounded-lg">{sessionData?.category}</span>}
                                {sessionData?.participantsCount > 0 && <span className="text-[#8A8078] text-[14px] font-bold px-2">參與對話 {sessionData?.participantsCount} 人</span>}
                            </div>
                        </>
                    )}
                </div>
            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 px-6 py-6">
                {/* Left: Transcript */}
                <div className="lg:col-span-8">
                    <FadeIn>
                        {sessionData?.summary && (
                            <div className="mb-6 space-y-4">
                                <CollapsibleBox title="前言與紀錄" colorTheme="green" icon={Info}>
                                    <p className="whitespace-pre-wrap">{sessionData.summary}</p>
                                </CollapsibleBox>
                            </div>
                        )}
                        <div className="bg-white rounded-[2.5rem] shadow-sm border border-[#E8E0D4] overflow-hidden">
                            {sessionData?.status !== '已發布' || transcript.length === 0 ? (
                                <div className="py-24 text-center">
                                    <Info className="mx-auto w-14 h-14 text-[#C67B5C] mb-4 opacity-80" />
                                    <h4 className="text-[24px] font-black text-[#5A5347] mb-2" style={serif}>本場次筆記尚在整理中</h4>
                                    <p className="text-[18px] text-[#8A8078]">（徵求筆記中，未完成還原）</p>
                                </div>
                            ) : (
                                <>
                                    {/* 重要提示 */}
                                    <div className="p-5 bg-[#FBF7F0] border-b border-[#E8E0D4]">
                                        <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl border border-blue-100">
                                            <Info size={20} className="text-blue-500 mt-0.5 shrink-0" />
                                            <div className="text-[15px] text-blue-700 font-medium leading-relaxed">
                                                <p className="font-black mb-1">重要提示</p>
                                                <p>本筆記為集結多名專業人員及民眾筆記後謄寫之類逐字稿。點擊對話段落可查看特定評論，點擊 💬 發表見解。</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Transcript Lines */}
                                    <div className="p-4 md:p-6 space-y-1">
                                        {transcript.map((item, idx) => {
                                            if (item.role === '系統/旁白') {
                                                return (
                                                    <div key={item.id} className="py-8 text-center animate-in fade-in duration-500 delay-100">
                                                        <span className="bg-[#F9FBE7] text-[#7B8C4E] px-6 py-2 rounded-full text-[13px] font-black border border-[#7B8C4E]/20 uppercase tracking-widest">{item.content}</span>
                                                    </div>
                                                );
                                            }

                                            const rs = roleStyle(item.role);
                                            return (
                                                <motion.div key={item.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.03 }}
                                                    className={`group relative p-6 md:p-8 rounded-[1.8rem] transition-all cursor-pointer ${selectedParagraph === item.id ? `${rs.bg} ring-1 ${rs.border} shadow-inner` : 'hover:bg-gray-50 border border-transparent hover:border-gray-100'}`}
                                                    onClick={() => setSelectedParagraph(selectedParagraph === item.id ? null : item.id)}>
                                                    <div className="flex flex-col md:flex-row gap-2 md:gap-8">
                                                        <div className={`shrink-0 md:w-20 text-[14px] font-black pt-1.5 uppercase tracking-widest ${rs.text}`}>
                                                            {item.role.replace(/[🔴🟣🟢🔵]/g, '')}
                                                        </div>
                                                        <div className="flex-1">
                                                            {item.action && <span className="text-[12px] font-bold text-gray-500 mb-1.5 block tracking-widest">({item.action})</span>}
                                                            <div className={`text-[17px] md:text-lg leading-[1.9] ${selectedParagraph === item.id ? 'text-gray-900 font-bold' : 'text-[#3D3832] font-medium'}`}>{item.content}</div>
                                                        </div>
                                                    </div>
                                                    {/* Floating Toolbar */}
                                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all flex gap-2 items-center">
                                                        <LikeButton targetId={item.id} targetType="transcripts" initialCount={item.likeCount} size="md" />
                                                        <motion.button whileTap={{ scale: 0.9 }} onClick={(e) => { e.stopPropagation(); openCommentModal(item.id); }}
                                                            className="p-2 bg-white shadow-lg rounded-xl text-gray-400 hover:text-[#7B8C4E] transition-all border border-gray-100" title="發表見解">
                                                            <MessageSquare size={20} />
                                                        </motion.button>
                                                    </div>
                                                    {/* Comment indicator */}
                                                    {commentsCache[item.id]?.length > 0 && (
                                                        <div className={`absolute left-0.5 top-1/2 -translate-y-1/2 w-1 h-8 rounded-full opacity-60 ${rs.text.includes('7B8C4E') ? 'bg-[#7B8C4E]' : rs.text.includes('red') ? 'bg-red-400' : rs.text.includes('purple') ? 'bg-purple-400' : 'bg-blue-400'}`} />
                                                    )}
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                </>
                            )}
                        </div>
                    </FadeIn>
                </div>

                {/* Right: Comments */}
                <div className="lg:col-span-4">
                    <div className="sticky top-4">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-[22px] font-black flex items-center gap-2" style={serif}>
                                <MessageSquare size={22} className="text-[#7B8C4E]" />
                                專業評論
                                <span className="bg-[#7B8C4E] text-white text-[12px] px-2.5 py-0.5 rounded-full font-bold">
                                    {selectedParagraph ? `段落 ${transcript.findIndex(t => t.id === selectedParagraph) + 1}` : '全部'}
                                </span>
                            </h3>
                            {selectedParagraph && (
                                <button onClick={() => setSelectedParagraph(null)}
                                    className="text-[13px] font-bold text-gray-400 hover:text-gray-600 bg-gray-100 px-3 py-1 rounded-full flex items-center gap-1">清除過濾 <X size={12} /></button>
                            )}
                        </div>

                        <div className="space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto pr-1 custom-scrollbar">
                            {filteredComments.length === 0 ? (
                                <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-gray-100">
                                    <MessageSquare size={32} className="mx-auto text-[#D4CCC0] mb-3" />
                                    <p className="text-[18px] text-[#8A8078] font-bold">此段落尚無評論</p>
                                    <button onClick={() => openCommentModal(selectedParagraph || transcript[0]?.id || '')}
                                        className="mt-4 text-[#7B8C4E] text-[15px] font-black flex items-center gap-1 mx-auto hover:underline">
                                        立即撰寫見解 <ArrowRight size={14} />
                                    </button>
                                </div>
                            ) : (
                                filteredComments.map((comment: any, i: number) => (
                                    <FadeIn key={comment.id} delay={i * 0.05}>
                                        <motion.div whileHover={{ y: -2 }}
                                            className={`bg-white p-5 rounded-2xl shadow-sm border transition-all ${selectedParagraph === comment.targetLineId ? 'border-[#C5D9A8] shadow-md ring-1 ring-[#C5D9A8]' : 'border-[#E8E0D4]'}`}>
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-full bg-[#E3EED3] flex items-center justify-center text-[#7B8C4E] text-[13px] font-black"><User size={14} /></div>
                                                    <div>
                                                        <p className="text-[15px] font-black text-[#3D3832]">{comment.author}</p>
                                                        <p className="text-[11px] text-[#D4CCC0] font-bold">
                                                            {new Date(comment.createdAt).toLocaleDateString('zh-TW', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}
                                                        </p>
                                                    </div>
                                                </div>
                                                {!selectedParagraph && comment.targetLineId && (
                                                    <span className="text-[11px] bg-gray-50 text-gray-400 px-2 py-0.5 rounded-lg font-bold"># {transcript.findIndex(t => t.id === comment.targetLineId) + 1}</span>
                                                )}
                                            </div>
                                            <p className="text-[16px] text-[#5A5347] leading-relaxed font-medium">{comment.content}</p>
                                            <div className="flex items-center gap-4 mt-3 text-[14px] font-bold text-[#A09888]">
                                                <LikeButton initialCount={comment.likes || 0} size="sm" targetId={comment.id} targetType="interactions" />
                                            </div>
                                        </motion.div>
                                    </FadeIn>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
