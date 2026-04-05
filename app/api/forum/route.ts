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
