---
title: Problem & Motivation
order: 1
---

# Problem & Motivation

## The gap

Jackbox-style party games solved "everyone plays from their phone, one
screen is the room" years ago, but they're generic: trivia, drawing,
word games that could be about anything. There's nothing built
specifically around sports content for a group chat that wants to kill
twenty minutes before kickoff arguing about who the imposter is or how
underrated their favourite player really is. Sports-media trivia apps go
the other way: single-player, high-production, and not built for a group
that's physically (or virtually) in the same room playing off each other.

Huddl sits in that gap: phone-first party games, sports as the subject
matter, and a room code as the only setup. No lobby software to install,
and no account required to join someone else's room.

## Who this is for

Groups who already have a group chat going for a game. Watch parties,
fantasy leagues, a group of friends with a running sports rivalry, who
want something to do together for a few minutes that isn't just the game
itself.

## Why I actually built it

The product is real, but the reason I picked this project was the
engineering shape underneath it. A lobby is a small piece of shared,
authoritative state (who's seated, whose turn it is, what the score is)
that has to stay consistent across however many phones are connected to
it, survive people's wifi dropping mid-round, and support more than one
game without the lobby code caring which game is currently running.

That's really a plugin architecture problem. Every game in Huddl
(Imposter, Wavelength, and a deliberately tiny internal-only game called
Tap Race that exists purely to exercise the plugin contract) implements
the same `GameDefinition` interface, and the lobby engine that seats
players, tracks connections, and drives timers never changes when a new
game is added. Getting that seam right, and getting real-time delivery
right on Cloudflare's Durable Objects rather than a more familiar
always-on server, was the actual point of the project.
