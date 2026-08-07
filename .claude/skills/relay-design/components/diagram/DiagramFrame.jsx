import React, { useState } from "react";
import { DiagramEdge, ArrowDefs } from "./DiagramEdge";
import { DiagramLegend } from "./DiagramLegend";

export function DiagramFrame({
  width, height, edges = [], legend, caption,
  interactive = true, flow = true, speed = 1.6,
  padded = true, children, style,
}) {
  const [focus, setFocus] = useState(null);

  const adj = {};
  edges.forEach((e) => {
    if (!e.from || !e.to) return;
    (adj[e.from] = adj[e.from] || []).push(e.to);
    (adj[e.to] = adj[e.to] || []).push(e.from);
  });

  const nodeOp = (id) =>
    !interactive || !focus || !id || id === focus || (adj[focus] || []).indexOf(id) > -1 ? 1 : 0.28;
  const edgeOp = (e) =>
    !interactive || !focus || e.from === focus || e.to === focus ? 1 : 0.18;

  const onFocusNode = interactive ? (id) => setFocus(id) : undefined;
  const onBlurNode = interactive ? () => setFocus(null) : undefined;

  const kids = React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) return child;
    const id = child.props.id;
    const extra = { opacity: nodeOp(id) };
    if (id) { extra.onFocusNode = onFocusNode; extra.onBlurNode = onBlurNode; }
    return React.cloneElement(child, extra);
  });

  return (
    <div style={{
      border: "var(--border-hairline)", borderRadius: "var(--radius)",
      padding: padded ? "36px 32px 28px" : 0, background: "var(--surface-page)",
      overflowX: "auto", ...style,
    }}>
      <div style={{ position: "relative", width, height, margin: "0 auto" }}>
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}
             style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          <ArrowDefs />
          {edges.map((e, i) => (
            <DiagramEdge key={i} {...e} flow={flow && !!e.flow}
                         speed={e.speed || speed} opacity={edgeOp(e)} />
          ))}
        </svg>
        {edges.filter((e) => e.label).map((e, i) => (
          <span key={i} style={{
            position: "absolute", left: e.labelAt[0], top: e.labelAt[1],
            background: "var(--surface-page)", padding: "1px 5px",
            fontFamily: "var(--font-mono)", fontSize: "10.5px", whiteSpace: "nowrap",
            color: e.outcome === "failure" ? "var(--danger)" : "var(--ink-4)",
            opacity: edgeOp(e), transition: "opacity 120ms linear",
          }}>{e.label}</span>
        ))}
        {kids}
      </div>
      {legend || caption ? (
        <div style={{
          marginTop: 30, paddingTop: 14, borderTop: "var(--border-hairline)",
          display: "flex", flexWrap: "wrap", alignItems: "center",
          justifyContent: "space-between", gap: 20,
        }}>
          {legend ? <DiagramLegend items={legend} /> : <span />}
          {caption ? (
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--text-faint)" }}>{caption}</span>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
