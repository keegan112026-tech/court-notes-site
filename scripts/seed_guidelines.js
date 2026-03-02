const fs = require('fs');
const path = require('path');

const envText = fs.readFileSync('C:\\\\Users\\\\User\\\\OneDrive\\\\Desktop\\\\社工觀庭筆記共構平台_整合版\\\\frontend\\\\.env.local', 'utf8');
const env = {};
envText.split('\n').forEach(line => {
    const [k, v] = line.split('=');
    if (k && v) env[k.trim()] = v.trim();
});

const NOTION_TOKEN = env.NOTION_TOKEN;
const DB_INTERACTIONS = env.NOTION_DB_INTERACTIONS;
const hdrs = {
    'Authorization': `Bearer ${NOTION_TOKEN}`,
    'Content-Type': 'application/json',
    'Notion-Version': '2022-06-28',
};

async function mkPage(props) {
    const body = { parent: { database_id: DB_INTERACTIONS }, properties: props };
    const r = await fetch('https://api.notion.com/v1/pages', {
        method: 'POST',
        headers: hdrs,
        body: JSON.stringify(body)
    });
    const res = await r.json();
    if (res.object === 'error') {
        console.error("Error creating post in Notion:", res.message, JSON.stringify(body, null, 2));
    } else {
        console.log("Successfully created post:", res.id);
    }
}

async function run() {
    const post1Content = `【投稿須知】
【投稿形式與授權】
1. 身份與形式：開放社工相關專業人員投稿。作者可自由選擇「實名」或「匿名」發表。
2. 授權聲明： 投稿即視為授權本平台進行排版、編輯與公開發布。若內容涉及高度敏感或需進一步查證之實務細節，平台保有查證或暫緩發布之權利。

【徵稿範疇與目的】
本計畫旨在匯集專業社工透過旁聽審判，針對法庭中呈現之「社工實務」進行評述，以建構專業論述向大眾普及：

社工實務內涵與服務程序、權限定義：
針對法庭上檢辯雙方對於「個案訪視」、「紀錄撰寫」、「風險評估」等提及社工服務流程的提問與攻防，提出專業觀點的評析（例如：社工的裁量權？主責社工實際如何工作？協助釐清實務狀況。）。

專業術語與情境轉譯：
針對法庭中出現的社工專業語言（如：處遇計畫、資源連結）與民眾常識、法律語言的落差，提供轉譯或補充說明，協助大眾理解社工實務在法律視角下的解讀差異。

經驗分享、反思與實務經驗分享：
結合自身實務經驗，針對本案法庭中的系統性或個別處遇內容，提出自身經驗分享、反思或未來實務操作的修正建議。

【法律底線與倫理規範】
為確保評論聚焦於專業探討並保護相關當事人，請務必嚴守以下界線：
1. 嚴格去識別化：
投稿內容若提及的具體個案資料，務必進行去識別化處理。請勿揭露案主及其家屬之真實姓名、詳細居住地或其他可連結至特定人之隱私資訊，亦不得提及非公開之案情細節。亦不可直指單位或個人，揭露他人隱私。
2. 聚焦「職務」而非「個人」：
評論應針對「專業判斷」、「處遇邏輯」及「機構制度」進行討論。嚴禁針對涉案社工、司法人員或當事人進行非理性之辱罵、人身攻擊或臆測性指控。我們的目標是檢討機制與專業標準，而非公審個人。
3. 遵守法庭旁聽規則與善良風俗：
內容不得包含違反法律之資訊，亦不得發表任何煽動仇恨、歧視或違反公共秩序與善良風俗之言論。

【免責聲明】
投稿內容僅代表作者個人之專業見解，不代表本平台立場。作者應確保其言論基於客觀事實與專業學理，並對其言論之適法性自負法律責任。

【平台承諾與限制】
一、全面透明，真實呈現
本資料庫秉持開放透明原則，所有投稿內容均會保留並公開，絕不無故刪除或隱藏。(但不影響匿名)
註： 即便涉及非理性謾罵或威脅之言論，我們仍會如實陳列在資料庫以示透明，但團隊將不提供該類內容的後續排版、連結串接等服務。

二、知識串聯
您的投稿將由團隊協助排版（修正表單格式跑版問題），並協助將內容與相關文章、關鍵字進行系統性串聯，讓知識產生對話。亦歡迎夾帶附件與佐證資料。(主要是因為問卷匿名投稿等因素，排版可能會跑掉、需要重整。我們會協助彙整成文章論述)

三、彈性具名，勘誤機制
我們尊重您的意願，提供「實名」與「匿名」兩種投稿選擇。若發現內容有錯漏或排版未臻完美，歡迎隨時再次投稿告知，我們將儘速修正並完整記錄修改歷程。

【關於我們】
本團隊成員皆為現職社工、心理、輔導等實務工作者，利用公餘時間維護平台。若更新與除錯進度較緩，尚請海涵見諒。`;

    const post2Content = `【留言注意事項與平台規範】
感謝您參與本平台的討論。為了確保專業論述的品質，並守護每一位實務工作者的法律安全，請在留言前詳閱以下規範：

【留言原則：專業、理性、守法】
嚴格去識別化（最重要）：
留言內容嚴禁揭露案主、家屬、社工或相關人員之真實姓名、詳細地址或任何足以辨識身分之資訊。即便是在法庭上聽到的細節，若涉及隱私且尚未公開，請務必進行模糊化處理。

聚焦專業，拒絕公審：
我們鼓勵針對「專業判斷」、「處遇邏輯」或「系統制度」進行深入討論。請避免針對特定個人（如：承辦社工、法官、檢察官）進行人身攻擊、非理性謾罵或臆測性的道德指控。

自負言責：
留言內容僅代表網友個人見解，不代表本平台立場。留言者應確保資訊之真實性，並對其言論負起法律責任。

【關於審核制的初衷與掙扎】
「原本，我們想追求絕對的透明。」
最初，我們希望建立一個完全不刪減、真實呈現所有聲音的資料庫。然而，在社群前輩的提醒與法律評估下，我們意識到：若留言中夾雜了違法洩露的個資，或具攻擊性的言論，在未經審核的情況下直接公開，不僅會對當事人造成二次傷害，也可能讓平台與留言者陷入司法糾紛。
因此，在找到更完美的配套方案前，我們目前採取「先審後發」機制：
審核標準： 僅針對「個案隱私外洩」、「人身攻擊」及「明顯違反法律規範」之內容進行攔截。

【平台的承諾與服務】
知識串聯： 您的留言若具備專業參考價值，團隊將協助進行標籤化與知識串聯。
匿名權利： 我們充分尊重實務界的需求，您可以自由選擇以「實名」或「匿名」方式參與討論。
彈性修正： 若您發現留言內容有誤或排版問題，歡迎隨時聯繫我們。

【關於我們】
本平台由一群現職社工、心理、輔導等實務工作者利用公餘時間維護。我們並非專業法律或資安團隊，若審核與回覆速度較慢，或在專業與透明間的拿捏未臻完美，懇請各位同儕海涵並給予建議。`;

    const post1 = {
        Comment_ID: {
            title: [{
                text: { content: `f-${Date.now()}-1` }
            }]
        },
        Type: { select: { name: '論壇文章' } },
        Author: { rich_text: [{ text: { content: '平台管理團隊' } }] },
        Title: { rich_text: [{ text: { content: '【投稿須知與平台承諾】' } }] },
        Content: { rich_text: [{ text: { content: post1Content.substring(0, 2000) } }] },
        Category: { select: { name: '系統發布' } }, // Actually, our Notion DB requires select values to exist or we use "專業討論" as it is pre-existing.
        Target_Topic: { select: { name: '其他' } },
        Status: { select: { name: '核准' } },
    };
    post1.Category.select.name = '專業討論';

    const post2 = {
        Comment_ID: { title: [{ text: { content: `f-${Date.now()}-2` } }] },
        Type: { select: { name: '論壇文章' } },
        Author: { rich_text: [{ text: { content: '平台管理團隊' } }] },
        Title: { rich_text: [{ text: { content: '【留言注意事項與平台規範】' } }] },
        Content: { rich_text: [{ text: { content: post2Content.substring(0, 2000) } }] },
        Category: { select: { name: '專業討論' } },
        Target_Topic: { select: { name: '其他' } },
        Status: { select: { name: '核准' } },
    };

    await mkPage(post1);
    await mkPage(post2);
}

run();
