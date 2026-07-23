---
title: Solution & Features
order: 2
---

# Solution & Features

## Pick a game, share a code, play

No app, no install. Create a room, share the six-character code (or the
link) to the group chat, and everyone who opens it lands straight in the
lobby from their phone or computer.

![Huddl home page](/huddl/home.png)

## Guests welcome, accounts for hosts

Joining an existing room never requires an account. Pick a name and
play. Hosting one does: creating a room needs a signed-in identity so a
room has a durable owner, handled with Google sign-in.

![Sign-in screen](/huddl/signin.png)

## Reconnects without losing your seat

Phones sleep, wifi drops, tabs get backgrounded. A dropped connection
reconnects automatically with backoff, and the server resends a full
snapshot of wherever the game currently is. There's no special "catch
the reconnecting player up" logic, because every reconnect just looks
like a fresh join that happens to already have a seat.

## Built to add more games without touching the lobby

The lobby (seating, host handoff, connection tracking, per-room timers)
and each individual game are fully decoupled: a game is one file that
implements a fixed contract (`init`, `onMessage`, `onTimer`,
`snapshotFor`, and so on), and the lobby engine that runs it never
changes. See [Technical Architecture](/projects/huddl/architecture) for
how that split works underneath.
