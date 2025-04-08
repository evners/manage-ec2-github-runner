import { Config } from '../config';
import { Octokit } from '@octokit/rest';

/**
 * Creates a GitHub client using the provided configuration.
 * This client is used to interact with the GitHub API.
 *
 * @param config Configuration object containing GitHub token and other settings.
 * @returns An authenticated GitHub client.
 * @throws Will throw an error if the GitHub token is not provided.
 */
export function createGitHubClient(config: Config): Octokit {
  // Check if the GitHub token is provided.
  if (!config.githubToken) {
    throw new Error('GitHub token is required to interact with GitHub API.');
  }

  // Create and return an authenticated GitHub client.
  return new Octokit({
    auth: config.githubToken,
  });
}
