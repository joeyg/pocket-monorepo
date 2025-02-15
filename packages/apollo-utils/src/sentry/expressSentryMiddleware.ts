import * as Sentry from '@sentry/node';
import http from 'http';

/**
 * Sets common variables for Sentry tracing
 * Usage:
 * ```ts
 * app.use(sentryPocketMiddleware)
 * ```
 * @param req Express request
 */
export const sentryPocketMiddleware = (
  req: http.IncomingMessage,
  _: http.ServerResponse,
  next: (error?: any) => void,
) => {
  const scope = Sentry.getCurrentScope();
  // Set tracking data for Sentry
  scope.setUser({
    id: (req.headers.encodedid as string) || undefined,
    // Use the gateway ip address because this is behind a non-standard proxy
    ip_address:
      (req.headers.gatewayipaddress as string) ||
      (req.headers['origin-client-ip'] as string) ||
      undefined,
  });
  scope.setTag('pocket-api-id', (req.headers.apiid || '0') as string);
  next();
};
