/**
 * Created by Cooper on 2018/8/5.
 */
const sleep = require('anax/lib/sleep');

let flow0 = {
  seed: true,
  name: 'start',
  work: async function() {
    let stuff = { pageNum: 0 };
    this.deliver('search', stuff);
  },
};

let flow1 = {
  name: 'search',
  work: async function(stuff, done) {
    try {
      let productList = await this.scrape('search', stuff);
      stuff.pageNum++;
      if (stuff.pageNum < 5) {
        // for more search pages, change there
        await sleep();
        this.deliver('search', stuff);
      }
      this.deliver('comment', productList);
      this.output('Product', productList);
      done();
    } catch (e) {
      console.error(e);
      done(e);
    }
  },
};

let flow2 = {
  name: 'comment',
  work: async function(stuff, done) {
    try {
      if (!stuff.spuId) {
        let data = await this.scrape('product', stuff);
        Object.assign(stuff, data);
        stuff.pageNum = 1;
      }
      let commentList = await this.scrape('comment', stuff);
      // console.log(commentList);
      await sleep();
      stuff.pageNum++;
      if (stuff.pageNum < 10) {
        // for more comment pages, change there
        this.deliver('comment', stuff);
      }
      this.output('Comment', commentList);
      done();
    } catch (e) {
      console.error(e);
      done(e);
    }
  },
};

module.exports = [flow0, flow1, flow2];
