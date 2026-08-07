# DiagramLegend

A mono list of the edge variants the figure uses, left-aligned under the frame. Only
include it when the diagram uses more than three variants, or when a variant means
something specific to this figure — then rename it:

```jsx
<DiagramLegend items={["sync", { kind: "async", label: "replicated, at-least-once" }, "failure"]} />
```

Never legend the node kinds. If a kind needs explaining, the `meta` line is doing too
little work.
