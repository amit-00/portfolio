import * as React from "react";

export interface FooterGroup {
  title: string;
  links: string[];
}

/**
 * Page-closing footer: wordmark and a short note on the left, mono link columns on the right.
 */
export interface SiteFooterProps {
  /** Type wordmark — the system ships no logo asset. */
  wordmark?: string;
  note?: React.ReactNode;
  groups?: FooterGroup[];
  style?: React.CSSProperties;
}

export declare function SiteFooter(props: SiteFooterProps): JSX.Element;
