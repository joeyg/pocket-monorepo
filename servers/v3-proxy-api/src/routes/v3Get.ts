import { NextFunction, Request, Response, Router } from 'express';
import {
  setSavedItemsVariables,
  setSearchVariables,
} from '../graph/get/toGraphQL';
import {
  callSavedItemsByOffsetSimple,
  callSavedItemsByOffsetComplete,
  callSearchByOffsetComplete,
  callSearchByOffsetSimple,
} from '../graph/graphQLClient';
import {
  savedItemsSimpleToRest,
  savedItemsCompleteToRest,
  savedItemsSimpleTotalToRest,
  searchSavedItemCompleteToRest,
  searchSavedItemCompleteTotalToRest,
  savedItemsCompleteTotalToRest,
  searchSavedItemSimpleTotalToRest,
  searchSavedItemSimpleToRest,
} from '../graph/get/toRest';
import { checkSchema, validationResult, matchedData } from 'express-validator';
import { V3GetParams, V3GetSchema } from './validations';
import { InputValidationError } from '../errors/InputValidationError';
import { asyncHandler } from '../middleware/asyncHandler';

const router: Router = Router();

/**
 * Shared controller logic for POST and GET for /v3/get endpoint
 * The Web repo supports both to this route, so we must be backwards compatible.
 * @param methodName Whether it's a POST or GET method -- just affects error
 * message prefix.
 */
const v3GetController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const result = validationResult(req);
  const data = matchedData(req, { includeOptionals: false }) as V3GetParams;
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
  checkSchema(V3GetSchema, ['query']),
  asyncHandler(async (req, res, next) => {
    const result = await v3GetController(req, res, next);
    res.json(result);
  }),
);
router.post(
  '/',
  checkSchema(V3GetSchema, ['body']),
  asyncHandler(async (req, res, next) => {
    const result = await v3GetController(req, res, next);
    res.json(result);
  }),
);

/**
 * function call to get saves from graphQL and convert it to v3 Get response
 * @param accessToken user access token
 * @param consumerKey user consumer key
 * @param variables input variables required for the graphql query
 * @param headers request headers. treated as blackbox pass through for proxy
 */
export async function processV3call(
  accessToken: string,
  consumerKey: string,
  headers: any,
  data: V3GetParams,
) {
  const options = {
    withAnnotations: data.annotations,
    withTagsList: data.taglist || data.forcetaglist,
    withAccountData: data.account || data.forceaccount,
    withRecentSearches: data.premium || data.forcepremium,
  };
  // This time is only set if taglist is requested and 'since' is provided;
  // 'forcetaglist' overrides the 'since' check
  const tagListSince =
    data.taglist && data.since
      ? new Date(data.since * 1000).toISOString()
      : undefined;
  if (tagListSince) options['tagListSince'] = tagListSince;
  // Search takes precedence -- if search term is passed, call search api
  if (data.search) {
    const variables = setSearchVariables(data);
    if (data.detailType === 'complete') {
      const response = await callSearchByOffsetComplete(
        accessToken,
        consumerKey,
        headers,
        { ...variables, ...options },
      );
      if (data.total) {
        return searchSavedItemCompleteTotalToRest(response, options);
      } else {
        return searchSavedItemCompleteToRest(response, options);
      }
    }
    const response = await callSearchByOffsetSimple(
      accessToken,
      consumerKey,
      headers,
      { ...variables, ...options },
    );
    if (data.total) {
      return searchSavedItemSimpleTotalToRest(response, options);
    } else {
      return searchSavedItemSimpleToRest(response, options);
    }
  } else {
    // Otherwise call SavedItems list api
    const variables = setSavedItemsVariables(data);
    // Otherwise, request savedItems for the user
    // Documenting additional parameters which change the shape of the response,
    // that have not been used in the past year (not including in proxy):
    //   - includeOpenUrl
    //   - extended
    if (data.detailType === 'complete') {
      const response = await callSavedItemsByOffsetComplete(
        accessToken,
        consumerKey,
        headers,
        { ...variables, ...options },
      );
      if (data.total) {
        return savedItemsCompleteTotalToRest(response, options);
      } else {
        return savedItemsCompleteToRest(response, options);
      }
    }
    const response = await callSavedItemsByOffsetSimple(
      accessToken,
      consumerKey,
      headers,
      { ...variables, ...options },
    );
    if (data.total) {
      return savedItemsSimpleTotalToRest(response, options);
    } else {
      return savedItemsSimpleToRest(response, options);
    }
  }
}

export default router;
