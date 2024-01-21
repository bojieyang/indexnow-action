import {XMLParser} from 'fast-xml-parser';

const alwaysArray = [
  'sitemapindex.sitemap',
  'urlset.url',
  'rss.channel.item',
  'feed.entry'
];

const parseOptions = {
  ignoreAttributes: false,
  attributeNamePrefix: '@',
  isArray: (name: string, jpath: string) => {
    if (alwaysArray.indexOf(jpath) !== -1) {
      return true;
    } else {
      return false;
    }
  }
};

const XmlParser = {
  parse(content: string): Promise<any> {
    const parser = new XMLParser(parseOptions);

    return new Promise<any>((resolve, reject) => {
      try {
        const result = parser.parse(content, true);
        resolve(result);
      } catch (err) {
        reject(err);
      }
    });
  }
};

export {XmlParser};
