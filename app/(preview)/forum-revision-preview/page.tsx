import Link from 'next/link';
import { ArrowLeft, BookOpen, FileText, Layers3, ShieldAlert } from 'lucide-react';
import SubpageHeader from '@/components/SubpageHeader';

const serif = { fontFamily: "'Noto Serif TC', serif" };

const ruleTabs = ['規範', '倫理', '運作', '平台在做什麼', '問題'];

const articlePreview = [
    {
        title: '單一場次筆記',
        description: '對應單一庭次的觀庭整理與公開補充說明。',
        tone: 'border-[#EADAC7] bg-[#FFF8F0] text-[#6C5641]',
    },
    {
        title: '跨場次整合',
        description: '整合兩個以上庭次的觀庭內容，形成較完整的論述脈絡。',
        tone: 'border-[#D8E6BF] bg-[#F8FCEB] text-[#4D6630]',
    },
    {
        title: '專題評述',
        description: '不完全依附單一庭次，而是聚焦制度、程序或關鍵爭點。',
        tone: 'border-[#D7DFEB] bg-[#F7FAFE] text-[#536377]',
    },
];

export default function ForumRevisionPreviewPage() {
    return (
        <div className="min-h-screen bg-[#FBF7F0] text-[#2D2A26]">
            <SubpageHeader />

            <section className="border-b border-[#E8E0D4] bg-gradient-to-b from-[#E6F0D8] via-[#F5F8EE] to-[#FBF7F0]">
                <div className="mx-auto max-w-6xl px-6 py-10">
                    <Link href="/" className="mb-5 inline-flex items-center gap-1 text-[15px] font-bold text-[#7B8C4E] hover:underline">
                        <ArrowLeft size={16} />
                        返回首頁
                    </Link>
                    <h1 className="text-[42px] font-black md:text-[56px]" style={serif}>
                        觀庭筆記匯集區
                    </h1>
                    <p className="mt-3 max-w-4xl text-[20px] font-medium leading-[1.8] text-[#6B6358]">
                        這裡收錄經審核後公開的觀庭共構文章，可由單一場次或跨場次工作檯整理而成。
                    </p>
                    <div className="mt-5 flex flex-wrap gap-3">
                        <Link
                            href="/sessions"
                            className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-black text-[#6B8E23] ring-1 ring-[#DDE6C8] transition-all hover:-translate-y-0.5"
                        >
                            <BookOpen size={16} />
                            查看場次
                        </Link>
                        <Link
                            href="/sessions/compose"
                            className="inline-flex items-center gap-2 rounded-full bg-[#6B8E23] px-4 py-2 text-sm font-black text-white transition-all hover:-translate-y-0.5"
                        >
                            <Layers3 size={16} />
                            跨場次工作檯
                        </Link>
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-6xl px-6 py-8">
                <div className="rounded-[2.2rem] border border-[#DDE6C8] bg-white p-6 shadow-sm md:p-8">
                    <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#E3EED3] text-[#3D5220]">
                            <FileText size={24} />
                        </div>
                        <div className="min-w-0 space-y-3">
                            <h2 className="text-[26px] font-black text-[#2D2A26] md:text-[30px]" style={serif}>
                                在進入匯集區前，先理解這裡如何呈現與互動
                            </h2>
                            <p className="text-[17px] font-medium leading-[1.85] text-[#6B6358]">
                                這裡收錄經審核後公開的觀庭共構文章，歡迎閱讀與參考；但在閱讀、補充或準備留言前，
                                也希望先理解這裡不是即時討論區，而是立基於觀庭脈絡、重視事實與來源的公開整理區。
                            </p>
                            <p className="text-[16px] font-medium leading-[1.8] text-[#8A8078]">
                                這個 preview 想示範的是：把匯集區介紹、平台限制與規範、以及這裡的互動原則，整合成同一個前導區，
                                讓讀者在進入文章前先建立正確閱讀預期。
                            </p>
                        </div>
                    </div>

                    <div className="mt-8 rounded-[2rem] border border-[#E8E0D4] bg-[#FFFEFC] p-6">
                        <div className="inline-flex items-center gap-2 rounded-full bg-[#F9FBE7] px-4 py-2 text-[13px] font-black tracking-[0.16em] text-[#6B8E23]">
                            <ShieldAlert size={14} />
                            閱讀前導
                        </div>
                        <h3 className="mt-4 text-[30px] font-black leading-tight text-[#2D2A26]" style={serif}>
                            平台限制與規範
                            <br />
                            在匯集區也應先被看見
                        </h3>
                        <p className="mt-3 max-w-3xl text-[17px] font-medium leading-[1.85] text-[#6B6358]">
                            如果首頁已經有完整版、寬敞版的規範區塊，匯集區這裡就可以放一個更聚焦的版本：
                            先說明這裡是什麼，再提示大家該怎麼閱讀、怎麼補充、以及怎麼維持交流品質。
                        </p>

                        <div className="mt-5 flex flex-wrap gap-2">
                            {ruleTabs.map((tab, index) => (
                                <span
                                    key={tab}
                                    className={`inline-flex items-center rounded-full px-4 py-2 text-[14px] font-black ${
                                        index === 0 ? 'bg-[#7B8C4E] text-white' : 'bg-[#F6F1E7] text-[#6B6358]'
                                    }`}
                                >
                                    {tab}
                                </span>
                            ))}
                        </div>

                        <div className="mt-5 grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
                            <div className="rounded-[1.8rem] border border-[#E8DCC7] bg-[#FFF8EF] p-5">
                                <h4 className="text-[28px] font-black leading-tight text-[#2D2A26]" style={serif}>
                                    不造神・重文字
                                    <br />
                                    匿名化・去權威
                                </h4>
                                <p className="mt-3 text-[16px] font-medium leading-[1.85] text-[#5A5347]">
                                    這一區示範把目前論壇上方的「共構筆記呈現」與「價值原則卡」整合進同一個前導外框。
                                    不是把規範做成硬性阻擋，而是讓讀者在閱讀前自然先看見這裡的基本原則。
                                </p>
                                <div className="mt-5 grid gap-3 md:grid-cols-3">
                                    {[
                                        { title: '嚴格去識別化', desc: '不揭露真實姓名、居住地或非公開案情細節。', tone: 'bg-[#FFF5F5] border-[#F3D8D8] text-[#B65656]' },
                                        { title: '聚焦職務非個人', desc: '聚焦專業判斷與制度，不做情緒化獵巫。', tone: 'bg-[#F5FAEB] border-[#D7E5BB] text-[#5A6F35]' },
                                        { title: '遵守法律基礎', desc: '在可公開可討論的範圍內交流與補充資料。', tone: 'bg-[#F6F8FB] border-[#D9E1EC] text-[#4F5D71]' },
                                    ].map((item) => (
                                        <div key={item.title} className={`rounded-2xl border p-4 ${item.tone}`}>
                                            <p className="text-[18px] font-black" style={serif}>{item.title}</p>
                                            <p className="mt-2 text-[14px] font-bold leading-relaxed">{item.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="rounded-[1.8rem] border border-[#E8E0D4] bg-gradient-to-br from-white via-[#FFFDF8] to-[#F7F3E8] p-5 shadow-[0_12px_32px_rgba(65,56,44,0.08)]">
                                <p className="text-[12px] font-black uppercase tracking-[0.24em] text-[#A4A098]">內容櫥窗</p>
                                <div className="mt-4 rounded-[1.5rem] border border-[#F0D4D1] bg-[#FDF3F2] p-5">
                                    <h4 className="text-[26px] font-black leading-tight text-[#2D2A26]" style={serif}>
                                        平台規範
                                    </h4>
                                    <p className="mt-3 text-[15px] font-medium leading-[1.9] text-[#5A5347]">
                                        這裡示範把首頁那套規範閱讀方式，縮成匯集區專用版本。核心不是要搶文章版面，
                                        而是讓讀者在開始讀文章、準備留言或補充前，先看見這裡的限制與互動原則。
                                    </p>
                                </div>
                                <div className="mt-5 flex items-center justify-center gap-2">
                                    <span className="h-2.5 w-8 rounded-full bg-[#7B8C4E]" />
                                    <span className="h-2.5 w-2.5 rounded-full bg-[#D9D2C4]" />
                                    <span className="h-2.5 w-2.5 rounded-full bg-[#D9D2C4]" />
                                    <span className="h-2.5 w-2.5 rounded-full bg-[#D9D2C4]" />
                                </div>
                                <Link
                                    href="/guide"
                                    className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-[#F6F1E7] px-5 py-3 text-[15px] font-black text-[#6B6358]"
                                >
                                    閱讀完整平台限制與規範
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 rounded-[2rem] border border-[#E8E0D4] bg-white p-6 shadow-sm md:p-8">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <p className="text-[12px] font-black uppercase tracking-[0.24em] text-[#6B8E23]">Article Display Draft</p>
                            <h3 className="mt-2 text-[34px] font-black text-[#2D2A26]" style={serif}>
                                觀庭筆記匯集區的文章陳列草圖
                            </h3>
                            <p className="mt-3 max-w-3xl text-[16px] font-medium leading-[1.85] text-[#6B6358]">
                                下面這裡先不談熱門留言，也不談熱門入口，只示範審核後公開的觀庭文章可以怎麼被分成單場次、跨場次與專題評述。
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 grid gap-4 xl:grid-cols-3">
                        {articlePreview.map((item) => (
                            <div key={item.title} className={`rounded-[1.6rem] border p-5 ${item.tone}`}>
                                <p className="text-[12px] font-black uppercase tracking-[0.18em] opacity-70">Article Type</p>
                                <h4 className="mt-3 text-[24px] font-black text-[#2D2A26]" style={serif}>
                                    {item.title}
                                </h4>
                                <p className="mt-3 text-[15px] font-medium leading-[1.8]">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
