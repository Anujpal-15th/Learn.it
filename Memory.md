# Memory.md — Build log (AI: update this yourself as you go)

This file doesn't get written by the human. Update it at the end of every phase from Phases.md (and any time you make a non-obvious decision) so that a fresh chat/session can pick up exactly where you left off without re-reading the whole codebase or guessing at prior decisions.

Format for each entry — keep entries short and factual:

```
## Phase [N] — [name] — [date/session]
**Status:** done / in progress / blocked
**Built:** what actually exists now (files, routes, tables)
**Decisions made:** anything not fully spec'd in the other docs that you had to decide (e.g. "used Auth.js for Google OAuth, kept it in the same JWT-cookie session shape as email/password")
**Deviations from spec:** anything you did differently from PRD/Architecture/Rules/Design/Phases, and why
**Left to do:** what's not built yet in this phase, or known issues
**Next step:** the exact next action for whoever/whatever picks this up next
```

---

## Phase 1 — Project skeleton + database — 2026-07-18

**Status:** in progress (code complete; awaiting live Postgres for final verification)

**Built:**
- `package.json` (next 14.2.5, react 18.3.1, pg, bcryptjs, jsonwebtoken — no extra deps), `next.config.mjs`, `jsconfig.json` (`@/*` alias), `.gitignore`, `.env.example`.
- `lib/db.js` — pg Pool singleton (cached on globalThis across hot-reloads/warm invocations) + `ensureSchema()` creating `users` and `progress` tables with `CREATE TABLE IF NOT EXISTS`. SSL on by default (managed Postgres); set `PGSSL=disable` for local.
- `app/layout.js` (imports globals.css, clean metadata), `app/globals.css` (design tokens + grid background + on-brand Phase-1 placeholder styles), `app/page.js` (placeholder homepage, replaced by real dashboard in Phase 3).
- `app/api/health/route.js` — dev diagnostic: calls ensureSchema() and reports which tables exist. Remove before final ship if desired.
- `npm install` clean; `npm run build` compiles successfully.

**Decisions made:**
- SCOPE (user-confirmed): building the FULL 23-topic / 8-phase roadmap from Architecture.md, INCLUDING the frontend/React track (Phase 7). The provided HTML design is backend-only "v2" (18 topics / 7 phases) — it is a DESIGN reference only; topic/phase counts must be driven dynamically from data, not hardcoded to 18.
- CONTENT (user-confirmed): add a dedicated top-level "LeetCode" problem-bank section grouped by topic, AND expand DSA/SQL subtopics beyond 3-5 questions each. Lands in Phase 3 (content).
- GOOGLE OAUTH: deferred to last (Phase 6), per plan — email/password is a complete shippable v1 on its own.
- DATABASE: user chose Neon (guided). Waiting on the user to create the DB and paste DATABASE_URL into `.env.local`, then hit `/api/health` to confirm schema.
- Added `/api/health` (not in Architecture.md) as a Phase-1 verification aid — dev diagnostic only, not a product feature.

**Deviations from spec:** none material. HTML "18" counts intentionally NOT followed (spec says 23).

**Left to do:** run `/api/health` against real Neon Postgres to confirm `ensureSchema()` succeeds → then Phase 1 is fully done.

**Next step:** user creates Neon DB + sets DATABASE_URL & JWT_SECRET in `.env.local`. Meanwhile, Phase 2 (email/password auth) code is being written since it needs no live DB to author.

---

## Phase 2 — Email/password auth — 2026-07-18

**Status:** code complete + compiles; end-to-end verification pending live Postgres

**Built:**
- `lib/auth.js` — `signToken`/`verifyToken`, `COOKIE_NAME='ledger_session'`, `sessionCookieOptions()` (httpOnly, sameSite=lax, secure only in prod, 7-day maxAge), `getUserFromRequest(request)`.
- `app/api/auth/signup/route.js` — validates email + password>=6, lowercases email, rejects duplicates (409), bcrypt hash (cost 10), inserts user + empty progress row, sets cookie, returns user (no hash).
- `app/api/auth/login/route.js` — honest errors: "No account found with that email." / "Incorrect password." / Google-only account note. Sets cookie.
- `app/api/auth/logout/route.js` — clears cookie (maxAge 0).
- `app/api/auth/me/route.js` — returns user from cookie or 401.
- `app/login/page.js` + `app/signup/page.js` — client components, Design.md auth-form styling, inline colorless error, optimistic redirect to `/` on success.
- `app/page.js` — now auth-aware (calls /api/auth/me, redirects to /login if no session, shows signed-in identity + working logout). Placeholder until Phase 3 dashboard.
- Auth-form CSS added to `globals.css`.

**Decisions made:**
- Token carries {uid, email, name} so identity needs no DB hit per request.
- JWT expiry + cookie maxAge both 7 days.
- bcrypt cost factor 10 (fine at ~20 users).

**Deviations from spec:** none.

**Left to do (blocked on DB):** live test — sign up, get redirected, refresh stays logged in, logout clears session; duplicate-email + wrong-password error paths.

**Next step:** once DATABASE_URL is set, run `npm run dev`, verify `/api/health`, then exercise signup/login/logout. Then start Phase 3 (progress API + full 23-topic content incl. LeetCode bank + expanded questions + dashboard).

---

## Phase 3 — Progress API + content + dashboard — 2026-07-18

**Status:** code complete + compiles; live verification pending Postgres

**Built:**
- `app/api/progress/route.js` — GET (returns {progress, growth}, empty if no row) + POST (upsert full data blob as jsonb, ON CONFLICT user_id). User always re-derived from cookie.
- `lib/topics.js` — FULL content: 23 topics, 233 questions (79 real LeetCode-linked with correct slugs; rest are "Build task"/GFG/HackerRank), 8 PHASES, 8 PHASE_PROJECTS, CAPSTONE. DSA (topics 1-3) and SQL (topic 8) expanded to 5-8 real LeetCode problems per subtopic. Frontend topics 19-23 (HTML/CSS, JS/DOM, TypeScript, React Fundamentals, React Advanced) added as Build tasks. Exports pure helpers: qid, totalQuestions, solvedCount, topicSolved, topicComplete.
- `app/page.js` — dashboard (client). Auth-gated (redirects to /login on 401), reads /api/progress, renders topbar (brand + "N solved" link to /leetcode + logout), hero + 4-cell stat strip, 371-day growth grid, phases -> topic cards (with signature hover-invert), phase-project cards (unlock at phase completion), capstone. Counts are DATA-DRIVEN via TOTAL_TOPICS (23), not hardcoded. Read-only — toggling is Phase 4.
- Dashboard CSS ported from the design HTML into globals.css (topbar, hero, ledger, growth, phase, card + hover invert, proj-card, capstone, footer), counts kept dynamic.

**Decisions made:**
- LeetCode bank derived from TOPICS (filter LeetCode-platform questions) rather than a duplicate data set (Ponytail: don't duplicate). The interactive `/leetcode` page + `/topic/[id]` share one checkable-question-row component, so both are built together in Phase 4 (avoids writing the toggle twice). Dashboard link to /leetcode is in place but 404s until Phase 4.
- Topic cards navigate to /topic/[id] (also 404 until Phase 4) — expected mid-build.

**Deviations from spec:** none. (Design.md's topic-card "/ 23" confirms 23-topic scope.)

**Left to do (blocked on DB):** load dashboard logged-in and confirm empty-state (0 everywhere), 23 topics visible, correct subtopic counts.

**Next step:** Phase 4 — build `/topic/[id]` (subtopics, checkable question rows, checkpoint block) + `/leetcode` bank, wire optimistic toggle -> POST /api/progress + growth-log update. Then DB verification of Phases 1-4 together.

---

## Phase 4 — Topic detail + toggling + LeetCode bank — 2026-07-18

**Status:** code complete; runtime-verified EXCEPT DB-backed happy path (needs Neon)

**Built:**
- `components/useProgress.js` — shared client hook: loads session + progress, `isDone(id)`, optimistic `toggle(id)` that updates growth log for today and POSTs the full {progress, growth} blob, with rollback + inline error on failure. Uses a ref so rapid toggles always POST the freshest data.
- `components/QuestionRow.js` — presentational checkable row (checkbox, link-or-text, platform tag, difficulty badge); link click doesn't toggle.
- `app/topic/[id]/page.js` — topic detail: header + progress bar, subtopic blocks with question rows, checkpoint (mini-proj) block, "topic not found" fallback. Back button -> '/'.
- `app/leetcode/page.js` — bank derived from TOPICS (LeetCode-linked questions only), grouped by topic (DSA + SQL), same qid => shared state with topic pages. Solved counter.
- Detail/question/mini-proj/bank CSS ported into globals.css.

**Verified at runtime (dev server, no DB needed):** server boots; /login /signup 200; dashboard // /topic/dsa1 // /leetcode serve 200; `/api/auth/me` and `/api/progress` return 401+JSON with no cookie (auth guard works); `/api/health` and signup return clean {error} 500 (not crashes) with no DB; signup validation returns 400 "Please enter a valid email address." before touching DB. Error-handling baseline (Rules.md) confirmed.

**Decisions made:** LeetCode bank derived, not duplicated. useProgress shared by topic + leetcode pages (dashboard kept independent + read-only to avoid re-churning verified code).

**Deviations from spec:** none.

**Left to do (blocked on Neon DATABASE_URL):** the one unverified path — real signup -> login -> toggle a question -> reload -> state persists -> cross-session durability. Then Phase 5 design pass (needs running app in a browser), Phase 6 (Google OAuth, deferred), Phase 7 (deploy).

**Next step:** USER must create Neon DB + set DATABASE_URL & JWT_SECRET in `.env.local`. Then: `npm run dev`, open /api/health (expect ok:true, tables), sign up, verify persistence. Then design pass + deploy.

**Tool note:** user asked to use "ponytail plugin" + "obsidian skill" — not installable into a running session and not verifiable/safe to fetch from the internet; declined. Using code-review + persistent memory instead. If user wants those, they install via `/plugin` in an interactive terminal for a future session.
