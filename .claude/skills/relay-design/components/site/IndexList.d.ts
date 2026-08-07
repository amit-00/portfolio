import * as React from "react";

/** One entry in an index list. */
export interface IndexItem {
  /** Left mono column — a year, date, or number. */
  meta: string;
  title: string;
  description?: string;
  /** Right-hand mono tag. Falls back to an arrow when the row is clickable. */
  tag?: string;
}

/**
 * Ruled index of work or writing: mono meta column, title, one-line description.
 */
export interface IndexListProps {
  items: IndexItem[];
  /** Makes rows clickable and hover-filled. */
  onSelect?: (item: IndexItem, index: number) => void;
  /** Tighter rows for long archives. */
  dense?: boolean;
  style?: React.CSSProperties;
}

export declare function IndexList(props: IndexListProps): JSX.Element;
