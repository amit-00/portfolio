# Provisioning V3 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a desktop-only, client-rendered scrolling deep dive at `/deep-dives/provisioning-v3` with nine focused Relay system diagrams driven by native scroll progress.

**Architecture:** A route-local client component renders the complete narrative rail and a sticky diagram stage. One passive scroll listener schedules a single animation frame, selects the active chapter, and writes clamped progress to a CSS custom property; CSS Modules and inline SVG perform the visual interpolation without new dependencies.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript strict mode, CSS Modules, inline SVG, existing Relay components and global tokens.

**Spec:** `docs/superpowers/specs/2026-08-13-provisioning-v3-design.md`

## Global Constraints

- Treat provisioning v2 plus the approved storyboard corrections as the factual source of truth.
- Use only these service names: Ingestion, Access, Consumption, and Orchestration.
- Preserve Relay typography, colors, hairline rules, square geometry, and diagram grammar.
- Use native scrolling; do not intercept wheel or touch input.
- Add no dependency.
- Render only a desktop-required message below `1100px`.
- Honor `prefers-reduced-motion` with complete static diagram states.
- Do not change or stage provisioning v1, provisioning v2, `.agents`, or `.superpowers`.
- The user explicitly authorized skipping new automated tests for this visual page.
- Verification requires lint, production build, desktop browser inspection, narrow viewport inspection, reduced-motion inspection, keyboard inspection, and final diff review.

---

### Task 1: Build the complete static presentation and diagram set

**Files:**
- Create: `app/deep-dives/provisioning-v3/layout.tsx`
- Create: `app/deep-dives/provisioning-v3/page.tsx`
- Create: `app/deep-dives/provisioning-v3/provisioning-diagrams.tsx`
- Create: `app/deep-dives/provisioning-v3/provisioning-v3.module.css`

**Interfaces:**
- Produces: `type SceneId = "product" | "legacy" | "failure" | "protocol" | "operation" | "validation" | "compensation" | "control-plane" | "outcome"`.
- Produces: `interface StoryScene { id: SceneId; index: string; eyebrow: string; title: string; paragraphs: readonly string[]; }` in `page.tsx`; inline technical terms are repeated in mono diagram labels rather than parsed from prose.
- Produces: `function ProvisioningDiagrams({ activeScene }: { activeScene: SceneId }): ReactNode` in `provisioning-diagrams.tsx`.
- Produces: route metadata with `robots: { index: false, follow: false }`.
- Consumes: existing `TopBar` from `@/components/relay/top-bar`.

- [ ] **Step 1: Create the route metadata layout**

Create `layout.tsx` with a server-side metadata boundary so `page.tsx` can remain a Client Component:

```tsx
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Rebuilding provisioning for a data platform — v3",
  description:
    "A scrolling system-design deep dive into rebuilding data-platform provisioning.",
  robots: { index: false, follow: false },
};

export default function ProvisioningV3Layout({
  children,
}: Readonly<{ children: ReactNode }>): ReactNode {
  return children;
}
```

- [ ] **Step 2: Create typed Relay diagram primitives**

In `provisioning-diagrams.tsx`, define the exact scene union and small repeated primitives. Keep all imports at the top and annotate every component return type.

```tsx
import type { ReactNode } from "react";
import styles from "./provisioning-v3.module.css";

export type SceneId =
  | "product"
  | "legacy"
  | "failure"
  | "protocol"
  | "operation"
  | "validation"
  | "compensation"
  | "control-plane"
  | "outcome";

type NodeKind =
  | "service"
  | "client"
  | "datastore"
  | "job"
  | "external"
  | "engine"
  | "failed";

function DiagramNode({
  kind,
  title,
  detail,
  className,
}: {
  kind: NodeKind;
  title: string;
  detail: string;
  className?: string;
}): ReactNode {
  return (
    <div className={`${styles.node} ${styles[kind]} ${className ?? ""}`}>
      <strong>{title}</strong>
      <span>{detail}</span>
    </div>
  );
}
```

Add `DiagramFrame`, `FlowEdge`, and `StepRow` only because they repeat across the nine figures. Use these explicit contracts and do not add a generic graph renderer or layout engine:

```tsx
type EdgeDirection = "right" | "down" | "left" | "return";
type StepStatus = "complete" | "failed" | "pending" | "neutral";

interface DiagramFrameProps {
  label: string;
  children: ReactNode;
  className?: string;
}

interface FlowEdgeProps {
  label: string;
  direction: EdgeDirection;
  asynchronous: boolean;
}

interface StepRowProps {
  index: string;
  title: string;
  state: string;
  status: StepStatus;
}
```

Implement `function DiagramFrame(props: DiagramFrameProps): ReactNode`, `function FlowEdge(props: FlowEdgeProps): ReactNode`, and `function StepRow(props: StepRowProps): ReactNode` directly below the contracts.

- [ ] **Step 3: Implement all nine focused diagrams**

Create one single-purpose component for each scene and a static lookup:

```tsx
const diagrams: Record<SceneId, () => ReactNode> = {
  product: ProductDiagram,
  legacy: LegacyDiagram,
  failure: FailureDiagram,
  protocol: ProtocolDiagram,
  operation: OperationDiagram,
  validation: ValidationDiagram,
  compensation: CompensationDiagram,
  "control-plane": ControlPlaneDiagram,
  outcome: OutcomeDiagram,
};
```

Implement the figures with exactly these visible states:

1. `ProductDiagram`: one DDP client node fans out to Ingestion, Access, Consumption, and Orchestration.
2. `LegacyDiagram`: one dashed `shared VM / one provisioning application` boundary contains four serial rows: `deployIngestion()` → Ingestion DB, `deployAccess()` → Access DB, `deployConsumption()` → service deployment, and `deployOrchestration()` → Orchestration DB.
3. `FailureDiagram`: Ingestion and Access show `deployed`, Consumption shows `failed`, Orchestration shows `not run`, and an inverse terminal shows the illustrative `HttpResponseError: (DeploymentFailed)` sample from the spec.
4. `ProtocolDiagram`: one engine fans out through identical API boundaries to the four corrected service names.
5. `OperationDiagram`: request `D-1842` flows to the engine record, a service operation, and asynchronous status polling; label the deployment ID as the idempotency key.
6. `ValidationDiagram`: five ordered rows for product schema, service validation, plan and preflight, deployment, and verification.
7. `CompensationDiagram`: the prior revision stays anchored, Access is failed, and a dashed compensation path returns from the engine to Ingestion for `D-1842`.
8. `ControlPlaneDiagram`: GitHub Actions and its AKS runner flow through immutable ADLS references to the engine and service APIs, carrying trace context.
9. `OutcomeDiagram`: the product team flows through one correlated deployment record to service-team ownership, with a dashed external node stating `no universal rollback · no drift detector`.

Each component must call `DiagramFrame` with an `aria-label` that describes the complete visible state. Use text and line style in addition to color for status.

- [ ] **Step 4: Render the full static narrative page**

Create `page.tsx` with `"use client"`, the `StoryScene` type, and a readonly `SCENES` array in the exact spec order. Use the approved headings:

```tsx
const SCENES: readonly StoryScene[] = [
  {
    id: "product",
    index: "01",
    eyebrow: "THE PRODUCT",
    title: "One product, four platform services",
    paragraphs: [
      "A declarative data product described one product: its source, access rules, consumers, jobs, and schedules.",
      "Provisioning translated that declaration into four platform services: Ingestion, Access, Consumption, and Orchestration.",
    ],
  },
  {
    id: "legacy",
    index: "02",
    eyebrow: "STARTING POINT",
    title: "One application owned every deployment step",
    paragraphs: [
      "An approved user connected to a shared Azure VM through SSH and started one single-threaded provisioning application.",
      "That application contained every service procedure, ran them serially, and wrote directly to the databases owned by Ingestion, Access, and Orchestration.",
    ],
  },
  {
    id: "failure",
    index: "03",
    eyebrow: "FAILURE",
    title: "One failure produced three truths",
    paragraphs: [
      "When one step failed, earlier services stayed deployed, the failed service stopped, and later services never ran.",
      "The user received raw implementation output instead of an actionable explanation, then had to reconstruct the product's state across service-specific systems.",
    ],
  },
  {
    id: "protocol",
    index: "04",
    eyebrow: "DESIGN DECISION",
    title: "Standardize the protocol, not the work",
    paragraphs: [
      "The replacement engine owns one stable protocol and one deployment record; it does not contain service deployment logic.",
      "Each service team owns validation, planning, deployment, compensation, status persistence, and the infrastructure behind its API.",
    ],
  },
  {
    id: "operation",
    index: "05",
    eyebrow: "OPERATION SEMANTICS",
    title: "Every operation gets an identity",
    paragraphs: [
      "Every immutable request receives a new deployment ID and carries the product, environment, desired revision, artifact and configuration digests, initiating identity, and trace context.",
      "Services persist asynchronous outcomes and use the deployment ID as an idempotency key. A retry is effectively once only where the service makes repeated delivery safe.",
      "The common contract exposes validate, plan, deploy, compensate, and getStatus; the engine retries only operations explicitly marked retryable.",
    ],
  },
  {
    id: "validation",
    index: "06",
    eyebrow: "VALIDATION",
    title: "Validation narrows uncertainty",
    paragraphs: [
      "Product schema, service validation, planning and preflight, deployment, and post-deployment verification address progressively more concrete uncertainty.",
      "The engine does not build a product-wide plan because services own their planning semantics.",
      "The first release processes services sequentially for progress reporting and recovery, not because the services form a dependency graph.",
    ],
  },
  {
    id: "compensation",
    index: "07",
    eyebrow: "FAILURE RECOVERY",
    title: "Compensation is not deletion",
    paragraphs: [
      "Deployment D-1842 creates Ingestion resources before Access rejects a regulated-field change.",
      "The engine asks Ingestion to compensate only D-1842's reversible changes and keeps the prior known-good revision active where the service can restore it safely.",
      "If compensation fails, the product becomes recovery-required; the engine never reports a clean state it cannot establish.",
    ],
  },
  {
    id: "control-plane",
    index: "08",
    eyebrow: "CONTROL PLANE",
    title: "The workflow became part of the control plane",
    paragraphs: [
      "GitHub Actions uses workload identity, environment protections, and ephemeral AKS runners instead of persistent VM credentials.",
      "Immutable ADLS references and verified digests cross into the engine, then least-privilege service APIs perform the work.",
      "The workflow polls status while the audit record and OpenTelemetry trace correlate actor, commit, configuration, deployment ID, and outcome.",
    ],
  },
  {
    id: "outcome",
    index: "09",
    eyebrow: "OUTCOME + OWNERSHIP",
    title: "One record replaced reconstruction",
    paragraphs: [
      "Teams gain a self-service route and one correlated deployment record. Service teams gain control and responsibility for idempotency, status, and compensation.",
      "The engine deliberately does not promise universal rollback, exactly-once execution, or continuous drift detection.",
      "I defined the engine boundary, implemented the request and status flow, established the operating model, and supported service migrations to the contract.",
    ],
  },
] as const;
```

Populate every paragraph from the approved spec without adding unsupported metrics. Render:

- A `.desktopGuard` with `This deep dive is designed for desktop.` and a link to `/`.
- A `.desktopExperience` containing `TopBar`.
- A full-viewport hero with the title, v2 thesis, `09 scenes`, and a mono scroll cue.
- A `.storyLayout` with the ordered narrative rail and a `.visualRail`.
- Nine semantic `<section>` elements with `data-scene`, numbered eyebrow, claim heading, and concise prose.
- A sticky stage that initially renders `<ProvisioningDiagrams activeScene="product" />` and a nine-row progress index with `aria-current="step"` on the first row.
- A Relay closing statement covering the author's ownership and the explicit non-goals.

- [ ] **Step 5: Add the static layout and diagram geometry**

In the CSS Module:

- Hide `.desktopExperience` by default and show `.desktopGuard` as a full-page Relay surface.
- Under `@media (min-width: 1100px)`, hide the guard and show the experience.
- Set the hero to `min-height: calc(100svh - 52px)` with Relay gutters and a bottom hairline.
- Use `.storyLayout { display: grid; grid-template-columns: minmax(360px, 42%) minmax(0, 58%); }`.
- Give each narrative scene `min-height: 140vh`, `padding: 18vh 48px 22vh 28px`, and a bottom hairline.
- Make the visual rail sunken with a left hairline; make its inner stage `position: sticky`, `top: 0`, and `min-height: 100vh`.
- Use square nodes, mono labels, the existing Relay ink tokens, and no shadow, radius, gradient, blur, or decorative fill.
- Keep diagrams within nine nodes and use SVG paths only for orthogonal edges that HTML grid cannot express clearly.
- Use the inverse surface only for the Section 3 terminal sample.

At this stage all nine scenes must be readable with the first diagram visible and without relying on scroll-linked animation.

- [ ] **Step 6: Verify the static route**

Run:

```bash
bun run lint
bun run build
```

Expected: both commands exit `0`; Next lists `/deep-dives/provisioning-v3` as a built route.

- [ ] **Step 7: Commit the static presentation**

```bash
git add app/deep-dives/provisioning-v3/layout.tsx \
  app/deep-dives/provisioning-v3/page.tsx \
  app/deep-dives/provisioning-v3/provisioning-diagrams.tsx \
  app/deep-dives/provisioning-v3/provisioning-v3.module.css
git commit -m "feat: add provisioning v3 presentation"
```

---

### Task 2: Add native scroll orchestration and diagram motion

**Files:**
- Modify: `app/deep-dives/provisioning-v3/page.tsx`
- Modify: `app/deep-dives/provisioning-v3/provisioning-diagrams.tsx`
- Modify: `app/deep-dives/provisioning-v3/provisioning-v3.module.css`

**Interfaces:**
- Consumes: `SceneId` and `ProvisioningDiagrams` from Task 1.
- Produces: `interface ScrollSnapshot { activeIndex: number; progress: number; }`.
- Produces: `function getScrollSnapshot(sections: readonly HTMLElement[], viewportHeight: number): ScrollSnapshot`.
- Updates: `ProvisioningDiagrams({ activeScene })` renders all figures but marks only the selected figure active so chapter transitions can overlap briefly.

- [ ] **Step 1: Add pure scroll-state calculation**

Add this typed helper above the page component:

```tsx
interface ScrollSnapshot {
  activeIndex: number;
  progress: number;
}

function getScrollSnapshot(
  sections: readonly HTMLElement[],
  viewportHeight: number,
): ScrollSnapshot {
  const readingLine = viewportHeight * 0.45;
  let activeIndex = 0;
  let closestDistance = Number.POSITIVE_INFINITY;

  sections.forEach((section, index) => {
    const bounds = section.getBoundingClientRect();
    const distance = Math.abs(bounds.top - readingLine);
    if (distance < closestDistance) {
      activeIndex = index;
      closestDistance = distance;
    }
  });

  const activeBounds = sections[activeIndex].getBoundingClientRect();
  const travel = Math.max(activeBounds.height - viewportHeight, 1);
  const rawProgress = -activeBounds.top / travel;

  return {
    activeIndex,
    progress: Math.min(1, Math.max(0, rawProgress)),
  };
}
```

- [ ] **Step 2: Wire one passive scroll listener**

In the page component, create typed refs for the nine sections and the stage plus `activeIndex` state. The effect must schedule at most one animation frame and clean up both listener and frame:

```tsx
const [activeIndex, setActiveIndex] = useState<number>(0);
const sectionRefs = useRef<Array<HTMLElement | null>>([]);
const stageRef = useRef<HTMLDivElement | null>(null);

useEffect(() => {
  let frameId: number | null = null;

  const update = (): void => {
    frameId = null;
    const sections = sectionRefs.current.filter(
      (section): section is HTMLElement => section !== null,
    );
    if (sections.length !== SCENES.length || stageRef.current === null) return;

    const snapshot = getScrollSnapshot(sections, window.innerHeight);
    setActiveIndex((current) =>
      current === snapshot.activeIndex ? current : snapshot.activeIndex,
    );
    stageRef.current.style.setProperty(
      "--scene-progress",
      snapshot.progress.toFixed(3),
    );
    stageRef.current.style.setProperty(
      "--scene-shift",
      `${((1 - snapshot.progress) * 24).toFixed(2)}px`,
    );
    stageRef.current.style.setProperty(
      "--scene-line-offset",
      (1 - snapshot.progress).toFixed(3),
    );
  };

  const schedule = (): void => {
    if (frameId === null) frameId = window.requestAnimationFrame(update);
  };

  schedule();
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule);

  return () => {
    window.removeEventListener("scroll", schedule);
    window.removeEventListener("resize", schedule);
    if (frameId !== null) window.cancelAnimationFrame(frameId);
  };
}, []);
```

Connect each scene ref by index, pass `SCENES[activeIndex].id` to the diagram stage, and update `aria-current` in the progress index.

- [ ] **Step 3: Animate focused scene states**

Render all nine figure wrappers inside `ProvisioningDiagrams`. Each wrapper receives `data-active={sceneId === activeScene}` and `aria-hidden={sceneId !== activeScene}`. CSS must:

- Stack figures with `position: absolute; inset: 0`.
- Transition inactive figures to `opacity: 0; visibility: hidden; transform: translateY(16px)`.
- Transition the active figure to `opacity: 1; visibility: visible; transform: translateY(0)` using `240ms linear`.
- In the animation frame, derive `--scene-shift` as `${((1 - progress) * 24).toFixed(2)}px` and `--scene-line-offset` as `(1 - progress).toFixed(3)` alongside `--scene-progress`.
- Use `transform: translateY(var(--scene-shift))` or the horizontal equivalent to reveal nodes within the active figure; keep every visual travel distance at or below `24px`.
- Give SVG paths `pathLength="1"`, set solid edges to `stroke-dasharray: 1`, and use `stroke-dashoffset: var(--scene-line-offset)`.
- Animate a seven-unit flow dash at `1.6s linear infinite` only on successful moving paths.
- Keep failed and compensation paths dashed and static.
- Use `28%` opacity for not-run or intentionally de-emphasized nodes.
- Keep the prior revision fixed throughout the compensation scene.

Do not add scale, spring, easing curves, parallax, or scroll snapping.

- [ ] **Step 4: Implement reduced motion**

Under `@media (prefers-reduced-motion: reduce)`:

```css
.figure,
.node,
.edge,
.flowDash {
  animation: none !important;
  transition: none !important;
  transform: none !important;
}

.edge {
  stroke-dashoffset: 0 !important;
}

.flowDash {
  display: none;
}
```

The active chapter may still change, but each selected diagram appears in its complete final state immediately.

- [ ] **Step 5: Verify orchestration and production compilation**

Run:

```bash
bun run lint
bun run build
```

Expected: both commands exit `0`; no effect cleanup, exhaustive-deps, typing, or CSS Module errors appear.

- [ ] **Step 6: Commit scroll behavior**

```bash
git add app/deep-dives/provisioning-v3/page.tsx \
  app/deep-dives/provisioning-v3/provisioning-diagrams.tsx \
  app/deep-dives/provisioning-v3/provisioning-v3.module.css
git commit -m "feat: animate provisioning story on scroll"
```

---

### Task 3: Perform browser QA and final verification

**Files:**
- Modify only if inspection finds a defect: `app/deep-dives/provisioning-v3/page.tsx`
- Modify only if inspection finds a defect: `app/deep-dives/provisioning-v3/provisioning-diagrams.tsx`
- Modify only if inspection finds a defect: `app/deep-dives/provisioning-v3/provisioning-v3.module.css`

**Interfaces:**
- Consumes: the built `/deep-dives/provisioning-v3` route.
- Produces: verified behavior at desktop, narrow, reduced-motion, and keyboard states.

- [ ] **Step 1: Start the local site and open the route**

Run `bun run dev`, open `http://localhost:3000/deep-dives/provisioning-v3`, and inspect at `1440 × 900`.

- [ ] **Step 2: Inspect the entire desktop sequence**

Scroll from hero to close and verify all of the following:

- All nine headings and diagrams appear in spec order.
- The corrected four service names are consistent everywhere.
- Section 2 visibly keeps all four linear steps inside one application boundary and identifies only three direct database writes.
- Section 3 shows the mixed state and opaque sample error.
- The active progress row follows the narrative.
- Node and edge motion completes within each chapter without overlaps, clipped labels, or blank stage states.
- Section 7 distinguishes compensation from deletion and preserves the prior revision.
- Section 9 states the non-goals and uses no unsupported quantitative result.

- [ ] **Step 3: Inspect the responsive guard**

Resize to `1099 × 900` and `768 × 900`. Verify that only the desktop-required message and portfolio link render. Resize to `1100 × 900` and verify the presentation returns without horizontal overflow.

- [ ] **Step 4: Inspect reduced motion and keyboard behavior**

Emulate `prefers-reduced-motion: reduce`, reload, and scroll through every chapter. Verify diagrams switch directly to complete readable states and no flow dash loops. Tab through the top bar and desktop-required link; verify visible Relay focus rings and native scrolling.

- [ ] **Step 5: Fix only observed defects and repeat the affected check**

Keep fixes route-local. Do not refactor existing Relay components or global CSS. After each fix, repeat the exact viewport or motion check that exposed it.

- [ ] **Step 6: Run final verification**

Stop the development server, then run:

```bash
bun run lint
bun run build
git diff --check
git status --short
git diff HEAD~2 -- app/deep-dives/provisioning-v3
```

Expected: lint and build exit `0`; diff checks report no whitespace errors; only the provisioning-v3 route and committed design/plan files belong to this feature; user-owned `.agents`, `.superpowers`, and provisioning-v2 files remain uncommitted and unchanged.

- [ ] **Step 7: Commit browser-polish fixes if files changed**

If Step 5 changed route files:

```bash
git add app/deep-dives/provisioning-v3/page.tsx \
  app/deep-dives/provisioning-v3/provisioning-diagrams.tsx \
  app/deep-dives/provisioning-v3/provisioning-v3.module.css
git commit -m "fix: polish provisioning v3 presentation"
```

If browser inspection required no code change, do not create an empty commit.
