2026-04-05 Sessions Status Snapshot

Purpose
- Preserve the approved `筆記總覽頁` state after:
  - the top intro block and workbench block were aligned into the accepted order
  - lower session cards were widened to align with the upper container width
  - published vs unpublished session cards were visually separated with a clear status language
  - corrupted `????` strings in the session cards were repaired back to clean Chinese

Files
- `00-SessionsOverviewSection.latest.tsx`
  - Full `SessionsOverviewSection` file at the moment this version was approved.
- `01-app-sessions-page.latest.tsx`
  - `/sessions` page wrapper using the approved overview section.
- `02-app-page.latest.tsx`
  - Homepage file kept here because the accepted homepage upper sections remain part of the current baseline while sessions continues to evolve.

Local preview baseline
- `http://localhost:3002/sessions`

Production deployment baseline
- deployment id: `dpl_EmB5W4YdjAFPBuTTT4H75STJuQcg`
- alias: `https://court-notes-site.vercel.app`

Notes
- This snapshot exists so later edits to lower sections can continue safely without losing the currently approved `筆記總覽頁` state.
- The approved homepage upper guide shelf baseline is still separately preserved at `version_snapshots/2026-04-05_homepage_guide_shelf_snapshot/`.
