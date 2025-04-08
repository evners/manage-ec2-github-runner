import { Config } from '../config';
import { logger } from '../utils/logger';
import * as github from '@actions/github';

/**
 * Retrieves a GitHub runner registration token for the current repository.
 * This token is used to register a self-hosted runner with the GitHub repository.
 *
 * @param config - The configuration object containing the GitHub token.
 * @returns A promise that resolves to the registration token.
 * @throws Will throw an error if the token cannot be retrieved.
 */
export async function getGitHubRegistrationToken(config: Config): Promise<string> {
  // Destructure the owner and repo from the GitHub context.
  const { owner, repo } = github.context.repo;

  // Check if the GitHub token is provided.
  const octokit = github.getOctokit(config.githubToken!);

  // Create registration token for the repository.
  const response = await octokit.rest.actions.createRegistrationTokenForRepo({ owner, repo });

  // Check if the response contains a token.
  if (!response.data.token) {
    throw new Error(`Failed to retrieve GitHub runner registration token for ${owner}/${repo}.`);
  }

  // Log and return the token.
  logger.success('Successfully retrieved GitHub runner registration token.');
  return response.data.token;
}
