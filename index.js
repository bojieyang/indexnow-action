const core = require('@actions/core');
const Sitemapper = require('sitemapper');
const dayjs = require('dayjs');
const got = require('got');

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
  

// most @actions toolkit packages have async methods
async function run() {
  try {
    let options = initOptions(); 
    logOptions(options);
    core.info(`Start fetch ${options.sitemapLocation}  ...`);

    let sitemap = new Sitemapper({
      url: options.sitemapLocation,
      lastmod: calculateWith(options.since, options.sinceUnit),
      timeout: options.timeout,
    });
    try {
      const { sites } = await sitemap.fetch();
      
      if(sites.length === 0 ) {
        core.info("There is no matching urls to be submited.");
        return;
      } 
      core.info(`Start submit urls: ${sites} .`);

      try {
        const {statusCode} = await submit(options, sites);
        handleResponse(statusCode, options);

      } catch(error) {
        handleResponse(error.message, options);
      }


    } catch (error) {
      core.error(error.message);
      core.setFailed(error.message);
    }
    
  } catch (error) {
    core.setFailed(error.message);
  }
}

function handleResponse(statusCode, options) {
  if(statusCode === 200 || statusCode === 202) {
    core.log(`🎉 URLs submitted successfully. statusCode: ${statusCode}`); 
    return;
  } 

  const item  = statusCodeMap.get(statusCode);
  let message = "submit failed.";
  if(item === undefined) {
    message  = `statusCode: ${statusCode} is not defined in IndexNow protocol.`;
  } else {
    message = `statusCode: ${statusCode}, response: ${item.response}, reason: ${item.reason}`;
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
function initOptions(options = {}) {
  const {host, sitemapLocation} = getSitemapLocation();
  options.host = host;
  options.sitemapLocation = sitemapLocation;
  options.since = getIntegerInput('since');
  options.sinceUnit = getSinceUnit();
  options.limit = getLimit();
  options.key = core.getInput('key', {required:true});
  options.keyLocation = core.getInput('key-location');
  options.endpoint = getEndpoint();
  options.timeout = getIntegerInput('timeout');
  options.failureStrategy = getFailureStrategy();
  return options;
}

function logOptions(options){
  core.info(`options: ${JSON.stringify(options)} .`);

}

function getSitemapLocation() {
  const sitemapInput = core.getInput('sitemap-location', {required: true});
  try {
    const url = new URL(sitemapInput);
    if(url.protocol === 'http:' || url.protocol === 'https:'){
      return {
        host: url.host,
        sitemapLocation: sitemapInput
      };
    } else {
      throw new Error(`sitemap-location with value ${sitemapInput} is invalid format.`);
    }
  } catch(error) {
    throw new Error(`sitemap-location with value ${sitemapInput} is invalid format.`);
  }
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

function calculateWith(past, unit) {
  return dayjs().subtract(past, unit).valueOf();
}

async function submit(options, urls) {
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
  if(urls.length > options.limit) {
    data.urlList = urls.slice(0, options.limit);
  } else {
    data.urlList = urls;
  }
return data;
}


run();

module.exports =  { run, calculateWith, submit };
