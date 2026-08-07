import * as React from "react";

/** Small mono chip for versions, statuses and method labels. */
export interface BadgeProps {
  tone?: "neutral" | "solid" | "warning" | "danger" | "success";
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

export declare function Badge(props: BadgeProps): JSX.Element;
