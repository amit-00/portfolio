import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

export interface IndexItem {
  meta: string;
  title: string;
  description?: string;
  tag?: string;
  /** Boxed with a hairline rather than bled — imagery is foreign here. */
  image?: string;
  href?: string;
  /** Renders a plain anchor with target=_blank instead of a Next route link. */
  external?: boolean;
}

const ROW =
  "group grid gap-x-5 gap-y-3 items-start border-b border-rule " +
  "transition-colors duration-[120ms] hover:bg-fill";

const COLS_TEXT = "grid-cols-[64px_1fr] sm:grid-cols-[78px_1fr_auto]";
const COLS_IMAGE = "grid-cols-[104px_1fr] sm:grid-cols-[168px_1fr_auto]";

function RowBody({
  item,
  dense,
}: {
  item: IndexItem;
  dense: boolean;
}): ReactNode {
  return (
    <>
      {item.image ? (
        <div className="overflow-hidden border border-rule bg-sunken">
          <Image
            src={item.image}
            alt=""
            width={336}
            height={189}
            className="aspect-video w-full object-cover"
          />
        </div>
      ) : (
        <span className="font-mono text-label text-ink-6">{item.meta}</span>
      )}

      <div className="min-w-0">
        {item.image && (
          <div className="mb-1 font-mono text-label uppercase text-ink-6">
            {item.meta}
          </div>
        )}
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
  return (
    <div className="border-t border-rule-strong">
      {items.map((item) => {
        const className = `${ROW} ${item.image ? COLS_IMAGE : COLS_TEXT} ${
          dense ? "py-3" : "py-[18px]"
        }`;
        const body = <RowBody item={item} dense={dense} />;

        if (!item.href) {
          return (
            <div key={item.title} className={className}>
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
              className={className}
            >
              {body}
            </a>
          );
        }
        return (
          <Link key={item.title} href={item.href} className={className}>
            {body}
          </Link>
        );
      })}
    </div>
  );
}
