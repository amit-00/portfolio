# Portfolio UI kit

A personal site — index, case study, about — built entirely from the system's components.

- `index.html` — interactive shell. The top-bar nav switches screens; work rows open case studies.
- `PortfolioApp.jsx` — shell: top bar with name wordmark, nav, availability badge, footer.
- `PortfolioHome.jsx` — statement header, selected-work index, writing index, a ruled "now" panel.
- `CaseStudyPage.jsx` — the argued case study: problem / design / in practice, with figure and code gutters. Four studies are held in one data map so the same layout carries all of them.
- `AboutPage.jsx` — practice prose on the left, record table and tools on the right.

## Rules the kit demonstrates

The portfolio uses the docs page's structure without softening it: numbered eyebrows, a claim-and-evidence split, hairline rules instead of cards. The only portfolio-specific pattern is `IndexList` — work and writing are ruled rows, never a grid of thumbnails, because the system has no imagery.
