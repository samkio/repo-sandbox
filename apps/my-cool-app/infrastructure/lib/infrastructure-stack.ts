import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { App } from "@aws-cdk/aws-amplify-alpha";
import * as path from "path";
import { ExampleType } from "shared";
import { Asset } from "aws-cdk-lib/aws-s3-assets";
import { DockerImage, Duration } from "aws-cdk-lib";
import { copySync } from "fs-extra";
import { execSync } from "child_process";
import {
  BlockPublicAccess,
  Bucket,
  BucketAccessControl,
  ObjectOwnership,
} from "aws-cdk-lib/aws-s3";
import { BucketDeployment, Source } from "aws-cdk-lib/aws-s3-deployment";
import {
  AllowedMethods,
  Distribution,
  OriginAccessIdentity,
  SecurityPolicyProtocol,
  ViewerProtocolPolicy,
} from "aws-cdk-lib/aws-cloudfront";
import { CanonicalUserPrincipal, PolicyStatement } from "aws-cdk-lib/aws-iam";
import { S3Origin } from "aws-cdk-lib/aws-cloudfront-origins";

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

    // https://github.com/aws-samples/aws-cdk-examples/blob/master/typescript/static-site/static-site.ts
    const cloudfrontOAI = new OriginAccessIdentity(this, "cloudfront-OAI");

    const frontendS3Bucket = new Bucket(this, "frontentReactBucket", {
      bucketName: `my-cool-app-test-${props.environmentName.toLocaleLowerCase()}`,
      publicReadAccess: false,
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      accessControl: BucketAccessControl.PRIVATE,
      objectOwnership: ObjectOwnership.BUCKET_OWNER_ENFORCED,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    frontendS3Bucket.addToResourcePolicy(
      new PolicyStatement({
        actions: ["s3:GetObject"],
        resources: [frontendS3Bucket.arnForObjects("*")],
        principals: [
          new CanonicalUserPrincipal(
            cloudfrontOAI.cloudFrontOriginAccessIdentityS3CanonicalUserId
          ),
        ],
      })
    );

    const distribution = new Distribution(this, "SiteDistribution", {
      // certificate: certificate,
      defaultRootObject: "index.html",
      // domainNames: [siteDomain],
      minimumProtocolVersion: SecurityPolicyProtocol.TLS_V1_2_2021,
      errorResponses: [
        {
          httpStatus: 403,
          responseHttpStatus: 403,
          responsePagePath: "/error.html",
          ttl: Duration.minutes(30),
        },
      ],
      defaultBehavior: {
        origin: new S3Origin(frontendS3Bucket, {
          originAccessIdentity: cloudfrontOAI,
        }),
        compress: true,
        allowedMethods: AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
        viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
    });
    const frontendPackagePath = path.join(
      __dirname,
      "../../frontend-react/build"
    );
    const mainSiteDeploy = new BucketDeployment(
      this,
      "DeployWithInvalidation",
      {
        sources: [Source.asset(frontendPackagePath)],
        destinationBucket: frontendS3Bucket,
        distribution,
        distributionPaths: ["/*"],
        exclude: ["config.json"],
      }
    );
    const configDeploy = new BucketDeployment(this, "ConfigDeploy", {
      sources: [
        Source.jsonData("config.json", {
          jsonConfig: frontendS3Bucket.bucketName,
        }),
      ],
      destinationBucket: frontendS3Bucket,
      distribution,
      distributionPaths: ["/config.json"],
      prune: false,
    });

    new cdk.CfnOutput(this, "reactAppURL", {
      value: `https://${distribution.domainName}`,
      description: "The URL of the react app",
    });
  }
}
