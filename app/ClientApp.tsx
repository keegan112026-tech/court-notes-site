'use client';
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HomeView from '@/components/HomeView';
import SessionsListView from '@/components/SessionsListView';
import TranscriptView from '@/components/TranscriptView';
import AboutView from '@/components/AboutView';

const ClientApp = () => {
    const [view, setView] = useState('home');
    const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);

    const navigateTo = (v: string, id?: string) => {
        setView(v);
        if (id) setSelectedSessionId(id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-[#FDFBF7] text-[#333] font-sans">
            <Navbar onNavigate={navigateTo} currentView={view} />

            <div className="pt-20 lg:pt-24 min-h-screen">
                {view === 'home' && <HomeView onNavigate={navigateTo} />}
                {view === 'sessions_list' && <SessionsListView onNavigate={navigateTo} />}
                {view === 'transcript' && selectedSessionId && (
                    <TranscriptView
                        onBack={() => navigateTo('sessions_list')}
                        sessionId={selectedSessionId}
                    />
                )}
                {view === 'about' && <AboutView />}
            </div>

            <Footer />
        </div>
    );
};

export default ClientApp;
