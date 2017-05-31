import React, { Component } from 'react';
import './App.css';
import { Textfield, Button } from 'react-mdl';
import { hashHistory } from 'react-router';


class Filter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      zip: 0,
      tuition: [0, 70000]
    };
    this.setZipFilter = this.setZipFilter.bind(this);
  }
  setZipFilter(event){
    this.props.filter.handleCheck(event)
  }

  filterMap(e){
    e.preventDefault();
    hashHistory.push('/viz/1');
  }

  render() {
    return (
      <div>
        <div className="center">
        <div className="alert alert-info" role="alert">
            Enter in your zip code so we can customize the colleges we show to you!
        </div>
        </div>
        <div className="center">
            <Textfield
            onChange={this.setZipFilter}
            pattern="-?[0-9]*(\.[0-9]+)?"
            error="Input is not a number!"
            label="Zip Code"
            style={{width: '200px'}}
            name="zip"
            floatingLabel
            />
        </div>
        <div className="center">
            <Button onClick={this.filterMap} raised colored>Next</Button>
        </div>
      </div>
    );
  }
}

export default Filter;
