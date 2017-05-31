import React, { Component } from 'react';
import * as d3 from 'd3';
import './App.css';
import { Switch } from 'react-mdl';

import BubblePlot from './BubblePlot';

class BubbleComponent extends Component {
      constructor(props) {
        super(props);
        this.state = {"plotType":true}
        this.switched = this.switched.bind(this);
    }

    componentDidMount() {
        this.scatterPlot = BubblePlot();
        this.update();
    }

    update() {
        if (this.state.plotType) {
            var xVar = "2014.admissions.sat_scores.average.overall";
            var yVarLow1 ="2014.admissions.sat_scores.25th_percentile.critical_reading";
            var yVarLow2 = "2014.admissions.sat_scores.25th_percentile.math";
            var yVarLow3 = "2014.admissions.sat_scores.25th_percentile.writing";
            var yVarHigh1 ="2014.admissions.sat_scores.75th_percentile.critical_reading";
            var yVarHigh2 = "2014.admissions.sat_scores.75th_percentile.math";
            var yVarHigh3 = "2014.admissions.sat_scores.75th_percentile.writing";
        } else {
            var xVar = "2014.admissions.act_scores.midpoint.cumulative";
            var yVarLow = "2014.admissions.act_scores.25th_percentile.cumulative";
            var yVarHigh = "2014.admissions.act_scores.75th_percentile.cumulative";
        }

        var r = "2014.admissions.admission_rate.overall";
        var chartData;

        var prepData = () => {
            if (this.state.plotType) {
                chartData = this.props.data.filter(d => {
                return d[xVar] != null && d[yVarLow2] != null && d[yVarLow1] != null && 
                        d[yVarLow3] != null && d[yVarHigh1] != null && d[yVarHigh2] != null && 
                        d[yVarHigh3] != null && 
                        d.id != null && d['school.locale'] != null && d[r] != null && d["school.name"] != null;
                });
                chartData = chartData.map(d => {
                    // console.log(d);
                    return {
                        x: d[xVar],
                        y:(d[yVarHigh1] + d[yVarHigh2] + d[yVarHigh3])-(d[yVarLow2] + d[yVarLow1] + d[yVarLow3]),
                        id: d.name,
                        location: d['school.locale'],
                        radius: d[r],
                        name: d["school.name"]
                    };
                });
            } else {
                 chartData = this.props.data.filter(d => {
                return d[xVar] != null && d[yVarLow] != null  && d[yVarHigh] != null && 
                        d.id != null && d['school.locale'] != null && d[r] != null && d["school.name"] != null;
                });
                chartData = chartData.map(d => {
                    // console.log(d);
                    return {
                        x: d[xVar],
                        y:d[yVarHigh]- d[yVarLow],
                        id: d.name,
                        location: d['school.locale'],
                        radius: d[r],
                        name: d["school.name"]
                    };
                });
            }
        };

        prepData();
        var text;
        if (this.state.plotType) {
            text = "SAT";
        } else {
            text = "ACT";
        }
        // Define function to draw ScatterPlot
        var scatter = BubblePlot().xTitle('Average')
                                   .height(400)
                                   .width(600)
                                   .yTitle(text+' Score Range');
        // Create chart
        var chart = d3.select(this.root)
            .datum(chartData)
            .call(scatter);

    }

    componentWillReceiveProps(props) {
        this.props = props;
        this.update();
    }

    switched(e){
        if (this.state.plotType) {
             this.state.plotType=false;
        } else {
            this.state.plotType=true;
        }
        this.update();
        this.forceUpdate();
    }

    render() {
        var text;
        if (this.state.plotType) {
            text = "SAT";
        } else {
            text = "ACT";
        }
        return (
        <div className ="container" id="scatter-plot" ref={ node => this.root = node }>
        <Switch ripple id="switch1" onChange={this.switched} defaultChecked>{text}</Switch>
        </div>
        );
    }
}

export default BubbleComponent;
