import type { ReactNode } from "react";

export function SectionLabel({
  index,
  children,
}: {
  index?: string;
  children: ReactNode;
}): ReactNode {
  return (
    <div className="font-mono text-label uppercase text-ink-5">
      {index ? `${index} / ` : ""}
      {children}
    </div>
  );
}
