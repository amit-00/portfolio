import Link from "next/link";
import type { PostMeta } from "@/lib/content";
import { formatDate } from "@/lib/utils";

export function EditorialSection({ posts }: { posts: PostMeta[] }) {
  if (posts.length === 0) return null;
  return (
    <section id="editorial" className="mt-16 scroll-mt-24">
      <h2 className="text-2xl font-bold">Editorial</h2>
      <ul className="mt-6 flex flex-col gap-4">
        {posts.map((post) => (
          <li key={post.slug.join("/")}>
            <Link
              href={`/projects/${post.slug.join("/")}`}
              className="group flex gap-4 rounded-xl border border-border p-4 transition-colors hover:bg-border/20"
            >
              {post.image && (
                // eslint-disable-next-line @next/next/no-img-element -- post thumbnails have no intrinsic dimensions, which next/image requires
                <img
                  src={post.image}
                  alt=""
                  className="h-20 w-20 shrink-0 rounded-lg border border-border object-cover"
                />
              )}
              <div className="min-w-0">
                <h3 className="font-bold text-foreground group-hover:text-primary transition-colors">
                  {post.title}
                </h3>
                <time
                  dateTime={post.date}
                  className="mt-1 block text-sm text-muted-foreground"
                >
                  {formatDate(post.date)}
                </time>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {post.excerpt}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
