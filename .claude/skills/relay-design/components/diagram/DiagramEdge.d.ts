export type EdgeMode = "sync" | "async";
export type EdgeOutcome = "ok" | "failure";

export interface DiagramEdgeProps {
  /** SVG path in canvas coordinates, orthogonal on a 4px grid. */
  d: string;
  /** Solid when the caller waits, dashed when it does not. Default "sync". */
  mode?: EdgeMode;
  /** "failure" switches the stroke to danger, dashes it, and disables flow. */
  outcome?: EdgeOutcome;
  /** Run the travelling pulse along this path. At most one per diagram. */
  flow?: boolean;
  /** Seconds per cycle. 1.6 standard, 6 batched or lagging. */
  speed?: number;
  arrow?: boolean;
  opacity?: number;
}

export declare function DiagramEdge(props: DiagramEdgeProps): JSX.Element;
export declare function ArrowDefs(): JSX.Element;
