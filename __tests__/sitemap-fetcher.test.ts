import {
  SitemapFetcher,
  InvalidURLError,
  TimeoutError,
  FetchError
} from '../src/sitemap-fetcher';
import {describe, test, expect} from '@jest/globals';

describe('sitemap-fetcher test cases', () => {
  test('empty url throw InvalidURLError', async () => {
    await expect(SitemapFetcher.fetch('', 5000)).rejects.toBeInstanceOf(
      InvalidURLError
    );
  });

  test('url not start with http(s) should throw  InvalidURLError', async () => {
    await expect(
      SitemapFetcher.fetch('ftp://example.com', 5000)
    ).rejects.toBeInstanceOf(InvalidURLError);
  });

  test('invalid url that parse failed should throw InvalidURLError', async () => {
    await expect(
      SitemapFetcher.fetch('https://example.com:demo', 5000)
    ).rejects.toBeInstanceOf(InvalidURLError);
  });

  test('invalid url that can pass verify but can not fetched should throw InvalidURLError', async () => {
    await expect(
      SitemapFetcher.fetch('https://example/', 5000)
    ).rejects.toBeInstanceOf(FetchError);
  });

  test('fetch timeout should throw TimeoutError', async () => {
    await expect(
      SitemapFetcher.fetch('https://httpbin.org/xml', 1)
    ).rejects.toBeInstanceOf(TimeoutError);
  });

  test('valid url should return plain text', async () => {
    const result = await SitemapFetcher.fetch('https://example.com', 5000);
    expect(result).toBeTruthy();
    expect(result?.length).toBeGreaterThan(0);
  });
});
