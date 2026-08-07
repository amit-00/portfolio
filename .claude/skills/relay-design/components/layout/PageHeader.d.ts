import * as React from "react";

/**
 * Page title block: mono meta line, tight mono display title, sans lead paragraph.
 * @startingPoint section="Layout" subtitle="Mono display title with meta and lead" viewport="700x220"
 */
export interface PageHeaderProps {
  /** Mono uppercase line, e.g. "UPDATED 2026-07-28". */
  meta?: React.ReactNode;
  title: React.ReactNode;
  lead?: React.ReactNode;
  style?: React.CSSProperties;
}

export declare function PageHeader(props: PageHeaderProps): JSX.Element;
