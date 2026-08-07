import type { ReactNode } from "react";
import type { EdgeMode, EdgeOutcome } from "./DiagramEdge";
import type { LegendKind } from "./DiagramLegend";

export interface FrameEdge {
  /** Node ids, used for hover dimming. Omit for a decorative edge. */
  from?: string;
  to?: string;
  /** SVG path in canvas coordinates. */
  d: string;
  mode?: EdgeMode;
  outcome?: EdgeOutcome;
  flow?: boolean;
  speed?: number;
  /** Mono chip drawn over the line, with a page-coloured backing. */
  label?: string;
  /** [x, y] in canvas coordinates. Required when `label` is set. */
  labelAt?: [number, number];
}

export interface DiagramFrameProps {
  width: number;
  height: number;
  edges?: FrameEdge[];
  legend?: (LegendKind | { kind: LegendKind; label: string })[];
  /** Mono, lowercase: `fig. 01 — change capture, one degraded consumer`. */
  caption?: string;
  /** Hover-to-isolate. Set false for a static figure. Default true. */
  interactive?: boolean;
  /** Master switch for the flow pulse; individual edges still opt in. Default true. */
  flow?: boolean;
  /** Default seconds per cycle for edges that do not set their own. Default 1.6. */
  speed?: number;
  padded?: boolean;
  /** DiagramNode and Boundary children, placed in canvas coordinates. */
  children?: ReactNode;
}

export declare function DiagramFrame(props: DiagramFrameProps): JSX.Element;
