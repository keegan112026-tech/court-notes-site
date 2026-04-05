import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_SESSION_COOKIE, isAdminTokenConfigured, isValidAdminSession } from '@/lib/admin-auth';

function isAdminPath(pathname: string) {
    return pathname.startsWith('/admin');
}

function isAdminApiPath(pathname: string) {
    return pathname.startsWith('/api/admin');
}

function isPublicAdminPath(pathname: string) {
    return pathname === '/admin/login' || pathname === '/api/admin/session';
}

export function middleware(req: NextRequest) {
    const { pathname, search } = req.nextUrl;

    if ((!isAdminPath(pathname) && !isAdminApiPath(pathname)) || isPublicAdminPath(pathname)) {
        return NextResponse.next();
    }

    if (!isAdminTokenConfigured()) {
        if (isAdminApiPath(pathname)) {
            return NextResponse.json({ ok: false, error: '管理後台登入機制尚未設定。' }, { status: 503 });
        }

        const loginUrl = new URL('/admin/login', req.url);
        loginUrl.searchParams.set('next', pathname + search);
        return NextResponse.redirect(loginUrl);
    }

    const sessionCookie = req.cookies.get(ADMIN_SESSION_COOKIE)?.value;
    if (isValidAdminSession(sessionCookie)) {
        return NextResponse.next();
    }

    if (isAdminApiPath(pathname)) {
        return NextResponse.json({ ok: false, error: '尚未登入管理後台。' }, { status: 401 });
    }

    const loginUrl = new URL('/admin/login', req.url);
    loginUrl.searchParams.set('next', pathname + search);
    return NextResponse.redirect(loginUrl);
}

export const config = {
    matcher: ['/admin/:path*', '/api/admin/:path*'],
};
