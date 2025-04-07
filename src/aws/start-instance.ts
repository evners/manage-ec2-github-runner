import * as core from '@actions/core';
import { EC2Client, RunInstancesCommand, RunInstancesCommandInput, _InstanceType } from '@aws-sdk/client-ec2';

/**
 * Starts an EC2 instance using the specified AMI and instance type.
 * @param ec2Client - The EC2 client to use for making API calls.
 * @returns A promise that resolves when the instance is started.
 */
export async function startInstance(ec2Client: EC2Client): Promise<void> {
  // Get amiId and instanceType from action inputs.
  const amiId: string = core.getInput('ec2-ami', { required: true });
  const instanceType: _InstanceType = (core.getInput('ec2-instance-type') || 't2.micro') as _InstanceType;

  // Create the parameters for the RunInstancesCommand.
  const params: RunInstancesCommandInput = {
    ImageId: amiId,
    InstanceType: instanceType,
    MinCount: 1,
    MaxCount: 1,
    TagSpecifications: [
      {
        ResourceType: 'instance',
        Tags: [{ Key: 'Name', Value: 'github-runner' }],
      },
    ],
  };

  // Create a new command to run the instance.
  const command = new RunInstancesCommand(params);
  const { Instances } = await ec2Client.send(command);

  // Extract the instance ID from the response.
  const instanceId = Instances?.[0]?.InstanceId;

  // If an instance ID is returned, set it as an output and log success.
  if (instanceId) {
    core.setOutput('ec2-instance-id', instanceId);
    core.info(`🚀 EC2 instance started: ${instanceId}`);
  } else {
    // Otherwise, throw an error indicating failure to launch the instance.
    throw new Error('Failed to launch EC2 instance: No instance ID returned.');
  }
}
