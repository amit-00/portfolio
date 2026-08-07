# DiagramEdge

Renders one path inside a `DiagramFrame`'s SVG layer. You will normally pass edges as
data to `DiagramFrame` rather than mounting this directly; mount it only for a variant the
frame does not cover (a bowed retry return, a branch with two labelled legs).

- Paths are written in canvas coordinates and run orthogonally: `M552,240 V272 H348 V302`.
- `mode` says whether the caller waits. `outcome` says how it ended. They are independent.
- `flow` is ignored on failure edges by design — nothing is moving down them.
- Label the edge through `DiagramFrame`'s `label` / `labelAt`, not with SVG `<text>`; the
  label needs a page-coloured backing to break the line cleanly.

```jsx
<DiagramEdge d="M432,204 H526" mode="async" flow speed={6} />
```
