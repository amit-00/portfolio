import React from "react";

export function Boundary({ x, y, w, h, label, opacity = 1, children, style }) {
  return (
    <div style={{
      position: "absolute", left: x, top: y, width: w, height: h, boxSizing: "border-box",
      border: "1px dashed var(--ink-6)", borderRadius: "var(--radius)", background: "none",
      opacity, transition: "opacity 120ms linear", pointerEvents: "none", ...style,
    }}>
      {label ? (
        <span style={{
          position: "absolute", top: -8, left: 12, background: "var(--surface-page)",
          padding: "0 6px", fontFamily: "var(--font-mono)", fontSize: "10.5px",
          letterSpacing: "var(--tracking-label-wide)", textTransform: "uppercase", color: "var(--ink-5)",
        }}>{label}</span>
      ) : null}
      {children}
    </div>
  );
}
