import { Config } from '../config';
import { createUserData } from './create-user-data';
import { generateLabel } from '../utils/generate-label';
import { BlockDeviceMapping, EC2Client, RunInstancesCommand, TagSpecification } from '@aws-sdk/client-ec2';

/**
 * Represents the data returned after starting an EC2 instance.
 *
 * @property {string} instanceId - The ID of the launched EC2 instance.
 * @property {string} label - The label assigned to the GitHub Actions runner.
 */
export type Ec2InstanceData = {
  instanceId: string;
  label: string;
};

/**
 * Starts an EC2 instance configured as a GitHub Actions runner.
 *
 * @param config - The action configuration.
 * @param token - GitHub runner registration token.
 * @returns Object containing the instance ID and runner label.
 */
export async function startEc2Instance(config: Config, token: string): Promise<Ec2InstanceData> {
  // Validate AMI ID.
  if (!config.amiId) {
    throw new Error('AMI ID is required to launch an EC2 instance.');
  }

  // Create a label, user data, and EC2 client.
  const label: string = generateLabel();
  const userData: string = createUserData(token, label);
  const ec2Client: EC2Client = new EC2Client();

  // Create the tag specifications for the instance.
  // If tags are provided in the config, use them; otherwise, create a default tag with the label.
  const tagSpecifications: TagSpecification[] =
    config.tags?.length > 0
      ? config.tags
      : [
          {
            ResourceType: 'instance',
            Tags: [{ Key: 'Name', Value: label }],
          },
        ];

  // Create the block device mapping for the instance.
  const blockDeviceMappings: BlockDeviceMapping[] = [
    {
      DeviceName: config.blockDeviceName,
      Ebs: {
        VolumeSize: config.ebsVolumeSize,
        VolumeType: config.ebsVolumeType,
        DeleteOnTermination: config.ebsDeleteOnTermination,
      },
    },
  ];

  // Create a new command to run the instance.
  const runInstancesCommand: RunInstancesCommand = new RunInstancesCommand({
    ImageId: config.amiId,
    InstanceType: config.instanceType,
    MinCount: config.minCount,
    MaxCount: config.maxCount,
    UserData: userData,
    TagSpecifications: tagSpecifications,
    BlockDeviceMappings: blockDeviceMappings,
  });

  // Extract the instance ID from the response.
  const { Instances } = await ec2Client.send(runInstancesCommand);
  const instanceId = Instances?.[0]?.InstanceId;

  // Verify that the instance ID was returned.
  if (!instanceId) {
    throw new Error('Failed to launch EC2 instance');
  }

  // Return the instance ID and label.
  return { instanceId, label };
}
