# CodeBlock

Shows a runnable snippet with its filename; the dark tone anchors the code gutter of a two-column page.

```jsx
<CodeBlock filename="consumer.py" language="python" code={src} />
```

tone="dark" for gutter/hero snippets, tone="light" for inline examples inside prose. No syntax colouring — the system relies on mono rhythm instead.
