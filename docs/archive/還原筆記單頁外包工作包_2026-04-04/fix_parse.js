const fs = require('fs');

// Input and Output Files
const inputFile = '2025-12-11法庭筆錄整理-還原筆記原稿.txt';
const outputFile = '114-51-1211_session_data.json';

try {
    console.log('Reading original Big5 file...');
    const buffer = fs.readFileSync(inputFile);
    
    // Using TextDecoder to correctly handle Big5 (CP950)
    // Note: In older Node version, one might need iconv-lite, 
    // but Node 24 (current) and recent 18+ have enough TextDecoder support.
    const decoder = new TextDecoder('big5');
    const content = decoder.decode(buffer);
    
    const lines = content.split(/\r?\n/);
    console.log(`Decoding successful. Total lines: ${lines.length}`);

    const sessionData = {
        metadata: {
            id: "s-114-51-1211",
            title: "114年度訴字第51號過失致死等案（審理程序）",
            date: "2025-12-11",
            summary: "本次程序包含三位證人詰問：黃聖心（急診醫師）、李芳玲（兒盟資深主任）及江怡韻（社工督導）。重點在於釐清兒虐辨識、社工監管責任以及社福網絡分工機制。",
            status: "待複核",
            source: "local-json",
            tags: ["過失致死", "證人詰問", "兒盟社工案", "兒虐辨識"]
        },
        transcripts: []
    };

    let pid = 1;
    let lastItem = null;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        // Skip metadata lines at the beginning (roughly first 12 lines)
        if (i < 12 && (line.includes('[法庭筆錄整理]') || line.startsWith('時間：') || line.startsWith('地點：') || line.startsWith('案由：') || line.startsWith('在場人員：') || line.startsWith('* '))) {
            continue;
        }

        // Stage Markers (e.g., 一、 審理前準備)
        const stageMatch = line.match(/^([一二三四五六七八九十]+、\s*(.*))$/);
        if (stageMatch) {
            const stageItem = {
                id: `p${pid++}`,
                type: "stage",
                content: stageMatch[1]
            };
            sessionData.transcripts.push(stageItem);
            lastItem = null;
            continue;
        }

        // Dialogue Markers (e.g., [審判長] ... or [被告 陳尚潔] ...)
        const dialogueMatch = line.match(/^\[(.*?)\]\s*(.*)$/);
        if (dialogueMatch) {
            const rawRole = dialogueMatch[1];
            let role = rawRole;
            let action = "";
            let contentText = dialogueMatch[2];

            // Normalize roles
            if (role.includes('審判長') || role.includes('法官')) role = '審判長';
            else if (role.includes('檢察官')) role = '檢察官';
            else if (role.includes('被告')) role = '被告';
            else if (role.includes('證人')) role = '證人';
            else if (role.includes('律師') || role.includes('告訴代理人')) role = '辯護人';

            // Extract action in parentheses at the start of content
            const actionMatch = contentText.match(/^\((.*?)\)\s*(.*)$/);
            if (actionMatch) {
                action = actionMatch[1];
                contentText = actionMatch[2];
            }

            const dialogueItem = {
                id: `p${pid++}`,
                type: "dialogue",
                role: role,
                action: action,
                content: contentText
            };
            sessionData.transcripts.push(dialogueItem);
            lastItem = dialogueItem;
            continue;
        }

        // Continuation for previous dialogue item
        if (lastItem && lastItem.type === "dialogue") {
            lastItem.content += "\n" + line;
        } else {
            // Fallback for lines like (一)檢察官詰問
            const altStageMatch = line.match(/^\((.*?)\)(.*)$/);
            if (altStageMatch) {
                sessionData.transcripts.push({
                    id: `p${pid++}`,
                    type: "stage",
                    content: line
                });
            } else {
                sessionData.transcripts.push({
                    id: `p${pid++}`,
                    type: "dialogue",
                    role: "系統/旁白",
                    content: line
                });
            }
        }
    }

    // Final JSON Syntax Validation
    console.log('Validating JSON consistency...');
    const resultJson = JSON.stringify(sessionData, null, 4);
    
    // SELF-TEST: JSON.parse()
    JSON.parse(resultJson);
    console.log('JSON Syntax Validation: [PASS]');

    // ID Continuity Check
    for(let j=0; j < sessionData.transcripts.length; j++) {
        const expectedId = `p${j+1}`;
        if(sessionData.transcripts[j].id !== expectedId) {
            throw new Error(`ID Mismatch at index ${j}. Expected ${expectedId}, found ${sessionData.transcripts[j].id}`);
        }
    }
    console.log('ID Continuity Validation: [PASS]');

    // Writing file
    fs.writeFileSync(outputFile, resultJson, 'utf8');
    console.log(`Successfully generated ${outputFile} with ${sessionData.transcripts.length} items.`);

} catch (error) {
    console.error('CRITICAL ERROR in parsing process:');
    console.error(error.message);
    process.exit(1);
}
