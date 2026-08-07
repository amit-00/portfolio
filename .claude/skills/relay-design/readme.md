# Relay Design System

A flat, typographic system for personal publishing: portfolios, design docs, essays and technical documentation. Everything is built from two typefaces, one achromatic ink ramp and hairline rules — no shadows, no radii, no imagery.

"Relay" is a placeholder product name, not an external brand. Swap the wordmark and the accent hue and the system carries any author or product.

## Sources

- **Attached codebase:** `Documentation page design concepts/` (read-only mount). A prior, docs-only version of this system — tokens, thirteen components, fourteen specimen cards and a two-screen docs UI kit. All of it was ported here verbatim; nothing was re-derived or redesigned.
- That project in turn credits direction **1c** of its own `Docs Page Directions.dc.html` — the two-column page with a wide code gutter — as the origin of the visual language. That file was not ported; it is exploration, not system.
- No Figma file, GitHub repository, brand kit or logo asset was provided.

## Products covered

| Surface | Kit | What it is |
| --- | --- | --- |
| Docs site | `ui_kits/docs/` | Deep-dive page and API reference for a technical product |
| Portfolio | `ui_kits/portfolio/` | Personal site: statement index, case studies, about |
| Writing | `ui_kits/writing/` | Archive, essay, and design doc (RFC) |

---

## Visual foundations

**Type.** Two families, one rule, no exceptions: if it is a label, it is mono; if it is a sentence, it is sans. JetBrains Mono carries all structure — the display title (34px / 1.15 / -0.03em), section headings (20px / -0.02em), eyebrows, table headers, breadcrumbs, pagers, badges, code, the wordmark. Public Sans carries all prose (15.5px / 1.68) to a 68ch measure. Nothing is set in italics anywhere in the system.

**Color.** One achromatic ink ramp, `--ink-1` #141414 through `--ink-6` #a9a9a3, on a near-white page (#fbfbfa). The greys are untinted — no blue-grey, no warm grey. A single accent hue, `oklch(0.45 0.09 250)`, appears **only** on links and focus rings; it never fills a button, a heading, a badge or a background. Status hues (warning 70°, danger 25°, success 150°) share one chroma band and vary only in hue, and appear only in badges and callouts. Two background colors per page maximum: the page white, plus either the sunken fill (#f6f6f3) or the inverse code surface (#141414).

**Rules over shadows.** `--radius` is `0px` and `--shadow-none` is the only shadow token — the system has no elevation model at all. Hierarchy is carried entirely by rule weight: full-ink 1px under the top bar, above table headers, above the pager; hairline #e3e3df for section splits and table rows; soft #ededea for nesting inside a box. **Cards do not exist as objects.** What looks like a card is a box drawn with hairlines: no corner radius, no border colour change on hover, no lift.

**Backgrounds and imagery.** No photography, no gradients, no illustration, no texture, no pattern except one: the 135° hatch used by `DiagramPlaceholder` to mark where a real diagram belongs. Nothing is full-bleed except the inverse code gutter, which runs edge to edge in the right half of a split section. There is no imagery to have a colour vibe — if photographs are introduced later, treat them as a foreign element and box them with a hairline and a mono caption via `Figure`.

**Layout.** A 52px top bar; a 28px page gutter; 36px section padding; a 1fr/1fr split for content sections, with the claim left and its single artefact right. Sections stack vertically and each closes with a hairline. Left columns hold prose to 68ch; right columns hold exactly one thing. Nothing is fixed or sticky — the page scrolls as one piece.

**Motion.** 120ms linear colour transitions, and nothing else. No easing curves, no bounce, no entrance or scroll animation, no skeleton shimmer. If an element needs to change, its colour changes.

**Hover and press.** Hover darkens (primary button ink-1 → ink-3) or fills (`--surface-fill` behind secondary buttons and index rows); link hover goes one step darker in the same hue and keeps its underline. Press does **not** move, scale, shrink or shadow anything — the system has no transform anywhere. Focus is a 2px accent outline offset 2px, on everything focusable.

**Transparency and blur.** None. No scrims, no glass, no protection gradients, no capsule overlays. When something needs separation from what is behind it, it gets a rule or the sunken fill.

**Borders and radii.** `--border-width` is 1px everywhere. Four border tokens (`hairline`, `soft`, `strong`, `inverse`) and one radius (0). Badges, buttons, fields, callouts and figures are all square.

---

## Diagrams

Architecture, data-flow and failure-path figures are drawn with the system's existing means — hairline rules, mono labels, one achromatic ink ramp — so a diagram sits inside a docs page without becoming an illustration. `tokens/diagram.css` loads with `styles.css`; nothing in it redefines a colour, a typeface or a radius.

**Entities.** One `DiagramNode`, eight kinds, carried by rule weight and position, never by colour or icon: `service` (hairline box), `datastore` (3px bottom bar), `queue` (doubled left rule), `external` (dashed hairline, sunken fill), `client` (3px top bar), `job` (3px left bar), `terminal` (inverse fill), `decision` (`?` prefix). Each node reads kind, name, then one line of consequence — replicas, retention, schedule. Three lines is the maximum.

**State.** A 6px square in the top-right corner: hollow ink for `ok`, filled warning for `degraded`, filled danger for `failed`. A node never changes its background to report health; pass `badge` when the state needs a reason. This is the one place status hues leave badges and callouts — same chroma band, never filling an area larger than a badge, and the failure edge is dashed as well so greyscale print still parses.

**Connections.** `DiagramEdge` takes an SVG path in canvas coordinates. Solid is synchronous and the caller waits; dashed is asynchronous and it does not. Dash pattern encodes mode, colour encodes outcome, and the mono chip on the line says what moves. An unlabelled edge is a missing sentence. Edges run orthogonally on a 4px grid; the retry return path is the only curve.

**Grouping.** `Boundary` marks a trust, network or ownership line: a dashed hairline rectangle with a mono corner label, never a background. One level of nesting; below that, split the diagram.

**Motion.** Data flow is the single documented exception to the 120ms-colour-only motion rule: a 7-unit dash runs the edge at constant linear speed on an infinite loop — `1.6s` standard, `6s` batched or lagging. It does not ease, fade, grow or change colour. Every path is normalised to `pathLength=1000` so short and long hops move at the same visual rate. Failure edges never animate; nothing is moving down them, which is the point. Motion is off under `prefers-reduced-motion` and in print, where `StepMarker` carries sequence instead.

**Interaction.** Hovering a node holds it and its immediate neighbours and drops everything else to 28% opacity. That is the diagram's only interaction, and it survives greyscale and print. Pass `interactive={false}` for a static figure.

**Constraints.** No fills for meaning — two backgrounds only, the page and the sunken grey behind external nodes. No icons inside nodes; if the kind is not clear from the label, the label is wrong. No accent hue anywhere — links and focus rings keep it exclusively. No more than nine nodes in one figure; past that, cut a boundary out and give it its own figure. Layout grid: 168px nodes, 96px gaps, rows 136px apart, sources at the top, sinks at the bottom, failure paths to the left.

---

## Content fundamentals

Second person, present tense, active voice. State what the system does, then what that buys the reader; never sell it.

- **Headings are claims, not labels.** "Two writes, one truth", "The commit is the event", "What was actually wrong" — never "Overview", "Features", "Introduction".
- **Section eyebrows are numbered and uppercase:** `01 / PROBLEM`, `02 / DESIGN`, `03 / IN PRACTICE`. The numbering exists so the argument's arc is visible before the page is read.
- **Breadcrumbs and pagers use lowercase slugs:** `docs / deep-dive / change-capture`, `ordered-fanout →`. Never title-cased page names.
- **Config keys, defaults, ranges, file names and metrics appear in mono, never in quotes:** `max_lag_bytes`, `64MB`, `1–256`, `5s–5m`.
- **Callouts are one or two sentences.** If it needs a paragraph, it is prose. "Dual-write drift is not detectable from either side alone."
- **Numbers are concrete.** "p99 delivery lag 14s → 900ms", "four hours to nine seconds". If a number is not known, the sentence is rewritten rather than padded.
- **First person is allowed only on the portfolio's About and case-study pages**, where the author is the subject: "I read the code before the tickets." Docs and RFCs stay in second or third person.
- **No emoji, anywhere. No exclamation marks.** No "simply", "just", "powerful", "seamless", "delightful". No sentence that exists to introduce the next sentence.

---

## Iconography

**The system uses no icon set.** Its entire glyph vocabulary is Unicode typed in mono: `←` `→` for pagers and index rows, `⌘K` for the search hint, `/` as the breadcrumb and eyebrow separator, `·` as the metadata separator, `!` and `i` as callout marks. That is the complete list. Do not add a one-off SVG to fill a gap — either the label is enough, or the pattern is wrong.

If a product genuinely needs true icons, add **Lucide at 1.5px stroke** from CDN, keep them at 16px, and document the addition in this file. Do not mix sets and do not tint them with the accent.

**No logo asset exists.** The provided sources contain none, so none was drawn. The wordmark is type: JetBrains Mono bold, uppercase, +0.02em, ink — `RELAY` in the docs and writing kits, the author's name in the portfolio kit. Supply a real mark and it drops into `TopBar` and `SiteFooter` without other changes.

---

## Index

- `styles.css` — the entry point; imports everything in `tokens/`.
- `tokens/` — `fonts.css`, `colors.css`, `typography.css`, `spacing.css`, `borders.css`, `base.css`, `diagram.css`.
- `guidelines/` — 17 foundation specimen cards (Type, Colors, Spacing, Brand, Motion).
- `thumbnail.html` — the system's homepage tile.
- `SKILL.md` — Agent Skills entry point.

### Components

**`components/core/`** — `Button`, `Badge`, `SearchField`
**`components/content/`** — `Callout`, `CodeBlock`, `DataTable`, `StepList`, `DiagramPlaceholder`
**`components/layout/`** — `TopBar`, `PageHeader`, `SectionLabel`, `SplitSection`, `PrevNextNav`
**`components/site/`** — `IndexList`, `Prose`, `Figure`, `MetaRow`, `SiteFooter`
**`components/diagram/`** — `DiagramFrame`, `DiagramNode`, `DiagramEdge`, `Boundary`, `DiagramLegend`, `StepMarker`

Each directory has a `.card.html` showing its variants, and each component ships a `.d.ts` props contract and a `.prompt.md` usage note.

### UI kits

- `ui_kits/docs/` — deep-dive page and API reference (ported unchanged from the source project).
- `ui_kits/portfolio/` — index, four case studies, about.
- `ui_kits/writing/` — archive with live search, essay, design doc.

### Intentional additions

The source project defined thirteen components for a docs site only. The brief here extends to portfolios and articles, so `components/site/` adds five patterns — each one an abstraction of something the ported surfaces already do, not a new idea:

- `IndexList` — the ruled row list used for selected work and article archives. The source had no list pattern; a grid of thumbnail cards would contradict the no-imagery, no-card rule.
- `Prose` — sets the 68ch measure and the mono-heading / sans-body rule for long-form bodies, so articles do not restate it per element.
- `Figure` — hairline frame plus numbered mono caption, wrapping `DiagramPlaceholder` or a real asset.
- `MetaRow` — the mono date · reading-time · topic run under an article title.
- `SiteFooter` — page-closing colophon; the source kit's pages simply ended.

### Substitutions to confirm

- **Fonts are loaded from Google Fonts** (JetBrains Mono, Public Sans) via `tokens/fonts.css`. No binaries are bundled. Supply files if you self-host, and this is the one place `@font-face` rules belong.
- **The accent hue** (oklch 250) came with the source project; direction 1c itself was fully achromatic.
- **No logo.** See Iconography above.
