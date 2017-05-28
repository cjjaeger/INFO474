import React, { Component } from 'react';
import DonutScatterComponent from './DonutScatterComponent';
import ScatterPlotComponent from './ScatterPlotComponent';
import './App.css';

class GraphView extends Component {
  constructor(props) {
    super(props);
  }
  render() {
      var childState = {};
      childState.filter =this.props.filter;
        childState.data = this.props.data;
        this.child = React.cloneElement(this.props.children, childState)
    return (
      <div>
        <h2>still here</h2>
          {this.child}
       {/* <DonutScatterComponent data={this.props.data} filter={this.props.filter}/>
        <ScatterPlotComponent data={this.props.data} filter={this.props.filter}/>*/}
      </div>
    );
  }
}

export default GraphView;
