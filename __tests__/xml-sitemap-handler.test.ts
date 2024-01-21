import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {describe, test, expect, beforeAll} from '@jest/globals';
import {SitemapFormat} from '../src/sitemap-indictor';
import {XmlParser} from '../src/xml-parser';
import dayjs from 'dayjs';
import XMLSitemapHandler from '../src/xml-sitemap-handler';

let xmlSitemapContent: string;
let xmlSitemapSingleUrlContent: string;
beforeAll(() => {
  xmlSitemapContent = readFileSync(
    resolve(__dirname, './data/sitemap.example.xml')
  ).toString();
  xmlSitemapSingleUrlContent = readFileSync(
    resolve(__dirname, './data/sitemap-single.example.xml')
  ).toString();
});

describe('xml-sitemap-handler test cases', () => {
  test('valid xml sitemap should return URLSet', async () => {
    const jsObject: any = await XmlParser.parse(xmlSitemapContent);
    const xsh = new XMLSitemapHandler();
    const urlset = await xsh.handle(jsObject, SitemapFormat.sitemap);

    expect(urlset).toBeTruthy();
    expect(urlset.urls).toBeTruthy();
    expect(urlset.urls.length).toEqual(5);

    expect(urlset.urls[0].loc.href).toStrictEqual('http://www.example.com/');
    expect(urlset.urls[0].lastmod).toStrictEqual(dayjs('2005-01-01').toDate());
  });

  test('valid xml sitemap with only one url should return URLSet', async () => {
    const jsObject: any = await XmlParser.parse(xmlSitemapSingleUrlContent);
    const xsh = new XMLSitemapHandler();
    const urlset = await xsh.handle(jsObject, SitemapFormat.sitemap);

    expect(urlset).toBeTruthy();
    expect(urlset.urls).toBeTruthy();
    expect(urlset.urls.length).toEqual(1);

    expect(urlset.urls[0].loc.href).toStrictEqual('http://www.example.com/');
    expect(urlset.urls[0].lastmod).toStrictEqual(dayjs('2005-01-01').toDate());
  });
});
