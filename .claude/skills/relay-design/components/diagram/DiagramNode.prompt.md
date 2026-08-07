# DiagramNode

The only box in the system. Kind is carried by rule weight, never by colour or icon —
bottom bar is storage, doubled left rule is a queue, dashed hairline is something you do
not own.

- Give every node an `id` when the diagram has edges; `from`/`to` and hover dimming use it.
- `name` is the real name, in mono, lowercase. `meta` is one line and states a consequence
  (`3 replicas`, `64 partitions · 7d`), not a description.
- `status` moves the 6px tick only. Never change the background to report health.
- Use `badge` when the state needs a reason: `badge={<Badge tone="danger">no leader</Badge>}`.
- `decision` drops the tick and prefixes the name with `?`; label both legs on the edges.

```jsx
<DiagramNode id="dlq" x={264} y={304} kind="queue" status="failed"
             name="changes.dlq" meta="2,104 held" />
```
