import { NextRequest, NextResponse } from 'next/server';
import { getBackendProvider } from '@/lib/backend/provider';

export const revalidate = 60;
export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const posts = await getBackendProvider().fetchForumPosts();
        return NextResponse.json({ ok: true, data: posts });
    } catch (error: any) {
        return NextResponse.json({ ok: false, error: error.message || '讀取公開文章時發生錯誤。' }, { status: 500 });
    }
}

export async function POST(_req: NextRequest) {
    return NextResponse.json(
        {
            ok: false,
            error: '自由發文入口已停用，請改由觀庭共構投稿流程送出。',
            nextAction: '/api/submit-article',
        },
        { status: 410 }
    );
}
