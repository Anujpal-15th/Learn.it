# Phase 2 Report — Reliability, Security, Learning Quality, Verification

Scope discipline followed throughout: no new major features, no redesign, no architecture rewrite. Everything below is either a verified fact about the existing Phase 1 implementation, or a contained fix to a real problem found while verifying it.

**Before starting, I re-verified the Phase 1 report rather than trusting it**: confirmed `git log`/`origin/main` matched exactly what was claimed, then re-ran `npm run validate` and `npm run build` fresh. Both passed, matching the prior report on that front. Everything past that point (the real-DB test, the concurrency audit, the security audit) was new work for this phase.

---

## 1. Bugs found

- **Lost update on concurrent progress writes (confirmed, fixed — see §3).**
- **Mobile homepage nav had no way to open** (carried over from before this session, not something Phase 1 introduced fresh, but never verified live until now) — fixed in a prior turn this session.
- **My own validator's cycle-detection algorithm crashed the process** (`JavaScript heap out of memory`) the first time I wrote it, due to a `WHITE` color-constant bug that made it recurse into an actual cycle indefinitely instead of detecting it. Caught by self-testing against deliberately-broken data before trusting the check — see §4. This is exactly why "verify, don't assume" mattered even for code written in this same phase.
- **False alarm, not a bug**: I initially suspected keyboard Enter/Space activation was broken on checklist rows (Tab worked, Enter appeared to do nothing). Root cause was the browser-automation tool's synthetic key event, not the app — dispatching a real `KeyboardEvent('keydown', {key:'Enter'})` directly confirmed the app's own handler works correctly. Recorded here so it isn't rediscovered and mis-reported as a real bug later.

## 2. Security issues found

All of these were found by reading the actual route code, not assumed:

| Issue | Where | Severity | Status |
|---|---|---|---|
| Account enumeration via distinct login error messages ("No account found" vs "Incorrect password") | `api/auth/login` | Medium | **Fixed** |
| No brute-force protection on login at all | `api/auth/login` | Medium | **Fixed** |
| Internal error messages (`err.message`) leaked to the client on 500s | `api/auth/login`, `api/auth/signup`, `api/progress`, `api/health` | Medium | **Fixed** |
| `/api/health` exposed DB schema/error details to **any unauthenticated caller**, in production | `api/health` | Medium | **Fixed** (also disabled outright in production) |
| No input validation/size limits on `/api/progress` — a value of the wrong type, or an arbitrarily large payload, was accepted | `api/progress` | Medium | **Fixed** |
| No security headers at all (clickjacking, MIME-sniffing, referrer leakage) | whole app | Low–Medium | **Fixed** (baseline headers added; CSP deliberately deferred, see §9) |
| bcrypt cost factor 10, minimum password length 6 | `api/auth/signup` | Low | **Fixed** (cost 12, minimum 8) |
| DB TLS uses `rejectUnauthorized: false` (encrypts but doesn't verify the server certificate) | `lib/db.js` | Low–Medium | **Flagged, not changed** — see §9, this needs verification against the real production `DATABASE_URL`, which I don't have access to, before flipping it |
| JWT sessions have no server-side revocation — logout only clears the cookie; a stolen token stays valid until its 7-day expiry | `lib/auth.js` | Low (accepted) | **Not fixed** — real fix needs a session store/blacklist, which is a bigger change than this phase's scope allows; flagged as a residual risk in §9 |

Reviewed and found **adequate, no change made**: SQL injection (all queries parameterized, verified by grep), CORS (no headers set anywhere, so browsers apply same-origin restrictions by default), CSRF (`sameSite: lax` cookie blocks cross-site POSTs, adequate for a JSON API with no destructive GETs).

## 3. Progress/concurrency findings

**The exact scenario asked for was reproduced for real, against the real API and a real database, before any fix was applied:**

1. Tab A and Tab B both `GET /api/progress` (same state).
2. Tab A writes a new key, `POST /api/progress` → 200.
3. Tab B writes a *different* key, based on its now-stale read → **200** (before the fix).
4. Final state: **Tab A's key was silently gone.** Both requests returned success; nothing told either tab data was lost.

Root cause: the old `POST` handler did `INSERT ... ON CONFLICT DO UPDATE SET data = $2` — an unconditional whole-blob replace with no concept of "based on what version."

**Fix implemented** (optimistic locking — the least invasive of the four options the brief listed):
- Added a `version` integer column to `progress` (additive migration, `ALTER TABLE ... ADD COLUMN IF NOT EXISTS`, defaults existing rows to `1` — zero impact on existing data).
- `GET /api/progress` now also returns `version`.
- `POST /api/progress` requires the `version` the client last read and does `... DO UPDATE ... WHERE progress.version = $3 RETURNING version`. If another write already happened, zero rows come back and the client gets **409** plus the current server state.
- `useProgress.js`'s `commit()` now retries on 409: re-applies the *same intended change* (not a stale snapshot) on top of the fresh state, up to 3 attempts, before giving up and telling the user to refresh.

**Re-ran the identical scenario after the fix**: Tab A → 200 (v1→v2). Tab B (stale v1) → **409**, not 200. Tab B retries with the fresh state → 200 (v2→v3). Final state has **both** keys.

**Automated test added**: [scripts/test-concurrency.mjs](scripts/test-concurrency.mjs) (`npm run test:concurrency`) — black-box test against a running app + real DB, signs up a disposable user, runs the exact Tab A/Tab B sequence, asserts the stale write gets 409 and the retry reconciles both changes. Ran it successfully multiple times during this phase.

## 4. Content issues found

- **The exact gap the brief's own HashMap example predicted, found in `java-core`'s "Collections Framework" subtopic**: it taught List/Set/Map and Big-O trade-offs, but not hashCode()/equals() contract, bucket/collision mechanics, or common HashMap mistakes — despite the roadmap's own Interview Q&A bank already asking about hash collisions. **Fixed**: added 3 concept bullets (hash/bucket mechanics, collision handling, when-to-use/common mistakes), 2 checklist items, 1 new practice task, and a new quiz question specifically testing collision-handling understanding (not just "which collection is O(1)").
- **Validator gaps, now closed** (see §5 for the self-test that proves each one actually fires, not just passes trivially):
  - Circular prerequisite chains (none exist in the real content — verified by fixing a genuine bug in the detector itself, see §1).
  - Malformed estimated-time strings.
  - Broken/empty phase projects and capstones.
  - Duplicate quiz answer options and duplicate quiz question text within a topic.
- **Scope limitation, stated plainly**: I did **not** manually re-audit all 45 topics against the full WHY/WHAT/HOW/PRACTICE/VERIFY/APPLY framework at HashMap-level depth — that's a multi-day content-writing effort on its own, not a verification pass. What I did do: ran the extended validator (structural correctness) across all 45, and did a targeted deep-dive on the one topic the brief used as its own worked example, fixing the specific gap it named. I'm not claiming the other 44 have no analogous gaps — a full content audit is the honest next step (see §10), not something completed here.
- Spot-checked AI-track quiz questions for the same understanding-vs-memorization concern the brief raised — they're already framed as "why does X happen" / "what's the mechanism," not term-recall, consistent with the Java-track quizzes. No changes made there.

## 5. Recommendation-engine findings

Tested `recommendNextTopic()` against all 5 required scenarios using a script that runs the real function against synthetic progress data (not guessed at):

| Scenario | Result |
|---|---|
| Fresh user | Recommends the very first topic, reason "Start of your roadmap." |
| Partially-completed (mid-topic) | Recommends continuing that exact topic — "Continue where you left off in..." |
| **Skipped prerequisites** (completed `rest` without `spring`/`jpa`) | Does **not** treat the out-of-order completion as progress — still recommends the actual first gap (`java-fundamentals`), correctly ignoring topics whose prerequisites weren't met |
| Nearly-completed (29/30 topics done) | Recommends the one remaining topic, with the correct "because you completed X, Y" reason |
| Completely completed | Returns `null` (dashboard/roadmap pages already handle this as "roadmap complete") |

All 5 passed. The reasoning also matches the brief's exact requested format — verified live in the browser, not just in the script: after completing "Java Fundamentals," the dashboard showed *"Recommended because you've completed Java Fundamentals — Syntax & OOP Basics"* against the real topic title, computed from real progress, not a canned string.

## 6. Fixes implemented

- Optimistic-locked, atomic `progress` writes with client-side retry-and-reapply (§3).
- Login: generic error message, timing-safe dummy-hash comparison, DB-backed brute-force lockout (5 attempts → 15 min), no internal error leakage.
- Signup: bcrypt cost 12, 8-char minimum password, input length caps, no internal error leakage.
- `/api/progress`: type/shape validation on every field, 256KB payload cap, no internal error leakage.
- `/api/health`: no internal error leakage, disabled entirely (404) in production.
- Baseline security headers (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, `Strict-Transport-Security`) via `next.config.mjs`.
- `MotionConfig reducedMotion="user"` added to the root layout — Framer Motion animations (which the CSS `prefers-reduced-motion` rule never reached) now honor the OS setting too.
- Job-readiness checklist reframed: title changed from "Job-Readiness Checklist" to "Learning Readiness Checklist," split into **Learning areas completed** / **Recommended areas to strengthen**, disclaimer strengthened to explicitly say it doesn't predict employment.
- Content validator extended: circular-prerequisite detection, estimated-time format check, broken phase-project/capstone check, duplicate quiz option/question check — each proven to actually fire against deliberately-broken data, not just assumed to work.
- `java-core`'s Collections Framework subtopic deepened per the HashMap gap found in §4.
- `scripts/test-concurrency.mjs` + `npm run test:concurrency` added.

## 7. Tests performed

All of the following were run for real, against a real local Postgres 17 instance (isolated data directory + dedicated `learnit_test` database created specifically for this — never touched the machine's existing Postgres service or its data) and a real running Next.js instance:

- Full browser E2E: signup → career selection (Java) → roadmap → dashboard → topic page → checked real practice questions and checklist items → answered a real quiz question → **refreshed the page and confirmed every piece of progress survived** → returned to dashboard and confirmed questions-solved count, % complete, and milestone progress all updated correctly → completed a full topic and confirmed the recommendation engine correctly advanced to the next topic with the correct "because you completed X" reason → switched to AI Engineer and confirmed its roadmap renders correctly with independent, unaffected progress (Java progress verified still intact in the database after the switch) → logged out → confirmed protected routes (`/dashboard`, `/roadmap/*`, `/topic/*`, `/checklist/*`) redirect to `/login` → logged back in and confirmed the correct last-selected career and progress reloaded.
- Repeated on a 375×812 mobile viewport: dashboard, topic page (including the two-column checklist/practice layout collapsing to one column), and the quiz block — all functional, no overflow, hamburger nav opens/closes correctly.
- Concurrency: the exact Tab A/Tab B lost-update scenario, both before and after the fix (§3), plus the automated regression test.
- Security: verified account-enumeration fix and brute-force lockout live via direct API calls (5 failed attempts → 429, correct password also rejected while locked, unlocks after clearing the DB lockout column). Verified oversized-payload (413), malformed-JSON (400), and invalid-value-type (400) rejections live. Verified security headers are actually present on real HTTP responses **in a true production build** (`next build && next start`), not just inferred from config. Verified `/api/health` is reachable in dev and returns 404 in a true production build.
- Content validator: proved each new check actually fires by deliberately breaking real in-memory data (broken prerequisite, circular prerequisite, malformed time, duplicate quiz options) and confirming the validator reports each one with a clear message, then confirmed real content still passes with zero errors.
- Recommendation engine: all 5 required scenarios (§5), via a script exercising the real `recommendNextTopic()` function.
- Accessibility: real Tab-key traversal confirmed visible focus outlines on custom `role="button"` rows (not just form inputs); confirmed via direct event dispatch that Enter/Space activation works; confirmed (by code inspection — `grep` found zero uses of `useReducedMotion`/`MotionConfig` before this phase) that Framer Motion animations didn't honor `prefers-reduced-motion`, and fixed it.
- `npm run validate` and `npm run build`: run repeatedly throughout, clean every time after each change.

## 8. Tests that could not be performed

- **Live production verification is impossible from this environment** — I don't have the real deployed app's `DATABASE_URL`/`JWT_SECRET`/Vercel environment. Everything above was verified against a local, isolated, disposable Postgres instance I created for this session, not the actual production database. The `rejectUnauthorized: false` TLS question (§2) specifically needs to be checked against the real production `DATABASE_URL`, which I couldn't do.
- **A full manual content audit of all 45 topics** against the WHY/WHAT/HOW/PRACTICE/VERIFY/APPLY framework — I audited the validator's structural coverage of all 45, and did a deep, worked example on one (`java-core`), but did not hand-review all 45 at that depth (see §4).
- **CSP (Content-Security-Policy)** was deliberately not added — see §9.
- Cross-browser/cross-device testing (only tested in the one Chromium-based automated browser available in this environment).
- Load/performance testing under real concurrent traffic (the concurrency fix was verified for correctness, not for behavior under high contention volume).

## 9. Remaining risks

- **JWT sessions have no server-side revocation.** Logout clears the cookie client-side, but a copied/stolen token remains valid for up to 7 days. Closing this properly needs a session store or token blacklist — a real architectural addition, out of scope for this hardening pass. Accepted risk; flag if this app ever handles more sensitive data.
- **`rejectUnauthorized: false` on the DB TLS connection** (§2) — encrypts but doesn't verify the DB server's certificate. Left unchanged because I can't verify `{ rejectUnauthorized: true }` won't break the actual production `DATABASE_URL` from here; flipping it blindly risked taking down the live DB connection. **Recommended next step: test `{ rejectUnauthorized: true }` against the real production DATABASE_URL in a safe window, and switch to it if it connects cleanly.**
- **No Content-Security-Policy.** The app currently has no external script/style/image dependencies (self-hosted fonts, no CDN assets), which means a CSP is *writable* — but confirming one doesn't silently break inline styles (React's `style` prop) or the theme-init inline script needs a real visual QA pass across every page, which wasn't done here. Recommended as the next security follow-up, not urgent.
- **Brute-force lockout is per-account, not per-IP.** An attacker can still spray many different email addresses without being rate-limited overall (only each individual targeted account locks after 5 failures). A per-IP layer (e.g., at a reverse proxy or edge middleware) would close this; not added here since it's a bigger architectural piece.
- **Content audit is partial**, as stated in §4 and §8 — treat the other 44 topics as unaudited at HashMap-depth, not confirmed-clean.
- The homepage's own tagline ("Get job-ready") is aspirational marketing copy the user explicitly wrote in the original brief, not a per-user predictive claim — left unchanged, but flagged here since it uses similar language to what was asked to be removed from the *checklist* specifically. Worth a decision from the user on whether it should also change.

## 10. Recommended next phase

In priority order:

1. **Verify and fix the DB TLS certificate validation** against the real production database (§9) — cheapest, highest-value item left.
2. **Full content audit pass**, topic by topic, applying the WHY/WHAT/HOW/PRACTICE/VERIFY/APPLY framework consistently — the `java-core` fix in this phase is the template; the remaining 44 topics haven't been checked at that depth.
3. **Write a CSP**, backed by a real visual QA pass across every page in both light and dark mode.
4. Consider a lightweight per-IP rate limit at the edge (if the hosting platform supports it cheaply) to close the brute-force gap noted in §9.
5. Only after the above: revisit whether server-side session revocation is worth the added complexity for this app's actual risk profile.

---

*Local test database (`learnit_test` on an isolated Postgres 17 instance, port 5433) and `.env.local` were used for all testing in this phase and are not committed — `.env.local` is gitignored, and no credentials appear anywhere in the diff.*
