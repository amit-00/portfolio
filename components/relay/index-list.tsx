import Link from "next/link";
import type { ReactNode } from "react";

export interface IndexItem {
  meta: string;
  title: string;
  description?: string;
  tag?: string;
  href?: string;
  /** Renders a plain anchor with target=_blank instead of a Next route link. */
  external?: boolean;
}

const ROW =
  "group grid grid-cols-[64px_1fr] sm:grid-cols-[78px_1fr_auto] gap-x-5 gap-y-2 items-baseline " +
  "border-b border-rule transition-colors duration-[120ms] hover:bg-fill";

function RowBody({
  item,
  dense,
}: {
  item: IndexItem;
  dense: boolean;
}): ReactNode {
  return (
    <>
      <span className="font-mono text-label text-ink-6">{item.meta}</span>
      <div className="min-w-0">
        <div
          className={`font-mono font-medium tracking-[-0.02em] text-ink-1 ${
            dense ? "text-[14px]" : "text-[15px]"
          }`}
        >
          {item.title}
        </div>
        {item.description && (
          <div className="mt-1 max-w-[58ch] text-small text-ink-4">
            {item.description}
          </div>
        )}
      </div>
      <span className="col-start-2 sm:col-start-3 font-mono text-label-sm uppercase text-ink-6 transition-colors duration-[120ms] group-hover:text-ink-1">
        {item.tag ?? (item.href ? "→" : "")}
      </span>
    </>
  );
}

export function IndexList({
  items,
  dense = false,
}: {
  items: IndexItem[];
  dense?: boolean;
}): ReactNode {
  const pad = dense ? "py-3" : "py-[18px]";
  return (
    <div className="border-t border-rule-strong">
      {items.map((item) => {
        const body = <RowBody item={item} dense={dense} />;
        if (!item.href) {
          return (
            <div key={item.title} className={`${ROW} ${pad}`}>
              {body}
            </div>
          );
        }
        if (item.external) {
          return (
            <a
              key={item.title}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`${ROW} ${pad}`}
            >
              {body}
            </a>
          );
        }
        return (
          <Link key={item.title} href={item.href} className={`${ROW} ${pad}`}>
            {body}
          </Link>
        );
      })}
    </div>
  );
}
