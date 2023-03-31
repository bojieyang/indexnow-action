import {beforeAll, describe, test, expect, jest} from '@jest/globals';
import AtomHandler from '../src/atom-handler';
import RSSHandler from '../src/rss-handler';
import SitemapProcessor from '../src/sitemap-processor';
import XMLSitemapHandler from '../src/xml-sitemap-handler';
import {SitemapFetcher} from '../src/sitemap-fetcher';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import SitemapIndexHandler from '../src/sitemapindex-handler';
import * as Inputs from '../src/inputs';

jest.spyOn(Inputs, 'parseInputs').mockImplementation(() => {
  return {
    sitemapLocation: new URL('https://bojieyang.github.io/sitemap.xml'),
    key: 'FEAK',
    since: 1,
    sinceUnit: 'day',
    endpoint: 'www.bing.com',
    limit: 100,
    timeout: 10000,
    failureStrategy: 'error'
  };
});

describe('sitemap-processor test cases', () => {
  test('initialize function with modcked inputs should success', () => {
    const sitemapProcessor = new SitemapProcessor();
    sitemapProcessor.initialize();
    expect(sitemapProcessor.options).toBeTruthy();
    expect(sitemapProcessor.options.sitemapLocation.href).toStrictEqual(
      'https://bojieyang.github.io/sitemap.xml'
    );
  });

  test('initialize function with invalid inputs should throw Error', () => {
    jest.spyOn(Inputs, 'parseInputs').mockImplementationOnce(() => {
      return {
        sitemapLocation: new URL('ftp://bojieyang.github.io/sitemap.xml'),
        key: 'FEAK',
        since: 1,
        sinceUnit: 'day',
        endpoint: 'www.bing.com',
        limit: 100,
        timeout: 10000,
        failureStrategy: 'error'
      };
    });
    const sitemapProcessor = new SitemapProcessor();
    expect(sitemapProcessor.initialize).toThrow();
  });

  test('registerHandler should work', () => {
    const sitemapProcessor = new SitemapProcessor();

    const atomHandler = new AtomHandler(sitemapProcessor);
    sitemapProcessor.registerHandler(atomHandler);

    expect(sitemapProcessor.handlers.length).toStrictEqual(1);
    expect(atomHandler.sitemapProcessor).not.toBeUndefined();
    expect(atomHandler.sitemapProcessor).toBe(sitemapProcessor);
  });

  test('prepareCandidateSitemaps for atom url', async () => {
    const sitemapProcessor = new SitemapProcessor();
    sitemapProcessor.registerHandler(new AtomHandler(sitemapProcessor));

    const urlset = await sitemapProcessor.prepareCandidateSitemaps(
      'https://bojieyang.github.io/feed.xml',
      5000
    );
    expect(urlset).toBeTruthy();
    expect(urlset.urls?.length).toBeGreaterThan(5);
  });

  test('prepareCandidateSitemaps for sitemap xml url', async () => {
    const sitemapProcessor = new SitemapProcessor();
    sitemapProcessor.registerHandler(new XMLSitemapHandler(sitemapProcessor));

    const urlset = await sitemapProcessor.prepareCandidateSitemaps(
      'https://bojieyang.github.io/sitemap.xml',
      5000
    );
    expect(urlset).toBeTruthy();
    expect(urlset.urls?.length).toBeGreaterThan(5);
  });

  test('prepareCandidateSitemaps for rss url', async () => {
    jest
      .spyOn(SitemapFetcher, 'fetch')
      .mockImplementationOnce((url, timeout) => {
        const rssContent = readFileSync(resolve(__dirname, url)).toString();
        return Promise.resolve(rssContent);
      });
    const sitemapProcessor = new SitemapProcessor();
    sitemapProcessor.registerHandler(new RSSHandler(sitemapProcessor));

    const urlset = await sitemapProcessor.prepareCandidateSitemaps(
      './data/rss.example.xml',
      5000
    );
    expect(urlset).toBeTruthy();
    expect(urlset.urls?.length).toStrictEqual(3);
  });

  test('prepareCandidateSitemaps for sitemap index url', async () => {
    const mocked = jest
      .spyOn(SitemapFetcher, 'fetch')
      .mockImplementationOnce((url, timeout) => {
        const indexContent = readFileSync(resolve(__dirname, url)).toString();
        return Promise.resolve(indexContent);
      })
      .mockImplementationOnce((url, timeout) => {
        const xml = readFileSync(
          resolve(__dirname, './data/sitemap.example.xml')
        ).toString();
        return Promise.resolve(xml);
      })
      .mockImplementationOnce((url, timeout) => {
        const rss = readFileSync(
          resolve(__dirname, './data/rss.example.xml')
        ).toString();
        return Promise.resolve(rss);
      });
    const sitemapProcessor = new SitemapProcessor();
    const indexHandler = sitemapProcessor.registerHandler(
      new SitemapIndexHandler(sitemapProcessor)
    );
    const rssHandler = sitemapProcessor.registerHandler(
      new RSSHandler(sitemapProcessor)
    );
    const SitemapHandler = sitemapProcessor.registerHandler(
      new XMLSitemapHandler(sitemapProcessor)
    );

    const urlset = await sitemapProcessor.prepareCandidateSitemaps(
      './data/sitemap-index.example.xml',
      5000
    );
    expect(mocked).toHaveBeenCalledTimes(3);
    expect(urlset).toBeTruthy();
    expect(urlset.urls?.length).toStrictEqual(8);
  });

  test('entire process should success', async () => {
    jest.spyOn(Inputs, 'parseInputs').mockImplementationOnce(() => {
      return {
        sitemapLocation: new URL('https://bojieyang.github.io/sitemap.xml'),
        key: process.env['INDEXNOW_KEY'] ?? '',
        since: 1,
        sinceUnit: 'month',
        endpoint: 'www.bing.com',
        limit: 100,
        timeout: 10000,
        failureStrategy: 'ignore'
      };
    });
    const sitemapProcessor = new SitemapProcessor();
    await sitemapProcessor.process();

    expect(sitemapProcessor.options.key).toStrictEqual(
      process.env['INDEXNOW_KEY']
    );
    expect(sitemapProcessor.options.since).toStrictEqual(1);
    expect(sitemapProcessor.options.sinceUnit).toStrictEqual('month');
  });

  test('entire process with invalid inputs should not throw Error', async () => {
    jest.spyOn(Inputs, 'parseInputs').mockImplementationOnce(() => {
      return {
        sitemapLocation: new URL('ftp://bojieyang.github.io/sitemap.xml'),
        key: process.env['INDEXNOW_KEY'] ?? '',
        since: 1,
        sinceUnit: 'day',
        endpoint: 'www.bing.com',
        limit: 100,
        timeout: 10000,
        failureStrategy: 'error'
      };
    });
    const sitemapProcessor = new SitemapProcessor();
    await expect(sitemapProcessor.process()).resolves.toBeUndefined();
  });
});
