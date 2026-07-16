# Editorial Posts — Design

**Date:** 2026-07-16
**Status:** Approved

## Summary

Add an editorial feature to project documentation. Each project can carry a
folder of markdown posts (dev logs, updates, retrospectives) that surface as a
card list on the project overview page and as an "Editorial" group in the docs
sidebar. Posts are ordinary doc pages — they render through the existing
catch-all route and Markdown renderer — but they additionally participate in a
chronological, card-based index on the overview.

## Goals

- Author a post by dropping a markdown file into a project's `posts/` folder.
- Show those posts as rich cards (image, title, date, excerpt) on the project
  overview, newest first.
- Expose posts in the sidebar under an "Editorial" group.
- Reuse the existing content layer, route, and Markdown renderer — no parallel
  system.

## Non-goals

- No standalone editorial landing page (`/projects/<slug>/posts`). The card
  index lives only on the overview.
- No top-level `/blog`. Posts are per-project and live in the project folder.
- No tags, categories, pagination, or RSS. (YAGNI — revisit if needed later.)

## Content model

Posts live in `content/projects/<slug>/posts/*.md`. Frontmatter:

| Field     | Required | Behavior when present                          | Behavior when absent                                             |
|-----------|----------|------------------------------------------------|------------------------------------------------------------------|
| `title`   | No       | Used as card title and page title.             | Falls back to `#` heading, then humanized filename (existing rule). |
| `date`    | **Yes**  | ISO `YYYY-MM-DD`; drives sort order and the card/page date. | Build fails with an actionable error naming the file.            |
| `excerpt` | No       | Used verbatim as the card summary.             | Derived from the first paragraph of the post body.               |
| `image`   | No       | Rendered as the card thumbnail.                | Card renders text-only (no thumbnail).                           |

Example:

```markdown
---
title: Shipping real-time sync
date: 2026-03-03
excerpt: How I replaced polling with Server-Sent Events across every listener.
image: /posts/sse-cover.jpg
---

# Shipping real-time sync

How I replaced polling with SSE…
```

### Date validation

`date` must parse as a valid calendar date. A missing, empty, or unparseable
`date` throws an `Error` during content loading (build time), with a message
naming the offending file and the expected `YYYY-MM-DD` format. This matches
the strict-parser precedent already in `parseDocFile` (malformed frontmatter).

### Excerpt derivation

When `excerpt` is absent, derive it from the first non-empty paragraph of the
post body (after stripping the leading `#` heading if present). Collapse
whitespace to a single line. A shared pure helper performs this so it is unit
testable in isolation.

## Content layer (`lib/content.ts`)

New public interface:

```ts
export interface PostMeta {
  slug: string[];        // e.g. ["pulsefm", "posts", "shipping-real-time-sync"]
  title: string;
  date: string;          // ISO YYYY-MM-DD as authored
  excerpt: string;       // explicit or derived
  image: string | null;  // frontmatter image or null
}

export function getProjectPosts(
  projectSlug: string,
  contentDir?: string,
): PostMeta[];
```

Behavior:

- Reads `<contentDir>/<projectSlug>/posts/`. Returns `[]` when the project or
  `posts/` folder does not exist.
- Parses every `*.md` file in `posts/` except `index.md` (reserved; see
  Sidebar). Non-`.md` entries and subdirectories are ignored.
- Sorts by `date` descending (newest first). Ties break by `title` ascending
  for determinism.
- Validates `date` per the rules above.

A reserved-name constant (e.g. `POSTS_DIR = "posts"`) is shared between
`getProjectPosts` and `getSidebarTree` so the convention lives in one place.

## Sidebar (`getSidebarTree` / `buildTree`)

The `posts/` folder is treated as a reserved group rather than a generic
folder:

- It renders as a single group node titled **"Editorial"**.
- The group header `href` points to the overview anchor:
  `/projects/<projectSlug>#editorial`.
- Its children are the post pages, sorted **newest-first by `date`** (not by
  the generic `order`/title rule used elsewhere).
- The Editorial group sorts **after** the regular doc pages/folders of the
  project. (It has no `order`; regular ordered nodes precede it, and it is
  pinned last among the project's top-level nodes.)
- Any `posts/index.md` is ignored for navigation (it does not become a child
  and does not override the "Editorial" label).

Only the top-level `posts/` folder directly under a project is treated as
reserved. A `posts/` folder nested deeper is not special-cased (out of scope).

## Overview page (`app/projects/[...slug]/page.tsx`)

- When `slug.length === 1` (project root), call `getProjectPosts(slug[0])` and
  render an `<EditorialSection id="editorial">` **below** the `<Markdown>`
  article.
- When there are no posts, render nothing (no heading, no empty state).
- The section reuses the same content column width as the article.

### `EditorialSection` component

- Props: `posts: PostMeta[]`.
- Renders an "Editorial" heading and a list of cards, one per post, each
  linking to the post page (`/projects/<...slug>`).
- Card layout: optional thumbnail (from `image`), title, formatted date,
  excerpt. When `image` is null, render a text-only card.
- Date formatting: human-readable (e.g. "Mar 3, 2026") via a shared formatter.

## Individual post pages

No new route. Posts render through the existing catch-all route and
`getDocPage`. The only addition: when the current slug is a post
(`slug[1] === "posts"` and `slug.length === 3`), the route renders a small
header showing the formatted `date` above the `<Markdown>` article. The date
is read from the post's frontmatter (via `getProjectPosts` lookup or a direct
parse of the resolved file).

`getAllDocSlugs` already discovers `posts/*.md`, so post pages are statically
generated with no route changes.

## Error handling

- Missing/invalid `date`: throw at load time with the file path and expected
  format. Fails the build loudly rather than silently dropping the post.
- Malformed frontmatter: already handled by `parseDocFile`.
- Absent `posts/` folder: not an error — `getProjectPosts` returns `[]` and the
  section/sidebar group are omitted.

## Testing

Follow the existing `lib/__tests__/fixtures` + `bun test` pattern.

**`getProjectPosts` (unit):**
- Sorts newest-first by `date`.
- Throws a descriptive error on missing/invalid `date`.
- Derives excerpt from the first paragraph when `excerpt` is absent; uses
  explicit `excerpt` when present.
- Returns `image: null` when absent; the frontmatter value when present.
- Returns `[]` when the `posts/` folder or project is absent.
- Ignores `posts/index.md` and non-`.md` entries.

**Sidebar (unit):**
- `posts/` renders as an "Editorial" group with the overview-anchor href.
- Children are sorted newest-first by `date`.
- The Editorial group sorts after regular doc nodes.

**`EditorialSection` (component):**
- Renders one card per post with title, formatted date, and excerpt.
- Renders a thumbnail when `image` is set; text-only card when null.
- Renders nothing when `posts` is empty.

Add fixtures under `lib/__tests__/fixtures` for a project with a `posts/`
folder covering: explicit vs derived excerpt, with vs without image, and a
malformed (missing-date) post in an isolated fixture for the error case.

## Files touched

- `lib/content.ts` — `PostMeta`, `getProjectPosts`, excerpt/date helpers,
  reserved `posts/` handling in `buildTree`.
- `lib/content.test.ts` — new cases; new fixtures under `lib/__tests__/fixtures`.
- `components/editorial-section.tsx` — new component (+ test).
- `app/projects/[...slug]/page.tsx` — render `EditorialSection` on the
  overview; date header on post pages.
- Shared date formatter (new small util in `lib/utils.ts` or a dedicated file).
