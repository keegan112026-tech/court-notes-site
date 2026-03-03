import { NextRequest, NextResponse } from 'next/server';
import { fetchComments, createComment } from '@/lib/notion';
import { checkRateLimit } from '@/lib/rateLimiter';

export async function GET(req: NextRequest) {
    try {
        const lineId = req.nextUrl.searchParams.get('lineId');
        if (!lineId) return NextResponse.json({ ok: false, error: 'lineId required' }, { status: 400 });
        const comments = await fetchComments(lineId);
        return NextResponse.json({ ok: true, data: comments });
    } catch (e: any) {
        return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
        const rl = checkRateLimit(ip);
        if (!rl.allowed) {
            return NextResponse.json({ ok: false, error: '操作太頻繁，請稍後再試', retryAfter: rl.retryAfter }, { status: 429 });
        }
        const { targetLineId, author, content, sessionId, topic, type } = await req.json();
        if (!targetLineId || !content?.trim()) {
            return NextResponse.json({ ok: false, error: '缺少必要欄位' }, { status: 400 });
        }
        if (content.length > 2000) {
            return NextResponse.json({ ok: false, error: '內容不可超過 2000 字' }, { status: 400 });
        }
        await createComment(targetLineId, author, content.trim(), sessionId, topic, type);
        return NextResponse.json({ ok: true, message: '留言已送出，待審核後顯示' });
    } catch (e: any) {
        return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
    }
}
