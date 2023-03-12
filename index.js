const core = require('@actions/core');
const Sitemapper = require('sitemapper');
const got = require('got');
const styles = require('ansi-styles');


const {verify, calculateWith} = require('./utils');

const INDEXNOW_UPPER_LIMIT = 10000;

const availableUnits = ["minute", "hour", "day", "week", "month", "year"];

/*
 * see https://www.indexnow.org/faq
 */
const availableEndpoints = ["api.indexnow.org", "www.bing.com", "search.seznam.cz", "yandex.com"];

const availableFailureStrategy = ["ignore", "error"];
/**
 * Response format. see https://www.indexnow.org/documentation
 */
const statusCodeMap = new Map([
  [200, {response: "OK", reason: "URL submitted successfully."}],
  [202, {response: "Accepted", reason: "URL received. IndexNow key validation pending."}],
  [400, {response: "Bad request", reason: "Invalid format."}],
  [403, {response: "Forbidden", reason: "In case of key not valid (e.g. key not found, file found but key not in the file)."}],
  [422, {response: "Unprocessable Entity", reason: "In case of URLs which don't belong to the host or the key is not matching the schema in the protocol."}],
  [429, {response: "Too Many Requests", reason: "Too Many Requests (potential Spam)."}]
]);


/**
 * entry function
 */
async function run() {
    const {ok, options} = handleInputs();
    
    if(!ok) {
      return;
    }

    let prepared = await prepareForSubmit(options);
    
    if(!prepared.ok) {
      return;
    }

    submit(options, prepared.urls);
}

async function submit(options, urls) {
  try {
    core.startGroup('Submit urls and show result');
    logUrlsWithMessage(urls, 'Start submitting urls are as follows:');
    const {statusCode} = await doSubmit(options, urls);
    handleResponse(statusCode, options);
  } catch(error) {
    handleFailure(error.message, options);
  } finally {
    core.endGroup();
  }
}

async function prepareForSubmit(options) {
  try {
    core.startGroup('prepare for submit');
    core.info(`Start fetching sitemap from ${options.sitemapLocation}`);

    let sitemap = new Sitemapper({
      url: options.sitemapLocation,
      lastmod: calculateWith(options.since, options.sinceUnit),
      timeout: options.timeout,
    });

    let { sites: urls } = await sitemap.fetch();
      
    if(urls.length === 0 ) {
      core.info("No candidate urls found.");
    } 
    if(urls.length > options.limit) {
      core.notice('The number of candidate urls exceeds the upper limit, will be truncated. The Number of candidate links is ${sites.length}. The limit set in inputs is ${options.limit}.');
      urls = urls.slice(0, options.limit);
    }
    if(urls.length > 0) {
      logUrlsWithMessage(urls, 'Candidate submittable urls are as follows:')
    }
    return {ok: true, urls: urls};
  } catch(error) {
    handleFailure(error.message, options.failureStrategy);
    return {ok: false, urls:[]}
  } finally {
    core.endGroup();
  }
}
function handleResponse(statusCode, options) {
  if(statusCode === 200) {
    core.info(`🎉 ${styles.bgGreen.open}URLs submitted successfully.${styles.bgGreen.close}`); 
    return;
  } 

  if (statusCode === 202) {
    const item = statusCodeMap.get(statusCode);
    core.info(`⏳ URLs submitted ${item.response}. ${item.reason}`);
    return;
  }

  const item  = statusCodeMap.get(statusCode);
  let message = `💔 ${styles.red.open}${styles.bold.open}SUBMIT FAILED${styles.bold.close}${styles.red.close}`;
  if(item === undefined) {
    message  = `${message}. statusCode: ${statusCode} is not defined in IndexNow protocol.`;
  } else {
    message = `${message}. statusCode: ${statusCode}, response: ${item.response}, reason: ${item.reason}`;
  } 
  handleFailure(message, options.failureStrategy);
}
function handleFailure( message, failureStrategy) {
  if(failureStrategy === 'ignore') {
    core.notice(message);
  }
  if(failureStrategy === 'error') {
    core.error(message);
    core.setFailed(message);
  }
}

function handleInputs() {
  try {
    core.startGroup('handle inputs');
    const options= initOptions();
    setSecrets(options);
    logOptions(options);
    return {ok: true, options: options};
  } catch(error) {
    core.setFailed(error);
    return {ok: false, options: undefined};
  } finally {
    core.endGroup();
  }
}
function initOptions(options = {}) {
  const {host, sitemapLocation} = getSitemapLocation();
  options.host = host;
  options.sitemapLocation = sitemapLocation;
  options.since = getIntegerInput('since');
  options.sinceUnit = getSinceUnit();
  options.limit = getLimit();
  options.key = core.getInput('key', {required:true});
  options.keyLocation = getKeyLocation();
  options.endpoint = getEndpoint();
  options.timeout = getIntegerInput('timeout');
  options.failureStrategy = getFailureStrategy();
  core.info('Parse inputs succeeded.');
  return options;
}

function setSecrets(options) {
  core.setSecret(options.key);
  if(options.keyLocation) {
    core.setSecret(options.keyLocation);
  }
  core.info("Ensure secrets masked in logs successfully.");
}

function logOptions(options){
  core.info('show options below:');
  Object.keys(options).forEach(element => {
    const val = options[element];
    core.info(`${element}: ${val}`)
  } ); 
}
function logUrlsWithMessage(urls, message) {
  core.info(`${message}`)
  core.info('[')
  urls.forEach(url => core.info(` ${url}`));
  core.info(']');
}
function getSitemapLocation() {
  const sitemapInput = core.getInput('sitemap-location', {required: true});
    const {ok, url} = verify(sitemapInput);
    if(ok) {
      return {
        host: url.host,
        sitemapLocation: url.href
      };
    }
    throw new Error(`sitemap-location with value ${sitemapInput} is invalid format.`);
}

function getKeyLocation() {
  const keyLocation = core.getInput('key-location');
  // Omit the verification process when the value is empty.
  if(!keyLocation) {
    return keyLocation;
  }

  const {ok} = verify(keyLocation);
  if(ok) {
    return keyLocation;
  }
  throw new Error(`key-location with value ${keyLocation} is invalid format.`);
}



function getIntegerInput(inputName) {
  const input = core.getInput(inputName);
  const integer = parseInt(input, 10);
  if(isNaN(integer)) {
    throw new Error(`${inputName} with the value ${inputName} is invalid format.`);
  }
  return integer;
}

function getSinceUnit() {
  const unitInput = core.getInput('since-unit');
  const unit = availableUnits.find(u => unitInput === u);
  if(unit === undefined) {
    throw new Error(`since-unit with the value ${unitInput} is not available.`);
  }
  return unit;
}

function getLimit() {
  const limit = getIntegerInput('limit');
  if(limit > INDEXNOW_UPPER_LIMIT) {
    throw new Error(`limit with the value ${limit} exceeds upper limit. the upper limit is ${INDEXNOW_UPPER_LIMIT}.`);
  }
  return limit; 
}

function getEndpoint() {
  const endpointInput = core.getInput('endpoint');
  const endpoint = availableEndpoints.find(u => endpointInput === u);
  if(endpoint === undefined) {
    throw new Error(`endpoint with the value ${endpointInput} is not available.`);
  }
  return endpoint;
}

function getFailureStrategy() {
  const strategyInput = core.getInput('failure-strategy');
  const strategy = availableFailureStrategy.find(s => strategyInput === s);
  if(strategy === undefined) {
    throw new Error(`failure-strategy with the value ${strategyInput} is not available.`);
  }
  return strategy;
}



async function doSubmit(options, urls) {
  const submitEndpoint = "https://" + options.endpoint +"/indexnow";
  const content = submitContent(options, urls);
  
  if(core.isDebug())  {
    core.debug(`submit endpoint: ${submitEndpoint}`);
    core.debug(`post data: ${content}`);
  }
    const {statusCode} = await got.post(submitEndpoint, {
      json: content,
      timeout: {
        request: options.timeout
      },
      retry: {
        limit: 0
      },
      throwHttpErrors: false
    });

    if (core.isDebug()) {
      core.debug(`statusCode: ${statusCode}`);
    }

    return {statusCode};
  } 
  

function submitContent(options, urls) {
  const data = {};
  data.host = options.host;
  data.key = options.key;
  if(options.keyLocation) {
    data.keyLocation = options.keyLocation;
  }
  data.urlList = urls;
  return data;
}


run();

module.exports =  { run, getIntegerInput, submit };
