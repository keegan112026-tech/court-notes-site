import { NextRequest, NextResponse } from 'next/server';
import {
    ADMIN_SESSION_COOKIE,
    getAdminAccountByToken,
    getAdminAccounts,
    isAdminTokenConfigured,
} from '@/lib/admin-auth';
import { checkRateLimit } from '@/lib/rateLimiter';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    const token = req.cookies.get(ADMIN_SESSION_COOKIE)?.value;
    const account = getAdminAccountByToken(token);

    if (!account) {
        return NextResponse.json({ ok: false, error: '尚未登入管理後台。' }, { status: 401 });
    }

    return NextResponse.json({
        ok: true,
        data: {
            name: account.name,
            role: account.role,
        },
    });
}

export async function POST(req: NextRequest) {
    try {
        const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
        const rl = checkRateLimit(ip, { bucket: 'admin-login', windowMs: 15 * 60 * 1000, max: 8 });
        if (!rl.allowed) {
            return NextResponse.json(
                { ok: false, error: '登入嘗試過於頻繁，請稍後再試。', retryAfter: rl.retryAfter },
                { status: 429 }
            );
        }

        if (!isAdminTokenConfigured()) {
            return NextResponse.json({ ok: false, error: '管理後台登入 token 尚未設定。' }, { status: 500 });
        }

        const { token } = await req.json();
        const account = getAdminAccountByToken(typeof token === 'string' ? token : '');

        if (!account) {
            return NextResponse.json({ ok: false, error: '管理後台登入 token 不正確。' }, { status: 401 });
        }

        const response = NextResponse.json({
            ok: true,
            data: {
                name: account.name,
                role: account.role,
                availableRoles: Array.from(new Set(getAdminAccounts().map((item) => item.role))),
            },
        });

        response.cookies.set(ADMIN_SESSION_COOKIE, account.token, {
            httpOnly: true,
            sameSite: 'lax',
            secure: false,
            path: '/',
            maxAge: 60 * 60 * 12,
        });

        return response;
    } catch (error: any) {
        return NextResponse.json(
            { ok: false, error: error?.message || '管理後台登入失敗。' },
            { status: 500 }
        );
    }
}

export async function DELETE() {
    const response = NextResponse.json({ ok: true });
    response.cookies.set(ADMIN_SESSION_COOKIE, '', {
        httpOnly: true,
        sameSite: 'lax',
        secure: false,
        path: '/',
        maxAge: 0,
    });
    return response;
}
