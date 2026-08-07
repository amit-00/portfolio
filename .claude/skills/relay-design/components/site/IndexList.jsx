import React from "react";

export function IndexList({ items, onSelect, dense = false, style }) {
  const [hover, setHover] = React.useState(-1);
  return (
    <div style={{ borderTop: "var(--border-strong)", ...style }}>
      {items.map((it, i) => (
        <div
          key={i}
          onClick={onSelect ? () => onSelect(it, i) : undefined}
          onMouseEnter={() => setHover(i)}
          onMouseLeave={() => setHover(-1)}
          style={{
            display: "grid",
            gridTemplateColumns: "78px 1fr auto",
            gap: "var(--space-5)",
            alignItems: "baseline",
            padding: dense ? "12px 0" : "18px 0",
            borderBottom: "var(--border-hairline)",
            background: hover === i ? "var(--surface-fill)" : "transparent",
            cursor: onSelect ? "pointer" : "default",
            transition: "background 120ms linear",
          }}
        >
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-label)", color: "var(--text-faint)" }}>{it.meta}</span>
          <div style={{ minWidth: 0 }}>
            <div style={{
              fontFamily: "var(--font-mono)", fontSize: dense ? "14px" : "15px",
              fontWeight: "var(--weight-medium)", letterSpacing: "var(--tracking-heading)", color: "var(--text-strong)",
            }}>{it.title}</div>
            {it.description ? (
              <div style={{ fontSize: "var(--text-small)", lineHeight: "var(--leading-tight)", color: "var(--ink-4)", marginTop: "var(--space-1)", maxWidth: "58ch" }}>{it.description}</div>
            ) : null}
          </div>
          <span style={{
            fontFamily: "var(--font-mono)", fontSize: "var(--text-label-sm)",
            letterSpacing: "var(--tracking-label)", textTransform: "uppercase",
            color: hover === i ? "var(--ink-1)" : "var(--text-faint)",
          }}>{it.tag || (onSelect ? "\u2192" : "")}</span>
        </div>
      ))}
    </div>
  );
}
