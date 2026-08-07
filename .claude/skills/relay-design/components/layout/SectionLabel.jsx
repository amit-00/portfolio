import React from "react";

export function SectionLabel({ index, children, style }) {
  return (
    <div style={{
      fontFamily: "var(--font-mono)", fontSize: "var(--text-label)",
      letterSpacing: "var(--tracking-label)", color: "var(--text-muted)",
      textTransform: "uppercase", ...style,
    }}>{index ? index + " / " : ""}{children}</div>
  );
}
