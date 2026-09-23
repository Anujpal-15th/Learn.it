# Learn.it

A guided learning platform: tell it what you want to become — **Java Developer** or **AI Engineer** — and it tells you what to learn, what to practice, what to build, and what to do next.

**Live:** [learn-it-roan.vercel.app](https://learn-it-roan.vercel.app)

> Vibe coded — built end to end through conversation, iterated in the open rather than planned upfront.

## Who this is for

Anyone who wants to become a Java backend engineer or an AI engineer and isn't sure what to actually learn, in what order. If you keep asking "what topics do I even need for this?", "am I skipping something important?", or "is there a real syllabus for this instead of 20 scattered YouTube playlists?" — that's exactly the gap Learn.it fills: one concrete, ordered roadmap per career, from the first fundamentals to a deployed, production-shaped project.

## What it is

Learn.it is two structured, checkbox-driven roadmaps:

- **Java Developer** — 28 phases, 37 topics, 500+ real practice questions, grouped into five readiness tiers (Core Java Foundations, Parallel DSA Track, Backend Development, Production & Advanced Backend, System Design & Advanced) plus optional extensions: DSA as an independent parallel track, Java fundamentals and OOP design, SQL/JPA, Spring Boot and REST, production API engineering, security and testing, caching/messaging, Docker/CI-CD/cloud, system design and microservices, and optional NoSQL/Kubernetes/React-TypeScript frontend extensions.
- **AI Engineer** — 13 phases, 15 topics: Python and math foundations, data tooling, classical ML and deep learning, PyTorch, NLP, generative AI/LLMs, RAG, AI agents, frameworks (Hugging Face/LangChain/LangGraph/LlamaIndex/FastAPI), fine-tuning, and MLOps.

The guided layer on top of both roadmaps:

- **Prerequisites** — a soft "recommended prerequisites" notice on a topic if you jump ahead; never blocks access.
- **Recommended next topic** — computed from what you've completed, roadmap order, and prerequisite state, with a plain-English reason.
- **Milestones** — each roadmap's phases shown as a progress track with the current phase always visually obvious.
- **Per-topic quiz** — 5 questions per topic (260 total across both roadmaps), answered inline with immediate correct-answer + explanation.
- **Job-readiness checklist** — per career, a rollup of named skill areas (not a guarantee of employment).
- **Site search** — across topics, subtopics, practice questions, resources, and projects in both roadmaps.

Every subtopic opens with a short "what to learn" primer before the practice questions, so it reads as *learn → then practice*, not just a pile of links. Every practice-question link is a real, verified problem (LeetCode, HackerRank, or a real article) or a concrete build task — nothing invented. Progress is saved per-account and rendered as a GitHub-style daily activity ledger.

## Features

- Email/password authentication with httpOnly JWT session cookies (`bcryptjs` + `jsonwebtoken`)
- Per-user progress tracking, persisted to Postgres, with a daily activity heatmap
- Two full career roadmaps (52 topics total), each with concept primers, a practice-question checklist, a 5-question quiz, and a checkpoint project
- Dedicated reference pages (Java track): Algorithm List, Backend Topics, Networking, Interview Q&A (both tracks), and a LeetCode-only bank view
- Light/dark mode
- A public landing page: headline + exactly two career cards, no marketing clutter
- Responsive layout, from mobile up
- `npm run validate` — a content-integrity check (duplicate/missing/broken ids, invalid difficulty, malformed resources and URLs, orphaned topics) runnable before deployment

## Tech stack

- [Next.js 14](https://nextjs.org/) (App Router, plain JavaScript — no TypeScript)
- [PostgreSQL](https://www.postgresql.org/) via [`pg`](https://node-postgres.com/) (no ORM)
- [`motion`](https://motion.dev/) for animation
- Deployed on [Vercel](https://vercel.com/), database on [Neon](https://neon.tech/)

## Getting started

```bash
git clone https://github.com/Anujpal-15th/Learn.it.git
cd Learn.it
npm install
cp .env.example .env.local   # fill in the values below
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment variables

| Variable       | Required | Description                                                                 |
| -------------- | -------- | ----------------------------------------------------------------------------- |
| `DATABASE_URL` | Yes      | PostgreSQL connection string (e.g. from [Neon](https://neon.tech/))          |
| `JWT_SECRET`   | Yes      | Long random string used to sign session tokens. Generate one with: `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"` |
| `PGSSL`        | No       | Set to `disable` if connecting to a local Postgres instance without SSL       |

The database schema (`users`, `progress` tables) is created automatically on first request — no migration step needed.

## Project structure

```
app/                  Next.js App Router pages + API routes
  api/auth/            login, signup, logout, session ("me")
  api/progress/         progress read/write (progress, growth, meta.selectedCareer)
  dashboard/            personalized hub — continue learning, recommended next, milestones
  roadmap/[career]/      phase-by-phase roadmap browser for one career
  topic/[id]/            topic detail — learn, practice, quiz, checkpoint project
  checklist/[career]/    job-readiness checklist
  search/               site search across both roadmaps
  leetcode/, algorithms/, backend-topics/, networking/, interview-questions/
                        reference pages (interview-questions covers both tracks)
components/           shared client components (theme toggle, question row, quiz block,
                      prerequisite banner, career card, progress hook)
lib/                  roadmap content (topics.js = Java, topics-ai.js = AI Engineer),
                      roadmaps.js (registry), roadmap-meta.js (difficulty/time/prereqs),
                      roadmap-engine.js (status/recommendation/milestones/search),
                      db access, auth helpers
scripts/              validate-content.mjs — content integrity check
```

## Scripts

| Command            | Description                              |
| ------------------ | ----------------------------------------- |
| `npm run dev`      | Start the dev server                      |
| `npm run build`    | Production build                          |
| `npm run start`    | Run the production build                  |
| `npm run validate` | Check both roadmaps for content problems  |
