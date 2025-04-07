# On-Demand EC2 GitHub Runner

This action makes it easy for **GitHub Actions** users to dynamically **start**, **stop**, and manage **EC2 instances** as **self-hosted runners**, ensuring faster, more flexible, and cost-efficient workflows.

[![Release](https://img.shields.io/github/v/release/evners/on-demand-ec2-runner)](https://github.com/evners/on-demand-ec2-runner/releases)
[![Build Status](https://github.com/evners/on-demand-ec2-runner/actions/workflows/release.yml/badge.svg)](https://github.com/evners/on-demand-ec2-runner/actions)
[![License](https://img.shields.io/github/license/evners/on-demand-ec2-runner)](LICENSE)
[![Marketplace](https://img.shields.io/badge/marketplace-on--demand--ec2--runner-blue)](https://github.com/marketplace/actions/on-demand-ec2-runner)

## 🚀 Getting Started

Follow these steps to quickly set up your on-demand EC2 runners.

### 1. Create IAM user and permissions

Create an IAM user or use an existing one. Attach the following minimum required permissions:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["ec2:RunInstances", "ec2:TerminateInstances", "ec2:DescribeInstances", "ec2:DescribeInstanceStatus"],
      "Resource": "*"
    }
  ]
}
```

### 2. Add secrets to GitHub

Save `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` into your repository secrets.

### 3. Setup credentials in workflow

Use [aws-actions/configure-aws-credentials](https://github.com/aws-actions/configure-aws-credentials) to load credentials securely into the GitHub Actions environment.

```yaml
- name: Configure AWS credentials
  uses: aws-actions/configure-aws-credentials@v4
  with:
    aws-region: eu-west-1
    aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
    aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
```

⚠️ This step is mandatory to allow the runner to interact with AWS EC2 resources.

### 4. Start On-Demand Runner

Add the action to your workflow to launch a new EC2 instance.

```yaml
- name: Start EC2 Runner
  uses: evners/on-demand-ec2-runner@v1
  with:
    aws-region: eu-west-1
    ec2-ami: ami-0abcdef1234567890
```

### 5. Do the Job

Once the EC2 runner is ready, you can run your jobs on it just like any other GitHub runner.

```yaml
do-the-job:
  name: Run your workflow
  needs: start-runner
  runs-on: ${{ needs.start-runner.outputs.label }}
  steps:
    - name: Say Hello
      run: echo "Hello from GitHub Actions!"
```

### 6. Stop On-Demand Runner

At the end of your workflow, stop the EC2 runner to avoid unnecessary costs.

```yaml
- name: Stop EC2 Runner
  uses: evners/on-demand-ec2-runner@v1
  with:
    mode: stop
    aws-region: eu-west-1
    ec2-instance-id: ${{ needs.start-runner.outputs.instance-id }}
```

### 7. Full Workflow Example

Here’s a complete GitHub Actions workflow using the on-demand EC2 runner.

```yaml
name: On-Demand EC2 Runner

on:
  push:
    branches:
      - main

jobs:
  start-runner:
    name: Start EC2 runner
    runs-on: ubuntu-latest
    outputs:
      instance-id: ${{ steps.start.outputs.instance-id }}
    steps:
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-region: ${{ secrets.AWS_REGION }}
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}

      - name: Start EC2 runner
        id: start
        uses: evners/on-demand-ec2-runner@v1
        with:
          aws-region: eu-west-1
          ec2-ami: ami-0abcdef1234567890

  do-the-job:
    name: Run your workflow
    needs: start-runner
    runs-on: ubuntu-latest

    steps:
      - name: Say Hello
        run: echo "Hello from GitHub Actions 🚀"

  stop-runner:
    name: Stop EC2 runner
    needs:
      - start-runner
      - do-the-job
    runs-on: ubuntu-latest
    if: always() # Make sure the runner is stopped even if the workflow fails.
    steps:
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-region: ${{ secrets.AWS_REGION }}
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}

      - name: Stop EC2 runner
        uses: evners/on-demand-ec2-runner@v1
        with:
          mode: stop
          aws-region: eu-west-1
          ec2-instance-id: ${{ needs.start-runner.outputs.instance-id }}
```

## 📝 License

The scripts and documentation in this project are released under the [MIT License](./LICENSE). Feel free to use, modify, and distribute them as needed!

## 🤝 Contributions

Contributions are welcome and greatly appreciated! If you have ideas, improvements, or fixes, feel free to open an issue or submit a pull request.

Maintained with ❤️ by [Guillem Casas](https://github.com/gucasassi) at [EVNERS](https://github.com/evners).
