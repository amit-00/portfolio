window.RelayKit = window.RelayKit || {};

window.RelayKit.DesignDocPage = function DesignDocPage({ ui }) {
  const { PageHeader, MetaRow, SectionLabel, SplitSection, Prose, StepList, DataTable, Badge, Callout, DiagramPlaceholder, Figure, PrevNextNav } = ui;

  return (
    <div>
      <PageHeader
        meta={<MetaRow items={["RFC 014", "2026-02-11", <Badge key="s" tone="success">Accepted</Badge>]} />}
        title="Sticky partition assignment"
        lead="Consumers keep their partitions across restarts. Assignment becomes state the coordinator owns, and the console shows it."
      />

      <SplitSection>
        <div>
          <SectionLabel index="01">Context</SectionLabel>
          <Prose style={{ marginTop: "var(--space-3)" }}>
            <p>Assignment is currently derived at join time from the member list. Any deploy changes the list, so every deploy reshuffles partitions across all 40,000 consumers. Ordering holds inside a partition and breaks across the reshuffle.</p>
          </Prose>
          <Callout tone="note" title="Scope" style={{ marginTop: "var(--space-5)" }}>
            Assignment only. Rebalance policy, lease storage and console layout are out of scope and tracked separately.
          </Callout>
        </div>
        <div>
          <SectionLabel index="02">Decision</SectionLabel>
          <StepList
            style={{ marginTop: "var(--space-4)" }}
            steps={[
              { title: "Lease.", body: "The coordinator writes assignment; consumers hold a 45s lease." },
              { title: "Reclaim.", body: "A restart inside the lease window reclaims the same partitions." },
              { title: "Expiry.", body: "Past the window, partitions are offered to the least-loaded member." },
              { title: "Visibility.", body: "The console renders claims as a grid, one column per partition." },
            ]}
          />
        </div>
      </SplitSection>

      <SplitSection rightTone="page">
        <div>
          <SectionLabel index="03">Alternatives considered</SectionLabel>
          <DataTable
            style={{ marginTop: "var(--space-4)" }}
            columns={["Option", "Verdict", "Why"]}
            monoColumns={[]}
            rows={[
              ["Cooperative rebalance", "Rejected", "Halves the churn; does not remove it."],
              ["Static assignment", "Rejected", "Cannot survive a lost member without an operator."],
              ["Lease + reclaim", "Accepted", "Bounded churn, and the bound is a number we set."],
            ]}
          />
          <div style={{ marginTop: "var(--space-6)" }}>
            <SectionLabel index="04">Rollout</SectionLabel>
            <Prose style={{ marginTop: "var(--space-3)" }}>
              <p>Behind <code>assignment.sticky</code>, defaulted off. Enable per cluster, one region a week, with rollback on any rise in unacked batches.</p>
            </Prose>
          </div>
        </div>
        <Figure index="FIG 01" caption="Claim grid: one column per partition, one row per consumer." style={{ height: "100%" }}>
          <DiagramPlaceholder label="diagram — claim grid" height={280} style={{ border: 0, background: "transparent" }} />
        </Figure>
      </SplitSection>

      <div style={{ padding: "var(--pad-section) var(--gutter-page) var(--space-9)" }}>
        <PrevNextNav prev="rfc-013" next="rfc-015" style={{ maxWidth: "var(--measure)" }} />
      </div>
    </div>
  );
};
