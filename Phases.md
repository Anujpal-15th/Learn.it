# Phases.md — Build in this order

Don't try to build everything in one pass. Complete and verify each phase before moving to the next. Update Memory.md at the end of every phase.

## Phase 1 — Project skeleton + database
- Scaffold the Next.js app per Architecture.md's folder structure.
- Write `lib/db.js` (Pool + `ensureSchema()`) and confirm the two tables (`users`, `progress`) are created correctly.
- No UI yet beyond a placeholder homepage that confirms the app runs.
- **Done when:** app runs locally, `ensureSchema()` executes without error against a real Postgres connection string.

## Phase 2 — Email/password auth
- Build `/signup`, `/login`, and the four auth API routes (`signup`, `login`, `logout`, `me`).
- Sessions work via httpOnly JWT cookie.
- Style these two pages per Design.md (they don't need to be perfect yet, just functional and on-brand).
- **Done when:** a new user can sign up, get redirected, refresh the page and stay logged in, and log out cleanly. Wrong password / duplicate email show real error messages.

## Phase 3 — Progress API + dashboard shell
- Build `GET`/`POST /api/progress`.
- Build `lib/topics.js` with the full content from Architecture.md's Content Data Model — all 23 topics, all subtopics, all questions, all projects. This is the biggest content-writing phase; don't shortcut it or leave placeholder text anywhere.
- Build the dashboard (`/`) rendering phases → topic cards with real progress-driven completion state, the stats strip, and the daily activity grid — reading from the real `progress` API.
- **Done when:** logging in shows an empty-state roadmap (0 solved everywhere), all 23 topics are visible with correct subtopic counts.

## Phase 4 — Topic detail page + toggling
- Build `/topic/[id]` showing subtopics, questions (checkbox, linked text, platform tag, difficulty badge), and the checkpoint project.
- Wire checkbox clicks to optimistic local state + `POST /api/progress`.
- Confirm progress persists: toggle a question, reload the page, refresh from a different browser session — same state.
- **Done when:** progress toggling is instant, saved, and durable across reloads and devices.

## Phase 5 — Design pass
- Go through Design.md line by line against the actual built UI and correct any drift (spacing, type scale, hover states, the card-invert interaction, motion).
- Confirm responsive behavior down to mobile width.
- Confirm `prefers-reduced-motion` is respected.
- **Done when:** the app visually matches Design.md, not a generic template.

## Phase 6 — Google OAuth (stretch, do last)
- Add Google sign-in as a second path into the same `users`/session system.
- Confirm a user who signs up via email and a user who signs up via Google never collide or duplicate.
- **Done when:** both sign-in methods land the user on the same dashboard with the same session shape. If this phase is skipped or deferred, email/password alone is a complete, shippable v1 — don't block deployment on this.

## Phase 7 — Deploy
- Deploy to Vercel.
- Give the human the exact manual steps to finish activating it: creating a Postgres database (e.g. Neon or Vercel's Storage tab) and setting `DATABASE_URL` + `JWT_SECRET` (+ Google OAuth credentials if Phase 6 was done) as environment variables in the Vercel project, then redeploying.
- **Done when:** the human confirms they can sign up on the live URL and see it work.
