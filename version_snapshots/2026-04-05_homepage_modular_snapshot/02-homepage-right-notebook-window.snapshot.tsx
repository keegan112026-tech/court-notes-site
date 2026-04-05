// Snapshot: Homepage Hero Right Notebook Window
// Source: app/page.tsx:341-475

                    <FadeIn delay={0.18}>
                        <motion.div whileHover={{ y: -4, boxShadow: '0 18px 42px rgba(123,140,78,0.12)' }} className="relative self-start overflow-hidden rounded-[2rem] border border-[#E8E0D4] bg-white/90 shadow-md">
                            <motion.div
                                aria-hidden="true"
                                animate={{ opacity: [0.18, 0.32, 0.18], scale: [1, 1.05, 1] }}
                                transition={{ duration: 5.6, repeat: Infinity, ease: 'easeInOut' }}
                                className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[#DCE7AE] blur-3xl"
                            />
                            <div className="relative z-10 px-5 py-4">
                                <div className="inline-flex items-center gap-2 rounded-full bg-[#FFF4E5] px-3.5 py-1.5 text-[12px] font-black tracking-[0.16em] text-[#C67B5C]">
                                    <Flame size={14} />
                                    完整筆記櫥窗
                                </div>
                                <h3 className="mt-3.5 text-[24px] font-black leading-[1.18] text-[#2D2A26]" style={serif}>
                                    目前已發布的完整筆記
                                    <br />
                                    與跨場次工作檯
                                </h3>
                                <p className="mt-2.5 text-[14px] font-medium leading-[1.85] text-[#6B6358]">
                                    以下是目前最新還原筆記，點入即可撰寫觀庭共構筆記喔！
                                </p>

                                <div className="mt-4 overflow-hidden rounded-[1.65rem] border border-[#E8E0D4] bg-gradient-to-br from-white via-[#FFFDF8] to-[#F7F3E8] p-4 shadow-[0_12px_32px_rgba(65,56,44,0.08)]">
                                    <div className="mb-3 flex items-center justify-between">
                                        <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#A4A098]">內容預覽</p>
                                        {sessions.length > 1 && (
                                            <div className="flex items-center gap-2">
                                                <button
                                                    type="button"
                                                    aria-label="查看上一筆首頁完整筆記"
                                                    onClick={goToPreviousHeroSession}
                                                    className="inline-flex h-8 w-8 items-center justify-center rounded-2xl border border-[#E8E0D4] bg-white text-[#7B8C4E] transition-colors hover:bg-[#F5FAEB]"
                                                >
                                                    <ChevronLeft size={15} />
                                                </button>
                                                <button
                                                    type="button"
                                                    aria-label="查看下一筆首頁完整筆記"
                                                    onClick={goToNextHeroSession}
                                                    className="inline-flex h-8 w-8 items-center justify-center rounded-2xl border border-[#E8E0D4] bg-white text-[#7B8C4E] transition-colors hover:bg-[#F5FAEB]"
                                                >
                                                    <ChevronRight size={15} />
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {loading ? (
                                        <div className="space-y-4">
                                            <Skeleton className="h-7 w-28 rounded-full bg-[#F4E7D9]" />
                                            <Skeleton className="h-8 w-full rounded-2xl bg-[#F6EEE3]" />
                                            <Skeleton className="h-8 w-5/6 rounded-2xl bg-[#F6EEE3]" />
                                            <Skeleton className="h-32 w-full rounded-[1.5rem] bg-[#F7F3E8]" />
                                        </div>
                                    ) : (
                                        <>
                                            <AnimatePresence mode="wait" initial={false}>
                                                <motion.div
                                                    key={activeHeroSession?.sessionId ?? 'fallback'}
                                                    initial={{ opacity: 0, x: 18 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    exit={{ opacity: 0, x: -18 }}
                                                    transition={{ duration: 0.24, ease: 'easeInOut' }}
                                                    className="rounded-[1.45rem] border border-[#F1DDC0] bg-[#FFF9F2] p-4"
                                                >
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <span className="rounded-full bg-[#C67B5C] px-3 py-1 text-xs font-black uppercase tracking-wider text-white shadow-sm">
                                                            單場次
                                                        </span>
                                                        <span className="rounded-full bg-orange-100 px-3 py-1 text-sm font-black text-orange-700">
                                                            {activeHeroSession?.date ?? '2026-02-26'}
                                                        </span>
                                                    </div>
                                                    <h4 className="mt-3 text-[22px] font-black leading-tight text-[#2D2A26]" style={serif}>
                                                        {activeHeroSession?.title ?? '第六場次：最終言詞辯論'}
                                                    </h4>
                                                    <p className="mt-2.5 text-[14px] font-medium leading-[1.85] text-[#6B6358]">
                                                        {activeHeroSession?.summary ?? '檢察官論告與辯護律師簡報陳述還原。'}
                                                    </p>
                                                    <Link
                                                        href={activeHeroSession ? `/sessions/${activeHeroSession.sessionId}` : '/sessions'}
                                                        className="mt-4 inline-flex items-center gap-2 text-[14px] font-black text-[#6B8E23]"
                                                    >
                                                        點擊閱覽完整筆記
                                                        <ArrowRight size={16} />
                                                    </Link>
                                                </motion.div>
                                            </AnimatePresence>

                                            {sessions.length > 1 && (
                                                <div className="mt-3 flex items-center justify-center gap-2">
                                                    {sessions.map((session, index) => (
                                                        <button
                                                            key={session.sessionId ?? index}
                                                            type="button"
                                                            aria-label={`切換到首頁第 ${index + 1} 筆完整筆記`}
                                                            onClick={() => setHeroSessionIndex(index)}
                                                            className={`h-2.5 rounded-full transition-all ${index === heroSessionIndex ? 'w-8 bg-[#7B8C4E]' : 'w-2.5 bg-[#DAD4C8] hover:bg-[#C3CF9D]'}`}
                                                        />
                                                    ))}
                                                </div>
                                            )}

                                            <div className="mt-3 overflow-hidden rounded-[1.3rem] border border-[#E8E0D4] bg-white shadow-sm">
                                                <Link
                                                    href="/guide"
                                                    className="group flex items-center justify-between px-4 py-3 transition-colors hover:bg-[#F9FBE7]"
                                                >
                                                    <p className="min-w-0 text-[15px] font-black leading-tight text-[#2D2A26] md:text-[16px]" style={serif}>
                                                        先進行教學再進入觀庭筆記共構（推薦）
                                                    </p>
                                                    <span className="ml-4 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-2xl bg-[#F9FBE7] text-[#7B8C4E] transition-transform group-hover:translate-x-1">
                                                        <ArrowRight size={14} />
                                                    </span>
                                                </Link>

                                                <div className="h-px bg-[#EEE6DA]" />

                                                <Link
                                                    href="/sessions/compose"
                                                    className="group flex items-center justify-between px-4 py-3 transition-colors hover:bg-[#FFFDF8]"
                                                >
                                                    <p className="min-w-0 text-[15px] font-black leading-tight text-[#2D2A26] md:text-[16px]" style={serif}>
                                                        直接進入觀庭筆記共構（跨場次版面）
                                                    </p>
                                                    <span className="ml-4 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-2xl border border-[#D8D1C5] bg-[#FFFDF8] text-[#6B6358] transition-transform group-hover:translate-x-1">
                                                        <ArrowRight size={14} />
                                                    </span>
                                                </Link>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </motion.div>
