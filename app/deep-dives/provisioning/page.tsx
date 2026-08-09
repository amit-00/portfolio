import type { Metadata } from "next";
import type { ReactNode } from "react";
import { TopBar } from "@/components/relay/top-bar";
import { SiteFooter } from "@/components/relay/site-footer";
import { SectionLabel } from "@/components/relay/section-label";
import { Figure } from "@/components/relay/figure";

// Unlinked draft: keep it out of the index until it is finished and linked.
export const metadata: Metadata = {
  title: "One config, four ways to deploy it",
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
      <span className="bg-page px-3 py-1 text-center font-mono text-label-sm uppercase text-ink-5">
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
          deep dive · data platform · <TK>date</TK> · <TK>read time</TK>
        </div>
        <h1 className="mt-3 max-w-[22ch] font-mono text-display font-bold text-ink-1">
          One config, four ways to deploy it
        </h1>
        <p className="mt-4 max-w-[62ch] text-lead leading-[1.6] text-ink-3">
          A data platform had already unified how teams described what they
          wanted. It had not unified what happened next. Four services still
          reached production four different ways, every deployment went through
          a privileged user on a locked-down VM, and a failure stopped wherever
          it hit. This is how provisioning became a single transaction.
        </p>
      </header>

      <Section
        index="01"
        eyebrow="THE PLATFORM"
        title="A data product needed all four"
        aside={
          <Figure caption="Fig 1 — Where each capability sits on a data product's path from source system to consumer.">
            <DiagramSlot label="platform / four capabilities" />
          </Figure>
        }
      >
        <p>
          The platform sat between source systems and the business. It moved
          data onto Databricks, transformed it, and controlled who was allowed
          to see what. Four capabilities did that work, and a data team
          typically needed all four at once.
        </p>
        <p>
          <strong>Orchestration</strong> ran a team&apos;s ingestion and their
          Databricks ETL to a schedule. A team declared which jobs to run, when
          to run them, and where data was produced and consumed.
        </p>
        <p>
          <strong>Ingestion</strong> landed data onto Databricks from a
          team&apos;s source systems, through Azure Data Factory. A team
          declared the source and where it should land.
        </p>
        <p>
          <strong>VBAC</strong> — view-based access control — kept regulated
          data away from users with no authorization to see it. A team declared
          which data was sensitive.
        </p>
        <p>
          <strong>Consumption</strong> deployed the Databricks jobs and the
          resources they need to read the finished data. A team supplied a
          Databricks Asset Bundle describing them.
        </p>
      </Section>

      <Section
        index="02"
        eyebrow="THE NEED"
        title="Teams think in data products, not services"
        aside={
          <div className="border border-rule bg-page px-5 py-4">
            <div className="font-mono text-label-sm uppercase text-ink-5">
              What a team needs
            </div>
            <ol className="prose mt-3 max-w-none list-decimal pl-5 text-small">
              <li>Describe the data product once, in their own terms.</li>
              <li>Get the same product in every environment.</li>
              <li>Change it safely, for as long as it lives.</li>
              <li>Do it themselves, without waiting on anyone.</li>
              <li>
                Know whether it worked — and if not, what state it is in.
              </li>
            </ol>
          </div>
        }
      >
        <p>
          A team that owns a data product already knows what it is. Where the
          data comes from, what has to run and when, which fields are
          regulated, who reads the result. That knowledge is the whole of what
          they want to say.
        </p>
        <p>
          What has to exist for it to be real is a different list: an
          orchestration app, ingestion configuration, masking rules, and a set
          of Databricks jobs — four services, each with its own resources, in
          every environment the product lives in. Nobody on the owning team
          wants to think in those terms, and there is no reason they should have
          to. Provisioning is the translation between the two lists, and the
          rest of this section is what a team needs from it.
        </p>

        <h3>The same product, in every environment</h3>
        <p>
          A data product is not built once. It exists in development, then test,
          then production, and it should be the same product in each — same
          sources, same schedule, same masking, with only the environment
          differing. Moving it forward should not mean building it again.
        </p>

        <h3>It never stops changing</h3>
        <p>
          A source gets added. A schedule moves. A column becomes regulated.
          Provisioning is not a first-day activity, it is the mechanism a team
          reaches for over the whole life of the product — which means it has to
          be cheap to run again, and safe to run when almost nothing has
          changed.
        </p>

        <h3>Nobody to wait on</h3>
        <p>
          Hundreds of data products across tens of teams means no central group
          can be in the loop for every change without becoming the bottleneck
          for all of it. A team needs to provision on its own schedule.
        </p>

        <h3>An answer they can act on</h3>
        <p>
          When it works, a team needs to know it worked. When it does not, they
          need to know what stopped, why, and what state their product is now in
          — without first having to learn which of the four services was
          involved. A half-finished product they cannot see into is worse than a
          failure they can read.
        </p>
      </Section>

      <Section
        index="03"
        eyebrow="PROBLEM"
        title="A deployment stopped wherever it broke"
        aside={
          <>
            <Figure caption="Fig 2 — One configuration language described all four services. Each one still reached production its own way.">
              <div className="prose max-w-none bg-page px-5 py-4">
                <table>
                  <thead>
                    <tr>
                      <th>Service</th>
                      <th>How it reached production</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Orchestration</td>
                      <td>
                        A standalone <code>Function App</code> per data product
                      </td>
                    </tr>
                    <tr>
                      <td>Ingestion</td>
                      <td>
                        A Databricks workflow wrote a config row into the
                        service database
                      </td>
                    </tr>
                    <tr>
                      <td>VBAC</td>
                      <td>
                        A Databricks workflow wrote a config row into the
                        service database
                      </td>
                    </tr>
                    <tr>
                      <td>Consumption</td>
                      <td>Asset Bundles, from a CLI on a privileged VM</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Figure>
            <Figure caption="Fig 3 — The sequence, and what a failure in step three leaves standing behind it.">
              <DiagramSlot label="before / sequential deploy, partial failure" />
            </Figure>
            <div className="border border-rule bg-page px-5 py-4">
              <div className="font-mono text-label-sm uppercase text-ink-5">
                Requirements for the redesign
              </div>
              <ol className="prose mt-3 max-w-none list-decimal pl-5 text-small">
                <li>A deployment either fully lands or leaves nothing behind.</li>
                <li>No privileged human on the path of a routine deployment.</li>
                <li>One place to watch a deployment and see why it failed.</li>
                <li>
                  Services own their own config schema, checked before deploy.
                </li>
                <li>Promotion between environments uses the same mechanism.</li>
              </ol>
            </div>
          </>
        }
      >
        <h3>The config was already consolidated</h3>
        <p>
          A team described all four in one file: a{" "}
          <strong>declarative data product</strong>, or DDP, written in{" "}
          <code>HOCON</code>. One document said what to ingest, what to
          orchestrate, what to mask, and what to run. That consolidation was
          deliberate, and it worked — as a surface.
        </p>
        <p>
          Underneath it, nothing was consolidated at all. The DDP was parsed and
          then fanned out to four deployment paths that had nothing in common
          with each other: an app per data product for orchestration, rows
          written into service databases for ingestion and VBAC, and Asset
          Bundles for consumption. One language in, four mechanisms out.
        </p>

        <h3>How a deployment actually ran</h3>
        <p>
          Security requirements put the entry point on a locked-down VM, so
          every deployment started with a person who had access to it:
        </p>
        <ol>
          <li>A privileged user signs in to the VM.</li>
          <li>
            They run the deployment CLI against a target environment, passing
            the team&apos;s DDP.
          </li>
          <li>
            The CLI parses and validates the config, and stops on a validation
            error.
          </li>
          <li>
            It then deploys each component in sequence: orchestration, then the
            Databricks resources, then VBAC, then ingestion.
          </li>
        </ol>
        <p>
          Step four is where the design shows. The four deployments ran one
          after another with nothing tying them together, and four problems came
          out of that — worth separating, because the redesign had to answer all
          four and most of the obvious fixes only answer one.
        </p>

        <h3>A failure left the system half-built</h3>
        <p>
          Components deployed in sequence with no shared transaction. If VBAC
          failed, orchestration and the Databricks resources stayed deployed and
          ingestion never ran. The platform was now in a state no config
          described: partly the old data product, partly the new one. Recovering
          meant working out by hand which of the four had landed.{" "}
          <TK>what recovery actually involved</TK>
        </p>

        <h3>Every deployment needed a person who had to be free</h3>
        <p>
          Security requirements put the CLI on a VM only privileged users could
          reach, which made one of them a dependency of every deployment — not
          to approve anything, just to be the hands. A team could not deploy
          their own data product, and a misconfiguration meant finding that
          person again and going back around the whole loop. Promoting through
          environments repeated the trip each time.{" "}
          <TK>how long a full provision took end to end</TK>
        </p>

        <h3>Nowhere to look when it broke</h3>
        <p>
          Each service logged into its own place. Nothing joined a
          user&apos;s deployment to the four sets of telemetry it produced, so
          support staff answering &quot;why did this fail&quot; had to know the
          platform&apos;s internals well enough to guess which of the four to
          open first. There was no single view of one deployment.
        </p>

        <h3>The config drifted from the services it configured</h3>
        <p>
          The DDP schema was owned by the team maintaining the config language,
          not by the services it described. Any service that wanted a new option
          had to coordinate a schema change with that team. When the two got out
          of step, a config that parsed cleanly would still fail at deploy time
          against a service that did not understand it — a class of failure that
          should have been caught at build time and instead surfaced in an
          environment.
        </p>

        <h3>What the redesign had to do</h3>
        <p>
          The requirements in the gutter fall directly out of these four. Every
          alternative in the next section is scored against them.
        </p>
      </Section>

      <Section
        index="04"
        eyebrow="APPROACH"
        title="Declarative IaC, built rather than adopted"
        aside={
          <Figure caption="Fig 4 — The options scored against the requirements from 03. Adopting an engine converges after a partial failure rather than unwinding it.">
            <div className="prose max-w-none bg-page px-5 py-4">
              <table>
                <thead>
                  <tr>
                    <th>Option</th>
                    <th>Partial failure</th>
                    <th>Schema drift</th>
                    <th>Cost to get there</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>IaC, adopted</td>
                    <td>converges</td>
                    <td>no</td>
                    <td>TK</td>
                  </tr>
                  <tr>
                    <td>IaC, built</td>
                    <td>yes</td>
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
          The requirements pointed at one shape: declare the desired state in
          one document, let something else make it true, and treat the attempt
          as a single unit of work. That is declarative infrastructure as code,
          and the platform had spent its previous attempt on the document rather
          than on what happened after it. Choosing the model was easy. What
          implemented it was the decision worth defending.
        </p>

        <p>
          Terraform and Pulumi hand you a dependency graph, a plan and real
          state for free, and &quot;we wrote our own&quot; is usually the wrong
          answer. Two things pushed the other way. Only half the system looks
          like infrastructure — ingestion and VBAC are config rows, so a
          provider was ours to write regardless, in another language on another
          release cycle. And the resource set was closed: four known component
          types, never arbitrary infrastructure, so the plugin protocol,
          provider registry and general type system were all generality the
          platform would pay for and never use.{" "}
          <TK>the state-management question, and how the engine answers it</TK>
        </p>
        <p>
          The third reason is delivery. The team already owned the DDP parser
          and the CLI, and extending code you own beats introducing a tool, a
          state backend and a runner identity into an environment whose entry
          point was a locked-down VM. <TK>the constraint, stated concretely</TK>
        </p>
      </Section>

      <Section
        index="05"
        eyebrow="DESIGN"
        title="An engine for exactly four resources"
        aside={
          <>
            <Figure caption="Fig 5 — A deployment as one workflow: four steps, each with the undo it owns.">
              <DiagramSlot label="after / workflow + compensation" />
            </Figure>
            <Figure caption="Fig 6 — Each step is idempotent and names its own compensating action.">
              <div className="prose max-w-none">
                <pre>
                  <code>{`// TK — the real definition
deploy(ddp, env) {
  step("orchestration", apply, teardown)
  step("databricks",    apply, teardown)
  step("vbac",          apply, teardown)
  step("ingestion",     apply, teardown)
}`}</code>
                </pre>
              </div>
            </Figure>
          </>
        }
      >
        <p>
          The engine keeps the parts of the IaC model that were doing work and
          drops the parts that were not. A deployment is still declared, still
          planned before it runs, and still executed as one unit — but the
          resource set is fixed at four, so there is no plugin protocol, no
          provider registry, and no general-purpose type system underneath it.{" "}
          <TK>what the engine actually is: language, runtime, where it runs</TK>
        </p>

        <h3>A deployment is one unit of work</h3>
        <p>
          The four components stayed four steps, but the engine owns the
          sequence rather than a shell script running them in order. It can
          retry a step, resume after a crash, and unwind everything already done
          when a later step fails — which is the requirement nothing else met,
          because four unlike systems have no reason to agree on a transaction
          protocol of their own. <TK>the execution model, concretely</TK>
        </p>

        <h3>The step contract</h3>
        <p>
          Each step is idempotent under a stable key and names its own
          compensating action, so a retry is safe and an abort unwinds cleanly.{" "}
          <TK>how keys are derived; what teardown means for a config row</TK>
        </p>

        <h3>Services own their own schema</h3>
        <p>
          How the config contract moved to the services, so a schema and the
          behaviour behind it can no longer drift apart.{" "}
          <TK>the mechanism, and whether HOCON survived</TK>
        </p>

        <h3>One deployment, one trace</h3>
        <p>
          Workflow history became the single view support had been missing —
          every step of a deployment, its inputs, and where it stopped, in one
          place. <TK>what support actually opens now</TK>
        </p>

        <h3>What I gave up</h3>
        <p>
          The honest trade-offs: an engine to operate, coupling to its
          programming model, and a state machine that is harder to read than a
          script with a log. <TK>the one that has actually hurt</TK>
        </p>
      </Section>

      <Section
        index="06"
        eyebrow="RESULTS"
        title="What changed"
        aside={
          <Figure caption="Fig 7 — Before and after. Numbers, not adjectives.">
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
                    <td>Time to provision a data product</td>
                    <td>TK</td>
                    <td>TK</td>
                  </tr>
                  <tr>
                    <td>Privileged users on the path</td>
                    <td>1 per deploy</td>
                    <td>TK</td>
                  </tr>
                  <tr>
                    <td>Deployments a team can run itself</td>
                    <td>none</td>
                    <td>TK</td>
                  </tr>
                  <tr>
                    <td>Half-deployed states per quarter</td>
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
          The second-order effects — what became possible once a deployment ran
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
