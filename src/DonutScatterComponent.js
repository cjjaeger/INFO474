import React, { Component } from 'react';
import * as d3 from 'd3';
import './App.css';
import DonutScatter from './DonutScatter';
import {Button } from 'react-mdl';
import { hashHistory } from 'react-router';



class DonutScatterComponent extends Component {
  componentDidMount() {
    this.donutScatter = DonutScatter();
    this.update();
  }
 filterMap(e){
      e.preventDefault();
    hashHistory.push('/scatter');
  }
  update() {
    // Update parameters
    this.donutScatter
        .width(900)
        .height(700)
        .fill('blue')
        .xTitle('Tuition')
        .yTitle('Room and Board')
        .xAccessor('tuition')
        .yAccessor('roomAndBoardCost');

    var chartData = this.props.data.filter(function(x) {
      return x['appliedFinancialAid'] !== null &&
             x['receivedFinancialAid'] !== null &&
             x['receivedFullFinancialAid'] !== null &&
             x.roomAndBoardCost !== null &&
             x['2014.cost.tuition.out_of_state'] !== null;
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
        .call(this.donutScatter);
  }

  componentWillReceiveProps(props) {
    this.props = props;
    this.update();
  }

  render() {
    return (
      <div>
      <div id="donut-scatter" ref={ node => this.root = node }>
      </div>
        <Button onClick={this.filterMap} raised colored>Next</Button>
      </div>
    );
  }
}

export default DonutScatterComponent;
