/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import About from './pages/About';

function HomePlaceholder() {
  return (
    <div className="min-h-screen bg-[#FBF7F0] flex items-center justify-center flex-col gap-6">
      <h1 className="text-4xl font-bold" style={{ fontFamily: "'Noto Serif TC', serif" }}>社工共構觀庭筆記平台</h1>
      <p className="text-[#6A6054]">首頁建置中...</p>
      <a href="/about" className="px-6 py-3 bg-[#C67B5C] text-white rounded-full hover:bg-[#A86448] transition-colors">
        前往「關於計畫」
      </a>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePlaceholder />} />
        <Route path="/about" element={<About />} />
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
