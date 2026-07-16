import fs from "fs";
import path from "path";
import matter from "gray-matter";

const CONTENT_DIR = path.join(process.cwd(), "content", "projects");

export const POSTS_DIR = "posts";

export interface PostMeta {
  slug: string[];
  title: string;
  date: string; // normalized YYYY-MM-DD
  excerpt: string;
  image: string | null;
}

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

function parseDocFile(filePath: string): ParsedDoc {
  const parsed = readMatter(filePath);
  return {
    title: resolveTitle(parsed, filePath),
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

export function getSidebarTree(
  projectSlug: string,
  contentDir: string = CONTENT_DIR,
): SidebarNode[] {
  if (!isValidSlug([projectSlug])) return [];
  const projectDir = path.join(contentDir, projectSlug);
  if (!fs.existsSync(projectDir)) return [];
  const nodes = buildTree(projectDir, [projectSlug], [POSTS_DIR]);
  const editorial = buildEditorialGroup(projectSlug, contentDir);
  return editorial ? [...nodes, editorial] : nodes;
}

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

function buildTree(
  dir: string,
  slugPrefix: string[],
  skip: readonly string[] = [],
): SidebarNode[] {
  const nodes: SidebarNode[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (skip.includes(entry.name)) continue;
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
