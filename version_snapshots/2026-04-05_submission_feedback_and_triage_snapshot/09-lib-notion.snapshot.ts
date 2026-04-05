const NOTION_TOKEN = process.env.NOTION_TOKEN || '';
const NOTION_VERSION = '2022-06-28';
const API = 'https://api.notion.com/v1';

const DB = {
    articles: process.env.NOTION_DB_ARTICLES || '',
    comments: process.env.NOTION_DB_COMMENTS || '',
    inbox: process.env.NOTION_DB_INBOX || '',
    moderationLog: process.env.NOTION_DB_MODERATION_LOG || '',
};

type NotionPage = Record<string, any>;
type ReviewAction = 'approve' | 'reject' | 'delete' | 'mark-read';
type ReviewTargetType = 'article' | 'comment' | 'inbox';

function ensureNotionToken() {
    if (!NOTION_TOKEN) {
        throw new Error('Notion 環境變數尚未完成：NOTION_TOKEN');
    }
}

function ensureDatabase(
    key: keyof typeof DB,
    envName: 'NOTION_DB_ARTICLES' | 'NOTION_DB_COMMENTS' | 'NOTION_DB_INBOX' | 'NOTION_DB_MODERATION_LOG'
) {
    const databaseId = DB[key];
    if (!databaseId) {
        throw new Error(`Notion 環境變數尚未完成：${envName}`);
    }
    return databaseId;
}

const headers = {
    Authorization: `Bearer ${NOTION_TOKEN}`,
    'Content-Type': 'application/json',
    'Notion-Version': NOTION_VERSION,
};

async function notionFetch(path: string, init?: RequestInit) {
    ensureNotionToken();

    const res = await fetch(`${API}${path}`, {
        ...init,
        headers: {
            ...headers,
            ...(init?.headers || {}),
        },
        cache: 'no-store',
    });

    if (!res.ok) {
        const body = await res.text().catch(() => '');
        throw new Error(`Notion API ${res.status}: ${body}`);
    }

    return res.json();
}

async function queryDatabase(databaseId: string, body: Record<string, any> = {}) {
    return notionFetch(`/databases/${databaseId}/query`, {
        method: 'POST',
        body: JSON.stringify(body),
    });
}

async function createPage(databaseId: string, properties: Record<string, any>) {
    return notionFetch('/pages', {
        method: 'POST',
        body: JSON.stringify({
            parent: { database_id: databaseId },
            properties,
        }),
    });
}

async function updatePageProperties(pageId: string, properties: Record<string, any>) {
    return notionFetch(`/pages/${pageId}`, {
        method: 'PATCH',
        body: JSON.stringify({ properties }),
    });
}

async function archivePage(pageId: string) {
    return notionFetch(`/pages/${pageId}`, {
        method: 'PATCH',
        body: JSON.stringify({ archived: true }),
    });
}

async function retrievePage(pageId: string) {
    return notionFetch(`/pages/${pageId}`);
}

function extractTitle(page: NotionPage, name: string) {
    const prop = page.properties?.[name];
    if (!prop || prop.type !== 'title') return '';
    return prop.title?.map((item: any) => item.plain_text).join('') || '';
}

function extractRichText(page: NotionPage, name: string) {
    const prop = page.properties?.[name];
    if (!prop || prop.type !== 'rich_text') return '';
    return prop.rich_text?.map((item: any) => item.plain_text).join('') || '';
}

function extractSelect(page: NotionPage, name: string) {
    const prop = page.properties?.[name];
    if (!prop) return '';
    if (prop.type === 'select') return prop.select?.name || '';
    if (prop.type === 'status') return prop.status?.name || '';
    return '';
}

function extractNumber(page: NotionPage, name: string) {
    return page.properties?.[name]?.number ?? 0;
}

function extractDate(page: NotionPage, name: string) {
    return page.properties?.[name]?.date?.start || '';
}

function extractEmail(page: NotionPage, name: string) {
    return page.properties?.[name]?.email || '';
}

function extractUrl(page: NotionPage, name: string) {
    return page.properties?.[name]?.url || '';
}

function extractCheckbox(page: NotionPage, name: string) {
    return page.properties?.[name]?.checkbox ?? false;
}

function splitRichText(value: string) {
    const normalized = String(value || '');
    if (!normalized) return [];

    const chunks = normalized.match(/[\s\S]{1,1800}/g) || [];
    return chunks.map((chunk) => ({
        type: 'text',
        text: { content: chunk },
    }));
}

function titleProp(value: string) {
    return { title: splitRichText(value).length ? splitRichText(value) : [{ type: 'text', text: { content: '未命名' } }] };
}

function richTextProp(value: string) {
    return { rich_text: splitRichText(value) };
}

function emailProp(value?: string) {
    return { email: value || null };
}

function dateProp(value?: string) {
    return { date: value ? { start: value } : null };
}

function statusProp(name: string) {
    return { status: { name } };
}

function selectProp(name?: string) {
    return { select: name ? { name } : null };
}

function numberProp(value: number) {
    return { number: value };
}

function checkboxProp(value: boolean) {
    return { checkbox: value };
}

function urlProp(value?: string) {
    return { url: value || null };
}

function multiSelectProp(values: string[]) {
    return { multi_select: values.map((value) => ({ name: value })) };
}

function nowDate() {
    return new Date().toISOString();
}

function summarizeTitle(prefix: string, content: string) {
    const trimmed = content.replace(/\s+/g, ' ').trim();
    return `${prefix}｜${trimmed.slice(0, 30) || '未命名'}`;
}

function mapArticle(page: NotionPage) {
    return {
        id: page.id,
        postId: extractRichText(page, 'public_slug') || page.id,
        author: extractRichText(page, 'author_name') || '匿名作者',
        contactEmail: extractEmail(page, 'contact_email') || undefined,
        title: extractTitle(page, '標題'),
        content: extractRichText(page, 'content_html'),
        category: extractSelect(page, 'article_type') || '觀庭共構文章',
        targetTopic: '',
        targetSessionId: extractRichText(page, 'primary_session_id'),
        sourceSessionIds: page.properties?.source_session_ids?.multi_select?.map((item: any) => item.name) || [],
        likes: extractNumber(page, 'likes_count'),
        status: extractSelect(page, 'status'),
        createdAt: extractDate(page, 'created_at') || page.created_time || nowDate(),
        reviewedAt: extractDate(page, 'reviewed_at') || undefined,
        reviewedBy: extractRichText(page, 'reviewed_by') || undefined,
        reviewNote: extractRichText(page, 'review_note') || undefined,
    };
}

function mapComment(page: NotionPage) {
    return {
        id: page.id,
        targetLineId: extractRichText(page, 'article_id'),
        author: extractRichText(page, 'author_name') || '匿名留言',
        content: extractRichText(page, 'content'),
        likes: extractNumber(page, 'likes_count'),
        status: extractSelect(page, 'status'),
        createdAt: extractDate(page, 'created_at') || page.created_time || nowDate(),
        type: extractSelect(page, 'comment_type') || '一般留言',
        targetTopic: '',
        targetSessionId: extractRichText(page, 'target_session_id') || undefined,
        reviewedAt: extractDate(page, 'reviewed_at') || undefined,
        reviewedBy: extractRichText(page, 'reviewed_by') || undefined,
        reviewNote: extractRichText(page, 'review_note') || undefined,
    };
}

function mapInbox(page: NotionPage) {
    return {
        id: page.id,
        title: extractTitle(page, '主旨'),
        messageType: extractSelect(page, 'message_type'),
        senderName: extractRichText(page, 'sender_name'),
        senderEmail: extractEmail(page, 'sender_email'),
        content: extractRichText(page, 'content'),
        attachmentUrl: extractUrl(page, 'attachment_url'),
        isSensitive: extractCheckbox(page, 'is_sensitive'),
        status: extractSelect(page, 'status'),
        internalNote: extractRichText(page, 'internal_note'),
        createdAt: extractDate(page, 'created_at') || page.created_time || nowDate(),
        handledBy: extractRichText(page, 'handled_by'),
        handledAt: extractDate(page, 'handled_at'),
        relatedArticleId: extractRichText(page, 'related_article_id'),
        relatedSessionId: extractRichText(page, 'related_session_id'),
    };
}

const ARTICLE_STATUS = {
    pending: '待審核',
    reviewing: '審閱中',
    revision: '退回修改',
    approved: '已核准',
    published: '已發布',
    archived: '已封存',
};

const COMMENT_STATUS = {
    pending: '待審核',
    approved: '已核准',
    rejected: '退回',
    deleted: '已刪除',
};

const INBOX_STATUS = {
    fresh: '新進',
    reading: '處理中',
    resolved: '已結案',
};

function actionLabel(action: ReviewAction) {
    if (action === 'approve') return 'Approve｜核准';
    if (action === 'reject') return 'Reject｜拒絕';
    if (action === 'mark-read') return 'Reject｜拒絕';
    return 'Delete｜刪除';
}

function targetTypeLabel(type: ReviewTargetType) {
    if (type === 'article') return 'article（文章）';
    if (type === 'comment') return 'comment（留言）';
    return 'inbox（訊息）';
}

async function createModerationLog(input: {
    targetType: ReviewTargetType;
    targetId: string;
    action: ReviewAction;
    actorName: string;
    note?: string;
    before?: string;
    after?: string;
    label?: string;
}) {
    const title = `${input.label || '審查紀錄'}：${input.targetId}`;
    const moderationDbId = ensureDatabase('moderationLog', 'NOTION_DB_MODERATION_LOG');

    await createPage(moderationDbId, {
        title: titleProp(title),
        target_type: selectProp(targetTypeLabel(input.targetType)),
        target_id: richTextProp(input.targetId),
        action: selectProp(actionLabel(input.action)),
        actor_name: richTextProp(input.actorName),
        acted_at: dateProp(nowDate()),
        target_status_before: richTextProp(input.before || ''),
        target_status_after: richTextProp(input.after || ''),
        note: richTextProp(input.note || ''),
    });
}

export async function fetchForumPosts() {
    const articlesDbId = ensureDatabase('articles', 'NOTION_DB_ARTICLES');
    const res = await queryDatabase(articlesDbId, {
        filter: {
            property: 'status',
            status: { equals: ARTICLE_STATUS.published },
        },
        sorts: [{ property: 'published_at', direction: 'descending' }],
        page_size: 100,
    });

    return res.results.map(mapArticle);
}

export async function fetchAllForumPosts() {
    const articlesDbId = ensureDatabase('articles', 'NOTION_DB_ARTICLES');
    const res = await queryDatabase(articlesDbId, {
        sorts: [{ property: 'created_at', direction: 'descending' }],
        page_size: 100,
    });

    return res.results.map(mapArticle);
}

export async function fetchForumPostById(postId: string) {
    try {
        const page = await retrievePage(postId);
        const mapped = mapArticle(page);
        return mapped.status === ARTICLE_STATUS.published ? mapped : null;
    } catch {
        const articlesDbId = ensureDatabase('articles', 'NOTION_DB_ARTICLES');
        const res = await queryDatabase(articlesDbId, {
            filter: {
                property: 'public_slug',
                rich_text: { equals: postId },
            },
            page_size: 1,
        });

        const page = res.results?.[0];
        if (!page) return null;
        const mapped = mapArticle(page);
        return mapped.status === ARTICLE_STATUS.published ? mapped : null;
    }
}

export async function fetchPendingForumPosts() {
    const articlesDbId = ensureDatabase('articles', 'NOTION_DB_ARTICLES');
    const res = await queryDatabase(articlesDbId, {
        filter: {
            property: 'status',
            status: { equals: ARTICLE_STATUS.pending },
        },
        sorts: [{ property: 'created_at', direction: 'descending' }],
        page_size: 100,
    });

    return res.results.map(mapArticle);
}

export async function createForumPost(
    author: string,
    contactEmail: string,
    title: string,
    content: string,
    _category: string,
    _topic?: string,
    targetSessionSid?: string,
    sourceSessionSids: string[] = []
) {
    const articlesDbId = ensureDatabase('articles', 'NOTION_DB_ARTICLES');
    const sessionIds = sourceSessionSids.length > 0
        ? sourceSessionSids
        : (targetSessionSid ? [targetSessionSid] : []);

    const articleType = sessionIds.length > 1 ? '跨場次' : '單場次';
    const publicSlug = `art-${Date.now()}`;

    await createPage(articlesDbId, {
        title: titleProp(title),
        author_name: richTextProp(author || '匿名作者'),
        contact_email: emailProp(contactEmail),
        content_html: richTextProp(content),
        summary: richTextProp(''),
        article_type: selectProp(articleType),
        primary_session_id: richTextProp(targetSessionSid || sessionIds[0] || ''),
        source_session_ids: multiSelectProp(sessionIds),
        status: statusProp(ARTICLE_STATUS.pending),
        reviewed_by: richTextProp(''),
        reviewed_at: dateProp(),
        review_note: richTextProp(''),
        published_at: dateProp(),
        likes_count: numberProp(0),
        comments_count: numberProp(0),
        last_activity_at: dateProp(nowDate()),
        created_at: dateProp(nowDate()),
        public_slug: richTextProp(publicSlug),
        is_featured: checkboxProp(false),
    });
}

export async function reviewForumPost(input: {
    targetId: string;
    reviewerName: string;
    note?: string;
    action: ReviewAction;
}) {
    const page = await retrievePage(input.targetId);
    const before = extractSelect(page, 'status');

    if (input.action === 'delete') {
        await archivePage(input.targetId);
        await createModerationLog({
            targetType: 'article',
            targetId: input.targetId,
            action: input.action,
            actorName: input.reviewerName,
            note: input.note,
            before,
            after: ARTICLE_STATUS.archived,
            label: `封存文章：${extractTitle(page, '標題') || input.targetId}`,
        });
        return;
    }

    const nextStatus = input.action === 'approve'
        ? ARTICLE_STATUS.published
        : ARTICLE_STATUS.revision;

    await updatePageProperties(input.targetId, {
        status: statusProp(nextStatus),
        reviewed_by: richTextProp(input.reviewerName),
        reviewed_at: dateProp(nowDate()),
        review_note: richTextProp(input.note || ''),
        last_activity_at: dateProp(nowDate()),
        ...(input.action === 'approve' ? { published_at: dateProp(nowDate()) } : {}),
    });

    await createModerationLog({
        targetType: 'article',
        targetId: input.targetId,
        action: input.action,
        actorName: input.reviewerName,
        note: input.note,
        before,
        after: nextStatus,
        label: `${input.action === 'approve' ? '核准文章' : '退回文章'}：${extractTitle(page, '標題') || input.targetId}`,
    });
}

export async function fetchComments(targetLineId: string) {
    const commentsDbId = ensureDatabase('comments', 'NOTION_DB_COMMENTS');
    const res = await queryDatabase(commentsDbId, {
        filter: {
            and: [
                { property: 'article_id', rich_text: { equals: targetLineId } },
                { property: 'status', select: { equals: COMMENT_STATUS.approved } },
            ],
        },
        sorts: [{ property: 'likes_count', direction: 'descending' }],
        page_size: 100,
    });

    return res.results.map(mapComment);
}

export async function fetchForumComments(postId: string) {
    const commentsDbId = ensureDatabase('comments', 'NOTION_DB_COMMENTS');
    const res = await queryDatabase(commentsDbId, {
        filter: {
            and: [
                { property: 'article_id', rich_text: { equals: postId } },
                { property: 'status', select: { equals: COMMENT_STATUS.approved } },
            ],
        },
        sorts: [{ property: 'created_at', direction: 'ascending' }],
        page_size: 100,
    });

    return res.results.map(mapComment);
}

export async function fetchPendingComments() {
    const commentsDbId = ensureDatabase('comments', 'NOTION_DB_COMMENTS');
    const res = await queryDatabase(commentsDbId, {
        filter: {
            property: 'status',
            select: { equals: COMMENT_STATUS.pending },
        },
        sorts: [{ property: 'created_at', direction: 'descending' }],
        page_size: 100,
    });

    return res.results.map(mapComment);
}

export async function fetchAllComments() {
    const commentsDbId = ensureDatabase('comments', 'NOTION_DB_COMMENTS');
    const res = await queryDatabase(commentsDbId, {
        sorts: [{ property: 'created_at', direction: 'descending' }],
        page_size: 100,
    });

    return res.results.map(mapComment);
}

export async function createComment(
    targetLineId: string,
    author: string,
    content: string,
    sessionId: string,
    _topic?: string,
    type: string = '一般留言'
) {
    const commentsDbId = ensureDatabase('comments', 'NOTION_DB_COMMENTS');
    await createPage(commentsDbId, {
        title: titleProp(summarizeTitle('留言', content)),
        content: richTextProp(content),
        author_name: richTextProp(author || '匿名留言'),
        article_id: richTextProp(targetLineId),
        comment_type: selectProp(type === 'article-comment' ? '一般留言' : type),
        status: selectProp(COMMENT_STATUS.pending),
        likes_count: numberProp(0),
        reviewed_by: richTextProp(''),
        reviewed_at: dateProp(),
        review_note: richTextProp(''),
        created_at: dateProp(nowDate()),
        target_session_id: richTextProp(sessionId || ''),
        is_sensitive: checkboxProp(false),
    });
}

export async function reviewComment(input: {
    targetId: string;
    reviewerName: string;
    note?: string;
    action: ReviewAction;
}) {
    const page = await retrievePage(input.targetId);
    const before = extractSelect(page, 'status');

    if (input.action === 'delete') {
        await archivePage(input.targetId);
        await createModerationLog({
            targetType: 'comment',
            targetId: input.targetId,
            action: input.action,
            actorName: input.reviewerName,
            note: input.note,
            before,
            after: COMMENT_STATUS.deleted,
            label: `刪除留言：${extractTitle(page, '留言內容') || input.targetId}`,
        });
        return;
    }

    if (input.action === 'mark-read') {
        await updatePageProperties(input.targetId, {
            reviewed_by: richTextProp(input.reviewerName),
            reviewed_at: dateProp(nowDate()),
            review_note: richTextProp(input.note || '已閱，待後續處理。'),
        });
        return;
    }

    const nextStatus = input.action === 'approve'
        ? COMMENT_STATUS.approved
        : COMMENT_STATUS.rejected;

    await updatePageProperties(input.targetId, {
        status: selectProp(nextStatus),
        reviewed_by: richTextProp(input.reviewerName),
        reviewed_at: dateProp(nowDate()),
        review_note: richTextProp(input.note || ''),
    });

    await createModerationLog({
        targetType: 'comment',
        targetId: input.targetId,
        action: input.action,
        actorName: input.reviewerName,
        note: input.note,
        before,
        after: nextStatus,
        label: `${input.action === 'approve' ? '核准留言' : '退回留言'}：${extractTitle(page, '留言內容') || input.targetId}`,
    });
}

export async function createContact(name: string, category: string, content: string, attachmentUrl?: string, email?: string) {
    const inboxDbId = ensureDatabase('inbox', 'NOTION_DB_INBOX');
    await createPage(inboxDbId, {
        title: titleProp(summarizeTitle(category || '訊息', content)),
        message_type: selectProp(category),
        sender_name: richTextProp(name || ''),
        sender_email: emailProp(email),
        content: richTextProp(content),
        attachment_url: urlProp(attachmentUrl),
        is_sensitive: checkboxProp(category === '私密傳訊'),
        status: selectProp(INBOX_STATUS.fresh),
        internal_note: richTextProp(''),
        created_at: dateProp(nowDate()),
        handled_by: richTextProp(''),
        handled_at: dateProp(),
        related_article_id: richTextProp(''),
        related_session_id: richTextProp(''),
    });
}

export async function updateInboxMessage(input: {
    targetId: string;
    reviewerName: string;
    note?: string;
    action: 'mark-read' | 'mark-resolved';
}) {
    const page = await retrievePage(input.targetId);
    const before = extractSelect(page, 'status');
    const nextStatus = input.action === 'mark-resolved' ? INBOX_STATUS.resolved : INBOX_STATUS.reading;

    await updatePageProperties(input.targetId, {
        status: selectProp(nextStatus),
        internal_note: richTextProp(input.note || ''),
        handled_by: richTextProp(input.reviewerName),
        handled_at: dateProp(nowDate()),
    });

    await createModerationLog({
        targetType: 'inbox',
        targetId: input.targetId,
        action: input.action === 'mark-resolved' ? 'approve' : 'reject',
        actorName: input.reviewerName,
        note: input.note,
        before,
        after: nextStatus,
        label: `${input.action === 'mark-resolved' ? '收件匣已處理' : '收件匣已閱'}｜${extractTitle(page, '主旨') || input.targetId}`,
    });
}

async function incrementNumberProperty(pageId: string, propertyName: string) {
    const page = await retrievePage(pageId);
    const nextValue = extractNumber(page, propertyName) + 1;
    await updatePageProperties(pageId, {
        [propertyName]: numberProp(nextValue),
        last_activity_at: propertyName === 'likes_count' ? dateProp(nowDate()) : undefined,
    });
    return nextValue;
}

export async function incrementLike(pageId: string, targetType: 'transcripts' | 'interactions' | 'forum') {
    if (targetType === 'transcripts') {
        throw new Error('逐字稿按讚目前仍使用前端本地資料，不透過 Notion 寫入。');
    }

    return incrementNumberProperty(pageId, 'likes_count');
}

export async function fetchTrendingArticles(limit = 3) {
    const articlesDbId = ensureDatabase('articles', 'NOTION_DB_ARTICLES');
    const res = await queryDatabase(articlesDbId, {
        filter: {
            property: 'status',
            status: { equals: ARTICLE_STATUS.published },
        },
        sorts: [{ property: 'likes_count', direction: 'descending' }],
        page_size: limit,
    });

    return res.results.map(mapArticle);
}

export async function fetchTrendingArticleComments(limit = 3) {
    const commentsDbId = ensureDatabase('comments', 'NOTION_DB_COMMENTS');
    const res = await queryDatabase(commentsDbId, {
        filter: {
            property: 'status',
            select: { equals: COMMENT_STATUS.approved },
        },
        sorts: [{ property: 'likes_count', direction: 'descending' }],
        page_size: limit,
    });

    return res.results.map(mapComment);
}

export async function fetchInboxMessages() {
    const inboxDbId = ensureDatabase('inbox', 'NOTION_DB_INBOX');
    const res = await queryDatabase(inboxDbId, {
        sorts: [{ property: 'created_at', direction: 'descending' }],
        page_size: 100,
    });

    return res.results.map(mapInbox);
}
