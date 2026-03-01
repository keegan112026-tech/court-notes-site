import { NextResponse } from 'next/server';
import { fetchTrendingNotes, fetchTrendingComments, fetchTrendingArticles } from '@/lib/notion';

export const revalidate = 60; // Cache for 60 seconds

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    try {
        if (type === 'notes') {
            const data = await fetchTrendingNotes(3);
            return NextResponse.json(data);
        }
        if (type === 'comments') {
            const data = await fetchTrendingComments(3);
            return NextResponse.json(data);
        }
        if (type === 'articles') {
            const data = await fetchTrendingArticles(3);
            return NextResponse.json(data);
        }

        return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 });
    } catch (error) {
        console.error(`API Error fetching trending ${type}:`, error);
        return NextResponse.json({ error: 'Failed to fetch trending data' }, { status: 500 });
    }
}
