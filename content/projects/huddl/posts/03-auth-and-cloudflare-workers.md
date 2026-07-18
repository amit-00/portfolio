---
title: "Google sign-in, and moving the frontend from Vercel to Cloudflare Workers"
date: 2026-07-16
excerpt: Hosting rooms now requires an account. better-auth backed by D1 and KV, session verification inside the WebSocket upgrade itself, and both apps finally living on one platform.
---

# Google sign-in, and moving the frontend from Vercel to Cloudflare Workers

My goals for this iteration were:

- Google sign-in with real accounts
- Require an account to host a room (joining stays open to guests)
- Verify sessions on the WebSocket upgrade without adding latency
- Get both apps onto the same platform

Up to this point, `apps/huddl` was deployed to Vercel while `game-service`
ran on Cloudflare Workers. Two platforms meant no shared bindings, so the
Next.js app couldn't touch the same storage the game Worker could. Adding
auth was the forcing function to fix that. I chose
[better-auth](https://www.better-auth.com/) for the auth layer, and it needs
a database for users and sessions plus a fast cache for session reads and
rate-limit state. On Cloudflare those map naturally onto
[D1](https://developers.cloudflare.com/d1/) (SQLite) and
[KV](https://developers.cloudflare.com/kv/), and the cleanest way to get
those bindings into the Next.js app was to run it on Cloudflare too. So the
frontend moved to [`@opennextjs/cloudflare`](https://opennext.js.org/cloudflare),
which compiles the Next.js build into a Worker, and both apps have lived on
one platform since.

![Multi Cloud architecture](/huddl/multi_cloud.png)
> **Before**: Multi-cloud, hard to support better auth

![Single Cloud architecture](/huddl/single_cloud.png)
> **After**: Single cloud, fully supported access to D1 and KV

## The auth setup

better-auth runs inside the Next.js app and owns the whole sign-in flow.
The configuration does a few things worth calling out:

- **D1 is the source of truth.** Users, sessions, and accounts live in
  SQLite, accessed through drizzle. `storeSessionInDatabase` stays on even
  though KV serves most reads, more on why below.
- **KV is the session cache.** better-auth's `secondaryStorage` writes each
  session to KV keyed by the raw session token, with the session and user
  serialized as JSON.
- **Rate limiting rides on KV too**, with tighter windows on the sign-in
  and OAuth callback routes. One catch: Cloudflare KV TTLs must be at
  least 60 seconds, so any rate-limit window below that would crash on
  write.
- **The session cookie is scoped to `.huddl.gg`.** This is the quiet
  detail everything else depends on. The game Worker lives on
  `api.huddl.gg`, and a host-only cookie would never be sent there.

![Sign-in screen](/huddl/signin.png)

## Verifying sessions on the WebSocket upgrade

The harder part wasn't the sign-in flow, it was what happens when a client
connects. `game-service` is a separate Worker from the Next.js app, so the
obvious approach is to call an API route on the app and ask "is this
session valid?". But that adds a network hop to every single connection
attempt, and it makes the game runtime depend on the frontend being
reachable at all.

Instead, the Durable Object verifies the session itself, in three steps:

1. **Read the cookie.** The upgrade request carries
   `better-auth.session_token`, whose value is the token plus an
   HMAC-SHA256 signature of it.
2. **Check the signature locally.** WebCrypto verifies the HMAC against
   `BETTER_AUTH_SECRET`, a secret both Workers share. A forged or
   tampered cookie dies here without any storage read.
3. **Look up the session.** KV first, since it's the fast path. KV is
   eventually consistent though, so a miss falls back to a single D1
   query joining the session and user tables, the source of truth.

```typescript
async function authenticateRequest(
  request: Request,
  env: Pick<Env, "AUTH_KV" | "AUTH_DB" | "BETTER_AUTH_SECRET">,
): Promise<AuthContext | null> {
  const token = await getSessionToken(request, env.BETTER_AUTH_SECRET);
  if (token === null) return null; // null means "treat as guest", not "error"
  return validateSession(token, env);
}
```

![Session verification flow](/huddl/auth_flow.png)
> **Session Verification Flow**: the upgrade request path

Notice that an invalid or missing session doesn't reject the connection but
instead degrades to a guest identity. Joining an existing room shouldn't require
an account; only creating one does, and that gate lives in the lobby
engine's join logic rather than at the connection layer. The engine from
the last post already receives an identity on `handleJoin`, so the auth
layer just changed what that identity can be:

```typescript
type JoinIdentity =
  | { kind: "user"; userId: string; displayName: string | null; handle: string | null }
  | { kind: "guest"; displayName: string; guestId: string };
```

The tradeoff of doing verification in-Worker is coupling: `game-service`
now depends on better-auth internals: the cookie format, the signature
scheme, the shape of what `secondaryStorage` writes to KV. If better-auth
changes any of those, the fallback to D1 keeps sign-ins working but the
fast path silently disappears. I took that deal for zero added hops on
every connection and no runtime dependency between the two Workers.

## Alternative Session Hanlding

The alternative I've explored is instead having jwt based sessions
rather than storage backed sessions. This would remove the need to
verify against the DB's at all for session verification. There are
tradeoffs to this approach, mainly you lose the ability to revoke a
session or sessions. However the gains in reduced complexity seem worth
it and make sense for an application with non-critical data.

With the JWT approach, verification would stop at the HMAC check. The
JWT will contain all the details required by the service to identify the
user.

A migration to JWT is likely next, however right now we do have a working
auth solution

## CI and typed secrets

CI grew a step this week too. `wrangler types` generates the `Env`
interface for each Worker, but it only includes secrets like
`BETTER_AUTH_SECRET` if a `.dev.vars` file exists when it runs. Real
secrets obviously never touch CI, so each Worker commits a
`.dev.vars.example` with placeholder values, and CI copies it into place
before generating types and typechecking. The secret names type-check;
the secret values stay out of the repo.
