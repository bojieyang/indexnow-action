import {XMLParser} from 'fast-xml-parser';

const parseOptions = {
  ignoreAttributes: false,
  attributeNamePrefix: '@'
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
