const   { verify, calculateWith} = require('./utils');

const { expect, describe } = require('@jest/globals');
describe('verify function test cases', () => {
    test('verify invalid url', () => {
        const urlString = "h://www.google.com";
        const {ok, url, error} = verify(urlString);
        expect(ok).toBe(false);
        expect(url).toBeUndefined();
        expect(error).not.toBeNull();
      });
      test('verify valid url', () => {
        const {ok, url, error} = verify('https://bojieyang.github.io/sitemap.xml');
        expect(ok).toBeTruthy();
        expect(url.host).toEqual('bojieyang.github.io');
        expect(url.href).toEqual('https://bojieyang.github.io/sitemap.xml');
        expect(error).toBeUndefined();
      });
});


describe('calculateWith function test cases', () => {
    test('calulate with 1 day', () => {
        const oneDayMilliseconds = 24 * 60 * 60 * 1000; 
        const milliseconds = calculateWith(1, 'day');
        const now = new Date().getTime();
        const diff = now - milliseconds;
        expect(diff).toBeGreaterThanOrEqual(oneDayMilliseconds);
      });
    test('calulate with 2 week', ()=> {
        const twoWeekMilliseconds = 2 * 7 * 24 * 60 * 60 * 1000; 
        const milliseconds = calculateWith(2, 'week');
        const now = new Date().getTime();
        const diff = now - milliseconds;
        expect(diff).toBeGreaterThanOrEqual(twoWeekMilliseconds);
    })
})