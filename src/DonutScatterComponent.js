import React, { Component } from 'react';
import * as d3 from 'd3';
import './App.css';
import './DonutScatterComponent.css';
import DonutScatter from './DonutScatter';
import donutChart from './DonutChart';
import { Button } from 'react-mdl';
import { hashHistory } from 'react-router';
import Select from 'react-select';
import _ from 'lodash';
import { CSSTransitionGroup } from 'react-transition-group';

class DonutScatterComponent extends Component {
  componentDidMount() {
    this.donutScatter = DonutScatter();
    this.donut = donutChart();
    this.update();
  }

  update() {
    this.donutScatter.width(900)
      .height(500)
      .onIntroEnd(this.props.onDonutScatterIntroPlayed)
      .introDisabled(this.props.donutScatterIntroPlayed)
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

    var chartData = this.filterForUsage(this.props.data);

    // Call d3 update
    d3.select(this.donutScatterRoot)
      .datum(chartData)
      .call(this.donutScatter);
  }

  filterForUsage(data) {
    let chartData = data.filter(function (x) {
      return x['appliedFinancialAid'] !== null &&
        x['receivedFinancialAid'] !== null &&
        x['receivedFullFinancialAid'] !== null &&
        x.roomAndBoardCost !== null &&
        x.tuition !== null;
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
        tuition: element.tuition,
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
    return chartData;
  }

  updateLargeDonut(d) {
    console.log("large :", d);
    this.donut
      .firstSlice('pieParts')
      .sliceVal('value')
      .sliceCat('name')
      .title(d.name)
      .subTitle(`tuition: $${d.tuition.toLocaleString()}, room and board: $${d.roomAndBoardCost.toLocaleString()}`)
      .margin({
        top: 170,
        bottom: 10,
        left: 10,
        right: 10
      })
      .width(300)
      .height(400);

    d3.select(this.largeDonutRoot)
      .data([d])
      // .transition()
      // .duration(1000)
      .call(this.donut);
  }

  componentWillReceiveProps(props) {
    this.props = props;
    this.update();
  }
  drawSelectedSchool(value) {
    let getObject = this.filterForUsage(this.props.data);
    let school = _.find(getObject, function (d) { return d['name'] === value.value });
    this.donutScatter.enclose(school);
    this.update();
    this.updateLargeDonut(school);
  }

  render() {
    var filteredSchool = this.filterForUsage(this.props.data);
    var schoolChoices = filteredSchool.map(function (d) {
      let name = d['name'];
      return { value: name, label: name };
    });

    return (
        <CSSTransitionGroup transitionName="main" transitionEnter={false} transitionLeave={false} transitionAppear={true}
          transitionAppearTimeout={1000}>
          <div style={{width: '100%'}}>
            <Select name='school-name' placeholder='Search Schools' value='' options={schoolChoices} onChange={this.drawSelectedSchool.bind(this)} />
            <div id="donut-scatter" style={{display: 'inline-block', width: '65%' }} ref={node => this.donutScatterRoot = node} />
            <div style={{width: '35%', display: 'inline-block'}}>
              <svg style={{marginLeft:"auto", marginRight:"auto"}}id="large-donut" width="100%" height="400"  ref={node => this.largeDonutRoot = node}></svg>
            </div>
            <div className="center">
              <Button onClick={() => hashHistory.push('/pre-cost')} raised colored>&lt;&lt; Back</Button>
              <Button onClick={() => hashHistory.push('/pre-selectivity')} raised colored>Next &gt;&gt;</Button>
            </div>
          </div>
        </CSSTransitionGroup>
    );
  }
}

export default DonutScatterComponent;
