import Link from "next/link";
import type { ReactNode } from "react";

export function TopBar({ breadcrumb }: { breadcrumb?: string }): ReactNode {
  return (
    <div className="flex h-bar items-center justify-between gap-6 border-b border-rule-strong bg-page px-gutter font-mono text-[12.5px]">
      <div className="flex min-w-0 items-center gap-6">
        <Link
          href="/"
          className="whitespace-nowrap font-bold tracking-[0.02em] text-ink-1"
        >
          AMIT VERMA
        </Link>
        {breadcrumb && (
          <span className="hidden truncate text-ink-5 sm:inline">
            {breadcrumb}
          </span>
        )}
      </div>
      <div className="flex items-center gap-5 text-ink-5">
        <a
          href="https://www.linkedin.com/in/amitv00/"
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors duration-[120ms] hover:text-ink-1"
        >
          linkedin
        </a>
        <a
          href="mailto:amit.v@hotmail.com"
          className="transition-colors duration-[120ms] hover:text-ink-1"
        >
          email
        </a>
      </div>
    </div>
  );
}
