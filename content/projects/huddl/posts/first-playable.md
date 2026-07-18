---
title: "Scaffolding the lobby, and the first playable round of Imposter"
date: 2026-07-01
excerpt: Day one — a Next.js scaffold, a Cloudflare Worker running Imposter, and the first end-to-end lobby flow.
---

# Scaffolding the lobby, and the first playable round of Imposter

Day one of Huddl was the Next.js scaffold, a Cloudflare Worker running the
Imposter game, and the Imposter frontend wired up to it — in that order, in
one day. The goal wasn't a polished first game, it was an end-to-end
vertical slice: someone opens a room, someone else joins it, a game runs,
everyone sees the result. Everything after this is either a second game
riding the same lobby machinery, or the lobby machinery getting more
correct.

The next couple of days were a genuine rebuild, not a tweak: "Rebuild game
engine" and "Implement the imposter game to fit the game engine strategy
pattern" landed within 24 hours of the scaffold. I threw away an early
approach to how the game and the lobby talked to each other in favor of the
strategy-pattern shape that's still there now — a game as a self-contained
implementation of a fixed interface, not logic threaded through the lobby's
own code. Getting that seam right this early is the reason adding
Wavelength later didn't touch the lobby engine at all.
