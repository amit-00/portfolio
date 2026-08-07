import type { ReactNode } from "react";

/**
 * Photography is foreign to this system, so any real asset is boxed with a
 * hairline and labelled in mono rather than bled into the page.
 */
export function Figure({
  caption,
  children,
}: {
  caption?: string;
  children: ReactNode;
}): ReactNode {
  return (
    <figure className="my-6">
      <div className="overflow-hidden border border-rule bg-sunken">
        {children}
      </div>
      {caption && (
        <figcaption className="mt-3 font-mono text-label-sm leading-[1.5] text-ink-5">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
