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
    '法官🔴': { text: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' },
    '檢察官🟣': { text: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200' },
    '社工🟢': { text: 'text-[#7B8C4E]', bg: 'bg-emerald-50', border: 'border-emerald-200' },
    '辯護人🔵': { text: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
};
function roleStyle(role: string) {
    return ROLE_COLORS[role] || { text: 'text-gray-500', bg: 'bg-gray-50', border: 'border-gray-200' };
}

/* ── fallback transcript data (from GitHub Pages site) ── */
const FALLBACK_TRANSCRIPT = [
    { id: 'p1', lineId: 'L001', role: '法官🔴', content: '現在開始審理 113 年度OO字第XXX號案件。本日進行言詞辯論程序，請檢察官陳述起訴要旨。', order: 1, likeCount: 15 },
    { id: 'p2', lineId: 'L002', role: '檢察官🟣', content: '報告審判長，檢方起訴被告過失致死罪。被告身為兒童少年保護社工，依法負有訪視義務，卻未善盡注意義務、未依規定頻率進行訪視評估，致被害兒童長期處於高風險環境而未能及時發現異狀。', order: 2, likeCount: 42 },
    { id: 'p3', lineId: 'L003', role: '辯護人🔵', content: '審判長，辯護人認為檢方起訴邏輯有根本性瑕疵。將兒少保護體系的制度性缺失，歸責於一名基層社工個人，既不符合因果關係的法律要件，也違背兒少保護工作的專業特性。', order: 3, likeCount: 89 },
    { id: 'p4', lineId: 'L004', role: '檢察官🟣', content: '社工，你在 12 月 11 日當天進入案主家中時，是否有觀察到孩子身上有明顯外傷？', order: 4, likeCount: 28 },
    { id: 'p5', lineId: 'L005', role: '社工🟢', content: '當時孩子穿著長袖，我初步觀察面部沒有傷痕，但在訪談過程中，孩子神情顯得非常退縮。我有在訪視紀錄中載明此觀察。', order: 5, likeCount: 67 },
    { id: 'p6', lineId: 'L006', role: '辯護人🔵', content: '反對！檢察官的問題預設了社工「應該」在當次訪視中發現外傷，但忽略了家訪環境的諸多限制。', order: 6, likeCount: 55 },
    { id: 'p7', lineId: 'L007', role: '法官🔴', content: '辯護人的反對，本院不予採納。檢察官繼續詰問。', order: 7, likeCount: 20 },
    { id: 'p8', lineId: 'L008', role: '檢察官🟣', content: '社工，請回答關於「裁量權」的部分，你當時決定不帶走孩子，依據為何？', order: 8, likeCount: 33 },
    { id: 'p9', lineId: 'L009', role: '社工🟢', content: '我們是基於家庭支持系統的完整性評估，雖然有風險，但當下親屬資源尚能介入，所以採取密集追蹤而非立即強制抽離。這是依據風險評估工具與督導討論後做出的專業判斷。', order: 9, likeCount: 134 },
    { id: 'p10', lineId: 'L010', role: '辯護人🔵', content: '審判長，最後陳述——制度面的問題不解決，換誰來做都會出事。一個平均負擔 30-40 案的社工，在資源嚴重不足的情況下，被要求做出完美的判斷，這本身就是不可能的任務。請合議庭深思。', order: 10, likeCount: 201 },
];

export default function SessionDetailPage() {
    const params = useParams();
    const sessionId = params.id as string;

    const [transcript, setTranscript] = useState(FALLBACK_TRANSCRIPT);
    const [selectedParagraph, setSelectedParagraph] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [authorName, setAuthorName] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [submitMsg, setSubmitMsg] = useState('');
    const [comments, setComments] = useState([
        { id: 'c1', pId: 'p2', author: '資深社工 A', content: '這裡的詰問涉及了社工在案主家中的裁量權，值得討論。社工的裁量空間到底有多大？在資源不足的現實下，這個裁量往往是「最不壞的選擇」。', likes: 45, time: '2026/02/28 10:30' },
        { id: 'c2', pId: 'p5', author: '法律研究員 B', content: '根據兒少權法相關規定，社工的訪視紀錄是重要證據。這段陳述說明社工確實有觀察並記錄，但制度是否給予了足夠的時間和工具？', likes: 38, time: '2026/02/28 11:15' },
        { id: 'c3', pId: 'p9', author: '實務夥伴 C', content: '密集追蹤 vs 強制帶離——這是每個兒保社工每天都在面對的兩難。辯護人提到的「不可能的任務」確實是制度面的核心問題。', likes: 52, time: '2026/02/28 14:20' },
        { id: 'c4', pId: 'p10', author: '匿名心理師', content: '從心理學角度，一個案量 30-40 的社工長期處於高壓決策環境，burnout 風險極高。這不是個人能力問題，是系統性的勞動條件問題。', likes: 67, time: '2026/03/01 09:10' },
    ]);

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
                body: JSON.stringify({ targetLineId: selectedParagraph, author: authorName, content: newComment }),
            });
            const data = await res.json();
            if (data.ok) {
                setSubmitMsg('✅ 留言已送出，待審核後顯示');
                setComments([{ id: `local-${Date.now()}`, pId: selectedParagraph || '', author: authorName || '匿名夥伴', content: newComment, likes: 0, time: '剛剛（待審核）' }, ...comments]);
                setNewComment('');
                setTimeout(() => { setIsModalOpen(false); setSubmitMsg(''); }, 2000);
            } else {
                setSubmitMsg(`❌ ${data.error}`);
            }
        } catch { setSubmitMsg('❌ 網路錯誤'); } finally { setSubmitting(false); }
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
                    <h1 className="text-[32px] md:text-[42px] font-black leading-tight" style={serif}>檢察官論告與辯護律師簡報與陳述還原</h1>
                    <div className="flex flex-wrap items-center gap-3 mt-3">
                        <span className="bg-[#C67B5C] text-white text-[14px] font-black px-3 py-1 rounded-lg">一審審理庭第六場次</span>
                        <span className="text-[#7B8C4E] text-[16px] font-bold">114年度訴字第51號</span>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 px-6 py-6">
                {/* Left: Transcript */}
                <div className="lg:col-span-8">
                    <FadeIn>
                        <div className="bg-white rounded-2xl shadow-sm border border-[#E8E0D4] overflow-hidden">
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
                                    const rs = roleStyle(item.role);
                                    return (
                                        <motion.div key={item.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.03 }}
                                            className={`group relative p-4 rounded-xl transition-all cursor-pointer ${selectedParagraph === item.id ? `${rs.bg} shadow-inner ${rs.border} border` : 'hover:bg-gray-50'}`}
                                            onClick={() => setSelectedParagraph(selectedParagraph === item.id ? null : item.id)}>
                                            <div className="flex gap-4">
                                                <div className={`shrink-0 w-20 text-[14px] font-black pt-1 uppercase tracking-wide ${rs.text}`}>
                                                    {item.role.replace(/[🔴🟣🟢🔵]/g, '')}
                                                </div>
                                                <div className="flex-1 text-[18px] leading-[1.8] text-[#3D3832] font-medium">{item.content}</div>
                                            </div>
                                            {/* Floating Toolbar */}
                                            <div className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all flex gap-2">
                                                <motion.button whileTap={{ scale: 0.9 }} onClick={(e) => { e.stopPropagation(); openCommentModal(item.id); }}
                                                    className="p-2.5 bg-white shadow-lg rounded-xl text-gray-400 hover:text-[#7B8C4E] transition-all border border-gray-100" title="發表見解">
                                                    <MessageSquare size={18} />
                                                </motion.button>
                                            </div>
                                            {/* Like count indicator */}
                                            {item.likeCount > 0 && (
                                                <span className="absolute right-3 bottom-2 text-[12px] text-gray-300 font-bold">❤️ {item.likeCount}</span>
                                            )}
                                            {/* Comment indicator */}
                                            {comments.some(c => c.pId === item.id) && (
                                                <div className={`absolute left-0.5 top-1/2 -translate-y-1/2 w-1 h-8 rounded-full opacity-60 ${rs.text.includes('7B8C4E') ? 'bg-[#7B8C4E]' : rs.text.includes('red') ? 'bg-red-400' : rs.text.includes('purple') ? 'bg-purple-400' : 'bg-blue-400'}`} />
                                            )}
                                        </motion.div>
                                    );
                                })}
                            </div>
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
                                    <button onClick={() => openCommentModal(selectedParagraph || 'p1')}
                                        className="mt-4 text-[#7B8C4E] text-[15px] font-black flex items-center gap-1 mx-auto hover:underline">
                                        立即撰寫見解 <ArrowRight size={14} />
                                    </button>
                                </div>
                            ) : (
                                filteredComments.map((comment, i) => (
                                    <FadeIn key={comment.id} delay={i * 0.05}>
                                        <motion.div whileHover={{ y: -2 }}
                                            className={`bg-white p-5 rounded-2xl shadow-sm border transition-all ${selectedParagraph === comment.pId ? 'border-[#C5D9A8] shadow-md ring-1 ring-[#C5D9A8]' : 'border-[#E8E0D4]'}`}>
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-full bg-[#E3EED3] flex items-center justify-center text-[#7B8C4E] text-[13px] font-black"><User size={14} /></div>
                                                    <div>
                                                        <p className="text-[15px] font-black text-[#3D3832]">{comment.author}</p>
                                                        <p className="text-[11px] text-[#D4CCC0] font-bold">{comment.time}</p>
                                                    </div>
                                                </div>
                                                {!selectedParagraph && comment.pId && (
                                                    <span className="text-[11px] bg-gray-50 text-gray-400 px-2 py-0.5 rounded-lg font-bold"># {transcript.findIndex(t => t.id === comment.pId) + 1}</span>
                                                )}
                                            </div>
                                            <p className="text-[16px] text-[#5A5347] leading-relaxed font-medium">{comment.content}</p>
                                            <div className="flex items-center gap-4 mt-3 text-[14px] font-bold text-[#A09888]">
                                                <span className="flex items-center gap-1">❤️ {comment.likes}</span>
                                                <button className="hover:text-[#7B8C4E] transition-colors">回覆</button>
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
