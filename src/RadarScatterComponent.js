import React, { Component } from 'react';
import * as d3 from 'd3';
import * as _ from 'lodash';
import './App.css';
import RadarScatter from './RadarScatter';
import radarChart from './RadarChart';
import {Button } from 'react-mdl';
import { hashHistory } from 'react-router';
import { CSSTransitionGroup } from 'react-transition-group';
import Select from 'react-select';
import './RadarScatterComponent.css';

class RadarScatterComponent extends Component {
  componentDidMount() {
    this.radarScatter = RadarScatter();
    this.radar = radarChart();
    this.update();
  }

  update() {
    // Update parameters
    this.radarScatter
        .width(900)
        .height(500)
        .onIntroEnd(this.props.onRadarScatterIntroPlayed)
        .introDisabled(this.props.radarScatterIntroPlayed)
        .xTitle('Number of Students (log scale)')
        .yTitle('Median household income')
        .xAccessor('studentSize')
        .yAccessor('medianIncome')
        .xAxisTickFormat(d3.format('.2s'))
        .yAxisTickFormat(d3.format('$.2s'))
        .radarIntro(d => {
          var values = [
            {
              name: 'American Indian',
              value: d.radarData[0].axes.filter(x => x.axis === 'aian')[0].value
            },
            {
              name: 'Asian',
              value: d.radarData[0].axes.filter(x => x.axis === 'asian')[0].value
            },
            {
              name: 'Black',
              value: d.radarData[0].axes.filter(x => x.axis === 'black')[0].value
            },
            {
              name: 'Hispanic',
              value: d.radarData[0].axes.filter(x => x.axis === 'hispanic')[0].value
            },
            {
              name: 'White',
              value: d.radarData[0].axes.filter(x => x.axis === 'white')[0].value
            },
            {
              name: 'Native Hawaiian or Pacific Islander',
              value: d.radarData[0].axes.filter(x => x.axis === 'nhpi')[0].value
            }
          ];

          var maxValue = d3.max(values, a => a.value);

          var selected = values.find(a => a.value === maxValue);

          return {
            label: `${d.name} is in the ${Math.round(selected.value)}th percentile of ${selected.name} student population.`,
            title: "Race/Ethnicity"
          };
        })
        .xAxisIntro(d => {
          return {
            label: `There are ${Math.round(d.studentSize).toLocaleString()} undergraduate students at ${d.name}.`,
            title: "School Size"
          };
        })
        .yAxisIntro(d => {
          return {
            label: `At ${d.name}, the median family income is $${Math.round(d.medianIncome).toLocaleString()}.`,
            title: "Median Income"
          };
        })
        .onHover(this.updateLargeRadar.bind(this));

    var chartData = this.filterForUsage(this.props.data);

    // Call d3 update
    d3.select(this.root)
        .datum(chartData)
        .call(this.radarScatter);
  }

  updateLargeRadar(d) {
    this.radar
      .width(250)
      .height(250)
      .maxValue(100)
      .firstSlice('radarData');

    d3.select('#large-radar-title').text(d.name);

    d3.select(this.largeRadarRoot)
      .data([d])
      .call(this.radar);
  }

  componentWillReceiveProps(props) {
    this.props = props;
    this.update();
  }

  filterForUsage(data) {
    return data.filter(function(d) {
      return d['2014.student.size'] !== null &&
             d['2014.student.avg_dependent_income.2014dollars'] !== null &&
             d['school.locale'] !== null &&
             d['aianpercentile'] !== null &&
             d['asianpercentile'] !== null &&
             d['blackpercentile'] !== null &&
             d['hispanicpercentile'] !== null &&
             d['whitepercentile'] !== null &&
             d['nhpipercentile'] !== null;
    }).map(function(element) {
      var aian = element['aianpercentile'] * 100;
      var asian = element['asianpercentile'] * 100;
      var black = element['blackpercentile'] * 100;
      var hispanic = element['hispanicpercentile'] * 100;
      var white = element['whitepercentile'] * 100;
      var nhpi = element['nhpipercentile'] * 100;
      return {
        id: element.id,
        name: element.name,
        radarData: [
          {
            className: element.name,
            axes: [
              {
                axis: 'aian',
                value: aian
              },
              {
                axis: 'asian',
                value: asian
              },
              {
                axis: 'black',
                value: black
              },
              {
                axis: 'hispanic',
                value: hispanic
              },
              {
                axis: 'white',
                value: white
              },
              {
                axis: 'nhpi',
                value: nhpi
              }
            ]
          }
        ],
        studentSize: element['2014.student.size'],
        medianIncome: element['2014.student.avg_dependent_income.2014dollars']
      };
    });
  }

  drawSelectedSchool(value) {
    let getObject = this.filterForUsage(this.props.data);
    let school = _.find(getObject, function (d) { return d['name'] === value.value });
    this.radarScatter.enclose(school);
    this.update();
    this.updateLargeRadar(school);
  }

  render() {
    var filteredSchool = this.filterForUsage(this.props.data);
    var schoolChoices = filteredSchool.map(function (d) {
      let name = d['name'];
      return { value: name, label: name };
    });

    return (
        <CSSTransitionGroup transitionName="main" transitionEnter={false} transitionLeave={false} transitionAppear={true} transitionAppearTimeout={1000}>
          <div style={{width: '100%'}}>
            <Select name='school-name' placeholder="Search Schools" value='' options={schoolChoices} onChange={this.drawSelectedSchool.bind(this)}/>
            <div id="radar-scatter" style={{display: 'inline-block',"width":"65%"}} ref={ node => this.root = node } />
            <div style={{width: '35%', display: 'inline-block'}}>
              <h4 id="large-radar-title"></h4>
              <svg id="large-radar" width="100%" height="400" viewBox="0 -20 300 300" ref={ node => this.largeRadarRoot = node }></svg>
            </div>
            <div className="center">
              <Button onClick={() => hashHistory.push('/map')} raised colored>&lt;&lt; Back</Button>
              <Button onClick={() => hashHistory.push('/pre-graduation')} raised colored>Next &gt;&gt;</Button>
            </div>
          </div>
        </CSSTransitionGroup>
    );
  }
}

export default RadarScatterComponent;


// $(function() {

//     d3.csv('data/data.csv', function(error, data) {
//         var nestedData = d3.nest()
//                             .key(function(d) {
//                                 return d.group;
//                             })
//                             .entries(data)
//                             .map(function(i) {
//                                 return {
//                                     className: i.key,
//                                     axes: i.values
//                                 }
//                             });


//         var myChart = radarChart().level(5);


//         // Create chart
//         var chart = d3.select("#vis")
//                     .datum(nestedData)
//                     .call(myChart);


//     });
// });
