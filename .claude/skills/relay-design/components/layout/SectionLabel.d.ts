import * as React from "react";

/** Numbered mono eyebrow marking each stage of the argument: "01 / PROBLEM". */
export interface SectionLabelProps {
  /** Zero-padded index, e.g. "01". */
  index?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

export declare function SectionLabel(props: SectionLabelProps): JSX.Element;
