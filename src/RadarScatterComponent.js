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

import React, { Component } from 'react';
import * as d3 from 'd3';
import './App.css';
import RadarScatter from './RadarScatter';

class RadarScatterComponent extends Component {
  componentDidMount() {
    this.radarScatter = RadarScatter();
    this.update();
  }

  update() {
    // Update parameters
    this.radarScatter
        .width(900)
        .height(700)
        .fill('blue')
        .xTitle('Student Number')
        .yTitle('Median household income')
        .xAccessor('2014.student.size')
        .yAccessor('2014.student.avg_dependent_income.2014dollars');

    var chartData = this.props.data.filter(function(d) {
      return d[xAccessor] !== null &&
             d[yAccessor] !== null &&
             d['school.locale'] !== null &&
             d['2014.student.demographics.race_ethnicity.aian'] !== null &&
             d['2014.student.demographics.race_ethnicity.asian'] !== null && 
             d['2014.student.demographics.race_ethnicity.black'] !== null &&
             d['2014.student.demographics.race_ethnicity.hispanic'] !== null &&
             d['2014.student.demographics.race_ethnicity.white'] !== null &&
             d['2014.student.demographics.race_ethnicity.nhpi'] !== null;
    });

    chartData = chartData.map(function(element) {
      var none = element['appliedFinancialAid'] - element['receivedFinancialAid'];
      var partial = element['receivedFinancialAid'] - element['receivedFullFinancialAid'];
      var full = element['receivedFullFinancialAid'];
      return {
        id: element.id,
        name: element.name,
        roomAndBoardCost: element.roomAndBoardCost,
        tuition: element['2014.cost.tuition.out_of_state'],
        pieParts: [
          {
            name: 'none',
            value: none
          },
          {
            name: 'partial',
            value: partial
          },
          {
            name: 'full',
            value: full
          }
        ]
      };
    });

    // Call d3 update
    d3.select(this.root)
        .datum(chartData)
        .call(this.radarScatter);
  }

  componentWillReceiveProps(props) {
    this.props = props;
    this.update();
  }

  render() {
    return (
      <div id="radar-scatter" ref={ node => this.root = node }>
      </div>
    );
  }
}

export default RadarScatterComponent;