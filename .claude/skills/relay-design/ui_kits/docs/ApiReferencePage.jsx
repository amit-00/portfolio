window.RelayKit = window.RelayKit || {};

window.RelayKit.ApiReferencePage = function ApiReferencePage({ ui }) {
  const { PageHeader, SectionLabel, SplitSection, DataTable, CodeBlock, Badge, Callout, PrevNextNav } = ui;
  const src = [
    'POST /v1/streams',
    '',
    '{',
    '  "table": "orders",',
    '  "partitions": 8,',
    '  "start": "now"',
    '}',
  ].join('\n');

  return (
    <div>
      <PageHeader
        meta="Reference · v3.2"
        title="Streams API"
        lead="Create, inspect and tear down capture streams over HTTP."
      />
      <SplitSection rightTone="inverse" rightPadded={false}>
        <div>
          <SectionLabel index="01">Endpoints</SectionLabel>
          <div style={{ marginTop: "var(--space-4)" }}>
            <DataTable
              columns={["Method", "Path", "Returns"]}
              monoColumns={[0, 1]}
              rows={[
                [<Badge tone="solid">POST</Badge>, "/v1/streams", "Stream object"],
                [<Badge>GET</Badge>, "/v1/streams/:id", "Stream object"],
                [<Badge>GET</Badge>, "/v1/streams/:id/lag", "Lag in bytes per partition"],
                [<Badge tone="danger">DELETE</Badge>, "/v1/streams/:id", "204, slot released"],
              ]}
            />
          </div>
          <Callout tone="note" title="Note" style={{ marginTop: "var(--space-5)" }}>
            Partition count is immutable. Changing it means creating a new stream and replaying from an LSN.
          </Callout>
        </div>
        <CodeBlock filename="create-stream.http" language="http" code={src} style={{ height: "100%" }} />
      </SplitSection>
      <div style={{ padding: "var(--pad-section) var(--gutter-page) var(--space-8)" }}>
        <PrevNextNav prev="change-capture" next="errors" />
      </div>
    </div>
  );
};
