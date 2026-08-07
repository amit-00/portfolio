import Link from "next/link";
import type { ReactNode } from "react";
import type { PostMeta } from "@/lib/content";
import { formatDate } from "@/lib/utils";

export function EditorialSection({ posts }: { posts: PostMeta[] }): ReactNode {
  if (posts.length === 0) return null;
  return (
    <section id="editorial" className="mt-16">
      <div className="font-mono text-label uppercase text-ink-5">Writing</div>
      <div className="mt-4 border-t border-rule-strong">
        {posts.map((post) => (
          <Link
            key={post.slug.join("/")}
            href={`/projects/${post.slug.join("/")}`}
            className="group flex gap-5 border-b border-rule py-[18px] transition-colors duration-[120ms] hover:bg-fill"
          >
            {post.image && (
              // eslint-disable-next-line @next/next/no-img-element -- post thumbnails have no intrinsic dimensions, which next/image requires
              <img
                src={post.image}
                alt=""
                className="h-16 w-16 shrink-0 border border-rule object-cover"
              />
            )}
            <div className="min-w-0">
              <time
                dateTime={post.date}
                className="block font-mono text-label uppercase text-ink-6"
              >
                {formatDate(post.date)}
              </time>
              <h3 className="mt-1 font-mono text-h3 font-medium text-ink-1">
                {post.title}
              </h3>
              <p className="mt-1 max-w-[58ch] text-small text-ink-4">
                {post.excerpt}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
