import * as React from "react";

/**
 * Mono metadata run — date, reading time, topic, status.
 */
export interface MetaRowProps {
  items: React.ReactNode[];
  /** Character drawn between items. Default "·". */
  separator?: string;
  style?: React.CSSProperties;
}

export declare function MetaRow(props: MetaRowProps): JSX.Element;
