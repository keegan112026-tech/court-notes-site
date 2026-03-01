import { NextRequest, NextResponse } from 'next/server';
import { fetchForumPosts, createForumPost } from '@/lib/notion';
import { checkRateLimit } from '@/lib/rateLimiter';

export const revalidate = 60;

export async function GET() {
    try {
        const posts = await fetchForumPosts();
        return NextResponse.json({ ok: true, data: posts });
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
        const { author, title, content, category } = await req.json();
        if (!title?.trim() || !content?.trim()) {
            return NextResponse.json({ ok: false, error: '標題與內容為必填' }, { status: 400 });
        }
        if (content.length > 5000) {
            return NextResponse.json({ ok: false, error: '內容不可超過 5000 字' }, { status: 400 });
        }
        const validCategories = ['經驗分享', '專業討論', '資料補充', '提問', '糾錯回報'];
        const cat = validCategories.includes(category) ? category : '經驗分享';
        await createForumPost(author, title.trim(), content.trim(), cat);
        return NextResponse.json({ ok: true, message: '投稿已送出，待審核後顯示' });
    } catch (e: any) {
        return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
    }
}
