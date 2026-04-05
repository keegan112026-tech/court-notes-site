# Page Polish Standard 2026-04-04

## Purpose

This document defines the current page-quality baseline for the site.

It exists so that future page work does not become one-off polishing.
Instead, any page that is promoted into the main site should be brought up to the same standard of:

- visual hierarchy
- information rhythm
- interaction quality
- readability
- consistent subpage structure

## Hard rules

- Official copy, naming, and narrative wording still belong to the user only.
- This standard governs layout, interaction, hierarchy, and UI quality.
- Do not use this document as permission to rewrite user text.
- If a page needs new wording, treat that as a separate copy task.

## Current baseline patterns

### 1. Shared subpage shell

All major reader-facing subpages should converge on:

- top beta banner
- unified subpage header
- clear primary navigation
- stable page max-width
- visible top breathing room below header

Current reference:

- `components/SubpageHeader.tsx`

### 2. Strong page opening

A page should not begin with a flat block of text.
The first screen should have at least one of the following:

- a narrative hero
- a structured information lead
- a dual-card entry area
- a section banner with immediate context

Current good references:

- `/`
- `/about`
- `/sessions`

### 3. Dual-card entry pattern

When a page has two major actions or two major reading paths, prefer a balanced dual-card layout instead of:

- one oversized card and one weak side note
- stacked generic links
- plain text introductions

Current reference:

- `/sessions` top area:
  - published notes entry
  - cross-session workspace entry

This pattern is approved as a reusable site standard.

### 4. Section banner rhythm

Long pages should be divided by clear visual chapter markers.
Use section banners when:

- a new topic begins
- narrative changes into system explanation
- informational density increases

Current reusable reference:

- `components/SectionBanner.tsx`

### 5. Card polish baseline

Cards promoted into major site UI should generally have:

- meaningful radius
- internal spacing that supports scanning
- a visible hierarchy between label, title, and supporting text
- a hover state that improves clarity, not novelty
- a shadow level appropriate to importance

Avoid:

- flat white boxes with no emphasis
- random mixed radii
- overly loud animation

### 6. Safe micro-interaction rules

Micro-interactions are approved when they:

- clarify affordance
- guide attention
- make dense content feel lighter

Micro-interactions are not approved when they:

- compete with正文
- introduce toy-like energy
- create accessibility friction

Approved directions:

- hover lift
- soft glow
- subtle icon drift
- controlled reveal
- tooltip / hovercard
- structured accordion

Reference:

- `MICRO_INTERACTION_APPLICATION_GUIDE_2026-04-04.md`

### 7. Dense information handling

When sections may grow over time, do not just stack more cards vertically forever.
Preferred strategies:

- controlled collapse / reveal
- grouped cards
- section-level expand behavior
- later, carousel for entry cards only

Current note:

- carousel is considered suitable for top-level published-note entry cards
- carousel is not yet the default for full procedural sections

### 8. Information priority

Pages should visibly distinguish:

- primary action
- secondary action
- archival/background information

If everything looks equally important, the page is not finished.

## What now counts as “site-grade”

A page can be considered aligned with the current site-grade baseline when it has:

- the shared subpage shell
- a clear visual opening
- structured information rhythm
- polished entry cards where needed
- restrained but intentional micro-interactions
- no obvious spacing collisions or header overlap
- consistent typography hierarchy

## Pages that should gradually converge to this baseline

- `/sessions`
- `/forum`
- `/contact`
- `/guide`
- `/knowledge`
- future restored / newly integrated session pages
- future single-page prototypes promoted into the main site

## Implementation principle

When improving a page:

1. preserve user copy
2. preserve current product logic
3. raise structure and polish to this standard
4. reuse approved patterns instead of inventing a new page language each time

## Current approved references

- shared shell: `components/SubpageHeader.tsx`
- section banner: `components/SectionBanner.tsx`
- sessions dual-card top area: `app/sessions/page.tsx`
- safe micro-interactions: `MICRO_INTERACTION_APPLICATION_GUIDE_2026-04-04.md`
