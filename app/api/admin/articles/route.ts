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
        const articles = await provider.fetchAllForumPosts();

        return NextResponse.json({
            ok: true,
            data: {
                currentAdmin: {
                    name: admin.name,
                    role: admin.role,
                },
                articles,
            },
        });
    } catch (error: any) {
        return NextResponse.json(
            { ok: false, error: error?.message || '讀取文章總覽失敗。' },
            { status: 500 }
        );
    }
}
