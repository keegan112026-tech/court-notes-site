import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-black/20 backdrop-blur-md border-b border-white/10">
      <Link to="/" className="text-white font-bold text-lg tracking-wider" style={{ fontFamily: "'Noto Serif TC', serif" }}>
        觀庭筆記平台
      </Link>
      <div className="flex items-center space-x-6">
        <Link to="/sessions" className="text-white/80 hover:text-white transition-colors text-sm font-medium">場次列表</Link>
        <Link to="/forum" className="text-white/80 hover:text-white transition-colors text-sm font-medium">公開論壇</Link>
        <Link to="/about" className="text-white/80 hover:text-white transition-colors text-sm font-medium">關於計畫</Link>
      </div>
    </nav>
  );
}
