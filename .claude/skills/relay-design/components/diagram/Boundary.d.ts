import type { ReactNode } from "react";

export interface BoundaryProps {
  /** Canvas coordinates. May sit outside the canvas box; overflow is visible. */
  x: number;
  y: number;
  w: number;
  h: number;
  /** Mono, uppercase, slash-separated: `relay / control plane`, `vpc / private`. */
  label?: string;
  opacity?: number;
  children?: ReactNode;
}

export declare function Boundary(props: BoundaryProps): JSX.Element;
