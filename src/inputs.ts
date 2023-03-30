import * as core from '@actions/core';
import {verifyURLString} from './utils';
const INDEXNOW_UPPER_LIMIT = 10000;

export type SinceUnit = 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year';
export type Endpoint =
  | 'api.indexnow.org'
  | 'www.bing.com'
  | 'search.seznam.cz'
  | 'yandex.com';

export type FailureStrategy = 'error' | 'ignore';

export interface Options {
  sitemapLocation: URL;
  key: string;
  keyLocation?: URL;
  since: number;
  sinceUnit: SinceUnit;
  endpoint: Endpoint;
  limit: number;
  timeout: number;
  failureStrategy: FailureStrategy;
}

export class InvalidInputError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidInputError';
  }
}

export function parseInputs(): Options {
  const sitemapLocation = parseSitemapLocationInput();
  const key = parseKeyInput();
  const keyLocation = parseKeyLocationInput();
  const since = parseSinceInput();
  const sinceUnit = parseSinceUnitInput();
  const endpoint = parseEndpointInput();
  const limit = parseLimitInput();
  const timeout = parseTimeoutInput();
  const failureStrategy = parseFailureStrategyInput();

  const options: Options = {
    sitemapLocation: sitemapLocation,
    key: key,
    keyLocation: keyLocation,
    since: since,
    sinceUnit: sinceUnit,
    endpoint: endpoint,
    limit: limit,
    timeout: timeout,
    failureStrategy: failureStrategy
  };

  return options;
}

export function parseSitemapLocationInput(): URL {
  const sitemapLocationInput = core.getInput('sitemap-location', {
    required: true
  });

  const {error, url} = verifyURLString(sitemapLocationInput);
  if (error || url === undefined) {
    throw new InvalidInputError(
      `sitemap-location with ${sitemapLocationInput} is invalid. ${error}.`
    );
  }
  return url;
}

export function parseKeyInput(): string {
  const keyInput = core.getInput('key', {required: true});
  if (keyInput.length <= 0) {
    throw new InvalidInputError('key with ${keyInput} is invalid.');
  }

  return keyInput;
}

export function parseKeyLocationInput(): URL | undefined {
  const keyLocationInput = core.getInput('key-location');
  if (keyLocationInput === undefined || keyLocationInput.length === 0) {
    return undefined;
  }
  const {error, url} = verifyURLString(keyLocationInput);
  if (error || url === undefined) {
    throw new InvalidInputError(
      `key-location with ${keyLocationInput} is invalid. ${error}.`
    );
  }
  return url;
}

export function parseSinceInput(): number {
  return parseIntegerInput('since');
}

export function parseSinceUnitInput(): SinceUnit {
  const sinceUnitInput = core.getInput('since-unit');
  if (isSinceUnit(sinceUnitInput)) {
    return sinceUnitInput;
  }
  throw new InvalidInputError(
    `since-unit with the value ${sinceUnitInput} is not available.`
  );
}

export function isSinceUnit(unit: string): unit is SinceUnit {
  return (
    unit === 'minute' ||
    unit === 'hour' ||
    unit === 'day' ||
    unit === 'week' ||
    unit === 'month' ||
    unit === 'year'
  );
}

export function parseEndpointInput(): Endpoint {
  const endpointInput = core.getInput('endpoint');
  if (isEndpoint(endpointInput)) {
    return endpointInput;
  }

  throw new InvalidInputError(
    `endpoint with the value ${endpointInput} is not available.`
  );
}

export function isEndpoint(endpoint: string): endpoint is Endpoint {
  return (
    endpoint === 'api.indexnow.org' ||
    endpoint === 'www.bing.com' ||
    endpoint === 'search.seznam.cz' ||
    endpoint === 'yandex.com'
  );
}

export function parseLimitInput(): number {
  const limitInput = parseIntegerInput('limit');
  if (limitInput <= INDEXNOW_UPPER_LIMIT) {
    return limitInput;
  }
  throw new InvalidInputError(
    `limit with the value ${limitInput} exceeds upper limit. the upper limit is ${INDEXNOW_UPPER_LIMIT}.`
  );
}

export function parseTimeoutInput(): number {
  return parseIntegerInput('timeout');
}

export function parseFailureStrategyInput(): FailureStrategy {
  const failureStrategyInput = core.getInput('failure-strategy');
  if (isFailureStrategy(failureStrategyInput)) {
    return failureStrategyInput;
  }
  throw new InvalidInputError(
    `failure-strategy with the value ${failureStrategyInput} is not available.`
  );
}

export function isFailureStrategy(
  failureStrategy: string
): failureStrategy is FailureStrategy {
  return failureStrategy === 'error' || failureStrategy === 'ignore';
}

function parseIntegerInput(inputName: string, positiveRequired = true): number {
  const input = core.getInput(inputName);
  const integer = parseInt(input, 10);
  if (isNaN(integer)) {
    throw new InvalidInputError(
      `${inputName} with the value ${inputName} is invalid format.`
    );
  }
  if (positiveRequired && integer <= 0) {
    throw new InvalidInputError(
      `${inputName} with the value ${inputName} is invalid format. The value must be greater than zero.`
    );
  }
  return integer;
}
