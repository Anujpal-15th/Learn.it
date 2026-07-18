# Architecture.md — The Ledger

## Stack
- **Framework:** Next.js 14, App Router, plain JavaScript (no TypeScript)
- **Database:** PostgreSQL, accessed via the `pg` package directly — no ORM. This app's data model is two tables; an ORM adds abstraction we don't need.
- **Auth:** Custom email/password (bcrypt + JWT in an httpOnly cookie) as primary. Google OAuth as a secondary sign-in path (use Auth.js/NextAuth for the Google piece if that's the cleanest way to run both methods side by side — implementer's judgment call, but both must land the user in the same `users` table with the same session shape).
- **Hosting:** Vercel.
- **Styling:** Plain CSS (a single `globals.css` using CSS custom properties for the design tokens defined in Design.md). No Tailwind, no CSS-in-JS library — keep the dependency footprint small.

## Folder structure
```
/app
  /layout.js               — root layout, imports globals.css
  /globals.css
  /page.js                 — dashboard (client component, "use client")
  /login/page.js
  /signup/page.js
  /topic/[id]/page.js       — topic detail view
  /api
    /auth/signup/route.js
    /auth/login/route.js
    /auth/logout/route.js
    /auth/me/route.js
    /auth/google/...        — only if Google OAuth is implemented via custom routes; if using Auth.js, this becomes /api/auth/[...nextauth]/route.js instead
    /progress/route.js       — GET (fetch current user's progress), POST (upsert)
/lib
  /db.js                    — pg Pool singleton + ensureSchema()
  /auth.js                  — signToken, verifyToken, getUserFromRequest
  /topics.js                — the full roadmap content (see Content Data Model below)
/jsconfig.json               — defines "@/*" path alias to project root
/package.json
/next.config.mjs
```

## Data model

**users**
| column | type | notes |
|---|---|---|
| id | serial PK | |
| email | text, unique, not null | lowercased before storing |
| name | text | defaults to the part before @ if not provided |
| password_hash | text, nullable | null if the user only ever signed in via Google |
| created_at | timestamptz | default now() |

**progress**
| column | type | notes |
|---|---|---|
| user_id | integer PK, FK → users(id) on delete cascade | one row per user |
| data | jsonb, not null, default '{}' | shape: `{ progress: { "<topicId>::<subtopicIndex>::<questionIndex>": true }, growth: { "YYYY-MM-DD": <count> } }` |
| updated_at | timestamptz | default now(), updated on every write |

Both tables are created with `CREATE TABLE IF NOT EXISTS` inside `ensureSchema()`, called at the top of every API route that touches the DB — no separate migration step needed at this scale.

## Auth flow
1. Sign up: validate input → hash password → insert user → insert empty progress row → sign JWT → set httpOnly cookie → return user object (never the hash).
2. Log in: look up by email → bcrypt.compare → sign JWT → set cookie.
3. Every authenticated page (`/`, `/topic/[id]`) calls `GET /api/auth/me` on mount; if no valid session, redirect to `/login`.
4. Every mutating API route reads the session cookie via `getUserFromRequest(req)` and rejects with 401 if absent/invalid — never trust a client-supplied user id.
5. Google OAuth (if wired via Auth.js): on successful Google sign-in, find-or-create a row in `users` keyed by email, then treat identically to a normal session from that point on — the rest of the app should not need to know which method was used.

## Progress flow
- Client fetches `GET /api/progress` on page load → gets `{ progress: {...}, growth: {...} }`.
- Every checkbox toggle updates local React state immediately (optimistic UI) and fires `POST /api/progress` with the full updated `data` object in the same shape — simple upsert, no partial-patch logic needed given the small data size.

## Content Data Model
`lib/topics.js` exports three arrays: `TOPICS`, `PHASES`, `PHASE_PROJECTS`.

- `PHASES`: ordered list of `{ name, desc }`, 8 entries (Phase 0 through Phase 7).
- `TOPICS`: 23 entries, each: `{ id, num, phase, title, sub, subtopics, mini }` where `subtopics` is a list of `{ title, q: [{ t: questionText, d: 'E'|'M'|'H', p: platformName, u: urlOrUndefined }] }`, and `mini` is `{ title, desc }` (the checkpoint project).
- `PHASE_PROJECTS`: 8 entries (one per phase), `{ title, desc }`.

Full roadmap content to implement — this is the actual scope, not a placeholder:

**Phase 0 — DSA & Algorithms**
1. DSA I — Foundations → Arrays & Strings / Two Pointers & Sliding Window / Recursion & Basic Math
2. DSA II — Core Data Structures → Linked List / Stack & Queue / Hashing / Sorting & Searching
3. DSA III — Trees, Graphs & DP → Trees & BST / Heaps & Tries / Graphs / Dynamic Programming & Greedy / Backtracking & Bit Manipulation

**Phase 1 — Language & Foundations**
4. Java Core & OOP → Collections Framework / Exception Handling / Streams & Lambdas / Multithreading & Concurrency
5. SOLID & Design Principles → SRP & OCP / Liskov, ISP, DIP / Design Patterns
6. Build Tools — Maven & Gradle → Maven Fundamentals / Gradle Fundamentals
7. Version Control — Git → Branching & Merging / Workflow & History Hygiene

**Phase 2 — Data Layer**
8. Databases & SQL → Core SQL & Joins / Normalization & Schema Design / Transactions, ACID & Indexing
9. Hibernate/JPA → Entities & Relationships / Querying / Lazy vs Eager, N+1, Caching

**Phase 3 — The Framework**
10. Spring Core & Spring Boot → IoC/DI & Bean Lifecycle / Layered Architecture & Config / Exception Handling & Validation
11. REST API Design → HTTP Semantics & Status Codes / DTOs, Versioning & Pagination / Documentation & Contracts

**Phase 4 — Production Hardening**
12. Security → AuthN vs AuthZ / Spring Security & JWT / OAuth2 & CORS
13. Testing → Unit Testing / Integration Testing / TDD & Coverage

**Phase 5 — Scale & Ship**
14. Caching & Messaging → Redis Caching / Message Queues
15. Docker & Containers → Dockerfile Fundamentals / docker-compose & Networking
16. CI/CD & Deployment → GitHub Actions / Deployment & Monitoring

**Phase 6 — Think Like an Architect**
17. System Design Basics → Scalability Concepts / Monoliths, Microservices & Gateways
18. Cloud Fundamentals → Compute & Storage / Managed Databases & Networking

**Phase 7 — Frontend & Full-Stack**
19. HTML, CSS & Responsive Design → Semantic HTML & Accessibility / CSS Layout (Flexbox & Grid) / Responsive Design & Media Queries
20. JavaScript Core & DOM → JS Fundamentals & ES6+ / DOM Manipulation & Events / Async JavaScript
21. TypeScript Fundamentals → Types & Interfaces / Advanced TS
22. React Fundamentals → Components & Props / State & Hooks / Forms & Events
23. React Advanced & State Management → Context API & Global State / Performance / Routing & Data Fetching

For each subtopic: 3-5 real practice questions, Easy/Medium/Hard mix. DSA and SQL subtopics should use genuinely well-known LeetCode problems with correct URLs (e.g. `https://leetcode.com/problems/two-sum/`). Framework/infra subtopics (Spring, Docker, CI/CD, System Design, Security, Testing, build tools, Git) should use concrete hands-on exercises tagged "Build task" instead of invented "problems" — these don't need external links. Each topic gets one checkpoint-project description; each phase gets one phase-project description; write one capstone description separately (full-stack: React frontend + Spring Boot + JPA/Postgres + JWT + Redis + a queue + tests + Docker + CI/CD + a system design doc).
