import React from "react";

const STROKE = { ok: "var(--dg-edge)", failure: "var(--danger)" };
const DASH = { sync: undefined, async: "3 4" };

export function ArrowDefs() {
  return (
    <defs>
      <marker id="dg-ar-ink" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path d="M0,1 L9,5 L0,9" fill="none" stroke="var(--dg-edge)" strokeWidth="1.2" />
      </marker>
      <marker id="dg-ar-danger" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path d="M0,1 L9,5 L0,9" fill="none" stroke="var(--danger)" strokeWidth="1.2" />
      </marker>
    </defs>
  );
}

export function DiagramEdge({
  d, mode = "sync", outcome = "ok", flow = false, speed = 1.6,
  arrow = true, opacity = 1,
}) {
  const stroke = STROKE[outcome];
  const dash = outcome === "failure" ? "6 4" : DASH[mode];
  const animate = flow && outcome !== "failure";
  return (
    <g opacity={opacity} style={{ transition: "opacity 120ms linear" }}>
      <path
        d={d} fill="none" stroke={stroke} strokeWidth="1" strokeDasharray={dash}
        markerEnd={arrow ? (outcome === "failure" ? "url(#dg-ar-danger)" : "url(#dg-ar-ink)") : undefined}
      />
      {animate ? (
        <path
          className="dg-pulse" d={d} pathLength="1000" fill="none"
          stroke="var(--dg-pulse)" strokeWidth="var(--dg-pulse-w)"
          strokeDasharray="7 243" strokeLinecap="square"
          style={{ animation: `relay-flow ${speed}s linear infinite` }}
        />
      ) : null}
    </g>
  );
}
