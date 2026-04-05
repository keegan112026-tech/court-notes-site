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
        const [pendingArticles, pendingComments] = await Promise.all([
            provider.fetchPendingForumPosts(),
            provider.fetchPendingComments(),
        ]);

        return NextResponse.json({
            ok: true,
            data: {
                currentAdmin: {
                    name: admin.name,
                    role: admin.role,
                },
                pendingArticles,
                pendingComments,
            },
        });
    } catch (error: any) {
        return NextResponse.json(
            { ok: false, error: error?.message || '讀取待審資料失敗。' },
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

        const { targetType, targetId, action, note } = await req.json();

        if (!targetType || !targetId || !action) {
            return NextResponse.json({ ok: false, error: '缺少必要的審查資料。' }, { status: 400 });
        }

        if (action === 'delete' && admin.role !== 'owner') {
            return NextResponse.json({ ok: false, error: '只有 owner 可以刪除資料。' }, { status: 403 });
        }

        const provider = getBackendProvider();
        const payload = {
            targetId,
            action,
            reviewerName: admin.name,
            note,
        } as const;

        if (targetType === 'article') {
            await provider.reviewForumPost(payload);
        } else if (targetType === 'comment') {
            await provider.reviewComment(payload);
        } else {
            return NextResponse.json({ ok: false, error: '不支援的審查目標類型。' }, { status: 400 });
        }

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
            { ok: false, error: error?.message || '審查操作失敗。' },
            { status: 500 }
        );
    }
}
