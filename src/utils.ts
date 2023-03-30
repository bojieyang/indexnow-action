/**
 * @file Split utility functions to make unit test easier.
 */
//import * as dayjs from 'dayjs'
import {URL} from 'node:url';
import * as core from '@actions/core';
import {URLItem} from './sitemap-handler';

export function verifyURLString(urlString: string): {
  error?: string;
  url?: URL;
} {
  if (!urlString) {
    return {error: 'url is undefined or empty.'};
  }
  try {
    const result = new URL(urlString);
    if (result.protocol === 'http:' || result.protocol === 'https:') {
      return {url: result};
    } else {
      return {
        error: `url must be start with http or https.`
      };
    }
  } catch (err: any) {
    return {error: `${err.message} with ${urlString}`};
  }
}

export function log(msg: string, notice = false): void {
  if (notice) {
    core.notice(msg);
  } else {
    core.info(msg);
  }
}

export function logUrlsWithMessage(urls: URLItem[], message?: string) {
  if (message) {
    core.info(`${message}`);
  }
  core.info('[');
  urls.forEach(url => core.info(` ${url.loc.href}`));
  core.info(']');
}

export function logWithStrategy(
  err: string | Error,
  strategy: 'ignore' | 'error'
) {
  if (strategy === 'ignore') {
    logWithIgnore(err);
  } else {
    logWithError(err);
  }
}

function logWithIgnore(err: string | Error): void {
  if (typeof err === 'string') {
    core.info(err);
  } else {
    core.info(err.message);
  }
}

function logWithError(err: string | Error): void {
  if (typeof err === 'string') {
    core.error(err);
  } else {
    core.error(err.message);
  }
  core.setFailed(err);
}
