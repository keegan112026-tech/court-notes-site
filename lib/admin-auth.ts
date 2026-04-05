export const ADMIN_SESSION_COOKIE = 'court_admin_session';

export type AdminRole = 'owner' | 'reviewer';

export type AdminAccount = {
    name: string;
    token: string;
    role: AdminRole;
};

function normalizeRole(value: unknown): AdminRole {
    return value === 'reviewer' ? 'reviewer' : 'owner';
}

export function getAdminAccounts(): AdminAccount[] {
    const fromJson = process.env.ADMIN_REVIEW_ACCOUNTS_JSON;
    if (fromJson) {
        try {
            const parsed = JSON.parse(fromJson);
            if (Array.isArray(parsed)) {
                const accounts = parsed
                    .filter((item) => item && typeof item === 'object')
                    .map((item) => {
                        const row = item as Record<string, unknown>;
                        return {
                            name: typeof row.name === 'string' && row.name.trim() ? row.name.trim() : 'Admin',
                            token: typeof row.token === 'string' ? row.token.trim() : '',
                            role: normalizeRole(row.role),
                        };
                    })
                    .filter((item) => item.token);

                if (accounts.length > 0) return accounts;
            }
        } catch {
            // ignore invalid JSON and fall back to single-token mode
        }
    }

    const token = process.env.ADMIN_REVIEW_TOKEN || '';
    if (!token) return [];

    return [
        {
            name: process.env.ADMIN_OWNER_NAME?.trim() || 'Site Owner',
            token,
            role: 'owner',
        },
    ];
}

export function isAdminTokenConfigured() {
    return getAdminAccounts().length > 0;
}

export function getAdminAccountByToken(token: string | undefined) {
    if (!token) return null;
    return getAdminAccounts().find((account) => account.token === token) || null;
}

export function isValidAdminSession(sessionValue: string | undefined) {
    return Boolean(getAdminAccountByToken(sessionValue));
}
