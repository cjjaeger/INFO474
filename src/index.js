import React from 'react';
import ReactDOM from 'react-dom';
import {Route, Router, hashHistory, IndexRoute} from 'react-router';
import DonutScatterComponent from './DonutScatterComponent';
import ScatterPlotComponent from './ScatterPlotComponent';
import RadarScatterComponent from './RadarScatterComponent';
import BubbleComponent from './BubbleComponent';
import Census from './Census';
import App from './App';
import Filter from './Filter';
import './index.css';
import 'react-mdl/extra/material.css';
import 'react-mdl/extra/material.js';
import "bootstrap/dist/css/bootstrap.css";
import "react-bootstrap-slider/src/css/bootstrap-slider.min.css";
import 'react-select/dist/react-select.css';
import MapComponent from './MapComponent.js';
import PreMap from './PreMapComponent.js';
import PreGraduation from './PreGraduationComponent.js';
import PreCost from './PreCost.js'
import PreSelectivity from './PreSelectivity.js'
import './Census.css';


ReactDOM.render(
    <Router history={hashHistory}>
      <Route path='/' component={App} >
        <IndexRoute component={Filter} />
        <Route path='/pre-map' component={PreMap} />
        <Route path='/map' component={MapComponent} />
        <Route path='/pre-culture' component={Census}/>
        <Route path='/culture'component={RadarScatterComponent}/>
        <Route path='/pre-graduation' component={PreGraduation} />
        <Route path='/graduation' component={ScatterPlotComponent}/>
        <Route path='/pre-cost' component={PreCost}/>
        <Route path='/cost' component={DonutScatterComponent}/>
        <Route path='/pre-selectivity' component={PreSelectivity}/>
        <Route path='/selectivity' component={BubbleComponent}/>
      </Route>
    </Router>,
  document.getElementById('root')
);
