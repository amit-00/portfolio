import React from "react";

export function CodeBlock({ filename, language, code, tone = "dark", style }) {
  const dark = tone === "dark";
  return (
    <div style={{
      background: dark ? "var(--surface-code)" : "var(--surface-sunken)",
      color: dark ? "var(--text-inverse)" : "var(--ink-2)",
      border: dark ? "none" : "var(--border-hairline)",
      borderRadius: "var(--radius)", overflow: "hidden", ...style,
    }}>
      <div style={{
        display: "flex", justifyContent: "space-between", padding: "10px 20px",
        borderBottom: dark ? "var(--border-inverse)" : "var(--border-hairline)",
        fontFamily: "var(--font-mono)", fontSize: "var(--text-label-sm)",
        color: dark ? "var(--text-inverse-muted)" : "var(--ink-4)",
      }}>
        <span>{filename}</span>
        <span style={{ textTransform: "uppercase", letterSpacing: "var(--tracking-label)" }}>{language}</span>
      </div>
      <pre style={{
        margin: 0, padding: "22px 20px", fontFamily: "var(--font-mono)",
        fontSize: "var(--text-code)", lineHeight: "var(--leading-code)", overflow: "auto",
      }}>{code}</pre>
    </div>
  );
}
