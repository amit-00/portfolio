import React from "react";

export function Prose({ children, measure = "var(--measure)", style }) {
  return (
    <div className="relay-prose" style={{ maxWidth: measure, fontSize: "var(--text-body-size)", lineHeight: "var(--leading-body)", color: "var(--ink-2)", ...style }}>
      <style>{`
.relay-prose > * { margin: 0 0 18px }
.relay-prose > *:last-child { margin-bottom: 0 }
.relay-prose h2 { font-family: var(--font-mono); font-size: var(--text-h2); font-weight: var(--weight-bold); letter-spacing: var(--tracking-heading); line-height: var(--leading-heading); color: var(--text-strong); margin: 40px 0 14px }
.relay-prose h3 { font-family: var(--font-mono); font-size: 15px; font-weight: var(--weight-bold); letter-spacing: var(--tracking-heading); color: var(--text-strong); margin: 28px 0 10px }
.relay-prose blockquote { margin: 28px 0; padding: 0 0 0 20px; border-left: var(--border-strong); font-size: var(--text-lead); line-height: 1.55; color: var(--ink-1) }
.relay-prose ul, .relay-prose ol { padding-left: 20px }
.relay-prose li { margin-bottom: 8px }
.relay-prose hr { border: 0; border-top: var(--border-hairline); margin: 36px 0 }
.relay-prose code { background: var(--surface-fill); padding: 1px 5px; color: var(--ink-1) }
.relay-prose strong { font-weight: var(--weight-bold); color: var(--ink-1) }
`}</style>
      {children}
    </div>
  );
}
