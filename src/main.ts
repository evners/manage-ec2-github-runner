import * as core from '@actions/core';
import { EC2Client } from '@aws-sdk/client-ec2';
import { stopInstance } from './aws/stop-instance';
import { startInstance } from './aws/start-instance';

/**
 * The main function that runs the GitHub Action.
 * It starts or stops an EC2 instance based on the input parameters.
 */
async function run(): Promise<void> {
  try {
    // Get the AWS region and mode (start/stop) from the action inputs.
    const mode: string = core.getInput('mode') || 'start';
    const awsRegion: string = core.getInput('aws-region', { required: true });

    // Initialize the EC2 client with the specified AWS region.
    const ec2Client: EC2Client = new EC2Client({ region: awsRegion });

    // Determine whether to start or stop the EC2 instance based on the mode input.
    if (mode === 'start') {
      // If the mode is 'start', call the startInstance function.
      await startInstance(ec2Client);
    } else if (mode === 'stop') {
      // If the mode is 'stop', call the stopInstance function.
      await stopInstance(ec2Client);
    } else {
      // If the mode is not 'start' or 'stop', throw an error.
      throw new Error(`Invalid mode: ${mode}. Expected "start" or "stop".`);
    }
  } catch (error: unknown) {
    // If an error occurs, log the error message and set the action to failed.
    core.setFailed(error instanceof Error ? error.message : String(error));
  }
}

// Execute the main function.
run();
