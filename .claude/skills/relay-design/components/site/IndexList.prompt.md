# IndexList

The system's only list pattern: selected work on a portfolio, an article archive, a docs section index. Rows are hairline-ruled, never carded.

```jsx
<IndexList
  items={[{ meta: "2026", title: "Ordered fanout", description: "Partition-stable delivery for 40k consumers.", tag: "Case study" }]}
  onSelect={(item) => open(item)}
/>
```

`dense` for archives of 10+ rows. Omit `onSelect` for a static list — the arrow disappears and rows stop reacting to hover.
