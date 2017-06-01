// To add more fields, simply add the value of the field shown under "developer-friendly name" column into this object.
// Put the field in the correct namespace.
const fields = {
    // Most fields are year-specific--we use 2014 (most recent)
    2014: {
        cost: [
        'tuition.out_of_state',
        'tuition.in_state'
        ],
        completion: [
          'completion_rate_4yr_150nt_pooled'
        ],
        admissions: [
            'admission_rate.overall',
            'sat_scores.midpoint.critical_reading',
            'sat_scores.midpoint.math',
            'sat_scores.midpoint.writing',
            'sat_scores.25th_percentile.math',
            'sat_scores.25th_percentile.critical_reading',
            'sat_scores.25th_percentile.writing',
            'sat_scores.75th_percentile.math',
            'sat_scores.75th_percentile.critical_reading',
            'sat_scores.75th_percentile.writing',
            'sat_scores.average.overall',
            'act_scores.midpoint.cumulative',
            'act_scores.25th_percentile.cumulative',
            'act_scores.75th_percentile.cumulative'
        ],
        aid: [
            'pell_grant_rate',
            'federal_loan_rate',
            'loan_principal',
            'median_debt.completers.overall',
            'median_debt.noncompleters',
            'median_debt.pell_grant',
            'median_debt.no_pell_grant',
            'median_debt.female_students',
            'median_debt.male_students',
            'median_debt.first_generation_students',
            'median_debt.non_first_generation_students',
            'median_debt.number.overall',
            'median_debt.number.completers',
            'median_debt.number.noncompleters',
            'median_debt.number.pell_grant',
            'median_debt.number.no_pell_grant',
            'median_debt.number.female_students',
            'median_debt.number.male_students',
            'median_debt.number.first_generation_students',
            'median_debt.number.non_first_generation_students'
        ],
        student: [
            'size',
            'demographics.race_ethnicity.white',
            'demographics.race_ethnicity.black',
            'demographics.race_ethnicity.hispanic',
            'demographics.race_ethnicity.asian',
            'demographics.race_ethnicity.aian',
            'demographics.race_ethnicity.nhpi',
            'demographics.race_ethnicity.two_or_more',
            'demographics.race_ethnicity.non_resident_alien',
            'demographics.race_ethnicity.unknown',
            'share_first.time_full.time',
            'retention_rate.four_year.full_time',
            'demographics.men',
            'demographics.women',
            'avg_dependent_income.2014dollars'
        ]
    },
    school: [
        'name',
        'city',
        'zip',
        'ownership',
        'state_fips',
        'locale'
    ],
    location: [
        'lat',
        'lon'
    ],
    // These are what the data dictionary calls 'root' namespaced: they have no namespace
    null: [
        'ope8_id',
        'ope6_id'
    ]
};

const params = {
    api_key: '1GzxPNgnOKN6yoEalMpmnnkAVizG2YUttvSWVEsZ',
    'school.institutional_characteristics.level': 1,
    per_page: 100,
    fields: namespace(fields).join(','),
    sort: 'school.name:asc'
};

var request = require('request');
var ProgressBar = require('progress');
var fs = require('fs');
var _ = require('lodash');
var pages = 32;
var pagesDone = 0;
var universityData = [];

var bar = new ProgressBar(
  'scraping [:bar] :percent, :etas left',
  {
    complete: '=',
    incomplete: ' ',
    total: pages + 1 // Zero indexed
  }
);


function performRequests() {
    for (var i = 0; i <= pages; i++) {
        request(
            urlOptionsForPage(i),
            function (error, response, body) {
                var json = JSON.parse(body);
                addUniversityData(json.results);
                bar.tick();
            }
        )
    }
}
performRequests();

function addUniversityData(items) {
    items.forEach(function (item) {
        item['school.ownership'] = item['school.ownership'] == 1 ? 'Public' : 'Private';
        if (item['school.locale'] == 11 || item['school.locale'] == 12 || item['school.locale'] == 13) {
            item['school.locale'] = 'City';
        } else if (item['school.locale'] == 21 || item['school.locale'] == 22 || item['school.locale'] == 23) {
            item['school.locale'] = 'Suburb';
        } else if (item['school.locale'] == 31 || item['school.locale'] == 32 || item['school.locale'] == 33) {
            item['school.locale'] = 'Town';
        } else {
            item['school.locale'] = 'Rural';
        }
        // item['school.degree_urbanization'] = item['school.degree_urbanization'] == 1 || item['school.degree_urbanization'] == 2 ? 'City'
        //     : item['school.degree_urbanization'] == 3 || item['school.degree_urbanization'] == 4 ? 'Urban'
        //         : item['school.degree_urbanization'] == 5 || item['school.degree_urbanization'] == 6 ? 'Town' : 'Rural';
        var ordered={};
        Object.keys(item).sort().forEach(function(key){
            ordered[key] = item[key];
        })
        universityData.push(ordered);
    });
    pagesDone++;
    if (pagesDone === pages) {
        fs.writeFile('public/data/college-scorecard-data.json', JSON.stringify(universityData, null, 2));
    }
}

function namespace(fields, startingNamespace) {
    if (!startingNamespace) {
        startingNamespace = [];
    }
    if (fields.constructor === Array) {
        return fields.map(function(x) {
            return startingNamespace.concat([x]).join('.');
        });
    } else {
        // Object
        var result = [];
        for (var key in fields) {
            var subNamespace = startingNamespace.slice();
            if (key != 'null') {
                subNamespace.push(key);
            }
            result = result.concat(namespace(fields[key], subNamespace));
        }
        return result;
    }
}

function objectToUrlParams(obj) {
    var result = [];
    for (var key in obj) {
        result.push(key + '=' + obj[key]);
    }
    return result.join('&');
}

function urlOptionsForPage(pageNum) {
    var pageParams = _.assign(params, {page: pageNum});
    var url = 'https://api.data.gov/ed/collegescorecard/v1/schools?' + objectToUrlParams(pageParams);
    return url;
}
