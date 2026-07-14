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
