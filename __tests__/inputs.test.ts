import {
  parseSitemapLocationInput,
  parseKeyInput,
  parseSinceInput,
  InvalidInputError,
  parseSinceUnitInput,
  parseEndpointInput,
  parseLimitInput,
  parseFailureStrategyInput,
  isSinceUnit,
  isEndpoint,
  isFailureStrategy
} from '../src/inputs';
import * as core from '@actions/core';
import {describe, test, expect, jest} from '@jest/globals';
describe('parseSitemapLocationInput function test cases', () => {
  test('valid url should parsed successfully', () => {
    jest
      .spyOn(core, 'getInput')
      .mockImplementationOnce((name: string, options) => {
        return 'https://example.com/sitemap.xml';
      });
    expect(parseSitemapLocationInput().href).toStrictEqual(
      'https://example.com/sitemap.xml'
    );
  });

  test('invalid url should throw InvalidInputError', () => {
    jest
      .spyOn(core, 'getInput')
      .mockImplementationOnce((name: string, options) => {
        return 'ftp://example.com/sitemap.xml';
      });
    expect(parseSitemapLocationInput).toThrow(InvalidInputError);
  });

  test('empty url should throw InvalidInputError', () => {
    const mocked = jest
      .spyOn(core, 'getInput')
      .mockImplementationOnce((name: string, options) => {
        return '';
      });
    expect(parseSitemapLocationInput).toThrow(InvalidInputError);
    expect(mocked).toHaveBeenCalledTimes(1);
  });
});

describe('parseSinceInput function test cases', () => {
  test('valid since should return valid number', () => {
    const mocked = jest
      .spyOn(core, 'getInput')
      .mockImplementationOnce((name: string, options) => {
        return '30';
      });
    expect(parseSinceInput()).toStrictEqual(30);
    expect(mocked).toHaveBeenCalledTimes(1);
  });

  test('negative since value should throw InvalidInputError', () => {
    const mocked = jest
      .spyOn(core, 'getInput')
      .mockImplementationOnce((name: string, options) => {
        return '-1';
      });
    expect(parseSinceInput).toThrow(InvalidInputError);
    expect(mocked).toHaveBeenCalledTimes(1);
  });
});

describe('parseSinceUnitInput function test cases', () => {
  test('valid since unit should return valid SinceUnit', () => {
    const mocked = jest
      .spyOn(core, 'getInput')
      .mockImplementationOnce((name: string, options) => {
        return 'month';
      });
    expect(parseSinceUnitInput()).toStrictEqual('month');
    expect(mocked).toHaveBeenCalledTimes(1);
  });

  test('invalid since unit should throw InvalidInputError', () => {
    const mocked = jest
      .spyOn(core, 'getInput')
      .mockImplementationOnce((name: string, options) => {
        return 'second';
      });
    expect(parseSinceUnitInput).toThrow(InvalidInputError);
    expect(mocked).toHaveBeenCalledTimes(1);
  });
});

describe('parseKeyInput function test cases', () => {
  test('empty key should throw InvalidInputError', () => {
    const mocked = jest
      .spyOn(core, 'getInput')
      .mockImplementationOnce((name: string, options) => {
        return '';
      });
    expect(parseKeyInput).toThrow(InvalidInputError);
    expect(mocked).toHaveBeenCalledTimes(1);
  });

  test('valid key should return string', () => {
    const mocked = jest
      .spyOn(core, 'getInput')
      .mockImplementationOnce((name: string, options) => {
        return 'testkey';
      });
    expect(parseKeyInput()).toStrictEqual('testkey');
    expect(mocked).toHaveBeenCalledTimes(1);
  });
});

describe('parseEndpointInput function test cases', () => {
  test('valid endpoint should parsed successful', () => {
    const mocked = jest
      .spyOn(core, 'getInput')
      .mockImplementationOnce((name: string, options) => {
        return 'api.indexnow.org';
      });
    expect(parseEndpointInput()).toStrictEqual('api.indexnow.org');
    expect(mocked).toHaveBeenCalledTimes(1);
  });

  test('invalid endpoint should throw InvalidInputError', () => {
    const mocked = jest
      .spyOn(core, 'getInput')
      .mockImplementationOnce((name: string, options) => {
        return 'google.com';
      });
    expect(parseEndpointInput).toThrow(InvalidInputError);
    expect(mocked).toHaveBeenCalledTimes(1);
  });
});

describe('parseLimitInput function test cases', () => {
  test('valid limit should parsed successful', () => {
    const mocked = jest
      .spyOn(core, 'getInput')
      .mockImplementationOnce((name: string, options) => {
        return '200';
      });
    expect(parseLimitInput()).toStrictEqual(200);
    expect(mocked).toHaveBeenCalledTimes(1);
  });

  test('invalid limit should throw InvalidInputError', () => {
    const mocked = jest
      .spyOn(core, 'getInput')
      .mockImplementationOnce((name: string, options) => {
        return '200000';
      });
    expect(parseLimitInput).toThrow(InvalidInputError);
    expect(mocked).toHaveBeenCalledTimes(1);
  });
});

describe('parseFailureStrategyInput function test cases', () => {
  test('valid strategy should parsed successful', () => {
    const mocked = jest
      .spyOn(core, 'getInput')
      .mockImplementationOnce((name: string, options) => {
        return 'error';
      });
    expect(parseFailureStrategyInput()).toStrictEqual('error');
    expect(mocked).toHaveBeenCalledTimes(1);
  });

  test('invalid strategy should throw InvalidInputError', () => {
    const mocked = jest
      .spyOn(core, 'getInput')
      .mockImplementationOnce((name: string, options) => {
        return 'warning';
      });
    expect(parseFailureStrategyInput).toThrow(InvalidInputError);
    expect(mocked).toHaveBeenCalledTimes(1);
  });
});

describe('isSinceUnit function test cases', () => {
  test('week should return true, second shoud return false', () => {
    expect(isSinceUnit('week')).toStrictEqual(true);
    expect(isSinceUnit('second')).toStrictEqual(false);
  });
});

describe('isEndpoint function test cases', () => {
  test('www.bing.com should return true', () => {
    expect(isEndpoint('www.bing.com')).toStrictEqual(true);
    expect(isEndpoint('www.google.com')).toStrictEqual(false);
  });
  test('www.google.com should return false', () => {
    expect(isEndpoint('www.google.com')).toStrictEqual(false);
  });
});

describe('isFailureStrategy function test cases', () => {
  test('error and ignore shoud return true, others should return false', () => {
    expect(isFailureStrategy('error')).toStrictEqual(true);
    expect(isFailureStrategy('ignore')).toStrictEqual(true);
    expect(isFailureStrategy('warning')).toStrictEqual(false);
  });
});
