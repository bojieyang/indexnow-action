import {SitemapHandler, URLSet} from './sitemap-handler';
import {SitemapFormat} from './sitemap-indictor';
import SitemapProcessor from './sitemap-processor';

export default abstract class AbstractSitemapHandler implements SitemapHandler {
  sitemapProcessor?: SitemapProcessor;
  constructor(processor?: SitemapProcessor) {
    if (processor) {
      this.sitemapProcessor = processor;
    }
  }

  abstract handle(content: any, format: SitemapFormat): Promise<URLSet>;
}
