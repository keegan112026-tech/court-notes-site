import { NextResponse } from 'next/server';
import { getLocalSessionsIndex } from '@/lib/local-data';

export const revalidate = 60;

export async function GET() {
    try {
        const sessions = getLocalSessionsIndex().map((session) => ({
            id: session.id,
            sessionId: session.id,
            title: session.title,
            date: session.date,
            category: session.phase || '一審審理庭',
            status: session.status,
            summary: session.summary,
            hotTopic: Boolean(session.highlight),
            participantsCount: 0,
        }));

        return NextResponse.json({ ok: true, data: sessions });
    } catch (e: any) {
        return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
    }
}
