import * as React from "react";

/**
 * Hatched slot reserving space for a real architecture diagram, labelled with what belongs there.
 * @startingPoint section="Content" subtitle="Hatched diagram slot" viewport="700x220"
 */
export interface DiagramPlaceholderProps {
  /** Describe the diagram, not the placeholder: "WAL to capture to fanout". */
  label?: string;
  height?: number | string;
  style?: React.CSSProperties;
}

export declare function DiagramPlaceholder(props: DiagramPlaceholderProps): JSX.Element;
