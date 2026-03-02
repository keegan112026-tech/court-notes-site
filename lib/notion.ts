/* ── Raw Notion API (avoids SDK TypeScript issues) ── */
const NOTION_TOKEN = process.env.NOTION_TOKEN!;
const NOTION_VER = '2022-06-28';
const hdrs = {
    'Authorization': `Bearer ${NOTION_TOKEN}`,
    'Content-Type': 'application/json',
    'Notion-Version': NOTION_VER,
};
const API = 'https://api.notion.com/v1';

const DB = {
    global: process.env.NOTION_DB_GLOBAL!,
    sessions: process.env.NOTION_DB_SESSIONS!,
    transcripts: process.env.NOTION_DB_TRANSCRIPTS!,
    interactions: process.env.NOTION_DB_INTERACTIONS!,
    forum: process.env.NOTION_DB_FORUM!,
    contact: process.env.NOTION_DB_CONTACT!,
};

async function qry(dbId: string, body: any = {}): Promise<any> {
    const r = await fetch(`${API}/databases/${dbId}/query`, { method: 'POST', headers: hdrs, body: JSON.stringify(body), next: { revalidate: 0 } });
    if (!r.ok) throw new Error(`Notion query ${r.status}`);
    return r.json();
}
async function mkPage(body: any): Promise<any> {
    const r = await fetch(`${API}/pages`, { method: 'POST', headers: hdrs, body: JSON.stringify(body) });
    if (!r.ok) {
        const err = await r.json().catch(() => ({}));
        throw new Error(`Notion create ${r.status}: ${JSON.stringify(err)}`);
    }
    return r.json();
}
async function getPage(id: string): Promise<any> {
    const r = await fetch(`${API}/pages/${id}`, { headers: hdrs });
    if (!r.ok) throw new Error(`Notion get ${r.status}`);
    return r.json();
}
async function patchPage(id: string, props: any): Promise<any> {
    const r = await fetch(`${API}/pages/${id}`, { method: 'PATCH', headers: hdrs, body: JSON.stringify({ properties: props }) });
    if (!r.ok) throw new Error(`Notion update ${r.status}`);
    return r.json();
}

/* ── helpers ── */
function txt(page: any, prop: string): string {
    const p = page.properties[prop];
    if (!p) return '';
    if (p.type === 'title') return p.title?.map((t: any) => t.plain_text).join('') ?? '';
    if (p.type === 'rich_text') return p.rich_text?.map((t: any) => t.plain_text).join('') ?? '';
    return '';
}
function num(page: any, prop: string): number { return page.properties[prop]?.number ?? 0; }
function sel(page: any, prop: string): string { return page.properties[prop]?.select?.name ?? ''; }
function dte(page: any, prop: string): string { return page.properties[prop]?.date?.start ?? ''; }
function chk(page: any, prop: string): boolean { return page.properties[prop]?.checkbox ?? false; }

/* ════ CMS ════ */
export async function fetchAllCMS(): Promise<Record<string, string>> {
    const map: Record<string, string> = {};
    let cursor: string | undefined;
    do {
        const res = await qry(DB.global, { start_cursor: cursor, page_size: 100 });
        for (const p of res.results) { const k = txt(p, 'Key'); if (k) map[k] = txt(p, 'Content'); }
        cursor = res.has_more ? res.next_cursor : undefined;
    } while (cursor);
    return map;
}

export async function fetchCMS(key: string): Promise<string> {
    const res = await qry(DB.global, { filter: { property: 'Key', title: { equals: key } }, page_size: 1 });
    return res.results.length ? txt(res.results[0], 'Content') : '';
}

/* ════ Sessions ════ */
export interface Session { id: string; sessionId: string; title: string; date: string; category: string; status: string; summary: string; hotTopic: boolean; participantsCount: number; }
export async function fetchSessions(): Promise<Session[]> {
    const res = await qry(DB.sessions, { filter: { property: 'Status', select: { equals: '已發布' } }, sorts: [{ property: 'Date', direction: 'descending' }] });
    return res.results.map((p: any) => ({ id: p.id, sessionId: txt(p, 'Session_ID'), title: txt(p, 'Title'), date: dte(p, 'Date'), category: sel(p, 'Category'), status: sel(p, 'Status'), summary: txt(p, 'Summary'), hotTopic: chk(p, 'Hot_Topic'), participantsCount: num(p, 'Participants_Count') }));
}
export async function fetchSessionById(sid: string): Promise<Session | null> {
    const res = await qry(DB.sessions, { filter: { property: 'Session_ID', title: { equals: sid } }, page_size: 1 });
    if (!res.results.length) return null;
    const p = res.results[0];
    return { id: p.id, sessionId: txt(p, 'Session_ID'), title: txt(p, 'Title'), date: dte(p, 'Date'), category: sel(p, 'Category'), status: sel(p, 'Status'), summary: txt(p, 'Summary'), hotTopic: chk(p, 'Hot_Topic'), participantsCount: num(p, 'Participants_Count') };
}

/* ════ Transcripts ════ */
export interface TranscriptLine { id: string; lineId: string; role: string; action: string; content: string; order: number; mergeGroupId: string; likeCount: number; }
export async function fetchTranscripts(sessionSid: string): Promise<TranscriptLine[]> {
    const all: TranscriptLine[] = [];
    let cursor: string | undefined;
    do {
        const res = await qry(DB.transcripts, {
            filter: {
                or: [
                    { property: 'Session_ID', select: { equals: sessionSid } },
                    { property: 'Session_ID', select: { equals: 'S-206' } }
                ]
            },
            sorts: [{ property: 'Order', direction: 'ascending' }],
            start_cursor: cursor,
            page_size: 100
        });
        for (const p of res.results) {
            all.push({
                id: p.id,
                lineId: txt(p, 'Line_ID'),
                role: txt(p, 'Role') || sel(p, 'Role'),
                action: txt(p, 'Action'),
                content: txt(p, 'Content'),
                order: num(p, 'Order'),
                mergeGroupId: txt(p, 'Merge_Group_ID'),
                likeCount: num(p, 'Like_Count')
            });
        }
        cursor = res.has_more ? res.next_cursor : undefined;
    } while (cursor);
    return all;
}

/* ════ Comments ════ */
export interface Comment { id: string; targetLineId: string; author: string; content: string; likes: number; status: string; createdAt: string; type: string; targetTopic?: string; }
export async function fetchComments(targetLineId: string): Promise<Comment[]> {
    const res = await qry(DB.interactions, {
        filter: {
            and: [
                { property: 'Target_Line_ID', rich_text: { equals: targetLineId } },
                { property: 'Status', select: { equals: '核准' } }
            ]
        },
        sorts: [{ property: 'Likes', direction: 'descending' }]
    });
    return res.results.map((p: any) => ({
        id: p.id,
        targetLineId: txt(p, 'Target_Line_ID'),
        author: txt(p, 'Author'),
        content: txt(p, 'Content'),
        likes: num(p, 'Likes'),
        status: sel(p, 'Status'),
        type: sel(p, 'Type'),
        targetTopic: sel(p, 'Target_Topic'),
        createdAt: p.created_time
    }));
}
export async function createComment(targetLineId: string, author: string, content: string, sessionId: string, topic?: string) {
    const props: any = {
        Comment_ID: { title: [{ text: { content: `c-${Date.now()}` } }] },
        Target_Line_ID: { rich_text: [{ text: { content: targetLineId } }] },
        Author: { rich_text: [{ text: { content: author || '匿名夥伴' } }] },
        Content: { rich_text: [{ text: { content } }] },
        Likes: { number: 0 },
        Status: { select: { name: '待審核' } },
        Type: { select: { name: '段落留言' } }
    };
    if (topic) props.Target_Topic = { select: { name: topic } };
    if (sessionId) {
        const session = await fetchSessionById(sessionId);
        if (session && session.id) {
            props.Target_Session = { relation: [{ id: session.id }] };
        }
    }
    return mkPage({ parent: { database_id: DB.interactions }, properties: props });
}

/* ════ Forum ════ */
export interface ForumPost { id: string; postId: string; author: string; title: string; content: string; category: string; targetTopic: string; targetSessionId: string; likes: number; status: string; createdAt: string; }
export async function fetchForumPosts(): Promise<ForumPost[]> {
    const res = await qry(DB.interactions, {
        filter: {
            and: [
                { property: 'Type', select: { equals: '論壇文章' } },
                { property: 'Status', select: { equals: '核准' } }
            ]
        },
        sorts: [{ timestamp: 'created_time', direction: 'descending' }]
    });
    return res.results.map((p: any) => ({
        id: p.id,
        postId: txt(p, 'Comment_ID'),
        author: txt(p, 'Author'),
        title: txt(p, 'Title'),
        content: txt(p, 'Content'),
        category: sel(p, 'Category'),
        targetTopic: sel(p, 'Target_Topic'),
        // we can return relation id or we don't need it right now
        targetSessionId: p.properties.Target_Session?.relation?.[0]?.id ?? '',
        likes: num(p, 'Likes'),
        status: sel(p, 'Status'),
        createdAt: p.created_time
    }));
}
export async function createForumPost(author: string, title: string, content: string, category: string, topic?: string, targetSessionSid?: string) {
    const props: any = {
        Comment_ID: { title: [{ text: { content: `f-${Date.now()}` } }] },
        Type: { select: { name: '論壇文章' } },
        Author: { rich_text: [{ text: { content: author || '匿名夥伴' } }] },
        Title: { rich_text: [{ text: { content: title } }] },
        Content: { rich_text: [{ text: { content } }] },
        Category: { select: { name: category } },
        Likes: { number: 0 },
        Status: { select: { name: '待審核' } },
    };
    if (topic) props.Target_Topic = { select: { name: topic } };
    if (targetSessionSid) {
        const session = await fetchSessionById(targetSessionSid);
        if (session && session.id) {
            props.Target_Session = { relation: [{ id: session.id }] };
        }
    }

    return mkPage({ parent: { database_id: DB.interactions }, properties: props });
}

/* ════ Contact ════ */
export async function createContact(name: string, category: string, content: string, attachmentUrl?: string) {
    const props: any = {
        Message_ID: { title: [{ text: { content: `m-${Date.now()}` } }] },
        Sender_Name: { rich_text: [{ text: { content: name || '匿名' } }] },
        Category: { select: { name: category } },
        Content: { rich_text: [{ text: { content } }] },
        Status: { select: { name: '未讀' } },
    };
    if (attachmentUrl) props.Attachment_URL = { url: attachmentUrl };
    return mkPage({ parent: { database_id: DB.contact }, properties: props });
}

/* ════ Like ════ */
export async function incrementLike(pageId: string, targetDb: 'transcripts' | 'interactions' | 'forum') {
    const field = targetDb === 'transcripts' ? 'Like_Count' : 'Likes';
    const page = await getPage(pageId);
    const cur = page.properties[field]?.number ?? 0;
    await patchPage(pageId, { [field]: { number: cur + 1 } });
    return cur + 1;
}

/* ════ Trending & Stats ════ */
export async function fetchTrendingNotes(limit = 5) {
    const res = await qry(DB.transcripts, { sorts: [{ property: 'Like_Count', direction: 'descending' }], page_size: limit });
    return res.results.map((p: any) => {
        const sessionPageId = p.properties.Session_ID?.relation?.[0]?.id || '';
        return { id: p.id, lineId: txt(p, 'Line_ID'), content: txt(p, 'Content'), role: sel(p, 'Role'), likeCount: num(p, 'Like_Count'), sessionPageId };
    });
}
export async function fetchTrendingComments(limit = 3) {
    const res = await qry(DB.interactions, {
        filter: {
            and: [
                { property: 'Status', select: { equals: '核准' } },
                { property: 'Type', select: { equals: '段落留言' } }
            ]
        },
        sorts: [{ property: 'Likes', direction: 'descending' }],
        page_size: limit
    });
    return res.results.map((p: any) => ({
        id: p.id,
        author: txt(p, 'Author'),
        content: txt(p, 'Content'),
        likes: num(p, 'Likes'),
        role: '段落留言',
        targetLineId: txt(p, 'Target_Line_ID'),
        targetSessionId: p.properties.Target_Session?.relation?.[0]?.id ?? ''
    }));
}
export async function fetchTrendingArticles(limit = 3) {
    const res = await qry(DB.interactions, {
        filter: {
            and: [
                { property: 'Status', select: { equals: '核准' } },
                { property: 'Type', select: { equals: '論壇文章' } }
            ]
        },
        sorts: [{ property: 'Likes', direction: 'descending' }],
        page_size: limit
    });
    return res.results.map((p: any) => ({
        id: p.id,
        title: txt(p, 'Title'),
        author: txt(p, 'Author'),
        category: sel(p, 'Category'),
        likes: num(p, 'Likes'),
        targetTopic: sel(p, 'Target_Topic'),
        targetSessionId: p.properties.Target_Session?.relation?.[0]?.id ?? ''
    }));
}
export async function fetchSiteStats() {
    try {
        const [sessionsRes, commentsRes, restoredSes] = await Promise.all([
            qry(DB.sessions, { page_size: 100 }),
            qry(DB.interactions, { filter: { property: 'Status', select: { equals: '核准' } }, page_size: 100 }),
            qry(DB.sessions, { filter: { property: 'Status', select: { equals: '已發布' } }, page_size: 100 })
        ]);

        return {
            totalSessions: sessionsRes.results?.length || 0,
            restoredSessions: restoredSes.results?.length || 0,
            approvedComments: commentsRes.results?.length || 0
        };
    } catch (e) {
        return { totalSessions: 0, restoredSessions: 0, approvedComments: 0 };
    }
}

export async function fetchAllApprovedParagraphComments(): Promise<Comment[]> {
    const all: Comment[] = [];
    let cursor: string | undefined;
    do {
        const res = await qry(DB.interactions, {
            filter: {
                and: [
                    { property: 'Status', select: { equals: '核准' } },
                    { property: 'Type', select: { equals: '段落留言' } }
                ]
            },
            start_cursor: cursor, page_size: 100
        });
        for (const p of res.results) {
            all.push({
                id: p.id,
                targetLineId: txt(p, 'Target_Line_ID'),
                author: txt(p, 'Author'),
                content: txt(p, 'Content'),
                likes: num(p, 'Likes'),
                status: sel(p, 'Status'),
                type: sel(p, 'Type'),
                targetTopic: sel(p, 'Target_Topic'),
                createdAt: p.created_time
            });
        }
        cursor = res.has_more ? res.next_cursor : undefined;
    } while (cursor);
    return all;
}
