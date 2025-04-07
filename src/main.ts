import * as core from '@actions/core';
import { EC2Client, RunInstancesCommand, RunInstancesCommandInput, _InstanceType } from '@aws-sdk/client-ec2';

async function run(): Promise<void> {
  try {
    // Read required inputs from the workflow.
    const amiId: string = core.getInput('ec2-ami', { required: true });
    const awsRegion: string = core.getInput('aws-region', { required: true });

    // Read optional inputs with default values.
    const instanceType: _InstanceType = (core.getInput('ec2-instance-type') || 't2.micro') as _InstanceType;

    // Initialize the EC2 client with the specified AWS region.
    const ec2Client: EC2Client = new EC2Client({ region: awsRegion });

    // Prepare parameters for the EC2 RunInstances command.
    const runInstancesParams: RunInstancesCommandInput = {
      ImageId: amiId,
      InstanceType: instanceType,
      MinCount: 1,
      MaxCount: 1,
      TagSpecifications: [
        {
          ResourceType: 'instance',
          Tags: [
            {
              Key: 'Name',
              Value: 'github-runner',
            },
          ],
        },
      ],
    };

    // Create and send the RunInstances command.
    const runInstancesCommand = new RunInstancesCommand(runInstancesParams);
    const { Instances } = await ec2Client.send(runInstancesCommand);

    // Retrieve and output the instance ID.
    const instanceId: string | undefined = Instances?.[0]?.InstanceId;

    // If an instance ID is returned, output it; otherwise, fail the action.
    if (instanceId) {
      core.setOutput('instance-id', instanceId);
      core.info(`🚀 EC2 instance launched successfully: ${instanceId}`);
    } else {
      throw new Error('Failed to launch EC2 instance: No instance ID returned.');
    }
  } catch (error: unknown) {
    // Handle any errors and fail the action.
    core.setFailed(error instanceof Error ? error.message : String(error));
  }
}

run();
