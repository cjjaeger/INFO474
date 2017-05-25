import React, { Component } from 'react';
import DonutScatterComponent from './DonutScatterComponent';
import ScatterPlotComponent from './ScatterPlotComponent';
import './App.css';

class GraphView extends Component {
  constructor(props) {
    super(props);
  }
  render() {
     
    return (
      <div>

        <DonutScatterComponent data={this.props.data} filter={this.props.filter}/>
        <ScatterPlotComponent data={this.props.data} filter={this.props.filter}/>
      </div>
    );
  }
}

export default GraphView;
