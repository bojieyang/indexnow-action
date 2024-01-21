import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {describe, test, expect, beforeAll} from '@jest/globals';
import {SitemapFormat} from '../src/sitemap-indictor';
import {XmlParser} from '../src/xml-parser';
import dayjs from 'dayjs';
import RSSHandler from '../src/rss-handler';

let rssContent: string;
let rssWithSingleItem: string;
beforeAll(() => {
  rssContent = readFileSync(
    resolve(__dirname, './data/rss.example.xml')
  ).toString();
  rssWithSingleItem = readFileSync(
    resolve(__dirname, './data/rss-single.example.xml')
  ).toString();
});

describe('rss-handler test cases', () => {
  test('valid rss should return URLSet', async () => {
    const jsObject = await XmlParser.parse(rssContent);
    const rh = new RSSHandler();
    const urlset = await rh.handle(jsObject, SitemapFormat.rss);
    expect(urlset).toBeTruthy();
    expect(urlset.urls).toBeTruthy();
    expect(urlset.urls.length).toEqual(3);

    expect(urlset.urls[0].loc.href).toStrictEqual(
      'http://liftoff.msfc.nasa.gov/news/2003/news-starcity.asp'
    );
    // Tue, 03 Jun 2003 09:39:21 GMT
    expect(urlset.urls[0].lastmod).toStrictEqual(
      dayjs('2003-06-03T09:39:21+00:00').toDate()
    );

    expect(urlset.urls[1].loc.href).toStrictEqual(
      'http://liftoff.msfc.nasa.gov/news/2003/news-VASIMR.asp'
    );
    // Tue, 27 May 2003 08:37:32 GMT
    expect(urlset.urls[1].lastmod).toStrictEqual(
      dayjs('2003-05-27T08:37:32+00:00').toDate()
    );

    expect(urlset.urls[2].loc.href).toStrictEqual(
      'http://liftoff.msfc.nasa.gov/news/2003/news-laundry.asp'
    );
    // Tue, 20 May 2003 08:56:02 GMT
    expect(urlset.urls[2].lastmod).toStrictEqual(
      dayjs('2003-05-20T08:56:02+00:00').toDate()
    );
  });

  test('valid rss with only one item should return URLSet', async () => {
    const jsObject = await XmlParser.parse(rssWithSingleItem);
    const rh = new RSSHandler();
    const urlset = await rh.handle(jsObject, SitemapFormat.rss);
    expect(urlset).toBeTruthy();
    expect(urlset.urls).toBeTruthy();
    expect(urlset.urls.length).toEqual(1);

    expect(urlset.urls[0].loc.href).toStrictEqual(
      'http://liftoff.msfc.nasa.gov/news/2003/news-starcity.asp'
    );
    // Tue, 03 Jun 2003 09:39:21 GMT
    expect(urlset.urls[0].lastmod).toStrictEqual(
      dayjs('2003-06-03T09:39:21+00:00').toDate()
    );
  });
});
