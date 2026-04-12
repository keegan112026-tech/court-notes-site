import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_SESSION_COOKIE, getAdminAccountByToken } from '@/lib/admin-auth';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

function getCurrentAdmin(req: NextRequest) {
    const token = req.cookies.get(ADMIN_SESSION_COOKIE)?.value;
    return getAdminAccountByToken(token);
}

/** GET /api/admin/session-patch/log?sessionId=s-114-1-6
 *  讀取某場次的修訂紀錄（全部 admin 可查閱）
 */
export async function GET(req: NextRequest) {
    const admin = getCurrentAdmin(req);
    if (!admin) return NextResponse.json({ ok: false, error: '尚未登入管理後台。' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('sessionId');

    try {
        const patchDir = path.join(process.cwd(), 'data', 'patches');

        if (sessionId) {
            const patchFile = path.join(patchDir, `${sessionId}.jsonl`);
            if (!fs.existsSync(patchFile)) {
                return NextResponse.json({ ok: true, data: [] });
            }
            const lines = fs.readFileSync(patchFile, 'utf-8')
                .split('\n')
                .filter(Boolean)
                .map(line => { try { return JSON.parse(line); } catch { return null; } })
                .filter(Boolean)
                .reverse(); // 最新在前
            return NextResponse.json({ ok: true, data: lines });
        }

        // 全部場次的修訂紀錄
        if (!fs.existsSync(patchDir)) {
            return NextResponse.json({ ok: true, data: [] });
        }

        const files = fs.readdirSync(patchDir).filter(f => f.endsWith('.jsonl'));
        const allPatches = files.flatMap(file => {
            const content = fs.readFileSync(path.join(patchDir, file), 'utf-8');
            return content.split('\n').filter(Boolean).map(line => {
                try { return JSON.parse(line); } catch { return null; }
            }).filter(Boolean);
        }).sort((a, b) => new Date(b.patchedAt).getTime() - new Date(a.patchedAt).getTime());

        return NextResponse.json({ ok: true, data: allPatches });
    } catch (e: any) {
        return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
    }
}
