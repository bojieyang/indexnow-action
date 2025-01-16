import {SinceUnit} from './inputs';
import {URLItem} from './sitemap-handler';
import dayjs from 'dayjs';
import {SitemapFilter} from './sitemap-filter';

export default class SinceFilter implements SitemapFilter {
  since: number;
  sinceUnit: SinceUnit;
  lastmodRequired: boolean;
  constructor(since: number, sinceUnit: SinceUnit, lastmodRequired: boolean) {
    this.since = since;
    this.sinceUnit = sinceUnit;
    this.lastmodRequired = lastmodRequired;
  }
  filter(urls: URLItem[]): URLItem[] {
    const sinced = dayjs().subtract(this.since, this.sinceUnit);
    return urls.filter(item => {
      return this.lastmodRequired
        ? item.lastmod && sinced.isBefore(item.lastmod)
        : item.lastmod === undefined || sinced.isBefore(item.lastmod);
    });
  }
}
