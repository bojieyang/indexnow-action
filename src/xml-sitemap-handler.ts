import {SitemapFormat} from './sitemap-indictor';
import {verifyURLString} from './utils';
import {URLItem, URLSet} from './sitemap-handler';
import AbstractSitemapHandler from './abstract-sitemap-handler';
import dayjs from 'dayjs';

export default class XMLSitemapHandler extends AbstractSitemapHandler {
  async handle(jsObject: any, format: SitemapFormat): Promise<URLSet> {
    const result: URLSet = {
      urls: []
    };
    if (SitemapFormat.sitemap !== format) {
      return result;
    }
    const URLFields: any = jsObject.urlset.url;
    if (URLFields && URLFields.length > 0) {
      URLFields.forEach((URLField: any) => {
        const item = parseURLField(URLField);
        if (item) {
          result.urls.push(item);
        }
      });
    }
    return result;
  }
}

function parseURLField(URLField: any): URLItem | undefined {
  if (!URLField.loc) {
    return undefined;
  }
  const {error, url} = verifyURLString(URLField.loc);
  if (error || url === undefined) {
    throw new Error(
      `fail to parse URLField cause url field is invalid: ${JSON.stringify(
        URLField
      )}`
    );
  }
  const result: URLItem = {
    loc: url
  };

  if (URLField.lastmod) {
    const lastmod = dayjs(URLField.lastmod);
    if (lastmod.isValid()) {
      result.lastmod = lastmod.toDate();
    }
  }
  return result;
}
