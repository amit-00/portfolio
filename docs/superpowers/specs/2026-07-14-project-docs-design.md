# Project Documentation Pages — Design

**Date:** 2026-07-14
**Status:** Approved

## Goal

Add markdown-based documentation pages for portfolio projects. A folder structure of markdown files defines the routes; the app renders each file as a webpage styled consistently with the rest of the portfolio. Docs support images and local video files. Landing-page project cards link to their project's docs.

## Content model & routing

Markdown lives in a new `content/` folder at the repo root. Folders map 1:1 to URL paths:

```
content/
  projects/
    pulsefm/
      index.md          → /projects/pulsefm
      architecture.md   → /projects/pulsefm/architecture
      infra/
        deployment.md   → /projects/pulsefm/infra/deployment
    flower-city-run-club/
      index.md          → /projects/flower-city-run-club
```

- Every folder must have an `index.md` (that folder's landing page). Nesting can be any depth.
- Optional YAML frontmatter per file:
  - `title` — falls back to the first `# heading`, then the filename.
  - `order` — number for sidebar sorting; falls back to alphabetical by title.
- Media assets (images, videos) live in `public/projects/<slug>/` and are referenced from markdown with absolute paths (e.g. `/projects/pulsefm/demo.mp4`), served statically by Next with no extra config.

**Routing:** a single dynamic route, `app/projects/[...slug]/page.tsx`. `generateStaticParams` walks `content/projects/` at build time, so every doc page is fully static — no runtime file reads in production. A URL with no matching markdown file calls `notFound()`.

**Landing page integration:** each project in `lib/data.ts` gets an optional `docs` slug field. When set, the card's image and title link internally to `/projects/<slug>`. The Website and GitHub badges keep their external links.

## Rendering, media & styling

**Pipeline:** server-rendered with `react-markdown` + `remark-gfm` (tables, strikethrough, task lists). Frontmatter is parsed separately with `gray-matter` so it never leaks into the rendered body. No client-side JS is added for doc content.

**Media via custom renderers** (standard markdown syntax only, no raw HTML):

- `![alt](/projects/pulsefm/diagram.png)` → responsive image (rounded corners, border, `max-width: 100%`).
- `![caption](/projects/pulsefm/demo.mp4)` → the image renderer checks the extension; `.mp4`/`.webm`/`.mov` render as native `<video controls>` with the same rounded/bordered treatment, using the alt text as an accessible label/caption.

**Styling:** `components/markdown.tsx` maps each markdown element (`h1`–`h3`, `p`, `a`, `ul`, `ol`, `code`, `pre`, `blockquote`, `table`, `hr`, …) to Tailwind classes using the existing design tokens (`text-foreground`, `text-muted-foreground`, `border-border`, `bg-background`), matching the landing page's type scale (`text-2xl font-bold` headings, `text-muted-foreground` body). No typography plugin — explicit element mapping keeps doc pages visually identical to the rest of the site and theme-aware (light/dark) automatically.

**Page layout:** doc pages reuse the site shell — centered content column based on the landing page's `max-w-2xl` (widened on desktop to fit the sidebar), same top padding, `FloatingDock` and `Footer` via the root layout.

**Sidebar:** `components/docs-sidebar.tsx`, a server component. For the current project (first slug segment) it walks that project's content folder and renders a nested list of page links:

- Sticky left column on desktop; collapsible section above the content on mobile.
- Current page highlighted `text-foreground`; other links `text-muted-foreground`.
- "← Back to portfolio" link at the top.

## Error handling

- Unknown route (no matching `.md` file) → `notFound()` renders Next's 404. No silent fallbacks.
- Malformed frontmatter → build fails with an error naming the offending file (fail fast at build time, never at request time).
- Folder missing `index.md` → child pages still build; the folder's sidebar link is omitted and a build-time warning names the folder.
- Broken media paths are a content problem: the browser shows a broken image/video; no special handling.

## Testing

Unit tests (via `bun:test` — bun is already the toolchain, zero new test deps) cover the pure content layer in `lib/content.ts`:

- Slug ↔ file-path resolution: nested paths, `index.md` handling, rejecting path traversal (`../`).
- Frontmatter parsing and fallbacks: title (frontmatter → first heading → filename), order sorting.
- Sidebar tree generation from a fixture content folder.

Rendering and styling are verified by eye in `next dev`; `next build` confirms static generation succeeds.

## New dependencies

`react-markdown`, `remark-gfm`, `gray-matter` — all small, typed, widely used. Nothing else.

## Components summary

| Unit | Purpose |
| --- | --- |
| `content/projects/**` | Markdown content; folder structure = routes |
| `public/projects/<slug>/` | Images and video files for each project |
| `lib/content.ts` | Pure content layer: walk folders, resolve slugs, parse frontmatter, build sidebar tree |
| `app/projects/[...slug]/page.tsx` | Dynamic route: static params, load + render markdown, 404 handling |
| `components/markdown.tsx` | Markdown element → styled component mapping (incl. image/video renderer) |
| `components/docs-sidebar.tsx` | Per-project navigation from folder tree |
| `lib/data.ts` change | Optional `docs` slug per project; card links internally when present |
