window.RelayKit = window.RelayKit || {};

window.RelayKit.DocsApp = function DocsApp({ ui }) {
  const { TopBar, SearchField, Badge } = ui;
  const [page, setPage] = React.useState("change-capture");
  const [query, setQuery] = React.useState("");

  const pages = [
    { slug: "change-capture", label: "deep-dive / change-capture", render: () => <window.RelayKit.DeepDivePage ui={ui} /> },
    { slug: "streams-api", label: "reference / streams-api", render: () => <window.RelayKit.ApiReferencePage ui={ui} /> },
  ];
  const current = pages.find((p) => p.slug === page);

  return (
    <div style={{ minHeight: "100vh", background: "var(--surface-page)" }}>
      <TopBar
        breadcrumb={
          <span style={{ display: "inline-flex", gap: "var(--space-4)" }}>
            {pages.map((p) => (
              <span
                key={p.slug}
                onClick={() => setPage(p.slug)}
                style={{ cursor: "pointer", color: p.slug === page ? "var(--ink-1)" : "var(--text-muted)",
                  borderBottom: p.slug === page ? "1px solid var(--ink-1)" : "1px solid transparent" }}
              >docs / {p.label}</span>
            ))}
          </span>
        }
        right={<>
          <SearchField value={query} onChange={(e) => setQuery(e.target.value)} width={200} />
          <Badge>v3.2</Badge>
        </>}
      />
      {current.render()}
    </div>
  );
};
