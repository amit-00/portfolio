export type LegendKind = "sync" | "async" | "failure" | "retry";

export interface DiagramLegendProps {
  /** Either bare kinds, or {kind, label} to rename a line for this figure. */
  items: (LegendKind | { kind: LegendKind; label: string })[];
}

export declare function DiagramLegend(props: DiagramLegendProps): JSX.Element;
