var fs = require('fs');
var cheerio = require('cheerio');
var request = require('request');
var ProgressBar = require('progress');

var ids = JSON.parse(fs.readFileSync('data/us-news-ids.json'));
var schools = [];

var bar = new ProgressBar(
  'scraping [:bar] :percent, :etas left',
  {
    complete: '=',
    incomplete: ' ',
    total: ids.length
  }
);

var i = 0;
var interval = setInterval(function() {
  scrapeSchool(ids[i]);
  i++;
  if (i === ids.length) {
    clearInterval(interval);
  }
}, 100);

function scrapeSchool(id) {
  request(urlOptionsForId(id),
    function(error, response, body) {
      var $ = cheerio.load(body);
      var roomBoardText = $('span[data-test-id=w_room_board]')
        .text()
        .split('(')[0]
        .trim()
        .replace(/[\$\,]/g, '');

      var financialAidElem = $("[id^=chart][id$=json]");
      var financialAidData = {};
      if (financialAidElem.length === 1) {
        financialAidData = JSON.parse(financialAidElem.text());
      }

      var rankings = $("#2017\\ Rankings-section").siblings('div[class=block-normal]');
      var rank = null;

      for (var i = 0; i < rankings.length; i++) {
        var rankElem = $(rankings[i]);
        var rankCategory = rankElem
          .children('div')
          .children()
          .children('a').text();

        if (rankCategory === "National Universities") {
          var rankText = rankElem.children('div').children().children('strong').text();
          if (rankText !== "Unranked") {
            rank = parseInt(rankText.replace(/\#/g, ''), 10);
          }
        }
      }

      var roomAndBoardCost = parseInt(roomBoardText, 10);

      var school = {
        id: id,
        name: $('h1').children().remove().end().text().trim(),
        rank: isNaN(rank) ? null : rank,
        appliedFinancialAid: financialAidData["Applied for need-based aid"] || null,
        receivedFinancialAid: financialAidData["Received need-based financial aid"] || null,
        receivedFullFinancialAid: financialAidData["Need was fully met"] || null,
        roomAndBoardCost: isNaN(roomAndBoardCost) ? null : roomAndBoardCost
      };

      schools.push(school);

      bar.tick();

      if (schools.length === ids.length) {
        writeResults();
      }
    }
  );
}

function urlOptionsForId(id) {
  return {
    url: 'https://www.usnews.com/best-colleges/' + id,
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

function writeResults() {
  fs.writeFile('data/us-news-data.json', JSON.stringify(schools, null, 2));
}
