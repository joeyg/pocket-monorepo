import { config } from './config';
import * as Sentry from '@sentry/aws-serverless';
Sentry.init({
  dsn: config.app.sentry.dsn,
  release: config.app.sentry.release,
  environment: config.app.environment,
  serverName: config.app.name,
});
import type {
  SQSEvent,
  SQSBatchResponse,
  SQSBatchItemFailure,
} from 'aws-lambda';

import { handlers } from './handlers';

/**
 * The main handler function which will be wrapped by Sentry prior to export.
 * Processes messages originating from event bridge. The detail-type field in
 * the message is used to determine which handler should be used for processing.
 * @param event
 * @returns
 */
export async function processor(event: SQSEvent): Promise<SQSBatchResponse> {
  const batchFailures: SQSBatchItemFailure[] = [];
  for await (const record of event.Records) {
    try {
      const message = JSON.parse(JSON.parse(record.body).Message);
      if (handlers[message['detail-type']] == null) {
        const errorData = {
          'detail-type': message['detail-type'],
          source: message['source'],
        };
        console.log(`Missing handler.`, { message, data: errorData });
        batchFailures.push({ itemIdentifier: record.messageId });
        continue;
      }
      await handlers[message['detail-type']](record);
    } catch (error) {
      console.log(error);
      Sentry.captureException(error);
      batchFailures.push({ itemIdentifier: record.messageId });
    }
  }
  return { batchItemFailures: batchFailures };
}

export const handler = Sentry.wrapHandler(processor);
