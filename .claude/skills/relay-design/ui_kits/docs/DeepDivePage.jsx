window.RelayKit = window.RelayKit || {};

window.RelayKit.DeepDivePage = function DeepDivePage({ ui }) {
  const { PageHeader, SectionLabel, SplitSection, Callout, CodeBlock, DataTable, StepList, DiagramPlaceholder, PrevNextNav, Button } = ui;
  const [copied, setCopied] = React.useState(false);
  const src = [
    'stream = relay.subscribe(',
    '    table="orders",',
    '    from_lsn=checkpoint.load(),',
    '    partitions=8,',
    ')',
    '',
    'for batch in stream.batches(max_size=500):',
    '    warehouse.upsert(batch.rows)',
    '    checkpoint.save(batch.end_lsn)',
  ].join('\n');

  const H2 = ({ children }) => (
    <h2 style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-h2)", fontWeight: "var(--weight-bold)",
      letterSpacing: "var(--tracking-heading)", margin: "10px 0 0", color: "var(--text-strong)" }}>{children}</h2>
  );
  const P = ({ children }) => (
    <p style={{ fontSize: "var(--text-body-size)", lineHeight: "var(--leading-body)", color: "var(--ink-2)", margin: "12px 0 0" }}>{children}</p>
  );

  return (
    <div>
      <PageHeader
        meta="Updated 2026-07-28"
        title="Change capture in a distributed pipeline"
        lead="Row-level changes from primary databases to downstream consumers, without dual writes."
      />

      <SplitSection>
        <div>
          <SectionLabel index="01">Problem</SectionLabel>
          <H2>Two writes, one truth</H2>
          <P>Application code that writes to a database and publishes an event does two independent writes. When the second fails, the systems diverge silently. Retries make it worse: consumers see events for transactions that rolled back.</P>
          <Callout tone="warning" title="Warning" style={{ marginTop: "var(--space-5)" }}>
            Dual-write drift is not detectable from either side alone.
          </Callout>
        </div>
        <DiagramPlaceholder label="diagram — dual write divergence" height="100%" style={{ minHeight: 240 }} />
      </SplitSection>

      <SplitSection rightTone="inverse" rightPadded={false}>
        <div>
          <SectionLabel index="02">Design</SectionLabel>
          <H2>The commit is the event</H2>
          <P>Relay reads the database's replication log. One write, and ordering falls out of the log's sequence numbers.</P>
          <StepList
            style={{ marginTop: "var(--space-5)" }}
            steps={[
              { body: "A logical slot streams committed rows in commit order." },
              { body: "Rows become envelopes carrying table, op, LSN, images." },
              { body: "Envelopes hash to a partition by primary key." },
              { body: "The slot advances after every consumer commits its offset." },
            ]}
          />
          <div style={{ marginTop: "var(--space-5)" }}>
            <Button variant="secondary" size="sm" onClick={() => { setCopied(true); setTimeout(() => setCopied(false), 1200); }}>
              {copied ? "Copied" : "Copy snippet"}
            </Button>
          </div>
        </div>
        <CodeBlock filename="consumer.py" language="python" code={src} style={{ height: "100%" }} />
      </SplitSection>

      <div style={{ padding: "var(--pad-section) var(--gutter-page) var(--space-8)" }}>
        <SectionLabel index="03">Configuration</SectionLabel>
        <DataTable
          style={{ marginTop: "var(--space-4)" }}
          columns={["Key", "Default", "Range", "Effect"]}
          monoColumns={[0, 1, 2]}
          rows={[
            ["max_lag_bytes", "64MB", "1MB–4GB", "Slot pauses capture past this backlog."],
            ["partitions", "8", "1–256", "Parallelism ceiling; fixed at creation."],
            ["ack_timeout", "30s", "5s–5m", "Unacked batches redeliver in order."],
          ]}
        />
        <PrevNextNav prev="concepts" next="ordered-fanout" style={{ marginTop: "var(--space-8)" }} />
      </div>
    </div>
  );
};
