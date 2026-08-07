import React from "react";

const tones = {
  neutral: { color: "var(--ink-4)", border: "var(--border-hairline)", background: "transparent" },
  solid: { color: "var(--text-inverse)", border: "1px solid var(--ink-1)", background: "var(--ink-1)" },
  warning: { color: "var(--warning)", border: "1px solid var(--warning)", background: "var(--warning-wash)" },
  danger: { color: "var(--danger)", border: "1px solid var(--danger)", background: "var(--danger-wash)" },
  success: { color: "var(--success)", border: "1px solid var(--success)", background: "var(--success-wash)" },
};

export function Badge({ tone = "neutral", children, style }) {
  return (
    <span style={{
      fontFamily: "var(--font-mono)",
      fontSize: "var(--text-label-sm)",
      letterSpacing: "var(--tracking-label)",
      padding: "3px 8px",
      borderRadius: "var(--radius)",
      whiteSpace: "nowrap",
      ...tones[tone],
      ...style,
    }}>{children}</span>
  );
}
