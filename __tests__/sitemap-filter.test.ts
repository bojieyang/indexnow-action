import {FilterChain} from '../src/sitemap-filter';
import LimitFilter from '../src/limit-filter';
import SinceFilter from '../src/since-filter';
import {SinceUnit} from '../src/inputs';
import {describe, test, expect, beforeAll} from '@jest/globals';
import {URLItem} from '../src/sitemap-handler';
import dayjs from 'dayjs';

describe('FilterChain test cases', () => {
  test('the origin should not modified.', () => {
    const origin: URLItem[] = [
      {
        loc: new URL('https://example.com/5.xml'),
        lastmod: dayjs().subtract(5, 'day').toDate()
      },

      {
        loc: new URL('https://example.com/4.xml'),
        lastmod: dayjs().subtract(4, 'day').add(1, 'second').toDate()
      },
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
    const chain = new FilterChain();
    chain.addFilter(new SinceFilter(4, 'day'));
    chain.addFilter(new LimitFilter(3));
    const result = chain.doFilter(origin);

    expect(result.length).toStrictEqual(3);
    expect(result[0].loc.href).toStrictEqual('https://example.com/1.xml');
    expect(result[1].loc.href).toStrictEqual('https://example.com/2.xml');
    expect(result[2].loc.href).toStrictEqual('https://example.com/3.xml');

    expect(origin.length).toStrictEqual(5);
    expect(origin[0].loc.href).toStrictEqual('https://example.com/5.xml');
  });
});
