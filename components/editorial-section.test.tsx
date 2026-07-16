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
