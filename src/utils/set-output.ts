const core = require('@actions/core');

export function setOutput(ec2InstanceId: string): void {
  core.setOutput('ec2-instance-id', ec2InstanceId);
}
