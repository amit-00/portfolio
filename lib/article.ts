export interface ArticleSection {
  /** Markdown for the left column — the claim, its heading included. */
  prose: string;
  /** Markdown for the right gutter — figures, diagrams, code and tables. */
  artifacts: string[];
}

export interface ParsedArticle {
  /** The leading h1, lifted out so it can span both columns. */
  title: string | null;
  sections: ArticleSection[];
}

const FENCE = /^(`{3,}|~{3,})/;
const H1 = /^# /;
const H2 = /^## /;
const STANDALONE_IMAGE = /^!\[[^\]]*\]\([^)]*\)$/;

/**
 * Groups the lines of a markdown document into blocks, where a block is a run
 * of lines between blank lines and a fenced block counts as one block however
 * many blank lines it contains. Fence state is tracked so that markdown syntax
 * appearing inside a code sample is never read as structure.
 */
function toBlocks(lines: string[]): string[] {
  const blocks: string[] = [];
  let current: string[] = [];
  let fence: string | null = null;

  const flush = (): void => {
    if (current.length > 0) blocks.push(current.join("\n"));
    current = [];
  };

  for (const line of lines) {
    const fenceMatch = line.trimStart().match(FENCE);

    if (fence === null && fenceMatch) {
      flush();
      fence = fenceMatch[1][0];
      current.push(line);
      continue;
    }
    // ponytail: closing on the fence character alone, not its length. Nested
    // fences would need the length check too; no document here has them.
    if (fence !== null) {
      current.push(line);
      if (fenceMatch && fenceMatch[1][0] === fence) {
        fence = null;
        flush();
      }
      continue;
    }
    if (line.trim() === "") {
      flush();
      continue;
    }
    current.push(line);
  }

  flush();
  return blocks;
}

/**
 * Classified on the opening line, not the whole block, so that a caption
 * written directly under an image travels into the gutter with its figure.
 */
function isArtifact(block: string): boolean {
  const first = block.split("\n", 1)[0].trim();
  return (
    FENCE.test(first) || first.startsWith("|") || STANDALONE_IMAGE.test(first)
  );
}

function toSection(blocks: string[]): ArticleSection {
  const prose: string[] = [];
  const artifacts: string[] = [];

  for (const block of blocks) {
    if (isArtifact(block)) artifacts.push(block);
    else prose.push(block);
  }

  return { prose: prose.join("\n\n"), artifacts };
}

/**
 * Splits a document into sections at each h2, and within a section separates
 * the argument from its evidence so the two can be laid out side by side. The
 * h1 comes back on its own: a display title has no business in a half column.
 */
export function splitArticle(markdown: string): ParsedArticle {
  const blocks = toBlocks(markdown.split("\n"));
  const title = blocks.length > 0 && H1.test(blocks[0]) ? blocks[0] : null;
  const body = title === null ? blocks : blocks.slice(1);
  const grouped: string[][] = [];

  for (const block of body) {
    if (grouped.length === 0 || H2.test(block)) grouped.push([]);
    grouped[grouped.length - 1].push(block);
  }

  return { title, sections: grouped.map(toSection) };
}
