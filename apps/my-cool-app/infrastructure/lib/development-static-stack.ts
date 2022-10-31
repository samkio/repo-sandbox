import { StackProps, Stack } from "aws-cdk-lib";
import { Construct } from "constructs";
import { DataStorage } from "./constructs/data-storage";

interface DevelopmentStaticStackProps extends StackProps {
  environmentName: string;
}

export class DevelopmentStaticStack extends Stack {
  constructor(
    scope: Construct,
    id: string,
    props: DevelopmentStaticStackProps
  ) {
    super(scope, id, props);

    new DataStorage(this, "dataStorage", {
      environmentName: props.environmentName,
      isEphemeral: false,
    });
  }
}
