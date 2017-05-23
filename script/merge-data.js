var fs = require('fs');
var cheerio = require('cheerio');
var request = require('request');
var ProgressBar = require('progress');
var _ = require('lodash');
var stringSimilarity = require('string-similarity');

var usNewsData = JSON.parse(fs.readFileSync('data/us-news-data.json'));
var scorecardData = JSON.parse(fs.readFileSync('data/college-scorecard-data.json'));
var countUndefined = 0;
var mergedData = _.filter(usNewsData, merging);
mergedData = _.map(usNewsData, merging);

function merging(data) {
    var dataArray = data.id.split("-");
    var dataID = parseInt(dataArray[dataArray.length - 1], 10);
    var found = _.find(scorecardData, { 'ope6_id': dataID });

    if (found != undefined) {
        return _.merge(data, found);
    }
    var foundName = _.find(scorecardData, { 'school.name': data.name });

    if (foundName != undefined) {
        return _.merge(data, foundName);
    }
    countUndefined++;
}

console.log(countUndefined);
fs.writeFile('data/merge-test.json', JSON.stringify(mergedData, null, 2));

