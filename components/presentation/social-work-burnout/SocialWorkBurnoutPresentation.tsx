'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Expand,
  Minimize,
  MonitorPlay,
  ScrollText,
  SquareTerminal,
} from 'lucide-react';
import {
  PRESENTATION_MODES,
  PRESENTATION_SUBTITLE,
  PRESENTATION_TITLE,
  type PresentationMode,
  SOCIAL_WORK_BURNOUT_SLIDES,
} from '@/data/presentations/social-work-burnout';
import { cn } from '@/lib/utils';
import { BurnoutSlideScene } from './BurnoutSlideScene';

const serif = { fontFamily: "'Noto Serif TC', serif" };

const modeIcons = {
  audience: ScrollText,
  speaker: SquareTerminal,
  projection: MonitorPlay,
} satisfies Record<PresentationMode, typeof ScrollText>;

const slides = SOCIAL_WORK_BURNOUT_SLIDES;

function clampSlideIndex(index: number) {
  return Math.min(slides.length - 1, Math.max(0, index));
}

function parseInitialState() {
  if (typeof window === 'undefined') {
    return { mode: 'audience' as PresentationMode, slideIndex: 0 };
  }

  const params = new URLSearchParams(window.location.search);
  const modeParam = params.get('mode');
  const slideParam = params.get('slide');
  const mode = PRESENTATION_MODES.some((item) => item.id === modeParam)
    ? (modeParam as PresentationMode)
    : 'audience';
  const rawSlideIndex = Number(slideParam ?? '1') - 1;
  const slideIndex = Number.isFinite(rawSlideIndex) ? clampSlideIndex(rawSlideIndex) : 0;

  return { mode, slideIndex };
}

function ModeButton({
  active,
  description,
  icon: Icon,
  label,
  onClick,
}: {
  active: boolean;
  description: string;
  icon: typeof ScrollText;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'group flex min-w-[11rem] flex-1 flex-col rounded-[1.5rem] border px-4 py-4 text-left transition-all',
        active
          ? 'border-[#d89a83] bg-[#fff3ec] text-[#8c4f3f] shadow-[0_18px_40px_rgba(162,94,74,0.12)]'
          : 'border-[#d9e1e7] bg-white/78 text-[#516878] hover:border-[#bfd0db] hover:bg-white',
      )}
    >
      <div className="flex items-center gap-3">
        <div
          className={cn(
            'flex h-10 w-10 items-center justify-center rounded-2xl',
            active ? 'bg-[#f4d4c7]' : 'bg-[#edf4f7] text-[#668197]',
          )}
        >
          <Icon size={18} />
        </div>
        <div className="text-sm font-black">{label}</div>
      </div>
      <div className="mt-3 text-sm leading-relaxed text-current/80">{description}</div>
    </button>
  );
}

function OutlineButton({
  active,
  chapter,
  kicker,
  title,
  onClick,
}: {
  active: boolean;
  chapter: string;
  kicker: string;
  title: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'group w-full rounded-[1.4rem] border px-4 py-4 text-left transition-all',
        active
          ? 'border-[#d89a83] bg-[#fff3ec] text-[#8c4f3f] shadow-[0_18px_34px_rgba(162,94,74,0.12)]'
          : 'border-[#d8e1e7] bg-white/78 text-[#536a79] hover:border-[#c4d2dc] hover:bg-white',
      )}
    >
      <div className="text-[11px] font-black uppercase tracking-[0.22em] text-current/65">Chapter {chapter}</div>
      <div className="mt-2 text-sm font-bold text-current/75">{kicker}</div>
      <div className="mt-1 text-base font-black leading-snug">{title}</div>
    </button>
  );
}

export function SocialWorkBurnoutPresentation() {
  const initialState = useMemo(parseInitialState, []);
  const [mode, setMode] = useState<PresentationMode>(initialState.mode);
  const [activeSlideIndex, setActiveSlideIndex] = useState(initialState.slideIndex);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  const activeSlide = slides[activeSlideIndex];

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const params = new URLSearchParams(window.location.search);
    params.set('mode', mode);
    params.set('slide', String(activeSlideIndex + 1));
    const nextUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, '', nextUrl);
  }, [activeSlideIndex, mode]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  useEffect(() => {
    if (mode === 'audience') {
      return;
    }

    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight' || event.key === 'PageDown') {
        setActiveSlideIndex((current) => clampSlideIndex(current + 1));
      }

      if (event.key === 'ArrowLeft' || event.key === 'PageUp') {
        setActiveSlideIndex((current) => clampSlideIndex(current - 1));
      }
    };

    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, [mode]);

  useEffect(() => {
    if (mode !== 'audience') {
      return;
    }

    const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-burnout-slide-section]'));
    if (!sections.length) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((left, right) => right.intersectionRatio - left.intersectionRatio)[0];

        if (!visibleEntry) {
          return;
        }

        const nextIndex = Number(visibleEntry.target.getAttribute('data-slide-index'));
        if (Number.isFinite(nextIndex)) {
          setActiveSlideIndex(nextIndex);
        }
      },
      {
        rootMargin: '-25% 0px -40% 0px',
        threshold: [0.2, 0.45, 0.7],
      },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [mode]);

  const goToSlide = (index: number) => {
    const nextIndex = clampSlideIndex(index);
    setActiveSlideIndex(nextIndex);

    if (mode === 'audience') {
      const slideId = slides[nextIndex]?.id;
      const target = slideId ? document.getElementById(slideId) : null;
      target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      await rootRef.current?.requestFullscreen();
      return;
    }

    await document.exitFullscreen();
  };

  const renderAudienceMode = () => (
    <div className="grid gap-6 xl:grid-cols-[18rem_minmax(0,1fr)]">
      <aside className="xl:sticky xl:top-6 xl:self-start">
        <div className="rounded-[2rem] border border-[#d7e0e6] bg-white/82 p-5 shadow-[0_24px_44px_rgba(72,95,112,0.08)]">
          <div className="text-[11px] font-black uppercase tracking-[0.24em] text-[#768d9d]">導覽</div>
          <div className="mt-4 space-y-3">
            {slides.map((slide, index) => (
              <OutlineButton
                key={slide.id}
                active={index === activeSlideIndex}
                chapter={slide.chapter}
                kicker={slide.kicker}
                title={slide.title}
                onClick={() => goToSlide(index)}
              />
            ))}
          </div>
        </div>
      </aside>

      <div className="space-y-8">
        {slides.map((slide, index) => (
          <section
            key={slide.id}
            id={slide.id}
            data-burnout-slide-section
            data-slide-index={index}
            className="rounded-[2.2rem] border border-[#d7e0e6] bg-white/78 p-5 shadow-[0_24px_44px_rgba(72,95,112,0.08)] md:p-7"
          >
            <div className="grid gap-7 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
              <div className="space-y-5">
                <div className="space-y-3">
                  <div className="text-[11px] font-black uppercase tracking-[0.26em] text-[#788f9f]">
                    Chapter {slide.chapter} · {slide.kicker}
                  </div>
                  <h2 className="text-3xl font-black leading-tight text-[#2f4554] md:text-[2.45rem]" style={serif}>
                    {slide.title}
                  </h2>
                  <p className="text-lg font-bold text-[#9a5a48]">{slide.headline}</p>
                  <p className="text-[15px] leading-8 text-[#586e7e]">{slide.audienceSummary}</p>
                </div>

                <div className="grid gap-3">
                  {slide.highlights.map((highlight) => (
                    <div
                      key={highlight.title}
                      className="rounded-[1.4rem] border border-[#d9e1e7] bg-[#f7fafb] px-4 py-4"
                    >
                      <div className="text-sm font-black text-[#365061]">{highlight.title}</div>
                      <div className="mt-2 text-sm leading-7 text-[#637988]">{highlight.detail}</div>
                    </div>
                  ))}
                </div>

                <div className="rounded-[1.5rem] border border-[#ecd4c5] bg-[#fff5ef] px-4 py-4 text-sm leading-7 text-[#795448]">
                  <div className="text-[11px] font-black uppercase tracking-[0.22em] text-[#9a6e5d]">講者摘要</div>
                  <ul className="mt-3 space-y-2">
                    {slide.speakerNotes.map((note) => (
                      <li key={note}>{note}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <BurnoutSlideScene slide={slide} variant="audience" />
            </div>
          </section>
        ))}
      </div>
    </div>
  );

  const renderFocusedMode = () => (
    <div
      className={cn(
        'grid gap-6',
        mode === 'speaker'
          ? 'xl:grid-cols-[18rem_minmax(0,1.1fr)_minmax(18rem,0.82fr)]'
          : 'xl:grid-cols-[16rem_minmax(0,1fr)]',
      )}
    >
      {!isFullscreen ? (
        <aside className="xl:sticky xl:top-6 xl:self-start">
          <div className="rounded-[2rem] border border-[#d7e0e6] bg-white/82 p-5 shadow-[0_24px_44px_rgba(72,95,112,0.08)]">
            <div className="text-[11px] font-black uppercase tracking-[0.24em] text-[#768d9d]">切頁</div>
            <div className="mt-4 space-y-3">
              {slides.map((slide, index) => (
                <OutlineButton
                  key={slide.id}
                  active={index === activeSlideIndex}
                  chapter={slide.chapter}
                  kicker={slide.kicker}
                  title={slide.title}
                  onClick={() => goToSlide(index)}
                />
              ))}
            </div>
          </div>
        </aside>
      ) : null}

      <div className="space-y-4">
        <div
          className={cn(
            'rounded-[2rem] border border-[#d7e0e6] bg-white/78 shadow-[0_24px_44px_rgba(72,95,112,0.08)]',
            mode === 'projection' ? 'overflow-hidden' : 'p-4 md:p-5',
          )}
        >
          <div
            className={cn(
              'flex flex-wrap items-center justify-between gap-3 border-b border-[#e6edf1] px-4 py-4',
              mode === 'projection' && isFullscreen ? 'bg-white/18 text-white backdrop-blur' : 'bg-transparent',
            )}
          >
            <div>
              <div className="text-[11px] font-black uppercase tracking-[0.24em] text-current/60">
                Chapter {activeSlide.chapter} · {activeSlide.kicker}
              </div>
              <div className="mt-1 text-lg font-black text-current">{activeSlide.title}</div>
            </div>

            <div className="flex items-center gap-2">
              {mode === 'projection' ? (
                <button
                  type="button"
                  onClick={toggleFullscreen}
                  className={cn(
                    'inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold transition-colors',
                    isFullscreen
                      ? 'border-white/35 bg-white/10 text-white hover:bg-white/18'
                      : 'border-[#d7e0e6] bg-white text-[#49606f] hover:border-[#c2d0d9]',
                  )}
                >
                  {isFullscreen ? <Minimize size={16} /> : <Expand size={16} />}
                  {isFullscreen ? '離開全螢幕' : '進入全螢幕'}
                </button>
              ) : null}

              <button
                type="button"
                onClick={() => goToSlide(activeSlideIndex - 1)}
                disabled={activeSlideIndex === 0}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#d7e0e6] bg-white text-[#49606f] transition-colors hover:border-[#c2d0d9] disabled:cursor-not-allowed disabled:opacity-45"
                aria-label="上一頁"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                onClick={() => goToSlide(activeSlideIndex + 1)}
                disabled={activeSlideIndex === slides.length - 1}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#d7e0e6] bg-white text-[#49606f] transition-colors hover:border-[#c2d0d9] disabled:cursor-not-allowed disabled:opacity-45"
                aria-label="下一頁"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          <div
            className={cn(
              mode === 'projection'
                ? 'bg-[linear-gradient(180deg,rgba(24,38,50,0.98),rgba(30,44,57,0.96))] p-4 md:p-6'
                : 'p-4 md:p-5',
            )}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={`${mode}-${activeSlide.id}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.26, ease: 'easeOut' }}
                className={cn(mode === 'projection' ? 'mx-auto max-w-[1180px]' : '')}
              >
                <BurnoutSlideScene slide={activeSlide} variant="focused" />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {!isFullscreen ? (
          <div className="rounded-[1.7rem] border border-[#d7e0e6] bg-white/82 px-5 py-4 text-sm text-[#607684] shadow-[0_18px_34px_rgba(72,95,112,0.08)]">
            左右方向鍵或 PageUp / PageDown 可切頁。現在是第 {activeSlideIndex + 1} / {slides.length} 頁。
          </div>
        ) : null}
      </div>

      {mode === 'speaker' && !isFullscreen ? (
        <aside className="xl:sticky xl:top-6 xl:self-start">
          <div className="rounded-[2rem] border border-[#d7e0e6] bg-white/82 p-5 shadow-[0_24px_44px_rgba(72,95,112,0.08)]">
            <div className="text-[11px] font-black uppercase tracking-[0.24em] text-[#768d9d]">講者模式</div>
            <h3 className="mt-3 text-xl font-black text-[#314856]">{activeSlide.headline}</h3>
            <p className="mt-3 text-sm leading-7 text-[#5f7482]">{activeSlide.summary}</p>

            <div className="mt-5 space-y-3">
              {activeSlide.speakerNotes.map((note, index) => (
                <div key={note} className="rounded-[1.35rem] border border-[#ead6ca] bg-[#fff5ef] px-4 py-4">
                  <div className="text-[11px] font-black uppercase tracking-[0.18em] text-[#9b715e]">
                    Note {index + 1}
                  </div>
                  <div className="mt-2 text-sm leading-7 text-[#775547]">{note}</div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      ) : null}
    </div>
  );

  return (
    <div
      ref={rootRef}
      className={cn(
        'min-h-screen bg-[radial-gradient(circle_at_top,#f5efe5,transparent_38%),linear-gradient(180deg,#eef4f7_0%,#fbf8f2_100%)] px-4 py-6 text-[#2d2a26] md:px-6',
        mode === 'projection' && isFullscreen ? 'px-0 py-0 text-white' : '',
      )}
    >
      <div className={cn('mx-auto max-w-[1440px]', mode === 'projection' && isFullscreen ? 'max-w-none' : '')}>
        {!isFullscreen ? (
          <header className="mb-6 rounded-[2.3rem] border border-[#d7e0e6] bg-white/80 p-5 shadow-[0_26px_48px_rgba(72,95,112,0.08)] md:p-7">
            <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
              <div className="space-y-4">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 rounded-full border border-[#d7e0e6] bg-white px-4 py-2 text-sm font-bold text-[#516879] transition-colors hover:border-[#c2d0d9]"
                >
                  <ArrowLeft size={16} />
                  返回首頁
                </Link>

                <div className="space-y-3">
                  <div className="text-[11px] font-black uppercase tracking-[0.28em] text-[#7a90a0]">
                    Interactive Teaching Deck
                  </div>
                  <h1 className="text-[2.2rem] font-black leading-tight text-[#304654] md:text-[3.2rem]" style={serif}>
                    {PRESENTATION_TITLE}
                  </h1>
                  <p className="max-w-3xl text-[15px] leading-8 text-[#5d7382]">{PRESENTATION_SUBTITLE}</p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3 xl:w-[42rem]">
                {PRESENTATION_MODES.map((item) => {
                  const Icon = modeIcons[item.id];
                  return (
                    <ModeButton
                      key={item.id}
                      active={mode === item.id}
                      description={item.description}
                      icon={Icon}
                      label={item.label}
                      onClick={() => setMode(item.id)}
                    />
                  );
                })}
              </div>
            </div>
          </header>
        ) : null}

        {mode === 'audience' ? renderAudienceMode() : renderFocusedMode()}
      </div>
    </div>
  );
}
