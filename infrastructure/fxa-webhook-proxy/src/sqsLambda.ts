import { Construct } from 'constructs';
import { config } from './config';
import {
  LAMBDA_RUNTIMES,
  PocketSQSWithLambdaTarget,
  PocketVPC,
} from '@pocket-tools/terraform-modules';
import { getEnvVariableValues } from './utilities';
import { dataAwsSnsTopic, sqsQueue } from '@cdktf/provider-aws';

export class SqsLambda extends Construct {
  constructor(
    scope: Construct,
    private name: string,
    private vpc: PocketVPC,
    private sqsQueue: sqsQueue.SqsQueue,
    alertSnsTopic: dataAwsSnsTopic.DataAwsSnsTopic,
  ) {
    super(scope, name);

    const { sentryDsn } = getEnvVariableValues(this);

    new PocketSQSWithLambdaTarget(this, 'fxa-events-sqs-lambda', {
      name: `${config.prefix}-Sqs-FxA-Events`,
      // set batchSize to something reasonable
      batchSize: 1, // Setting batch size to one so we can control concurreny easily until we get logging and errors a little clearer.
      batchWindow: 60,
      configFromPreexistingSqsQueue: {
        name: sqsQueue.name,
      },
      lambda: {
        runtime: LAMBDA_RUNTIMES.NODEJS20,
        handler: 'index.handler',
        timeout: 120,
        environment: {
          REGION: vpc.region,
          JWT_KEY: config.sqsLambda.jwtKey,
          SENTRY_DSN: sentryDsn,
          ENVIRONMENT:
            config.environment === 'Prod' ? 'production' : 'development',
        },
        ignoreEnvironmentVars: ['GIT_SHA'],
        vpcConfig: {
          securityGroupIds: vpc.internalSecurityGroups.ids,
          subnetIds: vpc.privateSubnetIds,
        },
        codeDeploy: {
          region: vpc.region,
          accountId: vpc.accountId,
        },
        executionPolicyStatements: [
          {
            actions: ['secretsmanager:GetSecretValue', 'kms:Decrypt'],
            resources: [
              `arn:aws:secretsmanager:${vpc.region}:${vpc.accountId}:secret:FxAWebhookProxy/${config.environment}`,
              `arn:aws:secretsmanager:${vpc.region}:${vpc.accountId}:secret:FxAWebhookProxy/${config.environment}/*`,
            ],
          },
        ],
        alarms: {
          // TODO: set better alarm values
          /*
          errors: {
            evaluationPeriods: 3,
            period: 3600, // 1 hour
            threshold: 20,
            actions: config.isProd
              ? [alertSnsTopic.arn]
              : [],
          },
          */
        },
      },
      tags: config.tags,
    });
  }
}
