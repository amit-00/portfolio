import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllDocSlugs, getDocPage, getSidebarTree } from "@/lib/content";
import { Markdown } from "@/components/markdown";
import { DocsSidebar } from "@/components/docs-sidebar";

// Only paths emitted by generateStaticParams exist; everything else 404s
// and no doc page is ever rendered on demand.
export const dynamicParams = false;

interface DocRouteProps {
  params: Promise<{ slug: string[] }>;
}

export function generateStaticParams(): { slug: string[] }[] {
  return getAllDocSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: DocRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const page = getDocPage(slug);
  return { title: page?.title ?? "Not found" };
}

export default async function ProjectDocPage({ params }: DocRouteProps) {
  const { slug } = await params;
  const page = getDocPage(slug);
  if (!page) notFound();

  const projectSlug = slug[0];
  const projectIndex = getDocPage([projectSlug]);
  const nodes = getSidebarTree(projectSlug);

  return (
    <div className="relative pt-24 pb-24">
      <div className="max-w-4xl mx-auto px-4 flex flex-col md:flex-row gap-8 md:gap-12">
        <DocsSidebar
          projectTitle={projectIndex?.title ?? projectSlug}
          projectHref={`/projects/${projectSlug}`}
          nodes={nodes}
          currentHref={`/projects/${slug.join("/")}`}
        />
        <article className="min-w-0 flex-1 max-w-2xl">
          <Markdown content={page.content} />
        </article>
      </div>
    </div>
  );
}
