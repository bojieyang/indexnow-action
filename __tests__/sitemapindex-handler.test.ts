import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {describe, test, expect, beforeAll} from '@jest/globals';
import SitemapIndexHandler from '../src/sitemapindex-handler';
import {XmlParser} from '../src/xml-parser';
import dayjs from 'dayjs';

let indexContent: string;
beforeAll(() => {
  indexContent = readFileSync(
    resolve(__dirname, './data/sitemap-index.example.xml')
  ).toString();
});

describe('sitemapindex-handler test cases', () => {
  test('valid sitemap index should return SitemapIndex', async () => {
    const sitemapIndexHandler = new SitemapIndexHandler();
    const sitemapIndex = sitemapIndexHandler.handleSitemapIndex(
      await XmlParser.parse(indexContent)
    );
    expect(sitemapIndex).toBeTruthy();
    expect(sitemapIndex.sites).toBeTruthy();
    expect(sitemapIndex.sites.length).toEqual(2);

    expect(sitemapIndex.sites[0].loc.href).toStrictEqual(
      'http://www.example.com/sitemap1.xml.gz'
    );
    expect(sitemapIndex.sites[0].lastmod).toStrictEqual(
      dayjs('2004-10-01T18:23:17+00:00').toDate()
    );

    expect(sitemapIndex.sites[1].loc.href).toStrictEqual(
      'http://www.example.com/sitemap2.xml.gz'
    );
    expect(sitemapIndex.sites[1].lastmod).toStrictEqual(
      dayjs('2005-01-01').toDate()
    );
  });

  test('sitemap index with single sitemap', async () => {
    indexContent = readFileSync(
      resolve(__dirname, './data/sitemap-index-single.example.xml')
    ).toString();

    const sitemapIndexHandler = new SitemapIndexHandler();
    const sitemapIndex = sitemapIndexHandler.handleSitemapIndex(
      await XmlParser.parse(indexContent)
    );

    expect(sitemapIndex).toBeTruthy();
    expect(sitemapIndex.sites).toBeTruthy();
    expect(sitemapIndex.sites.length).toEqual(1);

    expect(sitemapIndex.sites[0].loc.href).toStrictEqual(
      'http://www.example.com/sitemap1.xml.gz'
    );
    expect(sitemapIndex.sites[0].lastmod).toStrictEqual(
      dayjs('2004-10-01T18:23:17+00:00').toDate()
    );
  });
});
