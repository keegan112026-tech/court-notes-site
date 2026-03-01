'use client';
import React from 'react';
import { PenTool, Menu } from 'lucide-react';

interface NavbarProps {
    onNavigate: (view: string) => void;
    currentView: string;
}

const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentView }) => {
    return (
        <nav className="fixed top-0 inset-x-0 z-50 bg-white border-b border-[#EBE7E0] px-4 lg:px-12 py-3 flex justify-between items-center shadow-sm">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('home')}>
                <div className="bg-[#6B8E23] p-1.5 rounded-xl text-white shadow-md">
                    <PenTool size={20} />
                </div>
                <h1 className="text-xl font-black text-[#6B8E23] tracking-tighter">觀庭共構筆記</h1>
            </div>

            <div className="hidden lg:flex items-center gap-8">
                <button onClick={() => onNavigate('sessions_list')} className={`text-sm font-bold hover:text-[#6B8E23] ${currentView === 'sessions_list' ? 'text-[#6B8E23]' : 'text-gray-500'}`}>場次列表</button>
                <button className="text-sm font-bold text-gray-400 hover:text-[#6B8E23] cursor-not-allowed">知識庫</button>
                <button onClick={() => onNavigate('about')} className={`text-sm font-bold hover:text-[#6B8E23] ${currentView === 'about' ? 'text-[#6B8E23]' : 'text-gray-500'}`}>計劃源起</button>
                <button className="text-sm font-bold text-gray-400 hover:text-[#6B8E23] cursor-not-allowed">投稿須知</button>
            </div>

            <div className="flex items-center gap-4">
                <button className="bg-[#6B8E23] text-white px-6 py-2 rounded-full text-xs font-black shadow-lg shadow-olive-100 hover:scale-105 transition-all">我要投稿</button>
                <button className="lg:hidden"><Menu size={24} /></button>
            </div>
        </nav>
    );
};

export default Navbar;
