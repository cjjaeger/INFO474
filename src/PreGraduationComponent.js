import React, { Component } from 'react';
import './App.css';
import { CSSTransitionGroup } from 'react-transition-group';
import {Button } from 'react-mdl';
import { hashHistory } from 'react-router';

class PreGraduation extends Component {

    filterMap(e){
      e.preventDefault();
      hashHistory.push('/graduation');
    }
    render() {
        return (
            <CSSTransitionGroup transitionName="main" transitionEnter={false} transitionLeave={false} transitionAppear={true}
                transitionAppearTimeout={1000}>
                <header className='jumbo center'>
                    <div>Let's Check Out Those Universities' Graduation Rates</div>
                    <p>We'll compare with the median family income of students, because the two are very related.</p>
                </header>
                <Button onClick={() => hashHistory.push('/culture')} className='anchorBL' raised colored>&lt;&lt; Back</Button>
                <Button className='anchorBR' onClick={this.filterMap} className='anchorBR' raised ripple colored>Next &gt;&gt;</Button>
            </CSSTransitionGroup>
        );
    }
}
export default PreGraduation;
