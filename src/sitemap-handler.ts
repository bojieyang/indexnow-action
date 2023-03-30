import {SitemapFormat} from './sitemap-indictor';

export interface URLItem {
  loc: URL;
  lastmod?: Date;
}
export interface URLSet {
  urls: URLItem[];
}

export interface SitemapHandler {
  handle(content: any, format: SitemapFormat): Promise<URLSet>;
}
