# Shared AWS API Gateway

Working on production projects would often require the usage of a shared API gateway between multiple Lambda functions. The gateway folder in this repository is reponsible for it.

<!-- This repository showcases how to deploy multiple Lambda functions that are attached on a single API gateway. -->

## Add execution permission to CI deploy + decomission scripts.

```sh
chmod +x .\ci-deploy.sh # macOS or linux
./ci-deploy.sh # windows - Git bash
# chmod +x .\ci-decomission.sh
```

### Configure your AWS Deployment Account

Provide an AWS account that have sufficient access so that serverless can deploy the stack.

```sh
serverless config credentials --provider aws --key YOUR_AWS_ACCESS_KEY --secret YOUR_AWS_SECRET_KEY
```

# Deploying the API Gateway + Lambda Stack

To deploy the

```sh
.\ci-deploy
```

<!-- # Decomission all resources

```sh
.\ci-decomission
``` -->
