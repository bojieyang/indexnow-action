import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {describe, test, expect, beforeAll} from '@jest/globals';
import {SitemapFormat} from '../src/sitemap-indictor';
import {XmlParser} from '../src/xml-parser';
import dayjs from 'dayjs';
import AtomHandler from '../src/atom-handler';

let atomContent: string;
let atomSingleEntryContent: string;

beforeAll(() => {
  atomContent = readFileSync(
    resolve(__dirname, './data/atom.example.xml')
  ).toString();

  atomSingleEntryContent = readFileSync(
    resolve(__dirname, './data/atom-single.example.xml')
  ).toString();
});

describe('atom-handler test cases', () => {
  test('valid atom should return URLSet', async () => {
    const jsObject = await XmlParser.parse(atomContent);
    const ah = new AtomHandler();
    const urlset = await ah.handle(jsObject, SitemapFormat.atom);
    expect(urlset).toBeTruthy();
    expect(urlset.urls).toBeTruthy();
    expect(urlset.urls.length).toEqual(10);

    expect(urlset.urls[0].loc.href).toStrictEqual(
      'https://bojieyang.github.io/posts/a-few-life-hacks-keep-me-slim/'
    );
    expect(urlset.urls[0].lastmod).toStrictEqual(
      dayjs('2023-03-20T00:00:00+08:00').toDate()
    );
  });

  test('valid atom with only one entry should return URLSet', async () => {
    const jsObject = await XmlParser.parse(atomSingleEntryContent);
    const ah = new AtomHandler();
    const urlset = await ah.handle(jsObject, SitemapFormat.atom);
    expect(urlset).toBeTruthy();
    expect(urlset.urls).toBeTruthy();
    expect(urlset.urls.length).toEqual(1);

    expect(urlset.urls[0].loc.href).toStrictEqual(
      'https://bojieyang.github.io/posts/a-few-life-hacks-keep-me-slim/'
    );
    expect(urlset.urls[0].lastmod).toStrictEqual(
      dayjs('2023-03-20T00:00:00+08:00').toDate()
    );
  });
});
