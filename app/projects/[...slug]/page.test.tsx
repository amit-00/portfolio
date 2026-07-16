import { describe, test, expect } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import ProjectDocPage from "@/app/projects/[...slug]/page";

async function renderRoute(slug: string[]): Promise<string> {
  const element = await ProjectDocPage({ params: Promise.resolve({ slug }) });
  return renderToStaticMarkup(element);
}

describe("ProjectDocPage route", () => {
  test("renders the date header on a post page", async () => {
    const html = await renderRoute(["pulsefm", "posts", "hello-editorial"]);
    expect(html).toContain("Jul 16, 2026");
    expect(html).toContain("<time");
  });

  test("renders the editorial section on the project overview", async () => {
    const html = await renderRoute(["pulsefm"]);
    expect(html).toContain('id="editorial"');
  });

  test("renders neither date header nor editorial section on a plain doc page", async () => {
    const html = await renderRoute(["pulsefm", "architecture"]);
    expect(html).not.toContain("<time");
    expect(html).not.toContain('id="editorial"');
  });
});
