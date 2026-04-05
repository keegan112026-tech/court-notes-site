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

        const snapshot = findPublishedArticleSnapshotByIdOrSlug(postId);
        if (snapshot) {
            const provider = getBackendProvider();
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

        const provider = getBackendProvider();
        const post = await provider.fetchForumPostById(postId);
        if (!post) {
            return NextResponse.json({ ok: false, error: '找不到這篇文章。' }, { status: 404 });
        }

        const comments = await provider.fetchForumComments(postId);
        return NextResponse.json({ ok: true, data: { post, comments } });
    } catch (error) {
        console.error('API Error fetching forum post:', error);
        return NextResponse.json({ ok: false, error: '讀取文章失敗。' }, { status: 500 });
    }
}
