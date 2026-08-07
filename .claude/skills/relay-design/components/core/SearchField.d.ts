import * as React from "react";

/** Hairline search input with a mono shortcut hint; lives in the TopBar. */
export interface SearchFieldProps {
  placeholder?: string;
  /** Mono hint rendered at the right edge. */
  shortcut?: string;
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  width?: number | string;
}

export declare function SearchField(props: SearchFieldProps): JSX.Element;
