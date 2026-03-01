'use client';
import React, { useState, useMemo } from 'react';
import { User, Info, MessageSquare, ThumbsUp as ThumbsUpIcon, Share2, X, ArrowRight, PenTool } from 'lucide-react';
import { MOCK_TRANSCRIPT_DATA } from '@/lib/mockData';

interface TranscriptViewProps {
    onBack: () => void;
    sessionId: string;
}

const TranscriptView: React.FC<TranscriptViewProps> = ({ onBack, sessionId }) => {
    const [selectedParagraph, setSelectedParagraph] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newComment, setNewComment] = useState("");
    const [authorName, setAuthorName] = useState("");
    const [likes, setLikes] = useState<Record<string, number>>({});

    // Mock Comments State
    const [comments, setComments] = useState([
        { id: 1, pId: 'p2', author: '資深社工 A', content: '這裡的詰問涉及了社工在案主家中的裁量權，值得討論。', likes: 5, time: '2025/02/03 10:30' },
        { id: 2, pId: 'p5', author: '法律研究員 B', content: '根據家暴法第XX條，這裡的程序處理其實是有爭議的。', likes: 12, time: '2025/02/03 11:15' },
        { id: 3, pId: 'p6', author: '實務夥伴 C', content: '密集追蹤的判斷基準在不同縣市可能有不同的內規，建議可以補充這部分的對照。', likes: 8, time: '2025/02/03 14:20' },
    ]);

    const handleLike = (id: string, e?: React.MouseEvent) => {
        e?.stopPropagation();
        setLikes(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
    };

    const openCommentModal = (pId: string) => {
        setSelectedParagraph(pId);
        setIsModalOpen(true);
    };

    const handleSubmitComment = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        const commentObj = {
            id: Date.now(),
            pId: selectedParagraph || 'general',
            author: authorName || "匿名夥伴",
            content: newComment,
            likes: 0,
            time: new Date().toLocaleString()
        };

        setComments([commentObj, ...comments]);
        setNewComment("");
        setIsModalOpen(false);
    };

    const filteredComments = useMemo(() => {
        if (!selectedParagraph) return comments;
        return comments.filter(c => c.pId === selectedParagraph);
    }, [selectedParagraph, comments]);

    return (
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 animate-in fade-in">
            {/* Comment Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl animate-in slide-in-bottom">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-black text-xl">發表見解</h3>
                            <button onClick={() => setIsModalOpen(false)}><X className="text-gray-400 hover:text-red-500" /></button>
                        </div>
                        <form onSubmit={handleSubmitComment} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">您的稱呼 (選填)</label>
                                <input
                                    value={authorName}
                                    onChange={e => setAuthorName(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#6B8E23]"
                                    placeholder="e.g. 兒保社工 C"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">見解內容</label>
                                <textarea
                                    value={newComment}
                                    onChange={e => setNewComment(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#6B8E23] min-h-[120px]"
                                    placeholder="請輸入您的專業觀察..."
                                />
                            </div>
                            <button type="submit" className="w-full bg-[#6B8E23] text-white font-black py-4 rounded-xl shadow-lg hover:shadow-xl transition-all">送出審核</button>
                        </form>
                    </div>
                </div>
            )}

            {/* Left: Transcript */}
            <div className="lg:col-span-8 space-y-6">
                <div className="bg-white rounded-[2rem] shadow-sm border border-[#EBE7E0] overflow-hidden">
                    <div className="p-8 sm:p-10 border-b border-gray-50 bg-gradient-to-br from-white to-[#FAFAFA]">
                        <button onClick={onBack} className="text-gray-400 text-xs font-bold mb-4 hover:text-[#6B8E23] flex items-center gap-1">← 返回列表</button>
                        <div className="flex flex-wrap items-center gap-3 mb-6">
                            <span className="bg-orange-100 text-orange-600 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter">
                                Case ID: {sessionId}
                            </span>
                            <span className="bg-gray-100 text-gray-500 text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1">
                                <User size={10} /> 5 位參與協作
                            </span>
                        </div>
                        <h2 className="text-3xl font-black mb-6 leading-tight text-gray-800">
                            關於「家庭支持系統」與「強制抽離」之辯論詰問
                        </h2>
                        <div className="flex items-start gap-4 p-4 bg-blue-50/50 rounded-2xl border border-blue-100/50">
                            <Info size={20} className="text-blue-500 mt-1 shrink-0" />
                            <p className="text-sm text-blue-700 leading-relaxed font-medium">
                                點擊對話段落可查看特定評論。針對內容有異議或想補充轉譯，請點擊段落右側的 <MessageSquare size={14} className="inline mx-0.5" /> 發表見解。
                            </p>
                        </div>
                    </div>

                    <div className="p-6 sm:p-10 space-y-1">
                        {MOCK_TRANSCRIPT_DATA.map((item) => (
                            <div
                                key={item.id}
                                className={`group relative p-5 rounded-2xl transition-all duration-300 cursor-pointer ${selectedParagraph === item.id
                                        ? 'bg-[#F9FBE7] shadow-inner'
                                        : 'hover:bg-gray-50'
                                    }`}
                                onClick={() => setSelectedParagraph(selectedParagraph === item.id ? null : item.id)}
                            >
                                <div className="flex gap-6">
                                    <div className={`shrink-0 w-16 text-xs font-black pt-1.5 uppercase tracking-wider ${item.role === '社工' ? 'text-[#6B8E23]' : 'text-gray-400'
                                        }`}>
                                        {item.role}
                                    </div>
                                    <div className="text-[1.05rem] leading-relaxed text-gray-700 font-medium">
                                        {item.text}
                                    </div>
                                </div>

                                {/* Floating Toolbar */}
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all flex gap-2">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); openCommentModal(item.id); }}
                                        className="p-3 bg-white shadow-xl rounded-2xl text-gray-500 hover:text-[#6B8E23] hover:scale-110 transition-all border border-gray-100"
                                        title="對此發表見解"
                                    >
                                        <MessageSquare size={20} />
                                    </button>
                                    <button
                                        onClick={(e) => handleLike(`p-like-${item.id}`, e)}
                                        className="p-3 bg-white shadow-xl rounded-2xl text-gray-500 hover:text-orange-500 hover:scale-110 transition-all border border-gray-100"
                                    >
                                        <ThumbsUpIcon size={20} />
                                    </button>
                                </div>

                                {/* Indicator Loop */}
                                {comments.some(c => c.pId === item.id) && (
                                    <div className="absolute left-1 top-1/2 -translate-y-1/2 w-1.5 h-10 bg-[#6B8E23] rounded-full opacity-60" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right: Comments */}
            <div className="lg:col-span-4 space-y-6">
                <div className="sticky top-28">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-black flex items-center gap-2 text-gray-800">
                            <MessageSquare size={22} className="text-[#6B8E23]" />
                            專業評論
                            <span className="bg-[#6B8E23] text-white text-[10px] px-2.5 py-0.5 rounded-full font-bold">
                                {selectedParagraph ? `段落 ${selectedParagraph.replace('p', '')}` : '全部'}
                            </span>
                        </h3>
                        {selectedParagraph && (
                            <button
                                onClick={() => setSelectedParagraph(null)}
                                className="text-xs font-bold text-gray-400 hover:text-gray-600 flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full transition-colors"
                            >
                                清除過濾 <X size={12} />
                            </button>
                        )}
                    </div>

                    <div className="space-y-4 max-h-[calc(100vh-350px)] overflow-y-auto pr-2 custom-scrollbar pb-10">
                        {filteredComments.length === 0 ? (
                            <div className="text-center py-24 bg-white rounded-[2rem] border-2 border-dashed border-gray-100">
                                <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                                    <MessageSquare size={24} />
                                </div>
                                <p className="text-gray-400 font-bold">此段落尚無評論</p>
                                <button
                                    onClick={() => openCommentModal(selectedParagraph || 'p1')}
                                    className="mt-6 text-[#6B8E23] text-sm font-black flex items-center gap-1 mx-auto hover:underline"
                                >
                                    立即撰寫見解 <ArrowRight size={14} />
                                </button>
                            </div>
                        ) : (
                            filteredComments.map(comment => (
                                <div
                                    key={comment.id}
                                    className={`bg-white p-6 rounded-[1.5rem] shadow-sm border border-[#EBE7E0] transition-all duration-500 transform ${selectedParagraph === comment.pId ? 'scale-[1.02] border-[#C5E1A5] shadow-lg ring-1 ring-[#C5E1A5]' : ''
                                        }`}
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                                                <User size={14} />
                                            </div>
                                            <div>
                                                <div className="text-sm font-black text-gray-700">{comment.author}</div>
                                                <div className="text-[10px] text-gray-300 font-bold">{comment.time}</div>
                                            </div>
                                        </div>
                                        {comment.pId && !selectedParagraph && (
                                            <span className="text-[10px] bg-gray-50 text-gray-400 px-2 py-1 rounded-lg"># {comment.pId.replace('p', '')}</span>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-600 leading-relaxed font-medium">{comment.content}</p>
                                    <div className="flex items-center gap-4 mt-4 text-xs font-black text-gray-300">
                                        <button className="flex items-center gap-1 hover:text-orange-400 transition-colors">
                                            <ThumbsUpIcon size={14} /> {comment.likes}
                                        </button>
                                        <button className="hover:text-gray-500 transition-colors">回覆</button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TranscriptView;
