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
