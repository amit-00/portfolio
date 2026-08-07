export interface StepMarkerProps {
  /** Rendered zero-padded: 1 becomes 01. */
  n: number;
  /** Canvas coordinates. Omit to render inline. */
  x?: number;
  y?: number;
  tone?: "ink" | "inverse";
}

export declare function StepMarker(props: StepMarkerProps): JSX.Element;
