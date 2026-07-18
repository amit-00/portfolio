---
title: Technical Architecture
order: 3
---

# Technical Architecture

Huddl is a pnpm workspaces monorepo with three parts: a Next.js frontend,
a Cloudflare Worker backend built around one Durable Object per room, and
a small shared package for the wire protocol between them.

```
huddl/
├── apps/huddl/            Next.js 16 app, deployed to Cloudflare Workers
│                          via @opennextjs/cloudflare
├── services/game-service/ Cloudflare Worker: LobbyDurableObject (one DO per room)
└── packages/protocol/     @huddl/protocol, shared wire types and close/error codes

Browser
  -> huddl (Next.js, Cloudflare Worker)
      -> better-auth (Google OAuth) -> D1 (users/sessions) + KV (session cache)
      -> WebSocket -> game-service Worker -> routes to the room's Durable Object
                                                -> LobbyDurableObject (per room)
```

## Why Durable Objects

A room's state (who's seated, whose turn it is, current timers) needs
exactly one place that owns it, reachable from every connected socket,
without a database round-trip on every message. I needed to spin up
isolated websocket instances that could hold state and keep it consistent
with the connected clients, and
[Durable Objects](https://developers.cloudflare.com/durable-objects/) are
designed for exactly this. Cloudflare routes every request for a given
room ID to the same object instance, and everything in it runs on a
single thread. There's no distributed locking or conflict resolution to
write, race conditions simply don't happen.

![Durable Object Architecture](/huddl/durable_object_arch.png)
> All durable objects are single-threaded with compute and storage in the same thread.

That consistency fits the use case well. We care more that the game state
appears the same for all connected players than we care that players stay
connected. A network drop can be handled gracefully in the game logic
itself, depending on the rules of the game.

The tradeoff is location. A Durable Object is spun up in the region
closest to where the creation request was made, and it stays there. Most
rooms will be friends or family in the same part of the world, but a
player connecting from far away will see some extra latency.

## One cloud, not two

`apps/huddl` originally deployed to Vercel while `game-service` ran on
Cloudflare Workers. Two platforms meant no shared bindings, so the
Next.js app couldn't touch the same storage the game Worker could. Adding
auth forced the issue: better-auth needs a database for users and
sessions plus a fast cache for session reads, which map naturally onto
[D1](https://developers.cloudflare.com/d1/) (SQLite) and
[KV](https://developers.cloudflare.com/kv/). The cleanest way to get
those bindings into the Next.js app was to run it on Cloudflare too, so
the frontend moved to
[`@opennextjs/cloudflare`](https://opennext.js.org/cloudflare), which
compiles the Next.js build into a Worker. Both apps have lived on one
platform since.

![Multi Cloud architecture](/huddl/multi_cloud.png)
> **Before**: multi-cloud, no shared bindings between the two apps

![Single Cloud architecture](/huddl/single_cloud.png)
> **After**: single cloud, both apps with direct access to D1 and KV

## The four layers

The backend is a layered architecture, clearly separating
responsibilities at every layer. The layers communicate with each other
through a small custom protocol.

**Layer 1: Worker entry.** A thin router that forwards WebSocket upgrade
requests to the right Durable Object. This is the entry point to the
lobby and handles assigning clients to the correct socket.

**Layer 2: The Durable Object shell.** `LobbyDurableObject`
(`lobby-do.ts`) is the base of the runtime. It manages client
connections, guards against abusive ones, interfaces with the storage
API, and handles the event loop (alarms, WebSocket events). It does
nothing but call into the engine and execute the effects the engine
returns.

**Layer 3: The lobby engine.** `engine.ts` is a pure state machine
holding the root state for the lobby (players, hostId, selectedGame,
timers, game state). Every handler (`handleJoin`, `handleClientMessage`,
`handleDisconnect`, `handleTimerFired`) takes the current `RootState`
plus an `EngineContext` carrying every impurity the engine needs (clock,
RNG, the connected player IDs, the game registry) and returns a new state
plus a list of effects to run (`send`, `broadcast`, `sendSnapshot`,
`wipe`). The engine never touches a socket, storage, or `Date.now()`
directly. It owns everything that is lobby-level rather than game-level:
join and identity rules, reassigning the host when the host disconnects,
and cleanup when a room empties out.

**Layer 4: The game.** Games follow the
[strategy pattern](https://refactoring.guru/design-patterns/strategy). A
game is one pure module implementing the `GameDefinition` interface
(`init`, `onMessage`, `onTimer`, `onPlayerJoined/Disconnected/Reconnected`,
`snapshotFor`), and the engine runs it through that interface without
knowing its internal implementation. Games never see sockets, storage,
or lobby state. A game only touches its own state and talks to the lobby
through effects:

```typescript
type GameEffect =
  | { kind: "broadcast"; event: unknown }
  | { kind: "send"; to: PlayerId; event: unknown }
  | { kind: "setTimer"; id: string; at: number }
  | { kind: "clearTimer"; id: string }
  | { kind: "end"; summary: unknown };
```

The engine wraps those effects on the way out, namespacing the game's
timers as `game:` and wrapping its broadcasts as a `game-event`, so it
never needs to know what the game actually does.

![Layered architecture design](/huddl/engine_layers.png)

Two things fall out of this split for free:

- Every engine handler is unit-testable with a fake clock and RNG. No
  need to spin up a Durable Object to test game logic.
- Adding a game means adding one file that implements `GameDefinition`.
  The lobby code doesn't change.

## WebSocket Hibernation and a single alarm

The DO accepts sockets through Cloudflare's WebSocket Hibernation API
(`ctx.acceptWebSocket` with `serializeAttachment`/`deserializeAttachment`)
instead of holding them in an in-memory map. That lets the object
hibernate, meaning it gets evicted from memory, while a room sits idle
with open connections. The player's ID rides on the socket's serialized
attachment, so it survives the hibernate and wake cycle.

Timers (round countdowns, cleanup after everyone leaves) aren't
`setTimeout` calls. They're deadlines stored in `RootState.timers`,
reconciled to a single DO alarm set to the earliest deadline on every
state commit. One alarm fire can resolve several expired timers at once,
so the object never holds more than one pending wake-up no matter how
many timers a game schedules.

## Data model

**Per room (`RootState`, one Durable Object, one storage key):**

- `players`: display name, join time, and either a `userId`/`handle` for
  signed-in players or a `guestId` for guests. The guest ID is
  client-minted and unsigned. It's a hint for reclaiming a seat on
  reload, never a trust boundary.
- `hostId`, `selectedGame`, `playing`
- `game`: the active game's own opaque state. The lobby engine never
  inspects its shape.
- `timers`: namespaced `lobby:`/`game:` IDs mapped to epoch-ms deadlines.

Snapshots are per player, not shared. `snapshotFor(state, playerId)` is
part of the `GameDefinition` contract specifically so a game can hide
information per viewer. Imposter's snapshot resolves the role (crew name
vs. imposter hint) based on who's asking, so the secret never serializes
into a message the wrong player receives.

## Real-time delivery

One WebSocket per player, upgraded through the `game-service` Worker
straight to the room's Durable Object. Messages are namespaced at the
protocol level: lobby events (join, seat, host change) are flat, and a
game's own events are wrapped as `{ type: "game-event", event }`. The
frontend's top-level reducer only ever branches on lobby vs. game, never
on which specific game is running.

On the client, a Zustand store (`createLobbyStore`) owns the socket as a
module-level singleton keyed by room code, so it survives component
remounts. The Web Locks API enforces a single connection per room per
tab, so a second tab open on the same room is told so instead of opening
a competing socket. A dropped connection reconnects with exponential
backoff, capped, giving up after about a minute of failures. The wire
protocol has no sequence numbers. The resync story is that the worker
always re-sends a full `lobby-state` snapshot on connect and reconnect,
so there's no delta-replay path to get wrong.

## Auth: session verification inside the Worker

`better-auth` + `better-auth-cloudflare` runs in the Next.js app, backed
by D1 (through Drizzle) as the source of truth for users and sessions,
with Workers KV as a session cache. The interesting part is the
WebSocket upgrade, which hits the `game-service` Worker directly. That's
a separate Worker with its own bindings, and the obvious approach would
be to call an API route on the app and ask "is this session valid?". But
that adds a network hop to every single connection attempt, and it makes
the game runtime depend on the frontend being reachable at all.

Instead, the Worker verifies the session itself, in three steps:

1. **Read the cookie.** The upgrade request carries
   `better-auth.session_token`, whose value is the token plus an
   HMAC-SHA256 signature of it.
2. **Check the signature locally.** WebCrypto verifies the HMAC against
   `BETTER_AUTH_SECRET`, a secret both Workers share. A forged or
   tampered cookie dies here without any storage read.
3. **Look up the session.** KV first, since it's the fast path. KV is
   eventually consistent though, so a miss falls back to a single D1
   query joining the session and user tables, the source of truth.

![Session verification flow](/huddl/auth_flow.png)
> **Session Verification Flow**: the upgrade request path

An invalid or missing session doesn't reject the connection. It degrades
to a guest identity, since joining an existing room shouldn't require an
account. Creating a room is the one action gated behind a real session,
and that gate lives in the lobby engine's join logic
(`CLOSE_SIGNIN_REQUIRED`), not in route middleware.

## Design decisions and their tradeoffs

| Decision | Why | Tradeoff accepted |
| --- | --- | --- |
| One Durable Object per room | Single authoritative owner of room state, no external store on the hot path | Room state lives and dies with that one object, and no cross-room queries |
| Pure engine / imperative DO shell split | Game and lobby logic unit-testable without spinning up a DO | An extra layer of indirection (state + effects) for every handler |
| Full-snapshot resync instead of sequence numbers | No delta-replay logic to get wrong on reconnect | Every reconnect re-sends the whole current state, not just what changed |
| Session verified inside the Worker (HMAC + KV/D1), not proxied to Next.js | No network hop to authenticate a WS upgrade | The Worker depends on better-auth internals: the cookie format, the signature scheme, the shape of what lands in KV |
| Guests allowed to join, gated from creating | Lets a whole group play without everyone making an account | Room ownership always traces to exactly one signed-in creator |
| `@huddl/protocol` as a workspace package | One source of truth for wire types across two independently deployed apps | Any wire change touches a package both sides must rebuild against |

## Known limitations

- No real user-facing observability yet. Sentry catches unhandled
  exceptions and source-maps them, but there's no metrics or tracing
  layer for connection counts, room lifetimes, or message latency.
- Infra is defined in `wrangler.jsonc` per app/service, not a single
  infra-as-code tool. There's no Terraform-style plan/apply step that
  covers D1, KV, and both Workers together.
- Team Auction, the third game named in the README's launch lineup,
  isn't built yet. A fourth game (`tap-race`) exists on the backend but
  is intentionally never exposed to players. It's a minimal fixture that
  exists solely to exercise every hook of the `GameDefinition` contract.

## CI/CD

GitHub Actions runs one shared `checks` job (typecheck, lint, both test
suites, a production build) on every PR and on pushes to
`main`/`staging`. Three separate, path-filtered workflows handle
deploys: `game-service` to production on `main`, `huddl` to production
on `main` (via `@opennextjs/cloudflare`, plus a D1 migration step ahead
of the deploy), and a mirrored staging pipeline for both on the
`staging` branch. The deploy workflows re-run the same typecheck and
test steps rather than trusting a prior green check.

One detail worth calling out: `wrangler types` generates the `Env`
interface for each Worker, but it only includes secrets like
`BETTER_AUTH_SECRET` if a `.dev.vars` file exists when it runs. Real
secrets never touch CI, so each Worker commits a `.dev.vars.example`
with placeholder values, and CI copies it into place before generating
types and typechecking. The secret names type-check, and the secret
values stay out of the repo.
