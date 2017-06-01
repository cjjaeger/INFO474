import React from 'react';
import ReactDOM from 'react-dom';
import {Route, Router, hashHistory, IndexRoute} from 'react-router';
import DonutScatterComponent from './DonutScatterComponent';
import ScatterPlotComponent from './ScatterPlotComponent';
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
import './Census.css';


ReactDOM.render(
    <Router history={hashHistory}>
      <Route path='/' component={App} >
        <IndexRoute component={Filter} />
        <Route path='/viz/1'component={DonutScatterComponent}/>
        <Route path='/viz/2'component={ScatterPlotComponent}/>
        <Route path='/selectivity'component={BubbleComponent}/>
        <Route path='/map' component={MapComponent} />
        <Route path='/pre-viz'component={Census}/> 
      </Route>
    </Router>,
  document.getElementById('root')
);
