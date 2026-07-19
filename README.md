# The Ledger

A full-stack Java backend learning roadmap and daily practice tracker — DSA to deployment.

**Live:** [learn-it-roan.vercel.app](https://learn-it-roan.vercel.app)

## What it is

The Ledger is a structured, checkbox-driven roadmap for learning backend engineering with Java: 8 phases, 30 topics, and 500+ real practice questions — covering DSA and algorithms, Java fundamentals, SQL/JPA/NoSQL, Spring Boot and REST, security and testing, Docker/Kubernetes/CI-CD, system design, and a React/TypeScript frontend layer to close the loop.

Every subtopic opens with a short "what to learn" primer before the practice questions, so it reads as *learn → then practice*, not just a pile of links. Every question links to a real, verified problem (LeetCode, HackerRank, or a real article) — nothing invented. Progress is saved per-account and rendered as a GitHub-style daily activity ledger.

## Features

- Email/password authentication with httpOnly JWT session cookies (`bcryptjs` + `jsonwebtoken`)
- Per-user progress tracking, persisted to Postgres, with a daily activity heatmap
- 30 topics across 8 phases, each with concept primers, a practice-question checklist, and a checkpoint project
- Dedicated reference pages: Algorithm List, Backend Topics, Networking, Interview Q&A, and a LeetCode-only bank view
- Light/dark mode
- A public landing page with a "who's this for" pitch, separate from the logged-in tracker
- Responsive layout, from mobile up

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
  api/progress/         progress read/write
  dashboard/            the logged-in tracker
  topic/[id]/            topic detail (subtopics, checklist, questions)
  leetcode/, algorithms/, backend-topics/, networking/, interview-questions/
                        standalone reference pages
components/           shared client components (theme toggle, question row, progress hook)
lib/                  roadmap content (topics.js), db access, auth helpers
```

## Scripts

| Command         | Description                  |
| ---------------- | ----------------------------- |
| `npm run dev`   | Start the dev server           |
| `npm run build` | Production build               |
| `npm run start` | Run the production build       |
