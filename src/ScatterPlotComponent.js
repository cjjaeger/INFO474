import React, { Component } from 'react';
import * as d3 from 'd3';
import './App.css';
import ScatterPlot from './ScatterPlot';
import './ScatterPlotComponent.css';

class ScatterPlotComponent extends Component {
    componentDidMount() {
        this.scatterPlot = ScatterPlot();
        this.update();
    }

    update() {
        var xVar = '2014.student.retention_rate.four_year.full_time';
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
                                   .height(700)
                                   .width(900)
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
        <div id="scatter-plot" style={{width: '100%', height: '100%'}} ref={ node => this.root = node }>
        </div>
        );
    }
}

export default ScatterPlotComponent;
