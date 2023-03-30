import {beforeAll, describe, test, expect, jest} from '@jest/globals';
import {AtomHandler} from '../src/atom-handler';
import RSSHandler from '../src/rss-handler';
import SitemapProcessor from '../src/sitemap-processor';
import XMLSitemapHandler from '../src/xml-sitemap-handler';
import {SitemapFetcher} from '../src/sitemap-fetcher';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import SitemapIndexHandler from '../src/sitemapindex-handler';

describe('sitemap-processor test cases', () => {
  test('registerHandler should work', () => {
    const sitemapProcessor = new SitemapProcessor();

    const atomHandler = new AtomHandler(sitemapProcessor);

    expect(sitemapProcessor.handlers.length).toStrictEqual(1);
    expect(atomHandler.sitemapProcessor).not.toBeUndefined();
    expect(atomHandler.sitemapProcessor).toBe(sitemapProcessor);
  });

  test('prepareCandidateSitemaps for atom url', async () => {
    const sitemapProcessor = new SitemapProcessor();
    const atomHandler = new AtomHandler(sitemapProcessor);

    const urlset = await sitemapProcessor.prepareCandidateSitemaps(
      'https://bojieyang.github.io/feed.xml'
    );
    expect(urlset).toBeTruthy();
    expect(urlset.urls?.length).toBeGreaterThan(5);
  });

  test('prepareCandidateSitemaps for sitemap xml url', async () => {
    const sitemapProcessor = new SitemapProcessor();
    const handler = new XMLSitemapHandler(sitemapProcessor);

    const urlset = await sitemapProcessor.prepareCandidateSitemaps(
      'https://bojieyang.github.io/sitemap.xml'
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
    const handler = new RSSHandler(sitemapProcessor);

    const urlset = await sitemapProcessor.prepareCandidateSitemaps(
      './data/rss.example.xml'
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
    const indexHandler = new SitemapIndexHandler(sitemapProcessor);
    const rssHandler = new RSSHandler(sitemapProcessor);
    const SitemapHandler = new XMLSitemapHandler(sitemapProcessor);

    const urlset = await sitemapProcessor.prepareCandidateSitemaps(
      './data/sitemap-index.example.xml'
    );
    expect(mocked).toHaveBeenCalledTimes(3);
    expect(urlset).toBeTruthy();
    expect(urlset.urls?.length).toStrictEqual(8);
  });
});
