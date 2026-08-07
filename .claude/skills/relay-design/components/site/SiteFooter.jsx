import React from "react";

export function SiteFooter({ wordmark = "RELAY", note, groups = [], style }) {
  return (
    <footer style={{
      borderTop: "var(--border-strong)", padding: "var(--space-7) var(--gutter-page) var(--space-8)",
      display: "grid", gridTemplateColumns: "1fr auto", gap: "var(--space-9)",
      fontFamily: "var(--font-mono)", fontSize: "var(--text-label)", ...style,
    }}>
      <div>
        <div style={{ fontWeight: "var(--weight-bold)", letterSpacing: "0.02em", color: "var(--ink-1)", fontSize: "12.5px" }}>{wordmark}</div>
        {note ? <div style={{ color: "var(--text-muted)", marginTop: "var(--space-3)", maxWidth: "42ch", lineHeight: 1.7, letterSpacing: 0 }}>{note}</div> : null}
      </div>
      <div style={{ display: "flex", gap: "var(--space-9)" }}>
        {groups.map((g, i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
            <div style={{
              fontSize: "var(--text-label-sm)", letterSpacing: "var(--tracking-label-wide)",
              textTransform: "uppercase", color: "var(--text-faint)", marginBottom: "var(--space-1)",
            }}>{g.title}</div>
            {g.links.map((l, j) => (
              <span key={j} style={{ color: "var(--ink-3)", cursor: "pointer" }}>{l}</span>
            ))}
          </div>
        ))}
      </div>
    </footer>
  );
}
