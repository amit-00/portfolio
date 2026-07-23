---
title: Results & Impact
order: 5
---

# Results & Impact

## Where it stands

Huddl is live at [huddl.gg](https://huddl.gg), running two full games
(Player Imposter and Wavelength) end to end: Google sign-in, room
creation, guest joins, real-time lobby and gameplay over WebSockets, and
reconnect handling, all served from Cloudflare Workers with Durable
Objects backing each room. It shipped as a solo project in 85 commits
over 17 days (Jul 1–17, 2026).

The backend and frontend test suites are both green: 203 tests across 14
files in `game-service` (including full Imposter and Wavelength flow
tests through the lobby Durable Object, not just isolated unit tests)
and 84 tests across 8 files in the frontend, 287 passing tests total.
They run in CI on every PR before either app is allowed to deploy.

## What I learned

- **A plugin contract only proves itself once something un-special uses
  it.** Imposter alone couldn't tell me whether `GameDefinition` was a
  real abstraction or just "what Imposter happens to need." Wavelength
  stress-tested it with a real second game is what actually
  gave me confidence the lobby engine doesn't secretly know anything
  about any particular game.
- **StrictMode races are a preview of real double-tab races, not a
  development-only nuisance.** Fixing the WebSocket store to survive
  StrictMode's mount/unmount/remount properly is the same fix as making
  it survive a user genuinely opening the same room in two tabs.
  Treating the dev-mode symptom as the whole problem would have shipped
  a real bug.
- **Hibernation changes what "keep this connection alive" has to mean.**
  Reaching for an in-memory `Map` of live sockets is the natural first
  instinct and would have worked, right up until it silently pinned
  every Durable Object with an open connection in memory, permanently,
  which defeats the entire cost model Durable Objects are supposed to
  offer.

## What I'd do next

In rough priority order:

1. **Ship Team Auction**, the third game named in the README's launch
   lineup. Imposter and Wavelength shipped; this one hasn't started yet.
2. **Move sessions to JWT.** Today the game Worker verifies a session
   cookie's HMAC and then looks it up in KV or D1. JWT-based sessions
   would remove the storage lookup entirely. The tradeoff is losing the
   ability to revoke a session, but for an app with non-critical data
   the reduced complexity seems worth it.
3. **Add real observability.** Sentry catches unhandled exceptions
   today, but there's no metric for how many rooms are live, how long
   they last, or message latency. This is the same gap PulseFM had, and
   the same fix: wire it in from the start on the next project rather
   than as a follow-up.
4. **Formalize infra-as-code across both Workers.** Each app's
   Cloudflare resources (D1, KV, the Worker itself) live in its own
   `wrangler.jsonc`. There's no single plan/apply step that provisions
   all of it together the way Terraform does for a multi-service system.
5. **Add lobby config.** Right now rooms can only be configured for the
   game the host wants to play. I want to extend the configuration to allow
   for the changing of rules, lobby settings, etc
