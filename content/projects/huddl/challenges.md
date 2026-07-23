---
title: Challenges & Solutions
order: 4
---

# Challenges & Solutions

Four problems that didn't have an obvious answer, and why I chose the
approach I did over the alternatives I considered.

## 1. Adding a game without touching the lobby

**The problem:** My first iteration of Imposter was extremely coupled
with the Durable Object itself. It worked for one game, but it would
cause growing pains when adding more. Imposter and Wavelength don't just
look different, they have completely different round structures,
different numbers of phases, different scoring, different secret
information. If the lobby (seating, host handoff, timers, connection
tracking) knows anything specific about either game, every new game
means editing code that every other game also depends on.

**What I considered and rejected:**

- _One big handler with a switch on the active game._ The obvious first
  draft, but the lobby's core files grow by one branch per game forever,
  and a bug in Wavelength's branch ships inside the same file, and same
  deploy, as Imposter's working code.
- _A separate Durable Object class per game._ Isolates games completely,
  but throws away everything they actually share (seating, host handoff,
  connection tracking, the reconnect story) and duplicates all of it per
  game instead of once.

**What I built:** The strategy pattern. A fixed `GameDefinition`
contract (`init`, `onMessage`, `onTimer`,
`onPlayerJoined/Disconnected/Reconnected`, `snapshotFor`) that every
game implements as one pure module, registered in one map (`GAMES`). The
engine runs whichever game is active through that interface without
knowing its internal implementation, and without ever branching on which
game it is. It just namespaces the game's timers and wraps its
broadcasts. I proved the contract was actually game-agnostic by building
`tap-race`, a deliberately trivial "everyone taps until the timer runs
out" game whose only purpose is to exercise every hook. If the contract
were subtly shaped around Imposter's needs, a second real game
(Wavelength) plus this synthetic one would have found the gap.

## 2. React StrictMode turning one connection into two

**The problem:** In development, StrictMode intentionally mounts an
effect, unmounts it, and re-mounts it in the same tick. A lobby
WebSocket connection opened naively in a `useEffect` opens twice under
that pattern: `connect()`, then `disconnect()`, then `connect()` again.
The two `navigator.locks.request()` calls that each `connect()` fires
are both async, so the second one can fire before the first has
resolved, and both can end up believing they legitimately own the
connection.

**What I considered and rejected:**

- _Disable StrictMode._ That makes the symptom disappear without fixing
  the actual bug, which is that the connection logic wasn't safe against
  rapid remounts to begin with. A user really opening the same room in
  two tabs would hit the same race in production.

**What I built:** The lock request itself, not just its outcome, is
memoized in a variable that outlives any single `connect()`/`disconnect()`
call, and the reaction to the lock being granted is attached exactly
once, to that request. A remounting effect's second `connect()` reuses
the same in-flight lock request instead of racing a second one, so there
is structurally only ever one `navigator.locks.request()` in flight per
lobby, no matter how many times an effect remounts. This turned a
development-only annoyance into a real single-tab-per-room guarantee: a
user who genuinely opens the same room in two tabs now gets a clear
"already open in another tab" message instead of two competing sockets.

## 3. Keeping idle rooms cheap without losing their connections

**The problem:** A room can sit open with people connected but nothing
happening, between rounds or while someone reads the rules. A Durable
Object holding raw WebSocket references in memory has to stay resident
(and billed) the entire time just to keep those sockets alive, even
though there's no work to do.

**What I considered and rejected:**

- _Just accept the cost._ For a single Durable Object per room, an idle
  room that nobody explicitly closes is a hibernation problem, not a
  request-volume problem. Normal request-based billing intuition doesn't
  save you if the object can never actually go idle.

**What I built:** Sockets are accepted through Cloudflare's WebSocket
Hibernation API (`ctx.acceptWebSocket` plus
`serializeAttachment`/`deserializeAttachment` instead of an in-memory
`Map<PlayerId, WebSocket>`), which lets the runtime evict the object
from memory while idle connections stay open, and wake it back up on the
next message with the player's identity restored from the socket's
serialized attachment. Timers ride the same discipline: every deadline
is data in `RootState.timers`, reconciled to a single DO alarm set to
the earliest one on every commit, rather than one `setTimeout` per
timer. A `setTimeout` would itself have pinned the object in memory the
whole time, defeating the point of hibernating in the first place.
