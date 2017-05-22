import React, { Component, Button } from 'react';
import './App.css';

class Filter extends Component {
    constructor(props) {
        super(props);
        this.state = {
        //   "filter":{
        //       "zip": "",
        //       "inArea": false,
        //       "radius": null,
        //       "tuition":{
        //           "min":0,
        //           "max": 70000
        //       },
        //       "department":[],
        //       "SAT":null,
        //       "ACT":null,
        //       "ranking": null
        //   }
        };
    }

  render() {
      const {msg} = this.props;
      console.log(this.props);
    return (
      <div>
     {this.props.SAT}

      </div>
    );
  }
}

export default Filter;
