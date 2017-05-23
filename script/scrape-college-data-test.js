var request = require('request');
//var ProgressBar = require('progress');
var fs = require('fs');
var _ = require('lodash');
//var universityIds = [];
// var bar;
var pages = 32;
var pagesDone = 0;
var universityData = [];


function performRequest() {
    for (var i = 0; i <= pages; i++) {
        //debugger;
        request(
            urlOptionsForPage(i),
            function (error, response, body) {
                var json = JSON.parse(body);
                debugger;
                addUniversityData(json.results);
            }
        )
    }
}
performRequest();

function addUniversityData(items) {
    items.forEach(function (item) {
        item['school.ownership'] = item['school.ownership'] == 1 ? 'Public' : 'Private';
        debugger;
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
        debugger;
        fs.writeFile('data/college-scorecard-data.json', JSON.stringify(universityData, null, 2));
    }
}

// @param categoryName refers to the string value under "dev-category" in Data Dictionary
// @param array refers to an array of all fields within the desired "dev-category"
function concatCategory(categoryName, array, year) {
    var concatenated = [];
    array.forEach(function (value) {
        if (year !== null) {
            concatenated.push(year + '.' + categoryName + '.' + value);
        } else {
            concatenated.push(categoryName + '.' + value);
        }
    })
    return concatenated;
}

// To scape more/less data from ScoreCard, simply configure the ___Category variables
// If interested in adding additional category under "dev-category" column in Data Dictionary,
// make another ____Category variable and pass the concatenated string of the variable as a parameter in requestedFields
// Follow the in-line instructions below to modify the data scrape
function urlOptionsForPage(pageNum) {
    var apiKey = '&api_key=1GzxPNgnOKN6yoEalMpmnnkAVizG2YUttvSWVEsZ';
    var fourYearsFilter = '&school.institutional_characteristics.level=1';
    var year = '2014';
    var initialConfig = '&per_page=100&sort=school.name:asc';

    // To add more fields within the school category, simply add the value of the field shown under "developer-friendly name" column into schoolCategory
    var schoolCategory = ['name', 'city', 'zip', 'ownership', 'state_fips', 'locale'];

    // To add more fields within the academics category, simply add the value of the field shown under "developer-friendly name" column into academicsCategory
    // var academicsCategory = ['program_percentage.agriculture', 'program_percentage.resources', 'program_percentage.architecture', 'program_percentage.ethnic_cultural_gender',
    //     'program_percentage.communication', 'program_percentage.communications_technology', 'program_percentage.computer', 'program_percentage.personal_culinary',
    //     'program_percentage.education', 'program_percentage.engineering', 'program_percentage.engineering_technology', 'program_percentage.language',
    //     'program_percentage.family_consumer_science', 'program_percentage.legal', 'program_percentage.english', 'program_percentage.humanities',
    //     'program_percentage.library', 'program_percentage.biological', 'program_percentage.mathematics', 'program_percentage.military', 'program_percentage.multidiscipline',
    //     'program_percentage.parks_recreation_fitness', 'program_percentage.philosophy_religious', 'program_percentage.theology_religious_vocation',
    //     'program_percentage.physical_science', 'program_percentage.science_technology', 'program_percentage.psychology', 'program_percentage.security_law_enforcement',
    //     'program_percentage.public_administration_social_service', 'program_percentage.social_science', 'program_percentage.construction', 'program_percentage.mechanic_repair_technology',
    //     'program_percentage.precision_production', 'program_percentage.transportation', 'program_percentage.visual_performing', 'program_percentage.health',
    //     'program_percentage.business_marketing', 'program_percentage.history', 'program.bachelors.agriculture', 'program.bachelors.resources',
    //     'program.bachelors.architecture', 'program.bachelors.ethnic_cultural_gender', 'program.bachelors.communication', 'program.bachelors.communications_technology',
    //     'program.bachelors.computer', 'program.bachelors.personal_culinary', 'program.bachelors.education', 'program.bachelors.engineering',
    //     'program.bachelors.engineering_technology', 'program.bachelors.language', 'program.bachelors.family_consumer_science', 'program.bachelors.legal',
    //     'program.bachelors.english', 'program.bachelors.humanities', 'program.bachelors.library', 'program.bachelors.biological', 'program.bachelors.mathematics',
    //     'program.bachelors.military', 'program.bachelors.multidiscipline', 'program.bachelors.parks_recreation_fitness', 'program.bachelors.philosophy_religious',
    //     'program.bachelors.theology_religious_vocation', 'program.bachelors.physical_science', 'program.bachelors.science_technology', 'program.bachelors.psychology',
    //     'program.bachelors.security_law_enforcement', 'program.bachelors.public_administration_social_service', 'program.bachelors.social_science', 'program.bachelors.construction',
    //     'program.bachelors.mechanic_repair_technology', 'program.bachelors.precision_production', 'program.bachelors.transportation', 'program.bachelors.visual_performing',
    //     'program.bachelors.health', 'program.bachelors.business_marketing', 'program.bachelors.history'];

    // To add more fields within the admission category, simply add the value of the field shown under "developer-friendly name" column into admissionCategory
    var admissionCategory = ['admission_rate.overall', 'sat_scores.midpoint.critical_reading', 'sat_scores.midpoint.math', 'sat_scores.midpoint.writing', 'sat_scores.average.overall','act_scores.midpoint.cumulative'];

    // To add more fields within the aid category, simply add the value of the field shown under "developer-friendly name" column into aidCategory    
    var aidCategory = ['pell_grant_rate', 'federal_loan_rate', 'loan_principal', 'median_debt.completers.overall', 'median_debt.noncompleters', 'median_debt.pell_grant',
        'median_debt.no_pell_grant', 'median_debt.female_students', 'median_debt.male_students', 'median_debt.first_generation_students', 'median_debt.non_first_generation_students',
        'median_debt.number.overall', 'median_debt.number.completers', 'median_debt.number.noncompleters', 'median_debt.number.pell_grant', 'median_debt.number.no_pell_grant',
        'median_debt.number.female_students', 'median_debt.number.male_students', 'median_debt.number.first_generation_students', 'median_debt.number.non_first_generation_students'];

    // To add more fields within the student category, simply add the value of the field shown under "developer-friendly name" column into studentCategory
    var studentCategory = ['size', 'demographics.race_ethnicity.white', 'demographics.race_ethnicity.black', 'demographics.race_ethnicity.hispanic', 'demographics.race_ethnicity.asian',
        'demographics.race_ethnicity.aian', 'demographics.race_ethnicity.nhpi', 'demographics.race_ethnicity.two_or_more', 'demographics.race_ethnicity.non_resident_alien', 'demographics.race_ethnicity.unknown',
        'share_first.time_full.time','retention_rate.four_year.full_time', 'demographics.men', 'demographics.women','avg_dependent_income.2014dollars'];
    
    var costCategory = ['tuition.out_of_state','tuition.in_state'];

    var rootCategory = ['ope8_id','ope6_id']
    // Once all the categories are determined, pass the concatenated version of each category (using concatCategory method) as parameters into _.concat
    // concatCategory method takes 2 parameter: "dev-category" string (case-sensitive) AND the corresponding ____Category variable i.e concatCategory('school',schoolCatgory)
    // Then pass the return value of concatCategory() as parameter for _.concat() in requestedFields variable
    // Every category needs year, except for schoolCategory
    var requestedFields = _.concat(concatCategory('school', schoolCategory, null), concatCategory('cost', costCategory, year),
        concatCategory('admissions', admissionCategory, year), concatCategory('aid', aidCategory, year), concatCategory('student', studentCategory, year),rootCategory);
    var url = 'https://api.data.gov/ed/collegescorecard/v1/schools?fields=' + requestedFields.toString()
        + apiKey + fourYearsFilter + initialConfig + '&page=' + pageNum;
    debugger;
    return url;
}
