---
title: Results & Impact
order: 5
---

# Results & Impact

## Where it stands

PulseFM is live at [pulsefm.app](https://www.pulsefm.app), running the full
pipeline end to end: voting, tallying, AI generation, encoding, and
synced multi-listener streaming, all on infrastructure defined entirely in
Terraform and deployed through a single Cloud Build pipeline. Every
service scales to zero when idle, including the GPU worker — the whole
system's baseline cost when nobody's listening is close to nothing.

I'm not going to cite usage numbers (listeners, uptime, latency
percentiles) here — I haven't wired up real telemetry yet (see below), so
I don't have numbers I'd stand behind. What I can say concretely: the
system has been running this full loop in production since March 2026,
and the architecture decisions in [Technical Architecture](/projects/pulsefm/architecture)
and [Challenges & Solutions](/projects/pulsefm/challenges) hold up under
that continuous, unattended operation — the whole point of the
idempotency and reconnection design was that it shouldn't need a human
watching it.

## What I learned

- **Idempotency is a design constraint, not a defensive afterthought.**
  Once messaging is at-least-once, "make the handler safe to re-run" has
  to be part of the initial design of every endpoint, not something bolted
  on after a duplicate-processing bug shows up.
- **The hard part of "real-time" is the reconnect path, not the happy
  path.** Streaming state to a connected client is easy. Making sure a
  client that was disconnected for 8 seconds ends up in the *correct*
  state, without a special-cased recovery flow, is what actually took
  iteration.
- **GPU cost and latency are the same lever.** Every decision in the
  generation pipeline (warmup timing, snapshotting, listener-gated
  warmup) was really one tradeoff — cost vs. cold-start latency — viewed
  from different angles, not separate problems.
- **Infra-as-code pays for itself fast once you have more than two or
  three services.** With five Cloud Run services, four Functions, and a
  GPU worker, hand-managing any of this outside Terraform would have made
  the system impossible to reason about after a few weeks.

## What I'd do differently / next

In rough priority order:

1. **Add real observability** — no metrics or tracing exist today, only
   structured logs and `/health` endpoints. This is the single biggest
   gap: I can't currently answer "how many people are listening right
   now" or "what's p99 generation latency" without reading logs by hand.
2. **Add a CDN in front of generated audio** — tracks are served from a
   public GCS bucket URL directly today; that's fine at current scale but
   won't hold up under real concurrent listener load.
3. **Build an integration/e2e test suite** — the automated test coverage
   right now is a single unit test file. The multi-service flow (vote →
   tally → generate → encode → stream) has no automated regression
   coverage, which is a real risk given how many services participate in
   it.
4. **Replace the `SCAN`-based listener count** with a cardinality-friendly
   structure, and add schema validation on the Pub/Sub payloads that
   connect services — both are known soft spots called out directly in
   the codebase.
5. **Add CI** (lint/type-check/test/build) ahead of the Cloud Build deploy
   pipeline — deploys currently go straight from `terraform apply` to
   image build with no automated gate in front of them.

If I were starting over, I'd instrument observability from day one rather
than treating it as a follow-up — debugging a five-service, event-driven
pipeline from logs alone is exactly the kind of thing that gets much
harder to retrofit the longer you wait.
