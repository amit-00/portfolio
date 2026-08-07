import type { ReactNode } from "react";
import { NavContent, type DocsNavProps } from "@/components/docs-sidebar-nav";

export type DocsSidebarProps = DocsNavProps;

export function DocsSidebar(props: DocsSidebarProps): ReactNode {
  return (
    <>
      <aside className="hidden w-56 shrink-0 md:block">
        <div className="sticky top-9">
          <NavContent {...props} />
        </div>
      </aside>

      {/* Mobile: a native disclosure. The system has no motion to animate a
          drawer with, and <details> needs no client component. */}
      <details className="border-b border-rule pb-5 md:hidden">
        <summary className="cursor-pointer list-none font-mono text-label uppercase text-ink-5 marker:content-none">
          Contents +
        </summary>
        <div className="mt-5">
          <NavContent {...props} />
        </div>
      </details>
    </>
  );
}
