import {describe, test, expect, beforeAll} from '@jest/globals';
import {XmlParser} from '../src/xml-parser';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';

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

describe('xml parser test cases', () => {
  test('verify a compliant xml', async () => {
    const content = `<?xml version="1.0" encoding="UTF-8"?>

    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    
       <url>
    
          <loc>http://www.example.com/</loc>
    
          <lastmod>2005-01-01</lastmod>
    
          <changefreq>monthly</changefreq>
    
          <priority>0.8</priority>
    
       </url>
    
    </urlset> `;
    await expect(XmlParser.parse(content)).resolves.toEqual(expect.anything());
  });

  test('verify  a non-compliant xml', async () => {
    const content = `<?xml version="1.0" encoding="UTF-8"?>

    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    
    
          <loc>http://www.example.com/</loc>
    
          <lastmod>2005-01-01</lastmod>
    
          <changefreq>monthly</changefreq>
    
          <priority>0.8</priority>
    
       </url>
    
    </urlset> `;
    await expect(XmlParser.parse(content)).rejects.toEqual(expect.anything());
  });

  test('sitemap-index.example.xml', async () => {
    await expect(XmlParser.parse(indexContent)).resolves.toEqual(
      expect.anything()
    );
  });

  test('sitemap.example.xml', async () => {
    await expect(XmlParser.parse(sitemapContent)).resolves.toEqual(
      expect.anything()
    );
  });

  test('rss.example.xml', async () => {
    await expect(XmlParser.parse(rssContent)).resolves.toEqual(
      expect.anything()
    );
  });

  test('atom.example.xml', async () => {
    await expect(XmlParser.parse(atomContent)).resolves.toEqual(
      expect.anything()
    );
  });

  test('unknown.example.xml', async () => {
    await expect(XmlParser.parse(unknownContent)).resolves.toEqual(
      expect.anything()
    );
  });
});
