import type { ReactNode } from "react";

export type NodeKind =
  | "service" | "datastore" | "queue" | "external"
  | "client" | "job" | "terminal" | "decision";

export type NodeStatus = "ok" | "degraded" | "failed";

export interface DiagramNodeProps {
  /** Stable id, referenced by edge `from`/`to` and by hover dimming. */
  id?: string;
  kind?: NodeKind;
  /** Mono, lowercase, the real name of the thing: `orders_pg`, `changes.v2`. */
  name: string;
  /** One line of consequence: replicas, retention, schedule. Optional. */
  meta?: string;
  status?: NodeStatus;
  /** A Relay <Badge> when the status needs a reason in words. */
  badge?: ReactNode;
  /** Canvas coordinates. Omit both to render in normal flow. */
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  opacity?: number;
  onFocusNode?: (id: string) => void;
  onBlurNode?: () => void;
}

export declare function DiagramNode(props: DiagramNodeProps): JSX.Element;
