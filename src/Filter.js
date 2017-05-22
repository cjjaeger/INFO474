import React, { Component } from 'react';
import './App.css';
import {Textfield,Button } from 'react-mdl';
import{hashHistory} from 'react-router';


class Filter extends Component {
    constructor(props) {
        super(props);
        this.state = {
        "zip":0
        };
        this.setZipFilter = this.setZipFilter.bind(this);
    }
    setZipFilter(event){
        this.props.handleCheck(event)
        console.log(this.state);
    }
    filterMap(e){
        hashHistory.push('/viz');
    }
  render() {
      const {msg} = this.props;
      //console.log(this.props);
    return (
      <div className="center">
     {this.props.SAT}
     <Textfield
         onChange={this.setZipFilter}
         pattern="-?[0-9]*(\.[0-9]+)?"
         error="Input is not a number!"
         label="Zip Code"
         style={{width: '200px'}}
         name="zip"
         floatingLabel
         />
         <Button onClick={this.filterMap} raised colored>Next</Button>

      </div>
    );
  }
}

export default Filter;
