import { NextRequest, NextResponse } from 'next/server';
import { getBackendProvider } from '@/lib/backend/provider';
import { ADMIN_SESSION_COOKIE, getAdminAccountByToken } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

function getCurrentAdmin(req: NextRequest) {
    const token = req.cookies.get(ADMIN_SESSION_COOKIE)?.value;
    return getAdminAccountByToken(token);
}

function sortByCreatedAtDesc<T extends { createdAt: string }>(items: T[]) {
    return [...items].sort((a, b) => {
        const aTime = Date.parse(a.createdAt);
        const bTime = Date.parse(b.createdAt);
        return bTime - aTime;
    });
}

export async function GET(req: NextRequest) {
    try {
        const admin = getCurrentAdmin(req);
        if (!admin) {
            return NextResponse.json({ ok: false, error: '請先登入管理後台。' }, { status: 401 });
        }

        const provider = getBackendProvider();
        const [
            pendingArticles,
            pendingComments,
            allArticles,
            allComments,
            inboxMessages,
        ] = await Promise.all([
            provider.fetchPendingForumPosts(),
            provider.fetchPendingComments(),
            provider.fetchAllForumPosts(),
            provider.fetchAllComments(),
            provider.fetchInboxMessages(),
        ]);

        const summary = {
            pendingArticles: pendingArticles.length,
            pendingComments: pendingComments.length,
            readyToPublishArticles: allArticles.filter((article) => article.status === '已核准').length,
            publishedArticles: allArticles.filter((article) => article.status === '已發布').length,
            totalArticles: allArticles.length,
            totalComments: allComments.length,
            newInbox: inboxMessages.filter((message) => message.status === '新進').length,
            processingInbox: inboxMessages.filter((message) => message.status === '處理中').length,
            resolvedInbox: inboxMessages.filter((message) => message.status === '已結案').length,
            totalInbox: inboxMessages.length,
        };

        return NextResponse.json({
            ok: true,
            data: {
                currentAdmin: {
                    name: admin.name,
                    role: admin.role,
                },
                summary,
                recent: {
                    pendingArticles: sortByCreatedAtDesc(pendingArticles).slice(0, 3).map((article) => ({
                        id: article.id,
                        title: article.title,
                        author: article.author,
                        createdAt: article.createdAt,
                        status: article.status,
                        targetSessionId: article.targetSessionId,
                    })),
                    pendingComments: sortByCreatedAtDesc(pendingComments).slice(0, 3).map((comment) => ({
                        id: comment.id,
                        author: comment.author,
                        content: comment.content,
                        createdAt: comment.createdAt,
                        status: comment.status,
                        targetLineId: comment.targetLineId,
                    })),
                    inboxMessages: sortByCreatedAtDesc(inboxMessages).slice(0, 3).map((message) => ({
                        id: message.id,
                        title: message.title,
                        senderName: message.senderName,
                        messageType: message.messageType,
                        createdAt: message.createdAt,
                        status: message.status,
                    })),
                },
            },
        });
    } catch (error: any) {
        return NextResponse.json(
            { ok: false, error: error?.message || '讀取營運控台資料時發生錯誤。' },
            { status: 500 }
        );
    }
}
