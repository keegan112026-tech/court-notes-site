/**
 * scripts/check-env-prod.mjs
 * 生產環境變數健康檢查
 * 用途：在部署前確認所有必要的 env var 已設定
 * 執行：node ./scripts/check-env-prod.mjs
 * 或：npm run env:check:prod
 */

const VARS = [
    // --- 必要（任何 backend 模式）---
    { key: 'BACKEND_PROVIDER', required: false, desc: 'Backend 模式：notion | firebase | auto（預設 auto）' },
    { key: 'ADMIN_REVIEW_TOKEN', required: false, altGroup: 'admin', desc: '單一 admin token（或用 ADMIN_REVIEW_ACCOUNTS_JSON）' },
    { key: 'ADMIN_REVIEW_ACCOUNTS_JSON', required: false, altGroup: 'admin', desc: '多帳號 JSON admin token（或用 ADMIN_REVIEW_TOKEN）' },
    { key: 'ADMIN_OWNER_NAME', required: false, desc: 'Owner 顯示名稱（使用單一 token 模式時）' },

    // --- Firebase ---
    { key: 'FIREBASE_PROJECT_ID', required: false, group: 'firebase', desc: 'Firebase Project ID' },
    { key: 'FIREBASE_CLIENT_EMAIL', required: false, group: 'firebase', desc: 'Firebase Service Account email' },
    { key: 'FIREBASE_PRIVATE_KEY', required: false, group: 'firebase', desc: 'Firebase Service Account private key' },
    { key: 'FIREBASE_DATABASE_ID', required: false, group: 'firebase', desc: 'Firestore database ID（預設 (default)）' },

    // --- Notion ---
    { key: 'NOTION_TOKEN', required: false, group: 'notion', desc: 'Notion integration secret' },
    { key: 'NOTION_DB_ARTICLES', required: false, group: 'notion', desc: 'Notion 文章 DB ID' },
    { key: 'NOTION_DB_COMMENTS', required: false, group: 'notion', desc: 'Notion 留言 DB ID' },
    { key: 'NOTION_DB_INBOX', required: false, group: 'notion', desc: 'Notion 收件匣 DB ID' },
    { key: 'NOTION_DB_MODERATION_LOG', required: false, group: 'notion', desc: 'Notion 審核記錄 DB ID' },
];

const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const CYAN = '\x1b[36m';
const BOLD = '\x1b[1m';
const RESET = '\x1b[0m';

function ok(msg) { console.log(`  ${GREEN}✓${RESET} ${msg}`); }
function warn(msg) { console.log(`  ${YELLOW}⚠${RESET} ${msg}`); }
function fail(msg) { console.log(`  ${RED}✗${RESET} ${msg}`); }
function info(msg) { console.log(`  ${CYAN}i${RESET} ${msg}`); }

console.log(`\n${BOLD}══════════════════════════════════════════${RESET}`);
console.log(`${BOLD}  生產環境變數健康檢查${RESET}`);
console.log(`${BOLD}══════════════════════════════════════════${RESET}\n`);

const provider = process.env.BACKEND_PROVIDER || 'auto';
const providerSource = process.env.BACKEND_PROVIDER ? '（env var）' : '（預設值）';
info(`BACKEND_PROVIDER = ${CYAN}${provider}${RESET} ${providerSource}`);
console.log('');

let errors = 0;
let warnings = 0;

// 2. Admin token：至少一個存在
console.log(`\n${BOLD}── Admin 認證（至少一個）──${RESET}`);
const hasToken = !!process.env.ADMIN_REVIEW_TOKEN?.trim();
const hasAccountsJson = !!process.env.ADMIN_REVIEW_ACCOUNTS_JSON?.trim();
if (hasToken || hasAccountsJson) {
    if (hasToken) ok('ADMIN_REVIEW_TOKEN ✓');
    if (hasAccountsJson) {
        try {
            const parsed = JSON.parse(process.env.ADMIN_REVIEW_ACCOUNTS_JSON);
            if (Array.isArray(parsed) && parsed.length > 0) {
                ok(`ADMIN_REVIEW_ACCOUNTS_JSON ✓（${parsed.length} 個帳號）`);
                const roles = parsed.map(a => a.role || 'owner');
                const hasOwner = roles.includes('owner');
                if (!hasOwner) {
                    warn('ADMIN_REVIEW_ACCOUNTS_JSON 中沒有 owner 角色帳號，部分功能將無法使用。');
                    warnings++;
                }
            } else {
                warn('ADMIN_REVIEW_ACCOUNTS_JSON 設定了但是陣列為空。');
                warnings++;
            }
        } catch {
            fail('ADMIN_REVIEW_ACCOUNTS_JSON 無法解析為 JSON！');
            errors++;
        }
    }
} else {
    fail('需要設定 ADMIN_REVIEW_TOKEN 或 ADMIN_REVIEW_ACCOUNTS_JSON，否則管理後台無法使用。');
    errors++;
}

// 3. Backend-specific 變數
const needFirebase = provider === 'firebase' || provider === 'auto';
const needNotion = provider === 'notion' || provider === 'auto';

if (needFirebase) {
    console.log(`\n${BOLD}── Firebase（provider=${provider}）──${RESET}`);
    const firebaseVars = VARS.filter(v => v.group === 'firebase');
    const allSet = firebaseVars.every(v => !!process.env[v.key]?.trim());
    const noneSet = firebaseVars.every(v => !process.env[v.key]?.trim());

    if (allSet) {
        firebaseVars.forEach(v => ok(v.key));
    } else if (noneSet) {
        if (provider === 'firebase') {
            firebaseVars.forEach(v => { fail(`${v.key} 缺少！`); errors++; });
        } else {
            firebaseVars.forEach(v => warn(`${v.key} 未設定（auto 模式將改用 Notion）`));
            warnings++;
        }
    } else {
        // 部分設定
        for (const v of firebaseVars) {
            const val = process.env[v.key]?.trim();
            if (val) { ok(v.key); }
            else { warn(`${v.key} 未設定，Firebase 可能無法正常連線`); warnings++; }
        }
    }
}

if (needNotion) {
    console.log(`\n${BOLD}── Notion（provider=${provider}）──${RESET}`);
    const notionVars = VARS.filter(v => v.group === 'notion');
    const allSet = notionVars.every(v => !!process.env[v.key]?.trim());
    const noneSet = notionVars.every(v => !process.env[v.key]?.trim());

    if (allSet) {
        notionVars.forEach(v => ok(v.key));
    } else if (noneSet) {
        if (provider === 'notion') {
            notionVars.forEach(v => { fail(`${v.key} 缺少！`); errors++; });
        } else {
            notionVars.forEach(v => warn(`${v.key} 未設定（auto 模式將改用 Firebase）`));
            warnings++;
        }
    } else {
        for (const v of notionVars) {
            const val = process.env[v.key]?.trim();
            if (val) { ok(v.key); }
            else { warn(`${v.key} 未設定`); warnings++; }
        }
    }
}

// 結果摘要
console.log(`\n${BOLD}══════════════════════════════════════════${RESET}`);
if (errors === 0 && warnings === 0) {
    console.log(`${GREEN}${BOLD}✓ 所有環境變數設定正確，可以部署。${RESET}`);
} else if (errors === 0) {
    console.log(`${YELLOW}${BOLD}⚠ 通過（有 ${warnings} 個警告），請確認 warning 是否可接受。${RESET}`);
} else {
    console.log(`${RED}${BOLD}✗ 發現 ${errors} 個錯誤，${warnings} 個警告，請修正後再部署。${RESET}`);
}
console.log(`${BOLD}══════════════════════════════════════════${RESET}\n`);

process.exit(errors > 0 ? 1 : 0);
