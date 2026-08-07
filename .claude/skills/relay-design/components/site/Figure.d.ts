import * as React from "react";

/**
 * Bordered artefact with a mono caption — diagrams, screenshots, code stills.
 */
export interface FigureProps {
  caption?: React.ReactNode;
  /** Mono figure number, e.g. "FIG 02". */
  index?: string;
  /** Frame fill. */
  tone?: "sunken" | "page" | "inverse";
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

export declare function Figure(props: FigureProps): JSX.Element;
