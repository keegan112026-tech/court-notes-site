import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "法庭實況還原與專業共構筆記 | 社會工作與法律的實務共構",
    description: "這不只是一份開庭紀錄，而是一場化血淚為滋養的集體療癒與重建。透過法庭對話的檢視與辨讀，為社工實務留下寶貴的註腳。",
    keywords: ["社工", "法庭", "觀庭筆記", "共構", "兒少保護", "司法社工"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="zh-TW">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;700;900&family=Noto+Serif+TC:wght@400;700;900&display=swap" rel="stylesheet" />
            </head>
            <body style={{ fontFamily: "'Noto Sans TC', sans-serif" }}>
                {children}
            </body>
        </html>
    );
}
