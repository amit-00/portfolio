---
title: Technical Architecture
order: 3
---

# Technical Architecture

PulseFM is a monorepo: a Next.js client, five Python services on Cloud Run,
four Cloud Functions, a Modal-hosted GPU worker, shared Python packages,
and Terraform for all of it. Nothing runs on a single always-on server —
every piece scales to zero and is wired together with managed messaging
rather than direct service-to-service calls.

```
Browser
  -> Next.js (client)
      -> vote-api (Cloud Run, OIDC)
      -> playback-stream (Cloud Run, SSE proxy)
      -> heartbeat-ingress (Cloud Function, OIDC)

vote-api -> Cloud Tasks (tally-queue) -> tally-function
              -> Redis tally/voted keys
              -> Pub/Sub topic: tally

playback-service (Cloud Run, driven by its own scheduled queue)
  -> Firestore (stations, songs, voteState)
  -> Redis snapshot/tally init
  -> Pub/Sub topics: playback, vote-events
  -> Cloud Tasks (playback-queue: /tick + /vote/close)

playback-stream (Cloud Run)
  <- Eventarc (Pub/Sub -> /events/tally, /events/playback, /events/vote)
  -> SSE to clients (/stream), snapshot API (/state)

encoder (Cloud Run, Eventarc on GCS object-finalized for raw/*.wav)
  -> transcode wav -> m4a (AAC, ffmpeg/pydub)
  -> Firestore songs/{voteId} = ready

modal-dispatch-service (Cloud Run)
  <- Eventarc vote-events OPEN/CLOSE
  -> schedules Modal warmup ahead of vote close
  -> invokes the Modal GPU worker to generate the winning track
```

## Why this stack

- **FastAPI + Cloud Run for every backend service**, instead of one
  monolith: each piece of the pipeline (voting, tallying, playback timing,
  streaming, encoding, GPU dispatch) has a different scaling profile and
  failure mode, and Cloud Run lets each scale to zero and fail
  independently without one bug taking the whole system down.
- **Firestore + Redis together**, instead of just one: the system needs
  both a durable, transactional source of truth and a sub-millisecond hot
  read/write path, and no single store does both well — see the state
  model below.
- **Pub/Sub + Eventarc + Cloud Tasks** instead of services calling each
  other directly: this is what makes independent scaling and independent
  deploys possible — a service can be redeployed or briefly down without
  the caller needing to retry against it directly.
- **Modal for GPU inference** instead of a self-managed GPU VM: scale-to-
  zero billing and built-in memory/GPU snapshotting (see
  [Challenges & Solutions](/projects/pulsefm/challenges)) solve the exact
  cold-start-vs-cost problem this project has, without building that
  infrastructure by hand.
- **Terraform for all of it**: with this many independently deployable
  pieces, infra-as-code isn't optional — it's the only way the system
  stays reproducible.

## The poll-to-playback loop

This is the core mechanic, and the reason most of the architecture exists:
a new song has to be fully generated and encoded before the vote that
requested it finishes playing, for every listener, with no visible gap.

1. `vote-api` accepts a vote, checks it against the open poll in Redis, and
   enqueues a tally task — it never mutates Redis synchronously from the
   request path itself, `tally-function` does.
2. `tally-function` runs a Lua script that atomically dedupes the session
   and increments the option's tally, then publishes to Pub/Sub so
   listeners see the delta in near real time.
3. `playback-service` is woken by a Cloud Tasks schedule (`/tick`), not a
   cron loop. Each tick closes the current poll, promotes the winning
   track to "now playing," opens the next poll, and schedules the *next*
   tick for exactly when the new song ends.
4. On vote `CLOSE`, `modal-dispatch-service` scales the GPU worker's min
   instances to 1 and dispatches generation; on vote `OPEN`, it schedules a
   warmup 30 seconds before the poll is due to close, so the GPU is
   already warm when generation is actually requested.
5. The GPU worker uploads a raw `.wav`; a GCS finalize event fires the
   `encoder` service, which transcodes to `.m4a` and flips the song's
   Firestore status to `ready`.
6. A `next-song-updater` function reacts to the encoded file and enqueues a
   `/next/refresh` task so `playback-service` can pick up the freshly
   ready track as the *next* song, ahead of the tick that will need it.

## Data model

**Firestore** (durable control plane):
- `stations/main` — current/next song pointers and a monotonic `version`
- `songs/{voteId}` — status (`stubbed` → `ready` → `queued` → `played`),
  `durationMs`, `createdAt`
- `voteState/current` — active `voteId`, options, status, `endAt`

**Redis** (hot path):
- `pulsefm:poll:{voteId}:tally` — hash of option → vote count
- `pulsefm:poll:{voteId}:voted` — set of session IDs, for dedupe
- `pulsefm:playback:current` — cached snapshot for fast reads on
  `playback-stream`
- `pulsefm:heartbeat:active` / `pulsefm:heartbeat:session:{sessionId}` —
  listener presence, TTL'd

## AI generation pipeline

Generation uses **ACE-Step v1-3.5B**, an open-weights music diffusion
model, served from a Modal GPU app (`MusicGenerator`, L4 GPU). Poll options
aren't passed to the model directly — `energy` maps to a target BPM and
tempo description, `mood` maps to a block of descriptive adjectives, and
`genre` maps to an instrument palette. These combine into a structured
prompt alongside fixed production descriptors ("lofi drums with punchy
kick... no vocals, instrumental only") that keep every generated track
sonically consistent with the station's identity regardless of which
option wins.

The interesting infra detail is how the GPU cold-start problem is solved —
covered in depth in [Challenges & Solutions](/projects/pulsefm/challenges),
since it was the single hardest constraint in the whole system.

## Real-time delivery

`playback-stream` exposes a long-lived `GET /stream` (Server-Sent Events)
per listener, emitting a small, explicit set of event types (`HELLO`,
`TALLY_SNAPSHOT`, `TALLY_DELTA`, `SONG_CHANGED`, `NEXT-SONG-CHANGED`,
`VOTE_CLOSED`, `HEARTBEAT`) rather than raw state diffs, so client-side
state handling stays simple and each event has one clear meaning. It reads
Redis first for this, falling back to Firestore only to reconstruct a
snapshot on a cache miss.

## Auth: keyless service-to-service calls

The Next.js server never holds a long-lived GCP service account key. In
production it exchanges a Vercel OIDC token for a short-lived GCP identity
token via Workload Identity Federation, scoped to a specific Vercel
project/environment subject, and uses that to call Cloud Run/Functions.
Locally, the same code path uses Application Default Credentials. All
`/api/*` routes go through a single `proxy.ts` middleware that validates
the Auth.js JWT session, injects `X-Session-Id` downstream, and applies
Upstash-backed rate limiting — so auth is enforced in one place, not
scattered per-route.

## Design decisions and their tradeoffs

| Decision | Why | Tradeoff accepted |
| --- | --- | --- |
| Redis as canonical for live tallies/dedupe | Low-latency increments under concurrent voting | An outage blocks voting even though Firestore is fine |
| Version-gated `/tick`, idempotent `/vote/close` | Tolerate Cloud Tasks retries and out-of-order delivery | Every caller must propagate version correctly |
| Firestore for control state, Redis for hot snapshot | Durable source of truth + fast read path | Dual writes need reconciliation logic |
| Pub/Sub + Eventarc fan-out | Decouples producers from stream consumers | No ordering guarantee; consumers must reconcile from snapshots |
| Modal dispatch split from playback orchestration | Isolates long-running GPU generation from the tick loop | An extra service and queue to operate |
| Vercel OIDC + GCP WIF instead of static keys | No long-lived credentials to leak or rotate | Nontrivial one-time IAM/WIF setup in Terraform |
| SSE instead of WebSockets | Data flow is almost entirely server → client | Voting still needs a normal authenticated POST, which is fine since it's the only client → server action |

## Known limitations

Worth stating plainly, since it's what a "done" v1 of a real-time system
still leaves open:

- Listener counting in `playback-stream` scans Redis keys by pattern, so
  its cost scales with key cardinality rather than listener count
  directly.
- Automated test coverage is minimal — one unit test suite, no
  multi-service integration or e2e tests yet.
- Generated audio is served from a public GCS bucket URL directly, with no
  CDN edge caching in front of it yet.
- There's no metrics/tracing stack (no Prometheus/OpenTelemetry) — just
  structured application logs and `/health` endpoints.

## Infrastructure as code

Every piece of GCP infrastructure — Cloud Run services, Cloud Functions,
Firestore, Cloud Tasks queues, Pub/Sub topics, Eventarc triggers, IAM,
Artifact Registry, and Memorystore — is provisioned by Terraform, with
remote state in GCS. A Cloud Build pipeline applies Terraform, builds and
pushes service images, and deploys Cloud Run by image digest, so the
running system and the infra definition can't drift silently.
