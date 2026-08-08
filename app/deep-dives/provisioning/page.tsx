import type { Metadata } from "next";
import type { ReactNode } from "react";
import { TopBar } from "@/components/relay/top-bar";
import { SiteFooter } from "@/components/relay/site-footer";
import { SectionLabel } from "@/components/relay/section-label";
import { Figure } from "@/components/relay/figure";

// Unlinked draft: keep it out of the index until it is finished and linked.
export const metadata: Metadata = {
  title: "Provisioning that finishes what it starts",
  robots: { index: false, follow: false },
};

/** An outline marker: a fact the draft still owes. Delete on the way to publish. */
function TK({ children }: { children: ReactNode }): ReactNode {
  return (
    <span className="border-b border-dashed border-ink-6 font-mono text-code text-ink-5">
      TK {children}
    </span>
  );
}

/** The 135° hatch marks where a real diagram belongs. */
function DiagramSlot({ label }: { label: string }): ReactNode {
  return (
    <div
      className="flex h-44 items-center justify-center bg-[repeating-linear-gradient(135deg,transparent,transparent_6px,var(--color-rule)_6px,var(--color-rule)_7px)]"
      role="img"
      aria-label={`Diagram placeholder: ${label}`}
    >
      <span className="bg-page px-3 py-1 font-mono text-label-sm uppercase text-ink-5">
        {label}
      </span>
    </div>
  );
}

/**
 * One movement of the argument: the claim on the left held to the prose measure,
 * the single artefact that backs it in the gutter to its right.
 */
function Section({
  index,
  eyebrow,
  title,
  children,
  aside,
}: {
  index: string;
  eyebrow: string;
  title: string;
  children: ReactNode;
  aside: ReactNode;
}): ReactNode {
  return (
    <section className="grid border-b border-rule lg:grid-cols-2">
      <div className="min-w-0 px-gutter py-section lg:border-r lg:border-rule">
        <SectionLabel index={index}>{eyebrow}</SectionLabel>
        <h2 className="mt-3 max-w-[24ch] font-mono text-h2 font-bold text-ink-1">
          {title}
        </h2>
        <div className="prose mt-4">{children}</div>
      </div>
      <div className="flex min-w-0 flex-col gap-6 bg-sunken px-gutter py-section">
        {aside}
      </div>
    </section>
  );
}

export default function ProvisioningDeepDive(): ReactNode {
  return (
    <div>
      <TopBar breadcrumb="deep-dives / provisioning" />

      <header className="border-b border-rule px-gutter py-section">
        <div className="font-mono text-label uppercase text-ink-5">
          deep dive · infrastructure · <TK>date</TK> · <TK>read time</TK>
        </div>
        <h1 className="mt-3 max-w-[22ch] font-mono text-display font-bold text-ink-1">
          Provisioning that finishes what it starts
        </h1>
        <p className="mt-4 max-w-[62ch] text-lead leading-[1.6] text-ink-3">
          Standing up an environment took <TK>duration</TK>, ran through hands
          that had to be free, and left half-built resources behind whenever it
          broke. Nothing recorded what actually existed. This is the rebuild:
          what was wrong, the three designs I ruled out, and what a durable
          workflow engine changed.
        </p>
      </header>

      <Section
        index="01"
        eyebrow="PROBLEM"
        title="What the old system actually did"
        aside={
          <>
            <Figure caption="Fig 1 — The old path, and the point at which a failed run stops leaving anything behind it.">
              <DiagramSlot label="before / manual provisioning path" />
            </Figure>
            <div className="border border-rule bg-page px-5 py-4">
              <div className="font-mono text-label-sm uppercase text-ink-5">
                Requirements
              </div>
              <ol className="prose mt-3 max-w-none list-decimal pl-5 text-small">
                <li>Run unattended, start to finish.</li>
                <li>One authoritative record of what exists.</li>
                <li>A failed run leaves nothing behind.</li>
                <li>Re-running is always safe.</li>
                <li>
                  <TK>the fifth, if there is one</TK>
                </li>
              </ol>
            </div>
          </>
        }
      >
        <p>
          Open on the path a provisioning request took end to end — who
          triggered it, what ran, where it waited on a person.{" "}
          <TK>the trigger, the scripts, the approval gates</TK>
        </p>

        <h3>It waited on people</h3>
        <p>
          The manual steps and the queue they created.{" "}
          <TK>where the human sat in the loop, and how long a request idled</TK>
        </p>

        <h3>Nothing knew what existed</h3>
        <p>
          Real infrastructure diverged from anything declared, and there was no
          reliable way to ask what was actually running.{" "}
          <TK>a concrete drift incident and how it surfaced</TK>
        </p>

        <h3>A failure left wreckage</h3>
        <p>
          A run that died halfway left the resources it had already created
          orphaned. Re-running was not safe, so cleanup was manual too.{" "}
          <TK>what a failed run cost to clean up</TK>
        </p>

        <h3>What the redesign had to do</h3>
        <p>
          Close on the requirements these three failures produce — this is the
          list every alternative in the next section gets scored against.
        </p>
      </Section>

      <Section
        index="02"
        eyebrow="ALTERNATIVES"
        title="Three redesigns I ruled out"
        aside={
          <Figure caption="Fig 2 — The three alternatives scored against the requirements from 01.">
            <div className="prose max-w-none bg-page px-5 py-4">
              <table>
                <thead>
                  <tr>
                    <th>Option</th>
                    <th>Unattended</th>
                    <th>Truth</th>
                    <th>Recovers</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Declarative IaC</td>
                    <td>TK</td>
                    <td>TK</td>
                    <td>TK</td>
                  </tr>
                  <tr>
                    <td>Control plane</td>
                    <td>TK</td>
                    <td>TK</td>
                    <td>TK</td>
                  </tr>
                  <tr>
                    <td>Harden scripts</td>
                    <td>TK</td>
                    <td>TK</td>
                    <td>TK</td>
                  </tr>
                  <tr>
                    <td>Workflow engine</td>
                    <td>TK</td>
                    <td>TK</td>
                    <td>TK</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Figure>
        }
      >
        <h3>Declarative IaC on its own</h3>
        <p>
          What this would have looked like, and why plan-and-apply answered
          drift but not the multi-step, long-running, partially-external work a
          provision actually does. <TK>the specific step it could not express</TK>
        </p>

        <h3>A reconciliation control plane</h3>
        <p>
          A controller converging desired state against actual state. Why the
          operational cost landed above what the problem justified.{" "}
          <TK>what it would have cost to run and to staff</TK>
        </p>

        <h3>Hardening the scripts already there</h3>
        <p>
          The cheapest option, and the one worth taking seriously. Why
          retrofitting idempotency and resumability onto the existing path was
          the same work as replacing it, with none of the guarantees.
        </p>
      </Section>

      <Section
        index="03"
        eyebrow="DESIGN"
        title="Provisioning as a durable workflow"
        aside={
          <>
            <Figure caption="Fig 3 — A provision as a workflow: steps, retries, and the compensation path on failure.">
              <DiagramSlot label="workflow / step + compensation" />
            </Figure>
            <Figure caption="Fig 4 — A provision definition. Each step is idempotent and names its own undo.">
              <div className="prose max-w-none">
                <pre>
                  <code>{`// TK — the real definition
provision(request) {
  step("network",  create, destroy)
  step("database", create, destroy)
  step("service",  deploy,  rollback)
}`}</code>
                </pre>
              </div>
            </Figure>
          </>
        }
      >
        <p>
          The model: one provision is one durable workflow, and every unit of
          work inside it is a step the engine can retry, resume, or undo.{" "}
          <TK>the engine, and why this one</TK>
        </p>

        <h3>Why durable execution answered the hard requirement</h3>
        <p>
          Partial failure and rollback were the requirements nothing else met
          cleanly. Durable execution addresses them at the runtime rather than
          in every script.
        </p>

        <h3>The step contract</h3>
        <p>
          Each step is idempotent under a stable key and names its own
          compensating action, so a re-run is safe and an abort unwinds.{" "}
          <TK>how keys are derived; what compensation looks like in practice</TK>
        </p>

        <h3>Where the truth lives now</h3>
        <p>
          Workflow history became the record of what was provisioned and why,
          which is what closed the drift gap.{" "}
          <TK>what is queried, and by whom</TK>
        </p>

        <h3>What I gave up</h3>
        <p>
          The honest trade-offs: an engine to operate, coupling to its
          programming model, and state machines that are harder to debug than a
          script with a log. <TK>the one that has actually hurt</TK>
        </p>
      </Section>

      <Section
        index="04"
        eyebrow="RESULTS"
        title="What changed"
        aside={
          <Figure caption="Fig 5 — Before and after. Numbers, not adjectives.">
            <div className="prose max-w-none bg-page px-5 py-4">
              <table>
                <thead>
                  <tr>
                    <th>Measure</th>
                    <th>Before</th>
                    <th>After</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Time to provision</td>
                    <td>TK</td>
                    <td>TK</td>
                  </tr>
                  <tr>
                    <td>Manual touch points</td>
                    <td>TK</td>
                    <td>TK</td>
                  </tr>
                  <tr>
                    <td>Drift incidents / quarter</td>
                    <td>TK</td>
                    <td>TK</td>
                  </tr>
                  <tr>
                    <td>Cleanup after a failed run</td>
                    <td>TK</td>
                    <td>TK</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Figure>
        }
      >
        <p>
          Lead with the number that matters most.{" "}
          <TK>before → after, stated plainly</TK>
        </p>

        <h3>What it unlocked</h3>
        <p>
          The second-order effects — what became possible once provisioning ran
          unattended and recorded itself.{" "}
          <TK>the thing nobody asked for that fell out of it</TK>
        </p>

        <h3>What is still open</h3>
        <p>
          The gaps the redesign did not close, and what I would do next.{" "}
          <TK>the honest remainder</TK>
        </p>
      </Section>

      <SiteFooter />
    </div>
  );
}
