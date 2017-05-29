import React, { Component } from 'react';
import './App.css';
import {CSSTransitionGroup} from 'react-transition-group';
import './Census.css';

class Census extends Component {
    constructor(props) {
        super(props);
        this.state = {
            'White': 'A person having origins in any of the original peoples of Europe, the Middle East, or North Africa.',
            'Black or African American': 'A person having origins in any of the Black racial groups of Africa.',
            'American Indian or Alaska Native': 'A person having origins in any of the original peoples of North and South America (including Central America) and who maintains tribal affiliation or community attachment.',
            'Asian': 'A person having origins in any of the original peoples of the Far East, Southeast Asia, or the Indian subcontinent including, for example, Cambodia, China, India, Japan, Korea, Malaysia, Pakistan, the Philippine Islands, Thailand, and Vietnam.',
            'Native Hawaiian or Other Pacific Islander': 'A person having origins in any of the original peoples of Hawaii, Guam, Samoa, or other Pacific Islands.',
            'Hispanic Origin': 'Hispanic origin can be viewed as the heritage, nationality, lineage, or country of birth of the person or the person’s parents or ancestors before arriving in the United States. People who identify as Hispanic, Latino, or Spanish may be any race.'
        }

    }
    render() {
        var origins = Object.keys(this.state).map((value, i) =>
            <span className='jumbo center col-md-4' key={value}>{value}</span>
        );
        return (
            <div>
                <header className='jumbo center'>
                    <div>The US Census Bureau classify </div>
                    <div><span className='emphasis'>5</span> standards on <span className='emphasis'>Race</span> and <span className='emphasis'>Ethnicity</span></div>
                </header>
                <CSSTransitionGroup transitionName="example" transitionEnterTimeout={500} transitionLeaveTimeout={300}>
                    <h1>Hello</h1>
                </CSSTransitionGroup>
            </div>
        );
    }
}
export default Census
