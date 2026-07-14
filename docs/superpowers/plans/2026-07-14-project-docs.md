# Markdown Project Documentation Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Render markdown files from a `content/projects/` folder tree as statically generated, portfolio-styled doc pages at `/projects/<...slug>`, with a per-project sidebar and landing-page cards linking in.

**Architecture:** A pure content layer (`lib/content.ts`) walks `content/projects/`, resolves slugs to files, parses frontmatter, and builds sidebar trees. One catch-all route (`app/projects/[...slug]/page.tsx`) statically generates every page and composes a `Markdown` renderer component (react-markdown with custom element mappings, including an image renderer that emits `<video>` for video extensions) and a `DocsSidebar` server component.

**Tech Stack:** Next.js 16 App Router (async `params`), React 19, Tailwind v4 design tokens, bun (`bun add`, `bun test`, `bun run build`), react-markdown, remark-gfm, gray-matter.

**Spec:** `docs/superpowers/specs/2026-07-14-project-docs-design.md`

## Global Constraints

- Runtime dependencies limited to: `react-markdown`, `remark-gfm`, `gray-matter`. Dev dependency: `@types/bun` (types-only, required so `import ... from "bun:test"` type-checks during `next build`, since tsconfig includes `**/*.ts`). This is one devDep beyond the spec's "zero new test dependencies" — flag to user, do not substitute anything else.
- All doc pages fully static: `generateStaticParams` + `export const dynamicParams = false`. No runtime file reads in production.
- Styling uses existing design tokens only (`text-foreground`, `text-muted-foreground`, `border-border`, `bg-background`, `text-primary`) — no typography plugin, no new CSS files.
- Strict typing everywhere; no `any`. Comments in English, explain why only.
- Markdown files may have optional YAML frontmatter: `title: string`, `order: number`.
- Media referenced by absolute public paths (e.g. `/projects/pulsefm/demo.mp4`). Video extensions: `.mp4`, `.webm`, `.mov`.
- Every commit message ends with `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`.
- Package manager is bun (`bun.lock` present). Never use npm/yarn/pnpm.

## File Structure

| File | Responsibility |
| --- | --- |
| `lib/content.ts` | Pure content layer: walk folders, resolve slugs, parse frontmatter, build sidebar tree |
| `lib/content.test.ts` | bun:test unit tests for the content layer |
| `lib/__tests__/fixtures/` | Fixture content tree used by tests (acts as a fake `content/projects/`) |
| `components/markdown.tsx` | Markdown → styled React elements (incl. image/video renderer) |
| `components/markdown.test.tsx` | Rendering tests via `renderToStaticMarkup` |
| `components/docs-sidebar.tsx` | Per-project nav: desktop sticky column + mobile `<details>` |
| `app/projects/[...slug]/page.tsx` | Catch-all route: static params, metadata, page composition, 404 |
| `content/projects/pulsefm/` | Seed content (index + one nested page) |
| `lib/data.ts` | Add typed `Project` interface with optional `docs` slug |
| `app/page.tsx` | Card image/title link internally when `docs` set |

---

### Task 1: Content layer — slug resolution & frontmatter parsing

**Files:**
- Create: `lib/content.ts`
- Create: `lib/content.test.ts`
- Create: `lib/__tests__/fixtures/` (fixture tree below)
- Modify: `package.json` (via `bun add`)

**Interfaces:**
- Consumes: nothing (foundation task).
- Produces:
  - `interface DocPage { slug: string[]; title: string; order: number | null; content: string }`
  - `interface SidebarNode { title: string; href: string | null; order: number | null; children: SidebarNode[] }` (implemented in Task 2, but declare the type here so one file exports both)
  - `getAllDocSlugs(contentDir?: string): string[][]`
  - `getDocPage(slug: string[], contentDir?: string): DocPage | null` (throws `Error` naming the file on malformed frontmatter)

- [ ] **Step 1: Install dependencies**

```bash
cd /Users/amit/Documents/repos/portfolio
bun add gray-matter
bun add -d @types/bun
```

Expected: both appear in `package.json`; `bun.lock` updated.

- [ ] **Step 2: Create fixture content tree**

Create these files exactly:

`lib/__tests__/fixtures/alpha/index.md`
```markdown
---
title: Alpha Overview
---

# Alpha

Welcome to alpha.
```

`lib/__tests__/fixtures/alpha/setup.md`
```markdown
# Setting Up

Steps to set up alpha.
```

`lib/__tests__/fixtures/alpha/zebra.md`
```markdown
---
order: 1
---

No heading here, title must come from the filename.
```

`lib/__tests__/fixtures/alpha/guides/index.md`
```markdown
---
title: Guides
order: 2
---

Guide index.
```

`lib/__tests__/fixtures/alpha/guides/deploy.md`
```markdown
# Deploy

How to deploy.
```

`lib/__tests__/fixtures/beta/index.md`
```markdown
# Beta

Beta project.
```

`lib/__tests__/fixtures/beta/orphan/page.md`
```markdown
# Orphan Page

This folder has no index.md.
```

`lib/__tests__/fixtures/bad/index.md`
```markdown
---
title: [unclosed
---

Broken frontmatter.
```

- [ ] **Step 3: Write the failing tests**

Create `lib/content.test.ts`:

```typescript
import { describe, test, expect } from "bun:test";
import path from "path";
import { getAllDocSlugs, getDocPage } from "@/lib/content";

const FIXTURES = path.join(import.meta.dir, "__tests__", "fixtures");

describe("getAllDocSlugs", () => {
  test("returns a slug for every markdown file, folders via index.md", () => {
    const slugs = getAllDocSlugs(FIXTURES).map((s) => s.join("/"));
    expect(slugs).toContain("alpha");
    expect(slugs).toContain("alpha/setup");
    expect(slugs).toContain("alpha/zebra");
    expect(slugs).toContain("alpha/guides");
    expect(slugs).toContain("alpha/guides/deploy");
    expect(slugs).toContain("beta");
    expect(slugs).toContain("beta/orphan/page");
  });

  test("returns no duplicate slugs", () => {
    const slugs = getAllDocSlugs(FIXTURES).map((s) => s.join("/"));
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  test("returns empty array for a missing content dir", () => {
    expect(getAllDocSlugs(path.join(FIXTURES, "does-not-exist"))).toEqual([]);
  });
});

describe("getDocPage", () => {
  test("resolves a folder slug to its index.md and uses frontmatter title", () => {
    const page = getDocPage(["alpha"], FIXTURES);
    expect(page?.title).toBe("Alpha Overview");
    expect(page?.content).toContain("Welcome to alpha.");
    expect(page?.content).not.toContain("title:");
  });

  test("falls back to the first # heading when frontmatter has no title", () => {
    expect(getDocPage(["alpha", "setup"], FIXTURES)?.title).toBe("Setting Up");
  });

  test("falls back to a humanized filename when there is no heading", () => {
    const page = getDocPage(["alpha", "zebra"], FIXTURES);
    expect(page?.title).toBe("Zebra");
    expect(page?.order).toBe(1);
  });

  test("order is null when frontmatter omits it", () => {
    expect(getDocPage(["alpha", "setup"], FIXTURES)?.order).toBeNull();
  });

  test("resolves nested pages", () => {
    expect(getDocPage(["alpha", "guides", "deploy"], FIXTURES)?.title).toBe("Deploy");
  });

  test("returns null for unknown slugs", () => {
    expect(getDocPage(["nope"], FIXTURES)).toBeNull();
    expect(getDocPage([], FIXTURES)).toBeNull();
  });

  test("rejects path traversal segments", () => {
    expect(getDocPage(["..", "alpha"], FIXTURES)).toBeNull();
    expect(getDocPage(["alpha", "..%2f"], FIXTURES)).toBeNull();
    expect(getDocPage([".hidden"], FIXTURES)).toBeNull();
  });

  test("throws an error naming the file on malformed frontmatter", () => {
    expect(() => getDocPage(["bad"], FIXTURES)).toThrow(/bad(\/|\\)index\.md/);
  });
});
```

- [ ] **Step 4: Run tests to verify they fail**

```bash
bun test lib/content.test.ts
```

Expected: FAIL — cannot resolve `@/lib/content` (module does not exist).

- [ ] **Step 5: Write the implementation**

Create `lib/content.ts`:

```typescript
import fs from "fs";
import path from "path";
import matter from "gray-matter";

const CONTENT_DIR = path.join(process.cwd(), "content", "projects");

export interface DocPage {
  slug: string[];
  title: string;
  order: number | null;
  content: string;
}

export interface SidebarNode {
  title: string;
  href: string | null;
  order: number | null;
  children: SidebarNode[];
}

interface ParsedDoc {
  title: string;
  order: number | null;
  content: string;
}

// Slug segments must be plain file names: no dot-prefixed entries, no
// separators, nothing that could escape the content directory.
const SLUG_SEGMENT = /^[a-zA-Z0-9][a-zA-Z0-9._-]*$/;

function isValidSlug(slug: string[]): boolean {
  return (
    slug.length > 0 &&
    slug.every((segment) => SLUG_SEGMENT.test(segment) && !segment.includes(".."))
  );
}

function humanizeFilename(name: string): string {
  return name.replace(/[-_]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function parseDocFile(filePath: string): ParsedDoc {
  const raw = fs.readFileSync(filePath, "utf-8");
  let parsed: ReturnType<typeof matter>;
  try {
    parsed = matter(raw);
  } catch (error) {
    throw new Error(
      `Malformed frontmatter in ${filePath}: ${
        error instanceof Error ? error.message : String(error)
      }. Fix the YAML block at the top of the file.`,
    );
  }
  const frontmatterTitle =
    typeof parsed.data.title === "string" ? parsed.data.title : null;
  const headingTitle = parsed.content.match(/^#\s+(.+)$/m)?.[1]?.trim() ?? null;
  const baseName = path.basename(filePath, ".md");
  const fallbackName =
    baseName === "index" ? path.basename(path.dirname(filePath)) : baseName;
  return {
    title: frontmatterTitle ?? headingTitle ?? humanizeFilename(fallbackName),
    order: typeof parsed.data.order === "number" ? parsed.data.order : null,
    content: parsed.content,
  };
}

export function getAllDocSlugs(contentDir: string = CONTENT_DIR): string[][] {
  if (!fs.existsSync(contentDir)) return [];
  const seen = new Set<string>();
  const slugs: string[][] = [];

  function add(slug: string[]): void {
    const key = slug.join("/");
    if (!seen.has(key)) {
      seen.add(key);
      slugs.push(slug);
    }
  }

  function walk(dir: string, prefix: string[]): void {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.isDirectory()) {
        walk(path.join(dir, entry.name), [...prefix, entry.name]);
      } else if (entry.name === "index.md") {
        // The route requires at least one segment, so an index.md sitting
        // directly in contentDir has no URL and is skipped.
        if (prefix.length > 0) add(prefix);
      } else if (entry.name.endsWith(".md")) {
        add([...prefix, entry.name.slice(0, -".md".length)]);
      }
    }
  }

  walk(contentDir, []);
  return slugs;
}

export function getDocPage(
  slug: string[],
  contentDir: string = CONTENT_DIR,
): DocPage | null {
  if (!isValidSlug(slug)) return null;
  const dirIndexPath = path.join(contentDir, ...slug, "index.md");
  const filePath = path.join(
    contentDir,
    ...slug.slice(0, -1),
    `${slug[slug.length - 1]}.md`,
  );
  const resolved = fs.existsSync(dirIndexPath)
    ? dirIndexPath
    : fs.existsSync(filePath)
      ? filePath
      : null;
  if (!resolved) return null;
  return { slug, ...parseDocFile(resolved) };
}
```

- [ ] **Step 6: Run tests to verify they pass**

```bash
bun test lib/content.test.ts
```

Expected: all tests PASS.

Note: the traversal test `getDocPage(["alpha", "..%2f"], FIXTURES)` passes because `..%2f` contains `..` — rejected by `isValidSlug` even though it matches the regex.

- [ ] **Step 7: Lint and commit**

```bash
bun run lint
git add lib/content.ts lib/content.test.ts lib/__tests__ package.json bun.lock
git commit -m "feat: add markdown content layer with slug resolution and frontmatter parsing

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 2: Content layer — sidebar tree generation

**Files:**
- Modify: `lib/content.ts` (append functions)
- Modify: `lib/content.test.ts` (append describe block)

**Interfaces:**
- Consumes: `parseDocFile`, `humanizeFilename`, `isValidSlug`, `SidebarNode` from Task 1.
- Produces: `getSidebarTree(projectSlug: string, contentDir?: string): SidebarNode[]` — the project's child pages/folders (the project's own `index.md` is NOT a node; the sidebar component renders it separately as the title link). Sorted by `order` ascending (nulls last), then title alphabetical. Folders without `index.md` get `href: null` and a `console.warn`.

- [ ] **Step 1: Write the failing tests**

Append to `lib/content.test.ts` (add `getSidebarTree` to the existing import from `@/lib/content`):

```typescript
describe("getSidebarTree", () => {
  test("sorts by order ascending, then nulls last alphabetically", () => {
    const tree = getSidebarTree("alpha", FIXTURES);
    expect(tree.map((n) => n.title)).toEqual(["Zebra", "Guides", "Setting Up"]);
  });

  test("builds hrefs from slugs and nests folder children", () => {
    const tree = getSidebarTree("alpha", FIXTURES);
    const guides = tree.find((n) => n.title === "Guides");
    expect(guides?.href).toBe("/projects/alpha/guides");
    expect(guides?.children.map((c) => c.href)).toEqual([
      "/projects/alpha/guides/deploy",
    ]);
  });

  test("leaf pages have no children", () => {
    const tree = getSidebarTree("alpha", FIXTURES);
    expect(tree.find((n) => n.title === "Setting Up")?.children).toEqual([]);
  });

  test("folder without index.md gets a null href but keeps its children", () => {
    const tree = getSidebarTree("beta", FIXTURES);
    const orphan = tree.find((n) => n.title === "Orphan");
    expect(orphan?.href).toBeNull();
    expect(orphan?.children.map((c) => c.href)).toEqual([
      "/projects/beta/orphan/page",
    ]);
  });

  test("returns empty array for unknown or invalid project slugs", () => {
    expect(getSidebarTree("nope", FIXTURES)).toEqual([]);
    expect(getSidebarTree("..", FIXTURES)).toEqual([]);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
bun test lib/content.test.ts
```

Expected: FAIL — `getSidebarTree` is not exported.

- [ ] **Step 3: Write the implementation**

Append to `lib/content.ts`:

```typescript
export function getSidebarTree(
  projectSlug: string,
  contentDir: string = CONTENT_DIR,
): SidebarNode[] {
  if (!isValidSlug([projectSlug])) return [];
  const projectDir = path.join(contentDir, projectSlug);
  if (!fs.existsSync(projectDir)) return [];
  return buildTree(projectDir, [projectSlug]);
}

function buildTree(dir: string, slugPrefix: string[]): SidebarNode[] {
  const nodes: SidebarNode[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const entryPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      const childSlug = [...slugPrefix, entry.name];
      const children = buildTree(entryPath, childSlug);
      const indexPath = path.join(entryPath, "index.md");
      if (fs.existsSync(indexPath)) {
        const doc = parseDocFile(indexPath);
        nodes.push({
          title: doc.title,
          href: hrefForSlug(childSlug),
          order: doc.order,
          children,
        });
      } else {
        console.warn(
          `[content] Folder missing index.md, omitting its sidebar link: ${entryPath}`,
        );
        nodes.push({
          title: humanizeFilename(entry.name),
          href: null,
          order: null,
          children,
        });
      }
    } else if (entry.name.endsWith(".md") && entry.name !== "index.md") {
      const doc = parseDocFile(entryPath);
      nodes.push({
        title: doc.title,
        href: hrefForSlug([...slugPrefix, entry.name.slice(0, -".md".length)]),
        order: doc.order,
        children: [],
      });
    }
  }
  return sortNodes(nodes);
}

function hrefForSlug(slug: string[]): string {
  return `/projects/${slug.join("/")}`;
}

function sortNodes(nodes: SidebarNode[]): SidebarNode[] {
  return [...nodes].sort((a, b) => {
    if (a.order !== null && b.order !== null && a.order !== b.order) {
      return a.order - b.order;
    }
    if (a.order !== null && b.order === null) return -1;
    if (a.order === null && b.order !== null) return 1;
    return a.title.localeCompare(b.title);
  });
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
bun test lib/content.test.ts
```

Expected: all tests PASS (including Task 1's).

- [ ] **Step 5: Lint and commit**

```bash
bun run lint
git add lib/content.ts lib/content.test.ts
git commit -m "feat: add sidebar tree generation to content layer

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 3: Markdown renderer component

**Files:**
- Create: `components/markdown.tsx`
- Create: `components/markdown.test.tsx`
- Modify: `package.json` (via `bun add`)

**Interfaces:**
- Consumes: nothing from earlier tasks.
- Produces: `Markdown({ content }: { content: string }): JSX element` — server-safe component (no hooks, no "use client") rendering markdown with GFM support and the image/video renderer.

- [ ] **Step 1: Install dependencies**

```bash
bun add react-markdown remark-gfm
```

- [ ] **Step 2: Write the failing tests**

Create `components/markdown.test.tsx`:

```tsx
import { describe, test, expect } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { Markdown } from "@/components/markdown";

describe("Markdown", () => {
  test("renders video-extension image syntax as a native video element", () => {
    const html = renderToStaticMarkup(
      <Markdown content="![Demo run](/projects/pulsefm/demo.mp4)" />,
    );
    expect(html).toContain("<video");
    expect(html).toContain('src="/projects/pulsefm/demo.mp4"');
    expect(html).toContain('aria-label="Demo run"');
    expect(html).toContain("controls");
  });

  test("renders .webm and .mov as video too", () => {
    for (const ext of ["webm", "mov"]) {
      const html = renderToStaticMarkup(
        <Markdown content={`![clip](/projects/x/clip.${ext})`} />,
      );
      expect(html).toContain("<video");
    }
  });

  test("renders regular images as img elements", () => {
    const html = renderToStaticMarkup(
      <Markdown content="![Diagram](/projects/pulsefm/diagram.png)" />,
    );
    expect(html).toContain("<img");
    expect(html).toContain('alt="Diagram"');
    expect(html).not.toContain("<video");
  });

  test("renders GFM tables", () => {
    const html = renderToStaticMarkup(
      <Markdown content={"| a | b |\n| - | - |\n| 1 | 2 |"} />,
    );
    expect(html).toContain("<table");
  });

  test("renders headings and links", () => {
    const html = renderToStaticMarkup(
      <Markdown content={"## Section\n\n[home](/projects/pulsefm)"} />,
    );
    expect(html).toContain("<h2");
    expect(html).toContain('href="/projects/pulsefm"');
  });
});
```

- [ ] **Step 3: Run tests to verify they fail**

```bash
bun test components/markdown.test.tsx
```

Expected: FAIL — cannot resolve `@/components/markdown`.

- [ ] **Step 4: Write the implementation**

Create `components/markdown.tsx`:

```tsx
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";

const VIDEO_EXTENSIONS = [".mp4", ".webm", ".mov"];

function isVideoSrc(src: string): boolean {
  return VIDEO_EXTENSIONS.some((ext) => src.toLowerCase().endsWith(ext));
}

const components: Components = {
  h1: ({ children }) => (
    <h1 className="text-3xl font-bold mt-10 first:mt-0">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-2xl font-bold mt-10">{children}</h2>
  ),
  h3: ({ children }) => <h3 className="text-xl font-bold mt-8">{children}</h3>,
  p: ({ children }) => (
    <p className="text-muted-foreground leading-relaxed mt-4">{children}</p>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      className="underline text-foreground hover:text-primary transition-colors"
    >
      {children}
    </a>
  ),
  ul: ({ children }) => (
    <ul className="list-disc pl-6 mt-4 flex flex-col gap-2 text-muted-foreground">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal pl-6 mt-4 flex flex-col gap-2 text-muted-foreground">
      {children}
    </ol>
  ),
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  blockquote: ({ children }) => (
    <blockquote className="border-l-2 border-border pl-4 mt-4 italic text-muted-foreground">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="border-border my-8" />,
  pre: ({ children }) => (
    <pre className="mt-4 rounded-xl border border-border p-4 overflow-x-auto text-sm">
      {children}
    </pre>
  ),
  code: ({ children, className }) => (
    <code className={`${className ?? ""} rounded bg-border/40 px-1 py-0.5 text-sm`}>
      {children}
    </code>
  ),
  table: ({ children }) => (
    <div className="mt-4 overflow-x-auto">
      <table className="w-full text-sm border-collapse">{children}</table>
    </div>
  ),
  th: ({ children }) => (
    <th className="border border-border px-3 py-2 text-left font-bold">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="border border-border px-3 py-2 text-muted-foreground">
      {children}
    </td>
  ),
  img: ({ src, alt }) => {
    const url = typeof src === "string" ? src : "";
    if (isVideoSrc(url)) {
      return (
        <video
          controls
          src={url}
          aria-label={alt ?? undefined}
          className="w-full rounded-xl border border-border mt-4"
        />
      );
    }
    return (
      // eslint-disable-next-line @next/next/no-img-element -- markdown images have no intrinsic dimensions, which next/image requires
      <img
        src={url}
        alt={alt ?? ""}
        className="w-full rounded-xl border border-border mt-4"
      />
    );
  },
};

export function Markdown({ content }: { content: string }) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
      {content}
    </ReactMarkdown>
  );
}
```

- [ ] **Step 5: Run tests to verify they pass**

```bash
bun test components/markdown.test.tsx
```

Expected: all tests PASS. If the `Components` type import fails, check the installed react-markdown major version (`bun pm ls react-markdown`) — v9+ exports it from the package root.

- [ ] **Step 6: Lint and commit**

```bash
bun run lint
git add components/markdown.tsx components/markdown.test.tsx package.json bun.lock
git commit -m "feat: add styled markdown renderer with image and video support

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 4: Docs sidebar component

**Files:**
- Create: `components/docs-sidebar.tsx`
- Create: `components/docs-sidebar.test.tsx`

**Interfaces:**
- Consumes: `SidebarNode` type from `@/lib/content` (Task 1).
- Produces: `DocsSidebar({ projectTitle, projectHref, nodes, currentHref }: DocsSidebarProps)` — presentation-only server component; the route passes in the tree. Renders desktop sticky column + mobile `<details>` (no client JS).

- [ ] **Step 1: Write the failing tests**

Create `components/docs-sidebar.test.tsx`:

```tsx
import { describe, test, expect } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { DocsSidebar } from "@/components/docs-sidebar";
import type { SidebarNode } from "@/lib/content";

const nodes: SidebarNode[] = [
  { title: "Architecture", href: "/projects/pulsefm/architecture", order: null, children: [] },
  {
    title: "Infra",
    href: null,
    order: null,
    children: [
      { title: "Deployment", href: "/projects/pulsefm/infra/deployment", order: null, children: [] },
    ],
  },
];

function render(currentHref: string): string {
  return renderToStaticMarkup(
    <DocsSidebar
      projectTitle="PulseFM"
      projectHref="/projects/pulsefm"
      nodes={nodes}
      currentHref={currentHref}
    />,
  );
}

describe("DocsSidebar", () => {
  test("renders back link, project link, and page links", () => {
    const html = render("/projects/pulsefm");
    expect(html).toContain('href="/"');
    expect(html).toContain('href="/projects/pulsefm"');
    expect(html).toContain('href="/projects/pulsefm/architecture"');
    expect(html).toContain('href="/projects/pulsefm/infra/deployment"');
  });

  test("highlights the current page", () => {
    const html = render("/projects/pulsefm/architecture");
    expect(html).toMatch(/text-foreground[^>]*>Architecture/);
  });

  test("renders folders without index.md as plain text, not links", () => {
    const html = render("/projects/pulsefm");
    expect(html).not.toMatch(/<a[^>]*>Infra</);
    expect(html).toContain("Infra");
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
bun test components/docs-sidebar.test.tsx
```

Expected: FAIL — cannot resolve `@/components/docs-sidebar`.

- [ ] **Step 3: Write the implementation**

Create `components/docs-sidebar.tsx`:

```tsx
import Link from "next/link";
import type { SidebarNode } from "@/lib/content";

interface DocsSidebarProps {
  projectTitle: string;
  projectHref: string;
  nodes: SidebarNode[];
  currentHref: string;
}

function NavList({
  nodes,
  currentHref,
}: {
  nodes: SidebarNode[];
  currentHref: string;
}) {
  return (
    <ul className="flex flex-col gap-2">
      {nodes.map((node) => (
        <li key={node.href ?? node.title}>
          {node.href ? (
            <Link
              href={node.href}
              className={
                node.href === currentHref
                  ? "text-sm text-foreground font-medium"
                  : "text-sm text-muted-foreground hover:text-foreground transition-colors"
              }
            >
              {node.title}
            </Link>
          ) : (
            <span className="text-sm text-muted-foreground/70">{node.title}</span>
          )}
          {node.children.length > 0 && (
            <div className="pl-3 mt-2 border-l border-border">
              <NavList nodes={node.children} currentHref={currentHref} />
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}

function NavContent({
  projectTitle,
  projectHref,
  nodes,
  currentHref,
}: DocsSidebarProps) {
  return (
    <nav>
      <Link
        href="/"
        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        ← Back to portfolio
      </Link>
      <Link
        href={projectHref}
        className={
          projectHref === currentHref
            ? "block mt-6 font-bold text-foreground"
            : "block mt-6 font-bold text-muted-foreground hover:text-foreground transition-colors"
        }
      >
        {projectTitle}
      </Link>
      {nodes.length > 0 && (
        <div className="mt-4">
          <NavList nodes={nodes} currentHref={currentHref} />
        </div>
      )}
    </nav>
  );
}

export function DocsSidebar(props: DocsSidebarProps) {
  return (
    <>
      <aside className="hidden md:block w-56 shrink-0">
        <div className="sticky top-24">
          <NavContent {...props} />
        </div>
      </aside>
      {/* <details> gives mobile collapse behavior without shipping client JS */}
      <details className="md:hidden rounded-xl border border-border px-4 py-3">
        <summary className="text-sm font-medium cursor-pointer">
          {props.projectTitle} docs
        </summary>
        <div className="mt-4">
          <NavContent {...props} />
        </div>
      </details>
    </>
  );
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
bun test components/docs-sidebar.test.tsx
```

Expected: all tests PASS.

- [ ] **Step 5: Lint and commit**

```bash
bun run lint
git add components/docs-sidebar.tsx components/docs-sidebar.test.tsx
git commit -m "feat: add per-project docs sidebar component

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 5: Catch-all route + seed content

**Files:**
- Create: `app/projects/[...slug]/page.tsx`
- Create: `content/projects/pulsefm/index.md`
- Create: `content/projects/pulsefm/architecture.md`

**Interfaces:**
- Consumes: `getAllDocSlugs`, `getDocPage`, `getSidebarTree` (Tasks 1–2); `Markdown` (Task 3); `DocsSidebar` (Task 4).
- Produces: statically generated pages at `/projects/pulsefm` and `/projects/pulsefm/architecture`; any unknown `/projects/...` path 404s.

- [ ] **Step 1: Create seed content**

`content/projects/pulsefm/index.md`:

```markdown
---
title: PulseFM
---

# PulseFM — AI Lofi Radio

PulseFM is a 24/7 AI-powered radio platform where listeners vote on curated
music styles, and the winning option is generated and streamed live.

![PulseFM](/pulsefm.jpg)

## What's documented here

- [Architecture](/projects/pulsefm/architecture) — how the system fits together
```

`content/projects/pulsefm/architecture.md`:

```markdown
---
title: Architecture
order: 1
---

# Architecture

How PulseFM's voting, generation, and streaming pipeline fits together.

> Placeholder page — replace with the real writeup.
```

- [ ] **Step 2: Create the route**

Create `app/projects/[...slug]/page.tsx`:

```tsx
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllDocSlugs, getDocPage, getSidebarTree } from "@/lib/content";
import { Markdown } from "@/components/markdown";
import { DocsSidebar } from "@/components/docs-sidebar";

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
          <Markdown content={page.content} />
        </article>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Verify with a production build**

```bash
bun run build
```

Expected: build succeeds; the route summary lists `/projects/[...slug]` with statically generated paths `/projects/pulsefm` and `/projects/pulsefm/architecture` (● SSG markers).

- [ ] **Step 4: Verify behavior in dev**

```bash
bun run dev &
sleep 5
curl -s http://localhost:3000/projects/pulsefm | grep -o "PulseFM — AI Lofi Radio" | head -1
curl -s http://localhost:3000/projects/pulsefm/architecture | grep -o "voting, generation, and streaming" | head -1
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/projects/does-not-exist
kill %1
```

Expected: first grep prints the title, second prints the phrase, third prints `404`.

Then check visually in the browser (`bun run dev`): sidebar sticky on desktop, collapsible on mobile width, styling matches the landing page, dark/light themes both correct.

- [ ] **Step 5: Run full test suite, lint, commit**

```bash
bun test
bun run lint
git add app/projects content/projects
git commit -m "feat: add catch-all docs route with static generation and seed content

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 6: Landing page integration

**Files:**
- Modify: `lib/data.ts` (type the projects array, add `docs` field)
- Modify: `app/page.tsx` (internal links when `docs` is set)

**Interfaces:**
- Consumes: `/projects/pulsefm` route from Task 5.
- Produces: `interface Project { name: string; img: string; description: string; link: string; repo: string; docs?: string; tags: string[] }` exported from `lib/data.ts`; PulseFM card image/title link to `/projects/pulsefm`.

- [ ] **Step 1: Type the projects array and add the docs slug**

In `lib/data.ts`, replace the untyped `export const projects = [` declaration with:

```typescript
export interface Project {
  name: string;
  img: string;
  description: string;
  link: string;
  repo: string;
  /** Slug under content/projects/; when set, the card links to /projects/<docs> */
  docs?: string;
  tags: string[];
}

export const projects: Project[] = [
```

and add `docs: "pulsefm",` to the PulseFM entry (after `repo`).

- [ ] **Step 2: Link cards internally when docs exist**

In `app/page.tsx`:

Add to the imports at the top:

```tsx
import Link from "next/link";
```

Replace the card href logic (currently `const cardHref = project.link || project.repo;` at `app/page.tsx:106`) and the image wrapper so internal docs take priority:

```tsx
{projects.map((project) => {
  const docsHref = project.docs ? `/projects/${project.docs}` : null;
  // "||" not "??": link/repo use empty string for "absent"
  const cardHref = docsHref ?? (project.link || project.repo);
  const image = (
    <Image
      src={`/${project.img}`}
      alt={project.name}
      className="object-cover w-full aspect-video"
      width={600}
      height={340}
    />
  );
  return (
    <div key={project.name} className="flex flex-col">
      <div className="relative overflow-hidden rounded-xl border border-border hover:border-muted-foreground/50 transition-colors">
        {docsHref ? (
          <Link href={docsHref}>{image}</Link>
        ) : cardHref ? (
          <a href={cardHref} target="_blank" rel="noopener noreferrer">
            {image}
          </a>
        ) : (
          image
        )}
        {/* ...Website/GitHub badges unchanged... */}
```

and replace the title `<h3 className="text-xl font-bold mt-3">{project.name}</h3>` with:

```tsx
{docsHref ? (
  <Link href={docsHref}>
    <h3 className="text-xl font-bold mt-3 hover:underline">{project.name}</h3>
  </Link>
) : (
  <h3 className="text-xl font-bold mt-3">{project.name}</h3>
)}
```

The Website/GitHub badge block stays exactly as it is (external links preserved).

- [ ] **Step 3: Verify**

```bash
bun run build
bun run lint
bun test
```

Expected: all pass. Then in `bun run dev`, confirm: PulseFM card image/title navigate to `/projects/pulsefm`; Website/GitHub badges still open external sites in a new tab; Flower City card behavior unchanged (external link).

- [ ] **Step 4: Review diff and commit**

```bash
git diff
git add lib/data.ts app/page.tsx
git commit -m "feat: link project cards to internal docs pages

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```
