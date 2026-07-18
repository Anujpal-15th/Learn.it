# Rules.md — Boundaries for the AI

## Libraries — use / avoid
**Use:** `next`, `react`, `react-dom`, `pg`, `bcryptjs`, `jsonwebtoken` (or `Auth.js`/`next-auth` if implementing Google OAuth). Nothing else without a clear reason.

**Avoid:**
- No ORM (Prisma, Drizzle, etc.) — two tables don't need one, and it's one more thing to configure and explain.
- No TypeScript — keep the codebase readable to someone still learning; plain JS with clear naming.
- No CSS framework (Tailwind, Bootstrap, MUI, etc.) — the design is a specific, deliberate black/white system defined in Design.md; a utility framework fights that rather than helping.
- No state management library (Redux, Zustand, etc.) — this app's client state is small enough for plain `useState`/`useEffect`.
- No UI component library (shadcn, MUI, Chakra, etc.) — every component should be hand-built to match Design.md exactly.
- Don't add a testing framework, linter config, or CI pipeline unless asked — this is a personal project, not infra for its own sake.

## Error handling
- Every API route wraps DB/auth logic in try/catch and returns a real, human-readable error message in the JSON body (`{ error: "..." }`) with an appropriate status code — never a bare 500 with no explanation.
- Client-side, every fetch that can fail shows the error inline near the relevant form/action — no silent failures, no console-only errors for anything user-facing.
- Auth errors should be honest but not leak information unnecessarily: "No account found with that email" and "Incorrect password" are fine to distinguish (this isn't a high-security banking app); don't over-engineer generic "invalid credentials" messaging if it makes debugging harder for a personal project.

## Security baseline (non-negotiable even at this scale)
- Passwords are always bcrypt-hashed, never stored or logged in plaintext.
- Session tokens are httpOnly cookies, never stored in localStorage or exposed to client JS.
- Every mutating API route re-derives the user from the session cookie server-side — never trust a user id passed in the request body.
- SQL is always parameterized (`$1`, `$2`, ...) — never string-concatenated, even though this is a low-stakes app.

## What the AI should do
- Ask before making a structural decision that isn't specified here or in Architecture.md (e.g., "should Google OAuth reuse the same JWT cookie or a separate session mechanism?").
- Build and verify one phase at a time per Phases.md, in order — don't jump ahead to later phases even if it seems efficient.
- After finishing each phase, update Memory.md with what was built, what decisions were made, and what's left — see Memory.md for the exact format.
- Keep components and files small and readable over clever or maximally-DRY — this codebase should be easy for a student to read and learn from, not just easy for the AI to generate.
- When in doubt about roadmap content (a question, a project description), match the tone and specificity already established in Architecture.md's content section rather than inventing something generic.

## What the AI should not do
- Don't add features not in PRD.md (no admin panel, no social features, no email notifications, no payment/billing) without being asked first.
- Don't silently change the design direction in Design.md (no swapping in a color accent, a different font pairing, or rounded corners) — if something in Design.md seems hard to implement, flag it and ask rather than substituting your own default.
- Don't scaffold with `create-next-app` defaults and leave boilerplate (default favicon, placeholder Vercel branding, example pages) in the final build — clean it up.
- Don't invent fake LeetCode URLs or platform links — if unsure whether a specific problem/URL is real, use a GeeksforGeeks-style search-query link instead, or mark it as a "Build task" with no link.
- Don't try to provision the database or Google OAuth credentials yourself, and don't guess at API keys or connection strings — these require the human's own accounts. Stop and give clear manual instructions instead.
