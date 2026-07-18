---
title: Challenges & Solutions
order: 4
---

# Challenges & Solutions

Four problems that didn't have an obvious answer, and why I chose the
approach I did over the alternatives I considered.

## 1. Adding a game without touching the lobby

**The problem:** Imposter and Wavelength don't just look different — they
have completely different round structures, different numbers of phases,
different scoring, different secret information. If the lobby (seating,
host handoff, timers, connection tracking) knows anything specific about
either game, every new game means editing code that every *other* game
also depends on, and the blast radius of a bug only grows from there.

**What I considered and rejected:**
- *One big handler with a switch on the active game* — the obvious first
  draft, but it means the lobby's core files grow by one branch per game
  forever, and a bug in Wavelength's branch can be shipped inside the same
  file — and same deploy — as Imposter's working code.
- *A separate Durable Object class per game* — isolates games completely,
  but throws away everything they actually share (seating, host handoff,
  connection tracking, the reconnect story), duplicating all of it per
  game instead of once.

**What I built:** A fixed `GameDefinition` contract (`init`, `onMessage`,
`onTimer`, `onPlayerJoined/Disconnected/Reconnected`, `snapshotFor`) that
every game implements as one pure module, registered in one map
(`GAMES`). The lobby engine calls into whichever `GameDefinition` is
active without ever branching on *which* game it is — it just namespaces
that game's timers and wraps its broadcasts. I proved the contract was
actually game-agnostic by building `tap-race`, a deliberately trivial
"everyone taps until the timer runs out" game whose only purpose is to
exercise every hook — if the contract were subtly shaped around Imposter's
needs, a second real game (Wavelength) plus this synthetic one would have
found the gap.

## 2. React StrictMode turning one connection into two

**The problem:** StrictMode intentionally mounts an effect, unmounts it,
and re-mounts it, in the same tick, in development. A lobby WebSocket
connection opened naively in a `useEffect` opens *twice* under that
pattern — `connect()` → `disconnect()` → `connect()` — but the two
`navigator.locks.request()` calls that each `connect()` fires are both
async, so the second one can fire before the first has resolved, and both
can end up believing they legitimately own the connection.

**What I considered and rejected:**
- *Disable StrictMode* — makes the symptom disappear without fixing the
  actual bug, which is that the connection logic wasn't safe against rapid
  remounts to begin with — a real double-tab-open by a user would hit the
  same race in production.

**What I built:** The lock *request* itself (not just its outcome) is
memoized in a variable that outlives any single `connect()`/`disconnect()`
call, and the reaction to the lock being granted is attached exactly once,
to that request, rather than re-attached on every `connect()`. A
remounting effect's second `connect()` reuses the exact same in-flight
lock request instead of racing a second one — so there's structurally only
ever one `navigator.locks.request()` in flight per lobby, no matter how
many times an effect remounts in the same tick. This turned a
development-only annoyance into a real single-tab-per-room guarantee: a
user who genuinely opens the same room in two tabs now gets a clear
"already open in another tab" message instead of two competing sockets.

## 3. Keeping idle rooms cheap without losing their connections

**The problem:** A room can sit open with people connected but nothing
happening — between rounds, while someone reads the rules. A Durable
Object holding raw WebSocket references in memory has to stay resident
(and billed) the entire time just to keep those sockets alive, even though
there's no work to do.

**What I considered and rejected:**
- *Just accept the cost* — for a single Durable Object per room, an idle
  room that nobody explicitly closes is a hibernation problem, not a
  request-volume problem — normal request-based billing intuition doesn't
  save you here if the object can never actually go idle.

**What I built:** Sockets are accepted through Cloudflare's WebSocket
**Hibernation API** (`ctx.acceptWebSocket` plus
`serializeAttachment`/`deserializeAttachment` instead of an in-memory
`Map<PlayerId, WebSocket>`), which lets the runtime evict the object from
memory while idle connections stay open, and wake it back up on the next
message with the player's identity restored from the socket's serialized
attachment. Timers ride the same discipline: every deadline is data in
`RootState.timers`, reconciled to a **single** DO alarm set to the
earliest one on every commit, rather than one `setTimeout` per timer —
which would itself have pinned the object in memory the whole time,
defeating the point of hibernating in the first place.

## 4. Getting the protocol package boundary wrong the first time

**The problem:** The wire protocol (message shapes, close/error codes)
started as a duplicated `protocol.ts` file, hand-copied between the
frontend and the backend, which is exactly the kind of drift risk a
shared package exists to prevent. That much was obvious early. What
*wasn't* obvious until I'd actually done it: when Wavelength shipped, I
put its wire types in a new package, `@huddl/game-protocol`, reasoning
that "core lobby protocol" and "per-game protocol" were different
concerns that deserved different packages.

**What I considered and rejected:**
- *Leave `@huddl/game-protocol` as its own package and add a third one for
  the next game* — the split looked principled on paper (lobby concerns
  vs. game concerns), but in practice every game already needs *both*
  halves together on both sides of the wire, so the extra package
  boundary bought type-organization purity and nothing else — it was
  overhead pretending to be architecture.

**What I built:** Consolidated `@huddl/game-protocol` back into
`@huddl/protocol` almost immediately, as a subpath export
(`@huddl/protocol/wavelength`) rather than a separate package — so a new
game adds one file under the same package instead of a new workspace
entry, and there's exactly one place, not a growing number of small
packages, where "what can travel over this wire" is defined. The fix
shipped as its own commit less than a day after the split that caused it —
worth keeping in the record as the actual shape of how this decision got
made, rather than writing the docs as if `@huddl/protocol/wavelength` were
the first idea.
