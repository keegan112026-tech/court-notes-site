import { NextRequest, NextResponse } from 'next/server';
import { getBackendProvider } from '@/lib/backend/provider';
import { checkRateLimit } from '@/lib/rateLimiter';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    try {
        const targetLineId = req.nextUrl.searchParams.get('targetLineId') || req.nextUrl.searchParams.get('lineId');

        if (!targetLineId) {
            return NextResponse.json({ ok: false, error: '缺少 targetLineId。' }, { status: 400 });
        }

        const comments = await getBackendProvider().fetchComments(targetLineId);
        return NextResponse.json({ ok: true, data: comments });
    } catch (error: any) {
        return NextResponse.json({ ok: false, error: error.message || '讀取留言時發生錯誤。' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
        const rl = checkRateLimit(ip, { bucket: 'comment-create', windowMs: 60 * 1000, max: 4 });
        if (!rl.allowed) {
            return NextResponse.json(
                { ok: false, error: '留言送出過於頻繁，請稍後再試。', retryAfter: rl.retryAfter },
                { status: 429 }
            );
        }

        const { targetLineId, author, content, sessionId, topic, type } = await req.json();

        if (!targetLineId || !content?.trim()) {
            return NextResponse.json({ ok: false, error: '請提供留言內容與對應目標。' }, { status: 400 });
        }

        const normalizedContent = String(content).trim();

        if (normalizedContent.length > 1000) {
            return NextResponse.json({ ok: false, error: '留言內容不可超過 1000 字。' }, { status: 400 });
        }

        await getBackendProvider().createComment({
            targetLineId,
            author,
            content: normalizedContent,
            sessionId,
            topic,
            type,
        });

        return NextResponse.json({ ok: true, message: '留言已送出，待審核後顯示。' });
    } catch (error: any) {
        return NextResponse.json({ ok: false, error: error.message || '送出留言時發生錯誤。' }, { status: 500 });
    }
}
