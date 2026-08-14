# Provisioning V3 Scrolling Deep Dive Design

## Purpose

Build a desktop-only, client-rendered deep dive at `/deep-dives/provisioning-v3`. The page presents the provisioning project as one linear argument in which concise narrative beats control a sticky system-diagram stage. It preserves the Relay design language while introducing restrained scroll-linked motion.

Provisioning v2 is the factual source of truth where v1 and v2 conflict. The corrections approved in the storyboard supersede both drafts for service naming and the legacy deployment path.

## Success Criteria

- The reader understands the old system, its failure mode, the replacement protocol, and its operational limits without reading either earlier article.
- Each chapter uses one focused diagram rather than a single full-system architecture map.
- Scrolling drives diagram state without hijacking native browser scrolling.
- The page reads correctly when motion is reduced or unavailable.
- Viewports narrower than `1100px` show only a clear desktop-required message and a route back to the portfolio.
- The page adds no runtime dependency.

## Experience Architecture

The route is a client-side presentation built with React, CSS Modules, inline SVG, one passive scroll listener, and `requestAnimationFrame`. A server layout supplies route metadata and keeps the presentation page itself client-rendered.

After a full-viewport opening, the main story uses a two-column layout:

- The narrative rail contains nine ordered chapters. Each chapter occupies approximately `125–160vh`, giving the reader enough scroll distance for a complete visual beat.
- The diagram stage is sticky within the viewport. It displays one chapter-specific figure at a time and exposes a clamped `0–1` progress value to that figure through a CSS custom property.
- The active chapter changes when its narrative block crosses the viewport reading line. Chapter changes use short linear transitions between complete diagram states.
- A slim mono progress index shows the active chapter and the remaining sequence. It does not become a separate navigation system.

The browser's native scroll position is the only source of truth. There is no smooth-scroll library, wheel interception, artificial momentum, snap point, or URL-driven state.

## Relay Visual Language

The page uses the existing Relay tokens and rules:

- Near-white page, sunken grey secondary surface, and the achromatic ink ramp.
- JetBrains Mono for structure and Public Sans for prose.
- Square corners, hairline boundaries, and no shadows, gradients, blur, photography, or decorative icons.
- Claims as headings and numbered uppercase eyebrows.
- Accent color only for links and focus rings.

Scroll motion is an explicit exception to Relay's normal color-only motion rule. That exception is limited to the system diagrams and presentation state:

- Nodes translate only far enough to explain a relationship.
- Edges draw in or reveal a constant-speed flow marker.
- Inactive nodes drop to `28%` opacity when the story is isolating a failure or ownership boundary.
- Diagram changes use linear timing and no bounce, spring, depth, scale flourish, or parallax decoration.
- Failure edges remain static and dashed.

## Diagram Grammar

Every diagram uses the Relay system vocabulary:

- `client`: three-pixel top rule.
- `datastore`: three-pixel bottom rule.
- `job`: three-pixel left rule.
- `external`: dashed rule and sunken surface.
- `engine`: strong two-pixel boundary.
- `failed`: dashed danger rule plus a six-pixel state marker.
- Solid edge: synchronous call.
- Dashed edge: asynchronous operation or compensation path.
- Every edge carries a short mono label describing what moves.

Figures contain no more than nine nodes. Each diagram has an accessible name and a concise text alternative describing the same state without relying on animation or color.

## Narrative Sequence

### 01 / The product — One product, four platform services

A declarative data product describes one product. Provisioning translates it into four platform services: **Ingestion**, **Access**, **Consumption**, and **Orchestration**.

The diagram begins with one centered DDP node. Scroll progress separates four service nodes from it while keeping the declaration visible as their shared source.

### 02 / Starting point — One application owned every deployment step

The legacy provisioning application contains the deployment procedure for all four services. An approved user reaches the shared Azure VM through SSH, then the application executes the service steps as one linear operation. It writes directly to the databases owned by Ingestion, Access, and Orchestration. Consumption still runs inside the same central sequence through its service-specific deployment mechanism.

The diagram opens the application boundary and reveals these steps in order:

1. `deployIngestion()` → Ingestion database.
2. `deployAccess()` → Access database.
3. `deployConsumption()` → service deployment.
4. `deployOrchestration()` → Orchestration database.

Only one flow marker advances at a time. This makes the serialized execution and central ownership visible before the failure is introduced.

### 03 / Failure — One failure produced three truths

A failure stops the sequence. In the illustrative run, Ingestion and Access remain deployed, Consumption fails, and Orchestration never runs. The application exposes raw implementation output rather than a message a non-technical product owner can act on.

The diagram freezes the first two service rows in success, marks Consumption failed, and reduces Orchestration to `28%` opacity. An inverse terminal surface expands beside it with this representative output:

```text
$ provision product.yaml --env prod
[1/4] ingestion .......... succeeded
[2/4] access ............. succeeded
[3/4] consumption ........ failed

HttpResponseError: (DeploymentFailed)
At least one resource deployment operation failed.
See deployment operations for details.
Correlation ID: 7f2c…91ab
```

The output is explicitly presented as an illustrative sample, not a verbatim historical log.

### 04 / Design decision — Standardize the protocol, not the work

The replacement engine owns one stable protocol and one deployment record. It does not contain service deployment logic. Each service team owns validation, planning, deployment, compensation, status persistence, and the infrastructure behind its API.

The diagram collapses the four legacy procedures behind four visually identical service API boundaries: Ingestion, Access, Consumption, and Orchestration. The engine stays fixed while the internal service mechanisms remain independent.

### 05 / Operation semantics — Every operation gets an identity

Every immutable request receives a new `deploymentId`, including a deliberate reconciliation of unchanged desired configuration. Requests carry product, environment, desired revision, artifact and configuration digests, initiating identity, and trace context. Long-running service work is asynchronous.

Services use the deployment ID as their idempotency key and persist their own outcome. Retries can invoke an operation more than once; they produce an effectively-once result only where the service makes that safe. The engine retries only operations explicitly marked retryable. The common contract exposes `validate`, `plan`, `deploy`, `compensate`, and `getStatus`.

The diagram follows one deployment ID from immutable request to engine record, service operation, and status polling. A return edge shows repeated status reads without implying exactly-once execution.

### 06 / Validation — Validation narrows uncertainty

Validation progresses through five increasingly concrete checks:

1. Product schema validation checks DDP structure.
2. Service validation checks service-owned semantics.
3. Planning and preflight check permitted changes and prerequisites.
4. Deployment performs side effects.
5. Post-deployment verification checks health and readiness.

The engine does not create a product-wide plan. Services have no deployment dependency graph, and the first release processes them sequentially for progress reporting and recovery rather than because one service depends on another.

The diagram resolves the five checks in sequence and leaves completed checks visible as the next becomes active.

### 07 / Failure recovery — Compensation is not deletion

The concrete path uses deployment `D-1842`: Ingestion creates resources, then Access rejects a regulated-field change. The engine marks the run failed and asks Ingestion to compensate only the reversible changes created or changed by `D-1842`. It never asks a service to delete the product.

The prior known-good production revision remains active when the service can safely restore it. If compensation fails, the deployment becomes `recovery-required`; the engine does not claim a clean state it cannot establish. In-place mutations, destructive migrations, and external writes can require service-specific recovery or a forward-only change.

The diagram stops the forward path at Access, draws a dashed compensation edge back to Ingestion, and keeps the prior revision anchored throughout.

### 08 / Control plane — The workflow became part of the control plane

GitHub Actions replaces direct VM access but does not remove control-plane responsibility. The operating boundary includes workload identity, environment protections, ephemeral AKS runners, immutable ADLS artifact and configuration references, verified digests, the engine, service APIs, authorization, audit records, and OpenTelemetry trace context.

The runner polls the engine status endpoint and publishes progress in the workflow. The audit record captures the actor, source commit, configuration digest, deployment ID, and outcome. Correlated traces reduce reconstruction across systems without pretending incident analysis disappears.

The diagram reveals one trust boundary at a time and keeps trace context visible through each hop.

### 09 / Outcome and ownership — One record replaced reconstruction

Teams gain a self-service deployment route and one correlated deployment record. Service teams gain control over their implementation and responsibility for idempotency, status persistence, and compensation. The engine deliberately does not promise universal rollback, exactly-once execution, or continuous drift detection.

The close states the author's ownership: defining the engine boundary, implementing request and status flow, establishing the operational model, and supporting service migrations to the contract. It uses qualitative outcomes only; the page does not publish unsupported adoption, mixed-state, integration-time, or queue-time figures.

The final diagram retracts the old multi-system reconstruction into one deployment record and holds on the system's explicit guarantees and non-goals.

## Client Components

Production code is split only where responsibilities differ:

- `app/deep-dives/provisioning-v3/layout.tsx`: metadata and no-index policy.
- `app/deep-dives/provisioning-v3/page.tsx`: client-side scroll orchestration, chapter content, progress index, desktop guard, and accessible document structure.
- `app/deep-dives/provisioning-v3/provisioning-diagrams.tsx`: the Relay diagram primitives and nine focused diagram components.
- `app/deep-dives/provisioning-v3/provisioning-v3.module.css`: route-scoped layout, diagram geometry, progress-driven transforms, responsive guard, and reduced-motion rules.

Existing global Relay tokens and the existing `TopBar` are reused. No general-purpose animation abstraction or new global style is added.

## Scroll State and Data Flow

`page.tsx` holds the active scene index in React state and a ref to the sticky diagram stage. A single passive scroll listener schedules at most one animation frame. That frame:

1. Reads the nine chapter bounds.
2. Selects the chapter nearest the viewport reading line.
3. Computes progress through that chapter and clamps it to `0–1`.
4. Updates React only when the active chapter changes.
5. Writes `--scene-progress` directly to the stage for frame-level visual interpolation.

The effect removes the listener and cancels any scheduled animation frame on unmount. It recalculates from current geometry after resize and does not retain hidden global state.

## Desktop Guard and Accessibility

- At widths below `1100px`, presentation content is hidden and replaced by a full-page Relay message: `This deep dive is designed for desktop.` The message includes a link back to the portfolio.
- The desktop guard is CSS-first, so the correct state appears before client effects run.
- `prefers-reduced-motion: reduce` removes scroll interpolation, node travel, line drawing, and flow loops. Each chapter switches to its complete final diagram state.
- The page retains native scrolling and keyboard behavior.
- Structural diagrams are hidden from assistive technology only when an adjacent text alternative contains equivalent information; otherwise the diagram receives `role="img"` and an accessible label.
- Status never relies on color alone: failures also use dashed rules, state markers, and explicit text.
- Focus styles continue to use the existing two-pixel Relay accent outline.

## Performance and Failure Handling

- No GSAP, Motion, Lenis, or other dependency is added.
- Diagrams use CSS and inline SVG; there are no raster assets or network requests.
- Scroll work is limited to one animation frame and nine bounding-rectangle reads per frame.
- Progress values are clamped and finite before they reach CSS.
- If client JavaScript fails, the ordered narrative remains in the document and the first complete diagram remains visible.
- If reduced motion is requested, the animation code does not need to produce intermediate visual states.

## Verification

The user explicitly authorized implementation without new automated tests for this page. Completion still requires fresh evidence from:

- ESLint.
- TypeScript/Next production build.
- Desktop browser inspection above `1100px` across the full nine-scene sequence.
- Narrow viewport inspection below `1100px` for the desktop-required state.
- Reduced-motion inspection for complete, readable static diagram states.
- Keyboard and focus inspection for all links.
- A final `git diff` review to confirm v1, v2, and unrelated files remain unchanged.

## Out of Scope

- Editing or replacing provisioning v1 or v2.
- Adding the new page to the public project index.
- Publishing unsupported quantitative results.
- Mobile or tablet adaptations of the presentation.
- Smooth-scroll interception, dependency-graph visualization, continuous drift detection, or claims of universal rollback and exactly-once execution.
