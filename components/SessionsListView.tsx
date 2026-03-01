'use client';
import React from 'react';
import { ArrowRight, Calendar, User } from 'lucide-react';
import { MOCK_NOTION_DATA } from '@/lib/mockData';

interface SessionsListViewProps {
    onNavigate: (view: string, id: string) => void;
}

const SessionsListView: React.FC<SessionsListViewProps> = ({ onNavigate }) => {
    return (
        <div className="max-w-5xl mx-auto px-4 py-12 space-y-12 animate-in slide-in-bottom duration-500 pb-32">
            <div className="text-center space-y-2">
                <h2 className="text-3xl font-black">觀庭場次列表</h2>
                <p className="text-gray-400 font-medium">請選擇您感興趣的場次進入閱讀與共構</p>
            </div>
            <div className="space-y-4">
                {MOCK_NOTION_DATA.sessions.map(session => (
                    <div
                        key={session.id}
                        onClick={() => onNavigate('transcript', session.id)}
                        className="bg-white border border-[#EBE7E0] p-8 rounded-3xl shadow-sm hover:shadow-xl hover:scale-[1.01] transition-all cursor-pointer flex flex-col md:flex-row justify-between items-center group gap-6"
                    >
                        <div className="flex-1 space-y-2">
                            <div className="flex gap-2">
                                {session.tags?.map(tag => (
                                    <span key={tag} className="bg-gray-100 text-gray-500 text-[10px] font-black px-3 py-1 rounded-full">{tag}</span>
                                ))}
                                {session.hot && <span className="bg-orange-100 text-orange-500 text-[10px] font-black px-3 py-1 rounded-full">HOT</span>}
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 group-hover:text-[#6B8E23]">{session.title}</h3>
                            <div className="flex items-center gap-4 text-xs font-bold text-gray-400">
                                <span className="flex items-center gap-1"><Calendar size={12} /> {session.date}</span>
                                <span className="flex items-center gap-1"><User size={12} /> {session.status || "已發布"}</span>
                            </div>
                        </div>
                        <div className="bg-[#6B8E23]/10 p-3 rounded-full text-[#6B8E23] group-hover:bg-[#6B8E23] group-hover:text-white transition-colors">
                            <ArrowRight size={20} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SessionsListView;
