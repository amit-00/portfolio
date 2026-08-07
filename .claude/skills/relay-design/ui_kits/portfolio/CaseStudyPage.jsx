window.RelayKit = window.RelayKit || {};

const RELAY_CASES = {
  "ordered-fanout": {
    meta: ["2026", "Relay", "8 months"],
    title: "Ordered fanout",
    lead: "Partition-stable delivery for 40k consumers, and the console that makes lag readable.",
    problem: "Consumers were being rebalanced on every deploy. Each rebalance reshuffled partitions, so ordering guarantees held inside a partition but not across a restart — and nobody could see it happening until a downstream table went wrong.",
    design: "Assignment became sticky and observable. Each consumer holds its partitions across restarts, and the console shows assignment as a fixed grid: one column per partition, one row per consumer, filled where a claim is held.",
    steps: [
      { body: "Assignment is written to the coordinator, not derived at join." },
      { body: "A restart reclaims the same partitions within the lease window." },
      { body: "Lag is reported per partition, never averaged." },
      { body: "The grid turns to rule-only when a claim expires." },
    ],
    table: {
      columns: ["Metric", "Before", "After"],
      rows: [
        ["rebalances/day", "38", "0–2"],
        ["p99 delivery lag", "14s", "900ms"],
        ["ordering incidents", "6/quarter", "0"],
      ],
    },
    next: "checkpoint",
  },
  checkpoint: {
    meta: ["2025", "Relay", "5 months"],
    title: "Checkpoint compaction",
    lead: "Cutting replay from four hours to nine seconds by changing what a checkpoint means.",
    problem: "A checkpoint stored an offset. Recovering meant replaying every event since that offset, and the pipeline's worst day was always the day after its second worst.",
    design: "A checkpoint stores state, not position. Compaction folds the log forward on write, so recovery loads one snapshot and applies a short tail.",
    steps: [
      { body: "Writers fold each batch into a running snapshot." },
      { body: "Snapshots are addressed by LSN and immutable." },
      { body: "Recovery loads the newest snapshot below the failure point." },
      { body: "The tail replays; nothing before it is read." },
    ],
    table: {
      columns: ["Metric", "Before", "After"],
      rows: [
        ["mean recovery", "4h 10m", "9s"],
        ["log retention", "30d", "36h"],
        ["storage cost", "1.0x", "0.24x"],
      ],
    },
    next: "slot-pressure",
  },
  "slot-pressure": {
    meta: ["2025", "Relay", "3 months"],
    title: "Slot pressure dashboard",
    lead: "One screen that answers whether the pipeline is behind, and by how much.",
    problem: "Nine dashboards existed. None of them answered the only question an operator asks first, so the answer was assembled by hand from three of them at a time.",
    design: "One page, one claim per section, sorted by how much it should worry you. Everything else moved behind a link.",
    steps: [
      { body: "The headline is a single number: bytes behind." },
      { body: "Partitions sort by lag, worst first, always." },
      { body: "Historic series appear only after a threshold is crossed." },
      { body: "Nothing on the page animates." },
    ],
    table: {
      columns: ["Metric", "Before", "After"],
      rows: [
        ["dashboards", "9", "1"],
        ["time to first answer", "~4 min", "<10s"],
        ["pages opened per alert", "3.4", "1.1"],
      ],
    },
    next: "relay-docs",
  },
  "relay-docs": {
    meta: ["2023", "Relay", "Ongoing"],
    title: "Relay documentation",
    lead: "A docs system built on one rule: the claim on the left, its evidence on the right.",
    problem: "Reference pages listed options. Nobody could tell from them why the system worked the way it did, so every option was read as equally likely to be the right one.",
    design: "Every page argues: problem, design, in practice. The left column carries prose to a 68ch measure, the right holds exactly one artefact — a diagram, a snippet, a table.",
    steps: [
      { body: "Section eyebrows are numbered so the arc is visible." },
      { body: "Headings are claims, not labels." },
      { body: "Structure is mono; sentences are sans." },
      { body: "Hierarchy is rule weight, never shadow." },
    ],
    table: {
      columns: ["Metric", "Before", "After"],
      rows: [
        ["support tickets / release", "31", "12"],
        ["median page depth", "1.2", "3.6"],
        ["pages per concept", "5", "1"],
      ],
    },
    next: "ordered-fanout",
  },
};

window.RelayKit.CaseStudyPage = function CaseStudyPage({ ui, slug }) {
  const { PageHeader, MetaRow, SectionLabel, SplitSection, StepList, DataTable, Figure, DiagramPlaceholder, CodeBlock, PrevNextNav, Prose } = ui;
  const c = RELAY_CASES[slug] || RELAY_CASES["ordered-fanout"];

  const H2 = ({ children }) => (
    <h2 style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-h2)", fontWeight: "var(--weight-bold)",
      letterSpacing: "var(--tracking-heading)", margin: "10px 0 0", color: "var(--text-strong)" }}>{children}</h2>
  );

  return (
    <div>
      <PageHeader meta={<MetaRow items={c.meta} />} title={c.title} lead={c.lead} />

      <SplitSection>
        <div>
          <SectionLabel index="01">Problem</SectionLabel>
          <H2>What was actually wrong</H2>
          <Prose style={{ marginTop: "var(--space-3)" }}><p>{c.problem}</p></Prose>
        </div>
        <Figure index="FIG 01" caption="The failure as operators experienced it." style={{ height: "100%" }}>
          <DiagramPlaceholder label={"diagram — " + c.title.toLowerCase()} height={230} style={{ border: 0, background: "transparent" }} />
        </Figure>
      </SplitSection>

      <SplitSection rightTone="inverse" rightPadded={false}>
        <div>
          <SectionLabel index="02">Design</SectionLabel>
          <H2>The move</H2>
          <Prose style={{ marginTop: "var(--space-3)" }}><p>{c.design}</p></Prose>
          <StepList style={{ marginTop: "var(--space-5)" }} steps={c.steps} />
        </div>
        <CodeBlock
          filename="assignment.py"
          language="python"
          style={{ height: "100%" }}
          code={[
            "claim = coordinator.lease(",
            "    consumer=self.id,",
            "    partitions=self.held or None,",
            "    ttl=\"45s\",",
            ")",
            "",
            "for p in claim.partitions:",
            "    stream.attach(p, from_lsn=claim.offset(p))",
          ].join("\n")}
        />
      </SplitSection>

      <div style={{ padding: "var(--pad-section) var(--gutter-page) var(--space-8)" }}>
        <SectionLabel index="03">In practice</SectionLabel>
        <DataTable style={{ marginTop: "var(--space-4)", maxWidth: 720 }} columns={c.table.columns} monoColumns={[1, 2]} rows={c.table.rows} />
        <PrevNextNav prev="index" next={c.next} style={{ marginTop: "var(--space-8)" }} />
      </div>
    </div>
  );
};
