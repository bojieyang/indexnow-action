import {SinceUnit} from './inputs';
import {URLItem} from './sitemap-handler';
import dayjs from 'dayjs';
import {SitemapFilter} from './sitemap-filter';

export default class SinceFilter implements SitemapFilter {
  since: number;
  sinceUnit: SinceUnit;
  constructor(since: number, sinceUnit: SinceUnit) {
    this.since = since;
    this.sinceUnit = sinceUnit;
  }
  filter(urls: URLItem[]): URLItem[] {
    const sinced = dayjs().subtract(this.since, this.sinceUnit);
    return urls.filter(item => {
      if (item.lastmod === undefined) {
        return true;
      }

      if (item.lastmod && sinced.isBefore(item.lastmod)) {
        return true;
      }
      return false;
    });
  }
}
