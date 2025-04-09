### 📌 Summary

Briefly describe what this PR introduces or improves:

> _Example: Add support for configuring custom EBS volume size and tags when launching the EC2 runner._

</br>

### 🔗 Related Issues

_Link related issues if applicable (e.g., `Fixes #123`, `Closes #456`):_

> Closes #12

</br>

### 📝 Changes

List the main changes this PR introduces:

- Added `subnet-id` support to allow specifying a custom VPC subnet.
- Made EC2 instance running timeout configurable.
- Improved logs for better debugging during runner registration.

</br>

### ☑️ Checklist

Please confirm that you have verified the following:

- [ ] Action builds successfully (`pnpm build`).
- [ ] EC2 instance launches correctly and runner registers on GitHub.
- [ ] Workflow jobs execute successfully using the runner.
- [ ] EC2 instance stops and terminates without issues.
- [ ] Outputs (`label`, `ec2-instance-id`) are set correctly.
- [ ] Tested with `act` locally (if applicable).
- [ ] Logs show expected information (runner online, instance running).
- [ ] No unexpected errors or warnings during execution.

_If any step is not applicable, please add a short explanation._
