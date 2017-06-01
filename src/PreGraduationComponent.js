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
            <div className = 'test'>
                <CSSTransitionGroup transitionName="main" transitionEnter={false} transitionLeave={false} transitionAppear={true}
                    transitionAppearTimeout={1000}>
                    <header className='jumbo center'>
                        <br />
                        <br />
                        <br />
                        <div>Let's Check Out Those Universities Graduation Rate</div>
                    </header>
                    <Button onClick={() => hashHistory.push('/map')} className='anchorBL' raised colored>&lt;&lt; Back</Button>
                    <Button className='anchorBR' onClick={this.filterMap} className='anchorBR' raised ripple colored>Next &gt;&gt;</Button>
                </CSSTransitionGroup>
            </div>
        );
    }
}
export default PreGraduation;
