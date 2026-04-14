'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import SubpageHeader from '@/components/SubpageHeader';
import {
    ArrowLeft,
    BookOpen,
    Calendar,
    Layers3,
    MessageSquare,
    Send,
    User,
} from 'lucide-react';
import { toast } from 'sonner';
import { FadeIn, LikeButton } from '@/components/ui-shared';
import { getSessionDisplayTitle, getTranscriptCitationMap } from '@/lib/local-data';
import { sanitizeArticleHtml } from '@/lib/content-security';

const serif = { fontFamily: "'Noto Serif TC', serif" };

type CitationPreview = {
    key: string;
    lineId: string;
    sessionSlug: string;
    sessionTitle: string;
    speaker: string;
    content: string;
    top: number;
    left: number;
    placement: 'above' | 'below';
};

type ForumPost = {
    id: string;
    author: string;
    title: string;
    content: string;
    category?: string;
    targetTopic?: string;
    targetSessionId?: string;
    sourceSessionIds?: string[];
    likes: number;
    createdAt: string;
};

type ForumComment = {
    id: string;
    author: string;
    content: string;
    likes: number;
    createdAt: string;
};

export default function ForumPostPage() {
    const params = useParams();
    const router = useRouter();
    const postId = params.id as string;

    const [post, setPost] = useState<ForumPost | null>(null);
    const [comments, setComments] = useState<ForumComment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [newComment, setNewComment] = useState('');
    const [authorName, setAuthorName] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [submitMsg, setSubmitMsg] = useState('');
    const [citationPreview, setCitationPreview] = useState<CitationPreview | null>(null);
    const articleRef = useRef<HTMLDivElement>(null);
    const citationCacheRef = useRef(new Map<string, ReturnType<typeof getTranscriptCitationMap>[string] | null>());

    useEffect(() => {
        fetch(`/api/forum/${postId}`)
            .then((r) => r.json())
            .then((data) => {
                if (data.ok) {
                    setPost(data.data.post);
                    setComments(Array.isArray(data.data.comments) ? data.data.comments : []);
                    return;
                }

                setError(data.error || '讀取文章失敗');
            })
            .catch(() => setError('無法載入文章內容'))
            .finally(() => setLoading(false));
    }, [postId]);

    useEffect(() => {
        if (!articleRef.current || !post) return;

        const cites = Array.from(articleRef.current.querySelectorAll<HTMLElement>('cite[data-line][data-session]'));

        cites.forEach((cite) => {
            const lineId = cite.getAttribute('data-line') || '';
            const sessionSlug = cite.getAttribute('data-session') || '';

            cite.classList.add(
                'rounded-md',
                'bg-[#F9FBE7]',
                'px-1.5',
                'py-0.5',
                'text-[#6B8E23]',
                'not-italic',
                'font-bold',
                'cursor-pointer',
                'transition-colors',
                'hover:bg-[#EEF5D8]',
                'focus-visible:bg-[#EEF5D8]',
                'focus-visible:outline-none',
                'focus-visible:ring-2',
                'focus-visible:ring-[#C8D79A]'
            );
            cite.setAttribute('role', 'button');
            cite.setAttribute('tabindex', '0');
            cite.setAttribute('aria-label', `查看引用原文：${getSessionDisplayTitle(sessionSlug)} ${lineId}`);
        });

        return () => {
            setCitationPreview(null);
        };
    }, [post]);

    useEffect(() => {
        if (!citationPreview) return;

        const dismissPreview = () => setCitationPreview(null);

        window.addEventListener('scroll', dismissPreview, true);
        window.addEventListener('resize', dismissPreview);

        return () => {
            window.removeEventListener('scroll', dismissPreview, true);
            window.removeEventListener('resize', dismissPreview);
        };
    }, [citationPreview]);

    const getCitationLine = (sessionSlug: string, lineId: string) => {
        const cacheKey = `${sessionSlug}:${lineId}`;
        if (citationCacheRef.current.has(cacheKey)) {
            return citationCacheRef.current.get(cacheKey) || null;
        }

        const citationMap = getTranscriptCitationMap(sessionSlug);
        const line = citationMap[lineId] || null;
        citationCacheRef.current.set(cacheKey, line);
        return line;
    };

    const buildCitationPreview = (cite: HTMLElement): CitationPreview | null => {
        const lineId = cite.getAttribute('data-line') || '';
        const sessionSlug = cite.getAttribute('data-session') || '';
        if (!lineId || !sessionSlug) return null;

        const line = getCitationLine(sessionSlug, lineId);
        if (!line?.content) return null;

        const rect = cite.getBoundingClientRect();
        const cardWidth = 320;
        const left = Math.min(
            Math.max(16, rect.left),
            Math.max(16, window.innerWidth - cardWidth - 16)
        );
        const placement = rect.bottom + 180 > window.innerHeight ? 'above' : 'below';

        return {
            key: `${sessionSlug}:${lineId}`,
            lineId,
            sessionSlug,
            sessionTitle: getSessionDisplayTitle(sessionSlug),
            speaker: line.speaker || line.role || '未標示說話者',
            content: line.content,
            left,
            top: placement === 'above' ? rect.top - 12 : rect.bottom + 12,
            placement,
        };
    };

    const handleCitationHover = (target: EventTarget | null) => {
        const cite = target instanceof HTMLElement
            ? target.closest<HTMLElement>('cite[data-line][data-session]')
            : null;

        if (!cite || !articleRef.current?.contains(cite)) {
            setCitationPreview((current) => (current ? null : current));
            return;
        }

        const preview = buildCitationPreview(cite);
        if (!preview) return;

        setCitationPreview((current) => (current?.key === preview.key ? current : preview));
    };

    const handleCitationActivate = (target: EventTarget | null) => {
        const cite = target instanceof HTMLElement
            ? target.closest<HTMLElement>('cite[data-line][data-session]')
            : null;

        if (!cite || !articleRef.current?.contains(cite)) return;

        const lineId = cite.getAttribute('data-line') || '';
        const sessionSlug = cite.getAttribute('data-session') || '';

        if (!sessionSlug || !lineId) return;
        router.push(`/sessions/${sessionSlug}#line-${lineId}`);
    };

    const handleCitationKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key !== 'Enter' && event.key !== ' ') return;

        const cite = event.target instanceof HTMLElement
            ? event.target.closest<HTMLElement>('cite[data-line][data-session]')
            : null;
        if (!cite || !articleRef.current?.contains(cite)) return;

        event.preventDefault();
        handleCitationActivate(cite);
    };

    const handleSubmitComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        setSubmitting(true);
        try {
            const res = await fetch('/api/comments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    targetLineId: postId,
                    author: authorName,
                    content: newComment,
                    type: 'article-comment',
                }),
            });
            const data = await res.json();

            if (data.ok) {
                const message = data.message || '留言已送出，待審核後公開';
                setSubmitMsg(message);
                toast.success(message);
                setNewComment('');
                setTimeout(() => setSubmitMsg(''), 3000);
            } else {
                const message = data.error || '留言送出失敗';
                setSubmitMsg(message);
                toast.error(message);
            }
        } catch {
            const message = '留言送出失敗';
            setSubmitMsg(message);
            toast.error(message);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <div className="flex min-h-screen items-center justify-center bg-[#FAFAFA] font-bold text-gray-500">載入文章中...</div>;
    }

    if (error || !post) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center space-y-4 bg-[#FAFAFA]">
                <h2 className="text-2xl font-black text-gray-800" style={serif}>{error || '讀取文章失敗'}</h2>
                <Link href="/forum" className="font-bold text-[#6B8E23] hover:underline">返回觀庭筆記匯集區</Link>
            </div>
        );
    }

    const formattedDate = new Date(post.createdAt).toLocaleDateString('zh-TW', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
    const safePostContent = sanitizeArticleHtml(post.content);

    return (
        <>
            <SubpageHeader variant="light" />
            <div className="min-h-screen bg-[#FAFAFA] pb-20 font-sans text-gray-800 selection:bg-[#6B8E23]/20">
                <div className="relative overflow-hidden border-b border-gray-100 bg-white shadow-sm">
                    <div className="pointer-events-none absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-[#F9FBE7] to-transparent" />
                    <div className="relative z-10 mx-auto max-w-6xl px-6 py-8">
                        <Link
                            href="/forum"
                            className="mb-6 inline-flex items-center gap-2 rounded-full border border-gray-100 bg-gray-50 px-4 py-2 text-sm font-bold text-gray-500 shadow-sm transition-colors hover:text-[#6B8E23]"
                        >
                            <ArrowLeft size={16} />
                            返回觀庭筆記匯集區
                        </Link>
                        <div className="mb-4 flex flex-wrap items-center gap-2">
                            <span className="rounded-full bg-[#E9EDDA] px-3 py-1 text-sm font-black tracking-widest text-[#6B8E23]">
                                {post.category || '觀庭文章'}
                            </span>
                            {post.targetTopic && (
                                <span className="rounded-full border border-orange-100 bg-orange-50 px-3 py-1 text-sm font-bold text-orange-600">
                                    #{post.targetTopic}
                                </span>
                            )}
                            {post.targetSessionId && (
                                <span className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-sm font-bold text-blue-700">
                                    主要場次 {getSessionDisplayTitle(post.targetSessionId)}
                                </span>
                            )}
                        </div>
                        <h1 className="mb-6 text-3xl font-black leading-tight text-gray-900 md:text-5xl" style={serif}>
                            {post.title}
                        </h1>
                        <div className="flex flex-wrap items-center gap-6 text-sm font-medium text-gray-500">
                            <span className="flex items-center gap-1.5"><User size={16} /> {post.author || '匿名作者'}</span>
                            <span className="flex items-center gap-1.5"><Calendar size={16} /> {formattedDate}</span>
                            <LikeButton initialCount={post.likes} targetId={post.id} targetType="interactions" size="sm" />
                        </div>
                    </div>
                </div>

                <main className="mx-auto max-w-6xl px-6 pt-12">
                    <FadeIn>
                        <div className="mb-12 rounded-[2rem] border border-gray-100 bg-white p-8 shadow-sm md:p-12 lg:p-14">
                            {post.sourceSessionIds && post.sourceSessionIds.length > 0 && (
                                <div className="mb-8 rounded-2xl border border-[#E8E0D4] bg-[#FBF7F0] p-5">
                                    <div className="mb-3 flex flex-wrap items-center gap-2">
                                        <span className="inline-flex items-center gap-2 rounded-full bg-[#F9FBE7] px-3 py-1 text-sm font-black text-[#5A6F35]">
                                            <Layers3 size={15} />
                                            來源場次
                                        </span>
                                        {post.sourceSessionIds.length > 1 && (
                                            <Link
                                                href="/sessions/compose"
                                                className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-sm font-black text-[#6B8E23] ring-1 ring-[#DDE6C8] hover:bg-[#F9FBE7]"
                                            >
                                                <BookOpen size={14} />
                                                前往跨場工作檯
                                            </Link>
                                        )}
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {post.sourceSessionIds.map((sessionId) => (
                                            <Link
                                                key={sessionId}
                                                href={`/sessions/${sessionId}`}
                                                className="rounded-full bg-white px-3 py-1 text-sm font-black text-[#6B6358] ring-1 ring-[#E8E0D4] hover:text-[#6B8E23]"
                                            >
                                                {getSessionDisplayTitle(sessionId)}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div
                                ref={articleRef}
                                className="prose prose-lg max-w-none prose-p:leading-[2] prose-p:text-gray-700 prose-a:text-[#6B8E23]"
                                onMouseOver={(event) => handleCitationHover(event.target)}
                                onFocus={(event) => handleCitationHover(event.target)}
                                onMouseLeave={() => setCitationPreview(null)}
                                onClick={(event) => handleCitationActivate(event.target)}
                                onKeyDown={handleCitationKeyDown}
                                dangerouslySetInnerHTML={{ __html: safePostContent }}
                            />
                            <p className="mt-6 text-sm font-bold text-[#8A8078]">
                                引述內容僅供交叉比對與閱讀脈絡參照，請以各場次原始還原筆記與工作檯內容為準。
                            </p>
                        </div>
                    </FadeIn>

                    <FadeIn delay={0.1}>
                        <div className="space-y-8">
                            <h3 className="flex items-center gap-2 text-2xl font-black text-gray-900" style={serif}>
                                <MessageSquare className="text-[#6B8E23]" />
                                留言（{comments.length}）
                            </h3>

                            <div className="space-y-4">
                                {comments.length === 0 ? (
                                    <p className="rounded-2xl border border-gray-100 bg-gray-50 py-8 text-center font-bold text-gray-400">
                                        目前還沒有留言，歡迎留下你的觀點。
                                    </p>
                                ) : (
                                    comments.map((comment, index) => (
                                        <div key={comment.id || index} className="space-y-3 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                                            <div className="flex items-center justify-between">
                                                <span className="rounded bg-[#F9FBE7] px-2 py-1 text-sm font-black text-[#6B8E23]">
                                                    {comment.author}
                                                </span>
                                                <span className="text-[11px] font-bold text-gray-400">
                                                    {new Date(comment.createdAt).toLocaleString('zh-TW', {
                                                        year: 'numeric',
                                                        month: 'numeric',
                                                        day: 'numeric',
                                                    })}
                                                </span>
                                            </div>
                                            <p className="whitespace-pre-wrap text-[15px] font-medium leading-relaxed text-gray-700">{comment.content}</p>
                                            <div className="flex items-center gap-4 pt-2">
                                                <LikeButton initialCount={comment.likes} targetId={comment.id} targetType="interactions" size="sm" />
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            <div className="mt-8 rounded-[2rem] border border-gray-100 bg-gray-50 p-6 md:p-8">
                                <h4 className="mb-4 text-lg font-black text-gray-800" style={serif}>新增留言</h4>
                                {submitMsg ? (
                                    <div className="rounded-xl bg-[#F9FBE7] py-6 text-center text-lg font-bold text-[#6B8E23]">{submitMsg}</div>
                                ) : (
                                    <form onSubmit={handleSubmitComment} className="space-y-4">
                                        <input
                                            type="text"
                                            value={authorName}
                                            onChange={(e) => setAuthorName(e.target.value)}
                                            placeholder="姓名或代稱"
                                            className="w-full rounded-xl border border-gray-200 bg-white p-4 text-sm font-bold text-gray-700 outline-none focus:border-[#6B8E23]"
                                        />
                                        <div className="space-y-1">
                                            <textarea
                                                required
                                                rows={4}
                                                value={newComment}
                                                onChange={(e) => setNewComment(e.target.value.slice(0, 1000))}
                                                placeholder="請輸入留言內容（最多 1000 字）..."
                                                className={`w-full resize-none rounded-xl border bg-white p-4 text-sm font-medium text-gray-700 outline-none transition-colors ${
                                                    newComment.length >= 1000
                                                        ? 'border-red-400 focus:border-red-500'
                                                        : newComment.length >= 900
                                                        ? 'border-amber-400 focus:border-amber-500'
                                                        : 'border-gray-200 focus:border-[#6B8E23]'
                                                }`}
                                            />
                                            <div className="flex items-center justify-end gap-2">
                                                {newComment.length >= 900 && newComment.length < 1000 && (
                                                    <span className="text-xs font-bold text-amber-600">即將達到字數上限</span>
                                                )}
                                                {newComment.length >= 1000 && (
                                                    <span className="text-xs font-bold text-red-600">已達 1000 字上限</span>
                                                )}
                                                <span className={`text-xs font-black tabular-nums ${
                                                    newComment.length >= 1000 ? 'text-red-500' : newComment.length >= 900 ? 'text-amber-500' : 'text-gray-400'
                                                }`}>
                                                    {newComment.length} / 1000
                                                </span>
                                            </div>
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={submitting || newComment.length === 0 || newComment.length > 1000}
                                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#6B8E23] py-4 font-black text-white shadow-md transition-all hover:scale-[1.01] disabled:opacity-50"
                                        >
                                            {submitting ? '送出中...' : '送出留言'}
                                            <Send size={16} />
                                        </button>
                                    </form>
                                )}
                            </div>
                        </div>
                    </FadeIn>
                </main>

                {citationPreview && (
                    <div
                        className="pointer-events-none fixed z-[80] w-[320px]"
                        style={{
                            left: citationPreview.left,
                            top: citationPreview.top,
                            transform: citationPreview.placement === 'above' ? 'translateY(-100%)' : 'none',
                        }}
                    >
                        <div className="rounded-2xl border border-[#DDE6C8] bg-white/95 px-4 py-3 shadow-[0_16px_40px_rgba(45,42,38,0.14)] backdrop-blur">
                            <div className="mb-2 flex items-center justify-between gap-3">
                                <span className="rounded-full bg-[#F9FBE7] px-2 py-1 text-[12px] font-black text-[#6B8E23]">
                                    原始文字
                                </span>
                                <span className="text-[11px] font-bold text-[#8A8078]">
                                    {citationPreview.sessionTitle} / {citationPreview.lineId}
                                </span>
                            </div>
                            <p className="mb-2 text-[12px] font-black text-[#5A6F35]">{citationPreview.speaker}</p>
                            <p className="text-[14px] leading-6 text-[#4A443C]">{citationPreview.content}</p>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
