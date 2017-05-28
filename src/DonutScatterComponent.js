import React, { Component } from 'react';
import * as d3 from 'd3';
import './App.css';
import DonutScatter from './DonutScatter';
import donutChart from './DonutChart';
import {Button } from 'react-mdl';
import { hashHistory } from 'react-router';



class DonutScatterComponent extends Component {
  componentDidMount() {
    this.donutScatter = DonutScatter();
    this.donut = donutChart();
    this.update();
  }
 filterMap(e){
      e.preventDefault();
    hashHistory.push('/viz/scatter');
  }
  update() {
    this.donutScatter.width(600)
        .height(400)
        .xTitle('Tuition')
        .yTitle('Room and Board')
        .xAccessor('tuition')
        .yAccessor('roomAndBoardCost')
        .onHover(this.updateLargeDonut.bind(this));

    var chartData = this.props.data.filter(function(x) {
      return x['appliedFinancialAid'] !== null &&
             x['receivedFinancialAid'] !== null &&
             x['receivedFullFinancialAid'] !== null &&
             x.roomAndBoardCost !== null &&
             x['2014.cost.tuition.out_of_state'] !== null;
    });

    chartData = chartData.map(function(element) {
      var receivedFullPercent = element['receivedFullFinancialAid'] / 100;
      var appliedPercent = element['appliedFinancialAid'] / 100;
      var receivedPercent = element['receivedFinancialAid'] / 100;
      var full = (receivedFullPercent * receivedPercent) / appliedPercent;
      var none = (appliedPercent - receivedPercent) / appliedPercent;
      var partial = (receivedPercent - (receivedFullPercent * receivedPercent)) / appliedPercent;
      return {
        id: element.id,
        name: element.name,
        roomAndBoardCost: element.roomAndBoardCost,
        tuition: element['2014.cost.tuition.out_of_state'],
        pieParts: [
          {
            name: 'none',
            value: none * 100
          },
          {
            name: 'partial',
            value: partial * 100
          },
          {
            name: 'full',
            value: full * 100
          }
        ]
      };
    });

    // Call d3 update
    d3.select(this.donutScatterRoot)
        .datum(chartData)
        .call(this.donutScatter);
  }

  updateLargeDonut(d) {
    this.donut
      .sliceVal('value')
      .sliceCat('name')
      .title(d.name)
      .width(300)
      .height(400);

    d3.select(this.largeDonutRoot)
      .data([d.pieParts])
      .call(this.donut);
  }

  componentWillReceiveProps(props) {
    this.props = props;
    this.update();
  }

  render() {
    return (
      <div>
        <div id="donut-scatter" ref={ node => this.donutScatterRoot = node }></div>
        <div id="large-donut" ref={ node => this.largeDonutRoot = node }></div>
        <Button onClick={this.filterMap} raised colored>Next</Button>
      </div>
    );
  }
}

export default DonutScatterComponent;
