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

---

## Phase 7 — Deploy — 2026-07-18 (done ahead of Phase 5/6 at user's direction)

**Status:** done — live in production, fully verified end-to-end

**Built/done:**
- DB: Neon Postgres project created by user, `DATABASE_URL` set.
- Repo pushed to `https://github.com/Anujpal-15th/Learn.it` (main branch, single clean commit, no `.env.local`/secrets committed — confirmed gitignored before push).
- Hosting: Vercel project imported from the GitHub repo, `DATABASE_URL` + `JWT_SECRET` set as env vars, deployed. Live URL: **https://learn-it-roan.vercel.app**

**Verified live in production (via browser automation, not just curl):**
- `/api/health` → `{"ok":true,"tables":["progress","users"]}` — schema auto-created on real Neon DB.
- Full signup flow: created a real test account (Verify Bot / verify-ledger-test@example.com) → landed on dashboard.
- Dashboard renders live data correctly: 8 phases, 23 topics, 233 questions, phase-project unlock gating, empty-state 0s.
- `/topic/dsa1` renders all subtopics/questions/checkpoint with correct real LeetCode URLs (spot-checked: two-sum, best-time-to-buy-and-sell-stock, etc. all resolve to real leetcode.com/problems/ slugs).
- Toggled "Two Sum" → optimistic UI updated instantly (1/17 solved) → **hard page reload → state persisted** (proves POST /api/progress -> Postgres -> GET /api/progress round-trip works for real, not just local state).
- Dashboard reflected the same solved count after navigating back (1/233 questions solved, topic card 1/17).
- Logout cleared the session cookie → redirected to /login.
- Re-hit `/` with no session afterward → correctly redirected to /login (auth guard confirmed in production, not just dev).

**Deviations from spec:** Phase 7 (deploy) executed before Phase 5 (design pass) and Phase 6 (Google OAuth) at the user's explicit direction ("set database and host it" came before the design-pass request). Design pass and Google OAuth remain outstanding.

**Left to do:** Phase 5 — line-by-line Design.md audit against the live deployed UI (spacing, hover-invert on topic cards, motion, mobile responsiveness, prefers-reduced-motion). Phase 6 — Google OAuth (still optional/deferred; email/password v1 is fully shippable as-is, which it now literally is).

**Next step:** Run the Phase 5 design pass against https://learn-it-roan.vercel.app, checking desktop + mobile viewports and the hover-invert interaction. Then ask whether the user wants Phase 6 (Google OAuth) before considering v1 fully closed out.

**Tool note:** user asked to use "ponytail plugin" + "obsidian skill" — not installable into a running session and not verifiable/safe to fetch from the internet; declined. Using code-review + persistent memory instead. If user wants those, they install via `/plugin` in an interactive terminal for a future session.

---

## Content overhaul — teach-before-practice, real DSA depth, Java fundamentals — 2026-07-18

**Status:** done — code complete, builds clean; live-verification pending (next action)

**Why:** user feedback (voice-transcribed, substantial): questions with no concept teaching first, DSA far too thin (3 topics, 5-6 Q/subtopic) and out of order relative to a beginner's needs, Java fundamentals (variables/operators/control-flow/OOP pillars) missing entirely before Collections/Streams. User explicitly asked for a plan-mode review before implementation given the scope; plan was written to `C:\Users\anuj-pal\.claude\plans\composed-watching-thacker.md`, all 4 structural questions answered via AskUserQuestion (all "Recommended" options), plan approved via ExitPlanMode before any code changed.

**Research done before writing content (not just recalled from memory):** WebFetch against neetcode.io confirmed the real, current 18-pattern/150-problem NeetCode taxonomy (exact category names + counts). WebSearch spot-checks on the trickier categories (Tries, Advanced Graphs, 2-D DP, Math & Geometry, Bit Manipulation) confirmed real slugs before using them. WebFetch against hackerrank.com/domains/java confirmed real, currently-live HackerRank Java "Introduction" challenge names/slugs (welcome-to-java, java-datatypes, java-if-else, java-loops-i, java-loops-ii, java-output-formatting) and corrected a wrong guess — the real inheritance slug is `java-inheritance-1` (numeral), not `java-inheritance-i`.

**Built — `lib/topics.js` full rewrite:**
- Added `concepts: [...]` (3-5 bullet "what to learn" primer) and optional `learnMore: {label,url}` to every subtopic across all 27 topics (76 subtopics got primers).
- DSA (Phase 0): replaced `dsa1/dsa2/dsa3` (3 topics) with 6 new topics (`dsa1`..`dsa6`) covering all 18 real NeetCode patterns: DSA I (Arrays&Hashing/Two Pointers/Sliding Window), DSA II (Stack/Binary Search/Linked List), DSA III (Trees/Heap/Tries), DSA IV (Backtracking/Graphs), DSA V (Advanced Graphs/1-D DP/2-D DP), DSA VI (Greedy/Intervals/Math&Geometry/Bit Manipulation). Each pattern is its own subtopic with a primer + 5-10 real, verified LeetCode questions (matches each pattern's own real problem count rather than padding to a fixed number — e.g. Tries genuinely only has 3 canonical problems, Advanced Graphs 6). One premium-locked LeetCode problem (Meeting Rooms) swapped for a Build task per Rules.md rather than link something paywalled.
- New topic `java-fundamentals` inserted into Phase 1 before Java Core: Variables & Data Types / Operators & Control Flow / OOP Pillars, using verified-real HackerRank links + Build tasks for OOP concepts without a clean single-problem mapping.
- `java-core` renamed to "Java Core — Collections, Streams & Concurrency" (content/questions unchanged, just no longer claims "OOP" ownership) + primers added to its 4 subtopics.
- Remaining 20 topics (SOLID through React Advanced): primers added to all subtopics, questions/links untouched.
- Checkpoint projects reworded for the 6 new DSA topics + new Java Fundamentals topic to match what's actually taught in each; combined "DSA Judge Engine" project moved to close out DSA VI (end of the whole DSA phase).
- Topic count: 23 → **27** (data-driven everywhere already — `TOTAL_TOPICS = TOPICS.length` — so dashboard/topic-page numbering needed zero manual changes).
- Content totals (grepped post-write): 27 topics, 320 questions (up from 233), 153 real LeetCode links (up from 79), 7 verified HackerRank links, 76 subtopics with concept primers, 8 phases unchanged.

**Built — UI:** `app/topic/[id]/page.js` renders a new `.concept-block` (bordered box, "WHAT TO LEARN" mono eyebrow, bullet list, optional "Learn more ↗" link) between each subtopic's header and its question rows. New CSS in `app/globals.css` — strictly black/white/mono, no new colors, no rounded corners (Design.md compliant). `app/leetcode/page.js` and `app/page.js` (dashboard) needed **zero code changes** — both already derive everything from `TOPICS` at render time, so the new DSA questions/topics flow through automatically.

**Verified:** `npm run build` compiles clean with the larger content file and new UI block.

**Known side effect (flagged, not hidden):** DSA topic ids/subtopic order changed structurally (not just extended), so previously-saved DSA progress (e.g. the test account's "Two Sum" checkbox under the old `dsa1::0::0`) no longer maps to anything — a one-time reset for DSA-phase progress specifically. All other topics' progress is untouched (ids unchanged).

**Left to do:** push to GitHub (main, no attribution per user's earlier instruction) → Vercel auto-redeploys → verify live: dashboard shows 27 topics, open the new DSA I and Java Fundamentals topics in browser, confirm concept primers render with real content and links resolve, confirm `/leetcode` bank picked up the new ~153 LeetCode questions automatically.

**Next step:** commit + push + live browser verification against https://learn-it-roan.vercel.app.

---

## Roadmap v3 — phase reorder, DSA expansion, gap-closing subtopics, learning links — 2026-07-18

**Status:** done, code complete + builds clean; pushing + live-verifying next

**Why:** user pasted their own detailed week-by-week Java/DSA curriculum and asked me to fold in the genuinely new topics (ignoring the week/time scaffolding) and add checkable items + links for them. This independently confirmed most of the job-readiness gaps I'd already flagged (JVM internals, Spring AOP, SQLi/XSS/CSRF, Actuator/Prometheus, circuit breakers/CAP theorem, connection pooling/migrations/replication) plus new ones (enums/var/records, networking foundations). User also directed: Phase 0 should be Language & Foundations, THEN DSA (addresses their own earlier complaint about DSA-before-basics), and every phase + topic should carry a learning-resource link, not just some subtopics.

**Decisions (via AskUserQuestion, all confirmed):** JVM Internals & Memory Management → new subtopic inside `java-core` (not a standalone topic). Job Prep (resume/LinkedIn/behavioral/mock interviews) → explicitly SKIPPED, out of PRD scope and doesn't fit the checkbox+link+difficulty data model at all. DSA depth → expanded from 8-10/subtopic to a 15-20 target, honestly capped lower for patterns with a genuinely small real problem pool (see below) rather than padded with invented links.

**Built — `lib/topics.js`:**
- **Phase reorder:** `PHASES[0]`/`PHASES[1]` and `PHASE_PROJECTS[0]`/`[1]` swapped. New Phase 0 = Language & Foundations (java-fundamentals, java-core, solid, build-tools, git; num 1-5). New Phase 1 = DSA & Algorithms (dsa1-dsa6; num 6-11). Phase 2 onward (num 12-27) unchanged. Topic `id`s unchanged throughout — only `phase`/`num` fields moved — so no progress-breaking id changes from the reorder itself.
- **DSA expanded** from 144 to ~300 questions, all individually sourced from well-known real LeetCode problems; 4 slugs I was least certain of were verified live via WebSearch before use (incl. correcting `find-the-city-with-the-smallest-number-of-neighbors-at-a-threshold-distance`, `path-with-minimum-effort`, `single-threaded-cpu`, `grumpy-bookstore-owner`). Honest caps kept on naturally small real pools: Tries (7), Heaps (12), Advanced Graphs (10), Intervals (7, one Build task since a classic Meeting Rooms problem is premium-locked), Bit Manipulation (12) — noted inline in the Intervals concept primer rather than silently under-delivering.
- **New subtopics added** (all appended at the end of their topic's array, not inserted in the middle, so no existing progress indices shifted): `java-fundamentals` gets "Enums, var & Records"; `java-core` gets "JVM Internals & Memory Management"; `spring` gets "Spring AOP"; `rest` gets "Networking Foundations" (HTTP/HTTPS, DNS, TCP vs UDP, WebSockets); `security` gets "Common Web Vulnerabilities — SQLi, XSS & CSRF"; `cicd` gets "Observability — Actuator, Logging & Metrics"; `sysdesign` gets "Resilience & Distributed Systems Concepts" (CAP theorem, circuit breakers, idempotency, CDN); `sql-db` gets "Connection Pooling, Migrations & Replication" (HikariCP, Flyway/Liquibase, replication/sharding).
- **Existing subtopics enriched** (no id/index change): Multithreading & Concurrency now explicitly covers Thread vs Runnable, volatile, atomic classes, ExecutorService, CompletableFuture, deadlocks (3→7 questions). Design Patterns now covers Factory/Builder/Adapter/Decorator/Facade alongside Singleton/Strategy/Observer (3→8 questions). JPA's Querying subtopic now explicitly covers Spring Data JPA repository methods. Testing's Mockito subtopic now covers stub vs mock vs spy vs fake; Integration Testing now names @WebMvcTest/@DataJpaTest. Caching subtopic now covers @Cacheable/@CacheEvict by name; Messaging subtopic now covers at-least-once vs exactly-once delivery + consumer idempotency.
- **`learnMore` added at TOPIC level (all 27) and PHASE level (all 8)** — one solid, verified-real resource each (official docs: Oracle, Spring, MDN, PostgreSQL, Redis, Docker, GitHub Actions, React, TypeScript; or well-known references: NeetCode, System Design Primer, OWASP Top Ten, Refactoring.Guru, HikariCP README, Baeldung, restfulapi.net, JUnit5 guide, AWS Cloud Practitioner). Subtopic-level `learnMore` from the prior pass kept as-is (bonus coverage, not what was strictly asked this round).
- Content totals (grepped post-write): 27 topics, **468 questions** (up from 320), **260 real LeetCode links** (up from 153), 7 HackerRank links, 8 phases, phase order confirmed swapped (`java-fundamentals` now phase 0/num 1, `dsa1` now phase 1/num 6).

**Built — UI:** `app/page.js` dashboard renders each phase's `learnMore` link under the phase description. `app/topic/[id]/page.js` renders each topic's `learnMore` link under the topic subtitle. Both reuse the existing `.concept-more` CSS class — no new styles needed.

**Verified:** `npm run build` compiles clean.

**Left to do:** push to GitHub (no attribution, per standing instruction) → Vercel auto-redeploys → live browser verification: dashboard shows "27 topics / 468 questions", Phase 0 is now Language & Foundations with Phase 1 DSA, new subtopics (JVM Internals, Enums/var/Records, Spring AOP, Networking Foundations, SQLi/XSS/CSRF, Observability, Resilience/CAP, DB Ops) render with primers + working links, phase/topic-level "Learn more" links appear and resolve, `/leetcode` bank auto-picks up the ~260 links with zero code changes (same as last time — it derives from TOPICS at render time).

**Next step:** commit + push + live verification against https://learn-it-roan.vercel.app.
