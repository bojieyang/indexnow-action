import {verifyURLString, calculateWith} from '../src/utils';
import {describe, test, expect} from '@jest/globals';

describe('verifyURLString function test cases', () => {
  test('vaild url string should return url', () => {
    const result = verifyURLString('https://bojieyang.github.io/sitemap.xml');
    expect(result.error).toBeUndefined();
    expect(result.url?.host).toStrictEqual('bojieyang.github.io');
    expect(result.url?.href).toEqual('https://bojieyang.github.io/sitemap.xml');
  });

  test('empty url string should return error', () => {
    expect(verifyURLString('')).toHaveProperty('error');
    expect(verifyURLString('')).not.toHaveProperty('url');
  });

  test('url not start with http(s) should return error', () => {
    expect(verifyURLString('ftp://example.com/text')).toHaveProperty('error');
    expect(verifyURLString('ftp://example.com/text')).not.toHaveProperty('url');
  });

  test('invalid url should return error', () => {
    expect(verifyURLString('https://example.com:demo')).toHaveProperty('error');
    expect(verifyURLString('https://example.com:demo')).not.toHaveProperty(
      'url'
    );
  });
});

describe('calculateWith function test cases', () => {
  test('calulate with 1 day', () => {
    const oneDayMilliseconds = 24 * 60 * 60 * 1000;
    const milliseconds = calculateWith(1, 'day');
    const now = new Date().getTime();
    const diff = now - milliseconds;
    expect(diff).toBeGreaterThanOrEqual(oneDayMilliseconds);
  });
  test('calulate with 2 week', () => {
    const twoWeekMilliseconds = 2 * 7 * 24 * 60 * 60 * 1000;
    const milliseconds = calculateWith(2, 'week');
    const now = new Date().getTime();
    const diff = now - milliseconds;
    expect(diff).toBeGreaterThanOrEqual(twoWeekMilliseconds);
  });
});
