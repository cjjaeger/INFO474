import React, { Component } from 'react';
import './App.css';
import { CSSTransitionGroup } from 'react-transition-group';
import './Census.css';

class Test extends Component {
    render(){
        return (
             <div>
                <CSSTransitionGroup transitionName="example" transitionEnter={false} transitionLeave={false} transitionAppear={true}
                    transitionAppearTimeout={500}>
                    <header className='jumbo center'>
                        <div>The US Census Bureau classifies </div>
                        <div><span className='emphasis'>5</span> standards on <span className='emphasis'>Race</span> and <span className='emphasis'>Ethnicity</span></div>
                    </header>
                </CSSTransitionGroup>
                </div>
        );
    }
}
export default Test;