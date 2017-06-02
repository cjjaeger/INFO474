import React, { Component } from 'react';
import * as d3 from 'd3';
import './App.css';
import ScatterPlot from './ScatterPlot';
import { Button } from 'react-mdl';
import { hashHistory } from 'react-router';
import './ScatterPlotComponent.css';
import Select from 'react-select';
import * as _ from 'lodash';
import { CSSTransitionGroup } from 'react-transition-group';

var xVar = '2014.completion.completion_rate_4yr_150nt_pooled';
var yVar = '2014.student.avg_dependent_income.2014dollars';

class ScatterPlotComponent extends Component {
    componentDidMount() {
        this.scatterPlot = ScatterPlot();
        this.update();
    }

    update() {
        var chartData = this.filterForUsage(this.props.data);

        // Define function to draw ScatterPlot
        this.scatterPlot.xTitle('Graduation Rate')
                                   .height(400)
                                   .width(700)
                                   .yTitle('Median Family Income');

        // Create chart
        var chart = d3.select(this.root)
            .datum(chartData)
            .call(this.scatterPlot);

    }

    componentWillReceiveProps(props) {
        this.props = props;
        this.update();
    }

    filterForUsage(data) {
      return data.filter(d => {
          return d[xVar] != null && d[yVar] != null &&
              d.id != null && d['school.locale'] != null;
      }).map(d => {
          // console.log(d);
          return {
              x: d[xVar],
              y: d[yVar],
              id: d.name,
              location: d['school.locale']
          };
      });
    }

    showSelected(value) {
      let getObject = this.filterForUsage(this.props.data);
      let school = _.find(getObject, function (d) { return d['id'] === value.value });

      this.scatterPlot.showTooltipOf(school);
      this.update();
    }

    render() {
        var filteredSchool = this.filterForUsage(this.props.data);
        var schoolChoices = filteredSchool.map(function (d) {
          let name = d['id'];
          return { value: name, label: name };
        });
        return (
                <CSSTransitionGroup transitionName="main" transitionEnter={false} transitionLeave={false} transitionAppear={true}
                    transitionAppearTimeout={1000}>
                    <div style={{width: '100%'}}>
                        <Select name='school-name' placeholder='Search Schools' value='' options={schoolChoices} onChange={this.showSelected.bind(this)} />
                        <div id="scatter-plot" style={{ "alignItems": "stretch","width":"65%" , "marginLeft": "auto", "marginRight": "auto" }} ref={node => this.root = node}></div>
                        <div className="center">
                            <Button onClick={() => hashHistory.push('/culture')} raised ripple colored>&lt;&lt; Back</Button>
                            <Button onClick={() => hashHistory.push('/pre-cost')} raised ripple colored>Next &gt;&gt;</Button>
                        </div>
                    </div>
                </CSSTransitionGroup>
        );
    }
}

export default ScatterPlotComponent;
