// Environment variables below are set in
// pocket-monorepo/infrastructure/parser-graphql-wrapper/src/main.ts

const awsEnvironments = ['production', 'development'];
let localAwsEndpoint: string = undefined;
if (!awsEnvironments.includes(process.env.NODE_ENV)) {
  localAwsEndpoint = process.env.AWS_ENDPOINT || 'http://localhost:4566';
}

export default {
  // Same as domain prefix in .aws/src/config
  serviceName: 'parser-graphql-wrapper',
  tracing: {
    graphQLDepth: 8, // very permissive limit on depth tracing
    samplingRatio: 0.01,
    grpcDefaultPort: 4317,
    httpDefaultPort: 4318,
    serviceName: 'parser-graphql-wrapper',
    host: process.env.OTLP_COLLECTOR_HOST || 'localhost',
  },
  app: {
    environment: process.env.NODE_ENV || 'development',
    defaultMaxAge: 21100, // ~6 hours
    serverPort: 4001,
    maxRequestSize: '1mb',
  },
  aws: {
    region: process.env.AWS_REGION || 'us-east-1',
    endpoint: localAwsEndpoint,
    maxBackoff: 3000, // in ms, max amount of backoff time allowed for multiple requests
  },
  redis: {
    primaryEndpoint: process.env.REDIS_PRIMARY_ENDPOINT || 'localhost',
    readerEndpoint: process.env.REDIS_READER_ENDPOINT || 'localhost',
    port: process.env.REDIS_PORT ?? '6379',
    isCluster: process.env.REDIS_IS_CLUSTER
      ? JSON.parse(process.env.REDIS_IS_CLUSTER)
      : false,
    isTLS: process.env.REDIS_IS_TLS
      ? JSON.parse(process.env.REDIS_IS_TLS)
      : false,
  },
  sentry: {
    dsn: process.env.SENTRY_DSN || '',
    release: process.env.GIT_SHA || '',
    environment: process.env.NODE_ENV || 'development',
  },
  shortUrl: {
    apiId: 106698, //braze consumer
    userId: 59868094, //test user account
    serviceId: 10, //arbitary value for now
    //data fetched from: Web/symfony_config/.env
    //https://github.com/Pocket/Web/blob/16a0b582dfbd443d18f96f0f54163a9d50f3f6ab/symfony_config/.env#L160
    short_prefix: process.env.SHORT_PREFIX || 'local.co/b',
    short_prefix_secure: process.env.SHORT_PREFIX_SECURE || 'local.co/a',
    shortCodeChars:
      process.env.SHORT_CODE_CHARS ||
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNPQRSTUVWXYZ123456789_',
    collectionUrl:
      process.env.COLLECTIONS_URL || 'https://getpocket.com/collections',
  },
  mysql: {
    host: process.env.DB_HOST || 'localhost',
    port: 3306,
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
    tz: process.env.DATABASE_TZ || 'US/Central',
  },
  pocketSharedRds: {
    host: process.env.POCKET_SHARES_DATABASE_WRITE_HOST || 'localhost',
    port: 3306,
    username: process.env.POCKET_SHARES_DATABASE_WRITE_USER || 'root',
    password: process.env.POCKET_SHARES_DATABASE_WRITE_PASSWORD || '',
  },
  parser: {
    baseEndpoint:
      process.env.PARSER_BASE_ENDPOINT || 'http://example-parser.com',
    dataPath: process.env.PARSER_DATA_PATH || '/wrapper',
    retries: 3,
    timeout: 5,
  },
  dynamoDb: {
    itemSummaryTable: {
      name: process.env.ITEM_SUMMARY_TABLE || 'PARSER-local-item-summary',
      ttl: 30 * 24 * 60 * 60 * 1000, // ~30 days in ms
    },
  },
  unleash: {
    clientKey: process.env.UNLEASH_KEY || 'unleash-key-fake',
    endpoint: process.env.UNLEASH_ENDPOINT || 'http://localhost:4242/api',
    refreshInterval: 60 * 1000, // ms
    timeout: 2 * 1000, // ms
    namePrefix: 'temp.backend',
    flags: {
      openGraphParser: {
        name: 'temp.backend.open_graph_parser',
        fallback: false,
      },
    },
  },
};
