import {SitemapFormat} from './sitemap-indictor';
import {verifyURLString} from './utils';
import {URLSet} from './sitemap-handler';
import AbstractSitemapHandler from './abstract-sitemap-handler';
import SitemapProcessor from './sitemap-processor';

import dayjs from 'dayjs';
export interface Sitemap {
  loc: URL;
  lastmod?: Date;
}

export interface SitemapIndex {
  sites: Sitemap[];
}
export default class SitemapIndexHandler extends AbstractSitemapHandler {
  constructor(processor?: SitemapProcessor) {
    super(processor);
  }
  async handle(content: any, format: SitemapFormat): Promise<URLSet> {
    if (SitemapFormat.index !== format) {
      return {urls: []};
    }

    const sitemapIndex = this.handleSitemapIndex(content);
    const result = await this.processSitemapRecursively(sitemapIndex);
    return result;
  }

  async processSitemapRecursively(sitemapIndex: SitemapIndex): Promise<URLSet> {
    const result: URLSet = {
      urls: []
    };

    for await (const site of sitemapIndex.sites) {
      const urlSet = await this.sitemapProcessor?.prepareCandidateSitemaps(
        site.loc.href
      );
      urlSet?.urls.forEach(item => {
        result.urls.push(item);
      });
    }
    return result;
  }

  handleSitemapIndex(content: any): SitemapIndex {
    const sitemapIndex: SitemapIndex = {
      sites: []
    };
    const sitemaps = content.sitemapindex.sitemap;
    if (sitemaps?.length > 0) {
      const sitemapList: Sitemap[] = sitemaps.map((sitemap: any) => {
        const site = this.parseSitemapField(sitemap);
        return site;
      });
      sitemapIndex.sites = sitemapList;
    }
    return sitemapIndex;
  }

  parseSitemapField(sitemap: any): Sitemap {
    if (sitemap && sitemap.loc) {
      const {error, url} = verifyURLString(sitemap.loc);

      if (error || url === undefined) {
        throw new Error(
          `fail to parse sitemap cause url field is invalid: ${JSON.stringify(
            sitemap
          )}`
        );
      }
      const result: Sitemap = {
        loc: url
      };

      if (sitemap.lastmod) {
        const lastmod = dayjs(sitemap.lastmod);
        if (!lastmod.isValid()) {
          throw new Error(
            `fail to parse sitemap cause lastmod field is invalid: ${JSON.stringify(
              sitemap
            )}`
          );
        } else {
          result.lastmod = lastmod.toDate();
        }
      }

      return result;
    }
    throw new Error(`fail to parse sitemap: ${JSON.stringify(sitemap)}`);
  }
}
