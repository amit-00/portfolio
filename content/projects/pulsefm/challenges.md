---
title: Challenges & Solutions
order: 4
---

# Challenges & Solutions

Four problems that didn't have an obvious answer, and why I chose the
approach I did over the alternatives I considered.

## 1. GPU music generation on a live radio clock

**The problem:** A song has to be fully generated before the current one
ends, but GPU inference is slow and GPUs are expensive to keep running.
Keeping the worker warm 24/7 wastes money for most of the day; only
starting the GPU when a poll closes means every listener sits through a
cold start (loading a 3.5B-parameter model onto a GPU from scratch) before
the next track can even begin rendering — which breaks the "always-on
radio" experience the whole project is built around.

**What I considered and rejected:**
- *Always-on GPU* — simplest, but pays full GPU cost 24/7 for a system
  that only needs to generate one ~150-second track every few minutes.
- *Pre-generate all option combinations ahead of time* — doesn't work: the
  winning combination isn't known until the poll actually closes, and the
  combination space (genre × mood × energy) makes pre-generating
  everything wasteful even if it were known early.

**What I built:** Predictive warmup plus GPU state snapshotting. When a
poll *opens*, `modal-dispatch-service` reads its `endAt` and schedules a
`/warmup` call for `endAt - 30s`, so the worker is already scaling up
before the vote even closes — but only if the heartbeat-tracked active
listener count is nonzero, so an empty station doesn't pay for a warm GPU
nobody will hear. On the Modal worker itself, `@modal.enter(snap=True)`
loads the model once and lets Modal capture that live GPU memory as a
snapshot; every subsequent cold start restores directly from that GPU
snapshot instead of re-running model load from disk, and model weights are
pre-downloaded at **image build time** so a cold container never blocks on
a Hugging Face download either. The combination turns "spin up a GPU and
load a 3.5B model" into a fast memory restore that's already been
triggered before it's needed.

One correctness bug fell out of this directly: because the snapshot
captures RNG state along with everything else, early runs reused the same
seed across every generation restored from the same snapshot, so songs
started repeating. Switching to a fresh `secrets.randbelow()` seed drawn
per request, applied after restore, fixed it — a good example of a
non-obvious failure mode that only shows up once you're optimizing cold
starts this aggressively.

## 2. Keeping playback and votes correct under at-least-once delivery

**The problem:** Cloud Tasks and Pub/Sub both guarantee at-least-once
delivery, not exactly-once. A naive scheduler that just "does the thing"
on every task invocation would double-advance playback on a retried tick,
or double-close a poll, or let a rapid double-submit double-count a vote.

**What I considered and rejected:**
- *A distributed lock around every handler* — works, but adds a dependency
  (and a failure mode: what happens if the lock holder crashes mid-task?)
  for a problem that has a cheaper structural fix.
- *A single long-running scheduler process instead of stateless
  Cloud-Tasks-triggered handlers* — removes the retry-duplication problem
  by removing retries, but reintroduces a single point of failure and
  loses the independent-scaling/independent-deploy properties the rest of
  the system is built around.

**What I built:** Made every handler naturally idempotent instead of
guarding against re-execution externally. `/tick` is version-gated — the
payload carries a version number, and if it's not strictly greater than
`stations/main.version`, the handler is a pure noop, so a duplicate or
late tick can never double-advance playback. `/vote/close` only closes a
poll when both the `voteId` *and* version in the payload match
`voteState/current`, so a retried close from a stale poll can't
accidentally close the current one. And the vote tally itself is a single
atomic Lua script — dedupe-check and increment in one round trip — instead
of a check-then-write, which closes the race where two concurrent votes
from the same session both read "not yet voted" before either writes.

## 3. Real-time delivery without polling or a thundering herd

**The problem:** Every listener needs live tally and playback updates, but
polling on an interval means either high latency (long poll interval) or
high load (short interval, multiplied by every connected client). And any
long-lived-connection approach has to survive real network conditions —
listeners lose wifi, phones sleep, deploys happen — without every dropped
client reconnecting in the same instant and hammering the service.

**What I considered and rejected:**
- *WebSockets* — the data flow here is almost entirely server → client
  (tallies, song changes); the one client → server action, voting, is a
  normal authenticated POST. A bidirectional socket would add load-
  balancer/sticky-session complexity on Cloud Run for a capability the app
  doesn't use.
- *Naive reconnect (retry immediately on drop)* — works until a deploy or
  brief outage disconnects every listener at once, at which point every
  client reconnecting simultaneously turns a routine deploy into a
  self-inflicted spike.

**What I built:** Server-Sent Events for the server → client stream, with
the client (`useStreamPlayer`) treating disconnection as an expected
condition rather than an edge case: reconnect with exponential backoff
(1s → 30s) plus random jitter, so a mass-disconnect event doesn't
reconnect-storm the service; an independent client-side heartbeat on its
own jittered interval, which also feeds the active-listener signal used
for GPU warmup gating (challenge 1); and playback-offset reconstruction on
connect, so a listener joining or reconnecting mid-song is placed at the
correct point in the track — derived from the song's known `endAt` and
duration — instead of restarting it from zero.

## 4. Gapless playback with unpredictable timing

**The problem:** Songs transition on a schedule driven by generation and
encoding finishing in time, not a fixed client-side timer. A single
`<audio>` element that swaps its `src` at the changeover moment stalls
while the browser loads and decodes the new file — an audible or visible
gap in what's supposed to be a live, always-on stream.

**What I considered and rejected:**
- *Single audio element, swap source at changeover* — simplest, but the
  decode/buffer delay on source swap is exactly the gap this needs to
  avoid.
- *Client-side crossfade library* — adds a dependency and complexity for a
  problem that a much simpler pattern solves.

**What I built:** Two `<audio>` elements (`useAudioSlots`), where one
plays the current track while the other is silently preloaded with the
next one *before* the changeover happens. At the changeover, the hook just
swaps which slot is "active" — no load, no decode-in-the-critical-path,
because that work already happened ahead of time.
