import * as React from "react";

/**
 * Boxed aside for a caveat the reader must not skim past.
 * @startingPoint section="Content" subtitle="Note, warning and danger callouts" viewport="700x180"
 */
export interface CalloutProps {
  tone?: "note" | "warning" | "danger";
  /** Uppercase mono label; defaults to the tone name. */
  title?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

export declare function Callout(props: CalloutProps): JSX.Element;
