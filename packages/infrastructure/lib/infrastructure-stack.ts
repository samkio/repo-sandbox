import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { App } from "@aws-cdk/aws-amplify-alpha";
import * as path from "path";
import { ExampleType } from "shared";
import { Asset } from "aws-cdk-lib/aws-s3-assets";
import { DockerImage } from "aws-cdk-lib";
import { copySync } from "fs-extra";

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

    // TODO - Should the CDK assume this is pre-built?
    // TODO - requires esbuild to be added as a devDependency?
    const frontendBuildOutput = path.join(
      __dirname,
      "../../frontend-react/build"
    );
    const frontendReactAsset = new Asset(this, "frontendReactAsset", {
      path: frontendBuildOutput,
      bundling: {
        local: {
          tryBundle: (outputDir: string) => {
            copySync(frontendBuildOutput, outputDir);
            return true;
          },
        },
        image: DockerImage.fromRegistry("node:lts"),
      },
    });

    const app = new App(this, "amplifyApp", {
      appName: `TestReactApp-${props.environmentName}`,
    });
    app.addBranch("deploy", {
      asset: frontendReactAsset,
      pullRequestPreview: false,
      autoBuild: false,
    });
  }
}
