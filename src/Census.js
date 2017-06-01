import React, { Component } from 'react';
import './App.css';
import { CSSTransitionGroup } from 'react-transition-group';
import ReactTooltip from 'react-tooltip';
import {Button } from 'react-mdl';
import { hashHistory } from 'react-router';

class Census extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mounted: false,
            race: {
                'White': 'A person having origins in any of the original peoples of Europe, the Middle East, or North Africa.',
                'Black or African American': 'A person having origins in any of the Black racial groups of Africa.',
                'American Indian or Alaska Native': 'A person having origins in any of the original peoples of North and South America (including Central America) and who maintains tribal affiliation or community attachment.',
                'Asian': 'A person having origins in any of the original peoples of the Far East, Southeast Asia, or the Indian subcontinent including, for example, Cambodia, China, India, Japan, Korea, Malaysia, Pakistan, the Philippine Islands, Thailand, and Vietnam.',
                'Native Hawaiian or Other Pacific Islander': 'A person having origins in any of the original peoples of Hawaii, Guam, Samoa, or other Pacific Islands.',
                'Hispanic Origin': 'Hispanic origin can be viewed as the heritage, nationality, lineage, or country of birth of the person or the person’s parents or ancestors before arriving in the United States. People who identify as Hispanic, Latino, or Spanish may be any race.'
            },
            hover:''
        }

    }
    filterMap(e){
      e.preventDefault();
      hashHistory.push('/viz/2');
    }

    render() {

        var origins = Object.keys(this.state.race).map((value, i) =>
            <div className='jumbo center col-md-4 race test' key={i} value={value}
            data-tip={this.state.race[value]}>{value}</div>);
        return (
            <div className = 'test'>
                <CSSTransitionGroup transitionName="main" transitionEnter={false} transitionLeave={false} transitionAppear={true}
                    transitionAppearTimeout={1000}>
                    <header className='jumbo center'>
                        <div>The US Census Bureau classifies </div>
                        <div><span className='emphasis'>6</span> standards on <span className='emphasis'>Race</span> and <span className='emphasis'>Ethnicity</span></div>
                    </header>
                    {origins}
                    <ReactTooltip place='bottom' className='emphasis' multiline/>
                    <Button className='anchorBR' onClick={this.filterMap} raised ripple colored>Next >></Button>
                </CSSTransitionGroup>
            </div>
        );
    }
}
export default Census;
