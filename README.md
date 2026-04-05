# Court Notes Platform

> CURRENT ENTRY NOTICE
>
> Do not treat this README as the only source of truth.

## Start here

Read these files first:

1. `00_唯一基準入口_先讀我_2026-04-04.md`
2. `CURRENT_SOURCE_OF_TRUTH_2026-04-04.md`
3. `CURRENT_BASELINE_2026-04-04.md`
4. `WORK_PROTOCOL.md`

## UTF-8 first

This repository contains Chinese copy, governance docs, and generated text
files. Open a UTF-8 safe shell before reading or editing governance docs:

- `npm run shell:utf8`

Then run:

- `npm run gate:check`

## Core stack

- Next.js 14
- React
- Tailwind CSS
- framer-motion
- Firebase Admin / Firestore
- local session JSON data under `data/sessions/`

## Common commands

Install:

```bash
npm install
```

UTF-8 shell:

```bash
npm run shell:utf8
```

Gate:

```bash
npm run gate:check
```

Stable dev entry:

```bash
npm run dev:stable
```

Encoding check only:

```bash
npm run gate:encoding
```
