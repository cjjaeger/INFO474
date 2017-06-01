import React, { Component } from 'react';
import CountUp from 'react-countup';

class Count extends Component {
    constructor(props){
        super(props);
    }
    render() {
        return(
            <span className={this.props.styleClass}>
                <CountUp start ={0} end={this.props.maxNumber} duration = {this.props.duration} redraw='true'/>
                <span> {this.props.textInfo}</span>
            </span>
        );
    }
}
export default Count;