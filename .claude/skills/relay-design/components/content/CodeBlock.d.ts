import * as React from "react";

/**
 * Filename-headed code pane. Dark is the default and carries the page's only large dark field.
 * @startingPoint section="Content" subtitle="Dark and light code panes" viewport="700x260"
 */
export interface CodeBlockProps {
  filename?: string;
  language?: string;
  /** Raw source; no syntax highlighting by design. */
  code: string;
  tone?: "dark" | "light";
  style?: React.CSSProperties;
}

export declare function CodeBlock(props: CodeBlockProps): JSX.Element;
