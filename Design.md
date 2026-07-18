# Design.md — Visual system

## Direction
Strict black-and-white, grid-based, dossier/ledger aesthetic — like a structured record or audit log, not a typical soft SaaS dashboard. No color accents, no gradients, no border-radius anywhere. The visible grid and hairline rules are the decoration; nothing else is added on top.

## Color tokens
```
--ink:    #0a0a0a   (primary text, borders, filled states)
--paper:  #f7f7f5   (page background)
--paper2: #ffffff   (card/surface background)
--faint:  #c9c9c4   (grid lines, subtle borders, dividers)
--mid:    #6b6b66   (secondary/muted text)
```
That's the entire palette. No blue links, no red errors — errors and states are communicated through text, weight, and layout, not color.

## Typography
- **Display/headings:** a heavy, condensed, uppercase display face (Archivo Black or equivalent) — used at large sizes with tight letter-spacing (negative tracking) for section titles and the hero.
- **Body/UI text:** Archivo (regular/medium/bold weights) for card titles, descriptions, buttons, form labels.
- **Monospace/data:** JetBrains Mono for anything numeric or structural — topic numbers, stats, tags, difficulty badges, dates. This face should always signal "this is a label or data point, not prose."
- Headings are uppercase by default. Body copy is sentence case.

## Layout
- A persistent faint background grid (1px lines, ~48px cells) across the whole page, fixed on scroll.
- Content is constrained to a max-width column (~1200px) with consistent side padding.
- Topic cards render in a 3-column grid on desktop (1-column on mobile), bordered with `--ink`, no gaps between cards (shared borders, like a spreadsheet/ledger).
- Phase-project and combined-project cards span the full row width and use a diagonal hairline pattern fill to visually distinguish "project" from "topic."
- The capstone is a separate, bordered, centered box at the very bottom — visually set apart as the "final destination."

## Signature interaction
Topic cards invert on hover: a black panel slides up from the bottom of the card (transform, not opacity) and all text within flips to `--paper` color. This is the one deliberate, memorable motion moment on the page — everything else stays quiet and functional.

## Components

**Stat strip (dashboard hero):** a 4-column row, hairline top/bottom borders, hairline dividers between cells, each cell showing a large mono-adjacent number and a small uppercase mono label beneath it.

**Daily activity grid:** a GitHub-contributions-style grid (roughly 53 columns × 7 rows) of small square cells. Empty = `--paper2` with a faint border; increasing solve-counts per day step through 4 progressively darker fills toward `--ink`.

**Topic card:** topic number + "/ 23" (mono, muted) at top, topic title (bold, uppercase) below it, subtopic count (mono, muted) below that, then a progress bar (thin bordered track, filled bar) with a "solved/total" mono tag beside it.

**Question row:** a bordered row containing, left to right: a square checkbox (border only when unchecked, filled `--ink` background with a checkmark when checked — and the entire row background inverts to `--ink` when done), the question text (underlined-dotted if it's a link, opening in a new tab), a muted mono platform tag, and a bordered difficulty badge (Easy = slightly faded border/text, Medium = normal, Hard = filled solid `--ink` background).

**Checkpoint project block:** dashed border (distinct from the solid borders used elsewhere), a small filled "Checkpoint" flag/tag, project title and one-line description.

**Auth forms (login/signup):** centered card on the same grid background, same type system, bordered inputs (no rounded corners, `--ink` border, `--paper2` fill), a single full-width primary button (filled `--ink` background, `--paper` text), inline error text directly below the form in a plain sentence (no icon, no color — weight/positioning does the work).

## Motion
- Page-load: hero content fades and rises slightly on load (translateY + opacity, ~0.9s, eased).
- Progress bars animate their width when they change.
- Card hover: the black-panel invert described above (~0.35s, eased).
- Respect `prefers-reduced-motion: reduce` — disable all of the above when set.

## What to explicitly avoid
- No warm cream background with a terracotta/orange accent.
- No near-black background with a single neon accent color.
- No rounded corners or soft shadows anywhere.
- No icon library for decoration — if a symbol is needed (checkmark, arrow, star), use a plain unicode character or hand-drawn inline SVG, not an icon font/library.
