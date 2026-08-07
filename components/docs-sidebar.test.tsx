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
  test("renders project link and page links", () => {
    const html = render("/projects/pulsefm");
    expect(html).toContain('href="/projects/pulsefm"');
    expect(html).toContain('href="/projects/pulsefm/architecture"');
    expect(html).toContain('href="/projects/pulsefm/infra/deployment"');
  });

  test("highlights the current page", () => {
    const html = render("/projects/pulsefm/architecture");
    expect(html).toMatch(/text-ink-1[^>]*>Architecture/);
  });

  test("renders folders without index.md as plain text, not links", () => {
    const html = render("/projects/pulsefm");
    expect(html).not.toMatch(/<a[^>]*>Infra</);
    expect(html).toContain("Infra");
  });

  test("renders the mobile nav as a native disclosure, not an animated drawer", () => {
    const html = render("/projects/pulsefm");
    expect(html).toContain("<details");
    expect(html).toContain("<summary");
    // The system has no blur and no transforms to build a drawer from.
    expect(html).not.toContain("backdrop-blur");
    expect(html).not.toContain("translate-x");
  });

  test("carries no back link — the top bar wordmark goes home", () => {
    const html = render("/projects/pulsefm/architecture");
    expect(html).not.toContain('href="/"');
    expect(html).not.toContain("Back to portfolio");
  });

  test("uses no icon set", () => {
    expect(render("/projects/pulsefm")).not.toContain("<svg");
  });

  test("renders nav links inside the mobile disclosure as well", () => {
    // Both the desktop aside and the mobile disclosure render the nav, so each
    // page link appears twice in the static markup.
    const html = render("/projects/pulsefm");
    const matches = html.match(/href="\/projects\/pulsefm\/architecture"/g) ?? [];
    expect(matches.length).toBe(2);
  });
});
