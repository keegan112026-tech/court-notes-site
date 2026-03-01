import { NextResponse } from 'next/server';
import { fetchSessions } from '@/lib/notion';

export const revalidate = 60;

export async function GET() {
    try {
        const sessions = await fetchSessions();
        return NextResponse.json({ ok: true, data: sessions });
    } catch (e: any) {
        return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
    }
}
