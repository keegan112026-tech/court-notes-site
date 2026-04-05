import { NextRequest, NextResponse } from 'next/server';
import { getBackendProvider } from '@/lib/backend/provider';
import { checkDuplicateLike, checkRateLimit } from '@/lib/rateLimiter';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    try {
        const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
        const rl = checkRateLimit(ip, { bucket: 'like-action', windowMs: 60 * 1000, max: 20 });
        if (!rl.allowed) {
            return NextResponse.json(
                { ok: false, error: '按讚操作過於頻繁，請稍後再試。', retryAfter: rl.retryAfter },
                { status: 429 }
            );
        }

        const { targetId, targetType } = await req.json();
        if (!targetId || !targetType) {
            return NextResponse.json({ ok: false, error: '缺少按讚目標資料。' }, { status: 400 });
        }

        const validTypes = ['transcripts', 'interactions', 'forum'] as const;
        if (!validTypes.includes(targetType)) {
            return NextResponse.json({ ok: false, error: '不支援的按讚目標類型。' }, { status: 400 });
        }

        if (checkDuplicateLike(ip, targetId, targetType)) {
            return NextResponse.json({ ok: false, error: '你已經按過這則內容，不能重複按讚。' }, { status: 409 });
        }

        const newCount = await getBackendProvider().incrementLike(targetId, targetType);
        return NextResponse.json({ ok: true, data: { newCount } });
    } catch (error: any) {
        return NextResponse.json({ ok: false, error: error.message || '按讚時發生錯誤。' }, { status: 500 });
    }
}
