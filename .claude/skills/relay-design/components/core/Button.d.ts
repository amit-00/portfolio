import * as React from "react";

/**
 * Flat mono-label button. Primary is solid ink; secondary is a hairline box.
 * @startingPoint section="Core" subtitle="Mono-label buttons in three weights" viewport="700x150"
 */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual weight. Use at most one primary per view. */
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md";
  disabled?: boolean;
  /** Mono labels are uppercase by default. */
  uppercase?: boolean;
  children?: React.ReactNode;
}

export declare function Button(props: ButtonProps): JSX.Element;
