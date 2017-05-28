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
    hashHistory.push('/viz/2');
  }

  update() {
    this.donutScatter.width(900)
        .height(600)
        .xTitle('Tuition')
        .yTitle('Room and Board')
        .xAccessor('tuition')
        .yAccessor('roomAndBoardCost')
        .xAxisTickFormat(d3.format('$.2s'))
        .yAxisTickFormat(d3.format('$.2s'))
        .donutIntro(d => {
          var partialPercent = d.pieParts.filter(x => x.name === 'partial')[0].value;
          var fullPercent = d.pieParts.filter(x => x.name === 'full')[0].value;

          return {
            label: `At ${d.name}, ${Math.round(partialPercent + fullPercent).toLocaleString()}% of applicants receive financial aid. ${Math.round(fullPercent).toLocaleString()}% of applicants receive enough to fully cover their need.`,
            title: "Financial Aid"
          };
        })
        .xAxisIntro(d => {
          return {
            label: `${d.name} costs $${Math.round(d.tuition).toLocaleString()} per year.`,
            title: "Tuition"
          };
        })
        .yAxisIntro(d => {
          return {
            label: `At ${d.name}, it costs $${Math.round(d.roomAndBoardCost).toLocaleString()} per year to live on campus.`,
            title: "Room and Board"
          };
        })
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
      .firstSlice('pieParts')
      .sliceVal('value')
      .sliceCat('name')
      .title(d.name)
      .width(300)
      .height(400);

    d3.select(this.largeDonutRoot)
      .data([d])
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
        <svg id="large-donut" width="300" height="400" ref={ node => this.largeDonutRoot = node }></svg>
        <Button onClick={this.filterMap} raised colored>Next</Button>
      </div>
    );
  }
}

export default DonutScatterComponent;
