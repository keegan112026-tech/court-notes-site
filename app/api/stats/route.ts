import { NextResponse } from 'next/server';
import { getBackendProvider } from '@/lib/backend/provider';
import { getLocalSessionsIndex } from '@/lib/local-data';

export const revalidate = 60; // Cache for 60 seconds
export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const sessions = getLocalSessionsIndex();
        let publishedArticles = 0;

        try {
            const articles = await getBackendProvider().fetchForumPosts();
            publishedArticles = articles.length;
        } catch (error) {
            console.error('API Warning: failed to fetch forum posts for stats:', error);
        }

        const stats = {
            totalSessions: sessions.length,
            restoredSessions: sessions.filter((session) => session.published !== false).length,
            publishedArticles,
        };
        return NextResponse.json(stats);
    } catch (error) {
        console.error('API Error fetching site stats:', error);
        return NextResponse.json({ totalSessions: 0, restoredSessions: 0, publishedArticles: 0 });
    }
}
