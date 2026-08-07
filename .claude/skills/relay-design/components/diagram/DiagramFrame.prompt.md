# DiagramFrame

The container. Owns the canvas, the SVG layer, the arrow markers, edge labels, hover
dimming, the legend and the caption. Nodes and boundaries are children placed in canvas
coordinates; edges are data.

- Size the canvas to the content, not the page: 168px nodes, 96px gaps, rows 136px apart.
  A three-column, three-row figure is `696 × 376`.
- Sources at the top, sinks at the bottom, failure paths to the left.
- `flow` on at most one edge unless the paths are genuinely concurrent. Four pulsing edges
  read as decoration, not as data.
- Every edge gets a `label` and a `labelAt`. Place labels above horizontal runs and to the
  right of vertical ones, clear of arrowheads.
- Pass `interactive={false}` for figures in print or in a deck.

```jsx
<DiagramFrame width={696} height={376} caption="fig. 01 — change capture"
  legend={["sync", "async", "failure"]}
  edges={[{ from: "capture", to: "stream", d: "M168,204 H262", label: "commit LSN", labelAt: [180, 178], flow: true }]}>
  <DiagramNode id="capture" x={0} y={168} kind="service" name="capture" meta="3 replicas" />
  <DiagramNode id="stream" x={264} y={168} kind="queue" name="changes.v2" meta="64 partitions · 7d" />
</DiagramFrame>
```
