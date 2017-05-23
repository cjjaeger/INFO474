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
      <DonutScatterComponent data={this.props.data} />
    );
  }
}

export default GraphView;
