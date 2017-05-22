import React, { Component } from 'react';
import * as d3 from 'd3';
import './App.css';
import DonutScatter from './DonutScatter';

class DonutScatterComponent extends Component {  
  componentDidMount() {
    this.donutScatter = DonutScatter();
    this.update();
  }
  
  update() {
    // Update parameters
    this.donutScatter
        .width(700)
        .height(500)
        .fill('blue')
        .xTitle('Tuition')
        .yTitle('Room and Board')
        .xAccessor('tuition')
        .yAccessor('roomAndBoard');

    // Call d3 update
    d3.select(this.root)
        .datum(
          [
            {
              id: 'expensive',
              name: 'Expensive',
              roomAndBoard: 20000,
              tuition: 80000,
              pieParts: [
                {
                  name: 'none',
                  value: 30.0
                },
                {
                  name: 'partial',
                  value: 30.0
                },
                {
                  name: 'full',
                  value: 40.0
                }
              ]
            },
            {
              id: 'med1',
              name: 'Medium 1',
              roomAndBoard: 5000,
              tuition: 10000,
              pieParts: [
                {
                  name: 'none',
                  value: 10.0
                },
                {
                  name: 'partial',
                  value: 70.0
                },
                {
                  name: 'full',
                  value: 20.0
                }
              ]
            },
            {
              id: 'cheap',
              name: 'Cheap',
              roomAndBoard: 1000,
              tuition: 4000,
              pieParts: [
                {
                  name: 'none',
                  value: 0.0
                },
                {
                  name: 'partial',
                  value: 60.0
                },
                {
                  name: 'full',
                  value: 40.0
                }
              ]
            }
          ]
        )
        .call(this.donutScatter);
  }
  
  componentWillReceiveProps(props) {
    this.props = props;
    this.update();
  }

  render() {
    return (
      <div id="donut-scatter" ref={ node => this.root = node }>
      </div>
    );
  }
}

export default DonutScatterComponent;
