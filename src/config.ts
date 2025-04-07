import * as core from '@actions/core';

/**
 * Configuration class for the GitHub Action.
 * Reads and validates the input parameters.
 */
export class Config {
  readonly mode: 'start' | 'stop';
  readonly amiId?: string;
  readonly awsRegion: string;
  readonly instanceType: string;
  readonly instanceId?: string;

  /**
   * Constructor for the Config class.
   * @throws Will throw an error if the input parameters are invalid.
   */
  constructor() {
    // Get the mode from the input parameters.
    const mode = core.getInput('mode', { required: true }) as 'start' | 'stop';

    // Validate the mode.
    if (!['start', 'stop'].includes(mode)) {
      throw new Error('"mode" must be either "start" or "stop".');
    }

    this.mode = mode;
    this.amiId = core.getInput('ec2-ami') || undefined;
    this.awsRegion = core.getInput('aws-region', { required: true });
    this.instanceId = core.getInput('ec2-instance-id') || undefined;
    this.instanceType = core.getInput('ec2-instance-type') || 't2.micro';

    // Validate the inputs.
    this.validate();
  }

  /**
   * Validates required fields depending on the mode.
   */
  private validate(): void {
    if (this.mode === 'start' && !this.amiId) {
      throw new Error('"ec2-ami" is required when mode is "start".');
    }

    if (this.mode === 'stop' && !this.instanceId) {
      throw new Error('"ec2-instance-id" is required when mode is "stop".');
    }
  }
}
