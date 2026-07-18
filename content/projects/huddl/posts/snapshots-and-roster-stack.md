---
title: "Switching to snapshot-driven sync, then rebuilding the whole UI on top of it"
date: 2026-07-08
excerpt: The frontend moved from re-deriving state off deltas to trusting server snapshots — then every screen got rebuilt against a real design system.
---

# Switching to snapshot-driven sync, then rebuilding the whole UI on top of it

A few days in, I made the frontend "switch to full snapshot driven
communication from server to client" — the commit message undersells how
big a change that was. Before it, the client was reconstructing state from
a stream of deltas, which meant every place that touched game state had to
reason about *ordering*: what if this event arrives before that one, what
if one gets dropped. After it, the server just sends the truth on every
relevant transition, and the client's job shrank to "render whatever
snapshot you were last given." A whole category of bugs about
partially-applied state stopped being possible, because there's no partial
state to apply — every update replaces the picture wholesale.

That same week I also went through the entire UI: a from-scratch design
system I called Roster Stack — Button, Chip, Avatar, IconButton, HostBadge,
RoomCodeCard, GameHeroCard — and rebuilt the lobby screen, the imposter
game screens, the join flow, and the landing page against it, token by
token. Nineteen commits, all in one day, all prefixed `style:`. It's the
kind of pass that's easy to justify skipping ("the old version works"), but
doing it before Wavelength existed meant the second game got built against
a real design system from its first commit instead of inheriting whatever
one-off styling Imposter happened to have first.

Buried in the same window: a StrictMode-caused race condition in the
WebSocket connection logic, fixed the same day it was introduced by the
snapshot rewrite. More on that fix, and why it turned out to matter beyond
development mode, in [Challenges & Solutions](/projects/huddl/challenges).
