window.RelayKit = window.RelayKit || {};

const RELAY_POSTS = [
  { meta: "2026-07", title: "Two writes, one truth", description: "Why dual writes drift, and why neither system can tell.", tag: "Essay" },
  { meta: "2026-04", title: "Reading a replication log as an interface", description: "The log already has the ordering you are trying to reconstruct.", tag: "Essay" },
  { meta: "2026-02", title: "RFC 014 — Sticky partition assignment", description: "Design doc: leases, reclaim windows, and what the console shows.", tag: "Design doc" },
  { meta: "2025-11", title: "The dashboard that says nothing", description: "Nine panels, no answer. A short account of removing eight of them.", tag: "Essay" },
  { meta: "2025-08", title: "Checkpoints are state, not position", description: "Compaction changed recovery from four hours to nine seconds.", tag: "Note" },
  { meta: "2025-05", title: "Naming things that retry", description: "Vocabulary for failure states that operators already use out loud.", tag: "Note" },
];

window.RelayKit.ArchivePage = function ArchivePage({ ui, query, onOpen }) {
  const { PageHeader, SectionLabel, IndexList, Badge } = ui;
  const q = (query || "").trim().toLowerCase();
  const rows = q ? RELAY_POSTS.filter((p) => (p.title + " " + p.description).toLowerCase().includes(q)) : RELAY_POSTS;

  return (
    <div>
      <PageHeader
        meta="Archive"
        title="Writing"
        lead="Essays, notes and design docs about systems that fail in interesting ways."
      />
      <div style={{ padding: "var(--pad-section) var(--gutter-page) var(--space-9)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <SectionLabel index="01">All entries</SectionLabel>
          <div style={{ display: "flex", gap: "var(--space-2)" }}>
            <Badge tone="solid">{rows.length} shown</Badge>
            {["Essay", "Design doc", "Note"].map((t) => <Badge key={t}>{t}</Badge>)}
          </div>
        </div>
        <IndexList style={{ marginTop: "var(--space-4)" }} onSelect={onOpen} items={rows} />
        {rows.length === 0 ? (
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-label)", color: "var(--text-muted)", padding: "var(--space-6) 0" }}>
            No entries match “{query}”.
          </div>
        ) : null}
      </div>
    </div>
  );
};
