import { NextResponse } from 'next/server';
import { fetchSiteStats } from '@/lib/notion';

export const revalidate = 60; // Cache for 60 seconds

export async function GET() {
    try {
        const stats = await fetchSiteStats();
        return NextResponse.json(stats);
    } catch (error) {
        console.error('API Error fetching site stats:', error);
        return NextResponse.json({ error: 'Failed to fetch site stats' }, { status: 500 });
    }
}
