/**
 * @file  This file is *noly* use unit test *locally*. Use .github/workflow/test.yml to test the flow when it deployed in Github. 
 * 
 */

const process = require('process');
const cp = require('child_process');
const path = require('path');


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
  
  const cmd = 'node';
  const args = [path.join(__dirname, 'index.js')];
  try {    
    const result = cp.execFileSync(cmd, args, {env: process.env}).toString();
    console.log(result);
  } catch(error) {
    console.log(error.stdout.toString());
    throw error;
  }
})