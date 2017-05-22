import React from 'react';
import ReactDOM from 'react-dom';
import {Route, Router, hashHistory, IndexRoute} from 'react-router';
import App from './App';
import Filter from './Filter';
import GraphView from './GraphView';
import './index.css';
import 'react-mdl/extra/material.css';
import 'react-mdl/extra/material.js';
import "bootstrap/dist/css/bootstrap.css";
import "react-bootstrap-slider/src/css/bootstrap-slider.min.css"

ReactDOM.render(
    <Router history={hashHistory}>
      <Route path='/' component={App} >
        <IndexRoute component={Filter} />
        <Route path='/viz' component={GraphView}  >
          <Route path=':graphType'/>
        </Route>
      </Route>
    </Router>,
  document.getElementById('root')
);
