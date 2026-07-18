---
title: "Scaffolding the lobby, and the first playable round of Imposter"
date: 2026-07-01
excerpt: Day one. A Next.js scaffold, a Cloudflare Worker running Imposter, and the first end-to-end lobby flow.
---

# Scaffolding the lobby, and the first playable round of Imposter

My goals for this first iteration was to get the following working for the
core application:

- Running Websocket
- Two way communication
- Server-handled state
- Game UI

I decided to use Cloudflare's platform to host the infra since one of their
main offerings, [Durable Objects](https://developers.cloudflare.com/durable-objects/)
, fit my use cases perfectly. I needed to be able to spin up isolated 
websocket instances that could hold state and keep it consistent with
the connected clients.

Durable objects are specifically designed for this, keeping everything 
running in a single thread. We remove the need for any distributed 
locking or conflict resolution, race conditions simply just don't happen.

This high consistency fits our use case perfectly, since we care more
that the game state appears the same for all connected players, than
we care that players stay connected. In the case of a network partition,
we can handle that gracefully in the game logic itself depending
on the rules of the game.

![Durable Object Architecture](/huddl/durable_object_arch.png)
> All durable objects are singly-threaded with compute and storage in the same thread.

One tradoff of Cloudflare's durable objects are that they're spun up in
the region closest to where the creation request was made (since it's a
single instance). I expect most users would likely be playing this with
friends or family that they know, but it isn't unlikely for connections
from different parts of the world, so this could introduce some latency
for users that are far away.

Using Cloudflare's developer tooling and documentation, I was able to get
my first iteration of a lobby, imposter, and the UI working pretty easily.