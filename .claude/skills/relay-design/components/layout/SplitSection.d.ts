import * as React from "react";

/**
 * The signature layout: prose on the left, a code pane or diagram in the right gutter, split by a hairline.
 * @startingPoint section="Layout" subtitle="Prose left, code or diagram gutter right" viewport="700x300"
 */
export interface SplitSectionProps {
  /** Exactly two children: left prose, right gutter content. */
  children: React.ReactNode;
  /** Gutter fill. Use "inverse" only when the right side is a CodeBlock. */
  rightTone?: "sunken" | "page" | "inverse";
  /** Set false when the gutter holds a full-bleed CodeBlock. */
  rightPadded?: boolean;
  style?: React.CSSProperties;
}

export declare function SplitSection(props: SplitSectionProps): JSX.Element;
