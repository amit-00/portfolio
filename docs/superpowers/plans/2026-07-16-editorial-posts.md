# Editorial Posts Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let each project carry a `posts/` folder of markdown posts that render as date-sorted cards on the project overview and as an "Editorial" group in the docs sidebar.

**Architecture:** Extend the existing file-based content layer (`lib/content.ts`) with a `getProjectPosts` reader and reserved `posts/` handling in the sidebar builder. Reuse the existing catch-all route and Markdown renderer for individual post pages; add one server component (`EditorialSection`) rendered below the overview article. No new routes, no new dependencies.

**Tech Stack:** Next.js 16 (App Router, RSC), React 19, TypeScript (strict), gray-matter, Tailwind v4, `bun test` for unit/component tests.

## Global Constraints

- **No new dependencies.** Use only what's already in `package.json` (gray-matter, next, react, clsx, tailwind-merge).
- **Strict typing.** No `any`. Annotate all signatures and return types. No untyped variables.
- **Content dir override.** Every content-layer function keeps its `contentDir: string = CONTENT_DIR` final parameter so tests can point at fixtures. New functions follow the same pattern.
- **Reserved folder name is `posts`**, defined once as a shared constant `POSTS_DIR = "posts"` and referenced everywhere.
- **Editorial group label is exactly `"Editorial"`** and the overview anchor id is exactly `editorial`.
- **Date format authored as `YYYY-MM-DD`.** Stored/compared as a normalized `YYYY-MM-DD` string.
- **Tests:** bun's test runner (`import { describe, test, expect } from "bun:test"`). Fixtures live under `lib/__tests__/fixtures`. Do not modify existing `alpha`/`beta`/`bad` fixtures — their expectations are asserted exactly.
- **TDD:** failing test first, minimal implementation, then commit. Small, frequent commits.

---

### Task 1: Refactor `parseDocFile` into reusable helpers

Behavior-preserving refactor so post parsing can share frontmatter reading and title resolution with doc parsing (DRY). No public API changes; existing tests must stay green.

**Files:**
- Modify: `lib/content.ts` (the `parseDocFile` region, ~lines 42-65)
- Test: `lib/content.test.ts` (existing suite is the regression guard — no new tests)

**Interfaces:**
- Consumes: nothing new.
- Produces (module-internal, used by Task 2):
  - `readMatter(filePath: string): ReturnType<typeof matter>`
  - `resolveTitle(parsed: ReturnType<typeof matter>, filePath: string): string`

- [ ] **Step 1: Run the existing suite to confirm a green baseline**

Run: `bun test lib/content.test.ts`
Expected: PASS (all existing tests green).

- [ ] **Step 2: Extract `readMatter` and `resolveTitle`, rewrite `parseDocFile` to use them**

Replace the current `parseDocFile` function (the block starting `function parseDocFile(filePath: string): ParsedDoc {`) with these three functions:

```ts
function readMatter(filePath: string): ReturnType<typeof matter> {
  const raw = fs.readFileSync(filePath, "utf-8");
  try {
    return matter(raw);
  } catch (error) {
    throw new Error(
      `Malformed frontmatter in ${filePath}: ${
        error instanceof Error ? error.message : String(error)
      }. Fix the YAML block at the top of the file.`,
    );
  }
}

function resolveTitle(
  parsed: ReturnType<typeof matter>,
  filePath: string,
): string {
  const frontmatterTitle =
    typeof parsed.data.title === "string" ? parsed.data.title : null;
  const headingTitle = parsed.content.match(/^#\s+(.+)$/m)?.[1]?.trim() ?? null;
  const baseName = path.basename(filePath, ".md");
  const fallbackName =
    baseName === "index" ? path.basename(path.dirname(filePath)) : baseName;
  return frontmatterTitle ?? headingTitle ?? humanizeFilename(fallbackName);
}

function parseDocFile(filePath: string): ParsedDoc {
  const parsed = readMatter(filePath);
  return {
    title: resolveTitle(parsed, filePath),
    order: typeof parsed.data.order === "number" ? parsed.data.order : null,
    content: parsed.content,
  };
}
```

- [ ] **Step 3: Run the suite to verify no regressions**

Run: `bun test lib/content.test.ts`
Expected: PASS (same tests still green, including the malformed-frontmatter and title-fallback cases).

- [ ] **Step 4: Commit**

```bash
git add lib/content.ts
git commit -m "refactor: extract readMatter and resolveTitle helpers"
```

---

### Task 2: Add `getProjectPosts` and `PostMeta` to the content layer

Read `posts/*.md`, validate/normalize the date, derive the excerpt, and sort newest-first.

**Files:**
- Modify: `lib/content.ts` (add `POSTS_DIR`, `PostMeta`, helpers, `getProjectPosts`)
- Create fixtures:
  - `lib/__tests__/fixtures/gamma/index.md`
  - `lib/__tests__/fixtures/gamma/intro.md`
  - `lib/__tests__/fixtures/gamma/posts/index.md`
  - `lib/__tests__/fixtures/gamma/posts/first-post.md`
  - `lib/__tests__/fixtures/gamma/posts/second-post.md`
  - `lib/__tests__/fixtures/deltabad/index.md`
  - `lib/__tests__/fixtures/deltabad/posts/no-date.md`
- Test: `lib/content.test.ts` (new `describe("getProjectPosts")` block)

**Interfaces:**
- Consumes: `readMatter`, `resolveTitle`, `isValidSlug`, `CONTENT_DIR` (Task 1 / existing).
- Produces (used by Tasks 3, 5, 6):
  - `export const POSTS_DIR = "posts";`
  - `export interface PostMeta { slug: string[]; title: string; date: string; excerpt: string; image: string | null; }`
  - `export function getProjectPosts(projectSlug: string, contentDir?: string): PostMeta[]` — returns posts sorted by `date` descending (ties: `title` ascending). `date` is normalized `YYYY-MM-DD`. Throws on a missing/invalid post date. Returns `[]` when the project or `posts/` folder is absent. Ignores `index.md`, non-`.md` files, and subdirectories.

- [ ] **Step 1: Create the fixture files**

`lib/__tests__/fixtures/gamma/index.md`:
```markdown
---
title: Gamma
---

# Gamma

Gamma project overview.
```

`lib/__tests__/fixtures/gamma/intro.md`:
```markdown
---
title: Intro
order: 1
---

# Intro

A regular doc page.
```

`lib/__tests__/fixtures/gamma/posts/index.md` (must be ignored by `getProjectPosts`):
```markdown
---
title: Should Be Ignored
---

This index file is not a post.
```

`lib/__tests__/fixtures/gamma/posts/first-post.md` (explicit excerpt + image, older date):
```markdown
---
title: First Post
date: 2026-01-10
excerpt: An explicit excerpt for the first post.
image: /posts/first.jpg
---

# First Post

Body paragraph that should NOT be used as the excerpt.
```

`lib/__tests__/fixtures/gamma/posts/second-post.md` (no excerpt, no image, newer date):
```markdown
---
title: Second Post
date: 2026-03-05
---

# Second Post

This first paragraph becomes the derived   excerpt.

A second paragraph that is ignored.
```

`lib/__tests__/fixtures/deltabad/index.md`:
```markdown
---
title: Delta Bad
---

# Delta Bad

Project whose post is missing a date.
```

`lib/__tests__/fixtures/deltabad/posts/no-date.md` (no `date` — must throw):
```markdown
---
title: No Date
---

# No Date

This post has no date frontmatter.
```

- [ ] **Step 2: Write the failing tests**

Append to `lib/content.test.ts` (it already imports from `@/lib/content`; add `getProjectPosts` to that import):

```ts
describe("getProjectPosts", () => {
  test("returns posts sorted newest-first by date", () => {
    const posts = getProjectPosts("gamma", FIXTURES);
    expect(posts.map((p) => p.title)).toEqual(["Second Post", "First Post"]);
  });

  test("normalizes date to YYYY-MM-DD and builds the post slug", () => {
    const [newest] = getProjectPosts("gamma", FIXTURES);
    expect(newest.date).toBe("2026-03-05");
    expect(newest.slug).toEqual(["gamma", "posts", "second-post"]);
  });

  test("uses an explicit excerpt when present", () => {
    const first = getProjectPosts("gamma", FIXTURES).find(
      (p) => p.title === "First Post",
    );
    expect(first?.excerpt).toBe("An explicit excerpt for the first post.");
  });

  test("derives the excerpt from the first paragraph, collapsing whitespace", () => {
    const second = getProjectPosts("gamma", FIXTURES).find(
      (p) => p.title === "Second Post",
    );
    expect(second?.excerpt).toBe("This first paragraph becomes the derived excerpt.");
  });

  test("exposes image when set and null when absent", () => {
    const posts = getProjectPosts("gamma", FIXTURES);
    expect(posts.find((p) => p.title === "First Post")?.image).toBe("/posts/first.jpg");
    expect(posts.find((p) => p.title === "Second Post")?.image).toBeNull();
  });

  test("ignores index.md inside posts/", () => {
    const posts = getProjectPosts("gamma", FIXTURES);
    expect(posts.map((p) => p.title)).not.toContain("Should Be Ignored");
  });

  test("returns [] when the project or posts folder is absent", () => {
    expect(getProjectPosts("alpha", FIXTURES)).toEqual([]);
    expect(getProjectPosts("nope", FIXTURES)).toEqual([]);
  });

  test("throws a descriptive error when a post is missing its date", () => {
    expect(() => getProjectPosts("deltabad", FIXTURES)).toThrow(
      /no-date\.md/,
    );
  });
});
```

- [ ] **Step 3: Run the tests to verify they fail**

Run: `bun test lib/content.test.ts`
Expected: FAIL — `getProjectPosts` is not exported / not a function.

- [ ] **Step 4: Implement `getProjectPosts` and helpers**

Add near the top of `lib/content.ts`, just below the `CONTENT_DIR` constant:

```ts
export const POSTS_DIR = "posts";

export interface PostMeta {
  slug: string[];
  title: string;
  date: string; // normalized YYYY-MM-DD
  excerpt: string;
  image: string | null;
}
```

Add these helpers (place them near the other file-scope helpers, after `resolveTitle`):

```ts
// gray-matter parses an unquoted `date: 2026-03-05` as a Date; a quoted value
// arrives as a string. Accept both, reject everything else, and normalize to a
// timezone-stable YYYY-MM-DD string.
function normalizeDate(value: unknown, filePath: string): string {
  let parsed: Date | null = null;
  if (value instanceof Date) {
    parsed = value;
  } else if (typeof value === "string" && value.trim() !== "") {
    parsed = new Date(value.trim());
  }
  if (parsed === null || Number.isNaN(parsed.getTime())) {
    throw new Error(
      `Missing or invalid "date" in ${filePath}: ${
        value === undefined ? "no date provided" : `"${String(value)}"`
      }. Add a frontmatter date in YYYY-MM-DD format.`,
    );
  }
  return parsed.toISOString().slice(0, 10);
}

function deriveExcerpt(content: string): string {
  const firstProse = content
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter((block) => block.length > 0)
    .find((block) => !block.startsWith("#"));
  return (firstProse ?? "").replace(/\s+/g, " ").trim();
}

function parsePostFile(filePath: string, slug: string[]): PostMeta {
  const parsed = readMatter(filePath);
  const explicitExcerpt =
    typeof parsed.data.excerpt === "string" && parsed.data.excerpt.trim() !== ""
      ? parsed.data.excerpt.trim()
      : null;
  const image =
    typeof parsed.data.image === "string" && parsed.data.image.trim() !== ""
      ? parsed.data.image.trim()
      : null;
  return {
    slug,
    title: resolveTitle(parsed, filePath),
    date: normalizeDate(parsed.data.date, filePath),
    excerpt: explicitExcerpt ?? deriveExcerpt(parsed.content),
    image,
  };
}

function comparePosts(a: PostMeta, b: PostMeta): number {
  if (a.date !== b.date) return a.date < b.date ? 1 : -1; // date descending
  return a.title.localeCompare(b.title);
}
```

Add the public reader (place it after `getSidebarTree` or near the other exports):

```ts
export function getProjectPosts(
  projectSlug: string,
  contentDir: string = CONTENT_DIR,
): PostMeta[] {
  if (!isValidSlug([projectSlug])) return [];
  const postsDir = path.join(contentDir, projectSlug, POSTS_DIR);
  if (!fs.existsSync(postsDir)) return [];
  const posts: PostMeta[] = [];
  for (const entry of fs.readdirSync(postsDir, { withFileTypes: true })) {
    if (!entry.isFile()) continue;
    if (!entry.name.endsWith(".md") || entry.name === "index.md") continue;
    const name = entry.name.slice(0, -".md".length);
    posts.push(
      parsePostFile(path.join(postsDir, entry.name), [
        projectSlug,
        POSTS_DIR,
        name,
      ]),
    );
  }
  return posts.sort(comparePosts);
}
```

- [ ] **Step 5: Run the tests to verify they pass**

Run: `bun test lib/content.test.ts`
Expected: PASS (all new `getProjectPosts` tests plus the unchanged existing suite).

- [ ] **Step 6: Commit**

```bash
git add lib/content.ts lib/content.test.ts lib/__tests__/fixtures/gamma lib/__tests__/fixtures/deltabad
git commit -m "feat: add getProjectPosts reader to content layer"
```

---

### Task 3: Render `posts/` as an "Editorial" sidebar group

The sidebar should skip the raw `posts/` folder and instead append a single "Editorial" group linking to the overview anchor, with post children newest-first.

**Files:**
- Modify: `lib/content.ts` (`getSidebarTree`, `buildTree` signature; add `buildEditorialGroup`)
- Test: `lib/content.test.ts` (new tests in the existing `describe("getSidebarTree")` block)

**Interfaces:**
- Consumes: `getProjectPosts`, `POSTS_DIR`, `hrefForSlug` (existing), `SidebarNode` (existing).
- Produces: `getSidebarTree` now returns regular nodes followed by (when posts exist) one `SidebarNode` with `title: "Editorial"`, `href: "/projects/<slug>#editorial"`, and post children.

- [ ] **Step 1: Write the failing tests**

Add inside the existing `describe("getSidebarTree", ...)` block in `lib/content.test.ts`:

```ts
test("appends an Editorial group after regular nodes when posts exist", () => {
  const tree = getSidebarTree("gamma", FIXTURES);
  expect(tree.map((n) => n.title)).toEqual(["Intro", "Editorial"]);
});

test("Editorial group links to the overview anchor", () => {
  const editorial = getSidebarTree("gamma", FIXTURES).find(
    (n) => n.title === "Editorial",
  );
  expect(editorial?.href).toBe("/projects/gamma#editorial");
});

test("Editorial children are posts, newest-first, with real hrefs", () => {
  const editorial = getSidebarTree("gamma", FIXTURES).find(
    (n) => n.title === "Editorial",
  );
  expect(editorial?.children.map((c) => c.title)).toEqual([
    "Second Post",
    "First Post",
  ]);
  expect(editorial?.children.map((c) => c.href)).toEqual([
    "/projects/gamma/posts/second-post",
    "/projects/gamma/posts/first-post",
  ]);
});

test("no Editorial group when the project has no posts", () => {
  const tree = getSidebarTree("alpha", FIXTURES);
  expect(tree.map((n) => n.title)).not.toContain("Editorial");
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `bun test lib/content.test.ts`
Expected: FAIL — `getSidebarTree("gamma")` currently returns a raw `Posts` folder node, not an `Editorial` group.

- [ ] **Step 3: Add a top-level skip to `buildTree`**

Change the `buildTree` signature and its loop guard. Replace the signature line:

```ts
function buildTree(dir: string, slugPrefix: string[]): SidebarNode[] {
```

with:

```ts
function buildTree(
  dir: string,
  slugPrefix: string[],
  skip: readonly string[] = [],
): SidebarNode[] {
```

Then, as the first statement inside the `for (const entry of ...)` loop, add:

```ts
    if (skip.includes(entry.name)) continue;
```

(The recursive call inside `buildTree` stays `buildTree(entryPath, childSlug)` with no `skip` — only the project's top level skips `posts/`.)

- [ ] **Step 4: Build the Editorial group in `getSidebarTree`**

Replace the body of `getSidebarTree` so it skips `posts/` and appends the group. The final `return buildTree(projectDir, [projectSlug]);` line becomes:

```ts
  const nodes = buildTree(projectDir, [projectSlug], [POSTS_DIR]);
  const editorial = buildEditorialGroup(projectSlug, contentDir);
  return editorial ? [...nodes, editorial] : nodes;
```

Add this helper directly below `getSidebarTree`:

```ts
function buildEditorialGroup(
  projectSlug: string,
  contentDir: string,
): SidebarNode | null {
  const posts = getProjectPosts(projectSlug, contentDir);
  if (posts.length === 0) return null;
  return {
    title: "Editorial",
    href: `/projects/${projectSlug}#editorial`,
    order: null,
    children: posts.map((post) => ({
      title: post.title,
      href: hrefForSlug(post.slug),
      order: null,
      children: [],
    })),
  };
}
```

- [ ] **Step 5: Run the tests to verify they pass**

Run: `bun test lib/content.test.ts`
Expected: PASS (new Editorial tests plus the unchanged `alpha`/`beta` sidebar tests).

- [ ] **Step 6: Commit**

```bash
git add lib/content.ts lib/content.test.ts
git commit -m "feat: render posts folder as Editorial sidebar group"
```

---

### Task 4: Add a shared `formatDate` utility

Human-readable, timezone-stable date formatting for cards and the post-page header.

**Files:**
- Modify: `lib/utils.ts`
- Create: `lib/utils.test.ts`

**Interfaces:**
- Produces (used by Tasks 5, 6): `export function formatDate(iso: string): string` — maps `"2026-03-05"` to `"Mar 5, 2026"` (en-US, UTC, so the day never shifts).

- [ ] **Step 1: Write the failing test**

Create `lib/utils.test.ts`:

```ts
import { describe, test, expect } from "bun:test";
import { formatDate } from "@/lib/utils";

describe("formatDate", () => {
  test("formats an ISO date as 'Mon D, YYYY' without timezone drift", () => {
    expect(formatDate("2026-03-05")).toBe("Mar 5, 2026");
    expect(formatDate("2026-01-10")).toBe("Jan 10, 2026");
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `bun test lib/utils.test.ts`
Expected: FAIL — `formatDate` is not exported.

- [ ] **Step 3: Implement `formatDate`**

Append to `lib/utils.ts`:

```ts
export function formatDate(iso: string): string {
  const date = new Date(`${iso}T00:00:00Z`);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `bun test lib/utils.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add lib/utils.ts lib/utils.test.ts
git commit -m "feat: add formatDate utility"
```

---

### Task 5: Build the `EditorialSection` component

A server component that renders the post cards, or nothing when there are no posts.

**Files:**
- Create: `components/editorial-section.tsx`
- Create: `components/editorial-section.test.tsx`

**Interfaces:**
- Consumes: `PostMeta` (Task 2), `formatDate` (Task 4), `next/link`.
- Produces (used by Task 6): `export function EditorialSection({ posts }: { posts: PostMeta[] }): React.ReactNode` — renders `<section id="editorial">` with one card per post; returns `null` when `posts` is empty.

- [ ] **Step 1: Write the failing test**

Create `components/editorial-section.test.tsx`:

```tsx
import { describe, test, expect } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { EditorialSection } from "@/components/editorial-section";
import type { PostMeta } from "@/lib/content";

const withImage: PostMeta = {
  slug: ["pulsefm", "posts", "shipping-sse"],
  title: "Shipping real-time sync",
  date: "2026-03-05",
  excerpt: "How I replaced polling with SSE.",
  image: "/posts/sse.jpg",
};

const noImage: PostMeta = {
  slug: ["pulsefm", "posts", "voting-rewrite"],
  title: "The voting rewrite",
  date: "2026-01-10",
  excerpt: "Rebuilding the vote tally.",
  image: null,
};

describe("EditorialSection", () => {
  test("renders nothing when there are no posts", () => {
    expect(renderToStaticMarkup(<EditorialSection posts={[]} />)).toBe("");
  });

  test("renders a card per post with title, formatted date, and excerpt", () => {
    const html = renderToStaticMarkup(
      <EditorialSection posts={[withImage, noImage]} />,
    );
    expect(html).toContain('id="editorial"');
    expect(html).toContain("Shipping real-time sync");
    expect(html).toContain("Mar 5, 2026");
    expect(html).toContain("How I replaced polling with SSE.");
    expect(html).toContain("The voting rewrite");
    expect(html).toContain('href="/projects/pulsefm/posts/shipping-sse"');
  });

  test("renders a thumbnail when image is set and omits it when null", () => {
    const html = renderToStaticMarkup(
      <EditorialSection posts={[withImage, noImage]} />,
    );
    expect(html).toContain('src="/posts/sse.jpg"');
    // Exactly one <img> — the image-less post has no thumbnail.
    expect(html.match(/<img/g)?.length).toBe(1);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `bun test components/editorial-section.test.tsx`
Expected: FAIL — module `@/components/editorial-section` not found.

- [ ] **Step 3: Implement the component**

Create `components/editorial-section.tsx`:

```tsx
import Link from "next/link";
import type { PostMeta } from "@/lib/content";
import { formatDate } from "@/lib/utils";

export function EditorialSection({ posts }: { posts: PostMeta[] }) {
  if (posts.length === 0) return null;
  return (
    <section id="editorial" className="mt-16 scroll-mt-24">
      <h2 className="text-2xl font-bold">Editorial</h2>
      <ul className="mt-6 flex flex-col gap-4">
        {posts.map((post) => (
          <li key={post.slug.join("/")}>
            <Link
              href={`/projects/${post.slug.join("/")}`}
              className="group flex gap-4 rounded-xl border border-border p-4 transition-colors hover:bg-border/20"
            >
              {post.image && (
                // eslint-disable-next-line @next/next/no-img-element -- post thumbnails have no intrinsic dimensions, which next/image requires
                <img
                  src={post.image}
                  alt=""
                  className="h-20 w-20 shrink-0 rounded-lg border border-border object-cover"
                />
              )}
              <div className="min-w-0">
                <h3 className="font-bold text-foreground group-hover:text-primary transition-colors">
                  {post.title}
                </h3>
                <time
                  dateTime={post.date}
                  className="mt-1 block text-sm text-muted-foreground"
                >
                  {formatDate(post.date)}
                </time>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {post.excerpt}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `bun test components/editorial-section.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add components/editorial-section.tsx components/editorial-section.test.tsx
git commit -m "feat: add EditorialSection component"
```

---

### Task 6: Wire the route — overview section and post-page date header

Render `EditorialSection` below the overview article, and prepend the formatted date on individual post pages. Add one real demo post to verify end-to-end.

**Files:**
- Modify: `app/projects/[...slug]/page.tsx`
- Create: `content/projects/pulsefm/posts/hello-editorial.md` (demo post; replaceable)
- Create: `public/posts/` cover image is optional — the demo post omits `image`.

**Interfaces:**
- Consumes: `getProjectPosts`, `PostMeta` (Task 2), `EditorialSection` (Task 5), `formatDate` (Task 4).
- Produces: no new exports.

- [ ] **Step 1: Add the demo post**

Create `content/projects/pulsefm/posts/hello-editorial.md`:
```markdown
---
title: Introducing the editorial log
date: 2026-07-16
excerpt: A place for build notes, updates, and retrospectives on PulseFM.
---

# Introducing the editorial log

This is the first entry in PulseFM's editorial log — short posts about what
I'm building, the problems I hit, and how I worked through them.
```

- [ ] **Step 2: Update the route**

Replace the contents of `app/projects/[...slug]/page.tsx` with:

```tsx
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getAllDocSlugs,
  getDocPage,
  getProjectPosts,
  getSidebarTree,
} from "@/lib/content";
import { Markdown } from "@/components/markdown";
import { DocsSidebar } from "@/components/docs-sidebar";
import { EditorialSection } from "@/components/editorial-section";
import { formatDate } from "@/lib/utils";

// Only paths emitted by generateStaticParams exist; everything else 404s
// and no doc page is ever rendered on demand.
export const dynamicParams = false;

interface DocRouteProps {
  params: Promise<{ slug: string[] }>;
}

export function generateStaticParams(): { slug: string[] }[] {
  return getAllDocSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: DocRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const page = getDocPage(slug);
  return { title: page?.title ?? "Not found" };
}

export default async function ProjectDocPage({ params }: DocRouteProps) {
  const { slug } = await params;
  const page = getDocPage(slug);
  if (!page) notFound();

  const projectSlug = slug[0];
  const projectIndex = getDocPage([projectSlug]);
  const nodes = getSidebarTree(projectSlug);
  const posts = getProjectPosts(projectSlug);

  const isOverview = slug.length === 1;
  const post =
    slug.length === 3 && slug[1] === "posts"
      ? posts.find((p) => p.slug.join("/") === slug.join("/"))
      : undefined;

  return (
    <div className="relative pt-24 pb-24">
      <div className="max-w-4xl mx-auto px-4 flex flex-col md:flex-row gap-8 md:gap-12">
        <DocsSidebar
          projectTitle={projectIndex?.title ?? projectSlug}
          projectHref={`/projects/${projectSlug}`}
          nodes={nodes}
          currentHref={`/projects/${slug.join("/")}`}
        />
        <article className="min-w-0 flex-1 max-w-2xl">
          {post && (
            <time
              dateTime={post.date}
              className="block text-sm text-muted-foreground"
            >
              {formatDate(post.date)}
            </time>
          )}
          <Markdown content={page.content} />
          {isOverview && <EditorialSection posts={posts} />}
        </article>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Typecheck and lint**

Run: `bunx tsc --noEmit && bun run lint`
Expected: no type errors; lint passes (the `no-img-element` disable comment in `EditorialSection` keeps the image rule quiet).

- [ ] **Step 4: Build to verify static generation**

Run: `bun run build`
Expected: build succeeds. `/projects/pulsefm/posts/hello-editorial` appears among the generated static routes, and `/projects/pulsefm` builds without error.

- [ ] **Step 5: Manual smoke check**

Run: `bun run dev`, then visit:
- `http://localhost:3000/projects/pulsefm` — the "Editorial" heading and one card ("Introducing the editorial log", "Jul 16, 2026", excerpt) appear below the overview content; the sidebar shows an "Editorial" group with the post nested under it.
- `http://localhost:3000/projects/pulsefm/posts/hello-editorial` — the post renders with the formatted date above the heading.

Expected: both render as described. (You can delete or replace `hello-editorial.md` afterward; the section and sidebar group disappear when a project has no posts.)

- [ ] **Step 6: Run the full test suite**

Run: `bun test`
Expected: PASS (all suites).

- [ ] **Step 7: Commit**

```bash
git add app/projects/[...slug]/page.tsx content/projects/pulsefm/posts/hello-editorial.md
git commit -m "feat: render editorial section and post date on project route"
```

---

## Notes for the implementer

- The whole feature reuses the existing route and Markdown renderer. Do not add a new route segment for posts.
- gray-matter parses an unquoted `date: 2026-03-05` as a JS `Date`; `normalizeDate` handles both `Date` and string — do not assume `parsed.data.date` is a string.
- Keep `POSTS_DIR` the single source of truth for the reserved folder name.
- Only the project's top-level `posts/` folder is special-cased; a nested `posts/` folder deeper in the tree is treated as a normal folder (out of scope).
