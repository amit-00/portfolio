---
title: "Pointing the domain at production, and a logo to match"
date: 2026-07-09
excerpt: huddl.gg goes live, Sentry gets wired up, and the game picker becomes a proper part of the lobby instead of an afterthought.
---

# Pointing the domain at production, and a logo to match

This was the day Huddl stopped being "something running on a
`workers.dev` subdomain" and became a real product address: both the
frontend and the game-service Worker got pointed at `huddl.gg`, alongside
"Prepare Huddl for production," a new logo, and `next.config.ts` wrapped
with Sentry's source-map upload so a production error would actually point
back to real source lines instead of a minified stack trace.

The other piece of that day was interaction design, not infrastructure: a
sliding `GamePickerPanel` for switching games from inside the lobby, with a
short design spec and implementation plan written *before* the component
— small enough not to be overkill, but real enough that the panel's
behavior didn't get improvised while building it. The lobby also got a
default game (Imposter) so a fresh room isn't a blank "pick something"
screen the first time anyone opens it.

Small detail worth keeping honest in the record: one of that day's commits
is literally titled "Fix CI and deployt" — a typo, left as-is in the log.
Not every commit message is a design decision.
