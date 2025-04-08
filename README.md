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
    aws-region: ${{ secrets.AWS_REGION }}
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
    ec2-ami: ${{ secrets.EC2_AMI_ID }}
    github-token: ${{ secrets.GH_TOKEN }}
```

### 5. Run Your Jobs

Once the EC2 runner is ready, you can run your jobs on it just like any other GitHub runner.

```yaml
your-job:
  name: Run your job
  needs: start-runner
  runs-on: ${{ needs.start-runner.outputs.label }}
  steps:
    - name: Say Hello
      run: echo "Hi there!"
```

### 6. Stop On-Demand Runner

At the end of your workflow, stop the EC2 runner to avoid unnecessary costs.

```yaml
- name: Stop EC2 Runner
  uses: evners/on-demand-ec2-runner@v1
  with:
    mode: stop
    label: ${{ needs.start-runner.outputs.label }}
    github-token: ${{ secrets.GH_TOKEN }}
    ec2-instance-id: ${{ needs.start-runner.outputs.ec2-instance-id }}
```

### 7. Full Workflow Example

Here’s a complete GitHub Actions workflow using the on-demand EC2 runner.

```yaml
# This workflow demonstrates how to dynamically launch an EC2 instance, register it as a GitHub
# self-hosted runner, run your jobs, and then safely terminate the EC2 instance.
name: On-Demand EC2 Runner

# Executed on push to main branch.
on:
  push:
    branches:
      - main

jobs:
  # This job launches a new EC2 instance and registers it as a self-hosted runner in your repository, and outputs the instance ID and runner label for use in the following jobs.
  start-runner:
    runs-on: ubuntu-latest
    # These outputs (the EC2 instance ID and the GitHub runner label) will be used by other jobs later
    # in the workflow to run steps on the runner and clean up the resources when finished.
    outputs:
      label: ${{ steps.start-ec2.outputs.label }}
      ec2-instance-id: ${{ steps.start-ec2.outputs.ec2-instance-id }}

    steps:
      # Use 'aws-actions/configure-aws-credentials@v4' to authenticate with AWS.
      # It securely loads credentials from GitHub Secrets so the workflow can manage EC2 instances.
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-region: ${{ secrets.AWS_REGION }}
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}

      # Launch a new EC2 instance using the specified AMI. It will install the GitHub Actions runner,
      # register it to your repository and make it available to run jobs dynamically.
      - name: Start EC2 runner
        id: start-ec2
        uses: evners/on-demand-ec2-runner@v1
        with:
          ec2-ami: ${{ secrets.EC2_AMI_ID }}
          github-token: ${{ secrets.GH_TOKEN }}

  # Run your job on the newly created EC2 self-hosted runner. Here you can build, test, or deploy
  # using your custom runner environment.
  your-job:
    name: Run your job
    needs: start-runner
    # Run the job on the self-hosted EC2 runner created earlier.
    runs-on: ${{ needs.start-runner.outputs.label }}
    steps:
      - name: Print Message
        run: echo "Hi there!"

  # Stop and terminate the EC2 instance to avoid unnecessary costs.
  # This step ensures that the EC2 runner is always cleaned up, even if the previous jobs fail.
  stop-runner:
    name: Stop EC2 runner
    if: always() # Ensures this job runs even if earlier jobs fail.
    needs: [start-runner, your-job]
    runs-on: ubuntu-latest
    steps:
      # Use 'aws-actions/configure-aws-credentials@v4' to authenticate with AWS.
      # It securely loads credentials from GitHub Secrets so the workflow can terminate the EC2 instance.
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-region: ${{ secrets.AWS_REGION }}
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}

      # Use the 'evners/on-demand-ec2-runner@v1' action in 'stop' mode to terminate the EC2 instance
      # and automatically remove the self-hosted runner from GitHub.
      - name: Stop EC2 runner
        uses: evners/on-demand-ec2-runner@v1
        with:
          mode: 'stop'
          label: ${{needs.start-runner.outputs.label }}
          github-token: ${{ secrets.GH_TOKEN }}
          ec2-instance-id: ${{ needs.start-runner.outputs.ec2-instance-id }}
```

### 📥 Inputs

| Name                               | Description                                                                 | Required   | Default     |
| :--------------------------------- | :-------------------------------------------------------------------------- | :--------- | :---------- |
| `mode`                             | Action mode: `"start"` to launch an instance, `"stop"` to terminate one.    | No         | `start`     |
| `label`                            | Label assigned to the GitHub runner (required when stopping).               | Stop mode  | -           |
| `ec2-ami`                          | AMI ID to launch the EC2 instance (required when starting).                 | Start mode | -           |
| `ec2-instance-type`                | EC2 instance type (e.g., `t2.micro`).                                       | No         | `t2.micro`  |
| `ec2-instance-id`                  | EC2 instance ID to terminate (required when stopping).                      | Stop mode  | -           |
| `instance-running-timeout-seconds` | Timeout (in seconds) to wait for the EC2 instance to reach "running" state. | No         | `300`       |
| `block-device-name`                | Block device name for the EBS volume (e.g., `/dev/sda1`).                   | No         | `/dev/sda1` |
| `ebs-volume-size`                  | Size of the EBS volume in GiB (e.g., `8`, `16`).                            | No         | `8`         |
| `ebs-volume-type`                  | Type of the EBS volume (e.g., `gp2`, `gp3`).                                | No         | `gp3`       |
| `ebs-delete-on-termination`        | Whether to delete the EBS volume on instance termination.                   | No         | `true`      |
| `subnet-id`                        | Subnet ID where the EC2 instance will be launched.                          | No         | -           |
| `github-token`                     | GitHub token with `repo` scope to register the runner.                      | Yes        | -           |
| `runner-timeout-minutes`           | Maximum minutes to wait for the runner to register.                         | No         | `5`         |
| `runner-retry-seconds`             | Retry interval in seconds for checking runner status.                       | No         | `5`         |
| `runner-quiet-seconds`             | Initial wait time before starting to check runner status.                   | No         | `30`        |

---

### 📤 Outputs

| Name              | Description                                                                 |
| :---------------- | :-------------------------------------------------------------------------- |
| `label`           | Name of the GitHub runner. Used to specify `runs-on` and remove the runner. |
| `ec2-instance-id` | ID of the launched EC2 instance (used for termination).                     |

---

### 🚀 Notes

- `github-token` is **required** for both starting and stopping workflows.
- `subnet-id` is **optional**. If omitted, AWS will attempt to launch the instance in the default VPC/subnet.
- `runner-timeout-minutes`, `runner-retry-seconds`, and `runner-quiet-seconds` help fine-tune runner registration timing depending on your environment.

## 📝 License

The scripts and documentation in this project are released under the [MIT License](./LICENSE).

## 🤝 Contributions

Contributions are welcome and greatly appreciated! If you have ideas, improvements, or fixes, feel free to open an issue or submit a pull request.
