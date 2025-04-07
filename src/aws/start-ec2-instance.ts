import { Config } from '../config';
import { logger } from '../utils/logger';
import { createEc2Client } from './ec2-client';
import { RunInstancesCommand, _InstanceType } from '@aws-sdk/client-ec2';

/**
 * Starts an EC2 instance using the specified AMI and instance type.
 * @param ec2Client - The EC2 client to use for making API calls.
 * @returns A promise that resolves when the instance is started.
 */
export async function startEc2Instance(config: Config): Promise<string> {
  // Create an EC2 client.
  const ec2 = createEc2Client(config.awsRegion);

  // Create a new command to run the instance.
  const command: RunInstancesCommand = new RunInstancesCommand({
    ImageId: config?.amiId,
    InstanceType: config?.instanceType as _InstanceType,
    MinCount: 1,
    MaxCount: 1,
    TagSpecifications: [
      {
        ResourceType: 'instance',
        Tags: [{ Key: 'Name', Value: 'github-runner' }],
      },
    ],
  });

  // Extract the instance ID from the response.
  const { Instances } = await ec2.send(command);
  const instanceId = Instances?.[0]?.InstanceId;

  // Verify that the instance ID was returned.
  if (!instanceId) {
    throw new Error('Failed to launch EC2 instance');
  }

  // Log the successful launch of the instance.
  logger.info(`EC2 launched: ${instanceId}`);
  return instanceId;
}
