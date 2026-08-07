# Docs site UI kit

Two screens of the Relay documentation site, composed entirely from the system's components.

- `index.html` — interactive shell. The breadcrumb switches screens; the search field and copy button are live.
- `DocsApp.jsx` — shell: top bar, breadcrumb navigation, search, version badge.
- `DeepDivePage.jsx` — the canonical deep dive: header, problem section with diagram gutter, design section with dark code gutter, config table, pager.
- `ApiReferencePage.jsx` — endpoint reference with method badges and a request-body gutter.

Screens attach to `window.RelayKit` and receive the component namespace as a `ui` prop, so the same files run from the bundle without a build step.

## Rules the kit demonstrates

Every section is a `SplitSection`: the claim on the left, its evidence on the right. Diagram gutters use the sunken fill, code gutters use the inverse surface, and they alternate down the page. Section eyebrows are numbered so the problem → design → practice arc is legible at a glance.
