import { NextResponse } from 'next/server';
import { getBackendProvider } from '@/lib/backend/provider';
import { findPublishedArticleSnapshotByIdOrSlug } from '@/lib/published-articles/storage';

export const revalidate = 60;
export const dynamic = 'force-dynamic';

export async function GET(_request: Request, { params }: { params: { id: string } }) {
    try {
        const postId = params.id;
        if (!postId) {
            return NextResponse.json({ ok: false, error: '缺少文章 ID。' }, { status: 400 });
        }

        const provider = getBackendProvider();
        const backendPost = await provider.fetchForumPostById(postId);
        if (backendPost) {
            const comments = await provider.fetchForumComments(backendPost.id);
            return NextResponse.json({ ok: true, data: { post: backendPost, comments }, source: 'backend-published' });
        }

        const snapshot = findPublishedArticleSnapshotByIdOrSlug(postId);
        if (snapshot) {
            const comments = await provider.fetchForumComments(snapshot.id);

            return NextResponse.json({
                ok: true,
                data: {
                    post: {
                        id: snapshot.slug,
                        snapshotId: snapshot.id,
                        title: snapshot.title,
                        author: snapshot.authorLabel,
                        content: snapshot.contentHtml,
                        likes: snapshot.likesSnapshot,
                        createdAt: snapshot.publishedAt,
                        targetSessionId: snapshot.primarySessionId || '',
                        sourceSessionIds: snapshot.sourceSessionIds,
                        articleType: snapshot.articleType,
                    },
                    comments,
                },
                source: 'published-snapshot',
            });
        }

        return NextResponse.json({ ok: false, error: '找不到這篇文章。' }, { status: 404 });
    } catch (error) {
        console.error('API Error fetching forum post:', error);
        return NextResponse.json({ ok: false, error: '讀取文章內容時發生錯誤。' }, { status: 500 });
    }
}
