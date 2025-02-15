import { NextFunction, Request, Response, Router } from 'express';
import { setSavedItemsVariables } from '../graph/get/toGraphQL';
import { callSavedItemsByOffsetComplete } from '../graph/graphQLClient';
import {
  savedItemsFetchSharesToRest,
  savedItemsFetchToRest,
} from '../graph/get/toRest';
import { checkSchema, validationResult, matchedData } from 'express-validator';
import { V3FetchParams, V3FetchSchema } from './validations/FetchSchema';
import { InputValidationError } from '../errors/InputValidationError';
import { V3GetParams } from './validations';
import { FetchResponse, GetSharesResponse } from '../graph/types';
import { asyncHandler } from '../middleware/asyncHandler';

const router: Router = Router();

/**
 * Shared controller logic for POST and GET for /v3/fetch endpoint
 * The Web repo supports both to this route, so we must be backwards compatible.
 * @param methodName Whether it's a POST or GET method -- just affects error
 * message prefix.
 */
const v3FetchController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const result = validationResult(req);
  const data = matchedData(req, { includeOptionals: false }) as V3FetchParams;
  if (!result.isEmpty()) {
    throw new InputValidationError(result.array({ onlyFirstError: true })[0]);
  }
  const headers = req.headers;
  const accessToken = (data.access_token as string) ?? null;
  const consumerKey = (data.consumer_key as string) ?? null;
  const graphResponse = await processV3call(
    accessToken,
    consumerKey,
    headers,
    data,
  );
  return graphResponse;
};

router.get(
  '/',
  checkSchema(V3FetchSchema, ['query']),
  asyncHandler(async (req, res, next) => {
    const result = await v3FetchController(req, res, next);
    res.json(result);
  }),
);
router.post(
  '/',
  checkSchema(V3FetchSchema, ['body']),
  asyncHandler(async (req, res, next) => {
    const result = await v3FetchController(req, res, next);
    res.json(result);
  }),
);

/**
 * function call to get saves from graphQL and convert it to v3 Fetch response
 * @param accessToken user access token
 * @param consumerKey user consumer key
 * @param variables input variables required for the graphql query
 * @param headers request headers. treated as blackbox pass through for proxy
 */
export async function processV3call(
  accessToken: string,
  consumerKey: string,
  headers: any,
  data: V3FetchParams,
): Promise<FetchResponse | (FetchResponse & GetSharesResponse)> {
  if (data.offset == 0) {
    data.count = 25; // set the intial page size to a smaller value to allow the user to see something as quickly as possible
  }
  const options = {
    withAnnotations: data.annotations,
    withTagsList: data.taglist || data.forcetaglist,
    withAccountData: false,
    withRecentSearches: false,
  };
  // This time is only set if taglist is requested and 'since' is provided;
  // 'forcetaglist' overrides the 'since' check
  const tagListSince =
    data.taglist && data.since
      ? new Date(data.since * 1000).toISOString()
      : undefined;
  if (tagListSince) options['tagListSince'] = tagListSince;
  const params: V3GetParams = {
    detailType: 'complete',
    total: true,
    access_token: accessToken,
    consumer_key: consumerKey,
    count: data.count,
    offset: data.offset,
    sort: 'newest',
    annotations: data.annotations,
    state: 'unread',
    taglist: data.taglist,
    forcetaglist: data.forcetaglist,
    hasAnnotations: data.hasAnnotations,
    account: false,
    forceaccount: false,
    updatedBefore: data.updatedBefore,
    premium: false,
    forcepremium: false,
  };

  // Otherwise call SavedItems list api
  const variables = setSavedItemsVariables(params);

  const response = await callSavedItemsByOffsetComplete(
    accessToken,
    consumerKey,
    headers,
    { ...variables, ...options },
  );

  const nextChunkSize = '250'; // Every chunk after the first one is always 250. This informs the client how many to download next.

  if (data.shares) {
    return savedItemsFetchSharesToRest(
      {
        fetchChunkSize: nextChunkSize,
        firstChunkSize: params.count.toFixed(),
        chunk: data.chunk.toFixed(),
      },
      response,
      options,
    );
  }

  return savedItemsFetchToRest(
    {
      fetchChunkSize: nextChunkSize,
      firstChunkSize: params.count.toFixed(),
      chunk: data.chunk.toFixed(),
    },
    response,
    options,
  );
}

export default router;
