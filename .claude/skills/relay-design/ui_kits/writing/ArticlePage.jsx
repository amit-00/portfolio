window.RelayKit = window.RelayKit || {};

window.RelayKit.ArticlePage = function ArticlePage({ ui }) {
  const { PageHeader, MetaRow, SectionLabel, SplitSection, Prose, Figure, DiagramPlaceholder, CodeBlock, Callout, PrevNextNav } = ui;

  return (
    <div>
      <PageHeader
        meta={<MetaRow items={["2026-07-28", "9 min", "distributed systems"]} />}
        title="Two writes, one truth"
        lead="Every service that writes to a database and publishes an event has already lost the argument. Here is where it goes wrong, and what to do instead."
      />

      <section style={{ padding: "var(--pad-section) var(--gutter-page)", borderBottom: "var(--border-hairline)" }}>
        <Prose>
          <p>Application code that writes a row and then publishes an event performs two independent writes to two independent systems. Almost all of the time both succeed, which is the problem: the failure is rare enough to be designed around badly and common enough to happen every week at scale.</p>
          <p>When the second write fails, nothing raises an alarm. The database has the row. The topic does not have the event. Neither system knows the other exists, so neither can detect the gap. Downstream consumers are correct with respect to what they received and wrong with respect to the world.</p>
          <h2>Retries make it worse</h2>
          <p>The usual patch is a retry loop around the publish. That converts a missing event into a duplicate event, and duplicates arrive out of order relative to the transactions that produced them. Consumers now see events for transactions that rolled back, and the only defence is idempotency logic written by whoever is downstream, one team at a time.</p>
        </Prose>
      </section>

      <SplitSection>
        <div>
          <SectionLabel index="01">The shape of the failure</SectionLabel>
          <Prose style={{ marginTop: "var(--space-3)" }}>
            <p>Drift is not a moment; it is a slope. Every uncaught failure adds one row of divergence, and nothing removes them. Six weeks later a report is wrong by a number nobody can reconstruct.</p>
          </Prose>
          <Callout tone="warning" title="Warning" style={{ marginTop: "var(--space-5)" }}>
            Dual-write drift is not detectable from either side alone.
          </Callout>
        </div>
        <Figure index="FIG 01" caption="Divergence accumulates; no single write looks wrong." style={{ height: "100%" }}>
          <DiagramPlaceholder label="diagram — dual write divergence" height={220} style={{ border: 0, background: "transparent" }} />
        </Figure>
      </SplitSection>

      <SplitSection rightTone="inverse" rightPadded={false}>
        <div>
          <SectionLabel index="02">The commit is the event</SectionLabel>
          <Prose style={{ marginTop: "var(--space-3)" }}>
            <p>Stop writing twice. The database already records every committed change in its replication log, in commit order, with sequence numbers you did not have to invent. Read that instead.</p>
            <p>One write happens. Ordering falls out of the log. Recovery is a matter of remembering an offset, and the offset is the only piece of state the consumer owns.</p>
          </Prose>
        </div>
        <CodeBlock
          filename="consumer.py"
          language="python"
          style={{ height: "100%" }}
          code={[
            "stream = relay.subscribe(",
            "    table=\"orders\",",
            "    from_lsn=checkpoint.load(),",
            "    partitions=8,",
            ")",
            "",
            "for batch in stream.batches(max_size=500):",
            "    warehouse.upsert(batch.rows)",
            "    checkpoint.save(batch.end_lsn)",
          ].join("\n")}
        />
      </SplitSection>

      <section style={{ padding: "var(--pad-section) var(--gutter-page) var(--space-9)" }}>
        <Prose>
          <h2>What you give up</h2>
          <p>The log is a physical artefact of the database, not a public contract. Schema changes show up as they happened, not as you would have designed them, and a consumer that wants a clean domain event has to build one. That translation is real work, but it happens once, in a place you control, rather than in every service that writes.</p>
          <p>The trade is a good one because it moves correctness from convention to mechanism. Nobody has to remember to publish.</p>
        </Prose>
        <PrevNextNav prev="archive" next="ordered-fanout" style={{ marginTop: "var(--space-8)", maxWidth: "var(--measure)" }} />
      </section>
    </div>
  );
};
