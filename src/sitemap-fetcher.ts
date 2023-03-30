import fetch from 'cross-fetch';
import timeoutSignal from './timeout-signal';
import {verifyURLString} from './utils';
export class InvalidURLError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidURLError';
  }
}
export class TimeoutError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TimeoutError';
  }
}

export class FetchError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FetchError';
  }
}

export const SitemapFetcher = {
  async fetch(urlString: string, timeout: number): Promise<string> {
    const {error, url} = verifyURLString(urlString);
    if (error) {
      throw new InvalidURLError(error);
    }
    if (url === undefined) {
      throw new InvalidURLError(`parse ${urlString} return undefined.`);
    }

    try {
      const options = {
        //signal: AbortSignal.timeout(timeout)
        signal: timeoutSignal(timeout)
      };
      const response = await fetch(url.href, options);
      const body = await response.text();
      return body;
    } catch (err: any) {
      if (err.name === 'TimeoutError') {
        throw new TimeoutError(err.message);
      } else if (err.name === 'AbortError') {
        throw new TimeoutError(err.message);
      } else if (err.name === 'TypeError') {
        throw new InvalidURLError(err.message);
      } else {
        // A network error, or some other problem.
        throw new FetchError(`${err.name}, message: ${err.message}`);
      }
    }
  }
};
