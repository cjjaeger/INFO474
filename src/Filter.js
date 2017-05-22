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
     <Textfield
         onChange={this.handleChange}
         pattern="-?[0-9]*(\.[0-9]+)?"
         error="Input is not a number!"
         label="Zip Code"
         style={{width: '200px'}}
         name="zip"
         floatingLabel
         />

      </div>
    );
  }
}

export default Filter;
