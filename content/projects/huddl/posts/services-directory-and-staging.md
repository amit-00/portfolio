---
title: "A services/ directory, a real changelog, and staging for the backend"
date: 2026-07-17
excerpt: game-service moves out of apps/ to reflect what it actually is, and the deploy pipeline gets a staging mirror to match the frontend's.
---

# A services/ directory, a real changelog, and staging for the backend

`game-service` had lived under `apps/game-service` since day one, next to
the actual user-facing Next.js app. It's a headless Cloudflare Worker with
no UI of its own — grouping it with `apps/` was a naming leftover from the
very first scaffold, not a statement about what it is. It moved to
`services/game-service`, alongside wherever future backend services end
up, so the top-level layout describes the system instead of its
history.

The same day, `game-service` finally got a staging deploy workflow
mirroring the one `huddl` already had — deploying to
`game-service-staging` on pushes to `staging`. Before this, only the
frontend had a safe pre-production target; a backend change went straight
from a merged PR to production. Small gap, but exactly the kind that's
easy to leave alone until it isn't.

This is also when per-package changelogs (`apps/huddl/CHANGELOG.md`,
`services/game-service/CHANGELOG.md`, `packages/protocol/CHANGELOG.md`,
rolled up into one root `CHANGELOG.md`) started, alongside a repo-wide
`CLAUDE.md` establishing one rule: comments are rare by default, reserved
for a genuinely non-obvious "why," not restating what the code already
says. Most of what's written up across this editorial log and the rest of
these docs is reconstructed from git history for exactly that reason — the
code itself was never going to tell this story on its own.
