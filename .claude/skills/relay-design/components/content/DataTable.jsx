import React from "react";

export function DataTable({ columns, rows, monoColumns = [0], style }) {
  return (
    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "var(--text-small)", ...style }}>
      <thead>
        <tr style={{ borderBottom: "var(--border-strong)" }}>
          {columns.map((c, i) => (
            <th key={i} style={{
              textAlign: "left", padding: "8px 0", fontWeight: "var(--weight-medium)",
              fontFamily: "var(--font-mono)", fontSize: "var(--text-label-sm)",
              letterSpacing: "var(--tracking-label)", textTransform: "uppercase", color: "var(--text-muted)",
            }}>{c}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((r, ri) => (
          <tr key={ri} style={{ borderBottom: "var(--border-hairline)" }}>
            {r.map((cell, ci) => (
              <td key={ci} style={{
                padding: "var(--pad-cell-y) var(--pad-cell-x) var(--pad-cell-y) 0",
                fontFamily: monoColumns.includes(ci) ? "var(--font-mono)" : "var(--font-sans)",
                fontSize: monoColumns.includes(ci) ? "var(--text-code)" : "var(--text-small)",
                color: ci === 0 ? "var(--ink-1)" : "var(--ink-3)",
                verticalAlign: "top",
              }}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
