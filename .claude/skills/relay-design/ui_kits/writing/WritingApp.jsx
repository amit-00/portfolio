window.RelayKit = window.RelayKit || {};

window.RelayKit.WritingApp = function WritingApp({ ui }) {
  const { TopBar, SearchField, SiteFooter } = ui;
  const [page, setPage] = React.useState("archive");
  const [query, setQuery] = React.useState("");

  const tabs = [
    { slug: "archive", label: "writing / archive" },
    { slug: "article", label: "writing / two-writes-one-truth" },
    { slug: "doc", label: "docs / rfc-014" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "var(--surface-page)", display: "flex", flexDirection: "column" }}>
      <TopBar
        product="RELAY"
        breadcrumb={
          <span style={{ display: "inline-flex", gap: "var(--space-4)" }}>
            {tabs.map((t) => (
              <span key={t.slug} onClick={() => setPage(t.slug)} style={{
                cursor: "pointer",
                color: t.slug === page ? "var(--ink-1)" : "var(--text-muted)",
                borderBottom: t.slug === page ? "1px solid var(--ink-1)" : "1px solid transparent",
                transition: "color 120ms linear",
              }}>{t.label}</span>
            ))}
          </span>
        }
        right={<SearchField placeholder="Search writing" value={query} onChange={(e) => setQuery(e.target.value)} width={200} />}
      />
      <div style={{ flex: 1 }}>
        {page === "archive" ? <window.RelayKit.ArchivePage ui={ui} query={query} onOpen={() => setPage("article")} /> : null}
        {page === "article" ? <window.RelayKit.ArticlePage ui={ui} /> : null}
        {page === "doc" ? <window.RelayKit.DesignDocPage ui={ui} /> : null}
      </div>
      <SiteFooter
        note="Notes on distributed systems and the interfaces that explain them. Updated when there is something to say."
        groups={[{ title: "Writing", links: ["archive", "rss"] }, { title: "Elsewhere", links: ["github", "email"] }]}
      />
    </div>
  );
};
