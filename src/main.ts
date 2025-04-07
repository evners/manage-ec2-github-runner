import { Config } from './config';
import * as core from '@actions/core';
// AWS
import { startEc2Instance } from './aws/start-ec2-instance';
import { terminateEc2Instance } from './aws/terminate-ec2-instance';
import { setOutput } from './utils/set-output';

/**
 * The main function that runs the GitHub Action.
 * It starts or stops an EC2 instance based on the input parameters.
 */
async function run(): Promise<void> {
  try {
    // Read inputs and validate configuration.
    const config = new Config();

    // Decider for starting or stopping the EC2 instance.
    if (config.mode === 'start') {
      const ec2Id = await startEc2Instance(config);

      // Set the output of the action.
      setOutput(ec2Id);
    } else if (config.mode === 'stop') {
      await terminateEc2Instance(config);
    }
  } catch (error) {
    // Handle errors.
    if (error instanceof Error) {
      core.setFailed(error?.message);
    } else {
      core.setFailed(`Action failed with unknown error: ${String(error)}`);
    }
  }
}

// Execute.
run();
