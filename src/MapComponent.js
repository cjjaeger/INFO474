import React, { Component } from 'react';
import Count from './Count.js';
import _ from 'lodash';

const sampleStyle = {
    'fontFamily': 'lato',
    'fontSize': '2em',
    'fontWeight': '900',
    'textAlign': 'center'
}
const spanStyle= {
    'color':'#4CAF50'
}
class MapComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            public: 0,
            private: 0,
            ranked: 0
        }

    }
    componentWillMount() {
        var findCount = _.countBy(this.props.data, function (d) {
            return d['school.ownership'] === "Private";
        })
        var findRank = _.countBy(this.props.data, function (d) {
            if (d['rank'] !== null) {
                return d['rank'] <= 100;
            }
        })
        this.setState({ public: findCount.false, private: findCount.true, ranked: findRank.true });
    }

    render() {
        console.log(this.props.data);
        return (
            <div style={sampleStyle}>
                <div>
                    <span>Based on your result, there are over <Count maxNumber={this.props.data.length} duration='8' textInfo='Universities' /></span>
                </div>
                <div>
                    <Count maxNumber={this.state.public} duration='8' textInfo='Public Universities' /><span style={spanStyle}>  |  </span>    
                    <Count maxNumber={this.state.private} duration='8' textInfo='Private Universities' />
                    <br />
                    <Count maxNumber={this.state.ranked} duration='8' textInfo='are in the Top 100 Universities in the US' />
                </div>
            </div>
        );
    }
}

export default MapComponent;

