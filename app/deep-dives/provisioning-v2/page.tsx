import type { Metadata } from "next";
import Image from "next/image";
import type { ReactNode } from "react";
import { Figure } from "@/components/relay/figure";
import { SectionLabel } from "@/components/relay/section-label";
import { SiteFooter } from "@/components/relay/site-footer";
import { TopBar } from "@/components/relay/top-bar";

export const metadata: Metadata = {
  title: "Rebuilding provisioning for a data platform — v2",
  robots: { index: false, follow: false },
};

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
  aside?: ReactNode;
}): ReactNode {
  return (
    <section
      className={`grid border-b border-rule ${aside ? "lg:grid-cols-2" : ""}`}
    >
      <div
        className={`min-w-0 px-gutter py-section ${aside ? "lg:border-r lg:border-rule" : ""}`}
      >
        <SectionLabel index={index}>{eyebrow}</SectionLabel>
        <h2 className="mt-3 max-w-[24ch] font-mono text-h2 font-bold text-ink-1">
          {title}
        </h2>
        <div className="prose mt-4">{children}</div>
      </div>
      {aside && (
        <div className="flex min-w-0 flex-col gap-6 bg-sunken px-gutter py-section">
          {aside}
        </div>
      )}
    </section>
  );
}

function ImageSlot({ label }: { label: string }): ReactNode {
  return (
    <div
      className="flex min-h-[260px] items-center justify-center p-6"
      style={{
        backgroundImage:
          "repeating-linear-gradient(135deg, var(--color-sunken) 0 6px, var(--color-page) 6px 12px)",
      }}
    >
      <span className="border border-rule bg-page px-3 py-2 font-mono text-label-sm text-ink-5">
        {label}
      </span>
    </div>
  );
}

const deployOnlyContract = `interface ServiceDeploymentApi {
  deploy(request: DeployRequest): DeployResult;
}`;

const finalContract = `interface DeploymentRequest {
  deploymentId: string;
  productId: string;
  environment: "dev" | "test" | "prod";
  packageUri: string;
  packageDigest: string;
}

interface ServiceProvisioningApi {
  validate(request: DeploymentRequest): ValidationResult;
  plan(request: DeploymentRequest): PlanResult;
  deploy(request: DeploymentRequest): OperationResult;
  compensate(request: DeploymentRequest): OperationResult;
}

interface ProvisioningApi {
  deploy(request: StartDeploymentRequest): AcceptedDeployment;
  getStatus(deploymentId: string): DeploymentStatus;
}`;

export default function ProvisioningDeepDive(): ReactNode {
  return (
    <div>
      <TopBar breadcrumb="deep-dives / provisioning" />

      <header className="border-b border-rule px-gutter py-section">
        <div className="font-mono text-label uppercase text-ink-5">
          deep dive · data platform
        </div>
        <h1 className="mt-3 max-w-[22ch] font-mono text-display font-bold text-ink-1">
          Rebuilding provisioning for a data platform
        </h1>
        <p className="mt-4 max-w-[62ch] text-lead leading-[1.6] text-ink-3">
          A centralized deployment application became a service-owned protocol,
          then a durable saga. The change happened one operation at a time:
          deploy, compensate, validate, and plan.
        </p>
      </header>

      <Section
        index="01"
        eyebrow="THE SYSTEM"
        title="One declaration had to deploy a complete data product"
      >
        <p>
          A declarative data product, or DDP, described a team&apos;s source,
          schedules, application code, regulated fields, and consumers. The
          platform had to turn that declaration into infrastructure, jobs,
          compute, runtime configuration, and access control in development,
          test, and production.
        </p>
        <p>
          Provisioning was not a one-time installer. Teams used it whenever a
          product added a source, changed a schedule, updated code, or changed
          who could read the data. One input had to produce a repeatable change
          across several independently operated services.
        </p>
      </Section>

      <Section
        index="02"
        eyebrow="STARTING POINT"
        title="The shared VM held every deployment rule"
        aside={
          <Figure caption="Fig 1 — The original user and deployment path.">
            <Image
              src="/provisioning/provisioning-original-vm-cli-path.png"
              alt="Original deployment path through shared Azure VM and CLI"
              width={1822}
              height={812}
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="h-auto w-full bg-page"
            />
          </Figure>
        }
      >
        <p>
          Before a team could deploy, a user requested access to a shared Azure
          VM. Approval took one or two business days. The user connected through
          SSH, ran a CLI, and supplied a JFrog Artifactory URL for a package
          containing the DDP configuration and application code.
        </p>
        <ol>
          <li>The CLI downloaded and validated the package.</li>
          <li>It applied infrastructure through an ARM template and Azure CLI.</li>
          <li>It deployed job definitions through an Asset Bundle.</li>
          <li>
            It started workflows that wrote runtime configuration into service
            databases.
          </li>
        </ol>
        <p>
          The application ran these steps sequentially and blocked until they
          finished. It contained the deployment details for every service, so a
          service change also became a change to the central CLI.
        </p>
      </Section>

      <Section
        index="03"
        eyebrow="FIRST CHANGE"
        title="Deploy moved behind service-owned APIs"
        aside={
          <Figure caption="Fig 2 — Before and after deployment moved behind a service-owned API.">
            <div className="divide-y divide-rule bg-page">
              <div className="px-3 py-2 font-mono text-label-sm uppercase text-ink-5">
                Before
              </div>
              <Image
                src="/provisioning/provisioning-service-owned-apis-before.png"
                alt="Service deployment logic before service-owned APIs"
                width={876}
                height={720}
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="h-auto w-full"
              />
              <div className="px-3 py-2 font-mono text-label-sm uppercase text-ink-5">
                After
              </div>
              <Image
                src="/provisioning/provisioning-service-owned-apis-after.png"
                alt="Service deployment logic after moving behind a service-owned API"
                width={910}
                height={960}
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="h-auto w-full"
              />
            </div>
          </Figure>
        }
      >
        <p>
          The first change did not attempt to solve validation, rollback, or
          planning. It moved only the deployment logic. Each service team added
          a deployment application and exposed one common <code>/deploy</code>
          endpoint. The provisioning application called that API instead of
          applying the service&apos;s mechanism itself.
        </p>
        <pre>
          <code>{deployOnlyContract}</code>
        </pre>
        <p>
          The boundary was more important than the first interface. A service
          could keep using ARM, Asset Bundles, a database workflow, or replace
          that implementation later. The provisioning application no longer
          needed to know how the service produced its resources.
        </p>
      </Section>

      <Section
        index="04"
        eyebrow="NEW BOUNDARY"
        title="The provisioning app became an orchestrator"
        aside={
          <Figure caption="Fig 3 — The system after deployment moved behind service APIs.">
            <Image
              src="/provisioning/provisioning-vm-cli-path-with-service-apis.png"
              alt="Shared VM provisioning path calling service-owned deployment APIs"
              width={1850}
              height={812}
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="h-auto w-full bg-page"
            />
          </Figure>
        }
      >
        <p>
          The provisioning application now translated one product request into
          a sequence of service API calls. The service applications owned their
          schemas, infrastructure permissions, deployment tools, and outcomes.
          The provisioning team owned the order of work and the contract between
          them.
        </p>
        <p>
          Adding a service no longer required embedding another deployment
          mechanism in the central application. The service implemented the
          protocol, registered with provisioning, and remained free to change
          everything behind that boundary.
        </p>
      </Section>

      <Section
        index="05"
        eyebrow="DURABLE ORCHESTRATION"
        title="Durable Functions preserve progress between steps"
        aside={
          <Figure caption="Fig 4 — Durable history rebuilds orchestration state after interruption.">
            <Image
              src="/provisioning/provisioning-azure-durable-functions-infra.png"
              alt="Azure Durable Functions runtime and storage infrastructure"
              width={1344}
              height={782}
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="h-auto w-full bg-page"
            />
          </Figure>
        }
      >
        <p>
          Azure Durable Functions adds stateful orchestration to Azure
          Functions. An orchestrator schedules activity functions, waits for
          their results, and records that history in durable storage. It can
          unload while it waits and replay the recorded history when new work
          arrives or a host restarts.
        </p>
        <p>
          Replay rebuilds the orchestrator&apos;s local state; it is not a reason
          to repeat completed side effects by itself. The orchestrator must be
          deterministic, while activities perform the network and service API
          calls. That division made a long-running deployment resumable without
          a process or VM staying alive for the full run.
        </p>
      </Section>

      <Section
        index="06"
        eyebrow="DEPLOYMENT EXECUTION"
        title="At-least-once activities need idempotent deploys"
        aside={
          <Figure caption="Fig 5 — A deployment continues from persisted orchestration history.">
            <Image
              src="/provisioning/provisioning-durable-deployment.png"
              alt="Durable deployment service calling service applications with staged configuration"
              width={1596}
              height={720}
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="h-auto w-full bg-page"
            />
          </Figure>
        }
      >
        <p>
          A deployment starts one Durable orchestration with a new, immutable
          <code>deploymentId</code>. The orchestrator calls a deployment activity
          for each service and records each result. The first release keeps the
          calls sequential for simple progress reporting and recovery, not
          because the services have deployment dependencies.
        </p>
        <h3>At-least-once is not exactly once</h3>
        <p>
          Durable activity functions have an at-least-once execution guarantee.
          If an activity finishes but the runtime cannot record its result before
          a crash, the activity can run again. Durable Functions guarantees that
          the work is attempted; it cannot guarantee that an external side effect
          happened only once.
        </p>
        <p>
          Every service therefore uses the deployment ID as an idempotency key
          and persists its outcome. A repeated call returns the recorded result
          or safely continues the same operation instead of creating the work
          again. Delivery remains at least once, while the observable deployment
          has an effectively-once result where the service can enforce it.
        </p>
      </Section>

      <Section
        index="07"
        eyebrow="CONFIGURATION ACCESS"
        title="The package moves from Artifactory to Blob once"
        aside={
          <Figure caption="Fig 6 — Provisioning stages one package for all service applications.">
            <Image
              src="/provisioning/provisioning-artifactory-blob-staging.png"
              alt="Provisioning service staging a JFrog Artifactory package in Azure Blob Storage"
              width={906}
              height={724}
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="h-auto w-full bg-page"
            />
          </Figure>
        }
      >
        <p>
          Clients continued to submit the JFrog Artifactory URL they already
          used. Before the saga started, the provisioning service downloaded the
          package and staged it in Azure Blob Storage. The deployment request
          then carried the Blob URI rather than embedding the configuration or
          asking every service to download the source package independently.
        </p>
        <p>
          Each service application read only the configuration and code it
          needed from the staged package. Service identities received access to
          that package without putting secret values in the DDP or workflow
          logs. Every step in one deployment therefore read the same immutable
          input.
        </p>
      </Section>

      <Section
        index="08"
        eyebrow="COMPENSATION"
        title="Compensation reverses only what can be undone"
      >
        <p>
          Moving deploy behind an API made partial failure visible, but it did
          not repair it. The protocol next added <code>compensate</code>. When a
          later service failed, provisioning could ask each successful service
          to reverse the resources created or changed for that deployment ID.
        </p>
        <p>
          Compensation is not destroy. A service removes or restores only the
          work it can safely attribute to the failed deployment. In-place data
          mutations, destructive migrations, and external writes may require a
          forward fix instead. If compensation fails, the deployment reports
          <code>recovery-required</code> rather than claiming a clean rollback.
        </p>
      </Section>

      <Section
        index="09"
        eyebrow="SAGA AND STATUS"
        title="The saga records progress, failure, and recovery"
        aside={
          <Figure caption="Fig 7 — Forward deployment steps and reverse compensation steps.">
            <ImageSlot label="IMAGE SLOT — deployment saga and status path" />
          </Figure>
        }
      >
        <p>
          The Durable orchestrator implements a saga. It records each successful
          deployment step. If a later step fails, it calls compensation for the
          completed steps in reverse order and records every compensation result.
          Durable history preserves the saga&apos;s position across restarts.
        </p>
        <ol>
          <li>The client starts a deployment and receives its deployment ID.</li>
          <li>The orchestrator deploys each service and records the result.</li>
          <li>A failure starts compensation for completed services.</li>
          <li>The orchestration ends succeeded, compensated, or recovery-required.</li>
        </ol>
        <p>
          Status belongs to the provisioning boundary. The client calls
          <code>getStatus</code> with the deployment ID, and provisioning maps the
          Durable instance state and custom progress into one deployment record.
          GitHub Actions polls that endpoint and publishes the result in the
          workflow output.
        </p>
      </Section>

      <Section
        index="10"
        eyebrow="VALIDATION"
        title="Validation moved to the teams that own the rules"
        aside={
          <Figure caption="Fig 8 — Structural validation stays central; service rules move downstream.">
            <ImageSlot label="IMAGE SLOT — validation ownership before and after" />
          </Figure>
        }
      >
        <p>
          The original client already validated the DDP against a central schema.
          That caught missing and malformed fields, but the schema was maintained
          by the provisioning team while service behavior was maintained by
          separate teams. As services changed, the central schema could accept
          configuration a service rejected or reject configuration a service
          already supported.
        </p>
        <p>
          The protocol added <code>validate</code> to each service application.
          Product-level schema validation still checked the declaration&apos;s
          structure; provisioning then sent the staged package to each service
          for semantic validation. Client applications kept the same request and
          received one aggregated result, but the rules now lived with the code
          that enforced them.
        </p>
      </Section>

      <Section
        index="11"
        eyebrow="PLANNING"
        title="Plan makes the next change visible"
      >
        <p>
          Validation answers whether a service can accept a request. It does not
          tell the user what the service will change. The protocol added
          <code>plan</code> as a read-only operation that compares the desired
          package with the service&apos;s current state and reports the proposed
          creates, updates, replacements, and prerequisites.
        </p>
        <p>
          Each service owns its planning semantics, and provisioning aggregates
          the results into one product view. The engine does not need a universal
          infrastructure model or knowledge of service internals. Teams can see
          the blast radius before starting the saga, while deploy-time checks
          still protect conditions that can change after planning.
        </p>
      </Section>

      <Section
        index="12"
        eyebrow="FINAL PROTOCOL"
        title="The protocol grew one operation at a time"
        aside={
          <Figure caption="Fig 9 — The final service and client-facing contracts.">
            <div className="prose max-w-none bg-page p-5">
              <pre>
                <code>{finalContract}</code>
              </pre>
            </div>
          </Figure>
        }
      >
        <p>
          The final protocol was not designed all at once. <code>deploy</code>
          first separated ownership. <code>compensate</code> made partial failure
          recoverable where services supported it. <code>validate</code> moved
          semantic rules to their owners, and <code>plan</code> exposed the next
          change before execution.
        </p>
        <p>
          Durable Functions supplies orchestration state and status at the
          provisioning boundary. The service contract stays focused on the work
          each service owns. This separation lets the orchestration change without
          teaching services about Durable Functions, and lets a service change
          its deployment mechanism without changing provisioning.
        </p>
      </Section>

      <Section
        index="13"
        eyebrow="RESULTS"
        title="Self-service changed the operating numbers"
        aside={
          <Figure caption="Fig 10 — Before and after the provisioning overhaul.">
            <div className="prose max-w-none bg-page p-5">
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
                    <td>Teams deploying per month</td>
                    <td>10</td>
                    <td>50</td>
                  </tr>
                  <tr>
                    <td>Deployments per month</td>
                    <td>35</td>
                    <td>300</td>
                  </tr>
                  <tr>
                    <td>Wait for deployment access</td>
                    <td>1–2 business days</td>
                    <td>None</td>
                  </tr>
                  <tr>
                    <td>Runs ending in a mixed state</td>
                    <td>12 per month</td>
                    <td>0</td>
                  </tr>
                  <tr>
                    <td>Effort to add a service</td>
                    <td>14 engineer-days</td>
                    <td>2 engineer-days</td>
                  </tr>
                  <tr>
                    <td>Engine changes per new service</td>
                    <td>Several</td>
                    <td>0</td>
                  </tr>
                  <tr>
                    <td>Peak queue time, p95</td>
                    <td>—</td>
                    <td>4 minutes</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Figure>
        }
      >
        <p>
          Teams deployed from their own GitHub Actions workflows instead of
          requesting access to a machine. The workflow staged the package,
          started the orchestration, and showed status and remediation alongside
          the rest of the run logs.
        </p>
        <p>
          A new service joined by implementing the shared protocol rather than by
          adding another branch to the deployment application. A failed run had
          one deployment record and one known recovery state instead of leaving a
          team to reconstruct partial progress across several systems.
        </p>
      </Section>

      <Section
        index="14"
        eyebrow="OWNERSHIP"
        title="The work moved with the ownership"
      >
        <p>
          I led the move from central deployment logic to the service protocol:
          defining the API boundary, implementing the Durable request and status
          flow, introducing idempotency and compensation semantics, and supporting
          service migrations.
        </p>
        <p>
          The overhaul did not eliminate deployment responsibility. It put each
          part with the team able to maintain it. The provisioning team operated
          the orchestrator, package staging, and shared contract. Service teams
          operated their APIs, deployment mechanisms, validation rules, plans,
          and compensation limits.
        </p>
      </Section>

      <SiteFooter />
    </div>
  );
}
