import React from "react";

const base = {
  fontFamily: "var(--font-mono)",
  fontSize: "var(--text-label)",
  letterSpacing: "var(--tracking-label)",
  lineHeight: 1,
  borderRadius: "var(--radius)",
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  gap: "var(--space-2)",
  transition: "background 120ms linear, color 120ms linear",
};

const sizes = {
  sm: { padding: "6px 10px", fontSize: "var(--text-label-sm)" },
  md: { padding: "9px 14px" },
};

const variants = {
  primary: { background: "var(--ink-1)", color: "var(--text-inverse)", border: "1px solid var(--ink-1)" },
  secondary: { background: "transparent", color: "var(--ink-1)", border: "var(--border-strong)" },
  ghost: { background: "transparent", color: "var(--ink-4)", border: "1px solid transparent" },
};

const hovers = {
  primary: { background: "var(--ink-3)" },
  secondary: { background: "var(--surface-fill)" },
  ghost: { color: "var(--ink-1)", background: "var(--surface-fill)" },
};

export function Button({ variant = "primary", size = "md", disabled = false, uppercase = true, onClick, children, style, ...rest }) {
  const [hover, setHover] = React.useState(false);
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        ...base,
        ...sizes[size],
        ...variants[variant],
        ...(hover && !disabled ? hovers[variant] : null),
        textTransform: uppercase ? "uppercase" : "none",
        opacity: disabled ? 0.4 : 1,
        cursor: disabled ? "not-allowed" : "pointer",
        ...style,
      }}
      {...rest}
    >
      {children}
    </button>
  );
}
