import React from "react";

export function Figure({ caption, index, tone = "sunken", children, style }) {
  return (
    <figure style={{ margin: 0, ...style }}>
      <div style={{
        border: "var(--border-hairline)",
        background: tone === "inverse" ? "var(--surface-inverse)" : tone === "page" ? "var(--surface-page)" : "var(--surface-sunken)",
        borderRadius: "var(--radius)", overflow: "hidden",
      }}>{children}</div>
      {caption ? (
        <figcaption style={{
          display: "flex", gap: "var(--space-3)", marginTop: "var(--space-3)",
          fontFamily: "var(--font-mono)", fontSize: "var(--text-label-sm)",
          lineHeight: 1.5, color: "var(--text-muted)",
        }}>
          {index ? <span style={{ color: "var(--ink-1)", fontWeight: "var(--weight-bold)", whiteSpace: "nowrap" }}>{index}</span> : null}
          <span>{caption}</span>
        </figcaption>
      ) : null}
    </figure>
  );
}
