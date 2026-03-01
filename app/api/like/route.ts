import { NextRequest, NextResponse } from 'next/server';
import { incrementLike } from '@/lib/notion';
import { checkRateLimit, checkDuplicateLike } from '@/lib/rateLimiter';

export async function POST(req: NextRequest) {
    try {
        const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
        const rl = checkRateLimit(ip);
        if (!rl.allowed) {
            return NextResponse.json({ ok: false, error: '操作太頻繁，請稍後再試', retryAfter: rl.retryAfter }, { status: 429 });
        }
        const { targetId, targetType } = await req.json();
        if (!targetId || !targetType) {
            return NextResponse.json({ ok: false, error: '缺少必要欄位' }, { status: 400 });
        }
        const validTypes = ['transcripts', 'interactions', 'forum'] as const;
        if (!validTypes.includes(targetType)) {
            return NextResponse.json({ ok: false, error: '無效的目標類型' }, { status: 400 });
        }
        // Check duplicate (same IP + same target within 1 hour)
        if (checkDuplicateLike(ip, targetId)) {
            return NextResponse.json({ ok: false, error: '您已經按過讚了' }, { status: 409 });
        }
        const newCount = await incrementLike(targetId, targetType);
        return NextResponse.json({ ok: true, data: { newCount } });
    } catch (e: any) {
        return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
    }
}
