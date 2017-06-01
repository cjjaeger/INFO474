import React, { Component } from 'react';
import * as d3 from 'd3';
import './App.css';
import ScatterPlot from './ScatterPlot';
import { Button } from 'react-mdl';
import { hashHistory } from 'react-router';
import './ScatterPlotComponent.css';

class ScatterPlotComponent extends Component {
    componentDidMount() {
        this.scatterPlot = ScatterPlot();
        this.update();
    }

    update() {
        var xVar = '2014.completion.completion_rate_4yr_150nt_pooled';
        var yVar = '2014.student.avg_dependent_income.2014dollars';
        var chartData;

        var prepData = () => {
            chartData = this.props.data.filter(d => {
              return d[xVar] != null && d[yVar] != null &&
                     d.id != null && d['school.locale'] != null;
            });
            chartData = chartData.map(d => {
                // console.log(d);
                return {
                    x: d[xVar],
                    y: d[yVar],
                    id: d.name,
                    location: d['school.locale']
                };
            });
        };

        prepData();

        // Define function to draw ScatterPlot
        var scatter = ScatterPlot().xTitle('Graduation Rate')
                                   .height(500)
                                   .width(700)
                                   .yTitle('Median Family Income');

        // Create chart
        var chart = d3.select(this.root)
            .datum(chartData)
            .call(scatter);

    }

    componentWillReceiveProps(props) {
        this.props = props;
        this.update();
    }

    render() {
        return (
        <div style={{"display":"flex", "flexDirection":"column"}}>
          <div id="scatter-plot" style={{"alignItems":"stretch","marginLeft":"auto", "marginRight":"auto"}} ref={ node => this.root = node }></div>
          <div className="center">
              <Button onClick={() => hashHistory.push('/map')} raised colored>Back</Button>
              <Button onClick={() => hashHistory.push('/cost')} raised colored>Next</Button>
          </div>
        </div>
        );
    }
}

export default ScatterPlotComponent;
