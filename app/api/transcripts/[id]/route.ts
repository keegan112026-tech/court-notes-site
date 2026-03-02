import { NextRequest, NextResponse } from 'next/server';
import { fetchSessionById, fetchTranscripts, fetchComments, fetchAllApprovedParagraphComments } from '@/lib/notion';

export const revalidate = 60;

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const sessionId = params.id;
        const session = await fetchSessionById(sessionId);
        if (!session) {
            return NextResponse.json({ ok: false, error: 'Session not found' }, { status: 404 });
        }
        // 1. Try to load local transcript data based on Session ID
        let transcripts: any[] = [];
        try {
            // Very simple dynamic fallback to our local files
            if (sessionId === 's-114-1-6' || sessionId === 'S-206') {
                const { fallbackTranscriptS114 } = require('@/data/transcripts/s-114');
                transcripts = fallbackTranscriptS114;
            } else {
                transcripts = await fetchTranscripts(session.sessionId);
            }
        } catch (err) {
            console.warn("Local transcript fallback failed, trying Notion...", err);
            transcripts = await fetchTranscripts(session.sessionId);
        }

        const [allComments] = await Promise.all([
            fetchAllApprovedParagraphComments()
        ]);

        const validLineIds = new Set(transcripts.map(t => t.id));
        const comments = allComments.filter(c => validLineIds.has(c.targetLineId));

        if (sessionId === 's-114-1-6' || sessionId === 'S-206') {
            session.summary = `114年度訴字第51號過失致死等案-俗稱剴剴社工案\n\n依據目前（截至 2026 年 2 月底）的審理進度，兒福聯盟陳姓社工在「剴剴案」中被控過失致死與偽造文書罪，台北地院已完成審理，累計開庭次數與具體日期整理如下：\n\n陳姓社工於一審期間共計開庭 10次。\n2024 年至 2025 年：準備程序庭（共 4 次）\n此階段主要進行證據能力確認與不認罪答辯：\n7 月 17 日：首度開庭，陳姓社工不認罪。\n8 月 27 日：第二次準備程序。\n10 月 15 日：第三次準備程序。\n12 月 4 日：第四次準備程序。\n\n2025 年末至 2026 年：審理程序庭（共 6 次）\n此階段進入實質審理，包括證人詰問與言詞辯論：\n11 月 27 日：第1次開庭\n12 月 11 日：第2次開庭\n12 月 18 日：第3次開庭\n1 月 22 日：第4次開庭\n1 月 29 日：第5次開庭\n2 月 26 日（預計）：第6次開庭\n\n本場次（第六場）為本案一審最終言詞辯論，聚焦於檢辯雙方對社工保證人地位及注意義務之攻防。`;
        }

        return NextResponse.json({ ok: true, data: { session, transcripts, comments } });
    } catch (e: any) {
        return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
    }
}
