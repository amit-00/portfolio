---
title: Technical Architecture
order: 3
---

# Technical Architecture

Huddl is a pnpm workspaces monorepo: a Next.js frontend, a Cloudflare
Worker backend built around one Durable Object per room, and a small
shared package for the wire protocol between them.

```
huddl/
├── apps/huddl/            Next.js 16 app, deployed to Cloudflare Workers
│                          via @opennextjs/cloudflare (not Vercel)
├── services/game-service/ Cloudflare Worker: LobbyDurableObject (one DO per room)
└── packages/protocol/     @huddl/protocol — shared wire types, close/error codes

Browser
  -> huddl (Next.js, Cloudflare Worker)
      -> better-auth (Google OAuth) -> D1 (users/sessions) + KV (session cache)
      -> WebSocket -> game-service Worker -> routes to the room's Durable Object
                                                -> LobbyDurableObject (per room)
```

## Why this stack

- **Durable Objects instead of a stateful server process.** A room's
  authoritative state (who's seated, whose turn it is, current timers)
  needs exactly one place that owns it, reachable from every connected
  socket, without a database round-trip on every message. A Durable Object
  gives that for free — Cloudflare routes every request for a given room
  ID to the same object instance, and its in-memory state persists between
  messages without any external store in the hot path.
- **The Next.js app also runs on Cloudflare** (via `@opennextjs/cloudflare`),
  not Vercel — so the auth routes and the game-service Worker can share D1
  and KV bindings directly instead of one side calling the other's API
  over the network.
- **A plugin contract for games, not per-game lobby logic.** The lobby
  engine (seating, host handoff, connection tracking, timers) is entirely
  game-agnostic; a game is one file implementing `GameDefinition`. This
  was a deliberate constraint, not an accident — see
  [Challenges & Solutions](/projects/huddl/challenges).
- **A shared `@huddl/protocol` package** instead of hand-copied types in
  both apps. This wasn't the starting design — it's the result of an early
  mistake; see the note on protocol duplication in
  [Challenges & Solutions](/projects/huddl/challenges).

## The lobby engine: pure state machine, imperative shell

`services/game-service/src/lobby/engine.ts` is a pure state machine: every
handler (`handleJoin`, `handleClientMessage`, `handleDisconnect`,
`handleTimerFired`) takes the current `RootState` plus an `EngineContext`
carrying every impurity the engine needs (clock, RNG, the set of currently
connected player IDs, the game registry) and returns a new state plus a
list of `Effect`s to run (`send`, `broadcast`, `sendSnapshot`, `wipe`). The
engine itself never touches a socket, storage, or `Date.now()` directly.

`LobbyDurableObject` (`lobby-do.ts`) is the imperative shell around it: it
owns the actual WebSockets, storage, and the DO's single alarm, and does
nothing but call into the engine and execute the effects it returns. Two
things fall out of that split for free:
- Every engine handler is trivially unit-testable with a fake clock and RNG
  — no need to spin up a Durable Object to test game logic.
- Games are just another pure module plugged into the same pattern: a
  `GameDefinition` implements `init`, `onMessage`, `onTimer`,
  `onPlayerJoined/Disconnected/Reconnected`, and `snapshotFor`, and the
  lobby engine wraps its effects (namespacing its timers `game:`, wrapping
  its broadcasts as a `game-event`) without knowing anything about what
  the game actually does.

## WebSocket Hibernation and a single alarm

The DO accepts sockets through Cloudflare's **WebSocket Hibernation API**
(`ctx.acceptWebSocket`, `serializeAttachment`/`deserializeAttachment`)
rather than holding them in a plain in-memory map. That lets the object
hibernate — evict from memory — while a room sits idle with open
connections, without dropping them; the player's ID rides on the socket's
serialized attachment and survives the hibernate/wake cycle.

Timers (round countdowns, cleanup after everyone leaves) aren't
`setTimeout` — they're deadlines stored in `RootState.timers` and
reconciled to a **single DO alarm** set to the earliest deadline on every
state commit. One alarm fire can resolve several expired timers at once
(`alarm()` loops over every deadline that's passed), so the object never
holds more than one pending wake-up regardless of how many timers a game
schedules.

## Data model

**Per room (`RootState`, one Durable Object, one storage key):**
- `players: Record<PlayerId, PlayerRecord>` — display name, join time,
  and either a `userId`/`handle` (signed-in) or a `guestId` (guest,
  client-minted, unsigned — an identity hint for reclaiming a seat on
  reload, never a trust boundary)
- `hostId`, `selectedGame`, `playing`
- `game: { name, state } | null` — the active `GameDefinition`'s own
  opaque state; the lobby engine never inspects its shape
- `timers: Record<string, number>` — namespaced `lobby:`/`game:` id →
  epoch-ms deadline

**Per-player snapshots, not shared state.** `snapshotFor(state, playerId)`
is part of the `GameDefinition` contract specifically so a game can hide
information per viewer — Imposter's snapshot resolves the role (crew name
vs. imposter hint) as a function of who's asking, so the secret literally
never serializes into a message the wrong player receives.

## Real-time delivery

One WebSocket per player, upgraded through the `game-service` Worker
straight to their room's Durable Object. Messages are namespaced at the
protocol level — lobby events (join, seat, host change) are flat; a
game's own events are wrapped as `{ type: "game-event", event }` — so the
frontend's top-level reducer only ever has to branch on lobby vs. game,
never on which specific game is running.

On the client, a Zustand store (`createLobbyStore`) owns the socket as a
module-level singleton keyed by room code, so it survives component
remounts and enforces a single connection per (room, tab) via the **Web
Locks API** — a second tab open on the same room is told so rather than
opening a competing socket. A dropped connection reconnects with
exponential backoff (capped, giving up after ~1 minute of failures), and
because the wire protocol has no sequence numbers, the resync story is
simply that the worker always re-sends a full `lobby-state` snapshot on
(re)connect — there's no delta-replay path to get wrong.

## Auth: session validation inside the Durable Object

`better-auth` + `better-auth-cloudflare` runs in the Next.js app, backed
by D1 (Drizzle) as the source of truth for users/sessions and Workers KV
as a secondary cache. The interesting part is what happens on the
WebSocket upgrade, which hits the `game-service` Worker directly — a
separate Worker with its own bindings, not a call back into Next.js:

1. The upgrade request's cookie is parsed for `better-auth.session_token`,
   split into `{token}.{signature}`, and the signature is verified with
   WebCrypto's HMAC-SHA256 `verify` against a secret shared between both
   Workers — so a forged or tampered cookie is rejected without ever
   touching a store.
2. A valid token is looked up in KV first (`{ session, user }` JSON, as
   better-auth's `secondaryStorage` writes it); a KV miss falls back to a
   direct D1 query joining `session` and `user`.
3. No valid session degrades to a **guest** identity, not a rejected
   connection — guests can still join an *existing* room. Creating a room
   is the one action gated behind a real session, enforced by the engine
   (`CLOSE_SIGNIN_REQUIRED`), not by route middleware.

## Design decisions and their tradeoffs

| Decision | Why | Tradeoff accepted |
| --- | --- | --- |
| One Durable Object per room | Single authoritative owner of room state, no external store on the hot path | Room state lives and dies with that one object; no cross-room queries |
| Pure engine / imperative DO shell split | Game and lobby logic unit-testable without spinning up a DO | An extra layer of indirection (state + effects) for every handler |
| Full-snapshot resync instead of sequence numbers | No delta-replay logic to get wrong on reconnect | Every reconnect re-sends the whole current state, not just what changed |
| Session verified inside the Worker (HMAC + KV/D1), not proxied to Next.js | No network hop to authenticate a WS upgrade | The Worker must independently trust the same secret and session schema as the Next.js app |
| Guests allowed to join, gated from creating | Lets a whole group play without everyone making an account | Room ownership always traces to exactly one signed-in creator |
| `@huddl/protocol` as a workspace package | One source of truth for wire types across two independently deployed apps | Any wire change touches a package both sides must rebuild against |

## Known limitations

- No real user-facing observability yet — Sentry catches unhandled
  exceptions and source-maps them, but there's no metrics/tracing layer
  for connection counts, room lifetimes, or message latency.
- Infra is defined in `wrangler.jsonc` per app/service, not a single
  infra-as-code tool — there's no Terraform-style plan/apply step that
  covers D1, KV, and both Workers together.
- Team Auction, the third game named in the README's launch lineup,
  isn't built yet. A fourth game (`tap-race`) exists on the backend but is
  intentionally never exposed to players — it's a minimal fixture that
  exists solely to exercise every hook of the `GameDefinition` contract.

## CI/CD

GitHub Actions runs one shared `checks` job (typecheck, lint, both test
suites, a production build) on every PR and on pushes to `main`/`staging`.
Three separate, path-filtered workflows handle deploys: `game-service` to
production on `main`, `huddl` to production on `main` (via
`@opennextjs/cloudflare`, plus a D1 migration step ahead of the deploy),
and a mirrored staging pipeline for both on the `staging` branch. Deploys
never run ahead of the same typecheck/test steps CI enforces on PRs — the
deploy workflows re-run them rather than trusting a prior green check.
