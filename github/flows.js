/**
 * Created by Cooper on 2018/08/23.
 */
const sleep = require('anax/lib/sleep');

let flow0 = {
  seed: true,
  name: 'start',
  work: async function() {
    try {
      this.deliver('searchPage', { pageNum: 1, query: 'web' });
    } catch (e) {
      console.error(e);
    }
  },
};

let flow1 = {
  concurrency: 2,
  name: 'searchPage',
  work: async function(stuff, done) {
    try {
      let itemList = await this.scrape('search', stuff);
      // console.log('========= itemList', itemList);
      if (stuff.pageNum > 10) {
        // just go for the first 10 pages
        done();
      } else {
        await sleep();
        stuff.pageNum++;
        this.deliver('searchPage', stuff);
        done();
      }
      this.output('Repo', itemList);
    } catch (e) {
      done(e);
    }
  },
};

module.exports = [flow0, flow1];
