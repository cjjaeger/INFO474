import React, { Component } from 'react';
import './App.css';
import { CSSTransitionGroup } from 'react-transition-group';
import Count from './Count.js'
import {Button } from 'react-mdl';
import { hashHistory } from 'react-router';

class PreMap extends Component {

    filterMap(e){
      e.preventDefault();
      hashHistory.push('/map');
    }
    render() {
        return (
              <CSSTransitionGroup transitionName="main" transitionEnter={false} transitionLeave={false} transitionAppear={true}
                  transitionAppearTimeout={1000}>
                  <header className='jumbo center'>
                      <div>
                        <span>For your filters, there are <Count maxNumber={this.props.data.length} duration='8' styleClass='emphasis' textInfo='Universities' /></span>
                      </div>
                  </header>
                  <Button onClick={() => hashHistory.push('/')} className='anchorBL' raised  ripple colored>&lt;&lt; Back</Button>
                  <Button className='anchorBR' onClick={this.filterMap} className='anchorBR' raised ripple colored>Next &gt;&gt;</Button>
              </CSSTransitionGroup>
        );
    }
}
export default PreMap;
