import { describe, test, expect } from "bun:test";
import path from "path";
import {
  getAllDocSlugs,
  getDocPage,
  getSidebarTree,
  getProjectPosts,
} from "@/lib/content";

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

  test("breaks date ties by title ascending and parses quoted string dates", () => {
    const posts = getProjectPosts("epsilon", FIXTURES);
    expect(posts.map((p) => p.title)).toEqual(["Aaa Title", "Bbb Title"]);
    expect(posts.every((p) => p.date === "2026-05-01")).toBe(true);
  });

  test("ignores non-markdown files and subdirectories inside posts/", () => {
    const posts = getProjectPosts("epsilon", FIXTURES);
    expect(posts).toHaveLength(2);
    expect(posts.map((p) => p.title)).not.toContain("WIP Draft");
  });
});
