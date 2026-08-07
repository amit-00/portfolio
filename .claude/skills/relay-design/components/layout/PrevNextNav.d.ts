import * as React from "react";

/** Footer pager in mono slugs; next is bold, previous is muted. */
export interface PrevNextNavProps {
  /** Lowercase slug, e.g. "concepts". */
  prev?: string;
  next?: string;
  style?: React.CSSProperties;
}

export declare function PrevNextNav(props: PrevNextNavProps): JSX.Element;
