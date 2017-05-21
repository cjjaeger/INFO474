var request = require('request');
var ProgressBar = require('progress');
var fs = require('fs');
var universityIds = [];
var pages;
var pagesDone = 0;
var bar;

request(
  urlOptionsForPage(1),
  function(error, response, body) {
    var json = JSON.parse(body);
    pages = json.data.results.data.total_pages;

    bar = new ProgressBar(
      'scraping [:bar] :percent, :etas left',
      {
        complete: '=',
        incomplete: ' ',
        total: pages
      }
    );

    addUniversityIds(json.data.results.data.items);

    for (var i = 2; i <= pages; i++) {
      request(
        urlOptionsForPage(i),
        function(error, response, body) {
          json = JSON.parse(body);
          addUniversityIds(json.data.results.data.items);
        }
      );
    }
  }
);

function addUniversityIds(items) {
  items.forEach(function(item) {
    universityIds.push(item.institution.urlName + '-' + item.institution.primaryKey);
  });
  pagesDone++;
  bar.tick();
  if (pagesDone === pages) {
    fs.writeFile('data/us-news-ids.json', JSON.stringify(universityIds, null, 2));
  }
}

function urlOptionsForPage(pageNum) {
  var url = 'https://www.usnews.com/best-colleges/search?_mode=list&format=json';
  if (pageNum !== 1) {
    url = url + '&_page=' + pageNum;
  }
  return {
    url: url,
    headers: {
      'Host': 'www.usnews.com',
      'User-Agent': 'X',
      'Accept-Language': 'X',
      'Accept-Encoding': 'gzip, deflate, br',
      'Connection': 'keep-alive'
    },
    gzip: true
  };
}
