# PRD.md — The Ledger

## What this is
A personal, multi-user roadmap and daily practice tracker for becoming a full-stack Java developer. It takes the vague goal "become job-ready" and turns it into a structured, checkable path: DSA → Java backend → frontend, broken into phases, topics, subtopics, and individual practice questions, with a project checkpoint after every meaningful chunk.

## Who it's for
- Primary user: me (Anuj), a final-year CS student actively job-hunting for Java Backend roles, using this daily to structure and track prep.
- Secondary users: ~20 people I share this with — other students on a similar path. Each needs their own private, persistent account. This is a personal-scale project, not a commercial product — build for correctness and clarity at ~20 users, not for scale.

## Problem it solves
Scattered prep (random LeetCode, random tutorials, no sense of what's covered vs. missing, no way to see daily consistency) doesn't build confidence or completeness. This app makes the full scope of "full-stack Java developer" explicit and trackable, and turns daily effort into a visible record.

## Goals
1. Lay out the entire roadmap (DSA, Java, Spring, data layer, security, testing, infra, system design, cloud, and frontend/React) with nothing important missing.
2. Every subtopic has real, linked practice questions spanning Easy/Medium/Hard.
3. Every topic ends in a small checkpoint project; every phase ends in a combined project; the whole roadmap ends in one capstone.
4. Progress is saved permanently per user, not per browser/device — sign in anywhere, see the same state.
5. Give a visible sense of daily consistency (an activity/streak view), because consistency is the thing most likely to fail without a nudge.

## Non-goals
- Not building for scale beyond ~20 concurrent users. Don't add infrastructure complexity (queues, caching layers, microservices) for the app itself just because the roadmap teaches those concepts.
- Not a social platform — no public leaderboards, comments, or feeds. Each user's data is private to them.
- Not monetized, no billing, no admin dashboard needed for v1.
- Not mobile-app-native — a responsive website is enough.

## Core features (v1)
- Email/password sign-up and login. Google sign-in as a second option.
- A dashboard showing: overall stats (topics cleared, questions solved, checkpoints hit, overall %), a daily activity grid, and the full roadmap laid out by phase → topic cards.
- A topic detail page: subtopics, each with its practice questions (checkbox, linked question text, platform tag, difficulty badge), and the checkpoint project for that topic.
- Phase-project cards that visually unlock once every topic in that phase is 100% complete.
- A capstone section that unlocks once the entire roadmap (all topics) is complete.
- All progress changes save immediately and persist across devices/sessions.

## Success criteria
- I can sign in from any device and see my exact progress.
- Every question in the roadmap either links to a real problem or is a concrete, doable exercise — nothing vague or generic.
- A new user (one of the ~20) can sign up, and their data never touches or overwrites anyone else's.
- The whole thing feels intentional and well-designed, not like a generic AI-generated template.
