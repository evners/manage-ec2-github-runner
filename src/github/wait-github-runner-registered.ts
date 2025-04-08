import { Config } from '../config';
import { logger } from '../utils/logger';
import { getRunner, Runner, RunnerStatus } from './get-runner';

/**
 * Waits for a GitHub self-hosted runner to register and come online.
 *
 * @param config The action configuration.
 * @param label Label of the runner to check.
 * @param timeoutMinutes Max minutes to wait (default: 3).
 * @param retryIntervalSeconds Polling interval in seconds (default: 10).
 * @param quietPeriodSeconds Initial wait before polling (default: 30).
 */
export async function waitGitHubRunnerRegistered(
  config: Config,
  label: string,
  timeoutMinutes = 3,
  retryIntervalSeconds = 10,
  quietPeriodSeconds = 30,
): Promise<void> {
  // Log the initial wait period.
  logger.info(`Waiting up to ${timeoutMinutes} minutes for GitHub runner '${label}' to register...`);

  // Wait for the quiet period before starting to poll.
  await new Promise((resolve) => setTimeout(resolve, quietPeriodSeconds * 1000));

  // Start polling for the runner status.
  const startTime = Date.now();
  const timeoutMillis = timeoutMinutes * 60 * 1000;

  // Poll for the runner status at the specified interval.
  return new Promise((resolve, reject) => {
    // Set an interval to check the runner status.
    const interval = setInterval(async () => {
      try {
        // Search for the runner by label.
        const runner: Runner | undefined = await getRunner(config, label);

        // Check if the runner is registered and online.
        if (runner?.status === ('online' as RunnerStatus)) {
          // Log the successful registration.
          logger.success(`GitHub runner '${runner.name}' is registered and ready!`);

          // Clear the interval and resolve the promise.
          clearInterval(interval);
          return resolve();
        }

        // Check if the timeout has been exceeded.
        if (Date.now() - startTime > timeoutMillis) {
          // Clear the interval.
          clearInterval(interval);

          // Log the timeout error.
          const message = `Timeout of ${timeoutMinutes} minutes exceeded. Runner '${label}' did not register.`;
          logger.error(message);

          // Reject the promise with an error.
          return reject(new Error(message));
        }

        // Log the try message.
        logger.info('Runner is not online yet. Waiting for registration...');
      } catch (error) {
        logger.error(`Error checking runner status: ${(error as Error).message}`);
      }
    }, retryIntervalSeconds * 1000);
  });
}
