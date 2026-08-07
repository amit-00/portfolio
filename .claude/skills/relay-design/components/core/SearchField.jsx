import React from "react";

export function SearchField({ placeholder = "Search documentation", shortcut = "\u2318K", value, onChange, width = 240 }) {
  const [focus, setFocus] = React.useState(false);
  return (
    <label style={{
      display: "inline-flex", alignItems: "center", gap: "var(--space-3)",
      width, padding: "7px 10px", background: "var(--surface-raised)",
      border: focus ? "1px solid var(--accent)" : "var(--border-hairline)",
      borderRadius: "var(--radius)",
    }}>
      <input
        value={value}
        onChange={onChange}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        placeholder={placeholder}
        style={{
          flex: 1, border: 0, outline: "none", background: "transparent",
          fontFamily: "var(--font-sans)", fontSize: "var(--text-small)", color: "var(--ink-1)", minWidth: 0,
        }}
      />
      <span style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-label-sm)", color: "var(--text-faint)" }}>{shortcut}</span>
    </label>
  );
}
