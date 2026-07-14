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
