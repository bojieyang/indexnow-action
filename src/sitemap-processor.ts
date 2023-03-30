import {SitemapFetcher} from './sitemap-fetcher';
import {SitemapIndicator} from './sitemap-indictor';
import {SitemapHandler, URLSet, URLItem} from './sitemap-handler';
import {XmlParser} from './xml-parser';
import {Options, parseInputs} from './inputs';
import {log, logWithStrategy, logUrlsWithMessage} from './utils';
import {FilterChain} from './sitemap-filter';
import SinceFilter from './since-filter';
import LimitFilter from './limit-filter';
import SitemapSubmitter from './sitemap-submitter';
export default class SitemapProcessor {
  handlers: SitemapHandler[];
  filterChain: FilterChain;
  urlSet: URLSet;
  options: Options;
  constructor() {
    this.handlers = [];
    this.filterChain = new FilterChain();
    this.urlSet = {
      urls: []
    };
  }

  async process(): Promise<void> {
    try {
      this.initialize();
      const candidates = await this.fetchSitemapAndFilter();

      if (candidates.urls.length === 0) {
        log('No candidate urls need to submit.');
        return;
      }

      const result = await this.submitToIndexNow(candidates);
      this.showResult(result);
    } catch (err: any) {
      logWithStrategy(err.message, this.options.failureStrategy);
    }
  }

  initialize() {
    this.options = parseInputs();
    this.filterChain.addFilter(
      new SinceFilter(this.options.since, this.options.sinceUnit)
    );
    this.filterChain.addFilter(new LimitFilter(this.options.limit));
  }
  async fetchSitemapAndFilter(): Promise<URLSet> {
    const candidates: URLSet = await this.prepareCandidateSitemaps(
      this.options.sitemapLocation.href,
      this.options.timeout
    );

    candidates.urls = this.filterChain.doFilter(candidates.urls);

    return candidates;
  }

  async submitToIndexNow(candidates: URLSet) {
    logUrlsWithMessage(
      candidates.urls,
      'The following list of URLs will be submitted:'
    );
    const sitemapSubmitter = new SitemapSubmitter();
    return await sitemapSubmitter.submit(candidates, this.options);
  }

  showResult(result: {response: string; reason: string}) {
    if (result.response === 'OK') {
      log('🎉 URLs submitted successfully.');
    } else if (result.response === 'Accepted') {
      log(`⏳ URLs ${result.response}. ${result.reason}`);
    } else {
      const message = `💔 SUBMIT FAILED. Response: ${result.response}, Reason: ${result.reason}`;
      logWithStrategy(message, this.options.failureStrategy);
    }
  }
  registerHandler(handler: SitemapHandler) {
    this.handlers.push(handler);
  }

  async prepareCandidateSitemaps(
    url: string,
    timeout = 10000
  ): Promise<URLSet> {
    const data = await SitemapFetcher.fetch(url, timeout);
    const content = await XmlParser.parse(data);
    const sitemapFormat = SitemapIndicator.indicate(content);
    const urls: URLItem[] = [];
    for (const h of this.handlers) {
      const urlSet = await h.handle(content, sitemapFormat);
      urlSet.urls.forEach(item => {
        urls.push(item);
      });
    }
    return {
      urls: urls
    };
  }
}
