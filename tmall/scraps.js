/**
 * Created by Cooper on 2018/8/5.
 */

/* if you want scrape more pages, for anti anti-spider, add cookie in headers */

module.exports = {
  search: {
    build: ({ pageNum }) => ({
      url: 'https://list.tmall.com/search_product.htm',
      qs: {
        q: '手机',
        s: 60 * pageNum,
      },
      headers: {
        Host: 'list.tmall.com',
        Connection: 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.75 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
      },
      encoding: 'gbk',
    }),
    parse: ({ $ }) => {
      let l = [];
      $('#J_ItemList>div').each((i, e) => {
        l.push({
          name: $(e)
            .find('.productTitle')
            .text()
            .trim(),
          pid: $(e).attr('data-id'),
          price: $(e)
            .find('.productPrice')
            .text()
            .trim(),
          shop: $(e)
            .find('.productShop-name')
            .text()
            .trim(),
          sales: $(e)
            .find('.productStatus em')
            .text()
            .trim(),
        });
      });
      return l;
    },
  },

  product: {
    build: ({ pid }) => ({
      url: 'https://detail.tmall.com/item.htm',
      qs: {
        id: pid,
      },
      headers: {
        Host: 'detail.tmall.com',
        Connection: 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.75 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
      },
      encoding: 'gbk',
    }),
    parse: ({ body }) => {
      let spuId = body.match(/"spuId":"(\d+)",/) ? body.match(/"spuId":"(\d+)",/)[1] : null;
      let sellerId = body.match(/"sellerId":(\d+),/) ? body.match(/"sellerId":(\d+),/)[1] : null;
      return { spuId, sellerId };
    },
  },

  comment: {
    build: ({ pid, spuId, sellerId, pageNum }) => ({
      url: 'https://rate.tmall.com/list_detail_rate.htm',
      qs: {
        itemId: pid,
        spuId,
        sellerId,
        order: '3',
        currentPage: pageNum,
        callback: 'jsonp1228',
      },
      headers: {
        Host: 'rate.tmall.com',
        Connection: 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.75 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
      },
      encoding: 'gbk',
    }),
    parse: ({ body, pid }) => {
      if (body.includes('jsonp1228')) {
        let json = eval(body.replace('jsonp1228', ''));
        // console.log("========= json",json);
        if (json.rateDetail && json.rateDetail.rateList) {
          return json.rateDetail.rateList.map(e => ({
            pid,
            user: e.displayUserNick,
            content: e.rateContent,
            remark: e.auctionSku,
          }));
        }
        return [];
      } else {
        return [];
      }
    },
  },
};
