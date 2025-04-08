import * as core from '@actions/core';
import { _InstanceType, TagSpecification, VolumeType } from '@aws-sdk/client-ec2';

/**
 * Configuration class for the GitHub Action.
 * Reads and validates the input parameters.
 */
export class Config {
  // Global.
  readonly mode: 'start' | 'stop';

  // GitHub - Runner.
  readonly label?: string;
  readonly githubToken?: string;
  readonly timeoutMinutes: number;
  readonly retryIntervalSeconds: number;
  readonly quietPeriodSeconds: number;

  // AWS - EC2.
  readonly amiId?: string;
  readonly subnetId?: string;
  readonly securityGroupId?: string;
  readonly minCount: number = 1;
  readonly maxCount: number = 1;
  readonly instanceId?: string;
  readonly instanceType: _InstanceType;
  readonly tags: TagSpecification[] = [];
  readonly instanceRunningTimeoutSeconds: number;

  // AWS - EBS.
  readonly ebsVolumeSize: number;
  readonly ebsVolumeType: VolumeType = 'gp3';
  readonly blockDeviceName: string;
  readonly ebsDeleteOnTermination: boolean = true;

  /**
   * Constructor for the Config class.
   * @throws Will throw an error if the input parameters are invalid.
   */
  constructor() {
    // Global.
    this.mode = core.getInput('mode', { required: true }) as 'start' | 'stop';

    // GitHub - Runner.
    this.label = core.getInput('label') || undefined;
    this.githubToken = core.getInput('github-token') || undefined;
    this.timeoutMinutes = parseInt(core.getInput('runner-timeout-minutes') || '5', 10);
    this.retryIntervalSeconds = parseInt(core.getInput('runner-retry-seconds') || '5', 10);
    this.quietPeriodSeconds = parseInt(core.getInput('runner-quiet-seconds') || '30', 10);

    // AWS - EC2.
    this.amiId = core.getInput('ec2-ami') || undefined;
    this.subnetId = core.getInput('subnet-id') || undefined;
    this.securityGroupId = core.getInput('security-group-id') || undefined;
    this.instanceId = core.getInput('ec2-instance-id') || undefined;
    this.instanceType = (core.getInput('ec2-instance-type') || 't2.micro') as _InstanceType;
    this.instanceRunningTimeoutSeconds = parseInt(core.getInput('instance-running-timeout') || '300', 10);

    // AWS - EBS.
    this.ebsVolumeSize = parseInt(core.getInput('ebs-volume-size') || '8', 10);
    this.ebsVolumeType = (core.getInput('ebs-volume-type') || 'gp3') as VolumeType;
    this.blockDeviceName = core.getInput('block-device-name') || '/dev/sda1';
    this.ebsDeleteOnTermination = (core.getInput('ebs-delete-on-termination') || true) as boolean;

    // Validate inputs.
    this.validate();
  }

  /**
   * Validates required fields depending on the mode.
   */
  private validate(): void {
    // Validate the mode.
    if (!['start', 'stop'].includes(this.mode)) {
      throw new Error('Input "mode" must be either "start" or "stop".');
    }

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
