window.RelayKit = window.RelayKit || {};

window.RelayKit.PortfolioApp = function PortfolioApp({ ui }) {
  const { TopBar, Badge } = ui;
  const [page, setPage] = React.useState("index");
  const [work, setWork] = React.useState("ordered-fanout");

  const open = (slug) => { setWork(slug); setPage("work"); };
  const nav = [
    { slug: "index", label: "index" },
    { slug: "work", label: "work" },
    { slug: "about", label: "about" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "var(--surface-page)", display: "flex", flexDirection: "column" }}>
      <TopBar
        product="M. HALLORAN"
        breadcrumb={
          <span style={{ display: "inline-flex", gap: "var(--space-4)" }}>
            {nav.map((n) => (
              <span key={n.slug} onClick={() => setPage(n.slug)} style={{
                cursor: "pointer",
                color: n.slug === page ? "var(--ink-1)" : "var(--text-muted)",
                borderBottom: n.slug === page ? "1px solid var(--ink-1)" : "1px solid transparent",
                transition: "color 120ms linear",
              }}>{n.label}</span>
            ))}
          </span>
        }
        right={<>
          <span style={{ color: "var(--text-muted)" }}>london</span>
          <Badge tone="success">Available Q4</Badge>
        </>}
      />
      <div style={{ flex: 1 }}>
        {page === "index" ? <window.RelayKit.PortfolioHome ui={ui} onOpen={open} onNav={setPage} /> : null}
        {page === "work" ? <window.RelayKit.CaseStudyPage ui={ui} slug={work} onNav={setPage} /> : null}
        {page === "about" ? <window.RelayKit.AboutPage ui={ui} /> : null}
      </div>
      <window.RelayKit.PortfolioFooter ui={ui} />
    </div>
  );
};

window.RelayKit.PortfolioFooter = function PortfolioFooter({ ui }) {
  const { SiteFooter } = ui;
  return (
    <SiteFooter
      wordmark="M. HALLORAN"
      note="Design and systems work, mostly on infrastructure products. Written and built in London. Last deploy 2026-07-28."
      groups={[
        { title: "Writing", links: ["archive", "rss"] },
        { title: "Elsewhere", links: ["github", "reading", "email"] },
      ]}
    />
  );
};
