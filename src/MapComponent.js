import React, { Component } from 'react';
import Count from './Count.js';
import _ from 'lodash';
import * as L from 'leaflet';
import * as d3 from 'd3';
import { Button } from 'react-mdl';
import { hashHistory } from 'react-router';
import 'leaflet/dist/leaflet.css';
import './MapComponent.css';
import { CSSTransitionGroup } from 'react-transition-group';

const sampleStyle = {
    'fontFamily': 'lato',
    'fontSize': '2em',
    'fontWeight': '900',
    'textAlign': 'center',
    'marginTop': '30px',
    'width': '100%'
}
const spanStyle = {
    'color':'#4CAF50'
}
const colorScale = d3.scaleOrdinal().domain(['Private', 'Public']).range(d3.schemeCategory10);

class MapComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            public: 0,
            private: 0,
            ranked: 0,
            hasMap: false
        }
        this.map = null;
        this.circleMarkers = [];
    }

    update() {
      if (!this.state.hasMap) {
        if (this.map) {
          this.map.remove();
        }
        this.map = L.map('map');
        L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', {
          maxZoom: 18, attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy;<a href="https://carto.com/attribution">CARTO</a>'
        }).addTo(this.map);

        var legend = L.control({position: 'bottomright'});

        legend.onAdd = function (map) {

            var div = L.DomUtil.create('div', 'info legend'),
                types = ['Private', 'Public'];

            // loop through our density intervals and generate a label with a colored square for each interval
            for (var i = 0; i < types.length; i++) {
                div.innerHTML +=
                    '<div style="width:100%"><i style="background:' + colorScale(types[i]) + '"></i> ' +
                    types[i] + '</div><br>';
            }

            return div;
        };

        legend.addTo(this.map);
      }

      // The sort is so that smaller schools are on top on the map, making
      // them hoverable.
      // We exclude University of Guam because it is too far away.
      var mapData = this.props.data
        .filter(d => d['2014.student.size'] !== null)
        .sort((a, b) => b['2014.student.size'] - a['2014.student.size'])
        .filter(d => d['name'] !== 'University of Guam')
        .filter(d => d['location.lat'] !== 0 || d['location.lon'] !== 0);

      var [latMin, latMax] = d3.extent(mapData, d => d['location.lat']);
      var [lonMin, lonMax] = d3.extent(mapData, d => d['location.lon']);

      this.map.fitBounds([
        [latMin, lonMin],
        [latMax, lonMax]
      ]);

      this.circleMarkers.forEach(circleMarker => {
        this.map.removeLayer(circleMarker);
      });

      this.circleMarkers = [];

      const sizeScale = d3.scaleLinear()
        .domain(d3.extent(mapData, d => d['2014.student.size']))
        .range([5, 30]);

      mapData
        .forEach(d => {
          this.circleMarkers.push(
            L.circleMarker([d['location.lat'], d['location.lon']], {
              radius: sizeScale(d['2014.student.size']),
              color: colorScale(d['school.ownership']),
              fillOpacity: 0.5,
              opacity: 0
            })
              .bindTooltip(`${d['name']}<br>${d['2014.student.size'].toLocaleString()} students`)
              .addTo(this.map)
          );
        });

      var findCount = _.countBy(this.props.data, function (d) {
          return d['school.ownership'] === "Private";
      });
      var findRank = _.countBy(this.props.data, function (d) {
          if (d['rank'] !== null) {
              return d['rank'] <= 50;
          }
      });
      this.setState({ public: findCount['false'], private: findCount['true'], ranked: findRank['true'], hasMap: true });
    }

    componentDidMount() {
      this.update();
    }

    componentWillReceiveProps(props) {
      this.props = props;
      this.update();
    }

    render() {
        return (
            <div style={sampleStyle}>
                <CSSTransitionGroup transitionName="main" transitionEnter={false} transitionLeave={false} transitionAppear={true}
                    transitionAppearTimeout={1000}>
                <div>
                    <Count maxNumber={this.state.public || 0 } duration='8' textInfo='Public Universities' /><span style={spanStyle}>  |  </span>
                    <Count maxNumber={this.state.private || 0} duration='8' textInfo='Private Universities' />
                    <br/>
                    <Count maxNumber={this.state.ranked || 0} duration='8' textInfo='are in the Top 50 Universities in the US' />
                </div>
                <div id="map" style={ {width: '100%', height: '500px'} }>
                </div>
                <div className="center">
                    <Button onClick={() => hashHistory.push('/pre-map')} raised ripple colored>&lt;&lt; Back</Button>
                    <Button onClick={() => hashHistory.push('/pre-graduation')} raised ripple colored>Next &gt;&gt;</Button>
                </div>
                </CSSTransitionGroup>
            </div>
        );
    }
}

export default MapComponent;
