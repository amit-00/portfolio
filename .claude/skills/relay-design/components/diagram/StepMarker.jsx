import React from "react";

export function StepMarker({ n, x, y, tone = "ink", style }) {
  const inverse = tone === "inverse";
  return (
    <span style={{
      position: x !== undefined ? "absolute" : "relative", left: x, top: y,
      width: 20, height: 20, boxSizing: "border-box",
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      border: "1px solid var(--ink-1)", borderRadius: "var(--radius)",
      background: inverse ? "var(--ink-1)" : "var(--surface-page)",
      color: inverse ? "var(--text-inverse)" : "var(--ink-1)",
      fontFamily: "var(--font-mono)", fontSize: "10.5px", ...style,
    }}>{String(n).padStart(2, "0")}</span>
  );
}
