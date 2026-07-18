---
title: Solution & Features
order: 2
---

# Solution & Features

## Pick a game, share a code, play

No app, no install. Create a room, share the six-character code (or the
link) to the group chat, and everyone who opens it lands straight in the
lobby from their phone.

![Huddl home page](/huddl/home.png)

## Player Imposter

A social-deduction game: everyone except one secret imposter sees the real
athlete; the imposter gets a vague hint instead. Players take turns giving
one-word or short-phrase clues that prove to the group they know who it is
— without handing the imposter enough to fake it — then the room votes out
who they think is faking it.

![Ready check screen](/huddl/imposter-ready.png)
![Clue-giving round](/huddl/imposter-clue.png)
![Voting phase](/huddl/imposter-voting.png)
![Round result](/huddl/imposter-gameover.png)

The role reveal is scoped per player at the protocol level: crew members
only ever receive the athlete's name, the imposter only ever receives the
hint. Neither side can find out the other's information by reading network
traffic, because the server never sends it.

## Wavelength

One player (the psychic) sees a hidden target on a spectrum between two
opposing ideas ("Ice Cold" – "Blazing Hot", framed around a sports concept)
and gives a one-word clue. Everyone else drags a dial to guess where the
target sits, without seeing it, and scores based on how close they land.

![Clue phase](/huddl/wavelength-clue.png)
![Guessing phase](/huddl/wavelength-guessing.png)
![Round reveal](/huddl/wavelength-reveal.png)
![Leaderboard](/huddl/wavelength-leaderboard.png)

## Guests welcome, accounts for hosts

Joining an existing room never requires an account — pick a name and play.
Hosting one does: creating a room needs a signed-in identity so a room has
a durable owner, handled with Google sign-in.

![Sign-in screen](/huddl/signin.png)

## Reconnects without losing your seat

Phones sleep, wifi drops, tabs get backgrounded. A dropped connection
reconnects automatically with backoff, and the server resends a full
snapshot of wherever the game currently is on reconnect — no special
"catch the reconnecting player up" logic, because every reconnect just
looks like a fresh join that happens to already have a seat.

## Built to add more games without touching the lobby

The lobby (seating, host handoff, connection tracking, per-room timers)
and each individual game are fully decoupled: a game is one file that
implements a fixed contract (`init`, `onMessage`, `onTimer`,
`snapshotFor`, …), and the lobby engine that runs it never changes. See
[Technical Architecture](/projects/huddl/architecture) for how that split
works underneath.
