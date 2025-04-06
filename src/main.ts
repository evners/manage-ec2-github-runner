import * as core from '@actions/core';

async function run(): Promise<void> {
  try {
    core.info('🚀 Manage On-Demand EC2 GitHub Runner Action is ready.');
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message);
    }
  }
}

run();
