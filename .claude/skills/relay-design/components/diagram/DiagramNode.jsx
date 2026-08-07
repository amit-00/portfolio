import React from "react";

const KINDS = {
  service: {},
  datastore: { borderBottom: "3px solid var(--ink-1)" },
  queue: { borderLeft: "4px double var(--ink-1)" },
  external: { border: "1px dashed var(--ink-6)", background: "var(--surface-sunken)" },
  client: { borderTop: "3px solid var(--ink-1)" },
  job: { borderLeft: "3px solid var(--ink-1)" },
  terminal: { border: "1px solid var(--ink-1)", background: "var(--surface-inverse)" },
  decision: {},
};

const TICKS = {
  ok: { border: "1px solid var(--ink-4)" },
  degraded: { background: "var(--warning)", border: "1px solid var(--warning)" },
  failed: { background: "var(--danger)", border: "1px solid var(--danger)" },
};

export function DiagramNode({
  id, kind = "service", name, meta, status = "ok", badge,
  x, y, width = 168, height = 72,
  opacity = 1, onFocusNode, onBlurNode, style,
}) {
  const inverse = kind === "terminal";
  const external = kind === "external";
  const placed = x !== undefined && y !== undefined;
  return (
    <div
      onMouseEnter={onFocusNode ? () => onFocusNode(id) : undefined}
      onMouseLeave={onBlurNode}
      style={{
        position: placed ? "absolute" : "relative",
        left: placed ? x : undefined, top: placed ? y : undefined,
        width, height: placed ? height : undefined, boxSizing: "border-box",
        border: "1px solid var(--rule-strong)", background: "var(--surface-raised)",
        padding: "9px 11px", display: "flex", flexDirection: "column", gap: 3,
        borderRadius: "var(--radius)", opacity, transition: "opacity 120ms linear",
        ...KINDS[kind], ...style,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
        <span style={{
          fontFamily: "var(--font-mono)", fontSize: "10.5px", letterSpacing: "var(--tracking-label-wide)",
          textTransform: "uppercase", color: inverse ? "var(--text-inverse-muted)" : "var(--ink-6)",
        }}>{kind}</span>
        {kind === "decision" ? null : (
          <span style={{
            width: 6, height: 6,
            ...(inverse ? { border: "1px solid var(--text-inverse-muted)" }
              : external && status === "ok" ? { border: "1px solid var(--ink-6)" }
              : TICKS[status]),
          }} />
        )}
      </div>
      <div style={{
        fontFamily: "var(--font-mono)", fontSize: "13px", fontWeight: "var(--weight-medium)",
        color: inverse ? "var(--text-inverse)" : external ? "var(--ink-3)" : "var(--ink-1)",
      }}>{kind === "decision" ? "? " + name : name}</div>
      {badge ? <div style={{ marginTop: 3, display: "flex" }}>{badge}</div> : null}
      {meta ? (
        <div style={{
          fontFamily: "var(--font-mono)", fontSize: "10.5px",
          color: inverse ? "var(--text-inverse-muted)" : "var(--ink-5)",
        }}>{meta}</div>
      ) : null}
    </div>
  );
}
