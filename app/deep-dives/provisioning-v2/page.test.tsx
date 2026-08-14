import { expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import ProvisioningDeepDive from "./page";

const SECTION_TITLES: readonly string[] = [
  "One declaration had to deploy a complete data product",
  "The shared VM held every deployment rule",
  "Deploy moved behind service-owned APIs",
  "The provisioning app became an orchestrator",
  "Durable Functions preserve progress between steps",
  "At-least-once activities need idempotent deploys",
  "The package moves from Artifactory to Blob once",
  "Compensation reverses only what can be undone",
  "The saga records progress, failure, and recovery",
  "Validation moved to the teams that own the rules",
  "Plan makes the next change visible",
  "The protocol grew one operation at a time",
  "Self-service changed the operating numbers",
  "The work moved with the ownership",
];

const ARTICLE_IMAGES: ReadonlyArray<{ alt: string; filename: string }> = [
  {
    alt: "Original deployment path through shared Azure VM and CLI",
    filename: "provisioning-original-vm-cli-path.png",
  },
  {
    alt: "Service deployment logic before service-owned APIs",
    filename: "provisioning-service-owned-apis-before.png",
  },
  {
    alt: "Service deployment logic after moving behind a service-owned API",
    filename: "provisioning-service-owned-apis-after.png",
  },
  {
    alt: "Shared VM provisioning path calling service-owned deployment APIs",
    filename: "provisioning-vm-cli-path-with-service-apis.png",
  },
  {
    alt: "Azure Durable Functions runtime and storage infrastructure",
    filename: "provisioning-azure-durable-functions-infra.png",
  },
  {
    alt: "Durable deployment service calling service applications with staged configuration",
    filename: "provisioning-durable-deployment.png",
  },
  {
    alt: "Provisioning service staging a JFrog Artifactory package in Azure Blob Storage",
    filename: "provisioning-artifactory-blob-staging.png",
  },
];

test("renders the provisioning evolution in chronological order", () => {
  const markup = renderToStaticMarkup(<ProvisioningDeepDive />);
  let previousTitleIndex = -1;

  for (const title of SECTION_TITLES) {
    const titleIndex = markup.indexOf(title);

    expect(titleIndex).toBeGreaterThan(previousTitleIndex);
    previousTitleIndex = titleIndex;
  }
});

test("renders every supplied provisioning image with descriptive alternative text", () => {
  const markup = renderToStaticMarkup(<ProvisioningDeepDive />);

  for (const image of ARTICLE_IMAGES) {
    expect(markup).toContain(`alt="${image.alt}"`);
    expect(markup).toContain(image.filename);
  }
});
