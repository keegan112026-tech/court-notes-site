import { NextRequest, NextResponse } from 'next/server';
import { getBackendProvider } from '@/lib/backend/provider';
import { getLocalSessionDetail } from '@/lib/local-data';

export const revalidate = 60;
export const dynamic = 'force-dynamic';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const sessionId = params.id;
        const localSession = getLocalSessionDetail(sessionId);

        if (!localSession) {
            return NextResponse.json({ ok: false, error: '找不到這個場次。' }, { status: 404 });
        }

        const session = localSession.metadata;
        const transcripts = localSession.transcripts;
        const lineIds = transcripts.map((line) => line.lineId || line.id);

        const provider = getBackendProvider();
        const commentsByLine = await Promise.all(
            lineIds.map(async (lineId) => {
                try {
                    return await provider.fetchComments(lineId);
                } catch {
                    return [];
                }
            })
        );

        const comments = commentsByLine.flat();

        return NextResponse.json({
            ok: true,
            data: { session, transcripts, comments },
        });
    } catch (error: any) {
        return NextResponse.json({ ok: false, error: error.message || '讀取逐字稿失敗' }, { status: 500 });
    }
}
