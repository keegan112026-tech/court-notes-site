# ROUTE ISOLATION STRATEGY — 2026-04-04

## Purpose
This document records the current route landscape of the site and defines a practical isolation strategy so the main public site stays coherent while previews, prototypes, demos, and archived experiments remain traceable without contaminating the formal product surface.

## Audit Summary

### Publicly reachable formal routes
- `/`
- `/about`
- `/guide`
- `/knowledge`
- `/sessions`
- `/sessions/[id]`
- `/sessions/compose`
- `/forum`
- `/forum/[id]`
- `/contact`
- `/rankings`
- `/admin/login`
- `/admin/review`
- `/admin/articles`
- `/admin/inbox`

### Publicly reachable non-formal routes
- `/about-preview`
- `/guide-prototype`
- `/project-intention-prototype`
- `/beautification-demo`
- `/demo`
- `/demo2`
- `/demo3`
- `/demo4`
- `/sessions/history`
- `/sessions/history/v1`
- `/sessions/history/v2`
- `/sessions/history/v3`

### Current finding
- These non-formal routes are **not currently linked from the audited official pages**, which reduces accidental exposure.
- However, they are still directly reachable by URL and therefore still count as public surface area in local and deployment contexts.

## Route Classification

### A. Formal Public Product Surface
These routes belong to the main site experience and should remain stable, polished, and fully aligned with current architecture and copy rules.

- `/`
- `/about`
- `/guide`
- `/knowledge`
- `/sessions`
- `/sessions/[id]`
- `/sessions/compose`
- `/forum`
- `/forum/[id]`
- `/contact`
- `/rankings`

### B. Admin / Controlled Surface
These are part of the product but not intended for ordinary visitors.

- `/admin/login`
- `/admin/review`
- `/admin/articles`
- `/admin/inbox`

### C. Preview / Prototype Surface
These routes are active working surfaces for design exploration or friend-review sharing.

- `/about-preview`
- `/guide-prototype`
- `/project-intention-prototype`

These should be treated as:
- non-canonical
- temporary
- excluded from formal navigation
- clearly marked if ever exposed on a public deployment

### D. Archive / Historical Surface
These routes preserve earlier UI or layout states for comparison and rollback.

- `/sessions/history`
- `/sessions/history/v1`
- `/sessions/history/v2`
- `/sessions/history/v3`

These should be treated as:
- reference-only
- not part of the current public information architecture
- useful for internal design recovery

### E. Demo / Experiment Surface
These routes are experimental and should not be treated as part of the production information architecture.

- `/beautification-demo`
- `/demo`
- `/demo2`
- `/demo3`
- `/demo4`

These should be treated as:
- internal experiments
- removable or relocatable
- not suitable for public-facing navigation

## Recommended Isolation Strategy

### Immediate rule
Formal navigation, homepage entry points, and shared headers must only point to category A and B routes.

This is already mostly true and should remain enforced.

### Near-term cleanup target
Preview / prototype / history / demo routes should be grouped conceptually as internal surfaces even if they remain physically present in the app for now.

Recommended future grouping:
- previews: `/preview/...`
- archives: `/archive/...`
- demos: `/lab/...`

This is not required immediately, but it is the cleanest long-term organization.

## Keep / Gate / Archive Matrix

### Keep as formal
- `/`
- `/about`
- `/guide`
- `/knowledge`
- `/sessions`
- `/sessions/[id]`
- `/sessions/compose`
- `/forum`
- `/forum/[id]`
- `/contact`
- `/rankings`

### Keep but controlled
- `/admin/login`
- `/admin/review`
- `/admin/articles`
- `/admin/inbox`

### Keep temporarily as working preview
- `/about-preview`
- `/guide-prototype`
- `/project-intention-prototype`

### Keep as internal archive reference
- `/sessions/history`
- `/sessions/history/v1`
- `/sessions/history/v2`
- `/sessions/history/v3`

### Candidates to remove or relocate first
- `/beautification-demo`
- `/demo`
- `/demo2`
- `/demo3`
- `/demo4`

## Operational Rule for Future Work
Whenever a new experimental page is created, it must be assigned one of these route classes immediately:
- formal
- admin
- preview
- archive
- demo

And the page must answer three questions:
1. Is it part of the public product architecture?
2. Should it appear in formal navigation?
3. Should it survive final launch?

If the answer to (1) is no, it must not be linked from formal navigation.

## Recommended Next Actions

### Safe to do next
1. Add a lightweight internal registry page or document for all non-formal routes.
2. Mark preview/prototype/demo pages as non-canonical in deployment strategy.
3. Eventually relocate preview/archive/demo routes under a clearer internal namespace.

## 2026-04-04 latest progress

The first stage of physical isolation has now been completed:

- `about-preview` -> `app/(preview)/about-preview`
- `guide-prototype` -> `app/(prototype)/guide-prototype`
- `project-intention-prototype` -> `app/(prototype)/project-intention-prototype`
- `beautification-demo` and `demo*` -> `app/(demo)/...`
- `sessions/history/*` -> `app/(archive)/sessions/history/*`

This means:
- URLs remain unchanged
- But the file tree no longer mixes non-formal surfaces directly beside the formal route roots
- The project has moved from "document-only labeling" to a first layer of real filesystem isolation

### Not urgent right now
- Deleting historical routes.
- Merging prototypes prematurely into formal routes.

## Current Verdict
The main public product surface is mostly coherent.
The biggest remaining structural risk is not broken routing, but **route sprawl**:
- too many valid URLs
- too many internal exploration pages still directly reachable

This is manageable now because formal pages are not actively linking to them, but it should be formalized before final production consolidation.
