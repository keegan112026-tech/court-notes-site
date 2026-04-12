import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_SESSION_COOKIE, getAdminAccountByToken } from '@/lib/admin-auth';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

function getCurrentAdmin(req: NextRequest) {
    const token = req.cookies.get(ADMIN_SESSION_COOKIE)?.value;
    return getAdminAccountByToken(token);
}

/** GET /api/admin/session-patch?sessionId=s-114-1-6&lineId=p042
 *  回傳指定 segment 的當前內容
 */
export async function GET(req: NextRequest) {
    const admin = getCurrentAdmin(req);
    if (!admin) return NextResponse.json({ ok: false, error: '尚未登入管理後台。' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('sessionId');
    const lineId = searchParams.get('lineId');

    if (!sessionId || !lineId) {
        return NextResponse.json({ ok: false, error: '請提供 sessionId 與 lineId。' }, { status: 400 });
    }

    try {
        const filePath = path.join(process.cwd(), 'data', 'sessions', `${sessionId}.json`);
        if (!fs.existsSync(filePath)) {
            return NextResponse.json({ ok: false, error: '找不到該場次資料。' }, { status: 404 });
        }

        const raw = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        const segment = raw.transcripts?.find(
            (t: { lineId?: string; id?: string }) => t.lineId === lineId || t.id === lineId
        );

        if (!segment) {
            return NextResponse.json({ ok: false, error: '找不到指定段落。' }, { status: 404 });
        }

        return NextResponse.json({ ok: true, data: segment });
    } catch (e: any) {
        return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
    }
}

/** PATCH /api/admin/session-patch
 *  修改指定 segment 的 content（僅 owner 可操作）
 *  Body: { sessionId, lineId, newContent, reason }
 */
export async function PATCH(req: NextRequest) {
    const admin = getCurrentAdmin(req);
    if (!admin) return NextResponse.json({ ok: false, error: '尚未登入管理後台。' }, { status: 401 });

    if (admin.role !== 'owner') {
        return NextResponse.json({ ok: false, error: '僅限 owner 角色可修改逐字稿內容。' }, { status: 403 });
    }

    try {
        const body = await req.json();
        const { sessionId, lineId, newContent, reason } = body;

        if (!sessionId || !lineId || typeof newContent !== 'string') {
            return NextResponse.json({ ok: false, error: '請提供 sessionId、lineId 與 newContent。' }, { status: 400 });
        }

        if (newContent.trim().length === 0) {
            return NextResponse.json({ ok: false, error: '修正內容不可為空。' }, { status: 400 });
        }

        if (newContent.length > 2000) {
            return NextResponse.json({ ok: false, error: '修正內容不可超過 2000 字。' }, { status: 400 });
        }

        const filePath = path.join(process.cwd(), 'data', 'sessions', `${sessionId}.json`);
        if (!fs.existsSync(filePath)) {
            return NextResponse.json({ ok: false, error: '找不到該場次資料。' }, { status: 404 });
        }

        const raw = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        const segmentIndex = raw.transcripts?.findIndex(
            (t: { lineId?: string; id?: string }) => t.lineId === lineId || t.id === lineId
        );

        if (segmentIndex === -1 || segmentIndex === undefined) {
            return NextResponse.json({ ok: false, error: '找不到指定段落。' }, { status: 404 });
        }

        const originalContent = raw.transcripts[segmentIndex].content;
        raw.transcripts[segmentIndex].content = newContent.trim();

        // 寫回 JSON（4-space indent）
        fs.writeFileSync(filePath, JSON.stringify(raw, null, 4), 'utf-8');

        // 寫入 audit log
        const patchRecord = {
            patchedAt: new Date().toISOString(),
            sessionId,
            lineId,
            patchedBy: admin.name,
            reason: typeof reason === 'string' ? reason.trim() : '',
            originalContent,
            newContent: newContent.trim(),
        };

        const patchDir = path.join(process.cwd(), 'data', 'patches');
        fs.mkdirSync(patchDir, { recursive: true });
        const patchFile = path.join(patchDir, `${sessionId}.jsonl`);

        fs.appendFileSync(patchFile, JSON.stringify(patchRecord) + '\n', 'utf-8');

        return NextResponse.json({ ok: true, data: patchRecord });
    } catch (e: any) {
        return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
    }
}

/** GET /api/admin/session-patch/log?sessionId=s-114-1-6
 *  讀取某場次的修訂紀錄（所有 admin 可查閱）
 *  Note: Next.js App Router 不支援同一 route.ts 多個路徑，
 *  所以用 searchParams 的 type=log 來區分
 */
