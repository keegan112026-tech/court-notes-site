#!/usr/bin/env node

const args = process.argv.slice(2);
const explicitBase = args.find((arg) => arg.startsWith('--base='));
const baseUrl =
    explicitBase?.slice('--base='.length) ||
    process.env.SMOKE_BASE_URL ||
    'http://localhost:3000';

const checks = [
    {
        path: '/',
        markers: ['觀庭還原筆記', '平台限制與規範', '目前已發布的完整筆記'],
    },
    {
        path: '/about',
        markers: ['計畫緣起', '觀庭還原筆記共構平台'],
    },
    {
        path: '/sessions',
        markers: ['114年度訴字第51號過失致死等案', '目前已發布的完整筆記'],
    },
    {
        path: '/forum',
        markers: ['觀庭筆記匯集區', '遵守法律基礎'],
    },
];

let hasFailure = false;

for (const check of checks) {
    const url = `${baseUrl.replace(/\/$/, '')}${check.path}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            hasFailure = true;
            console.error(`[smoke] FAIL ${check.path} -> ${response.status}`);
            continue;
        }

        const html = await response.text();
        const missingMarkers = check.markers.filter((marker) => !html.includes(marker));

        if (missingMarkers.length > 0) {
            hasFailure = true;
            console.error(`[smoke] FAIL ${check.path} -> missing markers: ${missingMarkers.join(' | ')}`);
            continue;
        }

        console.log(`[smoke] OK   ${check.path}`);
    } catch (error) {
        hasFailure = true;
        const message = error instanceof Error ? error.message : String(error);
        console.error(`[smoke] FAIL ${check.path} -> ${message}`);
    }
}

if (hasFailure) {
    process.exit(1);
}
