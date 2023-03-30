export enum SitemapFormat {
  index, // sitemap index file
  sitemap, // sitemap xml file
  rss, // rss 2.0
  atom, // atom 1.0
  unknown
}

export const SitemapIndicator = {
  indicate(jsObject: any): SitemapFormat {
    if (jsObject.urlset) {
      return SitemapFormat.sitemap;
    }
    if (jsObject.sitemapindex) {
      return SitemapFormat.index;
    }
    if (jsObject.rss) {
      return SitemapFormat.rss;
    }
    if (jsObject.feed) {
      return SitemapFormat.atom;
    }
    return SitemapFormat.unknown;
  }
};
