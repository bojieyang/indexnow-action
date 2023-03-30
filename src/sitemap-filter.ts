import {URLItem} from './sitemap-handler';

export interface SitemapFilter {
  filter(urls: URLItem[]): URLItem[];
}

export class FilterChain {
  filters: SitemapFilter[] = [];

  addFilter(filter: SitemapFilter) {
    this.filters.push(filter);
  }

  doFilter(urls: URLItem[]): URLItem[] {
    if (urls.length === 0) {
      return [];
    }
    let duplicates = urls.slice();

    this.filters.forEach(f => {
      duplicates = f.filter(duplicates);
    });

    return duplicates;
  }
}
