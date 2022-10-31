import { RemovalPolicy } from "aws-cdk-lib";
import {
  BlockPublicAccess,
  Bucket,
  BucketAccessControl,
  ObjectOwnership,
} from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";

export interface DataStorageProps {
  environmentName: string;
  isEphemeral: boolean;
}

export class DataStorage extends Construct {
  constructor(scope: Construct, id: string, props: DataStorageProps) {
    super(scope, id);

    if (props.isEphemeral) {
      new Bucket(this, "dataStorageBucket", {
        bucketName: `my-cool-app-data-storage-${props.environmentName.toLocaleLowerCase()}`,
        publicReadAccess: false,
        blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
        accessControl: BucketAccessControl.PRIVATE,
        objectOwnership: ObjectOwnership.BUCKET_OWNER_ENFORCED,
        removalPolicy: RemovalPolicy.DESTROY,
        autoDeleteObjects: props.isEphemeral,
      });
    } else {
      Bucket.fromBucketName(
        this,
        "dataStorageBucket",
        "my-cool-app-data-storage-development-static"
      );
    }
  }
}
