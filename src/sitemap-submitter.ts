import {URLItem, URLSet} from './sitemap-handler';
import {Options} from './inputs';

/**
 * Response format. see https://www.indexnow.org/documentation
 */
const StatusResponseMapping = new Map([
  [200, {response: 'OK', reason: 'URL submitted successfully.'}],
  [
    202,
    {
      response: 'Accepted',
      reason: 'URL received. IndexNow key validation pending.'
    }
  ],
  [400, {response: 'Bad request', reason: 'Invalid format.'}],
  [
    403,
    {
      response: 'Forbidden',
      reason:
        'In case of key not valid (e.g. key not found, file found but key not in the file).'
    }
  ],
  [
    422,
    {
      response: 'Unprocessable Entity',
      reason:
        "In case of URLs which don't belong to the host or the key is not matching the schema in the protocol."
    }
  ],
  [
    429,
    {
      response: 'Too Many Requests',
      reason: 'Too Many Requests (potential Spam).'
    }
  ]
]);
export default class SitemapSubmitter {
  async submit(sitemaps: URLSet, options: Options) {
    if (sitemaps.urls.length === 0) {
      return {
        response: 'OK',
        reason: 'no link needs to be submitted.'
      };
    }
    const submitUrl = 'https://' + options.endpoint + '/indexnow';
    const submitOptions = {
      signal: AbortSignal.timeout(options.timeout),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: this.buildSubmitData(sitemaps.urls, options)
    };
    try {
      const submitResponse = await fetch(submitUrl, submitOptions);

      const response = StatusResponseMapping.get(submitResponse.status);
      return response !== undefined
        ? response
        : {
            response: 'Unknown Error',
            reason: 'Reason is not defined in IndexNow protocol.'
          };
    } catch (err: any) {
      const error = err as Error;
      return {response: error.name, reason: error.message};
    }
  }

  buildSubmitData(urls: URLItem[], options: Options): string {
    const data: any = {
      host: options.sitemapLocation.host,
      key: options.key
    };

    if (options.keyLocation) {
      data.keyLocation = options.keyLocation;
    }
    data.urlList = urls.map(url => url.loc.href);

    return JSON.stringify(data);
  }
}
