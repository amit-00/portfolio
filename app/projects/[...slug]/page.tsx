import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getAllDocSlugs,
  getDocPage,
  getProjectPosts,
  getSidebarTree,
} from "@/lib/content";
import { Article } from "@/components/article";
import { DocsSidebar } from "@/components/docs-sidebar";
import { EditorialSection } from "@/components/editorial-section";
import { TopBar } from "@/components/relay/top-bar";
import { SiteFooter } from "@/components/relay/site-footer";
import { formatDate } from "@/lib/utils";

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

  const isOverview = slug.length === 1;
  const isPostPage = slug.length === 3 && slug[1] === "posts";
  // Posts are only needed to render the overview's editorial section or a
  // post page's date header; the sidebar loads them separately at build time.
  const posts = isOverview || isPostPage ? getProjectPosts(projectSlug) : [];
  const post = isPostPage
    ? posts.find((p) => p.slug.join("/") === slug.join("/"))
    : undefined;

  return (
    <div>
      <TopBar breadcrumb={`projects / ${slug.join(" / ")}`} />
      <div className="flex flex-col gap-9 border-b border-rule px-gutter py-section md:flex-row md:gap-12">
        <DocsSidebar
          projectTitle={projectIndex?.title ?? projectSlug}
          projectHref={`/projects/${projectSlug}`}
          nodes={nodes}
          currentHref={`/projects/${slug.join("/")}`}
        />
        <article className="min-w-0 flex-1">
          {post && (
            <time
              dateTime={post.date}
              className="mb-4 block font-mono text-label uppercase text-ink-5"
            >
              {formatDate(post.date)}
            </time>
          )}
          <Article content={page.content} />
          {isOverview && <EditorialSection posts={posts} />}
        </article>
      </div>
      <SiteFooter />
    </div>
  );
}
