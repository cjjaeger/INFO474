import React, { Component } from 'react';
import * as d3 from 'd3';
import './App.css';
import ScatterPlot from './ScatterPlot';

class ScatterPlotComponent extends Component {
    componentDidMount() {
        this.scatterPlot = ScatterPlot();
        this.update();
    }

    update(){
        this.scatterPlot.xTitle('Graduation Rate (%)')
                        .yTitle('Median Income ($)');

        var chartData = this.props.data.filter(function(x) {
            // return x['appliedFinancialAid'] !== null &&
            //      x['receivedFinancialAid'] !== null &&
            //      x['receivedFullFinancialAid'] !== null &&
            //      x.roomAndBoardCost !== null &&
            //      x['2014.cost.tuition.out_of_state'] !== null;
        });

        chartData = chartData.map(function(d) {
        //xVar and yVar using data name
        var xVar = 'graduationRate';
        var yVar = 'medianIncome';
        return {
            x: d[xVar],
            y: d[yVar],
            id: d.name,
            location: d.location
        };
        });

        d3.select(this.root)
            .datum(chartData)
            .call(this.scatterPlot);

    }

    componentWillReceiveProps(props) {
        this.props = props;
        this.update();
    }

    render() {
        return (
        <div id="scatter-plot" ref={ node => this.root = node }>
        </div>
        );
    }
}

export default ScatterPlotComponent;