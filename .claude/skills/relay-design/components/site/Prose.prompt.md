# Prose

Wraps the body of an article or design doc so headings, lists, quotes and inline code follow the system without per-element styling.

```jsx
<Prose>
  <p>Application code that writes twice diverges silently.</p>
  <h2>The commit is the event</h2>
  <blockquote>Ordering falls out of the log, not out of the consumer.</blockquote>
</Prose>
```

Headings inside are mono, body is sans — the rule holds automatically. Narrow the `measure` only for gutter columns.
