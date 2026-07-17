"use client";

import { useEffect, useState } from "react";
import { PanelRightOpen, X } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  NavContent,
  dockSurface,
  type DocsNavProps,
} from "@/components/docs-sidebar-nav";

export function MobileDocsDrawer(props: DocsNavProps) {
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);

  // Close on Escape and lock body scroll while the drawer is open.
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    document.addEventListener("keydown", onKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  return (
    <div className="md:hidden">
      {/* Trigger sits on the drawer's side and hides while the drawer is open. */}
      <button
        type="button"
        aria-label="Open docs navigation"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className={cn(
          "fixed top-4 right-4 z-50 flex size-12 items-center justify-center rounded-2xl border-[0.5px] transition-opacity",
          dockSurface,
          open ? "pointer-events-none opacity-0" : "opacity-100",
        )}
      >
        <PanelRightOpen className="size-5" />
      </button>

      {/* Backdrop — dims the page and closes the drawer on tap. */}
      <div
        aria-hidden
        onClick={close}
        className={cn(
          "fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />

      {/* Sliding panel — enters from the right edge. */}
      <aside
        aria-label="Docs navigation"
        aria-hidden={!open}
        className={cn(
          "fixed top-0 right-0 z-50 h-full w-72 max-w-[85vw] overflow-y-auto border-l p-6 transition-transform duration-300 ease-out",
          dockSurface,
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        <button
          type="button"
          aria-label="Close docs navigation"
          onClick={close}
          className="mb-4 flex size-9 items-center justify-center rounded-full text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="size-5" />
        </button>
        <NavContent {...props} onNavigate={close} />
      </aside>
    </div>
  );
}
