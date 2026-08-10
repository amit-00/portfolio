import type { Metadata } from "next";
import type { ReactNode } from "react";
import { TopBar } from "@/components/relay/top-bar";
import { SiteFooter } from "@/components/relay/site-footer";
import { SectionLabel } from "@/components/relay/section-label";
import { Figure } from "@/components/relay/figure";

// Unlinked draft: keep it out of the index until it is finished and linked.
export const metadata: Metadata = {
  title: "One document, four deployments",
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
          One document, four deployments
        </h1>
        <p className="mt-4 max-w-[62ch] text-lead leading-[1.6] text-ink-3">
          A data platform let teams describe a data product in one document. But
          the platform did not deploy that product as one unit. Each of the four
          services used a different deployment mechanism. A team also waited
          several days for permission to start a deployment. If one component
          failed, the components before it stayed deployed. This article
          describes that system, its gaps, and the engine that replaced it.
        </p>
      </header>

      <Section
        index="01"
        eyebrow="THE PLATFORM"
        title="A data product used all four services"
        aside={
          <Figure caption="Fig 1 — The position of each service on the path from the source system to the consumer.">
            <DiagramSlot label="platform / four services" />
          </Figure>
        }
      >
        <p>
          The platform connected source systems to the business. It moved data
          to Databricks, changed the data, and controlled which users could see
          it. Four services did this work, and a data team usually needed all
          four.
        </p>
        <p>
          <strong>Orchestration</strong> ran the ingestion jobs and the
          Databricks ETL jobs on a schedule. A team specified which jobs to run,
          the schedule for each job, and the location of the input and output
          data.
        </p>
        <p>
          <strong>Ingestion</strong> moved data from the source systems to
          Databricks with Azure Data Factory. A team specified the source and
          the destination.
        </p>
        <p>
          <strong>VBAC</strong> (view-based access control) prevented access to
          regulated data. Users without authorization could not see this data. A
          team specified which data was sensitive.
        </p>
        <p>
          <strong>Consumption</strong> deployed the Databricks jobs that read
          the completed data, and the resources for those jobs. A team supplied
          a Databricks Asset Bundle.
        </p>
      </Section>

      <Section
        index="02"
        eyebrow="THE NEED"
        title="A team thinks about the product, not the services"
        aside={
          <div className="border border-rule bg-page px-5 py-4">
            <div className="font-mono text-label-sm uppercase text-ink-5">
              What a team must be able to do
            </div>
            <ol className="prose mt-3 max-w-none list-decimal pl-5 text-small">
              <li>Describe the data product one time.</li>
              <li>Deploy the same product to each environment.</li>
              <li>Change the product safely for its full life.</li>
              <li>Deploy without help from another person.</li>
              <li>Know the result, and the condition of the product.</li>
            </ol>
          </div>
        }
      >
        <p>
          The team that owns a data product knows the details of that product.
          It knows the source of the data, the jobs and their schedules, the
          regulated fields, and the users who read the result. But the platform
          needs a different list: an orchestration app, an ingestion
          configuration, masking rules, and Databricks jobs. It needs this list
          for each environment. Provisioning converts the first list into the
          second list.
        </p>

        <h3>The product must exist in each environment</h3>
        <p>
          A data product exists in development, then in test, then in
          production. A team must not build the product again for each
          environment.
        </p>

        <h3>The product changes after the first deployment</h3>
        <p>
          A team adds a source. A team changes a schedule. A column becomes
          regulated. Provisioning continues for the full life of the product. It
          must be easy to repeat, and safe when almost nothing changed.
        </p>

        <h3>A team must not wait for another person</h3>
        <p>
          The platform has hundreds of data products and tens of teams. If one
          central group must approve each change, that group delays all of the
          teams.
        </p>

        <h3>The team must know the result</h3>
        <p>
          If a deployment fails, the team must know which step stopped, the
          cause, and the condition of the product. The team must not first find
          which of the four services caused the failure.
        </p>
      </Section>

      <Section
        index="03"
        eyebrow="WHAT I INHERITED"
        title="From one document to four components"
        aside={
          <>
            <Figure caption="Fig 2 — The deployment mechanism for each of the four components.">
              <div className="prose max-w-none bg-page px-5 py-4">
                <table>
                  <thead>
                    <tr>
                      <th>Service</th>
                      <th>Deployment mechanism</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Orchestration</td>
                      <td>An ARM template, sent to the Azure API</td>
                    </tr>
                    <tr>
                      <td>Consumption</td>
                      <td>An Asset Bundle, sent with the Databricks CLI</td>
                    </tr>
                    <tr>
                      <td>VBAC</td>
                      <td>
                        A Databricks workflow wrote a row into the service
                        database
                      </td>
                    </tr>
                    <tr>
                      <td>Ingestion</td>
                      <td>
                        A Databricks workflow wrote a row into the service
                        database
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Figure>
            <Figure caption="Fig 3 — The deployment sequence, from the CLI to the four components.">
              <DiagramSlot label="existing / deployment sequence" />
            </Figure>
          </>
        }
      >
        <p>
          Provisioning already existed when I started the project. A team
          described a data product in one file. This file is a{" "}
          <strong>declarative data product</strong>, or DDP. It specified the
          data to ingest, the jobs to orchestrate, the data to mask, and the
          jobs to run. A CLI converted the DDP into deployed infrastructure.
        </p>

        <h3>How a team deployed a data product</h3>
        <p>
          Security requirements kept the CLI on a restricted VM. Each deployment
          ran from that VM.
        </p>
        <ol>
          <li>The user signs in to the VM.</li>
          <li>
            The user runs the CLI for the target environment and supplies the
            DDP.
          </li>
          <li>The CLI reads the DDP and validates it. The CLI stops if it finds an error.</li>
          <li>
            The CLI deploys each component in sequence: orchestration,
            consumption, VBAC, then ingestion.
          </li>
        </ol>

        <h3>What each step did</h3>
        <p>
          Each service read its configuration from a different location. Thus
          the four steps used four different mechanisms.
        </p>
        <ul>
          <li>
            <strong>Orchestration</strong> — the CLI sent an ARM template to the
            Azure API. This template created a <code>Function App</code> for
            that data product. The Function App contained the schedule and the
            job definitions.
          </li>
          <li>
            <strong>Consumption</strong> — the CLI deployed an Asset Bundle with
            the Databricks CLI.
          </li>
          <li>
            <strong>VBAC</strong> and <strong>ingestion</strong> — a Databricks
            workflow wrote the configuration into the database of each service.
            Each service then read its configuration from that database.
          </li>
        </ul>
        <p>Each service then operated on its own schedule.</p>
      </Section>

      <Section
        index="04"
        eyebrow="THE GAP"
        title="The system met one need of five"
        aside={
          <>
            <Figure caption="Fig 4 — The components that stay deployed after a failure at step three.">
              <DiagramSlot label="existing / partial failure" />
            </Figure>
            <Figure caption="Fig 5 — The five needs from 02 and the result from the existing process.">
              <div className="prose max-w-none bg-page px-5 py-4">
                <table>
                  <thead>
                    <tr>
                      <th>What a team needs</th>
                      <th>What the system gave</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Describe it one time</td>
                      <td>Met — one DDP described all four services</td>
                    </tr>
                    <tr>
                      <td>The same product in each environment</td>
                      <td>One manual process for each environment</td>
                    </tr>
                    <tr>
                      <td>Change the product safely</td>
                      <td>A failure left an unknown condition</td>
                    </tr>
                    <tr>
                      <td>No wait for another person</td>
                      <td>A ticket and an approval of several days</td>
                    </tr>
                    <tr>
                      <td>Know the result</td>
                      <td>Four sets of logs and no single record</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Figure>
          </>
        }
      >
        <p>
          The system met the first need. It did not meet the other four.
        </p>

        <h3>The four components were not one deployment</h3>
        <p>
          The components ran in sequence, but no transaction contained them. If
          VBAC failed, orchestration and consumption stayed deployed, and
          ingestion did not run. The result was a data product that no DDP
          described. The system kept no record of which components it deployed.{" "}
          <TK>what recovery actually involved</TK>
        </p>

        <h3>A team needed approval to use the VM</h3>
        <p>
          To run the CLI, a user needed access to the VM. To receive that
          access, the user submitted a ticket and waited for approval. This
          approval took several days. The deployment itself was quick, but the
          wait for permission was not.{" "}
          <TK>whether a user received access one time or per window</TK>
        </p>

        <h3>No single record of a deployment</h3>
        <p>
          Each of the four services wrote its own logs. No record connected
          these logs to the deployment that caused them. To find the cause of a
          failure, a person had to know which service to examine first. Usually
          only the platform team knew this.
        </p>

        <h3>No team owned the DDP schema</h3>
        <p>
          The team that maintained the config language owned the DDP schema. The
          services that used the schema did not own it. When the schema and a
          service became different, a valid DDP failed at deployment. A build
          step could find this error, but it occurred in an environment.
        </p>
      </Section>

      <Section
        index="05"
        eyebrow="THE ENGINE"
        title="The engine calls one interface for each service"
        aside={
          <>
            <Figure caption="Fig 6 — The engine calls the same four operations on each service API.">
              <DiagramSlot label="engine / one interface, four services" />
            </Figure>
            <Figure caption="Fig 7 — The interface each service supplies.">
              <div className="prose max-w-none">
                <pre>
                  <code>{`// TK — the real interface
interface ServiceApi {
  validate(spec, env)  // report the errors in this part of the DDP
  plan(spec, env)      // report the changes to make
  deploy(spec, env)    // make the changes
  destroy(spec, env)   // remove what deploy made
}`}</code>
                </pre>
              </div>
            </Figure>
          </>
        }
      >
        <p>
          The engine deploys nothing itself. Each service supplies an API, and
          the engine calls that API. The API has the same four operations for
          every service.
        </p>
        <ul>
          <li>
            <strong>Validate</strong> — the service reports the errors in its
            part of the DDP.
          </li>
          <li>
            <strong>Plan</strong> — the service reports the changes that it will
            make.
          </li>
          <li>
            <strong>Deploy</strong> — the service makes those changes.
          </li>
          <li>
            <strong>Destroy</strong> — the service removes what deploy made.
          </li>
        </ul>
        <p>
          The engine reads the DDP. For each component, the engine calls the API
          of that service. The engine controls the sequence and records the
          result. It contains no deployment logic for any service.{" "}
          <TK>whether the engine plans all services before it deploys any</TK>
        </p>

        <h3>A new service does not change the engine</h3>
        <p>
          A team can add a service to the platform. That service supplies the
          same four operations. The engine then deploys it. The engine needs no
          change. <TK>whether a service was added after the first release</TK>
        </p>

        <h3>Each service owns its own rules</h3>
        <p>
          A service validates its own part of the DDP. It also selects how to
          deploy its resources. If a service changes its deployment method, that
          change stays behind the API. The engine does not see it.
        </p>
        <p>
          This also closes the schema problem from section 04. The team that
          owns a service now owns the validation for that service.{" "}
          <TK>whether the DDP schema itself also moved to the services</TK>
        </p>
      </Section>

      <Section
        index="06"
        eyebrow="FAILURE"
        title="What happens when a step fails"
        aside={
          <Figure caption="Fig 8 — The compensating action for each resource type.">
            <DiagramSlot label="engine / retry and compensation" />
          </Figure>
        }
      >
        <p>
          Destroy is the fourth operation for a reason. If a deployment stops
          part of the way, the engine can call destroy on each service that
          already deployed. <TK>whether the engine does this, or stops</TK>
        </p>

        <h3>A step can run more than one time</h3>
        <p>
          <TK>
            whether deploy is idempotent, and how a service recognises a repeat
          </TK>
        </p>

        <h3>What destroy does for each service</h3>
        <p>
          <TK>
            what destroy removes for the ARM template, the Asset Bundle, and the
            config rows
          </TK>
        </p>

        <h3>Destroy does not reverse every effect</h3>
        <p>
          A service can remove what it deployed. It cannot always reverse what
          that deployment caused. <TK>which services have this limit</TK>
        </p>
      </Section>

      <Section
        index="07"
        eyebrow="ENTRY POINT"
        title="A team starts a deployment from GitHub Actions"
        aside={
          <Figure caption="Fig 9 — The path from a GitHub Actions workflow to the engine on the VM.">
            <DiagramSlot label="after / entry point" />
          </Figure>
        }
      >
        <p>
          GitHub Actions replaced the VM as the entry point for a team. The
          engine still runs on the VM. Credentials in the workflow give the
          pipeline the access that a person needed before.{" "}
          <TK>the exact path from the workflow to the engine</TK>
        </p>

        <h3>The engine resolves the environment</h3>
        <p>
          <TK>
            how a DDP separates the values that are fixed from the values that
            change per environment
          </TK>
        </p>

        <h3>One deployment, one record</h3>
        <p>
          <TK>what a person opens now to see why a deployment failed</TK>
        </p>
      </Section>

      <Section
        index="08"
        eyebrow="COST"
        title="What this design gave up"
        aside={
          <div className="border border-rule bg-page px-5 py-4">
            <div className="font-mono text-label-sm uppercase text-ink-5">
              Known limits
            </div>
            <ul className="prose mt-3 max-w-none list-disc pl-5 text-small">
              <li>One small group maintains the engine.</li>
              <li>Teardown does not reverse every effect.</li>
              <li>
                <TK>whether the engine detects drift</TK>
              </li>
            </ul>
          </div>
        }
      >
        <p>
          <TK>the trade-offs, stated before a reader can find them</TK>
        </p>

        <h3>A small group owns the engine</h3>
        <p>
          Hundreds of data products depend on an engine that one engineer wrote.{" "}
          <TK>who maintains it now, and what the team did about this</TK>
        </p>

        <h3>What is still open</h3>
        <p>
          <TK>the gaps this design did not close</TK>
        </p>
      </Section>

      <Section
        index="09"
        eyebrow="RESULTS"
        title="What changed"
        aside={
          <Figure caption="Fig 10 — Before and after. Numbers, not adjectives.">
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
                    <td>Wait before a first deployment</td>
                    <td>Days — ticket and approval</td>
                    <td>TK</td>
                  </tr>
                  <tr>
                    <td>Deployments a team can run itself</td>
                    <td>None</td>
                    <td>TK</td>
                  </tr>
                  <tr>
                    <td>Places to look when one fails</td>
                    <td>4</td>
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
      </Section>

      <SiteFooter />
    </div>
  );
}
