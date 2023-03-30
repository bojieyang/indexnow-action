import {URLItem} from './sitemap-handler';
import {SitemapFilter} from './sitemap-filter';

export default class LimitFilter implements SitemapFilter {
  limit: number;
  constructor(limit: number) {
    this.limit = limit;
  }
  filter(urls: URLItem[]): URLItem[] {
    this.innerSort(urls);
    if (urls.length <= this.limit) {
      return urls;
    }
    return urls.slice(0, this.limit);
  }

  innerSort(urls: URLItem[]): void {
    // descending sort
    urls.sort((a, b) => {
      if (a.lastmod && b.lastmod) {
        return b.lastmod.getTime() - a.lastmod.getTime();
      } else if (a.lastmod && b.lastmod === undefined) {
        return -1;
      } else if (a.lastmod === undefined && b.lastmod) {
        return 1;
      } else {
        return 0;
      }
    });
  }
}
