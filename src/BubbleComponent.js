import React, { Component } from 'react';
import * as d3 from 'd3';
import './App.css';
import { Switch } from 'react-mdl';
import gaussian from 'gaussian';
import { Button } from 'react-mdl';
import { hashHistory } from 'react-router';
import BubblePlot from './BubblePlot';
import { CSSTransitionGroup } from 'react-transition-group';
class BubbleComponent extends Component {
    constructor(props) {
        super(props);
        this.state = { "plotType": true }
        this.switched = this.switched.bind(this);
    }

    componentDidMount() {
        this.scatterPlot = BubblePlot();
        this.update();
    }

    update() {
        if (this.state.plotType) {
            var xVar = "2014.admissions.sat_scores.average.overall";
            var yVarLow1 = "2014.admissions.sat_scores.25th_percentile.critical_reading";
            var yVarLow2 = "2014.admissions.sat_scores.25th_percentile.math";
            var yVarLow3 = "2014.admissions.sat_scores.25th_percentile.writing";
            var yVarHigh1 = "2014.admissions.sat_scores.75th_percentile.critical_reading";
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

                    var y75 = (d[yVarHigh1] + d[yVarHigh2] + d[yVarHigh3]);
                    var y25 = (d[yVarLow2] + d[yVarLow1] + d[yVarLow3]);
                    var yVal = y75 - y25;
                    var xVal;
                    if (this.props.filter.SAT === "") {
                        xVal = d[xVar];
                    } else {
                        var variance = ((Math.pow((d[xVar] - y75), 2)) + (Math.pow((d[xVar] - y25), 2))) / 2;
                        var distribution = gaussian(d[xVar], variance);
                        // Take a random sample using inverse transform sampling method.
                        xVal = distribution.cdf(this.props.filter.SAT);
                    }

                    return {
                        x: xVal,
                        y: yVal,
                        id: d.name,
                        location: d['school.locale'],
                        radius: d[r],
                        name: d["school.name"]
                    };
                });
            } else {
                chartData = this.props.data.filter(d => {
                    return d[xVar] != null && d[yVarLow] != null && d[yVarHigh] != null &&
                        d.id != null && d['school.locale'] != null && d[r] != null && d["school.name"] != null;
                });
                chartData = chartData.map(d => {
                    var y75 = d[yVarHigh];
                    var y25 = d[yVarLow];
                    var yVal = y75 - y25;
                    var xVal;
                    if (this.props.filter.ACT === "") {
                        xVal = d[xVar];
                    } else {
                        var variance = ((Math.pow((d[xVar] - y75), 2)) + (Math.pow((d[xVar] - y25), 2))) / 2;
                        var distribution = gaussian(d[xVar], variance);
                        // Take a random sample using inverse transform sampling method.
                        xVal = distribution.cdf(this.props.filter.ACT);
                    }
                    return {
                        x: xVal,
                        y: yVal,
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
        var score = false;
        var xText = 'Average';
        if (this.state.plotType) {
            text = "SAT";
            if (this.props.filter.SAT !== "") {
                score = true;
                xText = "Your Percentile"
            }
        } else {
            text = "ACT";
            if (this.props.filter.ACT !== "") {
                score = true;
                xText = "Your Percentile"
            }
        }
        // Define function to draw ScatterPlot
        var scatter = BubblePlot().xTitle(xText)
            .height(500)
            .width(800)
            .yTitle(text + ' Score Range')
            .scores(score)
            .sizeIntro(d => {

                return {
                    label: `At ${d.name}, the acceptance rate was ${(d.radius * 100).toLocaleString()}%`,
                    title: "Acceptance Rate"
                };
            })
            .xAxisIntro(d => {
                return {
                    label: `${d.name} the average test score was ${(d.x).toLocaleString()} in 2014`,
                    title: "Average Score"
                };
            })
            .yAxisIntro(d => {
                return {
                    label: `At ${d.name}, the test score range was ${(d.y).toLocaleString()} in 2014`,
                    title: "Score Range"
                };
            });
        // Create chart
        var chart = d3.select(this.root)
            .datum(chartData)
            .call(scatter);

    }

    componentWillReceiveProps(props) {
        this.props = props;
        this.update();
    }

    switched(e) {
        if (this.state.plotType) {
            this.state.plotType = false;
        } else {
            this.state.plotType = true;
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
            <div>
                <CSSTransitionGroup transitionName="main" transitionEnter={false} transitionLeave={false} transitionAppear={true}
                    transitionAppearTimeout={1000}>
                    <div style={{ "display": "flex", "flexDirection": "column" }}>
                        <div style={{ "marginLeft": "auto", "marginRight": "auto" }}>
                            <Switch ripple id="switch1" onChange={this.switched} defaultChecked>{text}</Switch>
                        </div>
                        <div id="bubble-plot" style={{ "alignItems": "stretch", "marginLeft": "auto", "marginRight": "auto" }} ref={node => this.root = node}>
                        </div>
                        <div className="center">
                            <Button onClick={() => hashHistory.push('/pre-selectivity')} raised ripple colored>&lt;&lt; Back</Button>
                        </div>
                    </div>
                </CSSTransitionGroup>
            </div>
        );
    }
}

export default BubbleComponent;
