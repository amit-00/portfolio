import { describe, test, expect } from "bun:test";
import { splitArticle } from "@/lib/article";

describe("splitArticle", () => {
  test("lifts the h1 out as the title", () => {
    const { title, sections } = splitArticle("# Title\n\nA lead paragraph.");
    expect(title).toBe("# Title");
    expect(sections.length).toBe(1);
    expect(sections[0].prose).toBe("A lead paragraph.");
    expect(sections[0].artifacts).toEqual([]);
  });

  test("reports no title when the document does not open with one", () => {
    const { title, sections } = splitArticle("Just prose.\n\n## A\n\nBody.");
    expect(title).toBeNull();
    expect(sections.length).toBe(2);
    expect(sections[0].prose).toBe("Just prose.");
  });

  test("starts a new section at each h2", () => {
    const { sections } = splitArticle(
      "# Title\n\nLead.\n\n## First\n\nOne.\n\n## Second\n\nTwo.",
    );
    expect(sections.length).toBe(3);
    expect(sections[0].prose).toBe("Lead.");
    expect(sections[1].prose).toBe("## First\n\nOne.");
    expect(sections[2].prose).toBe("## Second\n\nTwo.");
  });

  test("does not split on a '## ' line inside a fenced code block", () => {
    const { sections } = splitArticle(
      "# Title\n\n```bash\n## not a heading\n```\n\n## Real heading\n\nBody.",
    );
    expect(sections.length).toBe(2);
    expect(sections[0].artifacts[0]).toBe("```bash\n## not a heading\n```");
    expect(sections[1].prose).toBe("## Real heading\n\nBody.");
  });

  test("pulls fenced code out of prose and into artifacts", () => {
    const { sections } = splitArticle(
      "## Design\n\nBefore.\n\n```ts\nconst a = 1;\n\nconst b = 2;\n```\n\nAfter.",
    );
    // The blank line inside the fence must not break the block apart.
    expect(sections[0].artifacts).toEqual([
      "```ts\nconst a = 1;\n\nconst b = 2;\n```",
    ]);
    expect(sections[0].prose).toBe("## Design\n\nBefore.\n\nAfter.");
  });

  test("pulls a standalone image out as an artifact", () => {
    const { sections } = splitArticle(
      "## Layers\n\nProse.\n\n![Engine layers](/huddl/engine_layers.png)\n\nMore.",
    );
    expect(sections[0].artifacts).toEqual([
      "![Engine layers](/huddl/engine_layers.png)",
    ]);
    expect(sections[0].prose).toBe("## Layers\n\nProse.\n\nMore.");
  });

  test("carries a caption that follows an image into the same artifact", () => {
    const { sections } = splitArticle(
      "## Layers\n\nProse.\n\n![Arch](/a.png)\n> Single-threaded, by design.\n\nMore.",
    );
    expect(sections[0].artifacts).toEqual([
      "![Arch](/a.png)\n> Single-threaded, by design.",
    ]);
    expect(sections[0].prose).toBe("## Layers\n\nProse.\n\nMore.");
  });

  test("leaves an inline image inside a sentence in the prose", () => {
    const { sections } = splitArticle("## Inline\n\nSee ![icon](/i.png) here.");
    expect(sections[0].artifacts).toEqual([]);
    expect(sections[0].prose).toBe("## Inline\n\nSee ![icon](/i.png) here.");
  });

  test("pulls a table out as an artifact", () => {
    const { sections } = splitArticle(
      "## Tradeoffs\n\nProse.\n\n| A | B |\n| - | - |\n| 1 | 2 |",
    );
    expect(sections[0].artifacts).toEqual(["| A | B |\n| - | - |\n| 1 | 2 |"]);
    expect(sections[0].prose).toBe("## Tradeoffs\n\nProse.");
  });

  test("keeps several artifacts in document order", () => {
    const { sections } = splitArticle(
      "## Two\n\nProse.\n\n![one](/a.png)\n\n![two](/b.png)",
    );
    expect(sections[0].artifacts).toEqual(["![one](/a.png)", "![two](/b.png)"]);
  });

  test("reports no artifacts for a prose-only section", () => {
    const { sections } = splitArticle("# T\n\n## Only prose\n\n- a\n- b");
    expect(sections.length).toBe(1);
    expect(sections[0].artifacts).toEqual([]);
    expect(sections[0].prose).toBe("## Only prose\n\n- a\n- b");
  });
});
