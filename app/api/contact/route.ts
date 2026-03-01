import { NextRequest, NextResponse } from 'next/server';
import { createContact } from '@/lib/notion';
import { checkRateLimit } from '@/lib/rateLimiter';

export async function POST(req: NextRequest) {
    try {
        const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
        const rl = checkRateLimit(ip);
        if (!rl.allowed) {
            return NextResponse.json({ ok: false, error: '操作太頻繁，請稍後再試', retryAfter: rl.retryAfter }, { status: 429 });
        }
        const { name, category, content, attachmentUrl } = await req.json();
        if (!content?.trim()) {
            return NextResponse.json({ ok: false, error: '訊息內容為必填' }, { status: 400 });
        }
        if (content.length > 5000) {
            return NextResponse.json({ ok: false, error: '內容不可超過 5000 字' }, { status: 400 });
        }
        const validCategories = ['逐字稿提供', '資料補充', '意見回饋', '糾錯回報', '其他'];
        const cat = validCategories.includes(category) ? category : '其他';
        await createContact(name, cat, content.trim(), attachmentUrl);
        return NextResponse.json({ ok: true, message: '訊息已送出，感謝您的回饋！' });
    } catch (e: any) {
        return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
    }
}
