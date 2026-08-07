import React from "react";

export function StepList({ steps, style }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", borderTop: "var(--border-hairline)", ...style }}>
      {steps.map((s, i) => (
        <div key={i} style={{
          display: "grid", gridTemplateColumns: "38px 1fr", padding: "11px 0",
          borderBottom: "var(--border-hairline)",
        }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-label)", color: "var(--text-muted)" }}>
            {String(i + 1).padStart(2, "0")}
          </span>
          <span style={{ fontSize: "var(--text-small)", lineHeight: "var(--leading-tight)", color: "var(--ink-2)" }}>
            {s.title ? <b style={{ fontWeight: "var(--weight-semibold, 600)" }}>{s.title} </b> : null}{s.body}
          </span>
        </div>
      ))}
    </div>
  );
}
