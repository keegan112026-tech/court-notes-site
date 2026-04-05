// Snapshot: Homepage Guide Block
// Source: app/page.tsx:480-591

            <section className="bg-[#FBF7F0] px-6 pb-10">
                <div className="mx-auto max-w-7xl">
                    <FadeIn>
                        <div className="overflow-hidden rounded-[2.25rem] border border-[#F1DDC0] bg-gradient-to-r from-[#FFF6EC] via-white to-[#F9FBE7] shadow-sm">
                            <div className="px-6 py-7 md:px-8 md:py-8">
                                <div>
                                    <div className="inline-flex items-center gap-2 rounded-full bg-[#F9FBE7] px-4 py-2 text-[13px] font-black tracking-[0.16em] text-[#6B8E23]">
                                        <ShieldAlert size={14} />
                                        本站須知
                                    </div>
                                    <h3 className="mt-4 text-[30px] font-black leading-tight text-[#2D2A26] md:text-[38px]" style={serif}>
                                        平台限制與規範
                                        <br />
                                        先讀，再進還原筆記
                                    </h3>
                                    <p className="mt-4 text-[17px] font-medium leading-[1.95] text-[#6B6358]">
                                        這一塊獨立出來，先放網站的限制與規範、倫理守則、平台運作方式與問題意識。先理解網站怎麼讀，再往下接完整的還原筆記總覽。
                                    </p>
                                </div>

                                <div className="mt-6 flex flex-wrap gap-3">
                                    <Link href="/guide" className="inline-flex items-center gap-2 rounded-2xl bg-[#7B8C4E] px-5 py-3 text-[15px] font-black text-white shadow-[0_10px_24px_rgba(123,140,78,0.22)]">
                                        閱讀完整平台限制與規範
                                        <ArrowRight size={16} />
                                    </Link>
                                    <Link href="/sessions" className="inline-flex items-center gap-2 rounded-2xl border border-[#D8D1C5] bg-white px-5 py-3 text-[15px] font-black text-[#6B6358]">
                                        直接前往還原筆記總覽
                                    </Link>
                                </div>

                                <div className="mt-7 overflow-hidden rounded-[2rem] border border-[#E8E0D4] bg-gradient-to-br from-white via-[#FFFDF8] to-[#F7F3E8] p-5 shadow-[0_12px_32px_rgba(65,56,44,0.08)]">
                                    <div className="mb-4 flex items-center justify-between">
                                        <div>
                                            <p className="text-[12px] font-black uppercase tracking-[0.24em] text-[#A4A098]">內容櫥窗</p>
                                            <p className="mt-1 text-[14px] font-bold text-[#6B6358]">先讀限制與規範，再進入還原筆記共構頁面。</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                type="button"
                                                aria-label="查看上一個首頁須知主題"
                                                onClick={goToPreviousHomeGuidePanel}
                                                className="inline-flex h-9 w-9 items-center justify-center rounded-2xl border border-[#E8E0D4] bg-white text-[#7B8C4E] transition-colors hover:bg-[#F5FAEB]"
                                            >
                                                <ChevronLeft size={17} />
                                            </button>
                                            <button
                                                type="button"
                                                aria-label="查看下一個首頁須知主題"
                                                onClick={goToNextHomeGuidePanel}
                                                className="inline-flex h-9 w-9 items-center justify-center rounded-2xl border border-[#E8E0D4] bg-white text-[#7B8C4E] transition-colors hover:bg-[#F5FAEB]"
                                            >
                                                <ChevronRight size={17} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="mb-4 flex flex-wrap gap-2">
                                        {homepageGuidePanels.map((panel) => {
                                            const Icon = panel.icon;
                                            const active = homeGuidePanel === panel.id;
                                            return (
                                                <button
                                                    key={panel.id}
                                                    type="button"
                                                    onMouseEnter={() => goToHomeGuidePanel(panel.id)}
                                                    onClick={() => goToHomeGuidePanel(panel.id)}
                                                    className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-[14px] font-black transition-all ${active ? 'bg-[#7B8C4E] text-white shadow-sm' : 'bg-[#F6F1E7] text-[#6B6358] hover:bg-[#EEF4DB] hover:text-[#5A6F35]'}`}
                                                >
                                                    <Icon size={14} />
                                                    <span>{panel.label}</span>
                                                </button>
                                            );
                                        })}
                                    </div>

                                    <div className="min-h-[230px] overflow-hidden">
                                        <AnimatePresence mode="wait" initial={false}>
                                            <motion.div
                                                key={activeHomeGuidePanel.id}
                                                initial={{ opacity: 0, x: homeGuideDirection > 0 ? 42 : -42 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: homeGuideDirection > 0 ? -42 : 42 }}
                                                transition={{ duration: 0.24, ease: 'easeInOut' }}
                                                className={`h-full rounded-[1.5rem] border p-5 ${activeHomeGuidePanel.accentClass}`}
                                            >
                                                <h4 className="text-[28px] font-black leading-tight text-[#2D2A26]" style={serif}>
                                                    {activeHomeGuidePanel.title}
                                                </h4>
                                                <p className="mt-4 text-[16px] font-medium leading-[1.9] text-[#5A5347]">
                                                    {activeHomeGuidePanel.body}
                                                </p>
                                            </motion.div>
                                        </AnimatePresence>
                                    </div>

                                    <div className="mt-4 flex items-center justify-center gap-2">
                                        {homepageGuidePanels.map((panel) => (
                                            <button
                                                key={panel.id}
                                                type="button"
                                                aria-label={`切換到${panel.title}`}
                                                onClick={() => goToHomeGuidePanel(panel.id)}
                                                className={`h-2.5 rounded-full transition-all ${homeGuidePanel === panel.id ? 'w-8 bg-[#7B8C4E]' : 'w-2.5 bg-[#DAD4C8] hover:bg-[#C3CF9D]'}`}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </FadeIn>
                </div>
            </section>
