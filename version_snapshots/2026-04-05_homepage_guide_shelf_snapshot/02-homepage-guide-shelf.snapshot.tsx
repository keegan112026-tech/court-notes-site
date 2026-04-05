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
                    </FadeIn>
                </div>
            </section>

            <section className="bg-[#FBF7F0] px-6 pb-10">
                <div className="mx-auto max-w-7xl">
                    <FadeIn>
                        <div className="overflow-hidden rounded-[2.25rem] border border-[#F1DDC0] bg-gradient-to-r from-[#FFF6EC] via-white to-[#F9FBE7] shadow-sm">
                            <div className="px-6 py-7 md:px-8 md:py-8">
                                <div className="grid gap-6 xl:grid-cols-[18rem_minmax(0,1fr)] xl:items-start">
                                    <div className="min-w-0 xl:max-w-[18rem]">
                                        <div className="inline-flex items-center gap-2 rounded-full bg-[#F9FBE7] px-4 py-2 text-[13px] font-black tracking-[0.16em] text-[#6B8E23]">
                                            <ShieldAlert size={14} />
                                            本站須知
                                        </div>
                                        <h3 className="mt-4 text-[30px] font-black leading-tight text-[#2D2A26] md:text-[38px]" style={serif}>
                                            平台限制與規範
                                        </h3>
                                        <div className="mt-6 flex flex-wrap gap-3">
                                            <Link href="/guide" className="inline-flex items-center gap-2 rounded-2xl bg-[#7B8C4E] px-5 py-3 text-[15px] font-black text-white shadow-[0_10px_24px_rgba(123,140,78,0.22)]">
                                                閱讀完整平台限制與規範
                                                <ArrowRight size={16} />
                                            </Link>
                                        </div>
                                    </div>

                                    <div className="grid gap-2.5 md:grid-cols-2 xl:mt-3 xl:grid-cols-5">
                                        {homepageGuidePanels.map((panel) => {
                                            const Icon = panel.icon;
                                            const active = homeGuidePanel === panel.id;
                                            return (
                                                <button
                                                    key={panel.id}
                                                    type="button"
                                                    onMouseEnter={() => goToHomeGuidePanel(panel.id)}
                                                    onClick={() => goToHomeGuidePanel(panel.id)}
                                                    className={`group min-h-[8.4rem] rounded-[1.15rem] border p-3 text-left transition-all ${panel.cardClass} ${active ? 'ring-2 ring-[#7B8C4E]/35 shadow-[0_10px_28px_rgba(123,140,78,0.12)]' : 'shadow-sm hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(65,56,44,0.08)]'}`}
                                                >
                                                    <div className={`mb-2 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/80 ${panel.iconClass}`}>
                                                        <Icon size={16} />
                                                    </div>
                                                    <p className="text-[15px] font-black leading-[1.2] text-[#2D2A26] xl:whitespace-nowrap" style={serif}>
                                                        {panel.label}
                                                    </p>
                                                    <p className="mt-1.5 text-[10px] font-bold leading-[1.5] text-[#7A7266]">
                                                        {panel.hint}
                                                    </p>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="mt-7 overflow-hidden rounded-[2rem] border border-[#E8E0D4] bg-gradient-to-br from-white via-[#FFFDF8] to-[#F7F3E8] p-5 shadow-[0_12px_32px_rgba(65,56,44,0.08)]">
                                    <div className="mb-4 flex items-center justify-end">
                                        <div className="flex items-center gap-2">
                                            <button
                                                type="button"
                                                aria-label="查看上一個首頁須知主題"
                                                onClick={goToPreviousHomeGuidePanel}
                                                className="inline-flex h-9 w-9 items-center justify-center rounded-2xl border border-[#E8E0D4] bg-white text-[#7B8C4E] transition-colors hover:bg-[#F5FAEB]"
                                            >
                                                <ChevronLeft size={17} />
                                            </button>
