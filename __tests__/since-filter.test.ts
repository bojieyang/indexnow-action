import SinceFilter from '../src/since-filter';
import {SinceUnit} from '../src/inputs';
import {describe, test, expect, beforeAll} from '@jest/globals';
import {URLItem} from '../src/sitemap-handler';
import dayjs from 'dayjs';

describe('since-filter test cases', () => {
  test('all items contains lastmod property that should return 3 items', () => {
    const data: URLItem[] = [
      {
        loc: new URL('https://example.com/1.xml'),
        lastmod: dayjs().subtract(1, 'day').toDate()
      },
      {
        loc: new URL('https://example.com/2.xml'),
        lastmod: dayjs().subtract(2, 'day').toDate()
      },
      {
        loc: new URL('https://example.com/3.xml'),
        lastmod: dayjs().subtract(3, 'day').add(1, 'second').toDate() // make sure in the lasts 3 days
      },
      {
        loc: new URL('https://example.com/4.xml'),
        lastmod: dayjs().subtract(4, 'day').toDate()
      },
      {
        loc: new URL('https://example.com/5.xml'),
        lastmod: dayjs().subtract(1, 'week').toDate()
      }
    ];
    const filter = new SinceFilter(3, 'day'); // last 3 days
    const result = filter.filter(data);
    expect(result.length).toStrictEqual(3);
    expect(result[0].loc.href).toStrictEqual('https://example.com/1.xml');
    expect(result[1].loc.href).toStrictEqual('https://example.com/2.xml');
    expect(result[2].loc.href).toStrictEqual('https://example.com/3.xml');
  });

  test('some items do not contain lastmod property should not filterd', () => {
    const data = [
      {
        loc: new URL('https://example.com/1.xml')
      },
      {
        loc: new URL('https://example.com/2.xml'),
        lastmod: dayjs().subtract(23, 'hour').toDate()
      },
      {
        loc: new URL('https://example.com/3.xml'),
        lastmod: dayjs().subtract(2, 'day').toDate()
      }
    ];
    const filter = new SinceFilter(1, 'day'); // last 1 day
    const result = filter.filter(data);
    expect(result.length).toStrictEqual(2);
    expect(result[0].loc.href).toStrictEqual('https://example.com/1.xml');
    expect(result[1].loc.href).toStrictEqual('https://example.com/2.xml');
  });
});
