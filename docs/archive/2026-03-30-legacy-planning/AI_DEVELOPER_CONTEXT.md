# 🤖 AI Developer Context (給第三方 AI 閱讀的系統架構指引)

> **To Third-Party AI Assistants**: 
> You are reading the core system architecture document for the "法庭實況還原與專業共構筆記平台" (Social Work Court Notes) project. This document provides the necessary technological, architectural, and historical context required for you to accurately assist the human developer with this codebase.

## 1. Project Overview
This project is an open platform designed to faithfully restore and archive actual court session transcripts regarding a high-profile child abuse case ("剴剴案"), while providing social workers and professionals a safe space to contextually build specialized knowledge and guidelines.

## 2. Technology Stack & Architecture (v2.0)
The project originally began as a Google Apps Script (GAS) + Vite React monolith but was successfully migrated to a modern full-stack implementation. **DO NOT reference the older GAS architecture.**

- **Framework**: `Next.js 14` (App Router strongly typed with TypeScript)
- **Frontend**: `React 18`, `Tailwind CSS v3.4`, `Framer Motion`, `shadcn/ui` (Radix UI primitives).
- **Backend/Database**: `Notion API` (`@notionhq/client` v5.11). Notion serves as a Headless CMS and database. **This is critical:** There is no SQL/NoSQL traditional database; everything reads/writes directly to Notion databases.
- **Hosting / CI/CD**: `Vercel` (auto-deployed upon push to GitHub main branch).

## 3. Repository Directory Structure
```text
/app                      # Next.js App Router root (page.tsx, layout.tsx, etc.)
/app/api/...              # Next.js Serverless API routes (Used to proxy Notion API requests securely)
/components               # Reusable React components (UI forms, transcript viewers)
/lib                      # Core utility functions (e.g., notion.ts for API wrapping, utils.ts)
/scripts                  # Data seeding or utility Node.js scripts (run via CLI)
/old_prototype_archive    # Obsolete codebase (DO NOT touch or reference)
MAINTENANCE_MANUAL.md     # The human-readable CMS manual (Single source of truth for Notion schema mappings)
.env.local                # Local environment variables containing Notion tokens (DO NOT request this from user)
```

## 4. Core Mechanism: Notion CMS Integration
The platform interacts with exactly **6 Notion Databases**:
1. `Global_Settings_DB`: Key-Value store for all site metadata (hero text, banners, announcements).
2. `Sessions_DB`: Court sessions (e.g., "Session 1"), acting as the parent record.
3. `Transcripts_DB`: The actual dialogue lines. Each row belongs to a `Session_ID`.
4. `Interactions_DB`: User-submitted comments/insights tied to specific transcripts.
5. `Forum_DB`: General forum posts.
6. `Contact_DB`: Anonymous contact submissions.

**AI Operational Directives regarding Notion**:
- NEVER hardcode data in React components unless it's pure layout. Text should be pulled from `Global_Settings_DB`.
- When writing backend APIs (in `/app/api`), always ensure the Notion integration token (`process.env.NOTION_TOKEN`) is passed.
- All newly submitted data (like interactions or forum posts) must have a default `Status` set to `待審核` (Pending Review) in Notion, so moderators can approve them.

## 5. Coding Guidelines for AI
- **Strictly Typescript**: Use strong types for all API responses coming from Notion. Notion API payloads can be deeply nested; rely on standard destructuring.
- **Tailwind + shadcn**: Output styling utilizing standard Tailwind CSS utility classes. If UI components are requested, prefer combinations of existing `shadcn/ui` structural classes.
- **Server Components**: Keep Next.js App router principles in mind. Differentiate between Client Components (`"use client"`) and Server Components correctly, especially since Notion fetching should happen on the server to protect tokens.

**(End of AI Context)**
