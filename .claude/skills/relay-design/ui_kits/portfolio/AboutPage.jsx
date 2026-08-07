window.RelayKit = window.RelayKit || {};

window.RelayKit.AboutPage = function AboutPage({ ui }) {
  const { PageHeader, SectionLabel, SplitSection, Prose, DataTable, Callout, Badge } = ui;

  return (
    <div>
      <PageHeader
        meta="About"
        title="Maren Halloran"
        lead="Principal designer at Relay. Previously Fathom, and four years of consulting nobody should repeat."
      />

      <SplitSection>
        <div>
          <SectionLabel index="01">Practice</SectionLabel>
          <Prose style={{ marginTop: "var(--space-4)" }}>
            <p>I work on products where the interesting state is invisible: queues, logs, leases, retries. The design job is rarely layout. It is deciding which of forty true numbers an operator should be shown first, and what the screen should do when that number is bad.</p>
            <p>Most of my output is documentation and diagrams. A system that cannot be explained on one page usually has a second problem hiding behind the first.</p>
            <h2>How I work</h2>
            <p>I read the code before the tickets, write the doc before the mock, and prototype in the real stack when there is one. Handoff is a page, not a file.</p>
          </Prose>
          <Callout tone="note" title="Note" style={{ marginTop: "var(--space-6)", maxWidth: "var(--measure)" }}>
            Advisory work runs one day a week and books a quarter ahead.
          </Callout>
        </div>
        <div>
          <SectionLabel index="02">Record</SectionLabel>
          <DataTable
            style={{ marginTop: "var(--space-4)" }}
            columns={["Years", "Where", "What"]}
            monoColumns={[0]}
            rows={[
              ["2022–", "Relay", "Principal designer, operator tooling"],
              ["2019–22", "Fathom", "Design lead, observability"],
              ["2015–19", "Independent", "Interface work for data teams"],
            ]}
          />
          <div style={{ marginTop: "var(--space-7)" }}>
            <SectionLabel index="03">Tools</SectionLabel>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)", marginTop: "var(--space-4)" }}>
              {["Figma", "React", "Python", "Postgres", "Grafana", "Observable", "Illustrator"].map((t) => (
                <Badge key={t}>{t}</Badge>
              ))}
            </div>
          </div>
        </div>
      </SplitSection>
    </div>
  );
};
