# Project Setup Guide (社工觀庭筆記共構平台)

## ⚠️ Prerequisite: Install Node.js
Because Node.js was not detected on your system, you must install it to run the web application.

1.  Download **Node.js (LTS version)** from [nodejs.org](https://nodejs.org/).
2.  Install it with default settings.
3.  Restart your terminal (PowerShell or Command Prompt).

## 🚀 How to Run the Project for the First Time

1.  **Open Terminal** and navigate to the `frontend` folder:
    ```powershell
    cd "\\220.132.53.201\彥宇私人\專案建檔\社工觀庭筆記共構平台\frontend"
    ```

2.  **Install Dependencies**:
    Run the following command to download React, Next.js, and other libraries defined in `package.json`:
    ```powershell
    npm install
    ```
    *(This may take a few minutes)*

3.  **Start the Development Server**:
    ```powershell
    npm run dev
    ```

4.  **View the App**:
    Open your browser and navigate to `http://localhost:3000`.

## 📂 Project Structure
- `app/` - Main application pages and layouts.
- `components/` - Reusable UI components (Navbar, TranscriptView, etc.).
- `lib/` - Mock data and utility functions.
- `tailwind.config.js` - Design system configuration (colors, fonts).

## ✨ Features Implemented
- **Home View**: Landing page with "Trending" section.
- **Session List**: List of court sessions.
- **Transcript View**: Detailed conversation view with granular commenting (Block-level).
- **Mock Data**: Uses `mockData.ts` to simulate Notion API response.
