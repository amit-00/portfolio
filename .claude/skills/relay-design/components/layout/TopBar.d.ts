import * as React from "react";

/**
 * Full-width docs header: wordmark, slash-separated breadcrumb, right-hand utilities, over a 1px ink rule.
 * @startingPoint section="Layout" subtitle="Docs top bar with breadcrumb" viewport="700x120"
 */
export interface TopBarProps {
  /** Wordmark text — the system ships no logo asset. */
  product?: string;
  /** Slash-separated path, e.g. "docs / deep-dive / change-capture". */
  breadcrumb?: React.ReactNode;
  right?: React.ReactNode;
  style?: React.CSSProperties;
}

export declare function TopBar(props: TopBarProps): JSX.Element;
