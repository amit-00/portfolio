import React from "react";

const tones = {
  note: { border: "var(--border-hairline)", background: "var(--surface-fill)", label: "var(--ink-3)", mark: "i" },
  warning: { border: "var(--border-strong)", background: "var(--surface-fill)", label: "var(--ink-1)", mark: "!" },
  danger: { border: "1px solid var(--danger)", background: "var(--danger-wash)", label: "var(--danger)", mark: "!" },
};

export function Callout({ tone = "note", title, children, style }) {
  const t = tones[tone];
  return (
    <div style={{ border: t.border, background: t.background, padding: "13px 15px", borderRadius: "var(--radius)", ...style }}>
      <div style={{
        fontFamily: "var(--font-mono)", fontSize: "var(--text-label-sm)",
        letterSpacing: "var(--tracking-label-wide)", fontWeight: "var(--weight-bold)",
        textTransform: "uppercase", color: t.label,
      }}>{t.mark} {title || tone}</div>
      <div style={{ fontSize: "var(--text-small)", lineHeight: "var(--leading-tight)", marginTop: "var(--space-1)", color: "var(--ink-3)" }}>{children}</div>
    </div>
  );
}
