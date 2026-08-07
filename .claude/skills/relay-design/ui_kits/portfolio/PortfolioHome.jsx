window.RelayKit = window.RelayKit || {};

window.RelayKit.PortfolioHome = function PortfolioHome({ ui, onOpen, onNav }) {
  const { SectionLabel, IndexList, Prose } = ui;

  return (
    <div>
      <header style={{ padding: "var(--space-9) var(--gutter-page) var(--space-8)", borderBottom: "var(--border-hairline)" }}>
        <div style={{
          fontFamily: "var(--font-mono)", fontSize: "var(--text-label)",
          letterSpacing: "var(--tracking-label)", textTransform: "uppercase", color: "var(--text-muted)",
        }}>Maren Halloran — design &amp; systems</div>
        <h1 style={{
          fontFamily: "var(--font-mono)", fontSize: "var(--text-display)", fontWeight: "var(--weight-bold)",
          letterSpacing: "var(--tracking-display)", lineHeight: "var(--leading-display)",
          margin: "var(--space-4) 0 0", maxWidth: "22ch", color: "var(--text-strong)",
        }}>I make infrastructure legible</h1>
        <Prose style={{ marginTop: "var(--space-4)", maxWidth: "62ch", fontSize: "var(--text-lead)", lineHeight: 1.6, color: "var(--ink-3)" }}>
          <p>Eight years designing interfaces for systems that fail in interesting ways — replication, scheduling, capture pipelines. The work is mostly deciding what the operator needs to see at 3am.</p>
        </Prose>
      </header>

      <section style={{ padding: "var(--pad-section) var(--gutter-page)", borderBottom: "var(--border-hairline)" }}>
        <SectionLabel index="01">Selected work</SectionLabel>
        <IndexList
          style={{ marginTop: "var(--space-4)" }}
          onSelect={(it) => onOpen(it.slug)}
          items={[
            { meta: "2026", slug: "ordered-fanout", title: "Ordered fanout", description: "Partition-stable delivery for 40k consumers, and the console that makes lag readable.", tag: "Case study" },
            { meta: "2025", slug: "checkpoint", title: "Checkpoint compaction", description: "Cutting replay from four hours to nine seconds by changing what a checkpoint means.", tag: "Case study" },
            { meta: "2025", slug: "slot-pressure", title: "Slot pressure dashboard", description: "One screen that answers whether the pipeline is behind, and by how much.", tag: "Product" },
            { meta: "2023", slug: "relay-docs", title: "Relay documentation", description: "A docs system built on one rule: the claim on the left, its evidence on the right.", tag: "System" },
          ]}
        />
      </section>

      <section style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderBottom: "var(--border-hairline)" }}>
        <div style={{ padding: "var(--pad-section) var(--space-7) var(--pad-section) var(--gutter-page)", borderRight: "var(--border-hairline)" }}>
          <SectionLabel index="02">Writing</SectionLabel>
          <IndexList
            dense
            style={{ marginTop: "var(--space-4)" }}
            onSelect={() => onNav("about")}
            items={[
              { meta: "07 / 26", title: "Two writes, one truth" },
              { meta: "04 / 26", title: "Reading a replication log as an interface" },
              { meta: "11 / 25", title: "The dashboard that says nothing" },
            ]}
          />
        </div>
        <div style={{ padding: "var(--pad-section) var(--gutter-page)", background: "var(--surface-sunken)" }}>
          <SectionLabel index="03">Now</SectionLabel>
          <div style={{ marginTop: "var(--space-4)", display: "flex", flexDirection: "column", borderTop: "var(--border-hairline)" }}>
            {[
              ["Role", "Principal designer, Relay"],
              ["Focus", "Operator tooling, capture pipelines"],
              ["Writing", "A short book on failure states"],
              ["Open to", "Advisory, one day a week"],
            ].map(([k, v]) => (
              <div key={k} style={{ display: "grid", gridTemplateColumns: "90px 1fr", padding: "10px 0", borderBottom: "var(--border-hairline)" }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-label-sm)", letterSpacing: "var(--tracking-label)", textTransform: "uppercase", color: "var(--text-faint)" }}>{k}</span>
                <span style={{ fontSize: "var(--text-small)", color: "var(--ink-2)" }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
