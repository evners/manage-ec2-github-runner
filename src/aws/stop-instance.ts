import * as core from '@actions/core';
import { EC2Client, TerminateInstancesCommand } from '@aws-sdk/client-ec2';

/**
 * Stops an EC2 instance using the specified instance ID.
 * @param ec2Client - The EC2 client to use for making API calls.
 * @returns A promise that resolves when the instance is stopped.
 */
export async function stopInstance(ec2Client: EC2Client): Promise<void> {
  // Get the instance ID from action inputs.
  const instanceId: string = core.getInput('ec2-instance-id', { required: true });

  // Create a new command to terminate the instance.
  const terminateCommand = new TerminateInstancesCommand({
    InstanceIds: [instanceId],
  });

  // Send the command to terminate the instance.
  // This will stop the instance and release any associated resources.
  await ec2Client.send(terminateCommand);

  // Log the successful termination of the instance.
  core.info(`🛑 EC2 instance terminated: ${instanceId}`);
}
