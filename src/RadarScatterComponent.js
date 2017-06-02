import React, { Component } from 'react';
import * as d3 from 'd3';
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

  filterMap(e){
    e.preventDefault();
    hashHistory.push('/viz/3');
  }

  update() {
    // Update parameters
    this.radarScatter
        .width(900)
        .height(700)
        .xTitle('Number of Students (log scale)')
        .yTitle('Median household income')
        .xAccessor('studentSize')
        .yAccessor('medianIncome')
        .xAxisTickFormat(d3.format('.2s'))
        .yAxisTickFormat(d3.format('$.2s'))
        .radarIntro(d => {
          var aianPercent = d.radarData[0].axes.filter(x => x.axis === 'aian')[0].value;
          var asianPercent = d.radarData[0].axes.filter(x => x.axis === 'asian')[0].value;
          var blackPercent = d.radarData[0].axes.filter(x => x.axis === 'black')[0].value;
          var hispanicPercent = d.radarData[0].axes.filter(x => x.axis === 'hispanic')[0].value;
          var whitePercent = d.radarData[0].axes.filter(x => x.axis === 'white')[0].value;
          var nhpiPercent = d.radarData[0].axes.filter(x => x.axis === 'nhpi')[0].value;

          return {
            label: `At ${d.name}, ${Math.round(aianPercent).toLocaleString()}% of American Indian. ${Math.round(asianPercent).toLocaleString()}% of Asian. ${Math.round(blackPercent).toLocaleString()}% of Black. ${Math.round(hispanicPercent).toLocaleString()}% of Hispanic. ${Math.round(whitePercent).toLocaleString()}% of White. ${Math.round(nhpiPercent).toLocaleString()}% of Pacific Islander.`,
            title: "Race/Ethnicity"
          };
        })
        .xAxisIntro(d => {
          return {
            label: `The total number of undergraduate student at ${d.name} is $${Math.round(d.studentSize).toLocaleString()} at 2014.`,
            title: "Undergraduate Student Number"
          };
        })
        .yAxisIntro(d => {
          return {
            label: `At ${d.name}, the average median income is $${Math.round(d.medianIncome).toLocaleString()} at 2014.`,
            title: "Median Income"
          };
        })
        .onHover(this.updateLargeRadar.bind(this));

    var chartData = this.props.data.filter(function(d) {
      return d['2014.student.size'] !== null &&
             d['2014.student.avg_dependent_income.2014dollars'] !== null &&
             d['school.locale'] !== null &&
             d['aianpercentile'] !== null &&
             d['asianpercentile'] !== null &&
             d['blackpercentile'] !== null &&
             d['hispanicpercentile'] !== null &&
             d['whitepercentile'] !== null &&
             d['nhpipercentile'] !== null;
    });

    chartData = chartData.map(function(element) {
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
    console.log(chartData);

    // Call d3 update
    d3.select(this.root)
        .datum(chartData)
        .call(this.radarScatter);
  }

  updateLargeRadar(d) {
    this.radar
      .width(300)
      .height(300)
      .firstSlice('radarData');

      d3.select(this.largeRadarRoot)
        .data([d])
        .call(this.radar);
    }

  componentWillReceiveProps(props) {
    this.props = props;
    this.update();
  }

  render() {
    /*onChange={this.drawSelectedSchool.bind(this)}*/
    return (
      <div>
        <CSSTransitionGroup transitionName="main" transitionEnter={false} transitionLeave={false} transitionAppear={true}
          transitionAppearTimeout={1000}>
          <Select name='school-name' value='' options={[]} />
          <div id="radar-scatter" style={{display: 'inline-block', width: '75%'}} ref={ node => this.root = node } />
          <svg id="large-radar" style={{width: '25%', display: 'inline-block'}} width="300" height="300" viewBox="0 0 300 300" ref={ node => this.largeRadarRoot = node }></svg>
          <div className="center">
            <Button onClick={() => hashHistory.push('/pre-cost')} raised colored>&lt;&lt; Back</Button>
            <Button onClick={() => hashHistory.push('/pre-selectivity')} raised colored>Next &gt;&gt;</Button>
          </div>
        </CSSTransitionGroup>
      </div>
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
