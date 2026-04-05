        loadHomepageData();

        return () => {
            cancelled = true;
        };
    }, []);

    useEffect(() => {
        if (sessions.length === 0) return;
        setHeroSessionIndex((current) => Math.min(current, sessions.length - 1));
    }, [sessions.length]);

    useEffect(() => {
        if (sessions.length <= 1) return;

        const timer = window.setInterval(() => {
            setHeroSessionIndex((current) => (current + 1) % sessions.length);
        }, 6500);

        return () => window.clearInterval(timer);
    }, [sessions.length]);

    const navItems = PUBLIC_NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        return { ...item, icon: <Icon className={item.homeIconClass} /> };
    });
    const activeHeroSession = sessions[heroSessionIndex];

    function goToPreviousHeroSession() {
        if (sessions.length <= 1) return;
        setHeroSessionIndex((current) => (current === 0 ? sessions.length - 1 : current - 1));
    }

    function goToNextHeroSession() {
        if (sessions.length <= 1) return;
        setHeroSessionIndex((current) => (current + 1) % sessions.length);
    }

    function goToHomeGuidePanel(nextId: string) {
        const currentIndex = homepageGuidePanels.findIndex((panel) => panel.id === homeGuidePanel);
        const nextIndex = homepageGuidePanels.findIndex((panel) => panel.id === nextId);
        setHomeGuideDirection(nextIndex > currentIndex ? 1 : -1);
        setHomeGuidePanel(nextId);
    }

    function goToPreviousHomeGuidePanel() {
        const currentIndex = homepageGuidePanels.findIndex((panel) => panel.id === homeGuidePanel);
        const nextIndex = currentIndex === 0 ? homepageGuidePanels.length - 1 : currentIndex - 1;
        setHomeGuideDirection(-1);
        setHomeGuidePanel(homepageGuidePanels[nextIndex].id);
    }

    function goToNextHomeGuidePanel() {
        const currentIndex = homepageGuidePanels.findIndex((panel) => panel.id === homeGuidePanel);
        const nextIndex = (currentIndex + 1) % homepageGuidePanels.length;
        setHomeGuideDirection(1);
        setHomeGuidePanel(homepageGuidePanels[nextIndex].id);
    }


    /* ── Demo data (will be replaced by Notion CMS when entries exist) ── */
    // const hotNotes = [
    //     { rank: 1, title: '檢察官論告——為何聚焦「未依規定訪視」？', likes: 387, views: 2841, session: '第六場次' },
    //     { rank: 2, title: '辯護律師陳述——制度性缺失不應由個人承擔', likes: 342, views: 2103, session: '第六場次' },
    //     { rank: 3, title: '合議庭詰問社工督導——知情不報的灰色地帶', likes: 298, views: 1854, session: '第五場次' },
    // ];
    // const hotComments = [
    //     { author: '匿名社工A', content: '身為兒保社工五年，這段論告讓我心涼——我們每天做的就是在資源不足下做「最不壞的選擇」...', likes: 156, role: '兒少保護' },
    //     { author: '匿名社工B', content: '制度面的問題不解決，換誰來做都會出事。辯護律師講到點上了。', likes: 134, role: '安置機構' },
    //     { author: '匿名心理師', content: '從心理師角度看，這段詰問反映了跨專業溝通的斷裂——社工與心理師之間的語言不同...', likes: 112, role: '諮商心理' },
    // ];
    // const hotArticles = [
    //     { title: '從剴剴案看台灣兒少保護體系的結構性困境', author: '跨域共構小組', likes: 231, tag: '專題分析' },
    //     { title: '社工訪視頻率與風險評估——實務與法規的落差', author: '匿名資深社工', likes: 189, tag: '實務論述' },
    //     { title: '收出養媒合制度：北中南差異有多大？', author: '匿名社工C', likes: 167, tag: '經驗分享' },
    // ];

    return (
        <div className="min-h-screen overflow-x-hidden" style={{ backgroundColor: '#FBF7F0', color: '#2D2A26', fontSize: '18px' }}>
            {/* 滾動進度條 */}
            <motion.div className="fixed top-0 left-0 right-0 h-[3px] z-[100] origin-left"
                style={{ scaleX: scrollYProgress, background: 'linear-gradient(90deg, #7B8C4E, #B8860B, #C67B5C)' }} />

            {/* Beta Banner */}
            <div className="relative z-50 bg-gradient-to-r from-[#5a6e38] via-[#7B8C4E] to-[#8a9d58] text-white text-[15px] font-bold text-center py-2 tracking-wider shadow-sm">
                <motion.span animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 2, repeat: Infinity }} className="inline-block mr-2 text-yellow-200">●</motion.span>
                {BETA_NOTICE}
            </div>

            {/* Navbar */}
            <motion.nav initial={{ y: -80 }} animate={{ y: 0 }} transition={{ duration: 0.5, ease: 'easeOut' }}
                className={`sticky top-0 z-40 transition-all duration-300 border-b ${scrolled ? 'bg-[#FBF7F0]/95 backdrop-blur-xl shadow-md border-[#E8E0D4]' : 'bg-[#FBF7F0] border-transparent'}`}>
                <div className="max-w-7xl mx-auto px-6 py-2 flex justify-between items-center">
                    <Link href="/" className="flex items-center gap-3">
                        <motion.div whileHover={{ rotate: 15, scale: 1.1 }} transition={{ type: 'spring', stiffness: 300 }}
                            className="bg-gradient-to-br from-[#7B8C4E] to-[#5a6e38] p-2.5 rounded-xl text-white shadow-md"><PenTool size={22} /></motion.div>
                        <div>
                            <h1 className="text-[20px] font-black leading-tight" style={serif}>{SITE_NAME}</h1>
                            <p className="text-[11px] text-[#A09888] font-bold tracking-[0.15em]">{SITE_TAGLINE}</p>
                        </div>
                    </Link>
                    <div className="hidden lg:flex items-center gap-0">
                        {navItems.map(item => (
                            <Link key={item.name} href={item.href}
                                className="relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-[15px] font-bold text-[#5A5347] hover:text-[#7B8C4E] hover:bg-[#7B8C4E]/8 transition-all group whitespace-nowrap">
                                {item.icon}<span>{item.name}</span>
                                <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 h-[2px] bg-[#7B8C4E] rounded-full w-0 group-hover:w-6 transition-all duration-300" />
                            </Link>
                        ))}
                    </div>
                    <button className="lg:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={28} /> : <Menu size={28} />}</button>
                </div>
                <AnimatePresence>
                    {menuOpen && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                            className="lg:hidden bg-[#FBF7F0] border-t border-[#E8E0D4] overflow-hidden">
                            <div className="p-4 space-y-1">
                                {navItems.map(item => (
                                    <Link key={item.name} href={item.href} onClick={() => setMenuOpen(false)}
                                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-[20px] font-bold text-[#5A5347] hover:bg-[#7B8C4E]/10">{item.icon}{item.name}</Link>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.nav>

            {/* ═══ Hero ═══ */}
