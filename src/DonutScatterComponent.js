import React, { Component } from 'react';
import * as d3 from 'd3';
import './App.css';
import DonutScatter from './DonutScatter';

class DonutScatterComponent extends Component {
  componentDidMount() {
    this.donutScatter = DonutScatter();
    this.update();
  }
  
  update() {
    // Update parameters
    this.donutScatter
        .width(700)
        .height(500)
        .fill('blue')
        .xTitle('Tuition')
        .yTitle('Room and Board')
        .xAccessor('tuition')
        .yAccessor('roomAndBoardCost');
    
    var chartData = this.props.data.map(function(element) {
      if (element == null) return {id: 0, name: 'l', tuition: 10, pieParts: []};
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
      <div id="donut-scatter" ref={ node => this.root = node }>
      </div>
    );
  }
}

export default DonutScatterComponent;
