import {SitemapFormat} from './sitemap-indictor';
import {verifyURLString} from './utils';
import {URLItem, URLSet} from './sitemap-handler';
import AbstractSitemapHandler from './abstract-sitemap-handler';
import dayjs from 'dayjs';

export default class AtomHandler extends AbstractSitemapHandler {
  async handle(jsObject: any, format: SitemapFormat): Promise<URLSet> {
    const result: URLSet = {
      urls: []
    };
    if (SitemapFormat.atom !== format) {
      return result;
    }
    const entryFields = jsObject.feed.entry;
    if (entryFields && entryFields.length > 0) {
      entryFields.forEach((entryField: any) => {
        const item = parseEntryField(entryField);
        if (item !== undefined) {
          result.urls.push(item);
        }
      });
    }
    return result;
  }
}

function parseEntryField(entryField: any): URLItem | undefined {
  if (entryField.link === undefined || entryField.link['@href'] === undefined) {
    return undefined;
  }

  const {error, url} = verifyURLString(entryField.link['@href']);
  if (error || url === undefined) {
    throw new Error(
      `fail to parse itemField cause url field is invalid: ${JSON.stringify(
        entryField
      )}`
    );
  }
  const result: URLItem = {
    loc: url
  };

  if (entryField.updated) {
    const updated = dayjs(entryField.updated);
    if (updated.isValid()) {
      result.lastmod = updated.toDate();
    }
  }
  return result;
}
