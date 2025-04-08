import * as core from '@actions/core';
import { _InstanceType, TagSpecification } from '@aws-sdk/client-ec2';

/**
 * Configuration class for the GitHub Action.
 * Reads and validates the input parameters.
 */
export class Config {
  readonly mode: 'start' | 'stop';
  readonly amiId?: string;
  readonly instanceType: _InstanceType;
  readonly instanceId?: string;
  readonly githubToken?: string;
  readonly minCount: number = 1;
  readonly maxCount: number = 1;
  readonly tags: TagSpecification[] = [];

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

    // Set the class properties based on the input parameters.
    this.mode = mode;
    this.amiId = core.getInput('ec2-ami') || undefined;
    this.instanceId = core.getInput('ec2-instance-id') || undefined;
    this.githubToken = core.getInput('github-token') || undefined;
    this.instanceType = (core.getInput('ec2-instance-type') || 't2.micro') as _InstanceType;

    // Validate the inputs.
    this.validate();
  }

  /**
   * Validates required fields depending on the mode.
   */
  private validate(): void {
    if (this.mode === 'start' && !this.amiId) {
      throw new Error('Input "ec2-ami" is required when mode is "start".');
    }

    if (this.mode === 'start' && !this.githubToken) {
      throw new Error('Input "github-token" is required when mode is "start".');
    }

    if (this.mode === 'stop' && !this.instanceId) {
      throw new Error('Input "ec2-instance-id" is required when stopping a runner.');
    }
  }
}
