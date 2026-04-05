# REPO CLEANUP FINAL VERIFICATION — 2026-04-04

This file records the first complete cleanup and governance pass after the repo was suffering from version-signal drift.

## What is now true

1. Production remains reachable and healthy for the main formal routes:
   - `/`
   - `/about`
   - `/sessions`
   - `/forum`
2. `main`, `origin/main`, and the current working branch baseline were aligned at verification time.
3. The task gate is now executable, not just documented.
4. Preview / prototype / demo / archive routes have been physically isolated with route groups.
5. Root noise files and obvious non-repo runtime output have been removed and ignored.

## Verification results

- Gate check: `npm run gate:check`
- TypeScript check: `cmd /c npx tsc --noEmit --incremental false`
- Production verification:
  - `https://court-notes-site.vercel.app/`
  - `https://court-notes-site.vercel.app/about`
  - `https://court-notes-site.vercel.app/sessions`
  - `https://court-notes-site.vercel.app/forum`

## What was cleaned

### Noise removed

- Root log files
- Root HTML fetch/debug output
- Root curl/debug output

### Safe retired items removed or kept retired

- `app/ClientApp.tsx`
- `app/api/cms/route.ts`
- `app/prerequisites/page.tsx`
- `app/rules/page.tsx`
- `components/AboutView.tsx`
- `components/Footer.tsx`
- `components/HomeView.tsx`
- `components/SectionBanner.tsx`
- `components/SessionsListView.tsx`
- `components/TranscriptView.tsx`
- `components/InternalRouteNotice.tsx`
- `lib/mockData.ts`

### Isolation completed

- `app/(preview)/...`
- `app/(prototype)/...`
- `app/(demo)/...`
- `app/(archive)/...`

## Remaining reality

The repo is still intentionally **dirty**. This is no longer a surprise state; it is now an explicitly governed state.

Meaning:
- Work can continue.
- But every new task must begin with `CURRENT_TASK_GATE.md`.
- Work must stay scoped to explicit touched files.

## Required discipline after this point

1. Run the gate before editing:
   - `npm run gate:check`
2. Confirm formal source of truth before changing code.
3. Do not treat preview / prototype / archive as formal implementation basis.
4. Record production-relevant work in `DEPLOYMENT_LEDGER.md`.

## Status

Cleanup phase 1: complete  
Cleanup phase 2: complete  
Cleanup phase 3: complete  
Next phase: normal feature / UI work under governed scope lock
