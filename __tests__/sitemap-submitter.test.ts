import {beforeAll, describe, test, expect, jest} from '@jest/globals';
import {URLSet} from '../src/sitemap-handler';
import SitemapSubmitter from '../src/sitemap-submitter';
import {Options} from '../src/inputs';

describe('sitemap-submitter test cases', () => {
  test('empty url set should not submit', async () => {
    const sitemapSubmitter = new SitemapSubmitter();
    const sitemaps: URLSet = {
      urls: []
    };
    const options: Options = {
      sitemapLocation: new URL('https://bojieyang.github.io/sitemap.xml'),
      key: '',
      since: 1,
      sinceUnit: 'day',
      endpoint: 'www.bing.com',
      limit: 100,
      timeout: 10000,
      failureStrategy: 'error'
    };

    const submitResponse = await sitemapSubmitter.submit(sitemaps, options);
    expect(submitResponse.response).toStrictEqual('OK');
    expect(submitResponse.reason).toStrictEqual(
      'no link needs to be submitted.'
    );
  });

  test('invalid key should submit failed and response Forbidden', async () => {
    const sitemapSubmitter = new SitemapSubmitter();
    const sitemaps: URLSet = {
      urls: [
        {
          loc: new URL(
            'https://bojieyang.github.io/posts/my-first-github-action-released/'
          )
        }
      ]
    };
    const options: Options = {
      sitemapLocation: new URL('https://bojieyang.github.io/sitemap.xml'),
      key: 'feakkey',
      since: 1,
      sinceUnit: 'day',
      endpoint: 'www.bing.com',
      limit: 100,
      timeout: 10000,
      failureStrategy: 'error'
    };

    const submitResponse = await sitemapSubmitter.submit(sitemaps, options);
    expect(submitResponse.response).toStrictEqual('Unprocessable Entity');
  });

  test('valid key should submit successfully', async () => {
    const indexNowKey = process.env['INDEXNOW_KEY']
      ? process.env['INDEXNOW_KEY']
      : '';
    if (indexNowKey.length === 0) {
      // means it can not get key from env, happened on call reuseable-action
      return;
    }
    expect(indexNowKey.length).toBeGreaterThan(0);
    const sitemapSubmitter = new SitemapSubmitter();
    const sitemaps: URLSet = {
      urls: [
        {
          loc: new URL(
            'https://bojieyang.github.io/posts/a-few-life-hacks-keep-me-slim/'
          )
        }
      ]
    };
    const options: Options = {
      sitemapLocation: new URL('https://bojieyang.github.io/sitemap.xml'),
      key: indexNowKey, // get it from env,
      since: 1,
      sinceUnit: 'day',
      endpoint: 'www.bing.com',
      limit: 100,
      timeout: 10000,
      failureStrategy: 'error'
    };

    const submitResponse = await sitemapSubmitter.submit(sitemaps, options);
    expect(submitResponse.response).toStrictEqual('OK');
  });
});
