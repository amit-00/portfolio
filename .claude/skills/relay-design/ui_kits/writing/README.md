# Writing UI kit

Three surfaces for long-form: an archive, an essay, and a design doc (RFC).

- `index.html` — interactive shell. The breadcrumb switches screens; the search field filters the archive live.
- `WritingApp.jsx` — shell: top bar, breadcrumb tabs, search, footer.
- `ArchivePage.jsx` — full entry list via `IndexList`, filtered by the top-bar query; type badges above the list.
- `ArticlePage.jsx` — essay: full-measure prose sections alternating with split sections that carry a figure or a code gutter.
- `DesignDocPage.jsx` — RFC: context, decision as a `StepList`, alternatives table, rollout, claim-grid figure.

## Rules the kit demonstrates

Essays alternate between full-width `Prose` and `SplitSection`; the split appears only where the paragraph has evidence to show. Design docs never use full-width prose — every section is a claim beside its artefact, because an RFC is read for its decisions, not its narration. Both close on a `PrevNextNav` clipped to the reading measure so the pager sits under the text, not the page.
