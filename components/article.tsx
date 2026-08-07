import type { ReactNode } from "react";
import { splitArticle, type ArticleSection } from "@/lib/article";
import { Markdown } from "@/components/markdown";

function Section({ section }: { section: ArticleSection }): ReactNode {
  if (section.artifacts.length === 0) {
    return (
      <section className="border-b border-rule py-section">
        <Markdown content={section.prose} />
      </section>
    );
  }

  return (
    // min-w-0 on both tracks: a grid item defaults to min-width:auto, which
    // lets a wide code block or table stretch the column instead of scrolling
    // inside it, and that overflows the page.
    <section className="grid border-b border-rule lg:grid-cols-2">
      <div className="min-w-0 py-section lg:border-r lg:border-rule lg:pr-9">
        <Markdown content={section.prose} />
      </div>
      <div className="flex min-w-0 flex-col gap-6 bg-sunken px-6 py-section">
        {section.artifacts.map((source) => (
          <Markdown key={source} content={source} />
        ))}
      </div>
    </section>
  );
}

/**
 * The page's structural unit: one idea argued on the left, the evidence it
 * rests on shown in the gutter to its right. The title spans both columns —
 * it belongs to the page, not to any one section.
 */
export function Article({ content }: { content: string }): ReactNode {
  const { title, sections } = splitArticle(content);

  return (
    <div>
      {title && (
        <div className="pb-section">
          <Markdown content={title} />
        </div>
      )}
      {sections.map((section, index) => (
        <Section key={section.prose || section.artifacts[0] || index} section={section} />
      ))}
    </div>
  );
}
