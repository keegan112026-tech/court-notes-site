import React, { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import { HomeView } from './components/HomeView';
import { TranscriptView } from './components/TranscriptView';

const App = () => {
    const [currentPage, setCurrentPage] = useState('home');
    const [showToast, setShowToast] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [currentPage]);

    const handleComingSoon = (e) => {
        if (e) e.preventDefault();
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    return (
        <div className="min-h-screen bg-[#FAFAFA] text-gray-800 font-sans selection:bg-[#6B8E23]/20 scroll-smooth">
            {currentPage === 'home' ? (
                <HomeView onEnterTranscript={() => setCurrentPage('transcript')} onComingSoon={handleComingSoon} />
            ) : (
                <TranscriptView onBack={() => setCurrentPage('home')} onComingSoon={handleComingSoon} />
            )}

            {showToast && (
                <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-gray-900/95 backdrop-blur-md text-white px-6 py-3 rounded-2xl text-sm font-bold shadow-2xl flex items-center gap-3 z-[100] animate-in fade-in slide-in-from-bottom-5 duration-300">
                    <AlertCircle size={18} className="text-orange-400" />
                    此功能正在進行封閉測試，即將開放。
                </div>
            )}
        </div>
    );
};

export default App;
