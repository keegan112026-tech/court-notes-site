import { NextRequest, NextResponse } from 'next/server';
import { fetchSessionById, fetchTranscripts, fetchComments } from '@/lib/notion';

export const revalidate = 60;

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const sessionId = params.id;
        const session = await fetchSessionById(sessionId);
        if (!session) {
            return NextResponse.json({ ok: false, error: 'Session not found' }, { status: 404 });
        }
        const [transcripts, comments] = await Promise.all([
            fetchTranscripts(session.id),
            // Fetch all comments for this session's transcripts
            Promise.resolve([]), // Will fetch per-line on client
        ]);
        return NextResponse.json({ ok: true, data: { session, transcripts } });
    } catch (e: any) {
        return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
    }
}
