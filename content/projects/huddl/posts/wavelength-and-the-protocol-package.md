---
title: "Building Wavelength, and undoing a package split a day later"
date: 2026-07-14
excerpt: The second game landed test-first, proved the plugin contract for real, and immediately exposed a wrong call on where its wire types should live.
---

# Building Wavelength, and undoing a package split a day later

Wavelength was the real test of whether Imposter's `GameDefinition`
contract was an actual abstraction or just "what Imposter happens to
need." I built it mostly test-first on the backend: scoring and target-
placement helpers, then the full `GameDefinition` (round flow, snapshots),
then end-to-end tests running the whole thing through the lobby Durable
Object, and only *then* the frontend — spectrum component, game screens,
catalog entry. By the time the UI existed, the game logic underneath it
had already been exercised by tests that didn't know or care what it would
eventually look like.

The part worth writing down honestly: I shipped Wavelength's wire types in
a brand-new package, `@huddl/game-protocol`, reasoning that "lobby
protocol" and "per-game protocol" were different concerns. That lasted
about a day. Building against it made obvious that every game needs both
halves together on both sides of the wire regardless — the split wasn't
tracking anything real, it was type-organization purity standing in for
architecture. `fix: consolidate @huddl/game-protocol into @huddl/protocol`
landed the next day, as a subpath export instead of a separate package.
Worth keeping in the record as it actually happened, not smoothing it into
"and then I added a protocol subpath" as if that were the first idea. More
on why in [Challenges & Solutions](/projects/huddl/challenges).

Also this week: a dev-mode harness (`/dev/games/[name]`) that renders a
game's screens directly from canned scenario data, no lobby or WebSocket
required — the same harness the screenshots on this site's game pages were
taken from.
