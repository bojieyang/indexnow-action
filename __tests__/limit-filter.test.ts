import LimitFilter from '../src/limit-filter';
import {SinceUnit} from '../src/inputs';
import {describe, test, expect, beforeAll} from '@jest/globals';
import {URLItem} from '../src/sitemap-handler';
import dayjs from 'dayjs';

describe('LimitFilter test cases', () => {
  test('all items contain lastmod property that should return 2 items', () => {
    const data: URLItem[] = [
      {
        loc: new URL('https://example.com/3.xml'),
        lastmod: dayjs().subtract(3, 'day').toDate()
      },
      {
        loc: new URL('https://example.com/2.xml'),
        lastmod: dayjs().subtract(2, 'day').toDate()
      },
      {
        loc: new URL('https://example.com/1.xml'),
        lastmod: dayjs().subtract(1, 'day').toDate()
      }
    ];
    const filter = new LimitFilter(2);
    const result = filter.filter(data);
    expect(result.length).toStrictEqual(2);
    expect(result[0].loc.href).toStrictEqual('https://example.com/1.xml');
    expect(result[1].loc.href).toStrictEqual('https://example.com/2.xml');
  });

  test('some items do not contain lastmod property that should not filtered', () => {
    const data: URLItem[] = [
      {
        loc: new URL('https://example.com/3.xml'),
        lastmod: dayjs().subtract(3, 'day').toDate()
      },
      {
        loc: new URL('https://example.com/5.xml')
      },
      {
        loc: new URL('https://example.com/1.xml'),
        lastmod: dayjs().subtract(1, 'day').toDate()
      },
      {
        loc: new URL('https://example.com/4.xml')
      },
      {
        loc: new URL('https://example.com/2.xml'),
        lastmod: dayjs().subtract(2, 'day').toDate()
      }
    ];
    const filter = new LimitFilter(4);
    const result = filter.filter(data);
    expect(result.length).toStrictEqual(4);
    expect(result[0].loc.href).toStrictEqual('https://example.com/1.xml');
    expect(result[1].loc.href).toStrictEqual('https://example.com/2.xml');
    expect(result[2].loc.href).toStrictEqual('https://example.com/3.xml');
  });
});
