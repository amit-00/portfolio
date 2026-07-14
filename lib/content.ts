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
