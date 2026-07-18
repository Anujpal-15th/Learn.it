# Prompt for Claude Code — paste this in

I've attached six spec documents for a project called **The Ledger** — a full-stack Java learning roadmap and daily practice tracker with real multi-user accounts. Read all six before writing any code:

- **PRD.md** — what this is, who it's for, what "done" looks like
- **Architecture.md** — tech stack, folder structure, database schema, auth flow, and the full roadmap content to implement (all 23 topics)
- **Rules.md** — libraries to use/avoid, error handling, security baseline, and boundaries on what not to do
- **Phases.md** — the exact build order; work through these one at a time, don't skip ahead
- **Design.md** — the full visual system (colors, type, layout, components, motion) — follow this exactly, don't substitute your own default design direction
- **Memory.md** — currently empty. Update it yourself at the end of every phase per the format inside it, so progress survives across sessions/context resets.

## What to do
1. Read all six docs fully.
2. Ask me anything that's genuinely unclear before starting — especially anything structural in Architecture.md or Rules.md you're unsure how to interpret. Don't guess on anything load-bearing.
3. Build through Phases.md in order, one phase at a time. After each phase, tell me it's done, update Memory.md, and briefly say what's next before continuing.
4. When you reach Phase 7, deploy to Vercel and give me the live URL, plus clear step-by-step instructions for the manual setup I need to do on my end (database + environment variables, and Google OAuth credentials if you implemented Phase 6) — assume I don't already know how, walk me through it.

Start with Phase 1.
