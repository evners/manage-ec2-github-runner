import { Config } from './config';
import * as core from '@actions/core';
import { setOutput } from './utils/set-output';
import { startEc2Instance } from './aws/start-ec2-instance';
import { terminateEc2Instance } from './aws/terminate-ec2-instance';
import { getGitHubRegistrationToken } from './github/get-registration-token';
import { waitEc2InstanceRunning } from './aws/wait-ec2-instance-running';
import { waitGitHubRunnerRegistered } from './github/wait-github-runner-registered';
import { unregisterGitHubRunner } from './github/unregister-github-runner';

/**
 * The main function that runs the GitHub Action.
 * It starts or stops an EC2 instance based on the input parameters.
 */
async function run(): Promise<void> {
  try {
    // Read inputs and validate configuration.
    const config = new Config();

    // Decider for the action mode.
    if (config.mode === 'start') {
      // Create github registration token and
      const registrationToken = await getGitHubRegistrationToken(config.githubToken!);

      // Start the EC2 instance.
      const { instanceId, label } = await startEc2Instance(config, registrationToken);

      // Set the output of the action.
      setOutput(instanceId, label);

      // Wait for the EC2 instance to be in running state and register the GitHub runner.
      await Promise.all([waitEc2InstanceRunning(instanceId), waitGitHubRunnerRegistered(label, config.githubToken!)]);
    } else if (config.mode === 'stop') {
      // Destru
      const { githubToken, label } = config;
      // Terminate the EC2 instance and unregister the GitHub runner.
      await Promise.all([terminateEc2Instance(config), unregisterGitHubRunner(githubToken!, label!)]);
    }
  } catch (error) {
    // Handle errors.
    if (error instanceof Error) {
      core.setFailed(error?.message);
    } else {
      core.setFailed(`Unexpected error: ${String(error)}`);
    }
  }
}

// Execute.
run();
