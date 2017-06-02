import React, { Component } from 'react';
import './App.css';
import { CSSTransitionGroup } from 'react-transition-group';
import {Button } from 'react-mdl';
import { hashHistory } from 'react-router';

class PreSelectivity extends Component {

    filterMap(e){
      e.preventDefault();
      hashHistory.push('/selectivity');
    }
    render() {
        return (
              <CSSTransitionGroup transitionName="main" transitionEnter={false} transitionLeave={false} transitionAppear={true}
                  transitionAppearTimeout={1000}>
                  <header className='jumbo center'>
                      <div>Let's Take a Look at How <span className='emphasis'>Selective</span> They Are</div>
                      <p>Enter your test scores (in the filter drawer) to see how you compare with current students at these colleges.</p>
                  </header>
                  <Button onClick={() => hashHistory.push('/cost')} className='anchorBL' raised ripple colored>&lt;&lt; Back</Button>
                  <Button className='anchorBR' onClick={this.filterMap} className='anchorBR' raised ripple colored>Next &gt;&gt;</Button>
              </CSSTransitionGroup>
        );
    }
}
export default PreSelectivity;
