import React from "react";

export function MetaRow({ items, separator = "\u00b7", style }) {
  return (
    <div style={{
      display: "flex", flexWrap: "wrap", alignItems: "center", gap: "var(--space-3)",
      fontFamily: "var(--font-mono)", fontSize: "var(--text-label)",
      letterSpacing: "var(--tracking-label)", textTransform: "uppercase",
      color: "var(--text-muted)", ...style,
    }}>
      {items.map((it, i) => (
        <React.Fragment key={i}>
          {i > 0 ? <span style={{ color: "var(--text-faint)" }}>{separator}</span> : null}
          <span>{it}</span>
        </React.Fragment>
      ))}
    </div>
  );
}
