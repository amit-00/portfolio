---
title: Solution & Features
order: 2
---

# Solution & Features

> No feature screenshots/GIFs yet — see [Architecture](/projects/pulsefm/architecture) for system diagrams. This page describes behavior; visuals are a planned follow-up.

## Live, collective voting

Listeners vote on the next track's genre, mood, and energy from a running
poll. Tallies update for every connected listener in near real time as
votes come in — nobody needs to refresh to see the count change.

## AI-generated tracks, on demand, per poll

There's no pre-rendered song library. Every track is generated fresh from
the winning poll options by a music-generation model, turned into a
finished, streamable audio file, and slotted into the rotation — all within
the runtime of the *previous* song. See
[Technical Architecture](/projects/pulsefm/architecture) for how, and
[Challenges & Solutions](/projects/pulsefm/challenges) for why that's
harder than it sounds.

## Synchronized playback across every listener

Everyone hears the same song at the same position at the same time. A
listener who joins mid-track is placed at the correct point in the song
(not restarted from zero), and song transitions happen without a gap or
reload — playback is treated as shared, global state, not a per-client
audio player with its own independent timeline.

## Real-time state, no polling

Tally updates, "now playing" changes, and vote-close events are pushed to
the client over a live connection (Server-Sent Events) the moment they
happen, rather than the client asking "anything new?" on an interval.

## Resilient by design

Network drops happen. The client detects a lost connection and
reconnects automatically with backoff, and a listener's session survives a
brief disconnect without losing their place in the current song or missing
that a vote closed.

## Audio-reactive visuals

A waveform and a dot-matrix visualizer react live to the actual audio
being played, driven by real-time frequency analysis of the stream rather
than canned animation.

## Secure by construction

Voting and session identity are authenticated end to end, and the backend
services trust each other via short-lived, automatically issued
credentials rather than a shared static API key.
