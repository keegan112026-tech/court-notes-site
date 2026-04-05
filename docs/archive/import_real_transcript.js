const { Client } = require('@notionhq/client');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env.local') });

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const DB_SESSIONS = process.env.NOTION_DB_SESSIONS;
const DB_TRANSCRIPTS = process.env.NOTION_DB_TRANSCRIPTS;

function parseCSVRow(text) {
    let result = [];
    let cur = '';
    let inQuotes = false;
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            result.push(cur.replace(/^"|"$/g, '').trim());
            cur = '';
        } else {
            cur += char;
        }
    }
    result.push(cur.replace(/^"|"$/g, '').trim());
    return result;
}

async function main() {
    console.log('--- 準備匯入真實逐字稿 (CommonJS) ---');
    try {
        const csvPath = path.join('C:', 'Users', 'User', 'OneDrive', 'Desktop', '社工共構觀庭筆記平台', 'transcript_data.csv');
        const fileContent = fs.readFileSync(csvPath, 'utf-8');

        const lines = fileContent.split('\n').filter(l => l.trim() !== '');
        const transcriptItems = [];
        let pIndex = 1;
        let stageIndex = 0;

        for (let j = 1; j < lines.length; j++) {
            const cols = parseCSVRow(lines[j]);
            const text = cols[0];
            if (!text) continue;

            const cleanText = text.trim();
            if (!cleanText) continue;

            let role = 'stage';
            let content = cleanText;
            let action = '';

            if (/^[一二三四五六七八九十]+\s*、/.test(cleanText) || cleanText.includes('[法庭筆錄整理]')) {
                transcriptItems.push({
                    type: 'stage',
                    id: `stage_${stageIndex++}`,
                    text: cleanText
                });
                continue;
            }

            const match = cleanText.match(/^\[(.*?)\]\s*(?:（(.*?)）)?\s*(.*)$/);

            if (match) {
                role = match[1].trim();
                action = match[2] ? match[2].trim() : '';
                content = match[3].trim();

                transcriptItems.push({
                    type: 'dialogue',
                    id: `p${pIndex++}`,
                    role: role,
                    action: action,
                    text: content
                });
            } else {
                if (transcriptItems.length > 0 && transcriptItems[transcriptItems.length - 1].type === 'dialogue') {
                    transcriptItems.push({
                        type: 'dialogue',
                        id: `p${pIndex++}`,
                        role: transcriptItems[transcriptItems.length - 1].role,
                        action: '',
                        text: cleanText
                    });
                } else {
                    transcriptItems.push({
                        type: 'stage',
                        id: `stage_${stageIndex++}`,
                        text: cleanText
                    });
                }
            }
        }

        console.log(`✅ 解析完成：共 ${transcriptItems.length} 筆資料 (包含 ${pIndex - 1} 筆對話, ${stageIndex} 筆階段).`);

        console.log('📌 1. 建立「第六場次」Session 紀錄...');
        const sessionRes = await notion.pages.create({
            parent: { database_id: DB_SESSIONS },
            properties: {
                Session_ID: { title: [{ text: { content: "s-114-1-6" } }] },
                Title: { rich_text: [{ text: { content: "114年度訴字第51號 過失致死等案 (一審審理庭第六場次)" } }] },
                Category: { select: { name: "刑事" } },
                Status: { select: { name: "已發布" } },
                Summary: { rich_text: [{ text: { content: "檢察官論告與辯護律師簡報與陳述還原" } }] },
                Date: { date: { start: "2026-02-26" } },
                Hot_Topic: { checkbox: true },
                Participants_Count: { number: 4 }
            }
        });
        const sessionId = sessionRes.id;
        console.log(`✅ Session 建立成功！ID: ${sessionId}`);

        console.log('📌 2. 開始逐筆寫入 Transcripts...');
        for (let i = 0; i < transcriptItems.length; i++) {
            const item = transcriptItems[i];

            const isStage = item.type === 'stage';
            const speaker = isStage ? '系統/旁白' : item.role;
            let content = item.text;
            if (item.action) {
                content = `(${item.action}) ${content}`;
            }
            const seq = i + 1;
            const lineId = item.id;

            let matchedRole = null;
            if (speaker.includes('法官')) matchedRole = '法官';
            else if (speaker.includes('檢察官')) matchedRole = '檢察官';
            else if (speaker.includes('社工')) matchedRole = '社工';
            else if (speaker.includes('辯護') || speaker.includes('律師')) matchedRole = '辯護人';

            const fullContent = `[${speaker}] ${content}`;

            const props = {
                Line_ID: { title: [{ text: { content: lineId } }] },
                Session_ID: { relation: [{ id: sessionId }] },
                Content: { rich_text: [{ text: { content: fullContent.substring(0, 2000) } }] },
                Order: { number: seq },
                Like_Count: { number: 0 }
            };

            if (matchedRole) {
                props.Role = { select: { name: matchedRole } };
            }

            try {
                await notion.pages.create({
                    parent: { database_id: DB_TRANSCRIPTS },
                    properties: props
                });
                if ((i + 1) % 10 === 0) {
                    process.stdout.write(`\r... 已寫入 ${i + 1} / ${transcriptItems.length} 筆`);
                }
            } catch (err) {
                console.error(`\n❌ 第 ${i + 1} 筆寫入失敗:`, err.message);
                if (err.message.includes('RateLimited') || err.message.includes('HTTP response')) {
                    console.log('觸發限流，暫停 3 秒...');
                    await new Promise(r => setTimeout(r, 3000));
                    i--;
                }
            }
            await new Promise(r => setTimeout(r, 350));
        }

        console.log(`\n🎉 真實逐字稿資料匯入成功！`);

    } catch (err) {
        console.error('執行失敗：', err);
    }
}

main();
