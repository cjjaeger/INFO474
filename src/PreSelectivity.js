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
            <div className = 'test'>
                <CSSTransitionGroup transitionName="main" transitionEnter={false} transitionLeave={false} transitionAppear={true}
                    transitionAppearTimeout={1000}>
                    <header className='jumbo center'>
                        <br />
                        <br />
                        <br />
                        <div>Let's Take a Look at How <span className='emphasis'>Selectivity</span> They Are</div>
                    </header>
                    <Button onClick={() => hashHistory.push('/cost')} className='anchorBL' raised ripple colored>&lt;&lt; Back</Button>
                    <Button className='anchorBR' onClick={this.filterMap} className='anchorBR' raised ripple colored>Next &gt;&gt;</Button>
                </CSSTransitionGroup>
            </div>
        );
    }
}
export default PreSelectivity;