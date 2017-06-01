import React, { Component } from 'react';
import './App.css';
import { CSSTransitionGroup } from 'react-transition-group';
import {Button } from 'react-mdl';
import { hashHistory } from 'react-router';

class PreCost extends Component {

    filterMap(e){
      e.preventDefault();
      hashHistory.push('/cost');
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
                        <div>Now, Are They The <span className='emphasis'>Best Bang For Your Bucks?</span></div>
                    </header>
                    <Button onClick={() => hashHistory.push('/graduation')} className='anchorBL' raised ripple colored>&lt;&lt; Back</Button>
                    <Button className='anchorBR' onClick={this.filterMap} className='anchorBR' raised ripple colored>Next &gt;&gt;</Button>
                </CSSTransitionGroup>
            </div>
        );
    }
}
export default PreCost;
