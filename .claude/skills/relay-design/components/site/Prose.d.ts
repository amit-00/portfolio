import * as React from "react";

/**
 * Long-form prose container: sets the 68ch measure and styles h2/h3, lists,
 * blockquote, inline code and rules so article bodies need no per-element markup.
 */
export interface ProseProps {
  children?: React.ReactNode;
  /** Override the reading measure. Default var(--measure) = 68ch. */
  measure?: string;
  style?: React.CSSProperties;
}

export declare function Prose(props: ProseProps): JSX.Element;
