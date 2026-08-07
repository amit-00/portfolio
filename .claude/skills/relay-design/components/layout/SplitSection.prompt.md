# SplitSection

The page's structural unit: one idea explained on the left, its evidence shown on the right.

```jsx
<SplitSection rightTone="inverse" rightPadded={false}>
  <div>{prose}</div>
  <CodeBlock filename="consumer.py" code={src} />
</SplitSection>
```

Always two children. Stack sections vertically; each closes with a hairline. Alternate sunken diagram gutters with inverse code gutters so the page has rhythm.
