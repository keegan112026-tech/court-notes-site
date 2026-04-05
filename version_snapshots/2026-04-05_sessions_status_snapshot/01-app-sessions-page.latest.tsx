'use client';

import React from 'react';
import { motion, useScroll } from 'framer-motion';
import SubpageHeader from '@/components/SubpageHeader';
import SessionsOverviewSection from '@/components/SessionsOverviewSection';

export default function SessionsPage() {
  const { scrollYProgress } = useScroll();

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-20 font-sans text-gray-800 selection:bg-[#6B8E23]/20">
      <motion.div
        className="fixed left-0 right-0 top-0 z-[100] h-[3px] origin-left"
        style={{
          scaleX: scrollYProgress,
          background: 'linear-gradient(90deg, #6B8E23, #B8860B, #C67B5C)',
        }}
      />

      <SubpageHeader />
      <SessionsOverviewSection />
    </div>
  );
}
