import React from "react";

export function PrevNextNav({ prev, next, style }) {
  return (
    <nav style={{
      display: "flex", justifyContent: "space-between", paddingTop: "var(--space-4)",
      borderTop: "var(--border-strong)", fontFamily: "var(--font-mono)", fontSize: "13px", ...style,
    }}>
      <span style={{ color: "var(--text-muted)" }}>{prev ? "\u2190 " + prev : ""}</span>
      <span style={{ fontWeight: "var(--weight-bold)", color: "var(--ink-1)" }}>{next ? next + " \u2192" : ""}</span>
    </nav>
  );
}
