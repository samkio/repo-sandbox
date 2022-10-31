#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { InfrastructureStack } from "../lib/infrastructure-stack";
import { DevelopmentStaticStack } from "../lib/development-static-stack";

const app = new cdk.App();

let environmentName = app.node.tryGetContext("environmentName");
const devSuffix = app.node.tryGetContext("devSuffix");

if (
  !environmentName ||
  typeof environmentName !== "string" ||
  !["Development", "Integration", "Prod"].includes(environmentName)
) {
  throw new Error(`Invalid environmentName: ${environmentName}`);
}

if (environmentName === "Development") {
  if (!devSuffix || typeof devSuffix !== "string") {
    throw new Error(
      "devSuffix must be defined when environmentName=Development"
    );
  } else {
    environmentName = `${environmentName}-${devSuffix}`;
  }
}

if (devSuffix === "static") {
  new DevelopmentStaticStack(app, `MyCoolApp-Development-static`, {
    environmentName,
  });
} else {
  new InfrastructureStack(app, `InfrastructureStack-${environmentName}`, {
    environmentName,
    isEphemeral: true,
  });
}
