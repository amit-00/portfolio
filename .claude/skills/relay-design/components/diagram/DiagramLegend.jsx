import React from "react";

const SPECS = {
  sync: { stroke: "var(--dg-edge)", dash: undefined, label: "sync" },
  async: { stroke: "var(--dg-edge)", dash: "3 4", label: "async" },
  failure: { stroke: "var(--danger)", dash: "6 4", label: "failure" },
  retry: { stroke: "var(--ink-4)", dash: "3 4", label: "retry" },
};

export function DiagramLegend({ items = [], style }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 20, ...style }}>
      {items.map((it) => {
        const s = typeof it === "string" ? SPECS[it] : { ...SPECS[it.kind], label: it.label };
        return (
          <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <svg width="30" height="8" style={{ display: "block" }}>
              <line x1="0" y1="4" x2="30" y2="4" stroke={s.stroke} strokeWidth="1" strokeDasharray={s.dash} />
            </svg>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--text-muted)" }}>{s.label}</span>
          </div>
        );
      })}
    </div>
  );
}
