'use client';
import React from 'react';

const AboutView = () => {
    return (
        <div className="max-w-4xl mx-auto px-4 py-12 pb-32">
            <div className="bg-white rounded-[2rem] p-12 border border-[#EBE7E0] shadow-sm space-y-8">
                <h2 className="text-3xl font-black text-[#6B8E23]">關於本計劃</h2>
                <div className="space-y-6 text-gray-600 leading-relaxed font-medium">
                    <p>
                        社會工作是一門實踐的學科，而法庭則是社工實務與法律權力交鋒的最前線。
                        然而，這些珍貴的實務經驗往往隨著案件結束而散佚，無法累積成可被傳承的專業知識。
                    </p>
                    <p>
                        「觀庭共構筆記」平台旨在建立一個去中心化的知識庫。
                        透過將法庭對話轉化為逐字稿，並引入「顆粒化」的評論機制，讓社工、法律人、學生能夠針對具體的對話脈絡進行論辯。
                    </p>
                    <div className="p-6 bg-gray-50 rounded-2xl border-l-4 border-[#6B8E23]">
                        <h4 className="font-bold text-gray-800 mb-2">核心價值</h4>
                        <ul className="list-disc list-inside space-y-2 text-sm">
                            <li>看見實務：讓社工隱微的判斷被看見。</li>
                            <li>跨界對話：翻譯法律與社工的語言隔閡。</li>
                            <li>知識累積：從個案經驗提煉通則智慧。</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutView;
