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

  test("renders a dock-styled mobile trigger button", () => {
    const html = render("/projects/pulsefm");
    expect(html).toContain('aria-label="Open docs navigation"');
    // Trigger shares the dock surface: blur + border
    expect(html).toMatch(/aria-label="Open docs navigation"[^>]*class="[^"]*backdrop-blur-md/);
  });

  test("renders a fixed back-to-portfolio button linking home", () => {
    const html = render("/projects/pulsefm/architecture");
    // Icon-only anchor to the portfolio home.
    expect(html).toMatch(/<a[^>]*aria-label="Back to portfolio"[^>]*>\s*<svg/);
    expect(html).toContain('href="/"');
  });

  test("no longer renders the back link inside the nav", () => {
    const html = render("/projects/pulsefm");
    expect(html).not.toContain("Back to portfolio</a>");
  });

  test("renders nav links inside the mobile drawer as well", () => {
    // Both the desktop aside and the mobile panel render the nav, so each
    // page link appears twice in the static markup.
    const html = render("/projects/pulsefm");
    const matches = html.match(/href="\/projects\/pulsefm\/architecture"/g) ?? [];
    expect(matches.length).toBe(2);
  });
});
