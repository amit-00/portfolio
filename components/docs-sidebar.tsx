import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  NavContent,
  dockSurface,
  type DocsNavProps,
} from "@/components/docs-sidebar-nav";
import { MobileDocsDrawer } from "@/components/docs-sidebar-mobile";

export type DocsSidebarProps = DocsNavProps;

export function DocsSidebar(props: DocsSidebarProps) {
  return (
    <>
      <Link
        href="/"
        aria-label="Back to portfolio"
        className={cn(
          "fixed top-4 left-4 z-50 flex size-12 items-center justify-center rounded-2xl border-[0.5px] text-muted-foreground hover:text-foreground transition-colors",
          dockSurface,
        )}
      >
        <ArrowLeft className="size-5" />
      </Link>

      <aside className="hidden md:block w-56 shrink-0">
        <div className="sticky top-24">
          <NavContent {...props} />
        </div>
      </aside>

      <MobileDocsDrawer {...props} />
    </>
  );
}
