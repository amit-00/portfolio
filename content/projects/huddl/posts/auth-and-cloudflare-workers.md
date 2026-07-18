---
title: "Google sign-in, and moving the frontend from Vercel to Cloudflare Workers"
date: 2026-07-16
excerpt: Hosting rooms now requires an account, sessions get verified inside the Worker that handles the WebSocket upgrade, and both apps live on the same platform.
---

# Google sign-in, and moving the frontend from Vercel to Cloudflare Workers

Up to this point, `apps/huddl` was deployed to Vercel while `game-service`
ran on Cloudflare Workers — two platforms, no shared bindings. Adding
accounts was the forcing function to fix that: better-auth needs D1 and KV
to store users, sessions, and rate-limit state, and the cleanest way to get
those bindings into the Next.js app is to run it on Cloudflare too. So the
frontend moved to `@opennextjs/cloudflare`, and both apps have lived on one
platform since.

The harder part wasn't the sign-in flow itself, it was what happens on the
WebSocket upgrade. `game-service` is a separate Worker from the Next.js
app — it can't just call a Next.js API route to ask "is this session
valid" without adding a network hop to every single connection attempt.
Instead, the upgrade handler reads the `better-auth.session_token` cookie
directly, verifies its HMAC signature with WebCrypto against a secret both
Workers share, and checks KV first with D1 as a fallback — no dependency
on the other app being reachable at all. An invalid or missing session
doesn't reject the connection; it degrades to a guest identity, since
joining an existing room still shouldn't require an account. Only creating
one does.

CI grew a step this week too: worker types now get generated from
committed `.dev.vars.example` files before typechecking, so secrets like
`BETTER_AUTH_SECRET` type-check correctly without a real `.dev.vars` ever
touching CI.
