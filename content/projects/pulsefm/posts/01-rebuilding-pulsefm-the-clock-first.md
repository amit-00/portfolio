---
title: "Rebuilding PulseFM: the clock comes first"
date: 2026-07-28
excerpt: v2 collapses five services and three functions into two, drops Redis for create-only Firestore documents, and starts from the one thing most likely to embarrass the project — a synced audio clock — before any generation code exists.
---

# Rebuilding PulseFM: the clock comes first

PulseFM's v1 was five Python services plus three Cloud Functions: an encoder,
a Modal dispatcher, a vote handler, a rotation worker, an API, and glue
functions wiring them together. It worked, but every deploy touched more
moving parts than the actual feature warranted. v2 is two services —
`radio-service` and `station-api` — and this post is about why, and about
the decision I made before writing a line of generation code.

## Two services, not eight

Two of v1's services disappear for reasons that are almost embarrassing in
hindsight. The encoder existed to turn generated audio into something a
browser could play, but the GPU container that runs generation already has
ffmpeg installed to feed the model itself — there was never a reason to ship
audio to a second container just to transcode it. Cutting the encoder means
cutting a whole deploy target, a whole set of IAM bindings, a whole failure
mode.

The Modal dispatch service is a similar story. It existed to isolate the
call that kicks off a GPU generation job from the rest of the radio logic —
but that call is a `.spawn()`, a fire-and-forget RPC that returns in under a
millisecond. That's not a boundary that earns its own deployment, its own
Cloud Run revision, its own cold start. It folds into `radio-service`
directly. What's left, once the encoder is gone and dispatch has folded in,
is a service that owns the rotation clock and a service that serves reads —
split by traffic shape, not by feature.

## Why discrete tracks, not HLS

The obvious way to stream AI-generated audio to a browser is HLS: chunk the
track, publish a manifest, let the player buffer ahead. I looked at it
seriously and ruled it out, for one reason that isn't about audio quality at
all.

HLS players buffer somewhere between 6 and 30 seconds behind the live edge,
and different players — different browsers, different network conditions —
buffer by different amounts. PulseFM's whole mechanic is that listeners vote
on the vibe of the *next* track while the current one plays. If the player
is buffered 20 seconds behind where the station actually is, a listener is
voting based on a track position that's already in the past relative to
everyone else in the room. Two listeners voting at "the same moment" could be
reacting to genuinely different points in the song. That desync undermines
the mechanic at its root — it's not a rough edge, it's the feature not
working.

HLS also can't give me the thing the design actually asks for: a per-track
progress bar tied to the station's real position. A manifest exposes
segments, not a single track's elapsed time in a form I'd want to trust
across players. Discrete tracks — a station clock computed server-side, a
listener's player seeking to `now - startAt` on join — give me both a
synced vote and an honest progress bar, and they do it with a mechanism
simple enough to test in a browser rather than reason about from HLS spec
prose.

## Dropping Redis

v1 used Memorystore Redis for vote tallies, with an atomic Lua script doing
validation, dedupe, and tally in a single round-trip. It worked and it was
fast, but it also meant a fixed monthly cost for the instance, a VPC
connector, and every Cloud Run service getting pulled onto that VPC just to
reach it.

v2 replaces the whole thing with a create-only Firestore document per vote:
`polls/{pollId}/votes/{uid}`. A document create fails if the document
already exists, so dedupe falls straight out of the document ID — no
transaction, no single-document write contention, no Lua script to get
right. Tallies aren't computed live at all; the design hides results until
a poll closes, so tallying is a one-time aggregation into an immutable
snapshot at close, not something that needs to be fast on every vote.

The other property I needed was the one Redis gave v1 through explicit
invalidation: when a generation finishes, the radio service has to see the
song as available on its very next read. Firestore gives me that for free —
it's strongly consistent, so a worker's `status: ready` write is visible
immediately, no cache to invalidate, no staleness window to reason about.
Losing Redis costs raw write latency — tens of milliseconds instead of
sub-millisecond — which is irrelevant at one vote per user per poll, and it
buys back a VPC and a second datastore I no longer have to operate.

## Why I built the clock before the product

Slice 1 has no polls, no auth, no GPU. What it has is a station that rotates
on a self-chaining Cloud Tasks clock and a React player that joins mid-track
already synced to the station's position. That's a deliberately narrow
slice, and it's narrow on purpose.

The two things most likely to embarrass this project are clock sync — does
a listener who joins thirty seconds into a track actually hear it thirty
seconds in, and do two listeners in different tabs agree — and generation
latency, which I'm not touching yet. Both are the kind of problem that's
cheap to catch early and expensive to catch late: if the clock drifts, every
feature built on top of it (voting, progress bars, gapless changeover)
inherits the bug. So slice 1 isolates clock sync completely, with nothing
else in the picture to confuse the result.

I'm not going to overstate what's proven here. The station rotation itself
is tested against version-guarded replays and concurrent instances with
Firestore-emulator integration tests, and I measured the browser sync
directly: a listener joining mid-track landed at `audio.currentTime`
16.298s against a server-computed expected position of 17.094s — a delta of
0.796s — and two independent browser tabs agreed on the station's position
within 34 milliseconds of each other. That's the mechanism working. What
it isn't yet is gapless: the idle audio slot loads reactively, after a poll
reports the rotation has happened, not ahead of time — there's no
look-ahead preloading against the station's known next track. A track
change swaps cleanly, but "gapless" isn't a claim I've earned. And none of
this has touched a real deploy — every test here ran against the Firestore
emulator and locally generated fixtures, not GCP.

That's the honest state of slice 1: the riskiest unknown isolated and
measured, the rest still ahead.
