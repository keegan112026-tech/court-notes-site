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
            return NextResponse.json({ ok: false, error: '尚未登入管理後台。' }, { status: 401 });
        }

        const provider = getBackendProvider();
        const messages = await provider.fetchInboxMessages();

        return NextResponse.json({
            ok: true,
            data: {
                currentAdmin: {
                    name: admin.name,
                    role: admin.role,
                },
                messages,
            },
        });
    } catch (error: any) {
        return NextResponse.json(
            { ok: false, error: error?.message || '讀取 Inbox 訊息失敗。' },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        const admin = getCurrentAdmin(req);
        if (!admin) {
            return NextResponse.json({ ok: false, error: '尚未登入管理後台。' }, { status: 401 });
        }

        const { targetId, action, note } = await req.json();
        if (!targetId || !action) {
            return NextResponse.json({ ok: false, error: '請提供要處理的訊息與操作類型。' }, { status: 400 });
        }

        if (!['mark-read', 'mark-resolved'].includes(action)) {
            return NextResponse.json({ ok: false, error: '不支援的收件匣操作。' }, { status: 400 });
        }

        await getBackendProvider().updateInboxMessage({
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
            { ok: false, error: error?.message || '更新收件匣狀態失敗。' },
            { status: 500 }
        );
    }
}
