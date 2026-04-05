import Link from 'next/link';
import { ArrowRight, BookOpen, ChevronLeft, ChevronRight, FileText, Gavel, Send, ShieldAlert } from 'lucide-react';

const serif = { fontFamily: "'Noto Serif TC', serif" };

const noticeTabs = ['限制', '規範', '維護', '提醒'];

const mockTimeline = [
    {
        date: '11 月 27 日',
        title: '第 1 次開庭',
        topic: '收出養政策與地方政府交接責任',
        witnesses: ['徐佩華（衛福部社家署）', '施盈如（新北社會局）', '丁麗淇（天主教福利會）'],
    },
    {
        date: '12 月 11 日',
        title: '第 2 次開庭',
        topic: '醫療端初步判定與兒盟核心督導責任',
        witnesses: ['黃聖心（萬芳醫院）', '李芳玲（兒盟）', '江怡韻（兒盟督導）'],
    },
];

export default function HomepageRevisionPreviewPage() {
    return (
        <div className="min-h-screen bg-[#FBF7F0] text-[#2D2A26]">
            <section className="border-b border-[#E8E0D4] bg-gradient-to-b from-[#F6F0E6] via-[#FBF7F0] to-[#FBF7F0] px-6 py-10">
                <div className="mx-auto grid max-w-7xl gap-8 xl:grid-cols-[1.15fr_0.85fr]">
                    <div className="min-w-0">
                        <div className="inline-flex items-center gap-2 rounded-full border border-[#DDE6C8] bg-[#F9FBE7] px-5 py-2 text-[14px] font-black tracking-[0.14em] text-[#6B8E23]">
                            <Gavel size={15} />
                            專業人員與大眾的事件論述共構
                        </div>
                        <h1 className="mt-6 text-[54px] font-black leading-[1.02] tracking-tight md:text-[72px]" style={serif}>
                            <span className="block">觀庭還原筆記</span>
                            <span className="block text-[#7B8C4E]">共構平台</span>
                        </h1>
                        <p className="mt-5 max-w-3xl text-[22px] font-medium leading-[1.9] text-[#5A5347]">
                            這不只是一份開庭紀錄，而是一場化血淚為滋養的集體療癒與重建。
                        </p>
                        <p className="mt-4 text-[18px] font-black text-[#7B8C4E]">
                            不造神・重文字・匿名化・去權威
                        </p>

                        <div className="mt-8 flex flex-wrap gap-4">
                            <Link
                                href="/sessions"
                                className="inline-flex items-center gap-3 rounded-2xl bg-[#7B8C4E] px-9 py-4 text-[21px] font-black text-white shadow-[0_14px_36px_rgba(123,140,78,0.22)] transition-transform hover:scale-[1.01]"
                            >
                                點我看現場還原！
                                <ArrowRight size={20} />
                            </Link>
                            <Link
                                href="/about"
                                className="inline-flex items-center rounded-2xl border-2 border-[#D4CCC0] px-8 py-4 text-[20px] font-bold text-[#6B6358] transition-colors hover:border-[#7B8C4E] hover:text-[#7B8C4E]"
                            >
                                計畫緣起 →
                            </Link>
                        </div>
                    </div>

                    <div className="min-w-0">
                        <div className="rounded-[2rem] border border-[#E8E0D4] bg-white/95 p-6 shadow-[0_16px_42px_rgba(65,56,44,0.08)]">
                            <div className="inline-flex items-center gap-2 rounded-full bg-[#F9FBE7] px-4 py-2 text-[13px] font-black tracking-[0.16em] text-[#6B8E23]">
                                <ShieldAlert size={14} />
                                首頁右側示範
                            </div>
                            <h2 className="mt-4 text-[30px] font-black leading-tight" style={serif}>
                                縮編版附件六
                                <br />
                                放在首頁右側的樣子
                            </h2>
                            <p className="mt-3 text-[15px] font-medium leading-[1.85] text-[#6B6358]">
                                這裡不再塞長文，而是保留一張已發布完整筆記 preview、一個跨場次工作檯入口，外加小型切換指示。目的是補足右側視覺重量，但不把 Hero 撐壞。
                            </p>

                            <div className="mt-5 flex flex-wrap gap-2">
                                {noticeTabs.map((tab, index) => (
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

                            <div className="mt-5 overflow-hidden rounded-[1.75rem] border border-[#F1DDC0] bg-gradient-to-br from-[#FFF9F3] via-white to-[#F9FBE7] p-5">
                                <div className="mb-3 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="rounded-full bg-orange-500 px-3 py-1 text-xs font-black text-white">第 2 筆</span>
                                        <span className="rounded-full bg-orange-100 px-3 py-1 text-sm font-black text-orange-700">2025-12-11</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <button className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-orange-100 bg-white text-orange-600">
                                            <ChevronLeft size={18} />
                                        </button>
                                        <button className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-orange-100 bg-white text-orange-600">
                                            <ChevronRight size={18} />
                                        </button>
                                    </div>
                                </div>
                                <h3 className="text-[22px] font-black leading-tight text-[#2D2A26]" style={serif}>
                                    目前已發布的完整筆記
                                </h3>
                                <p className="mt-3 text-[15px] font-bold leading-[1.8] text-[#5A5347]">
                                    114年度訴字第51號過失致死等案（審理程序第二次開庭）
                                </p>
                                <div className="mt-4 rounded-2xl border border-orange-100 bg-[#FFF9F2] p-4 text-sm font-bold leading-relaxed text-[#8A6235]">
                                    可先閱讀已完成場次筆記，再銜接進入跨場次工作檯。首頁右側只呈現最重要的兩個入口，不在這裡塞完整說明。
                                </div>
                                <div className="mt-5 flex items-center justify-between gap-4">
                                    <span className="text-sm font-black text-[#6B8E23]">點擊開啟工作檯 →</span>
                                    <div className="flex items-center gap-2">
                                        <span className="h-2.5 w-8 rounded-full bg-orange-500" />
                                        <span className="h-2.5 w-2.5 rounded-full bg-orange-200" />
                                        <span className="h-2.5 w-2.5 rounded-full bg-orange-200" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-7xl space-y-8 px-6 py-12">
                <div className="overflow-hidden rounded-[2.25rem] border border-[#F1DDC0] bg-gradient-to-r from-[#FFF6EC] via-white to-[#F9FBE7] shadow-sm">
                    <div className="p-7 md:p-8">
                        <div className="grid gap-8 xl:grid-cols-[1.05fr_0.95fr]">
                            <div>
                                <h2 className="text-[46px] font-black leading-tight text-gray-900 md:text-[58px]" style={serif}>
                                    114年度訴字第51號過失致死等案
                                    <br />
                                    <span className="text-[#6B8E23]">俗稱剴剴社工案</span>
                                </h2>
                                <p className="mt-4 max-w-4xl text-[17px] font-medium leading-[1.9] text-[#5A5347]">
                                    依據目前（截至 2026 年 3 月底）彙整附件可確認的審理進度，兒福聯盟陳姓社工在「剴剴案」中被控過失致死與偽造文書罪，台北地院已完成審理，累計庭期與具體日期整理如下：
                                </p>
                                <p className="mt-3 inline-block bg-[#F9FBE7] px-2 py-1 text-[17px] font-bold leading-relaxed text-gray-900">
                                    陳姓社工於一審期間目前可確認審理程序庭（共 7 次），另已公告將於 2026 年 4 月 16 日宣判。
                                </p>
                            </div>

                            <div className="rounded-[2rem] border border-[#E8E0D4] bg-white/95 p-6 shadow-[0_16px_42px_rgba(65,56,44,0.08)]">
                                <div className="inline-flex items-center gap-2 rounded-full bg-[#F9FBE7] px-4 py-2 text-[13px] font-black tracking-[0.16em] text-[#6B8E23]">
                                    <ShieldAlert size={14} />
                                    本站須知
                                </div>
                                <h3 className="mt-4 text-[28px] font-black leading-tight text-[#2D2A26]" style={serif}>
                                    平台限制與規範
                                </h3>
                                <p className="mt-3 text-[15px] font-medium leading-[1.85] text-[#6B6358]">
                                    這裡就放你原本想放在首頁右側，但需要更多寬度的櫥窗型內容。也就是把附件三放到附件二的位置，讓它能有足夠空間閱讀。
                                </p>
                                <div className="mt-5 flex flex-wrap gap-2">
                                    {['限制', '規範', '維護', '提醒'].map((tab, index) => (
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
                                <div className="mt-5 rounded-[1.75rem] border border-[#E8E0D4] bg-gradient-to-br from-white via-[#FFFDF8] to-[#F7F3E8] p-5 shadow-[0_12px_32px_rgba(65,56,44,0.08)]">
                                    <p className="text-[12px] font-black uppercase tracking-[0.24em] text-[#A4A098]">內容櫥窗</p>
                                    <div className="mt-4 rounded-[1.5rem] border border-[#F0D4D1] bg-[#FDF3F2] p-5">
                                        <h4 className="text-[26px] font-black leading-tight text-[#2D2A26]" style={serif}>
                                            重要與限制的開場位置示範
                                        </h4>
                                        <p className="mt-3 text-[15px] font-medium leading-[1.9] text-[#5A5347]">
                                            這裡示範的是：先收攏「重要」與「計畫限制」的語氣，然後再往下銜接審理程序庭與完整筆記區塊。也就是附件四的文案接到附件五，而不是把兩者硬壓成同一張卡。
                                        </p>
                                    </div>
                                    <div className="mt-5 flex items-center justify-center gap-2">
                                        <span className="h-2.5 w-8 rounded-full bg-[#7B8C4E]" />
                                        <span className="h-2.5 w-2.5 rounded-full bg-[#D9D2C4]" />
                                        <span className="h-2.5 w-2.5 rounded-full bg-[#D9D2C4]" />
                                        <span className="h-2.5 w-2.5 rounded-full bg-[#D9D2C4]" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="rounded-[2rem] border border-gray-100 bg-white p-8 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-gray-200 bg-gray-50 text-gray-400">
                                <BookOpen size={24} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-gray-900" style={serif}>
                                    2024 年至 2025 年：準備程序庭（共 4 次）
                                </h3>
                                <p className="mt-1 font-medium text-gray-500">此階段主要進行證據能力確認與不認罪答辯：</p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className="mb-8 flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#E9EDDA] bg-[#F9FBE7] text-[#6B8E23]">
                                <Gavel size={24} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-gray-900" style={serif}>
                                    2025 年末至 2026 年：審理程序庭（共 7 次）
                                </h3>
                                <p className="mt-1 font-medium text-gray-500">此階段進入實質審理，包括證人詰問與言詞辯論：</p>
                            </div>
                        </div>

                        <div className="relative space-y-4 before:absolute before:inset-y-0 before:left-6 before:w-0.5 before:bg-[#E9EDDA]">
                            {mockTimeline.map((hearing, index) => (
                                <div key={hearing.date} className="relative flex items-center gap-6">
                                    <div className={`z-10 h-3 w-3 shrink-0 rounded-full border-2 border-white ${index === 1 ? 'bg-[#6B8E23] ring-4 ring-[#F9FBE7]' : 'bg-gray-300'}`} />
                                    <div className="flex-1 rounded-[2rem] border-2 border-[#E9EDDA] bg-white p-6 shadow-sm">
                                        <div className="mb-3 flex flex-wrap items-center gap-3">
                                            <span className="rounded-full bg-[#F9FBE7] px-3 py-1 text-sm font-black text-[#6B8E23]">{hearing.date}</span>
                                            {index === 1 && (
                                                <span className="ml-auto text-sm font-bold text-gray-500">點擊進入完整筆記</span>
                                            )}
                                        </div>
                                        <h4 className="text-[20px] font-black text-gray-900 md:text-[22px]" style={serif}>
                                            {hearing.title}
                                        </h4>
                                        <p className="mt-1 text-[16px] font-bold text-[#6B8E23]">{hearing.topic}</p>
                                        <div className="mt-4 rounded-xl border border-gray-100 bg-gray-50 p-3">
                                            <p className="mb-2 text-[13px] font-bold text-gray-500">傳喚證人：</p>
                                            <div className="flex flex-wrap gap-2">
                                                {hearing.witnesses.map((witness) => (
                                                    <span key={witness} className="rounded-xl border border-[#E5D9C8] bg-[#F8F1E6] px-3 py-2 text-[13px] font-black text-[#6C5641]">
                                                        {witness}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="rounded-[2rem] border border-orange-100 bg-white p-8 shadow-sm">
                    <div className="space-y-6">
                        <div>
                            <p className="text-[12px] font-black uppercase tracking-[0.24em] text-[#C67B5C]">Guide Opening Mock</p>
                            <h2 className="mt-2 text-[34px] font-black text-[#2D2A26]" style={serif}>
                                平台限制與規範
                            </h2>
                        </div>

                        <div className="rounded-[1.8rem] border border-[#E8DCC7] bg-[#FFF8EF] p-6">
                            <h3 className="text-[24px] font-black text-[#2D2A26]" style={serif}>
                                重要
                            </h3>
                            <div className="mt-4 space-y-4 text-[17px] font-medium leading-[1.95] text-[#5A5347]">
                                <p>
                                    本計畫旨在提供相對還原、具現場脈絡的還原筆記，並佐以相關法庭知能、案情資訊彙整，降低取得資料與學習先備知識之門檻，使大眾均能從具備法庭現場詰問交互脈絡、可核對證人間陳述異同的材料出發。
                                </p>
                                <p>
                                    我們也希望幫助檢閱陳述的一致性，避免由個人認知偏誤所導致之斷章取義、避重就輕與立場詮釋。
                                </p>
                                <p>
                                    剴剴案屬於公眾與社會工作群體的重大事件，對社會集體均造成影響，我們希望透過立基於事實的對話與交流，來尋找共識與解方。
                                </p>
                            </div>
                        </div>

                        <div className="rounded-[1.8rem] border border-[#E8DCC7] bg-white p-6">
                            <h3 className="text-[24px] font-black text-[#2D2A26]" style={serif}>
                                計畫限制
                            </h3>
                            <div className="mt-4 space-y-4 text-[17px] font-medium leading-[1.95] text-[#5A5347]">
                                <p>
                                    本網站還原筆記由本團隊觀庭手記，並蒐集各社群民眾、社工網路夥伴公開之類文字稿，亦有夥伴進行文件提供，本團隊歷時多月進行核對與拼湊，盡力還原開庭詰問與論告等對話語順、情境、前後文，竭力提供相對還原之還原筆記，但仍有限制，可能會有錯漏，還望大眾海涵。
                                </p>
                                <p>
                                    本團隊由實務工作者與育兒民眾等等組成，利用下班時間及假日空暇進行本計畫，故審閱及處理問題速度受限，亦請各位諒解。
                                </p>
                            </div>
                        </div>

                        <div className="rounded-[1.8rem] border border-[#F0D4D1] bg-[#FDF3F2] p-6">
                            <p className="text-[18px] font-bold leading-[1.9] text-[#6B5146]">
                                因為都是大家下班、育兒時間騰出時間維護和審閱網站，還請大家幫忙避免批評謾罵、洩漏個資，或把這裡的討論延燒到其他平台。我們希望這裡就心平氣和地講，也讓我們這些中年社畜好過一些哈 (´･_･`) 拜託了。
                            </p>
                        </div>

                        <div className="rounded-[1.6rem] border border-[#E8E0D4] bg-white p-6">
                            <h4 className="text-[22px] font-black text-[#2D2A26]" style={serif}>
                                接下來銜接既有規範內容
                            </h4>
                            <p className="mt-3 text-[16px] font-medium leading-[1.85] text-[#5A5347]">
                                這裡示範的是：先放你新增的「重要 / 計畫限制 / 拜託大家」段落，再往下接目前既有的倫理規範、發言守則、平台運作模式與問題意識。也就是你說的附件八內容往下承接，不把新文案孤零零丟在尾巴。
                            </p>
                            <div className="mt-5 inline-flex items-center gap-3 rounded-2xl bg-[#F6F1E7] px-5 py-3 text-[15px] font-black text-[#6B6358]">
                                <FileText size={16} />
                                下方銜接既有規範區塊
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
