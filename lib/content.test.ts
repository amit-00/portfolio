import { describe, test, expect } from "bun:test";
import path from "path";
import { getAllDocSlugs, getDocPage, getSidebarTree } from "@/lib/content";

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
