# repo-sandbox

Playground for testing repo, GitHub actions and AWS CI/CD features.

## Setup

1. Run `cdk bootstrap aws://123456789012/eu-west-2`
   - NOTE: Only required if the AWS environment is not already bootstrapped.
   - NOTE: Replaced AWS Account ID as appropriate.
   - NOTE: This can be done via AWS CloudShell.
2. Run the CloudFormation template found here: https://github.com/aws-actions/configure-aws-credentials#sample-iam-role-cloudformation-template
   - NOTE: OIDC Provider ARN is optional. If not provided it will generate one. (Useful if one has already been created)
     Set the GitHub secret value 'DEV_DEPLOY_ROLE' to be the ARN of this created role.
     This role needs to be able to assume the cdk roles created by bootstrap.

```
{
   "Version": "2012-10-17",
   "Statement": [
      {
         "Effect": "Allow",
         "Action": "sts:AssumeRole",
         "Resource": "arn:aws:iam::123456789012:role/cdk-*"
      }
   ]
}
```

**NOTE:** Repository should require approval to run actions for non-codeowners.

Further docs: https://www.eliasbrange.dev/posts/secure-aws-deploys-from-github-actions-with-oidc/
