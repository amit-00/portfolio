---
title: Problem & Motivation
order: 1
---

# Problem & Motivation

## The gap

Ambient/lofi radio streams (the "Lofi Girl" style 24/7 stream is the
canonical example) are popular precisely because they're always-on
background music — but they're static. Someone else curated the playlist,
and every listener gets the same fixed rotation regardless of what mood
they're actually in.

At the same time, the current generation of AI music tools (Suno, Udio, and
similar) solve a completely different problem: one person generates one
track for themselves, on demand. There's no shared, live, collectively
steered listening experience — generation is a single-player interaction,
not something a whole room of strangers experiences together in real time.

Nothing sits in the middle: a station that's always on like a curated
stream, but where the *audience* — not a curator, and not a single user
prompting a model — decides what plays next, live.

## Who this is for

Anyone who wants ambient background music (studying, working, relaxing)
without the effort of building their own playlist, but who'd rather have a
say in the vibe than passively accept someone else's fixed rotation.

## Why I actually built it

Honestly, as much as the product idea, the reason I picked this project was
the engineering shape of the problem it forces: a real-time system with a
hard deadline. A song has to be generated, encoded, and ready before the
current one ends — for every listener simultaneously — on a clock that
never stops for a deploy, a retry, or a cold GPU. That constraint touches
almost every hard part of distributed systems (idempotency, event ordering,
state consistency under concurrent writes) and pairs it with a genuinely
expensive, slow operation (GPU inference) that has to be hidden from the
user entirely. I wanted a project that would force me past CRUD-app
territory into that territory on purpose.
