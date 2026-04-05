import { NextRequest, NextResponse } from 'next/server';
import { getBackendProvider } from '@/lib/backend/provider';
import { checkRateLimit } from '@/lib/rateLimiter';
import { sanitizeOptionalEmail, sanitizePlainAuthor } from '@/lib/content-security';

export const dynamic = 'force-dynamic';

const VALID_CATEGORIES = [
    '一般聯絡',
    '錯誤回報',
    '內容更正',
    '使用建議',
    '私密傳訊',
] as const;

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const category = VALID_CATEGORIES.includes(body.category) ? body.category : '一般聯絡';

        const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
        const rl = checkRateLimit(ip, {
            bucket: category === '私密傳訊' ? 'private-contact-submit' : 'contact-submit',
            windowMs: 10 * 60 * 1000,
            max: category === '私密傳訊' ? 2 : 3,
        });

        if (!rl.allowed) {
            return NextResponse.json(
                { ok: false, error: '送出過於頻繁，請稍後再試。', retryAfter: rl.retryAfter },
                { status: 429 }
            );
        }

        const name = sanitizePlainAuthor(body.name);
        const email = sanitizeOptionalEmail(body.email);
        const content = typeof body.content === 'string' ? body.content.trim() : '';
        const attachmentUrl = typeof body.attachmentUrl === 'string' ? body.attachmentUrl.trim() : '';

        if (!content) {
            return NextResponse.json({ ok: false, error: '請填寫訊息內容。' }, { status: 400 });
        }

        if (content.length > 3000) {
            return NextResponse.json({ ok: false, error: '訊息內容不可超過 3000 字。' }, { status: 400 });
        }

        if (attachmentUrl.length > 1000) {
            return NextResponse.json({ ok: false, error: '附件連結長度超過限制。' }, { status: 400 });
        }

        await getBackendProvider().createContact({
            name,
            email,
            category,
            content,
            attachmentUrl,
        });

        return NextResponse.json({ ok: true, message: '訊息已送出，我們會再查看。' });
    } catch (e: any) {
        return NextResponse.json({ ok: false, error: e.message || '送出訊息時發生錯誤。' }, { status: 500 });
    }
}
