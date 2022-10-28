# repo-sandbox

Playground for testing repo, GitHub actions and AWS CI/CD features.

## AWS Bootstrapping Setup

1. Run `cdk bootstrap aws://123456789012/eu-west-2`
   - NOTE: Only required if the AWS environment is not already bootstrapped.
   - NOTE: Replaced AWS Account ID as appropriate.
   - NOTE: This can be done via AWS CloudShell.
2. Run the `setup.template` CloudFormation template via CloudFormation
   - NOTE: OIDC Provider ARN is optional. If not provided it will generate one. (Useful if one has already been created)
   - Run this for every environment that will be created in the appropriate AWS account ("Development", "Integration", "Production")
   - Set the GitHub secret values 'DEV_DEPLOY_ROLE', 'INT_DEPLOY_ROLE' and 'PROD_DEPLOY_ROLE' to be the associated arns created previously at the environment level (not repo level) in GitHub.

CloudFormation Quick Links:

- [Provider](https://eu-west-2.console.aws.amazon.com/cloudformation/home?region=eu-west-2#/stacks/quickcreate?templateUrl=https%3A%2F%2Fs3.eu-west-2.amazonaws.com%2Fcf-templates-799r2xq83gqd-eu-west-2%2F2022293aOR-template1%2520%25282%2529&stackName=GitHubOIDCProvider&param_EnvironmentName=&param_GitHubOrg=&param_OIDCProviderArn=&param_RepositoryName=) (for shared AWS accounts that may host multiple environments or repos)
- [Development](https://eu-west-2.console.aws.amazon.com/cloudformation/home?region=eu-west-2#/stacks/quickcreate?templateUrl=https%3A%2F%2Fs3.eu-west-2.amazonaws.com%2Fcf-templates-799r2xq83gqd-eu-west-2%2F2022293aOR-template1%2520%25282%2529&stackName=GitHubOIDCProvider-Development-repo-sandox&param_EnvironmentName=Development&param_GitHubOrg=samkio&param_OIDCProviderArn=UPDATE_ME&param_RepositoryName=repo-sandbox)
- [Integration](https://eu-west-2.console.aws.amazon.com/cloudformation/home?region=eu-west-2#/stacks/quickcreate?templateUrl=https%3A%2F%2Fs3.eu-west-2.amazonaws.com%2Fcf-templates-799r2xq83gqd-eu-west-2%2F2022293aOR-template1%2520%25282%2529&stackName=GitHubOIDCProvider-Integration-repo-sandox&param_EnvironmentName=Integration&param_GitHubOrg=samkio&param_OIDCProviderArn=UPDATE_ME&param_RepositoryName=repo-sandbox)
- [Production](https://eu-west-2.console.aws.amazon.com/cloudformation/home?region=eu-west-2#/stacks/quickcreate?templateUrl=https%3A%2F%2Fs3.eu-west-2.amazonaws.com%2Fcf-templates-799r2xq83gqd-eu-west-2%2F2022293aOR-template1%2520%25282%2529&stackName=GitHubOIDCProvider-Production-repo-sandox&param_EnvironmentName=Production&param_GitHubOrg=samkio&param_OIDCProviderArn=UPDATE_ME&param_RepositoryName=repo-sandbox)

**NOTE:** Repository should require approval to run actions for non-codeowners.

Further docs: https://www.eliasbrange.dev/posts/secure-aws-deploys-from-github-actions-with-oidc/
