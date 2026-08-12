import type { Metadata } from "next";
import type { ReactNode } from "react";
import { TopBar } from "@/components/relay/top-bar";
import { SiteFooter } from "@/components/relay/site-footer";
import { SectionLabel } from "@/components/relay/section-label";
import { Figure } from "@/components/relay/figure";

// Unlinked draft: keep it out of the index until it is finished and linked.
export const metadata: Metadata = {
  title: "Rebuilding provisioning for a data platform",
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

/**
 * One movement of the argument: the claim on the left held to the prose measure,
 * the single artefact that backs it in the gutter to its right. A section with
 * no artefact runs as one column rather than leaving an empty gutter.
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

export default function ProvisioningDeepDive(): ReactNode {
  return (
    <div>
      <TopBar breadcrumb="deep-dives / provisioning" />

      <header className="border-b border-rule px-gutter py-section">
        <div className="font-mono text-label uppercase text-ink-5">
          deep dive · data platform · <TK>date</TK> · <TK>read time</TK>
        </div>
        <h1 className="mt-3 max-w-[22ch] font-mono text-display font-bold text-ink-1">
          Rebuilding provisioning for a data platform
        </h1>
        <p className="mt-4 max-w-[62ch] text-lead leading-[1.6] text-ink-3">
          A data platform let teams describe a data product in one set of files.
          But the platform did not deploy that product as one unit. Each service
          used a different deployment mechanism. Only a few approved users could
          start a deployment. If one component failed, the components before it
          stayed deployed. This article describes that system, its gaps, and the
          engine that replaced it.
        </p>
      </header>

      <Section
        index="01"
        eyebrow="THE PLATFORM"
        title="A data product used several services"
      >
        <p>
          The platform connected source systems to the business. Teams used it
          to build and to run data products.
        </p>
        <h3>What is a data product</h3>
        <p>
          A data product is one set of data that a team owns and supplies to
          other users. It contains the pipeline that makes the data, the data
          itself, the rules for access to it, and the jobs that read it. One
          team owns a data product for its full life.
        </p>
        <h3>What the platform supplied</h3>
        <p>
          The platform supplied a set of services for this work. A team usually
          used several of them together for one data product. These services
          included:
        </p>
        <ul>
          <li>Ingestion of data from a source system.</li>
          <li>Orchestration of jobs on a schedule.</li>
          <li>Access control over regulated fields.</li>
          <li>Compute for the jobs that read the finished data.</li>
        </ul>
        <p>
          These services were not the same shape. Some needed only
          configuration. Others needed infrastructure. For those services, the
          platform deployed the infrastructure and then installed the
          application code on it. That code came from the team, or from the
          platform itself.
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
          needs a different list: infrastructure, application code, job
          definitions and configuration. It needs this list for each
          environment. Provisioning converts the first list into the second
          list.
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
          which service caused the failure.
        </p>
      </Section>

      <Section
        index="03"
        eyebrow="WHAT I INHERITED"
        title="The process before the engine"
        aside={
          <Figure caption="Fig 1 — The deployment mechanism for each kind of component.">
            <div className="prose max-w-none bg-page px-5 py-4">
              <table>
                <thead>
                  <tr>
                    <th>What the CLI deployed</th>
                    <th>Mechanism</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Infrastructure, and the code for it</td>
                    <td>An ARM template, applied with the Azure CLI</td>
                  </tr>
                  <tr>
                    <td>Job definitions</td>
                    <td>An Asset Bundle</td>
                  </tr>
                  <tr>
                    <td>Runtime configuration</td>
                    <td>
                      A Databricks workflow wrote a row into the database of a
                      service
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Figure>
        }
      >
        <p>
          Provisioning already existed when I started the project. A team
          described a data product in a set of configuration files. Together
          these files are a <strong>declarative data product</strong>, or DDP. A
          CLI application converted the DDP into deployed infrastructure.
        </p>
        <p>
          The CLI was single-threaded, and it blocked until a deployment
          finished. It ran on an Azure VM that also ran other applications.
        </p>

        <h3>How a team deployed a data product</h3>
        <p>
          A user needed access to the VM before any of this. That access came
          through a ticket, with an approval of one or two business days. A user
          did this one time.
        </p>
        <ol>
          <li>The user connects to the VM with SSH.</li>
          <li>
            The user runs the CLI and gives it a URL. The URL points to a
            package on Artifactory that holds the config and the application
            code.
          </li>
          <li>The CLI downloads the package and validates the contents.</li>
          <li>The CLI deploys each service, one after the other.</li>
        </ol>

        <h3>What each step did</h3>
        <p>
          Each service received its configuration in a different way. Thus each
          step used a different mechanism.
        </p>
        <ul>
          <li>
            One service needed infrastructure. The CLI applied an ARM template
            with the Azure CLI, then installed the application code on the new
            resources.
          </li>
          <li>
            One service needed job definitions. The CLI deployed an Asset
            Bundle.
          </li>
          <li>
            One service needed configuration in its own database. The CLI sent
            the data to a Databricks workflow, and that workflow wrote the row.
          </li>
        </ul>
        <p>Each service then operated on its own schedule.</p>
      </Section>

      <Section
        index="04"
        eyebrow="THE GAP"
        title="The system met one need of five"
        aside={
          <Figure caption="Fig 2 — The five needs from 02 and the result from the existing process.">
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
                    <td>Met — one DDP described every service</td>
                  </tr>
                  <tr>
                    <td>The same product in each environment</td>
                    <td>One manual process for each environment</td>
                  </tr>
                  <tr>
                    <td>Change the product safely</td>
                    <td>A failure stopped the run part of the way</td>
                  </tr>
                  <tr>
                    <td>No wait for another person</td>
                    <td>Only users with approved VM access</td>
                  </tr>
                  <tr>
                    <td>Know the result</td>
                    <td>No common record, and sometimes several engineers</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Figure>
        }
      >
        <p>The system met the first need. It did not meet the other four.</p>

        <h3>A failure stopped the run part of the way</h3>
        <p>
          The CLI deployed the services in sequence, and a failure at any one of
          them stopped the run. The services before it stayed deployed. The
          services after it did not run. A config error that validation missed,
          a fault in the deployment logic, an unavailable service, or a crash of
          the CLI could each cause this.
        </p>
        <p>
          A second run did not always correct it. Some services first needed a
          teardown of the previous deployment. Each service tore down in a
          different way, and most of them through an API with its own interface.
          Recovery from one failed run thus crossed several different
          interfaces.
        </p>

        <h3>Only approved users could deploy</h3>
        <p>
          A user received VM access one time, so the approval was not a delay on
          each deployment. It was a barrier to the first one. A team with no
          approved user waited one or two business days, and each new person on
          a team waited again. After that, the approved users were the only path
          to production for the whole team.
        </p>

        <h3>A failure was hard to trace</h3>
        <p>
          Each service deployed by a different mechanism, and none of them
          reported through a common interface. No single record showed what a
          deployment did. A user often could not tell why a run failed. Several
          engineers sometimes had to work together to find the cause.
        </p>

        <h3>The code resisted new services</h3>
        <p>
          Rules for one service lived in the CLI. The teardown above is one
          example: a requirement of a single service reached into the
          application that deployed all of them. To add a service to the
          platform, several engineers had to work together, then iterate and
          test. An integration often took weeks.
        </p>
      </Section>

      <Section
        index="05"
        eyebrow="THE ENGINE"
        title="The engine calls one interface for each service"
        aside={
          <Figure caption="Fig 3 — One request format and one response format, for every operation on every service.">
            <div className="prose max-w-none">
              <pre>
                <code>{`// TK — the real interface
interface Request {
  location     // where the config and the code are in ADLS
  environment
}

interface ServiceApi {
  validate(Request) -> Response  // report the errors in this part
  plan(Request)     -> Response  // report the changes to make
  deploy(Request)   -> Response  // make the changes
  destroy(Request)  -> Response  // remove what deploy made
}`}</code>
              </pre>
            </div>
          </Figure>
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
          Each operation also uses the same request format and the same response
          format. The engine thus calls every service in the same way. It
          contains no deployment logic for any service. It also does not plan
          every service before it deploys any, and works through the services
          one at a time.
        </p>

        <h3>The request gives a location, not the config</h3>
        <p>
          The client writes the config and the application code to Azure Data
          Lake Storage (ADLS). The engine processes them and gives each service
          the location. Each service then reads only the parts that it needs.
        </p>

        <h3>A team makes its own service deployable</h3>
        <p>
          The engine owns the contract. The team that maintains a service
          implements that contract for the service. A DDP can then deploy the
          service, and the engine needs no change. Several services joined the
          platform after the first release, and each one went in without
          difficulty.
        </p>

        <h3>Each service owns its own rules</h3>
        <p>
          A service owns its own config schema. It also selects how to deploy
          its resources. If a service changes its deployment method, that change
          stays behind the API. The engine does not see it.
        </p>
        <p>
          A general validation API collects the schemas of all the services and
          validates a complete config against them. This closes the schema
          problem from section 04. The team that owns a service now owns the
          rules for it.
        </p>
      </Section>

      <Section
        index="06"
        eyebrow="FAILURE"
        title="What happens when a step fails"
      >
        <p>
          The previous deployment stays live until a new one is fully
          successful. If a deployment fails at any service, the engine calls
          destroy on each service that already deployed. The run removes its own
          work, and the previous deployment continues. A team does not find
          which services deployed, and does not reach several interfaces to
          recover.
        </p>

        <h3>A deploy can arrive more than one time</h3>
        <p>
          The engine delivers each deploy at least one time. A retry or a
          network fault can thus send the same deploy again. But each deploy
          operation is idempotent, so a repeat makes no further change. The two
          properties together give a deployment that happens just one time.
        </p>
        <p>
          The config version is what makes this work. A service compares the
          version in the request against the version it already deployed. A
          version that is already live needs no further change.
        </p>

        <h3>Destroy is different for every service</h3>
        <p>
          One service removes some metadata from its database. Another tears
          down real infrastructure. The engine does not know which, and does not
          need to. That is the purpose of the interface: the engine calls
          destroy, and the service decides what destroy means.
        </p>
      </Section>

      <Section
        index="07"
        eyebrow="ENTRY POINT"
        title="A team starts a deployment from GitHub Actions"
      >
        <p>
          A team starts a deployment from a GitHub Actions workflow. The
          workflow uploads the config to ADLS and starts the deployment engine.
          The engine returns a URL for the status of that deployment. No person
          needs access to a machine.
        </p>
        <p>
          These workflows run on ephemeral runners in an Azure Kubernetes
          Service (AKS) cluster, and the Actions Runner Controller (ARC) manages
          them. Each job receives a new runner, and the cluster adds runners
          when demand increases. This gives the platform far more scale than a
          fixed set of runners on one machine.
        </p>

        <h3>The engine resolves the environment</h3>
        <p>
          The engine reads the config that the team supplied. It substitutes the
          correct environment variables and produces one canonical config. Each
          service then reads that canonical config and deploys its own
          components. A team thus describes a product one time, and each
          environment receives the values that belong to it.
        </p>

        <h3>A team watches its own deployment</h3>
        <p>
          The runner polls the status URL while the deployment runs. The
          progress appears in the output of the GitHub Actions run, and it stays
          there with the rest of the logs for that run.
        </p>

        <h3>One deployment, one trace</h3>
        <p>
          Every service in the deployment path now produces traces with
          OpenTelemetry. Platform engineers read those traces in Azure Monitor.
          One deployment thus has one trace, across the engine and all of the
          services that it called.
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
              <li>Each service team implements and maintains the contract.</li>
              <li>Every service must keep its deploy idempotent.</li>
              <li>The engine trusts a destroy that it cannot check.</li>
              <li>
                The provisioning team operates a cluster, runners and storage.
              </li>
              <li>The engine does not detect drift after a deployment.</li>
            </ul>
          </div>
        }
      >
        <p>The design did not remove work. It moved work.</p>

        <h3>Each service team carries the contract</h3>
        <p>
          The old CLI held the deployment logic for every service, and one team
          maintained all of it. Now each service team implements four operations
          and maintains them for the life of the service. The platform gains
          services that deploy themselves. The service teams pay for it.
        </p>

        <h3>The guarantee depends on every service</h3>
        <p>
          At-least-once delivery is safe only because each deploy is idempotent.
          One service with a defect in that logic breaks the guarantee for the
          deployments that use it, and the engine cannot detect this. The same
          holds for destroy. The engine calls it and trusts the result, because
          the interface exists so that the engine does not know what destroy
          does.
        </p>

        <h3>The engine does not watch what it deployed</h3>
        <p>
          The engine deploys a config and then stops. It does not compare the
          live components against that config afterward. If a person changes a
          resource directly, nothing reports the difference. A second deployment
          of the same config version does not correct it either, because a
          service that already holds that version makes no change.
        </p>

        <h3>More parts to operate</h3>
        <p>
          The old system was one application on one machine. The new one is an
          engine, a Kubernetes cluster with its runners, a storage account, and
          an API for every service. The provisioning team operates the engine
          and the infrastructure around it. Each service team operates its own
          API.
        </p>
      </Section>

      <Section
        index="09"
        eyebrow="RESULTS"
        title="What changed"
        aside={
          <Figure caption="Fig 4 — The four gaps from section 04, before and after.">
            <div className="prose max-w-none bg-page px-5 py-4">
              <table>
                <thead>
                  <tr>
                    <th>Before</th>
                    <th>After</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Only approved users could deploy</td>
                    <td>Any team, from a workflow</td>
                  </tr>
                  <tr>
                    <td>A failed run left components deployed</td>
                    <td>The run removes its own work</td>
                  </tr>
                  <tr>
                    <td>Several services to search, several engineers</td>
                    <td>One trace for one deployment</td>
                  </tr>
                  <tr>
                    <td>A new service took weeks</td>
                    <td>Four operations, and no change to the engine</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Figure>
        }
      >
        <p>
          A team now deploys its own data product from a workflow. Nobody
          requests access to a machine, and nobody waits for a person with that
          access. This is the change that teams noticed first.{" "}
          <TK>a number that shows it</TK>
        </p>

        <h3>A new service is no longer a project</h3>
        <p>
          Before, a new service needed several engineers and some weeks of work
          in the deployment application. Several services joined the platform
          after the first release of the engine. Each one implemented the same
          four operations, and the engine did not change for any of them.
        </p>

        <h3>A failure is no longer an investigation</h3>
        <p>
          A failed run removes its own work, and the previous deployment stays
          live. A team reads the result in its own workflow output. A platform
          engineer reads one trace across every service. Nobody assembles the
          story from several sets of logs.
        </p>
      </Section>

      <SiteFooter />
    </div>
  );
}
