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

    // TODO this can be written as a generic construct/util
    // TODO can we just point it to the same base stack and for different scenarios it knows what to create/not-create?
    // Name | isStatic | onlyStatic
    // prod/int | y | n
    // dev-static | y | y
    // dev | n | n
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
