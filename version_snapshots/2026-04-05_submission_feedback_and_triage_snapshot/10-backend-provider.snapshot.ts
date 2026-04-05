import {
    createComment as notionCreateComment,
    createContact as notionCreateContact,
    fetchAllComments as notionFetchAllComments,
    createForumPost as notionCreateForumPost,
    fetchAllForumPosts as notionFetchAllForumPosts,
    fetchComments as notionFetchComments,
    fetchForumComments as notionFetchForumComments,
    fetchForumPostById as notionFetchForumPostById,
    fetchForumPosts as notionFetchForumPosts,
    fetchInboxMessages as notionFetchInboxMessages,
    updateInboxMessage as notionUpdateInboxMessage,
    fetchPendingComments as notionFetchPendingComments,
    fetchPendingForumPosts as notionFetchPendingForumPosts,
    fetchTrendingArticleComments as notionFetchTrendingArticleComments,
    fetchTrendingArticles as notionFetchTrendingArticles,
    incrementLike as notionIncrementLike,
    reviewComment as notionReviewComment,
    reviewForumPost as notionReviewForumPost,
} from '@/lib/notion';
import type {
    BackendArticle,
    BackendComment,
    BackendInboxMessage,
    BackendProvider,
} from '@/lib/backend/types';

const DEFAULT_AUTHOR = '匿名作者';
const DEFAULT_ARTICLE_CATEGORY = '觀庭共構文章';
const DEFAULT_COMMENT_TYPE = 'article-comment';
const LEGACY_ARTICLE_COMMENT_TYPE = '一般留言';
const PENDING_STATUS = 'pending';
const APPROVED_STATUS = 'approved';
const REJECTED_STATUS = 'rejected';

function hasFirebaseEnv() {
    return Boolean(
        process.env.FIREBASE_PROJECT_ID
        && process.env.FIREBASE_CLIENT_EMAIL
        && process.env.FIREBASE_PRIVATE_KEY
    );
}

async function loadFirebaseDb() {
    const { getFirebaseDb } = await import('@/lib/firebase-admin');
    return getFirebaseDb();
}

function isFirestoreNotReadyError(error: unknown) {
    const code = typeof error === 'object' && error !== null && 'code' in error
        ? (error as { code?: unknown }).code
        : undefined;
    const message = error instanceof Error ? error.message : String(error ?? '');

    return code === 5
        || code === '5'
        || message.includes('NOT_FOUND')
        || message.includes('The database')
        || message.includes('does not exist');
}

function toFirebaseSetupError(error: unknown) {
    if (!isFirestoreNotReadyError(error)) {
        return error instanceof Error ? error : new Error(String(error ?? 'Unknown Firebase error'));
    }

    return new Error('Firestore 尚未建立完成，請先在 Firebase Console 啟用 Firestore Database。');
}

async function withFirebaseFallback<T>(task: () => Promise<T>, fallback: T) {
    try {
        return await task();
    } catch (error) {
        if (isFirestoreNotReadyError(error)) {
            return fallback;
        }
        throw error;
    }
}

function asIsoString(value: unknown) {
    if (typeof value === 'string') return value;
    if (value && typeof value === 'object' && 'toDate' in (value as Record<string, unknown>)) {
        return ((value as { toDate: () => Date }).toDate()).toISOString();
    }
    return new Date().toISOString();
}

function getNumber(value: unknown, fallback = 0) {
    return typeof value === 'number' ? value : fallback;
}

function toArticle(id: string, data: Record<string, unknown>): BackendArticle {
    return {
        id,
        postId: typeof data.postId === 'string' ? data.postId : id,
        author: typeof data.author === 'string' ? data.author : DEFAULT_AUTHOR,
        contactEmail: typeof data.contactEmail === 'string' ? data.contactEmail : undefined,
        title: typeof data.title === 'string' ? data.title : '',
        content: typeof data.content === 'string' ? data.content : '',
        category: typeof data.category === 'string' ? data.category : DEFAULT_ARTICLE_CATEGORY,
        targetTopic: typeof data.targetTopic === 'string' ? data.targetTopic : '',
        targetSessionId: typeof data.targetSessionId === 'string' ? data.targetSessionId : '',
        sourceSessionIds: Array.isArray(data.sourceSessionIds)
            ? data.sourceSessionIds.filter((item): item is string => typeof item === 'string')
            : undefined,
        likes: getNumber(data.likes),
        status: typeof data.status === 'string' ? data.status : PENDING_STATUS,
        createdAt: asIsoString(data.createdAt),
        reviewedAt: typeof data.reviewedAt === 'string' ? data.reviewedAt : undefined,
        reviewedBy: typeof data.reviewedBy === 'string' ? data.reviewedBy : undefined,
        reviewNote: typeof data.reviewNote === 'string' ? data.reviewNote : undefined,
    };
}

function toComment(id: string, data: Record<string, unknown>): BackendComment {
    return {
        id,
        targetLineId: typeof data.targetLineId === 'string' ? data.targetLineId : '',
        author: typeof data.author === 'string' ? data.author : DEFAULT_AUTHOR,
        content: typeof data.content === 'string' ? data.content : '',
        likes: getNumber(data.likes),
        status: typeof data.status === 'string' ? data.status : PENDING_STATUS,
        createdAt: asIsoString(data.createdAt),
        type: typeof data.type === 'string' ? data.type : DEFAULT_COMMENT_TYPE,
        targetTopic: typeof data.targetTopic === 'string' ? data.targetTopic : '',
        targetSessionId: typeof data.targetSessionId === 'string' ? data.targetSessionId : '',
        reviewedAt: typeof data.reviewedAt === 'string' ? data.reviewedAt : undefined,
        reviewedBy: typeof data.reviewedBy === 'string' ? data.reviewedBy : undefined,
        reviewNote: typeof data.reviewNote === 'string' ? data.reviewNote : undefined,
    };
}

function toInboxMessage(id: string, data: Record<string, unknown>): BackendInboxMessage {
    return {
        id,
        title: typeof data.title === 'string' ? data.title : '',
        messageType: typeof data.messageType === 'string' ? data.messageType : '',
        senderName: typeof data.senderName === 'string' ? data.senderName : '',
        senderEmail: typeof data.senderEmail === 'string' ? data.senderEmail : undefined,
        content: typeof data.content === 'string' ? data.content : '',
        attachmentUrl: typeof data.attachmentUrl === 'string' ? data.attachmentUrl : undefined,
        isSensitive: Boolean(data.isSensitive),
        status: typeof data.status === 'string' ? data.status : '',
        internalNote: typeof data.internalNote === 'string' ? data.internalNote : undefined,
        createdAt: asIsoString(data.createdAt),
        handledBy: typeof data.handledBy === 'string' ? data.handledBy : undefined,
        handledAt: typeof data.handledAt === 'string' ? data.handledAt : undefined,
        relatedArticleId: typeof data.relatedArticleId === 'string' ? data.relatedArticleId : undefined,
        relatedSessionId: typeof data.relatedSessionId === 'string' ? data.relatedSessionId : undefined,
    };
}

async function fetchFirebaseArticles() {
    const db = await loadFirebaseDb();
    const snapshot = await db.collection('articles').get();
    return snapshot.docs.map((doc) => toArticle(doc.id, doc.data()));
}

async function fetchFirebaseComments() {
    const db = await loadFirebaseDb();
    const snapshot = await db.collection('comments').get();
    return snapshot.docs.map((doc) => toComment(doc.id, doc.data()));
}

async function fetchFirebaseInbox() {
    const db = await loadFirebaseDb();
    const snapshot = await db.collection('contacts').get();
    return snapshot.docs.map((doc) => toInboxMessage(doc.id, doc.data()));
}

function sortByCreatedAtDesc<T extends { createdAt: string }>(rows: T[]) {
    return [...rows].sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
}

function sortByCreatedAtAsc<T extends { createdAt: string }>(rows: T[]) {
    return [...rows].sort((a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt));
}

function sortByLikesDesc<T extends { likes: number }>(rows: T[]) {
    return [...rows].sort((a, b) => b.likes - a.likes);
}

function isArticleCommentType(type: string) {
    return type === DEFAULT_COMMENT_TYPE || type === LEGACY_ARTICLE_COMMENT_TYPE;
}

async function writeReviewLog(targetType: 'article' | 'comment', input: { targetId: string; action: 'approve' | 'reject' | 'delete' | 'mark-read'; reviewerName: string; note?: string; }) {
    const db = await loadFirebaseDb();
    await db.collection('reviewLogs').add({
        targetType,
        targetId: input.targetId,
        action: input.action,
        reviewerName: input.reviewerName,
        note: input.note || '',
        createdAt: new Date().toISOString(),
    });
}

const notionProvider: BackendProvider = {
    kind: 'notion',
    fetchComments: notionFetchComments,
    fetchAllComments: notionFetchAllComments,
    async createComment(input) {
        await notionCreateComment(
            input.targetLineId,
            input.author,
            input.content,
            input.sessionId || '',
            input.topic,
            input.type
        );
    },
    fetchAllForumPosts: notionFetchAllForumPosts,
    fetchForumPosts: notionFetchForumPosts,
    fetchForumPostById: notionFetchForumPostById,
    fetchForumComments: notionFetchForumComments,
    async createForumPost(input) {
        await notionCreateForumPost(
            input.author,
            input.contactEmail || '',
            input.title,
            input.content,
            input.category,
            input.topic,
            input.targetSessionSid,
            input.sourceSessionSids || []
        );
    },
    fetchPendingForumPosts: notionFetchPendingForumPosts,
    fetchPendingComments: notionFetchPendingComments,
    reviewForumPost: notionReviewForumPost,
    reviewComment: notionReviewComment,
    fetchTrendingArticleComments: notionFetchTrendingArticleComments,
    fetchTrendingArticles: notionFetchTrendingArticles,
    fetchInboxMessages: notionFetchInboxMessages,
    updateInboxMessage: notionUpdateInboxMessage,
    async createContact(input) {
        await notionCreateContact(
            input.name,
            input.category,
            input.content,
            input.attachmentUrl,
            input.email
        );
    },
    incrementLike: notionIncrementLike,
};

const firebaseProvider: BackendProvider = {
    kind: 'firebase',
    async fetchComments(targetLineId) {
        return withFirebaseFallback(async () => {
            const comments = await fetchFirebaseComments();
            return sortByLikesDesc(
                comments.filter((comment) => (
                    comment.targetLineId === targetLineId
                    && comment.status === APPROVED_STATUS
                ))
            );
        }, []);
    },
    async fetchAllComments() {
        return withFirebaseFallback(async () => sortByCreatedAtDesc(await fetchFirebaseComments()), []);
    },
    async createComment(input) {
        try {
            const db = await loadFirebaseDb();
            await db.collection('comments').add({
                targetLineId: input.targetLineId,
                author: input.author || DEFAULT_AUTHOR,
                content: input.content,
                likes: 0,
                status: PENDING_STATUS,
                type: input.type || DEFAULT_COMMENT_TYPE,
                targetTopic: input.topic || '',
                targetSessionId: input.sessionId || '',
                createdAt: new Date().toISOString(),
            });
        } catch (error) {
            throw toFirebaseSetupError(error);
        }
    },
    async fetchAllForumPosts() {
        return withFirebaseFallback(async () => sortByCreatedAtDesc(await fetchFirebaseArticles()), []);
    },
    async fetchForumPosts() {
        return withFirebaseFallback(async () => {
            const articles = await fetchFirebaseArticles();
            return sortByCreatedAtDesc(
                articles.filter((article) => article.status === APPROVED_STATUS)
            );
        }, []);
    },
    async fetchForumPostById(postId) {
        return withFirebaseFallback(async () => {
            const db = await loadFirebaseDb();
            const doc = await db.collection('articles').doc(postId).get();
            if (!doc.exists) return null;
            return toArticle(doc.id, doc.data() || {});
        }, null);
    },
    async fetchForumComments(postId) {
        return withFirebaseFallback(async () => {
            const comments = await fetchFirebaseComments();
            return sortByCreatedAtAsc(
                comments.filter((comment) => (
                    comment.targetLineId === postId
                    && comment.status === APPROVED_STATUS
                    && isArticleCommentType(comment.type)
                ))
            );
        }, []);
    },
    async createForumPost(input) {
        try {
            const db = await loadFirebaseDb();
            await db.collection('articles').add({
                postId: `article-${Date.now()}`,
                author: input.author || DEFAULT_AUTHOR,
                contactEmail: input.contactEmail || '',
                title: input.title,
                content: input.content,
                category: input.category || DEFAULT_ARTICLE_CATEGORY,
                targetTopic: input.topic || '',
                targetSessionId: input.targetSessionSid || '',
                sourceSessionIds: input.sourceSessionSids || (input.targetSessionSid ? [input.targetSessionSid] : []),
                likes: 0,
                status: PENDING_STATUS,
                createdAt: new Date().toISOString(),
                source: 'workspace',
            });
        } catch (error) {
            throw toFirebaseSetupError(error);
        }
    },
    async fetchPendingForumPosts() {
        return withFirebaseFallback(async () => {
            const articles = await fetchFirebaseArticles();
            return sortByCreatedAtDesc(
                articles.filter((article) => article.status === PENDING_STATUS)
            );
        }, []);
    },
    async fetchPendingComments() {
        return withFirebaseFallback(async () => {
            const comments = await fetchFirebaseComments();
            return sortByCreatedAtDesc(
                comments.filter((comment) => comment.status === PENDING_STATUS)
            );
        }, []);
    },
    async reviewForumPost(input) {
        try {
            const db = await loadFirebaseDb();
            const ref = db.collection('articles').doc(input.targetId);

            if (input.action === 'delete') {
                await ref.delete();
            } else {
                await ref.update({
                    status: input.action === 'approve' ? APPROVED_STATUS : REJECTED_STATUS,
                    reviewedBy: input.reviewerName,
                    reviewedAt: new Date().toISOString(),
                    reviewNote: input.note || '',
                });
            }

            await writeReviewLog('article', input);
        } catch (error) {
            throw toFirebaseSetupError(error);
        }
    },
    async reviewComment(input) {
        try {
            const db = await loadFirebaseDb();
            const ref = db.collection('comments').doc(input.targetId);

            if (input.action === 'delete') {
                await ref.delete();
            } else if (input.action === 'mark-read') {
                await ref.update({
                    reviewedBy: input.reviewerName,
                    reviewedAt: new Date().toISOString(),
                    reviewNote: input.note || '已閱，待後續處理。',
                });
            } else {
                await ref.update({
                    status: input.action === 'approve' ? APPROVED_STATUS : REJECTED_STATUS,
                    reviewedBy: input.reviewerName,
                    reviewedAt: new Date().toISOString(),
                    reviewNote: input.note || '',
                });
            }

            await writeReviewLog('comment', input);
        } catch (error) {
            throw toFirebaseSetupError(error);
        }
    },
    async fetchTrendingArticleComments(limit = 3) {
        return withFirebaseFallback(async () => {
            const comments = await fetchFirebaseComments();
            return sortByLikesDesc(
                comments.filter((comment) => (
                    comment.status === APPROVED_STATUS
                    && isArticleCommentType(comment.type)
                ))
            ).slice(0, limit);
        }, []);
    },
    async fetchTrendingArticles(limit = 3) {
        return withFirebaseFallback(async () => {
            const articles = await fetchFirebaseArticles();
            return sortByLikesDesc(
                articles.filter((article) => article.status === APPROVED_STATUS)
            ).slice(0, limit);
        }, []);
    },
    async fetchInboxMessages() {
        return withFirebaseFallback(async () => sortByCreatedAtDesc(await fetchFirebaseInbox()), []);
    },
    async updateInboxMessage() {
        throw new Error('Firebase 收件匣狀態更新尚未接上，請改用 Notion 後端。');
    },
    async createContact(input) {
        try {
            const db = await loadFirebaseDb();
            await db.collection('contacts').add({
                title: input.category,
                messageType: input.category,
                senderName: input.name || '',
                senderEmail: input.email || '',
                content: input.content,
                attachmentUrl: input.attachmentUrl || '',
                isSensitive: input.category === '私密傳訊',
                status: '新進',
                internalNote: '',
                createdAt: new Date().toISOString(),
                handledBy: '',
                handledAt: '',
                relatedArticleId: '',
                relatedSessionId: '',
            });
        } catch (error) {
            throw toFirebaseSetupError(error);
        }
    },
    async incrementLike(targetId, targetType) {
        try {
            const db = await loadFirebaseDb();
            const updateLike = async (collection: 'articles' | 'comments') => {
                const ref = db.collection(collection).doc(targetId);
                const snap = await ref.get();
                if (!snap.exists) return null;

                const current = getNumber(snap.data()?.likes);
                const next = current + 1;
                await ref.update({ likes: next });
                return next;
            };

            if (targetType === 'interactions') {
                const articleLike = await updateLike('articles');
                if (articleLike !== null) return articleLike;

                const commentLike = await updateLike('comments');
                if (commentLike !== null) return commentLike;

                throw new Error(`Target not found: ${targetId}`);
            }

            if (targetType !== 'forum') {
                throw new Error(`Firebase provider does not support like target type: ${targetType}`);
            }

            const forumLike = await updateLike('articles');
            if (forumLike === null) throw new Error(`Target not found: ${targetId}`);
            return forumLike;
        } catch (error) {
            throw toFirebaseSetupError(error);
        }
    },
};

export function getBackendProvider(): BackendProvider {
    const explicit = process.env.BACKEND_PROVIDER;
    if (explicit === 'firebase') return firebaseProvider;
    if (explicit === 'notion') return notionProvider;
    return hasFirebaseEnv() ? firebaseProvider : notionProvider;
}
