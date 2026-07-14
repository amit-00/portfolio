import Link from "next/link";
import type { SidebarNode } from "@/lib/content";

interface DocsSidebarProps {
  projectTitle: string;
  projectHref: string;
  nodes: SidebarNode[];
  currentHref: string;
}

function NavList({
  nodes,
  currentHref,
}: {
  nodes: SidebarNode[];
  currentHref: string;
}) {
  return (
    <ul className="flex flex-col gap-2">
      {nodes.map((node) => (
        <li key={node.href ?? node.title}>
          {node.href ? (
            <Link
              href={node.href}
              className={
                node.href === currentHref
                  ? "text-sm text-foreground font-medium"
                  : "text-sm text-muted-foreground hover:text-foreground transition-colors"
              }
            >
              {node.title}
            </Link>
          ) : (
            <span className="text-sm text-muted-foreground/70">{node.title}</span>
          )}
          {node.children.length > 0 && (
            <div className="pl-3 mt-2 border-l border-border">
              <NavList nodes={node.children} currentHref={currentHref} />
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}

function NavContent({
  projectTitle,
  projectHref,
  nodes,
  currentHref,
}: DocsSidebarProps) {
  return (
    <nav>
      <Link
        href="/"
        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        ← Back to portfolio
      </Link>
      <Link
        href={projectHref}
        className={
          projectHref === currentHref
            ? "block mt-6 font-bold text-foreground"
            : "block mt-6 font-bold text-muted-foreground hover:text-foreground transition-colors"
        }
      >
        {projectTitle}
      </Link>
      {nodes.length > 0 && (
        <div className="mt-4">
          <NavList nodes={nodes} currentHref={currentHref} />
        </div>
      )}
    </nav>
  );
}

export function DocsSidebar(props: DocsSidebarProps) {
  return (
    <>
      <aside className="hidden md:block w-56 shrink-0">
        <div className="sticky top-24">
          <NavContent {...props} />
        </div>
      </aside>
      {/* <details> gives mobile collapse behavior without shipping client JS */}
      <details className="md:hidden rounded-xl border border-border px-4 py-3">
        <summary className="text-sm font-medium cursor-pointer">
          {props.projectTitle} docs
        </summary>
        <div className="mt-4">
          <NavContent {...props} />
        </div>
      </details>
    </>
  );
}
