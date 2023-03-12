/**
 * @file Split utility functions to make unit test easier.
 */
const dayjs = require('dayjs');

/**
 * 
 * @param {string} urlString url to be verfied.
 * @returns 
 */
function verify(urlString) {
    if(!urlString) {
      return {ok: false, url: undefined, error: undefined};
    }
    try {
      const url = new URL(urlString);
      if(url.protocol === 'http:' || url.protocol === 'https:'){
        return {ok: true, url: url};
      } else {
        return {ok: false, url: undefined, error: undefined}
      }
    } catch(error) {
      return {ok: false, url: undefined, error: error};
    }
}
/**
 * 
 * @param {number} past  
 * @param {string} unit  
 * @returns {number} milliseconds from now
 */
function calculateWith(past, unit) {
    return dayjs().subtract(past, unit).valueOf();
  }

module.exports= {verify, calculateWith}