import { EC2Client } from '@aws-sdk/client-ec2';

/**
 * Creates an EC2 client with the specified region.
 *
 * @param region - The AWS region to connect to.
 * @returns An instance of the EC2Client.
 */
export function createEc2Client(region: string): EC2Client {
  return new EC2Client({ region });
}
