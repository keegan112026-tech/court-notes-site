import { NextRequest, NextResponse } from 'next/server';
import { getBackendProvider } from '@/lib/backend/provider';
import { readPublishedArticlesIndex } from '@/lib/published-articles/storage';

export const revalidate = 60;
export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const publishedIndex = readPublishedArticlesIndex();
        if (publishedIndex.items.length > 0) {
            const posts = publishedIndex.items.map((item) => ({
                id: item.slug,
                snapshotId: item.id,
                title: item.title,
                author: item.authorLabel,
                content: item.excerpt,
                likes: 0,
                createdAt: item.publishedAt,
                targetSessionId: item.primarySessionId || '',
                sourceSessionIds: item.sourceSessionIds,
                articleType: item.articleType,
            }));

            return NextResponse.json({ ok: true, data: posts, source: 'published-snapshot' });
        }

        const provider = getBackendProvider();
        const backendPosts = await provider.fetchForumPosts();

        if (backendPosts.length > 0) {
            return NextResponse.json({ ok: true, data: backendPosts, source: 'backend-published-fallback' });
        }

        return NextResponse.json({ ok: true, data: [] });
    } catch (error: any) {
        return NextResponse.json({ ok: false, error: error.message || '讀取匯集區文章時發生錯誤。' }, { status: 500 });
    }
}

export async function POST(_req: NextRequest) {
    return NextResponse.json(
        {
            ok: false,
            error: '匯集區文章投稿入口已改由工作檯送出，請前往單場筆記頁或跨場工作檯投稿。',
            nextAction: '/api/submit-article',
        },
        { status: 410 }
    );
}
