import * as React from "react";

/**
 * Reference table with a mono uppercase header and hairline rows. No zebra striping, no outer border.
 * @startingPoint section="Content" subtitle="Config reference table" viewport="700x220"
 */
export interface DataTableProps {
  columns: React.ReactNode[];
  rows: React.ReactNode[][];
  /** Column indices rendered in mono — keys, defaults, ranges. */
  monoColumns?: number[];
  style?: React.CSSProperties;
}

export declare function DataTable(props: DataTableProps): JSX.Element;
