import { NextResponse } from 'next/server';
import { getBackendProvider } from '@/lib/backend/provider';
import { getLocalSessionsIndex, getLocalSessionDetail } from '@/lib/local-data';

export const revalidate = 60; // Cache for 60 seconds
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    try {
        if (type === 'notes') {
            const sessions = getLocalSessionsIndex().filter((session) => session.published !== false);
            const data = sessions.flatMap((session) => {
                const detail = getLocalSessionDetail(session.id);
                if (!detail) return [];
                return detail.transcripts
                    .filter((line) => line.type !== 'stage' && line.content.trim())
                    .slice(0, 3)
                    .map((line) => ({
                        id: `${session.id}-${line.lineId}`,
                        lineId: line.lineId,
                        content: line.content,
                        role: line.role,
                        sessionId: session.id,
                    }));
            }).slice(0, 3);
            return NextResponse.json(data);
        }
        if (type === 'comments') {
            try {
                const data = await getBackendProvider().fetchTrendingArticleComments(3);
                return NextResponse.json(data);
            } catch (error) {
                console.error('API Warning fetching trending article comments:', error);
                return NextResponse.json([]);
            }
        }
        if (type === 'articles') {
            try {
                const data = await getBackendProvider().fetchTrendingArticles(3);
                return NextResponse.json(data);
            } catch (error) {
                console.error('API Warning fetching trending articles:', error);
                return NextResponse.json([]);
            }
        }

        return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 });
    } catch (error) {
        console.error(`API Error fetching trending ${type}:`, error);
        return NextResponse.json([]);
    }
}
