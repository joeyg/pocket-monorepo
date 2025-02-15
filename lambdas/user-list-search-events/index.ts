import { config } from './config';
import * as Sentry from '@sentry/aws-serverless';
Sentry.init({
  ...config.sentry,
  debug: config.sentry.environment == 'development',
});
import { SQSEvent } from 'aws-lambda';
import { handlerMap } from './handlerMap';

/**
 * Processes messages originating from event bridge. The detail-type field in
 * the message is used to determine which handler should be used for processing.
 * @param event
 * @returns
 */
async function __handler(event: SQSEvent): Promise<any> {
  for await (const record of event.Records) {
    try {
      const message = JSON.parse(JSON.parse(record.body).Message);
      // Ignore messages we don't have handlers for -- they can just pass through
      if (handlerMap[message['detail-type']] != null) {
        await handlerMap[message['detail-type']](record);
      }
    } catch (error) {
      console.log(error);
      Sentry.captureException(error, {
        data: {
          type: 'userListSearchEventHandler',
          error,
          event: JSON.stringify(event),
        },
      });
      throw error;
    }
  }
  return {};
}

export const handler = Sentry.wrapHandler(__handler, {
  captureTimeoutWarning: false,
});
