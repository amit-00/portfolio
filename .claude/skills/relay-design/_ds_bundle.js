/* @ds-bundle: {"format":4,"namespace":"RelayDesignSystem_27f20f","components":[{"name":"Callout","sourcePath":"components/content/Callout.jsx"},{"name":"CodeBlock","sourcePath":"components/content/CodeBlock.jsx"},{"name":"DataTable","sourcePath":"components/content/DataTable.jsx"},{"name":"DiagramPlaceholder","sourcePath":"components/content/DiagramPlaceholder.jsx"},{"name":"StepList","sourcePath":"components/content/StepList.jsx"},{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"SearchField","sourcePath":"components/core/SearchField.jsx"},{"name":"PageHeader","sourcePath":"components/layout/PageHeader.jsx"},{"name":"PrevNextNav","sourcePath":"components/layout/PrevNextNav.jsx"},{"name":"SectionLabel","sourcePath":"components/layout/SectionLabel.jsx"},{"name":"SplitSection","sourcePath":"components/layout/SplitSection.jsx"},{"name":"TopBar","sourcePath":"components/layout/TopBar.jsx"},{"name":"Figure","sourcePath":"components/site/Figure.jsx"},{"name":"IndexList","sourcePath":"components/site/IndexList.jsx"},{"name":"MetaRow","sourcePath":"components/site/MetaRow.jsx"},{"name":"Prose","sourcePath":"components/site/Prose.jsx"},{"name":"SiteFooter","sourcePath":"components/site/SiteFooter.jsx"}],"sourceHashes":{"components/content/Callout.jsx":"9bcb08b06113","components/content/CodeBlock.jsx":"6cfa5043cf02","components/content/DataTable.jsx":"54956df2408e","components/content/DiagramPlaceholder.jsx":"e1c6f0d70263","components/content/StepList.jsx":"e87f7a824009","components/core/Badge.jsx":"7836d9ab4453","components/core/Button.jsx":"0a4ca127eedc","components/core/SearchField.jsx":"687d4c7fd708","components/layout/PageHeader.jsx":"db3ba4cc7bf5","components/layout/PrevNextNav.jsx":"4d7ce619cecd","components/layout/SectionLabel.jsx":"70d968d44f33","components/layout/SplitSection.jsx":"35458caadb94","components/layout/TopBar.jsx":"c1fd21cda84c","components/site/Figure.jsx":"f64d6fb63dca","components/site/IndexList.jsx":"46edd5b2f4ff","components/site/MetaRow.jsx":"a5bbbb562161","components/site/Prose.jsx":"816d8068f3a8","components/site/SiteFooter.jsx":"bc4002616b10","ui_kits/docs/ApiReferencePage.jsx":"973084edce29","ui_kits/docs/DeepDivePage.jsx":"99b115542230","ui_kits/docs/DocsApp.jsx":"f4b5d0822574","ui_kits/portfolio/AboutPage.jsx":"e4b823eb3b68","ui_kits/portfolio/CaseStudyPage.jsx":"cb337558d9c2","ui_kits/portfolio/PortfolioApp.jsx":"02f2b26e0319","ui_kits/portfolio/PortfolioHome.jsx":"95c970f77941","ui_kits/writing/ArchivePage.jsx":"75613af8ba3b","ui_kits/writing/ArticlePage.jsx":"7e3b9dec11d7","ui_kits/writing/DesignDocPage.jsx":"5ae9556b6d8c","ui_kits/writing/WritingApp.jsx":"00ad04cdcad1"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.RelayDesignSystem_27f20f = window.RelayDesignSystem_27f20f || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/content/Callout.jsx
try { (() => {
const tones = {
  note: {
    border: "var(--border-hairline)",
    background: "var(--surface-fill)",
    label: "var(--ink-3)",
    mark: "i"
  },
  warning: {
    border: "var(--border-strong)",
    background: "var(--surface-fill)",
    label: "var(--ink-1)",
    mark: "!"
  },
  danger: {
    border: "1px solid var(--danger)",
    background: "var(--danger-wash)",
    label: "var(--danger)",
    mark: "!"
  }
};
function Callout({
  tone = "note",
  title,
  children,
  style
}) {
  const t = tones[tone];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      border: t.border,
      background: t.background,
      padding: "13px 15px",
      borderRadius: "var(--radius)",
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: "var(--text-label-sm)",
      letterSpacing: "var(--tracking-label-wide)",
      fontWeight: "var(--weight-bold)",
      textTransform: "uppercase",
      color: t.label
    }
  }, t.mark, " ", title || tone), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "var(--text-small)",
      lineHeight: "var(--leading-tight)",
      marginTop: "var(--space-1)",
      color: "var(--ink-3)"
    }
  }, children));
}
Object.assign(__ds_scope, { Callout });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/Callout.jsx", error: String((e && e.message) || e) }); }

// components/content/CodeBlock.jsx
try { (() => {
function CodeBlock({
  filename,
  language,
  code,
  tone = "dark",
  style
}) {
  const dark = tone === "dark";
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: dark ? "var(--surface-code)" : "var(--surface-sunken)",
      color: dark ? "var(--text-inverse)" : "var(--ink-2)",
      border: dark ? "none" : "var(--border-hairline)",
      borderRadius: "var(--radius)",
      overflow: "hidden",
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      padding: "10px 20px",
      borderBottom: dark ? "var(--border-inverse)" : "var(--border-hairline)",
      fontFamily: "var(--font-mono)",
      fontSize: "var(--text-label-sm)",
      color: dark ? "var(--text-inverse-muted)" : "var(--ink-4)"
    }
  }, /*#__PURE__*/React.createElement("span", null, filename), /*#__PURE__*/React.createElement("span", {
    style: {
      textTransform: "uppercase",
      letterSpacing: "var(--tracking-label)"
    }
  }, language)), /*#__PURE__*/React.createElement("pre", {
    style: {
      margin: 0,
      padding: "22px 20px",
      fontFamily: "var(--font-mono)",
      fontSize: "var(--text-code)",
      lineHeight: "var(--leading-code)",
      overflow: "auto"
    }
  }, code));
}
Object.assign(__ds_scope, { CodeBlock });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/CodeBlock.jsx", error: String((e && e.message) || e) }); }

// components/content/DataTable.jsx
try { (() => {
function DataTable({
  columns,
  rows,
  monoColumns = [0],
  style
}) {
  return /*#__PURE__*/React.createElement("table", {
    style: {
      width: "100%",
      borderCollapse: "collapse",
      fontSize: "var(--text-small)",
      ...style
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {
    style: {
      borderBottom: "var(--border-strong)"
    }
  }, columns.map((c, i) => /*#__PURE__*/React.createElement("th", {
    key: i,
    style: {
      textAlign: "left",
      padding: "8px 0",
      fontWeight: "var(--weight-medium)",
      fontFamily: "var(--font-mono)",
      fontSize: "var(--text-label-sm)",
      letterSpacing: "var(--tracking-label)",
      textTransform: "uppercase",
      color: "var(--text-muted)"
    }
  }, c)))), /*#__PURE__*/React.createElement("tbody", null, rows.map((r, ri) => /*#__PURE__*/React.createElement("tr", {
    key: ri,
    style: {
      borderBottom: "var(--border-hairline)"
    }
  }, r.map((cell, ci) => /*#__PURE__*/React.createElement("td", {
    key: ci,
    style: {
      padding: "var(--pad-cell-y) var(--pad-cell-x) var(--pad-cell-y) 0",
      fontFamily: monoColumns.includes(ci) ? "var(--font-mono)" : "var(--font-sans)",
      fontSize: monoColumns.includes(ci) ? "var(--text-code)" : "var(--text-small)",
      color: ci === 0 ? "var(--ink-1)" : "var(--ink-3)",
      verticalAlign: "top"
    }
  }, cell))))));
}
Object.assign(__ds_scope, { DataTable });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/DataTable.jsx", error: String((e && e.message) || e) }); }

// components/content/DiagramPlaceholder.jsx
try { (() => {
function DiagramPlaceholder({
  label = "diagram",
  height = 240,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      border: "var(--border-hairline)",
      height,
      minHeight: height,
      background: "repeating-linear-gradient(135deg, var(--surface-fill) 0 6px, var(--surface-page) 6px 12px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "var(--radius)",
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: "var(--text-label)",
      color: "var(--ink-4)",
      background: "var(--surface-page)",
      border: "var(--border-hairline)",
      padding: "6px 12px"
    }
  }, label));
}
Object.assign(__ds_scope, { DiagramPlaceholder });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/DiagramPlaceholder.jsx", error: String((e && e.message) || e) }); }

// components/content/StepList.jsx
try { (() => {
function StepList({
  steps,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      borderTop: "var(--border-hairline)",
      ...style
    }
  }, steps.map((s, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: "grid",
      gridTemplateColumns: "38px 1fr",
      padding: "11px 0",
      borderBottom: "var(--border-hairline)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: "var(--text-label)",
      color: "var(--text-muted)"
    }
  }, String(i + 1).padStart(2, "0")), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--text-small)",
      lineHeight: "var(--leading-tight)",
      color: "var(--ink-2)"
    }
  }, s.title ? /*#__PURE__*/React.createElement("b", {
    style: {
      fontWeight: "var(--weight-semibold, 600)"
    }
  }, s.title, " ") : null, s.body))));
}
Object.assign(__ds_scope, { StepList });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/StepList.jsx", error: String((e && e.message) || e) }); }

// components/core/Badge.jsx
try { (() => {
const tones = {
  neutral: {
    color: "var(--ink-4)",
    border: "var(--border-hairline)",
    background: "transparent"
  },
  solid: {
    color: "var(--text-inverse)",
    border: "1px solid var(--ink-1)",
    background: "var(--ink-1)"
  },
  warning: {
    color: "var(--warning)",
    border: "1px solid var(--warning)",
    background: "var(--warning-wash)"
  },
  danger: {
    color: "var(--danger)",
    border: "1px solid var(--danger)",
    background: "var(--danger-wash)"
  },
  success: {
    color: "var(--success)",
    border: "1px solid var(--success)",
    background: "var(--success-wash)"
  }
};
function Badge({
  tone = "neutral",
  children,
  style
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: "var(--text-label-sm)",
      letterSpacing: "var(--tracking-label)",
      padding: "3px 8px",
      borderRadius: "var(--radius)",
      whiteSpace: "nowrap",
      ...tones[tone],
      ...style
    }
  }, children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
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
  transition: "background 120ms linear, color 120ms linear"
};
const sizes = {
  sm: {
    padding: "6px 10px",
    fontSize: "var(--text-label-sm)"
  },
  md: {
    padding: "9px 14px"
  }
};
const variants = {
  primary: {
    background: "var(--ink-1)",
    color: "var(--text-inverse)",
    border: "1px solid var(--ink-1)"
  },
  secondary: {
    background: "transparent",
    color: "var(--ink-1)",
    border: "var(--border-strong)"
  },
  ghost: {
    background: "transparent",
    color: "var(--ink-4)",
    border: "1px solid transparent"
  }
};
const hovers = {
  primary: {
    background: "var(--ink-3)"
  },
  secondary: {
    background: "var(--surface-fill)"
  },
  ghost: {
    color: "var(--ink-1)",
    background: "var(--surface-fill)"
  }
};
function Button({
  variant = "primary",
  size = "md",
  disabled = false,
  uppercase = true,
  onClick,
  children,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    disabled: disabled,
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      ...base,
      ...sizes[size],
      ...variants[variant],
      ...(hover && !disabled ? hovers[variant] : null),
      textTransform: uppercase ? "uppercase" : "none",
      opacity: disabled ? 0.4 : 1,
      cursor: disabled ? "not-allowed" : "pointer",
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/SearchField.jsx
try { (() => {
function SearchField({
  placeholder = "Search documentation",
  shortcut = "\u2318K",
  value,
  onChange,
  width = 240
}) {
  const [focus, setFocus] = React.useState(false);
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: "var(--space-3)",
      width,
      padding: "7px 10px",
      background: "var(--surface-raised)",
      border: focus ? "1px solid var(--accent)" : "var(--border-hairline)",
      borderRadius: "var(--radius)"
    }
  }, /*#__PURE__*/React.createElement("input", {
    value: value,
    onChange: onChange,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    placeholder: placeholder,
    style: {
      flex: 1,
      border: 0,
      outline: "none",
      background: "transparent",
      fontFamily: "var(--font-sans)",
      fontSize: "var(--text-small)",
      color: "var(--ink-1)",
      minWidth: 0
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: "var(--text-label-sm)",
      color: "var(--text-faint)"
    }
  }, shortcut));
}
Object.assign(__ds_scope, { SearchField });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/SearchField.jsx", error: String((e && e.message) || e) }); }

// components/layout/PageHeader.jsx
try { (() => {
function PageHeader({
  meta,
  title,
  lead,
  style
}) {
  return /*#__PURE__*/React.createElement("header", {
    style: {
      padding: "var(--space-8) var(--gutter-page) var(--space-6)",
      borderBottom: "var(--border-hairline)",
      ...style
    }
  }, meta ? /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: "var(--text-label)",
      letterSpacing: "var(--tracking-label)",
      color: "var(--text-muted)",
      textTransform: "uppercase"
    }
  }, meta) : null, /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: "var(--text-display)",
      lineHeight: "var(--leading-display)",
      letterSpacing: "var(--tracking-display)",
      fontWeight: "var(--weight-bold)",
      margin: "var(--space-3) 0 0",
      maxWidth: "760px",
      color: "var(--text-strong)"
    }
  }, title), lead ? /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: "var(--text-lead)",
      lineHeight: 1.6,
      color: "var(--ink-3)",
      margin: "var(--space-3) 0 0",
      maxWidth: "640px"
    }
  }, lead) : null);
}
Object.assign(__ds_scope, { PageHeader });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/layout/PageHeader.jsx", error: String((e && e.message) || e) }); }

// components/layout/PrevNextNav.jsx
try { (() => {
function PrevNextNav({
  prev,
  next,
  style
}) {
  return /*#__PURE__*/React.createElement("nav", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      paddingTop: "var(--space-4)",
      borderTop: "var(--border-strong)",
      fontFamily: "var(--font-mono)",
      fontSize: "13px",
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--text-muted)"
    }
  }, prev ? "\u2190 " + prev : ""), /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: "var(--weight-bold)",
      color: "var(--ink-1)"
    }
  }, next ? next + " \u2192" : ""));
}
Object.assign(__ds_scope, { PrevNextNav });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/layout/PrevNextNav.jsx", error: String((e && e.message) || e) }); }

// components/layout/SectionLabel.jsx
try { (() => {
function SectionLabel({
  index,
  children,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: "var(--text-label)",
      letterSpacing: "var(--tracking-label)",
      color: "var(--text-muted)",
      textTransform: "uppercase",
      ...style
    }
  }, index ? index + " / " : "", children);
}
Object.assign(__ds_scope, { SectionLabel });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/layout/SectionLabel.jsx", error: String((e && e.message) || e) }); }

// components/layout/SplitSection.jsx
try { (() => {
function SplitSection({
  children,
  rightTone = "sunken",
  rightPadded = true,
  style
}) {
  const [left, right] = React.Children.toArray(children);
  const bg = {
    sunken: "var(--surface-sunken)",
    page: "var(--surface-page)",
    inverse: "var(--surface-inverse)"
  }[rightTone];
  return /*#__PURE__*/React.createElement("section", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      borderBottom: "var(--border-hairline)",
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "var(--pad-section) var(--space-7) var(--pad-section) var(--gutter-page)",
      borderRight: "var(--border-hairline)"
    }
  }, left), /*#__PURE__*/React.createElement("div", {
    style: {
      background: bg,
      padding: rightPadded ? "var(--pad-section) var(--gutter-page)" : 0
    }
  }, right));
}
Object.assign(__ds_scope, { SplitSection });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/layout/SplitSection.jsx", error: String((e && e.message) || e) }); }

// components/layout/TopBar.jsx
try { (() => {
function TopBar({
  product = "RELAY",
  breadcrumb,
  right,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 var(--gutter-page)",
      height: "var(--bar-height)",
      borderBottom: "var(--border-strong)",
      background: "var(--surface-page)",
      fontFamily: "var(--font-mono)",
      fontSize: "12.5px",
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "var(--space-6)",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: "var(--weight-bold)",
      letterSpacing: "0.02em"
    }
  }, product), breadcrumb ? /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--text-muted)"
    }
  }, breadcrumb) : null), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: "var(--space-5)",
      color: "var(--text-muted)"
    }
  }, right));
}
Object.assign(__ds_scope, { TopBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/layout/TopBar.jsx", error: String((e && e.message) || e) }); }

// components/site/Figure.jsx
try { (() => {
function Figure({
  caption,
  index,
  tone = "sunken",
  children,
  style
}) {
  return /*#__PURE__*/React.createElement("figure", {
    style: {
      margin: 0,
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      border: "var(--border-hairline)",
      background: tone === "inverse" ? "var(--surface-inverse)" : tone === "page" ? "var(--surface-page)" : "var(--surface-sunken)",
      borderRadius: "var(--radius)",
      overflow: "hidden"
    }
  }, children), caption ? /*#__PURE__*/React.createElement("figcaption", {
    style: {
      display: "flex",
      gap: "var(--space-3)",
      marginTop: "var(--space-3)",
      fontFamily: "var(--font-mono)",
      fontSize: "var(--text-label-sm)",
      lineHeight: 1.5,
      color: "var(--text-muted)"
    }
  }, index ? /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--ink-1)",
      fontWeight: "var(--weight-bold)",
      whiteSpace: "nowrap"
    }
  }, index) : null, /*#__PURE__*/React.createElement("span", null, caption)) : null);
}
Object.assign(__ds_scope, { Figure });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/site/Figure.jsx", error: String((e && e.message) || e) }); }

// components/site/IndexList.jsx
try { (() => {
function IndexList({
  items,
  onSelect,
  dense = false,
  style
}) {
  const [hover, setHover] = React.useState(-1);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: "var(--border-strong)",
      ...style
    }
  }, items.map((it, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    onClick: onSelect ? () => onSelect(it, i) : undefined,
    onMouseEnter: () => setHover(i),
    onMouseLeave: () => setHover(-1),
    style: {
      display: "grid",
      gridTemplateColumns: "78px 1fr auto",
      gap: "var(--space-5)",
      alignItems: "baseline",
      padding: dense ? "12px 0" : "18px 0",
      borderBottom: "var(--border-hairline)",
      background: hover === i ? "var(--surface-fill)" : "transparent",
      cursor: onSelect ? "pointer" : "default",
      transition: "background 120ms linear"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: "var(--text-label)",
      color: "var(--text-faint)"
    }
  }, it.meta), /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: dense ? "14px" : "15px",
      fontWeight: "var(--weight-medium)",
      letterSpacing: "var(--tracking-heading)",
      color: "var(--text-strong)"
    }
  }, it.title), it.description ? /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "var(--text-small)",
      lineHeight: "var(--leading-tight)",
      color: "var(--ink-4)",
      marginTop: "var(--space-1)",
      maxWidth: "58ch"
    }
  }, it.description) : null), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: "var(--text-label-sm)",
      letterSpacing: "var(--tracking-label)",
      textTransform: "uppercase",
      color: hover === i ? "var(--ink-1)" : "var(--text-faint)"
    }
  }, it.tag || (onSelect ? "\u2192" : "")))));
}
Object.assign(__ds_scope, { IndexList });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/site/IndexList.jsx", error: String((e && e.message) || e) }); }

// components/site/MetaRow.jsx
try { (() => {
function MetaRow({
  items,
  separator = "\u00b7",
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      alignItems: "center",
      gap: "var(--space-3)",
      fontFamily: "var(--font-mono)",
      fontSize: "var(--text-label)",
      letterSpacing: "var(--tracking-label)",
      textTransform: "uppercase",
      color: "var(--text-muted)",
      ...style
    }
  }, items.map((it, i) => /*#__PURE__*/React.createElement(React.Fragment, {
    key: i
  }, i > 0 ? /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--text-faint)"
    }
  }, separator) : null, /*#__PURE__*/React.createElement("span", null, it))));
}
Object.assign(__ds_scope, { MetaRow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/site/MetaRow.jsx", error: String((e && e.message) || e) }); }

// components/site/Prose.jsx
try { (() => {
function Prose({
  children,
  measure = "var(--measure)",
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "relay-prose",
    style: {
      maxWidth: measure,
      fontSize: "var(--text-body-size)",
      lineHeight: "var(--leading-body)",
      color: "var(--ink-2)",
      ...style
    }
  }, /*#__PURE__*/React.createElement("style", null, `
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
`), children);
}
Object.assign(__ds_scope, { Prose });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/site/Prose.jsx", error: String((e && e.message) || e) }); }

// components/site/SiteFooter.jsx
try { (() => {
function SiteFooter({
  wordmark = "RELAY",
  note,
  groups = [],
  style
}) {
  return /*#__PURE__*/React.createElement("footer", {
    style: {
      borderTop: "var(--border-strong)",
      padding: "var(--space-7) var(--gutter-page) var(--space-8)",
      display: "grid",
      gridTemplateColumns: "1fr auto",
      gap: "var(--space-9)",
      fontFamily: "var(--font-mono)",
      fontSize: "var(--text-label)",
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: "var(--weight-bold)",
      letterSpacing: "0.02em",
      color: "var(--ink-1)",
      fontSize: "12.5px"
    }
  }, wordmark), note ? /*#__PURE__*/React.createElement("div", {
    style: {
      color: "var(--text-muted)",
      marginTop: "var(--space-3)",
      maxWidth: "42ch",
      lineHeight: 1.7,
      letterSpacing: 0
    }
  }, note) : null), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "var(--space-9)"
    }
  }, groups.map((g, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-2)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "var(--text-label-sm)",
      letterSpacing: "var(--tracking-label-wide)",
      textTransform: "uppercase",
      color: "var(--text-faint)",
      marginBottom: "var(--space-1)"
    }
  }, g.title), g.links.map((l, j) => /*#__PURE__*/React.createElement("span", {
    key: j,
    style: {
      color: "var(--ink-3)",
      cursor: "pointer"
    }
  }, l))))));
}
Object.assign(__ds_scope, { SiteFooter });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/site/SiteFooter.jsx", error: String((e && e.message) || e) }); }

// ui_kits/docs/ApiReferencePage.jsx
try { (() => {
window.RelayKit = window.RelayKit || {};
window.RelayKit.ApiReferencePage = function ApiReferencePage({
  ui
}) {
  const {
    PageHeader,
    SectionLabel,
    SplitSection,
    DataTable,
    CodeBlock,
    Badge,
    Callout,
    PrevNextNav
  } = ui;
  const src = ['POST /v1/streams', '', '{', '  "table": "orders",', '  "partitions": 8,', '  "start": "now"', '}'].join('\n');
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(PageHeader, {
    meta: "Reference \xB7 v3.2",
    title: "Streams API",
    lead: "Create, inspect and tear down capture streams over HTTP."
  }), /*#__PURE__*/React.createElement(SplitSection, {
    rightTone: "inverse",
    rightPadded: false
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SectionLabel, {
    index: "01"
  }, "Endpoints"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "var(--space-4)"
    }
  }, /*#__PURE__*/React.createElement(DataTable, {
    columns: ["Method", "Path", "Returns"],
    monoColumns: [0, 1],
    rows: [[/*#__PURE__*/React.createElement(Badge, {
      tone: "solid"
    }, "POST"), "/v1/streams", "Stream object"], [/*#__PURE__*/React.createElement(Badge, null, "GET"), "/v1/streams/:id", "Stream object"], [/*#__PURE__*/React.createElement(Badge, null, "GET"), "/v1/streams/:id/lag", "Lag in bytes per partition"], [/*#__PURE__*/React.createElement(Badge, {
      tone: "danger"
    }, "DELETE"), "/v1/streams/:id", "204, slot released"]]
  })), /*#__PURE__*/React.createElement(Callout, {
    tone: "note",
    title: "Note",
    style: {
      marginTop: "var(--space-5)"
    }
  }, "Partition count is immutable. Changing it means creating a new stream and replaying from an LSN.")), /*#__PURE__*/React.createElement(CodeBlock, {
    filename: "create-stream.http",
    language: "http",
    code: src,
    style: {
      height: "100%"
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "var(--pad-section) var(--gutter-page) var(--space-8)"
    }
  }, /*#__PURE__*/React.createElement(PrevNextNav, {
    prev: "change-capture",
    next: "errors"
  })));
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/docs/ApiReferencePage.jsx", error: String((e && e.message) || e) }); }

// ui_kits/docs/DeepDivePage.jsx
try { (() => {
window.RelayKit = window.RelayKit || {};
window.RelayKit.DeepDivePage = function DeepDivePage({
  ui
}) {
  const {
    PageHeader,
    SectionLabel,
    SplitSection,
    Callout,
    CodeBlock,
    DataTable,
    StepList,
    DiagramPlaceholder,
    PrevNextNav,
    Button
  } = ui;
  const [copied, setCopied] = React.useState(false);
  const src = ['stream = relay.subscribe(', '    table="orders",', '    from_lsn=checkpoint.load(),', '    partitions=8,', ')', '', 'for batch in stream.batches(max_size=500):', '    warehouse.upsert(batch.rows)', '    checkpoint.save(batch.end_lsn)'].join('\n');
  const H2 = ({
    children
  }) => /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: "var(--text-h2)",
      fontWeight: "var(--weight-bold)",
      letterSpacing: "var(--tracking-heading)",
      margin: "10px 0 0",
      color: "var(--text-strong)"
    }
  }, children);
  const P = ({
    children
  }) => /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: "var(--text-body-size)",
      lineHeight: "var(--leading-body)",
      color: "var(--ink-2)",
      margin: "12px 0 0"
    }
  }, children);
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(PageHeader, {
    meta: "Updated 2026-07-28",
    title: "Change capture in a distributed pipeline",
    lead: "Row-level changes from primary databases to downstream consumers, without dual writes."
  }), /*#__PURE__*/React.createElement(SplitSection, null, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SectionLabel, {
    index: "01"
  }, "Problem"), /*#__PURE__*/React.createElement(H2, null, "Two writes, one truth"), /*#__PURE__*/React.createElement(P, null, "Application code that writes to a database and publishes an event does two independent writes. When the second fails, the systems diverge silently. Retries make it worse: consumers see events for transactions that rolled back."), /*#__PURE__*/React.createElement(Callout, {
    tone: "warning",
    title: "Warning",
    style: {
      marginTop: "var(--space-5)"
    }
  }, "Dual-write drift is not detectable from either side alone.")), /*#__PURE__*/React.createElement(DiagramPlaceholder, {
    label: "diagram \u2014 dual write divergence",
    height: "100%",
    style: {
      minHeight: 240
    }
  })), /*#__PURE__*/React.createElement(SplitSection, {
    rightTone: "inverse",
    rightPadded: false
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SectionLabel, {
    index: "02"
  }, "Design"), /*#__PURE__*/React.createElement(H2, null, "The commit is the event"), /*#__PURE__*/React.createElement(P, null, "Relay reads the database's replication log. One write, and ordering falls out of the log's sequence numbers."), /*#__PURE__*/React.createElement(StepList, {
    style: {
      marginTop: "var(--space-5)"
    },
    steps: [{
      body: "A logical slot streams committed rows in commit order."
    }, {
      body: "Rows become envelopes carrying table, op, LSN, images."
    }, {
      body: "Envelopes hash to a partition by primary key."
    }, {
      body: "The slot advances after every consumer commits its offset."
    }]
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "var(--space-5)"
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    size: "sm",
    onClick: () => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    }
  }, copied ? "Copied" : "Copy snippet"))), /*#__PURE__*/React.createElement(CodeBlock, {
    filename: "consumer.py",
    language: "python",
    code: src,
    style: {
      height: "100%"
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "var(--pad-section) var(--gutter-page) var(--space-8)"
    }
  }, /*#__PURE__*/React.createElement(SectionLabel, {
    index: "03"
  }, "Configuration"), /*#__PURE__*/React.createElement(DataTable, {
    style: {
      marginTop: "var(--space-4)"
    },
    columns: ["Key", "Default", "Range", "Effect"],
    monoColumns: [0, 1, 2],
    rows: [["max_lag_bytes", "64MB", "1MB–4GB", "Slot pauses capture past this backlog."], ["partitions", "8", "1–256", "Parallelism ceiling; fixed at creation."], ["ack_timeout", "30s", "5s–5m", "Unacked batches redeliver in order."]]
  }), /*#__PURE__*/React.createElement(PrevNextNav, {
    prev: "concepts",
    next: "ordered-fanout",
    style: {
      marginTop: "var(--space-8)"
    }
  })));
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/docs/DeepDivePage.jsx", error: String((e && e.message) || e) }); }

// ui_kits/docs/DocsApp.jsx
try { (() => {
window.RelayKit = window.RelayKit || {};
window.RelayKit.DocsApp = function DocsApp({
  ui
}) {
  const {
    TopBar,
    SearchField,
    Badge
  } = ui;
  const [page, setPage] = React.useState("change-capture");
  const [query, setQuery] = React.useState("");
  const pages = [{
    slug: "change-capture",
    label: "deep-dive / change-capture",
    render: () => /*#__PURE__*/React.createElement(window.RelayKit.DeepDivePage, {
      ui: ui
    })
  }, {
    slug: "streams-api",
    label: "reference / streams-api",
    render: () => /*#__PURE__*/React.createElement(window.RelayKit.ApiReferencePage, {
      ui: ui
    })
  }];
  const current = pages.find(p => p.slug === page);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: "100vh",
      background: "var(--surface-page)"
    }
  }, /*#__PURE__*/React.createElement(TopBar, {
    breadcrumb: /*#__PURE__*/React.createElement("span", {
      style: {
        display: "inline-flex",
        gap: "var(--space-4)"
      }
    }, pages.map(p => /*#__PURE__*/React.createElement("span", {
      key: p.slug,
      onClick: () => setPage(p.slug),
      style: {
        cursor: "pointer",
        color: p.slug === page ? "var(--ink-1)" : "var(--text-muted)",
        borderBottom: p.slug === page ? "1px solid var(--ink-1)" : "1px solid transparent"
      }
    }, "docs / ", p.label))),
    right: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(SearchField, {
      value: query,
      onChange: e => setQuery(e.target.value),
      width: 200
    }), /*#__PURE__*/React.createElement(Badge, null, "v3.2"))
  }), current.render());
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/docs/DocsApp.jsx", error: String((e && e.message) || e) }); }

// ui_kits/portfolio/AboutPage.jsx
try { (() => {
window.RelayKit = window.RelayKit || {};
window.RelayKit.AboutPage = function AboutPage({
  ui
}) {
  const {
    PageHeader,
    SectionLabel,
    SplitSection,
    Prose,
    DataTable,
    Callout,
    Badge
  } = ui;
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(PageHeader, {
    meta: "About",
    title: "Maren Halloran",
    lead: "Principal designer at Relay. Previously Fathom, and four years of consulting nobody should repeat."
  }), /*#__PURE__*/React.createElement(SplitSection, null, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SectionLabel, {
    index: "01"
  }, "Practice"), /*#__PURE__*/React.createElement(Prose, {
    style: {
      marginTop: "var(--space-4)"
    }
  }, /*#__PURE__*/React.createElement("p", null, "I work on products where the interesting state is invisible: queues, logs, leases, retries. The design job is rarely layout. It is deciding which of forty true numbers an operator should be shown first, and what the screen should do when that number is bad."), /*#__PURE__*/React.createElement("p", null, "Most of my output is documentation and diagrams. A system that cannot be explained on one page usually has a second problem hiding behind the first."), /*#__PURE__*/React.createElement("h2", null, "How I work"), /*#__PURE__*/React.createElement("p", null, "I read the code before the tickets, write the doc before the mock, and prototype in the real stack when there is one. Handoff is a page, not a file.")), /*#__PURE__*/React.createElement(Callout, {
    tone: "note",
    title: "Note",
    style: {
      marginTop: "var(--space-6)",
      maxWidth: "var(--measure)"
    }
  }, "Advisory work runs one day a week and books a quarter ahead.")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SectionLabel, {
    index: "02"
  }, "Record"), /*#__PURE__*/React.createElement(DataTable, {
    style: {
      marginTop: "var(--space-4)"
    },
    columns: ["Years", "Where", "What"],
    monoColumns: [0],
    rows: [["2022–", "Relay", "Principal designer, operator tooling"], ["2019–22", "Fathom", "Design lead, observability"], ["2015–19", "Independent", "Interface work for data teams"]]
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "var(--space-7)"
    }
  }, /*#__PURE__*/React.createElement(SectionLabel, {
    index: "03"
  }, "Tools"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      gap: "var(--space-2)",
      marginTop: "var(--space-4)"
    }
  }, ["Figma", "React", "Python", "Postgres", "Grafana", "Observable", "Illustrator"].map(t => /*#__PURE__*/React.createElement(Badge, {
    key: t
  }, t)))))));
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/portfolio/AboutPage.jsx", error: String((e && e.message) || e) }); }

// ui_kits/portfolio/CaseStudyPage.jsx
try { (() => {
window.RelayKit = window.RelayKit || {};
const RELAY_CASES = {
  "ordered-fanout": {
    meta: ["2026", "Relay", "8 months"],
    title: "Ordered fanout",
    lead: "Partition-stable delivery for 40k consumers, and the console that makes lag readable.",
    problem: "Consumers were being rebalanced on every deploy. Each rebalance reshuffled partitions, so ordering guarantees held inside a partition but not across a restart — and nobody could see it happening until a downstream table went wrong.",
    design: "Assignment became sticky and observable. Each consumer holds its partitions across restarts, and the console shows assignment as a fixed grid: one column per partition, one row per consumer, filled where a claim is held.",
    steps: [{
      body: "Assignment is written to the coordinator, not derived at join."
    }, {
      body: "A restart reclaims the same partitions within the lease window."
    }, {
      body: "Lag is reported per partition, never averaged."
    }, {
      body: "The grid turns to rule-only when a claim expires."
    }],
    table: {
      columns: ["Metric", "Before", "After"],
      rows: [["rebalances/day", "38", "0–2"], ["p99 delivery lag", "14s", "900ms"], ["ordering incidents", "6/quarter", "0"]]
    },
    next: "checkpoint"
  },
  checkpoint: {
    meta: ["2025", "Relay", "5 months"],
    title: "Checkpoint compaction",
    lead: "Cutting replay from four hours to nine seconds by changing what a checkpoint means.",
    problem: "A checkpoint stored an offset. Recovering meant replaying every event since that offset, and the pipeline's worst day was always the day after its second worst.",
    design: "A checkpoint stores state, not position. Compaction folds the log forward on write, so recovery loads one snapshot and applies a short tail.",
    steps: [{
      body: "Writers fold each batch into a running snapshot."
    }, {
      body: "Snapshots are addressed by LSN and immutable."
    }, {
      body: "Recovery loads the newest snapshot below the failure point."
    }, {
      body: "The tail replays; nothing before it is read."
    }],
    table: {
      columns: ["Metric", "Before", "After"],
      rows: [["mean recovery", "4h 10m", "9s"], ["log retention", "30d", "36h"], ["storage cost", "1.0x", "0.24x"]]
    },
    next: "slot-pressure"
  },
  "slot-pressure": {
    meta: ["2025", "Relay", "3 months"],
    title: "Slot pressure dashboard",
    lead: "One screen that answers whether the pipeline is behind, and by how much.",
    problem: "Nine dashboards existed. None of them answered the only question an operator asks first, so the answer was assembled by hand from three of them at a time.",
    design: "One page, one claim per section, sorted by how much it should worry you. Everything else moved behind a link.",
    steps: [{
      body: "The headline is a single number: bytes behind."
    }, {
      body: "Partitions sort by lag, worst first, always."
    }, {
      body: "Historic series appear only after a threshold is crossed."
    }, {
      body: "Nothing on the page animates."
    }],
    table: {
      columns: ["Metric", "Before", "After"],
      rows: [["dashboards", "9", "1"], ["time to first answer", "~4 min", "<10s"], ["pages opened per alert", "3.4", "1.1"]]
    },
    next: "relay-docs"
  },
  "relay-docs": {
    meta: ["2023", "Relay", "Ongoing"],
    title: "Relay documentation",
    lead: "A docs system built on one rule: the claim on the left, its evidence on the right.",
    problem: "Reference pages listed options. Nobody could tell from them why the system worked the way it did, so every option was read as equally likely to be the right one.",
    design: "Every page argues: problem, design, in practice. The left column carries prose to a 68ch measure, the right holds exactly one artefact — a diagram, a snippet, a table.",
    steps: [{
      body: "Section eyebrows are numbered so the arc is visible."
    }, {
      body: "Headings are claims, not labels."
    }, {
      body: "Structure is mono; sentences are sans."
    }, {
      body: "Hierarchy is rule weight, never shadow."
    }],
    table: {
      columns: ["Metric", "Before", "After"],
      rows: [["support tickets / release", "31", "12"], ["median page depth", "1.2", "3.6"], ["pages per concept", "5", "1"]]
    },
    next: "ordered-fanout"
  }
};
window.RelayKit.CaseStudyPage = function CaseStudyPage({
  ui,
  slug
}) {
  const {
    PageHeader,
    MetaRow,
    SectionLabel,
    SplitSection,
    StepList,
    DataTable,
    Figure,
    DiagramPlaceholder,
    CodeBlock,
    PrevNextNav,
    Prose
  } = ui;
  const c = RELAY_CASES[slug] || RELAY_CASES["ordered-fanout"];
  const H2 = ({
    children
  }) => /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: "var(--text-h2)",
      fontWeight: "var(--weight-bold)",
      letterSpacing: "var(--tracking-heading)",
      margin: "10px 0 0",
      color: "var(--text-strong)"
    }
  }, children);
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(PageHeader, {
    meta: /*#__PURE__*/React.createElement(MetaRow, {
      items: c.meta
    }),
    title: c.title,
    lead: c.lead
  }), /*#__PURE__*/React.createElement(SplitSection, null, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SectionLabel, {
    index: "01"
  }, "Problem"), /*#__PURE__*/React.createElement(H2, null, "What was actually wrong"), /*#__PURE__*/React.createElement(Prose, {
    style: {
      marginTop: "var(--space-3)"
    }
  }, /*#__PURE__*/React.createElement("p", null, c.problem))), /*#__PURE__*/React.createElement(Figure, {
    index: "FIG 01",
    caption: "The failure as operators experienced it.",
    style: {
      height: "100%"
    }
  }, /*#__PURE__*/React.createElement(DiagramPlaceholder, {
    label: "diagram — " + c.title.toLowerCase(),
    height: 230,
    style: {
      border: 0,
      background: "transparent"
    }
  }))), /*#__PURE__*/React.createElement(SplitSection, {
    rightTone: "inverse",
    rightPadded: false
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SectionLabel, {
    index: "02"
  }, "Design"), /*#__PURE__*/React.createElement(H2, null, "The move"), /*#__PURE__*/React.createElement(Prose, {
    style: {
      marginTop: "var(--space-3)"
    }
  }, /*#__PURE__*/React.createElement("p", null, c.design)), /*#__PURE__*/React.createElement(StepList, {
    style: {
      marginTop: "var(--space-5)"
    },
    steps: c.steps
  })), /*#__PURE__*/React.createElement(CodeBlock, {
    filename: "assignment.py",
    language: "python",
    style: {
      height: "100%"
    },
    code: ["claim = coordinator.lease(", "    consumer=self.id,", "    partitions=self.held or None,", "    ttl=\"45s\",", ")", "", "for p in claim.partitions:", "    stream.attach(p, from_lsn=claim.offset(p))"].join("\n")
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "var(--pad-section) var(--gutter-page) var(--space-8)"
    }
  }, /*#__PURE__*/React.createElement(SectionLabel, {
    index: "03"
  }, "In practice"), /*#__PURE__*/React.createElement(DataTable, {
    style: {
      marginTop: "var(--space-4)",
      maxWidth: 720
    },
    columns: c.table.columns,
    monoColumns: [1, 2],
    rows: c.table.rows
  }), /*#__PURE__*/React.createElement(PrevNextNav, {
    prev: "index",
    next: c.next,
    style: {
      marginTop: "var(--space-8)"
    }
  })));
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/portfolio/CaseStudyPage.jsx", error: String((e && e.message) || e) }); }

// ui_kits/portfolio/PortfolioApp.jsx
try { (() => {
window.RelayKit = window.RelayKit || {};
window.RelayKit.PortfolioApp = function PortfolioApp({
  ui
}) {
  const {
    TopBar,
    Badge
  } = ui;
  const [page, setPage] = React.useState("index");
  const [work, setWork] = React.useState("ordered-fanout");
  const open = slug => {
    setWork(slug);
    setPage("work");
  };
  const nav = [{
    slug: "index",
    label: "index"
  }, {
    slug: "work",
    label: "work"
  }, {
    slug: "about",
    label: "about"
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: "100vh",
      background: "var(--surface-page)",
      display: "flex",
      flexDirection: "column"
    }
  }, /*#__PURE__*/React.createElement(TopBar, {
    product: "M. HALLORAN",
    breadcrumb: /*#__PURE__*/React.createElement("span", {
      style: {
        display: "inline-flex",
        gap: "var(--space-4)"
      }
    }, nav.map(n => /*#__PURE__*/React.createElement("span", {
      key: n.slug,
      onClick: () => setPage(n.slug),
      style: {
        cursor: "pointer",
        color: n.slug === page ? "var(--ink-1)" : "var(--text-muted)",
        borderBottom: n.slug === page ? "1px solid var(--ink-1)" : "1px solid transparent",
        transition: "color 120ms linear"
      }
    }, n.label))),
    right: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
      style: {
        color: "var(--text-muted)"
      }
    }, "london"), /*#__PURE__*/React.createElement(Badge, {
      tone: "success"
    }, "Available Q4"))
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, page === "index" ? /*#__PURE__*/React.createElement(window.RelayKit.PortfolioHome, {
    ui: ui,
    onOpen: open,
    onNav: setPage
  }) : null, page === "work" ? /*#__PURE__*/React.createElement(window.RelayKit.CaseStudyPage, {
    ui: ui,
    slug: work,
    onNav: setPage
  }) : null, page === "about" ? /*#__PURE__*/React.createElement(window.RelayKit.AboutPage, {
    ui: ui
  }) : null), /*#__PURE__*/React.createElement(window.RelayKit.PortfolioFooter, {
    ui: ui
  }));
};
window.RelayKit.PortfolioFooter = function PortfolioFooter({
  ui
}) {
  const {
    SiteFooter
  } = ui;
  return /*#__PURE__*/React.createElement(SiteFooter, {
    wordmark: "M. HALLORAN",
    note: "Design and systems work, mostly on infrastructure products. Written and built in London. Last deploy 2026-07-28.",
    groups: [{
      title: "Writing",
      links: ["archive", "rss"]
    }, {
      title: "Elsewhere",
      links: ["github", "reading", "email"]
    }]
  });
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/portfolio/PortfolioApp.jsx", error: String((e && e.message) || e) }); }

// ui_kits/portfolio/PortfolioHome.jsx
try { (() => {
window.RelayKit = window.RelayKit || {};
window.RelayKit.PortfolioHome = function PortfolioHome({
  ui,
  onOpen,
  onNav
}) {
  const {
    SectionLabel,
    IndexList,
    Prose
  } = ui;
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("header", {
    style: {
      padding: "var(--space-9) var(--gutter-page) var(--space-8)",
      borderBottom: "var(--border-hairline)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: "var(--text-label)",
      letterSpacing: "var(--tracking-label)",
      textTransform: "uppercase",
      color: "var(--text-muted)"
    }
  }, "Maren Halloran \u2014 design & systems"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: "var(--text-display)",
      fontWeight: "var(--weight-bold)",
      letterSpacing: "var(--tracking-display)",
      lineHeight: "var(--leading-display)",
      margin: "var(--space-4) 0 0",
      maxWidth: "22ch",
      color: "var(--text-strong)"
    }
  }, "I make infrastructure legible"), /*#__PURE__*/React.createElement(Prose, {
    style: {
      marginTop: "var(--space-4)",
      maxWidth: "62ch",
      fontSize: "var(--text-lead)",
      lineHeight: 1.6,
      color: "var(--ink-3)"
    }
  }, /*#__PURE__*/React.createElement("p", null, "Eight years designing interfaces for systems that fail in interesting ways \u2014 replication, scheduling, capture pipelines. The work is mostly deciding what the operator needs to see at 3am."))), /*#__PURE__*/React.createElement("section", {
    style: {
      padding: "var(--pad-section) var(--gutter-page)",
      borderBottom: "var(--border-hairline)"
    }
  }, /*#__PURE__*/React.createElement(SectionLabel, {
    index: "01"
  }, "Selected work"), /*#__PURE__*/React.createElement(IndexList, {
    style: {
      marginTop: "var(--space-4)"
    },
    onSelect: it => onOpen(it.slug),
    items: [{
      meta: "2026",
      slug: "ordered-fanout",
      title: "Ordered fanout",
      description: "Partition-stable delivery for 40k consumers, and the console that makes lag readable.",
      tag: "Case study"
    }, {
      meta: "2025",
      slug: "checkpoint",
      title: "Checkpoint compaction",
      description: "Cutting replay from four hours to nine seconds by changing what a checkpoint means.",
      tag: "Case study"
    }, {
      meta: "2025",
      slug: "slot-pressure",
      title: "Slot pressure dashboard",
      description: "One screen that answers whether the pipeline is behind, and by how much.",
      tag: "Product"
    }, {
      meta: "2023",
      slug: "relay-docs",
      title: "Relay documentation",
      description: "A docs system built on one rule: the claim on the left, its evidence on the right.",
      tag: "System"
    }]
  })), /*#__PURE__*/React.createElement("section", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      borderBottom: "var(--border-hairline)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "var(--pad-section) var(--space-7) var(--pad-section) var(--gutter-page)",
      borderRight: "var(--border-hairline)"
    }
  }, /*#__PURE__*/React.createElement(SectionLabel, {
    index: "02"
  }, "Writing"), /*#__PURE__*/React.createElement(IndexList, {
    dense: true,
    style: {
      marginTop: "var(--space-4)"
    },
    onSelect: () => onNav("about"),
    items: [{
      meta: "07 / 26",
      title: "Two writes, one truth"
    }, {
      meta: "04 / 26",
      title: "Reading a replication log as an interface"
    }, {
      meta: "11 / 25",
      title: "The dashboard that says nothing"
    }]
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "var(--pad-section) var(--gutter-page)",
      background: "var(--surface-sunken)"
    }
  }, /*#__PURE__*/React.createElement(SectionLabel, {
    index: "03"
  }, "Now"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "var(--space-4)",
      display: "flex",
      flexDirection: "column",
      borderTop: "var(--border-hairline)"
    }
  }, [["Role", "Principal designer, Relay"], ["Focus", "Operator tooling, capture pipelines"], ["Writing", "A short book on failure states"], ["Open to", "Advisory, one day a week"]].map(([k, v]) => /*#__PURE__*/React.createElement("div", {
    key: k,
    style: {
      display: "grid",
      gridTemplateColumns: "90px 1fr",
      padding: "10px 0",
      borderBottom: "var(--border-hairline)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: "var(--text-label-sm)",
      letterSpacing: "var(--tracking-label)",
      textTransform: "uppercase",
      color: "var(--text-faint)"
    }
  }, k), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--text-small)",
      color: "var(--ink-2)"
    }
  }, v)))))));
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/portfolio/PortfolioHome.jsx", error: String((e && e.message) || e) }); }

// ui_kits/writing/ArchivePage.jsx
try { (() => {
window.RelayKit = window.RelayKit || {};
const RELAY_POSTS = [{
  meta: "2026-07",
  title: "Two writes, one truth",
  description: "Why dual writes drift, and why neither system can tell.",
  tag: "Essay"
}, {
  meta: "2026-04",
  title: "Reading a replication log as an interface",
  description: "The log already has the ordering you are trying to reconstruct.",
  tag: "Essay"
}, {
  meta: "2026-02",
  title: "RFC 014 — Sticky partition assignment",
  description: "Design doc: leases, reclaim windows, and what the console shows.",
  tag: "Design doc"
}, {
  meta: "2025-11",
  title: "The dashboard that says nothing",
  description: "Nine panels, no answer. A short account of removing eight of them.",
  tag: "Essay"
}, {
  meta: "2025-08",
  title: "Checkpoints are state, not position",
  description: "Compaction changed recovery from four hours to nine seconds.",
  tag: "Note"
}, {
  meta: "2025-05",
  title: "Naming things that retry",
  description: "Vocabulary for failure states that operators already use out loud.",
  tag: "Note"
}];
window.RelayKit.ArchivePage = function ArchivePage({
  ui,
  query,
  onOpen
}) {
  const {
    PageHeader,
    SectionLabel,
    IndexList,
    Badge
  } = ui;
  const q = (query || "").trim().toLowerCase();
  const rows = q ? RELAY_POSTS.filter(p => (p.title + " " + p.description).toLowerCase().includes(q)) : RELAY_POSTS;
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(PageHeader, {
    meta: "Archive",
    title: "Writing",
    lead: "Essays, notes and design docs about systems that fail in interesting ways."
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "var(--pad-section) var(--gutter-page) var(--space-9)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement(SectionLabel, {
    index: "01"
  }, "All entries"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "var(--space-2)"
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: "solid"
  }, rows.length, " shown"), ["Essay", "Design doc", "Note"].map(t => /*#__PURE__*/React.createElement(Badge, {
    key: t
  }, t)))), /*#__PURE__*/React.createElement(IndexList, {
    style: {
      marginTop: "var(--space-4)"
    },
    onSelect: onOpen,
    items: rows
  }), rows.length === 0 ? /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: "var(--text-label)",
      color: "var(--text-muted)",
      padding: "var(--space-6) 0"
    }
  }, "No entries match \u201C", query, "\u201D.") : null));
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/writing/ArchivePage.jsx", error: String((e && e.message) || e) }); }

// ui_kits/writing/ArticlePage.jsx
try { (() => {
window.RelayKit = window.RelayKit || {};
window.RelayKit.ArticlePage = function ArticlePage({
  ui
}) {
  const {
    PageHeader,
    MetaRow,
    SectionLabel,
    SplitSection,
    Prose,
    Figure,
    DiagramPlaceholder,
    CodeBlock,
    Callout,
    PrevNextNav
  } = ui;
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(PageHeader, {
    meta: /*#__PURE__*/React.createElement(MetaRow, {
      items: ["2026-07-28", "9 min", "distributed systems"]
    }),
    title: "Two writes, one truth",
    lead: "Every service that writes to a database and publishes an event has already lost the argument. Here is where it goes wrong, and what to do instead."
  }), /*#__PURE__*/React.createElement("section", {
    style: {
      padding: "var(--pad-section) var(--gutter-page)",
      borderBottom: "var(--border-hairline)"
    }
  }, /*#__PURE__*/React.createElement(Prose, null, /*#__PURE__*/React.createElement("p", null, "Application code that writes a row and then publishes an event performs two independent writes to two independent systems. Almost all of the time both succeed, which is the problem: the failure is rare enough to be designed around badly and common enough to happen every week at scale."), /*#__PURE__*/React.createElement("p", null, "When the second write fails, nothing raises an alarm. The database has the row. The topic does not have the event. Neither system knows the other exists, so neither can detect the gap. Downstream consumers are correct with respect to what they received and wrong with respect to the world."), /*#__PURE__*/React.createElement("h2", null, "Retries make it worse"), /*#__PURE__*/React.createElement("p", null, "The usual patch is a retry loop around the publish. That converts a missing event into a duplicate event, and duplicates arrive out of order relative to the transactions that produced them. Consumers now see events for transactions that rolled back, and the only defence is idempotency logic written by whoever is downstream, one team at a time."))), /*#__PURE__*/React.createElement(SplitSection, null, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SectionLabel, {
    index: "01"
  }, "The shape of the failure"), /*#__PURE__*/React.createElement(Prose, {
    style: {
      marginTop: "var(--space-3)"
    }
  }, /*#__PURE__*/React.createElement("p", null, "Drift is not a moment; it is a slope. Every uncaught failure adds one row of divergence, and nothing removes them. Six weeks later a report is wrong by a number nobody can reconstruct.")), /*#__PURE__*/React.createElement(Callout, {
    tone: "warning",
    title: "Warning",
    style: {
      marginTop: "var(--space-5)"
    }
  }, "Dual-write drift is not detectable from either side alone.")), /*#__PURE__*/React.createElement(Figure, {
    index: "FIG 01",
    caption: "Divergence accumulates; no single write looks wrong.",
    style: {
      height: "100%"
    }
  }, /*#__PURE__*/React.createElement(DiagramPlaceholder, {
    label: "diagram \u2014 dual write divergence",
    height: 220,
    style: {
      border: 0,
      background: "transparent"
    }
  }))), /*#__PURE__*/React.createElement(SplitSection, {
    rightTone: "inverse",
    rightPadded: false
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SectionLabel, {
    index: "02"
  }, "The commit is the event"), /*#__PURE__*/React.createElement(Prose, {
    style: {
      marginTop: "var(--space-3)"
    }
  }, /*#__PURE__*/React.createElement("p", null, "Stop writing twice. The database already records every committed change in its replication log, in commit order, with sequence numbers you did not have to invent. Read that instead."), /*#__PURE__*/React.createElement("p", null, "One write happens. Ordering falls out of the log. Recovery is a matter of remembering an offset, and the offset is the only piece of state the consumer owns."))), /*#__PURE__*/React.createElement(CodeBlock, {
    filename: "consumer.py",
    language: "python",
    style: {
      height: "100%"
    },
    code: ["stream = relay.subscribe(", "    table=\"orders\",", "    from_lsn=checkpoint.load(),", "    partitions=8,", ")", "", "for batch in stream.batches(max_size=500):", "    warehouse.upsert(batch.rows)", "    checkpoint.save(batch.end_lsn)"].join("\n")
  })), /*#__PURE__*/React.createElement("section", {
    style: {
      padding: "var(--pad-section) var(--gutter-page) var(--space-9)"
    }
  }, /*#__PURE__*/React.createElement(Prose, null, /*#__PURE__*/React.createElement("h2", null, "What you give up"), /*#__PURE__*/React.createElement("p", null, "The log is a physical artefact of the database, not a public contract. Schema changes show up as they happened, not as you would have designed them, and a consumer that wants a clean domain event has to build one. That translation is real work, but it happens once, in a place you control, rather than in every service that writes."), /*#__PURE__*/React.createElement("p", null, "The trade is a good one because it moves correctness from convention to mechanism. Nobody has to remember to publish.")), /*#__PURE__*/React.createElement(PrevNextNav, {
    prev: "archive",
    next: "ordered-fanout",
    style: {
      marginTop: "var(--space-8)",
      maxWidth: "var(--measure)"
    }
  })));
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/writing/ArticlePage.jsx", error: String((e && e.message) || e) }); }

// ui_kits/writing/DesignDocPage.jsx
try { (() => {
window.RelayKit = window.RelayKit || {};
window.RelayKit.DesignDocPage = function DesignDocPage({
  ui
}) {
  const {
    PageHeader,
    MetaRow,
    SectionLabel,
    SplitSection,
    Prose,
    StepList,
    DataTable,
    Badge,
    Callout,
    DiagramPlaceholder,
    Figure,
    PrevNextNav
  } = ui;
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(PageHeader, {
    meta: /*#__PURE__*/React.createElement(MetaRow, {
      items: ["RFC 014", "2026-02-11", /*#__PURE__*/React.createElement(Badge, {
        key: "s",
        tone: "success"
      }, "Accepted")]
    }),
    title: "Sticky partition assignment",
    lead: "Consumers keep their partitions across restarts. Assignment becomes state the coordinator owns, and the console shows it."
  }), /*#__PURE__*/React.createElement(SplitSection, null, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SectionLabel, {
    index: "01"
  }, "Context"), /*#__PURE__*/React.createElement(Prose, {
    style: {
      marginTop: "var(--space-3)"
    }
  }, /*#__PURE__*/React.createElement("p", null, "Assignment is currently derived at join time from the member list. Any deploy changes the list, so every deploy reshuffles partitions across all 40,000 consumers. Ordering holds inside a partition and breaks across the reshuffle.")), /*#__PURE__*/React.createElement(Callout, {
    tone: "note",
    title: "Scope",
    style: {
      marginTop: "var(--space-5)"
    }
  }, "Assignment only. Rebalance policy, lease storage and console layout are out of scope and tracked separately.")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SectionLabel, {
    index: "02"
  }, "Decision"), /*#__PURE__*/React.createElement(StepList, {
    style: {
      marginTop: "var(--space-4)"
    },
    steps: [{
      title: "Lease.",
      body: "The coordinator writes assignment; consumers hold a 45s lease."
    }, {
      title: "Reclaim.",
      body: "A restart inside the lease window reclaims the same partitions."
    }, {
      title: "Expiry.",
      body: "Past the window, partitions are offered to the least-loaded member."
    }, {
      title: "Visibility.",
      body: "The console renders claims as a grid, one column per partition."
    }]
  }))), /*#__PURE__*/React.createElement(SplitSection, {
    rightTone: "page"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SectionLabel, {
    index: "03"
  }, "Alternatives considered"), /*#__PURE__*/React.createElement(DataTable, {
    style: {
      marginTop: "var(--space-4)"
    },
    columns: ["Option", "Verdict", "Why"],
    monoColumns: [],
    rows: [["Cooperative rebalance", "Rejected", "Halves the churn; does not remove it."], ["Static assignment", "Rejected", "Cannot survive a lost member without an operator."], ["Lease + reclaim", "Accepted", "Bounded churn, and the bound is a number we set."]]
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "var(--space-6)"
    }
  }, /*#__PURE__*/React.createElement(SectionLabel, {
    index: "04"
  }, "Rollout"), /*#__PURE__*/React.createElement(Prose, {
    style: {
      marginTop: "var(--space-3)"
    }
  }, /*#__PURE__*/React.createElement("p", null, "Behind ", /*#__PURE__*/React.createElement("code", null, "assignment.sticky"), ", defaulted off. Enable per cluster, one region a week, with rollback on any rise in unacked batches.")))), /*#__PURE__*/React.createElement(Figure, {
    index: "FIG 01",
    caption: "Claim grid: one column per partition, one row per consumer.",
    style: {
      height: "100%"
    }
  }, /*#__PURE__*/React.createElement(DiagramPlaceholder, {
    label: "diagram \u2014 claim grid",
    height: 280,
    style: {
      border: 0,
      background: "transparent"
    }
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "var(--pad-section) var(--gutter-page) var(--space-9)"
    }
  }, /*#__PURE__*/React.createElement(PrevNextNav, {
    prev: "rfc-013",
    next: "rfc-015",
    style: {
      maxWidth: "var(--measure)"
    }
  })));
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/writing/DesignDocPage.jsx", error: String((e && e.message) || e) }); }

// ui_kits/writing/WritingApp.jsx
try { (() => {
window.RelayKit = window.RelayKit || {};
window.RelayKit.WritingApp = function WritingApp({
  ui
}) {
  const {
    TopBar,
    SearchField,
    SiteFooter
  } = ui;
  const [page, setPage] = React.useState("archive");
  const [query, setQuery] = React.useState("");
  const tabs = [{
    slug: "archive",
    label: "writing / archive"
  }, {
    slug: "article",
    label: "writing / two-writes-one-truth"
  }, {
    slug: "doc",
    label: "docs / rfc-014"
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: "100vh",
      background: "var(--surface-page)",
      display: "flex",
      flexDirection: "column"
    }
  }, /*#__PURE__*/React.createElement(TopBar, {
    product: "RELAY",
    breadcrumb: /*#__PURE__*/React.createElement("span", {
      style: {
        display: "inline-flex",
        gap: "var(--space-4)"
      }
    }, tabs.map(t => /*#__PURE__*/React.createElement("span", {
      key: t.slug,
      onClick: () => setPage(t.slug),
      style: {
        cursor: "pointer",
        color: t.slug === page ? "var(--ink-1)" : "var(--text-muted)",
        borderBottom: t.slug === page ? "1px solid var(--ink-1)" : "1px solid transparent",
        transition: "color 120ms linear"
      }
    }, t.label))),
    right: /*#__PURE__*/React.createElement(SearchField, {
      placeholder: "Search writing",
      value: query,
      onChange: e => setQuery(e.target.value),
      width: 200
    })
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, page === "archive" ? /*#__PURE__*/React.createElement(window.RelayKit.ArchivePage, {
    ui: ui,
    query: query,
    onOpen: () => setPage("article")
  }) : null, page === "article" ? /*#__PURE__*/React.createElement(window.RelayKit.ArticlePage, {
    ui: ui
  }) : null, page === "doc" ? /*#__PURE__*/React.createElement(window.RelayKit.DesignDocPage, {
    ui: ui
  }) : null), /*#__PURE__*/React.createElement(SiteFooter, {
    note: "Notes on distributed systems and the interfaces that explain them. Updated when there is something to say.",
    groups: [{
      title: "Writing",
      links: ["archive", "rss"]
    }, {
      title: "Elsewhere",
      links: ["github", "email"]
    }]
  }));
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/writing/WritingApp.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Callout = __ds_scope.Callout;

__ds_ns.CodeBlock = __ds_scope.CodeBlock;

__ds_ns.DataTable = __ds_scope.DataTable;

__ds_ns.DiagramPlaceholder = __ds_scope.DiagramPlaceholder;

__ds_ns.StepList = __ds_scope.StepList;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.SearchField = __ds_scope.SearchField;

__ds_ns.PageHeader = __ds_scope.PageHeader;

__ds_ns.PrevNextNav = __ds_scope.PrevNextNav;

__ds_ns.SectionLabel = __ds_scope.SectionLabel;

__ds_ns.SplitSection = __ds_scope.SplitSection;

__ds_ns.TopBar = __ds_scope.TopBar;

__ds_ns.Figure = __ds_scope.Figure;

__ds_ns.IndexList = __ds_scope.IndexList;

__ds_ns.MetaRow = __ds_scope.MetaRow;

__ds_ns.Prose = __ds_scope.Prose;

__ds_ns.SiteFooter = __ds_scope.SiteFooter;

})();
