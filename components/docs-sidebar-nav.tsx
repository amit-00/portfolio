import Link from "next/link";
import type { SidebarNode } from "@/lib/content";

// Shared dock surface: translucent, blurred, hairline border — matches the
// FloatingDock so the docs controls feel like one system.
export const dockSurface =
  "border-border bg-white/10 dark:bg-black/10 backdrop-blur-md " +
  "supports-backdrop-blur:bg-white/10 supports-backdrop-blur:dark:bg-black/10";

export interface DocsNavProps {
  projectTitle: string;
  projectHref: string;
  nodes: SidebarNode[];
  currentHref: string;
}

function NavList({
  nodes,
  currentHref,
  onNavigate,
}: {
  nodes: SidebarNode[];
  currentHref: string;
  onNavigate?: () => void;
}) {
  return (
    <ul className="flex flex-col gap-2">
      {nodes.map((node) => (
        <li key={node.href ?? node.title}>
          {node.href ? (
            <Link
              href={node.href}
              onClick={onNavigate}
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
              <NavList
                nodes={node.children}
                currentHref={currentHref}
                onNavigate={onNavigate}
              />
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}

// Shared nav markup for both the desktop aside and the mobile drawer.
// `onNavigate` lets the mobile drawer close itself when a link is tapped.
export function NavContent({
  projectTitle,
  projectHref,
  nodes,
  currentHref,
  onNavigate,
}: DocsNavProps & { onNavigate?: () => void }) {
  return (
    <nav>
      <Link
        href={projectHref}
        onClick={onNavigate}
        className={
          projectHref === currentHref
            ? "block font-bold text-foreground"
            : "block font-bold text-muted-foreground hover:text-foreground transition-colors"
        }
      >
        {projectTitle}
      </Link>
      {nodes.length > 0 && (
        <div className="mt-4">
          <NavList nodes={nodes} currentHref={currentHref} onNavigate={onNavigate} />
        </div>
      )}
    </nav>
  );
}
