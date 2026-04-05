import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-white border-t border-[#EBE7E0] py-16 px-4 lg:px-12">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
                <div className="space-y-4">
                    <h4 className="text-[#6B8E23] font-black tracking-widest text-lg uppercase">Social Work Court Notes</h4>
                    <p className="text-xs text-gray-400 leading-relaxed">這是一場關於專業權力與生命尊嚴的共構行動。我們在這裡重構法庭現場，讓實務經驗成為改變制度的力量。</p>
                </div>
                <div className="space-y-4">
                    <h4 className="text-gray-800 font-black text-sm">快速連結</h4>
                    <div className="flex flex-col gap-2 text-xs font-bold text-gray-400">
                        <button className="text-left hover:text-[#6B8E23]">投稿須知與免責聲明</button>
                        <button className="text-left hover:text-[#6B8E23]">去識別化實務指南</button>
                        <button className="text-left hover:text-[#6B8E23]">聯絡營運團隊</button>
                    </div>
                </div>
                <div className="space-y-4">
                    <h4 className="text-gray-800 font-black text-sm">最新公告</h4>
                    <div className="bg-[#6B8E23]/5 p-4 rounded-2xl border border-[#6B8E23]/10 text-[10px] text-gray-500 font-medium">
                        ‧ 1141211 場次校對完成 (3小時前)<br />
                        ‧ 系統更新：側邊註記功能優化上線
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
