import { NextRequest, NextResponse } from 'next/server';
import { getBackendProvider } from '@/lib/backend/provider';
import { ADMIN_SESSION_COOKIE, getAdminAccountByToken } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

function getCurrentAdmin(req: NextRequest) {
    const token = req.cookies.get(ADMIN_SESSION_COOKIE)?.value;
    return getAdminAccountByToken(token);
}

export async function GET(req: NextRequest) {
    try {
        const admin = getCurrentAdmin(req);
        if (!admin) {
            return NextResponse.json({ ok: false, error: '請先登入管理後台。' }, { status: 401 });
        }

        const comments = await getBackendProvider().fetchAllComments();
        return NextResponse.json({
            ok: true,
            data: {
                currentAdmin: {
                    name: admin.name,
                    role: admin.role,
                },
                comments,
            },
        });
    } catch (error: any) {
        return NextResponse.json(
            { ok: false, error: error?.message || '讀取留言管理資料時發生錯誤。' },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        const admin = getCurrentAdmin(req);
        if (!admin) {
            return NextResponse.json({ ok: false, error: '請先登入管理後台。' }, { status: 401 });
        }

        const { targetId, action, note } = await req.json();
        if (!targetId || !action) {
            return NextResponse.json({ ok: false, error: '缺少必要審核資訊。' }, { status: 400 });
        }

        if (action === 'delete' && admin.role !== 'owner') {
            return NextResponse.json({ ok: false, error: '只有 owner 可以刪除留言。' }, { status: 403 });
        }

        await getBackendProvider().reviewComment({
            targetId,
            action,
            reviewerName: admin.name,
            note,
        });

        return NextResponse.json({
            ok: true,
            data: {
                reviewer: {
                    name: admin.name,
                    role: admin.role,
                },
            },
        });
    } catch (error: any) {
        return NextResponse.json(
            { ok: false, error: error?.message || '更新留言狀態時發生錯誤。' },
            { status: 500 }
        );
    }
}
