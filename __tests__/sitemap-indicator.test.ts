import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {describe, test, expect, beforeAll} from '@jest/globals';
import {XmlParser} from '../src/xml-parser';
import {SitemapFormat, SitemapIndicator} from '../src/sitemap-indictor';

let indexContent: string;
let sitemapContent: string;
let rssContent: string;
let atomContent: string;
let unknownContent: string;

beforeAll(() => {
  indexContent = readFileSync(
    resolve(__dirname, './data/sitemap-index.example.xml')
  ).toString();

  sitemapContent = readFileSync(
    resolve(__dirname, './data/sitemap.example.xml')
  ).toString();

  rssContent = readFileSync(
    resolve(__dirname, './data/rss.example.xml')
  ).toString();

  atomContent = readFileSync(
    resolve(__dirname, './data/atom.example.xml')
  ).toString();

  unknownContent = readFileSync(
    resolve(__dirname, './data/unknown.example.xml')
  ).toString();
});

describe('sitemap-indicator test cases', () => {
  test('sitemap index format', async () => {
    const content = await XmlParser.parse(indexContent);
    expect(SitemapIndicator.indicate(content)).toBe(SitemapFormat.index);
  });

  test('sitemap format', async () => {
    const content = await XmlParser.parse(sitemapContent);
    expect(SitemapIndicator.indicate(content)).toBe(SitemapFormat.sitemap);
  });

  test('rss format', async () => {
    const content = await XmlParser.parse(rssContent);
    expect(SitemapIndicator.indicate(content)).toBe(SitemapFormat.rss);
  });

  test('atom format', async () => {
    const content = await XmlParser.parse(atomContent);
    expect(SitemapIndicator.indicate(content)).toBe(SitemapFormat.atom);
  });

  test('unknown format', async () => {
    const content = await XmlParser.parse(unknownContent);
    expect(SitemapIndicator.indicate(content)).toBe(SitemapFormat.unknown);
  });
});
