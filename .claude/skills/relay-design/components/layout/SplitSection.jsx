import React from "react";

export function SplitSection({ children, rightTone = "sunken", rightPadded = true, style }) {
  const [left, right] = React.Children.toArray(children);
  const bg = { sunken: "var(--surface-sunken)", page: "var(--surface-page)", inverse: "var(--surface-inverse)" }[rightTone];
  return (
    <section style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderBottom: "var(--border-hairline)", ...style }}>
      <div style={{
        padding: "var(--pad-section) var(--space-7) var(--pad-section) var(--gutter-page)",
        borderRight: "var(--border-hairline)",
      }}>{left}</div>
      <div style={{ background: bg, padding: rightPadded ? "var(--pad-section) var(--gutter-page)" : 0 }}>{right}</div>
    </section>
  );
}
