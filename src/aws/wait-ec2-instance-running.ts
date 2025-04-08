import * as core from '@actions/core';
import { logger } from '../utils/logger';
import { EC2Client, waitUntilInstanceRunning } from '@aws-sdk/client-ec2';

/**
 * Waits until the EC2 instance is in "running" state.
 *
 * @param instanceId The ID of the EC2 instance.
 * @param region AWS region where the instance is running.
 */
export async function waitEc2InstanceRunning(instanceId: string): Promise<void> {
  // Create an EC2 client.
  const ec2Client: EC2Client = new EC2Client();

  try {
    // Log the start of the waiting process.
    logger.info('AwsEC2: Initializing EC2 instance');

    // Wait until the instance is in "running" state.
    // This will poll the instance status until it is running or the max wait time is reached.
    await waitUntilInstanceRunning({ client: ec2Client, maxWaitTime: 300 }, { InstanceIds: [instanceId] });

    // Log the successful transition to "running" state.
    logger.success('AwsEC2: Instance is now running');
  } catch (error) {
    // Define a custom error message for the failure case.
    const errorMessage = `AwsEC2: Failed to reach "running" state: ${(error as Error).message}`;

    // Log and set the error message in the action context.
    core.error(errorMessage);
    throw new Error(errorMessage);
  }
}
