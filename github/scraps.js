/**
 * Created by Cooper on 2018/08/23.
 */

module.exports = {
  search: {
    build: ({ pageNum, query }) => ({
      url: 'https://github.com/search',
      qs: {
        p: pageNum,
        q: query,
        type: 'Repositories',
        _pjax: '#js-pjax-container',
      },
      headers: {
        Host: 'github.com',
        Connection: 'keep-alive',
        Accept: 'text/html',
        'X-Requested-With': 'XMLHttpRequest',
        'X-PJAX': 'true',
        'X-PJAX-Container': '#js-pjax-container',
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.75 Safari/537.36',
        Referer: 'https://github.com/search?q=web',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8,ko;q=0.7,de;q=0.6',
      },
    }),
    parse: ({ $ }) => {
      let l = [];
      $('.repo-list .repo-list-item').each((i, e) => {
        l.push({
          name: $(e)
            .find('h3')
            .text()
            .trim(),
          url:
            'https://github.com' +
            $(e)
              .find('h3 a')
              .attr('href'),
          desc: $(e)
            .find('.d-inline-block.text-gray')
            .text()
            .trim(),
          language: $(e)
            .find('.text-gray.flex-auto.min-width-0')
            .text()
            .trim(),
          star: $(e)
            .find('.flex-shrink-0 .muted-link')
            .text()
            .trim(),
          lastModified: new Date(),
        });
      });
      return l;
    },
  },
};
