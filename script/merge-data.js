var fs = require('fs');
var _ = require('lodash');

var usNewsData = JSON.parse(fs.readFileSync('public/data/us-news-data.json'));
var scorecardData = JSON.parse(fs.readFileSync('public/data/college-scorecard-data.json'));
var countUndefined = 0;

var mergedData = usNewsData.filter(function(x) {
  return mergingFunction(x) != null;
});
mergedData = mergedData.map(mergingFunction);

function mergingFunction(data) {
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

console.log(countUndefined + ' schools could not be matched');
fs.writeFile('public/data/merged-data.json', JSON.stringify(mergedData, null, 2));
