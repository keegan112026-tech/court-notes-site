'use client';
import React from 'react';
import { PenTool, Info, BookOpen, Scale, Award, ThumbsUp, MessageSquare, ArrowRight } from 'lucide-react';
import { MOCK_NOTION_DATA } from '@/lib/mockData';

interface HomeViewProps {
    onNavigate: (view: string, id?: string) => void;
}

const QuickLinkCard = ({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) => (
    <div className="bg-white p-8 rounded-3xl border border-[#EBE7E0] hover:shadow-lg transition-all group cursor-pointer space-y-4">
        <div className="text-3xl group-hover:scale-110 transition-transform w-fit">{icon}</div>
        <h4 className="font-black text-gray-800">{title}</h4>
        <p className="text-xs text-gray-400 leading-relaxed font-bold">{desc}</p>
    </div>
);

const HomeView: React.FC<HomeViewProps> = ({ onNavigate }) => {
    return (
        <div className="max-w-7xl mx-auto px-4 lg:px-12 py-8 space-y-20 animate-in fade-in duration-500">

            {/* 網站目的說明 */}
            <section className="bg-white rounded-[3rem] p-8 lg:p-20 shadow-xl border border-[#EBE7E0] grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative overflow-hidden">
                <div className="space-y-8 relative z-10">
                    <h2 className="text-4xl lg:text-6xl font-black text-gray-800 leading-tight tracking-tighter">
                        將法庭交鋒，<br /><span className="text-[#6B8E23]">轉譯</span>為專業實務累積。
                    </h2>
                    <p className="text-lg text-gray-500 font-medium leading-relaxed italic">
                        "{MOCK_NOTION_DATA.session_meta.purpose}"
                    </p>
                    <div className="flex flex-wrap gap-4 pt-4">
                        <button onClick={() => onNavigate('sessions_list')} className="bg-[#6B8E23] text-white px-10 py-4 rounded-2xl font-black shadow-2xl hover:scale-105 transition-all">進入觀庭列表</button>
                        <button onClick={() => onNavigate('about')} className="bg-gray-50 text-gray-400 px-10 py-4 rounded-2xl font-black hover:bg-gray-100">計劃說明</button>
                    </div>
                </div>
                <div className="hidden lg:block">
                    <div className="bg-[#F9FBE7] aspect-square rounded-[4rem] p-12 flex flex-col justify-center gap-8 relative shadow-inner border border-[#6B8E23]/10">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-orange-500 font-black text-sm uppercase"><Award size={18} /> 精選論述</div>
                            <p className="text-gray-600 font-serif italic text-lg leading-relaxed line-clamp-4">「社工的裁量權並非法律的空白處，而是基於兒少最佳利益專業評估後的臨床判斷...」</p>
                            <p className="text-[10px] font-black text-gray-300">— 資深保護社工 A</p>
                        </div>
                        <PenTool className="absolute -right-8 -bottom-8 w-40 h-40 text-[#6B8E23] opacity-10 rotate-12" />
                    </div>
                </div>
            </section>

            {/* 快速選單 */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <QuickLinkCard icon={<Info className="text-blue-500" />} title="觀庭須知" desc="第一次旁聽嗎？這裡有關於法庭禮儀與法律用語的基礎介紹。" />
                <QuickLinkCard icon={<BookOpen className="text-[#6B8E23]" />} title="案件先備知識" desc="由團隊整理的權威性法律與實務背景資料，協助您理解攻防重點。" />
                <QuickLinkCard icon={<Scale className="text-orange-500" />} title="免責聲明與規範" desc="參與共構前請務必閱讀關於隱私保護與投稿之法律責任細則。" />
            </section>

            {/* 發燒推薦場次 */}
            <section className="space-y-8">
                <div className="flex justify-between items-end border-b border-gray-100 pb-4">
                    <h3 className="text-2xl font-black flex items-center gap-3">精選話題 <ThumbsUp className="text-orange-500" size={24} /></h3>
                    <span className="text-xs font-black text-gray-300 tracking-widest uppercase">Weekly Trending</span>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {MOCK_NOTION_DATA.trending.map(item => (
                        <div
                            key={item.id}
                            onClick={() => onNavigate('transcript', item.id)}
                            className="bg-white border border-[#EBE7E0] p-8 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all cursor-pointer flex justify-between items-center group"
                        >
                            <div className="space-y-3">
                                <span className="text-[10px] font-black text-gray-300 uppercase">Case Study ｜ {item.id}</span>
                                <h4 className="text-xl font-black text-gray-700 group-hover:text-[#6B8E23] transition-colors">{item.title}</h4>
                                <div className="flex items-center gap-4 text-[10px] font-black text-gray-400">
                                    <span className="flex items-center gap-1"><ThumbsUp size={12} /> {item.likes} 人認同</span>
                                    <span className="flex items-center gap-1"><MessageSquare size={12} /> {item.comments} 則論述</span>
                                </div>
                            </div>
                            <ArrowRight className="text-[#6B8E23] group-hover:translate-x-2 transition-transform" />
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default HomeView;
