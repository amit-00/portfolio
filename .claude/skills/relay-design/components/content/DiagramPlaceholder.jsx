import React from "react";

export function DiagramPlaceholder({ label = "diagram", height = 240, style }) {
  return (
    <div style={{
      border: "var(--border-hairline)", height, minHeight: height,
      background: "repeating-linear-gradient(135deg, var(--surface-fill) 0 6px, var(--surface-page) 6px 12px)",
      display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "var(--radius)", ...style,
    }}>
      <span style={{
        fontFamily: "var(--font-mono)", fontSize: "var(--text-label)", color: "var(--ink-4)",
        background: "var(--surface-page)", border: "var(--border-hairline)", padding: "6px 12px",
      }}>{label}</span>
    </div>
  );
}
