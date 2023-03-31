import {SinceUnit} from './inputs';
import {URLItem} from './sitemap-handler';
import dayjs from 'dayjs';
import {SitemapFilter} from './sitemap-filter';

export default class SinceFilter implements SitemapFilter {
  since: number;
  sinceUnit: SinceUnit;
  lastmodFieldMandatory: boolean;
  constructor(
    since: number,
    sinceUnit: SinceUnit,
    lastmodFieldMandatory = true
  ) {
    this.since = since;
    this.sinceUnit = sinceUnit;
    this.lastmodFieldMandatory = lastmodFieldMandatory;
  }
  filter(urls: URLItem[]): URLItem[] {
    const sinced = dayjs().subtract(this.since, this.sinceUnit);
    return urls.filter(item => {
      return this.lastmodFieldMandatory
        ? item.lastmod && sinced.isBefore(item.lastmod)
        : item.lastmod === undefined || sinced.isBefore(item.lastmod);
    });
  }
}
