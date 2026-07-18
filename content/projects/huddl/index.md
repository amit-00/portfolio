---
title: Huddl
---

# Huddl — Live Party Games for the Group Chat

Huddl is a web app for sports-themed party games: gather your group, open a
room code, and play together from your phones — no app install, no sign-up
required to join.

![Huddl](/huddl/home.png)

**Live:** [huddl.gg](https://huddl.gg) · **Source:** private repository

## Role

Solo project — designed and built end-to-end over 85 commits in 17 days
(Jul 1–17, 2026): the Next.js frontend, the Cloudflare Worker lobby backend
(Durable Objects), the shared wire-protocol package, Google auth, and the
CI/CD pipeline that deploys all of it.

## Tech stack

**Frontend** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · Zustand
**Backend** Cloudflare Workers · Durable Objects (WebSocket Hibernation API)
**Auth** better-auth + better-auth-cloudflare · Google OAuth · D1 (Drizzle ORM) · Workers KV
**Realtime** Raw WebSockets, one Durable Object per room
**Infra** pnpm workspaces monorepo · `@opennextjs/cloudflare` · GitHub Actions · Sentry

## What's documented here

- [Problem & Motivation](/projects/huddl/problem) — what this is solving and for whom
- [Solution & Features](/projects/huddl/solution) — what it does
- [Technical Architecture](/projects/huddl/architecture) — how it's built, and why
- [Challenges & Solutions](/projects/huddl/challenges) — the hardest problems and how I solved them
- [Results & Impact](/projects/huddl/results) — what shipped, what I learned, what's next
