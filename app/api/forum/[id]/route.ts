import { NextResponse } from 'next/server';
import { fetchForumPostById, fetchForumComments } from '@/lib/notion';

export const revalidate = 60; // Cache for 60 seconds

export async function GET(request: Request, { params }: { params: { id: string } }) {
    try {
        const postId = params.id;
        if (!postId) {
            return NextResponse.json({ ok: false, error: '缺少文章 ID' }, { status: 400 });
        }

        const post = await fetchForumPostById(postId);
        if (!post) {
            return NextResponse.json({ ok: false, error: '文章不存在或尚未核准' }, { status: 404 });
        }

        const comments = await fetchForumComments(postId);

        return NextResponse.json({
            ok: true,
            data: { post, comments }
        });
    } catch (error) {
        console.error('API Error fetching forum post:', error);
        return NextResponse.json({ ok: false, error: '無法讀取文章' }, { status: 500 });
    }
}
