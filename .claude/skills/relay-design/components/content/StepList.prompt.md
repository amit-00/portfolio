# StepList

Describes a pipeline or request path as numbered stages; use where an ordered list would otherwise lose its rhythm.

```jsx
<StepList steps={[{title:"Capture.", body:"A logical slot streams committed rows in commit order."}]} />
```

Numbers are mono and zero-padded (01, 02). Four to six steps is the useful range.
