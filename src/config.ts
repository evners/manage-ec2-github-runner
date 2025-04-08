import * as core from '@actions/core';
import { _InstanceType, TagSpecification, VolumeType } from '@aws-sdk/client-ec2';

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
  readonly label?: string;

  // EBS volume settings.
  readonly blockDeviceName: string;
  readonly ebsVolumeSize: number;
  readonly ebsVolumeType: VolumeType = 'gp3';
  readonly ebsDeleteOnTermination: boolean = true;

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
    this.label = core.getInput('label') || undefined;
    this.amiId = core.getInput('ec2-ami') || undefined;
    this.instanceId = core.getInput('ec2-instance-id') || undefined;
    this.githubToken = core.getInput('github-token') || undefined;
    this.instanceType = (core.getInput('ec2-instance-type') || 't2.micro') as _InstanceType;

    // EBS volume settings.
    this.blockDeviceName = core.getInput('block-device-name') || '/dev/sda1';
    this.ebsVolumeSize = parseInt(core.getInput('ebs-volume-size') || '8', 10);
    this.ebsVolumeType = (core.getInput('ebs-volume-type') || 'gp3') as VolumeType;
    this.ebsDeleteOnTermination = (core.getInput('ebs-delete-on-termination') || true) as boolean;

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
