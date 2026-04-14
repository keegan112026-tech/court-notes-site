#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import dotenv from 'dotenv';

const args = process.argv.slice(2);

function getArg(name, fallback = undefined) {
    const direct = args.find((item) => item.startsWith(`${name}=`));
    if (direct) return direct.slice(name.length + 1);
    const index = args.indexOf(name);
    if (index >= 0 && index < args.length - 1) return args[index + 1];
    return fallback;
}

function hasFlag(name) {
    return args.includes(name);
}

const envFile = getArg('--env-file');
const label = getArg('--label', envFile ? path.basename(envFile) : 'current-process-env');
const verifyNotion = hasFlag('--verify-notion');
const scope = getArg('--scope', 'all');

if (envFile) {
    if (!fs.existsSync(envFile)) {
        console.error(`❌ 找不到 env 檔案：${envFile}`);
        process.exit(1);
    }

    dotenv.config({ path: envFile, override: true });
}

function nonEmpty(name) {
    const value = process.env[name];
    return typeof value === 'string' && value.trim().length > 0;
}

function push(results, status, title, detail) {
    results.push({ status, title, detail });
}

function isFirebaseConfigured() {
    return nonEmpty('FIREBASE_PROJECT_ID')
        && nonEmpty('FIREBASE_CLIENT_EMAIL')
        && nonEmpty('FIREBASE_PRIVATE_KEY');
}

function getProvider() {
    const explicit = process.env.BACKEND_PROVIDER?.trim();
    if (explicit === 'firebase' || explicit === 'notion') return explicit;
    return isFirebaseConfigured() ? 'firebase' : 'notion';
}

function hasAdminConfig() {
    const token = process.env.ADMIN_REVIEW_TOKEN?.trim();
    if (token) {
        return { ok: true, mode: 'single-token' };
    }

    const json = process.env.ADMIN_REVIEW_ACCOUNTS_JSON?.trim();
    if (!json) {
        return { ok: false, mode: 'missing' };
    }

    try {
        const parsed = JSON.parse(json);
        if (!Array.isArray(parsed)) {
            return { ok: false, mode: 'invalid-json', detail: 'ADMIN_REVIEW_ACCOUNTS_JSON 不是陣列。' };
        }

        const valid = parsed.some((item) => item && typeof item === 'object' && typeof item.token === 'string' && item.token.trim());
        return valid
            ? { ok: true, mode: 'multi-account-json' }
            : { ok: false, mode: 'invalid-json', detail: 'ADMIN_REVIEW_ACCOUNTS_JSON 裡沒有有效 token。' };
    } catch (error) {
        return {
            ok: false,
            mode: 'invalid-json',
            detail: `ADMIN_REVIEW_ACCOUNTS_JSON 不是合法 JSON：${error instanceof Error ? error.message : String(error)}`,
        };
    }
}

function shouldCheck(feature) {
    return scope === 'all' || scope === feature;
}

async function verifyNotionDatabase(token, databaseId) {
    const res = await fetch(`https://api.notion.com/v1/databases/${databaseId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Notion-Version': '2022-06-28',
        },
        cache: 'no-store',
    });

    if (!res.ok) {
        const body = await res.text().catch(() => '');
        throw new Error(`Notion API ${res.status}: ${body}`);
    }

    const payload = await res.json();
    return payload.title?.map?.((item) => item.plain_text).join('') || '(untitled database)';
}

const results = [];
const provider = getProvider();

push(results, 'info', '檢查標的', label);
push(results, 'info', '後端 provider', provider);

if (nonEmpty('BACKEND_PROVIDER')) {
    push(results, 'ok', 'BACKEND_PROVIDER', `已明確設定為 ${process.env.BACKEND_PROVIDER}`);
} else {
    push(results, 'warn', 'BACKEND_PROVIDER', `未明確設定，程式目前會推斷成 ${provider}。建議 production 明確設定。`);
}

const admin = hasAdminConfig();
if (shouldCheck('admin')) {
    if (admin.ok) {
        push(results, 'ok', '後台登入 token', `已設定 (${admin.mode})`);
    } else {
        push(results, 'fail', '後台登入 token', admin.detail || '缺少 ADMIN_REVIEW_TOKEN 或 ADMIN_REVIEW_ACCOUNTS_JSON。');
    }
}

if (provider === 'notion') {
    const tokenOk = nonEmpty('NOTION_TOKEN');
    if (tokenOk) {
        push(results, 'ok', 'NOTION_TOKEN', '已設定');
    } else {
        push(results, 'fail', 'NOTION_TOKEN', '缺少 NOTION_TOKEN。');
    }

    const notionChecks = [
        { feature: 'articles', env: 'NOTION_DB_ARTICLES', title: '文章資料庫', description: '文章投稿 / 匯集區 / 已發布文章' },
        { feature: 'comments', env: 'NOTION_DB_COMMENTS', title: '留言資料庫', description: '公開留言 / 留言審核' },
        { feature: 'inbox', env: 'NOTION_DB_INBOX', title: '收件匣資料庫', description: '聯絡 / 私密傳訊 / 內容更正' },
        { feature: 'admin', env: 'NOTION_DB_MODERATION_LOG', title: '審查紀錄資料庫', description: '後台操作與審核歷程' },
    ];

    for (const item of notionChecks) {
        if (!shouldCheck(item.feature)) continue;
        if (nonEmpty(item.env)) {
            push(results, 'ok', item.title, `${item.env} 已設定（${item.description}）`);
        } else {
            push(results, 'fail', item.title, `缺少 ${item.env}（${item.description}）。`);
        }
    }

    if (verifyNotion && tokenOk) {
        for (const item of notionChecks) {
            if (!shouldCheck(item.feature)) continue;
            const databaseId = process.env[item.env]?.trim();
            if (!databaseId) continue;
            try {
                const databaseTitle = await verifyNotionDatabase(process.env.NOTION_TOKEN.trim(), databaseId);
                push(results, 'ok', `${item.title} 遠端驗證`, `可讀取 Notion DB：${databaseTitle}`);
            } catch (error) {
                push(results, 'fail', `${item.title} 遠端驗證`, error instanceof Error ? error.message : String(error));
            }
        }
    }
} else if (provider === 'firebase') {
    const firebaseChecks = [
        { env: 'FIREBASE_PROJECT_ID', title: 'FIREBASE_PROJECT_ID' },
        { env: 'FIREBASE_CLIENT_EMAIL', title: 'FIREBASE_CLIENT_EMAIL' },
        { env: 'FIREBASE_PRIVATE_KEY', title: 'FIREBASE_PRIVATE_KEY' },
    ];

    for (const item of firebaseChecks) {
        if (nonEmpty(item.env)) {
            push(results, 'ok', item.title, '已設定');
        } else {
            push(results, 'fail', item.title, `缺少 ${item.env}。`);
        }
    }

    if (nonEmpty('FIREBASE_DATABASE_ID')) {
        push(results, 'ok', 'FIREBASE_DATABASE_ID', '已設定');
    } else {
        push(results, 'warn', 'FIREBASE_DATABASE_ID', '未設定。若使用預設 Firestore database 可忽略。');
    }
}

const statusIcon = {
    info: 'ℹ️',
    ok: '✅',
    warn: '⚠️',
    fail: '❌',
};

console.log(`\n=== Env 健康檢查：${label} ===\n`);
for (const row of results) {
    console.log(`${statusIcon[row.status]} ${row.title}`);
    if (row.detail) {
        console.log(`   ${row.detail}`);
    }
}

const failCount = results.filter((item) => item.status === 'fail').length;
const warnCount = results.filter((item) => item.status === 'warn').length;

console.log('\n--- Summary ---');
console.log(`fails: ${failCount}`);
console.log(`warnings: ${warnCount}`);

if (failCount > 0) {
    process.exit(1);
}

