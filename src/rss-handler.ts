import {SitemapFormat} from './sitemap-indictor';
import {verifyURLString} from './utils';
import {URLItem, URLSet} from './sitemap-handler';
import AbstractSitemapHandler from './abstract-sitemap-handler';
export default class RSSHandler extends AbstractSitemapHandler {
  async handle(jsObject: any, format: SitemapFormat): Promise<URLSet> {
    const result: URLSet = {
      urls: []
    };
    if (SitemapFormat.rss !== format) {
      return result;
    }
    const channelField: any = jsObject.rss.channel;
    if (channelField && channelField.item && channelField.item.length > 0) {
      channelField.item.forEach((itemField: any) => {
        const item = parseItemField(itemField);
        if (item) {
          result.urls.push(item);
        }
      });
    }
    return result;
  }
}

function parseItemField(itemField: any): URLItem | undefined {
  if (itemField.link === undefined) {
    return undefined;
  }

  const {error, url} = verifyURLString(itemField.link);

  if (error || url === undefined) {
    throw new Error(
      `fail to parse itemField cause url field is invalid: ${JSON.stringify(
        itemField
      )}`
    );
  }

  const item: URLItem = {
    loc: url
  };
  // rss 2.0 spec: pubDate must follow the rfc 822
  if (itemField.pubDate) {
    const pubDate = new Date(itemField.pubDate);
    item.lastmod = pubDate;
  }
  return item;
}
