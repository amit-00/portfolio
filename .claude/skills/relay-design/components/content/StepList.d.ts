import * as React from "react";

/**
 * Zero-padded ordered sequence for describing a data flow stage by stage.
 * @startingPoint section="Content" subtitle="Numbered data-flow steps" viewport="700x210"
 */
export interface StepListStep {
  /** Optional bold lead-in, e.g. "Capture." */
  title?: string;
  body: React.ReactNode;
}

export interface StepListProps {
  steps: StepListStep[];
  style?: React.CSSProperties;
}

export declare function StepList(props: StepListProps): JSX.Element;
