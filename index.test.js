//const wait = require('./wait');
//const dayjs = require('dayjs');
//const Sitemapper = require('sitemapper');
//const   { calculateWith, submit } = require('./index');

const process = require('process');
const cp = require('child_process');
const path = require('path');
/*
test('throws invalid number', async () => {
  await expect(wait('foo')).rejects.toThrow('milliseconds not a number');
});

test('wait 500 ms', async () => {
  const start = new Date();
  await wait(500);
  const end = new Date();
  var delta = Math.abs(end - start);
  expect(delta).toBeGreaterThanOrEqual(500);
});
*/

/*
test('test submit', async() => {
  const options = {
    host: "bojieyang.github.io",
    endpoint: "api.indexnow.org",
    indexnowKey:"12312312"
  };
  const urls =  [
    "https://bojieyang.github.io/posts/cooking-in-february/"
  ];
  const {body, statusCode } = await submit(options, urls);
  
  console.log("body",body);
  console.log("statusCode", statusCode);

});
test('test lastmod time format', async()=> {
  const modified = new Date('2023-03-06T00:00:00+08:00').getTime();
  console.log("modified:", modified);
});
test('console.log the sites', async () => {
  console.log('now:', dayjs().valueOf());
  const past = calculateWith(5, 'day');
  console.log("past:", past);
  const sitemapInput = "https://bojieyang.github.io/sitemap.xml";
  const timeout = 15000;
  let sitemap = new Sitemapper({
    url: sitemapInput,
    lastmod: past,
    timeout: timeout
  });

  try {
    const { sites } = await sitemap.fetch();
    console.log("fetch response:", sites);
    //console.debug(`${sites}`);


  } catch (error) {
    console.setFailed(error.message);
  }

});
*/

// shows how the runner will run a javascript action with env / stdout protocol
test('test runs', () => {
  process.env['INPUT_SITEMAP-LOCATION'] = "https://bojieyang.github.io/sitemap.xml";
  process.env['INPUT_SINCE'] = '100';
  process.env['INPUT_SINCE-UNIT'] = 'day';
  process.env['INPUT_ENDPOINT'] = 'www.bing.com';
  process.env['INPUT_KEY'] = 'test';
  process.env['INPUT_KEY-LOCATION'] = '';
  process.env['INPUT_LIMIT'] = '100';
  process.env['INPUT_TIMEOUT'] = '100000';
  process.env['INPUT_FAILURE-STRATEGY'] = 'ignore';
  
  const ip = path.join(__dirname, 'index.js');
  console.log(`ip: ${ip}`);
  const result = cp.execSync(`node ${ip}`, {env: process.env}).toString();
  console.log(result);
})
