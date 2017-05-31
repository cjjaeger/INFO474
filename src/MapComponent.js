import React, { Component } from 'react';
import Count from './Count.js';
import _ from 'lodash';
import * as L from 'leaflet';
import * as d3 from 'd3';
import 'leaflet/dist/leaflet.css';
import './MapComponent.css';

const sampleStyle = {
    'fontFamily': 'lato',
    'fontSize': '2em',
    'fontWeight': '900',
    'textAlign': 'center'
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
        this.map = L.map('map').setView([40.706213526877455, -74.0044641494751], 7);
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
      
      this.circleMarkers.forEach(function(circleMarker) {
        this.map.removeLayer(circleMarker);
      });
      
      this.circleMarkers = [];
      
      this.props.data.sort((a, b) => b['2014.student.size'] - a['2014.student.size']).forEach(d => {
        this.circleMarkers.push(
          L.circleMarker([d['location.lat'], d['location.lon']], {
            radius: d['2014.student.size'] / 1000,
            color: colorScale(d['school.ownership']),
            fillOpacity: 0.5,
            opacity: 0
          })
            .bindTooltip(d['school.name'])
            .addTo(this.map)
        );
      });

      var findCount = _.countBy(this.props.data, function (d) {
          return d['school.ownership'] === "Private";
      });
      var findRank = _.countBy(this.props.data, function (d) {
          if (d['rank'] !== null) {
              return d['rank'] <= 100;
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
                <link rel="stylesheet" href="https://unpkg.com/leaflet@0.7.7/dist/leaflet.css" />
                <div>
                    <span>For your filters, there are over <Count maxNumber={this.props.data.length} duration='8' textInfo='Universities' /></span>
                </div>
                <div>
                    <Count maxNumber={this.state.public} duration='8' textInfo='Public Universities' /><span style={spanStyle}>  |  </span>    
                    <Count maxNumber={this.state.private} duration='8' textInfo='Private Universities' />
                    <br />
                    <Count maxNumber={this.state.ranked} duration='8' textInfo='are in the Top 100 Universities in the US' />
                </div>
                <div id="map" style={ {width: '100%', height: '500px'} }>
                </div>
            </div>
        );
    }
}

export default MapComponent;

