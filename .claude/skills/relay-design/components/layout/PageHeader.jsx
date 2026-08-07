import React from "react";

export function PageHeader({ meta, title, lead, style }) {
  return (
    <header style={{ padding: "var(--space-8) var(--gutter-page) var(--space-6)", borderBottom: "var(--border-hairline)", ...style }}>
      {meta ? <div style={{
        fontFamily: "var(--font-mono)", fontSize: "var(--text-label)",
        letterSpacing: "var(--tracking-label)", color: "var(--text-muted)", textTransform: "uppercase",
      }}>{meta}</div> : null}
      <h1 style={{
        fontFamily: "var(--font-mono)", fontSize: "var(--text-display)", lineHeight: "var(--leading-display)",
        letterSpacing: "var(--tracking-display)", fontWeight: "var(--weight-bold)",
        margin: "var(--space-3) 0 0", maxWidth: "760px", color: "var(--text-strong)",
      }}>{title}</h1>
      {lead ? <p style={{
        fontSize: "var(--text-lead)", lineHeight: 1.6, color: "var(--ink-3)",
        margin: "var(--space-3) 0 0", maxWidth: "640px",
      }}>{lead}</p> : null}
    </header>
  );
}
