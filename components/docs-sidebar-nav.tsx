import Link from "next/link";
import type { ReactNode } from "react";
import type { SidebarNode } from "@/lib/content";

export interface DocsNavProps {
  projectTitle: string;
  projectHref: string;
  nodes: SidebarNode[];
  currentHref: string;
}

const LINK = "block font-mono text-small transition-colors duration-[120ms]";

function NavList({
  nodes,
  currentHref,
}: {
  nodes: SidebarNode[];
  currentHref: string;
}): ReactNode {
  return (
    <ul className="flex flex-col gap-[10px]">
      {nodes.map((node) => (
        <li key={node.href ?? node.title}>
          {node.href ? (
            <Link
              href={node.href}
              className={
                node.href === currentHref
                  ? `${LINK} text-ink-1`
                  : `${LINK} text-ink-5 hover:text-ink-1`
              }
            >
              {node.title}
            </Link>
          ) : (
            <span className="block font-mono text-label-sm uppercase text-ink-6">
              {node.title}
            </span>
          )}
          {node.children.length > 0 && (
            <div className="mt-[10px] border-l border-rule pl-4">
              <NavList nodes={node.children} currentHref={currentHref} />
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}

export function NavContent({
  projectTitle,
  projectHref,
  nodes,
  currentHref,
}: DocsNavProps): ReactNode {
  return (
    <nav>
      <Link
        href={projectHref}
        className={
          projectHref === currentHref
            ? "block font-mono text-small font-bold text-ink-1"
            : "block font-mono text-small font-bold text-ink-5 transition-colors duration-[120ms] hover:text-ink-1"
        }
      >
        {projectTitle}
      </Link>
      {nodes.length > 0 && (
        <div className="mt-5 border-t border-rule pt-5">
          <NavList nodes={nodes} currentHref={currentHref} />
        </div>
      )}
    </nav>
  );
}
