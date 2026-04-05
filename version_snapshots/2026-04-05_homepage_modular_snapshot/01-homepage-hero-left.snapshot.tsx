// Snapshot: Homepage Hero Left
// Source: app/page.tsx:272-338

            <section id="mission" className="relative overflow-hidden border-b border-[#E8E0D4] bg-gradient-to-b from-[#F5EFE4] to-[#FBF7F0] px-6 pt-10 pb-8">
                <WarmGradientBg />
                <div className="relative z-10 mx-auto grid max-w-7xl gap-7 xl:grid-cols-[1.08fr_0.92fr] xl:items-start">
                    <div className="min-w-0">
                        <FadeIn>
                            <motion.div whileHover={{ scale: 1.05 }} className="inline-flex items-center gap-2 rounded-full border border-[#7B8C4E]/20 bg-white/60 px-5 py-2 text-[15px] font-black tracking-wider text-[#7B8C4E] shadow-sm cursor-default backdrop-blur-sm">
                                <motion.span animate={{ rotate: [0, -10, 10, 0] }} transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}><Gavel size={16} /></motion.span>
                                專業人員與大眾的事件論述共構
                            </motion.div>
                        </FadeIn>
                        <FadeIn delay={0.1}>
                            <h2 className="mt-5 text-[48px] font-black leading-[1.1] tracking-tight md:text-[64px] lg:text-[72px]" style={serif}>
                                <span className="block">觀庭還原筆記</span>
                                <span className="relative inline-block text-[#7B8C4E]">共構平台
                                    <motion.svg className="absolute -bottom-3 left-0 w-full" height="14" viewBox="0 0 200 14" preserveAspectRatio="none"
                                        initial={{ pathLength: 0, opacity: 0 }} whileInView={{ pathLength: 1, opacity: 1 }} transition={{ duration: 1.8, delay: 0.6, ease: 'easeOut' }}>
                                        <motion.path d="M4 10 Q 50 2 100 8 Q 150 14 196 6" stroke="#C5D9A8" strokeWidth="6" strokeLinecap="round" fill="transparent"
                                            initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} transition={{ duration: 1.8, delay: 0.6 }} />
                                    </motion.svg>
                                </span>
                            </h2>
                        </FadeIn>
                        <FadeIn delay={0.2}>
                            <div className="mt-5 max-w-3xl text-[20px] md:text-[22px] text-[#6B6358] font-medium leading-[1.9]">
                                <p>這不只是一份開庭紀錄，而是一場<strong className="text-[#2D2A26]">化血淚為滋養</strong>的集體療癒與重建。</p>
                                <p className="mt-2">
                                    <span className="text-[#7B8C4E] font-bold">
                                        <TypeWriter texts={['唯有直視真實，才能共構未來', '讓我們去除籓籬', '用專業視角為這個事件留下註腳', '不造神・重文字・匿名化・去權威', '讓人們不再遭逢此難']} speed={120} />
                                    </span>
                                </p>
                            </div>
                        </FadeIn>
                        <FadeIn delay={0.3}>
                            <div className="mt-6 flex flex-wrap items-center gap-4">
                                <Link href="/sessions">
                                    <motion.button whileHover={{ scale: 1.05, boxShadow: '0 16px 40px rgba(123,140,78,0.3)' }} whileTap={{ scale: 0.97 }}
                                        className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#7B8C4E] to-[#5a6e38] px-10 py-4 text-[22px] font-black text-white shadow-lg shadow-[#7B8C4E]/20 transition-all">
                                        <span className="relative z-10 flex items-center gap-3">點我看現場還原！ <ArrowRight size={22} className="group-hover:translate-x-2 transition-transform" /></span>
                                    </motion.button>
                                </Link>
                                <Link href="/about">
                                    <motion.span className="inline-block cursor-pointer rounded-2xl border-2 border-[#D4CCC0] px-8 py-4 text-[20px] font-bold text-[#6B6358] transition-all hover:border-[#7B8C4E] hover:text-[#7B8C4E]">計畫緣起 →</motion.span>
                                </Link>
                            </div>
                        </FadeIn>
                        <FadeIn delay={0.4}>
                            <div className="mt-6 flex gap-10 text-center">
                                {[
                                    { n: stats.totalSessions, l: '場開庭紀錄' },
                                    { n: stats.restoredSessions, l: '場已還原' },
                                    { n: stats.publishedArticles, l: '篇觀點文章', s: '+' }
                                ].map((s, i) => (
                                    <div key={i}>
                                        <div className="flex min-h-[54px] items-center justify-center">
                                            {loading ? (
                                                <Skeleton className="h-10 w-20 rounded-xl bg-[#E4EBCF]" />
                                            ) : (
                                                <p className="text-[36px] font-black text-[#7B8C4E]" style={serif}>
                                                    <Counter target={s.n} suffix={'s' in s ? s.s as string : undefined} />
                                                </p>
                                            )}
                                        </div>
                                        <p className="text-[14px] font-bold text-[#A09888]">{s.l}</p>
                                    </div>
                                ))}
                            </div>
                        </FadeIn>
