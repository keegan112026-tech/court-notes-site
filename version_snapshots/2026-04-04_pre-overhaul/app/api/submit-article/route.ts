import { NextRequest, NextResponse } from 'next/server';
import { getBackendProvider } from '@/lib/backend/provider';
import { checkRateLimit } from '@/lib/rateLimiter';
import {
    sanitizeArticleForSession,
    sanitizeOptionalEmail,
    sanitizePlainAuthor,
    sanitizePlainTitle,
} from '@/lib/content-security';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    try {
        const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
        const rl = checkRateLimit(ip, { bucket: 'article-submit', windowMs: 10 * 60 * 1000, max: 3 });

        if (!rl.allowed) {
            return NextResponse.json(
                { ok: false, error: '投稿送出過於頻繁，請稍後再試。', retryAfter: rl.retryAfter },
                { status: 429 }
            );
        }

        const { author, title, content, sessionId, contactEmail, sourceSessionIds } = await req.json();

        const normalizedSessionId = typeof sessionId === 'string' ? sessionId.trim() : '';
        const sanitizedTitle = sanitizePlainTitle(title);
        const sanitizedAuthor = sanitizePlainAuthor(author);
        const sanitizedEmail = sanitizeOptionalEmail(contactEmail);
        const sanitizedContent = sanitizeArticleForSession(content, normalizedSessionId).trim();

        const normalizedSourceSessionIds = Array.isArray(sourceSessionIds)
            ? sourceSessionIds.filter((value): value is string => typeof value === 'string' && value.trim().length > 0)
            : (normalizedSessionId ? [normalizedSessionId] : []);

        if (!sanitizedTitle || !sanitizedContent || !normalizedSessionId) {
            return NextResponse.json(
                { ok: false, error: '請填寫標題、內容與主要場次。' },
                { status: 400 }
            );
        }

        if (sanitizedContent.length > 10000) {
            return NextResponse.json(
                { ok: false, error: '投稿內容不可超過 10000 字。' },
                { status: 400 }
            );
        }

        await getBackendProvider().createForumPost({
            author: sanitizedAuthor,
            contactEmail: sanitizedEmail,
            title: sanitizedTitle,
            content: sanitizedContent,
            category: '觀庭共構文章',
            topic: '觀庭共構投稿',
            targetSessionSid: normalizedSessionId,
            sourceSessionSids: normalizedSourceSessionIds,
        });

        return NextResponse.json({
            ok: true,
            message: '投稿已送出，待審核後發布。',
        });
    } catch (error: any) {
        return NextResponse.json(
            { ok: false, error: error.message || '送出投稿時發生錯誤。' },
            { status: 500 }
        );
    }
}
