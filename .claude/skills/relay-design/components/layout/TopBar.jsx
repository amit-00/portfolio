import React from "react";

export function TopBar({ product = "RELAY", breadcrumb, right, style }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 var(--gutter-page)", height: "var(--bar-height)",
      borderBottom: "var(--border-strong)", background: "var(--surface-page)",
      fontFamily: "var(--font-mono)", fontSize: "12.5px", ...style,
    }}>
      <div style={{ display: "flex", gap: "var(--space-6)", alignItems: "center" }}>
        <span style={{ fontWeight: "var(--weight-bold)", letterSpacing: "0.02em" }}>{product}</span>
        {breadcrumb ? <span style={{ color: "var(--text-muted)" }}>{breadcrumb}</span> : null}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-5)", color: "var(--text-muted)" }}>{right}</div>
    </div>
  );
}
