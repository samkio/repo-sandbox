import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { App } from "@aws-cdk/aws-amplify-alpha";
import * as path from "path";
import { ExampleType } from "shared";
import { Asset } from "aws-cdk-lib/aws-s3-assets";
import { DockerImage } from "aws-cdk-lib";
import { copySync } from "fs-extra";
import { execSync } from "child_process";

// Very basic dependency to verify depenent local packages are built.
const value: ExampleType = {
  numberField: 123,
  stringField: "exampleValue",
};
console.log(value);

interface InfrastructureStackProps extends cdk.StackProps {
  environmentName: string;
}

export class InfrastructureStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: InfrastructureStackProps) {
    super(scope, id, props);

    // TODO - requires esbuild to be added as a devDependency?
    // TODO this is quite complex and duplicates build commands; can we simplify this?
    const frontendPackagePath = path.join(__dirname, "../../frontend-react");
    const frontendReactAsset = new Asset(this, "frontendReactAsset", {
      path: frontendPackagePath,
      bundling: {
        local: {
          tryBundle: (outputDir: string) => {
            try {
              execSync("npm --version", { timeout: 60000 });
            } catch {
              return false;
            }
            execSync("npm install -g pnpm", {
              timeout: 60000,
            });
            execSync("pnpm install", {
              timeout: 60000,
            });
            execSync("pnpm run -r --filter frontend-react... build", {
              cwd: frontendPackagePath,
              timeout: 120000,
            });
            copySync(path.join(frontendPackagePath, "build"), outputDir);
            return true;
          },
        },
        image: DockerImage.fromRegistry("node:lts"),
        command: [
          "bash",
          "-c",
          [
            "npm install -g pnpm",
            "pnpm install",
            "pnpm run -r --filter frontend-react... build",
            "cp -r /asset-input/packages/frontend-react/build/* /asset-output/",
          ].join(" && "),
        ],
      },
    });

    const app = new App(this, "amplifyApp", {
      appName: `TestReactApp-${props.environmentName}`,
    });
    const branch = app.addBranch("deploy", {
      asset: frontendReactAsset,
      pullRequestPreview: false,
      autoBuild: false,
    });

    new cdk.CfnOutput(this, "reactAppURL", {
      value: `https://${branch.branchName}.${app.defaultDomain}`,
      description: "The URL of the react app",
      exportName: "reactAppURL",
    });
  }
}
