import type { ReactNode } from "react";

const LINKS: { label: string; href: string }[] = [
  { label: "amit.v@hotmail.com", href: "mailto:amit.v@hotmail.com" },
  { label: "linkedin", href: "https://www.linkedin.com/in/amitv00/" },
  { label: "github", href: "https://github.com/amit-00" },
];

export function SiteFooter(): ReactNode {
  return (
    <footer className="grid gap-9 border-t border-rule-strong px-gutter pt-section pb-11 font-mono text-label sm:grid-cols-[1fr_auto]">
      <div>
        <div className="text-[12.5px] font-bold tracking-[0.02em] text-ink-1">
          AMIT VERMA
        </div>
        <div className="mt-3 max-w-[42ch] leading-[1.7] tracking-normal text-ink-5">
          Software engineer in Toronto. Backend systems at CIBC; distributed and
          real-time work on the side.
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="mb-1 text-label-sm uppercase text-ink-6">Contact</div>
        {LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            target={link.href.startsWith("mailto:") ? undefined : "_blank"}
            rel="noopener noreferrer"
            className="text-ink-3 transition-colors duration-[120ms] hover:text-ink-1"
          >
            {link.label}
          </a>
        ))}
      </div>
    </footer>
  );
}
