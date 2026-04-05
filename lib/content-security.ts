const ALLOWED_TAGS = new Set([
    'p',
    'br',
    'strong',
    'em',
    'u',
    's',
    'blockquote',
    'ul',
    'ol',
    'li',
    'code',
    'pre',
    'h1',
    'h2',
    'h3',
    'hr',
    'cite',
]);

function escapeHtml(value: string) {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function normalizePlainText(value: unknown, fallback = '') {
    if (typeof value !== 'string') return fallback;
    return value
        .replace(/[\u0000-\u001F\u007F]/g, ' ')
        .replace(/[<>]/g, '')
        .trim();
}

function extractAttr(attrs: string, name: string) {
    const pattern = new RegExp(`${name}="([^"]*)"`, 'i');
    const match = attrs.match(pattern);
    return match?.[1] || '';
}

export function sanitizeArticleHtml(input: unknown) {
    if (typeof input !== 'string') return '';

    let html = input;
    html = html.replace(/<!--[\s\S]*?-->/g, '');
    html = html.replace(
        /<(script|style|iframe|object|embed|form|input|button|textarea|select|meta|link)[^>]*>[\s\S]*?<\/\1>/gi,
        ''
    );
    html = html.replace(
        /<(script|style|iframe|object|embed|form|input|button|textarea|select|meta|link)[^>]*\/?>/gi,
        ''
    );

    return html.replace(/<\/?([a-z0-9-]+)([^>]*)>/gi, (full, rawTag: string, rawAttrs: string) => {
        const tag = rawTag.toLowerCase();
        const isClosing = full.startsWith('</');

        if (!ALLOWED_TAGS.has(tag)) {
            return '';
        }

        if (isClosing) {
            return `</${tag}>`;
        }

        if (tag === 'br' || tag === 'hr') {
            return `<${tag}>`;
        }

        if (tag === 'cite') {
            const lineId = escapeHtml(extractAttr(rawAttrs, 'data-line'));
            const sessionId = escapeHtml(extractAttr(rawAttrs, 'data-session'));
            const speaker = escapeHtml(extractAttr(rawAttrs, 'data-speaker'));

            if (!lineId || !sessionId) {
                return '';
            }

            const attrs = [`data-line="${lineId}"`, `data-session="${sessionId}"`];
            if (speaker) attrs.push(`data-speaker="${speaker}"`);
            return `<cite ${attrs.join(' ')}>`;
        }

        return `<${tag}>`;
    });
}

export function sanitizeArticleForSession(input: unknown, sessionId: string) {
    const sanitized = sanitizeArticleHtml(input);
    if (!sessionId) return sanitized;

    return sanitized.replace(/<cite([^>]*)data-session="([^"]*)"([^>]*)>/gi, (full, before, citeSession, after) => {
        return citeSession === sessionId ? full : '';
    });
}

export function sanitizePlainAuthor(value: unknown) {
    return normalizePlainText(value, '匿名作者') || '匿名作者';
}

export function sanitizePlainTitle(value: unknown) {
    return normalizePlainText(value);
}

export function sanitizeOptionalEmail(value: unknown) {
    const email = normalizePlainText(value).toLowerCase();
    if (!email) return '';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return '';
    return email;
}
