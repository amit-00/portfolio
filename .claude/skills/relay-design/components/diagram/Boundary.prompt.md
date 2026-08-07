# Boundary

A trust, network or ownership line. Dashed hairline rectangle, mono label seated on the
top-left corner, never a background — a tinted region would be the third page colour.

- Place it before the nodes it encloses so it sits behind them.
- Nest one level at most. Below that, split the diagram.
- The label names the owner or the zone, not the contents: `relay / control plane`, not
  `services`.

```jsx
<Boundary x={-16} y={150} w={728} h={108} label="relay / control plane" />
```
