import React, { Component } from 'react';
import './App.css';
import { Layout, Header, Drawer, Content, Textfield, Checkbox, Button } from 'react-mdl';
import { ControlLabel } from 'react-bootstrap';
import ReactBootstrapSlider from 'react-bootstrap-slider';
import Select from 'react-select';
import 'whatwg-fetch';

// Just importing for now, but this slows down initial page load
import data from '../public/data/merged-data.json';
import stateData from '../public/data/state-abbr-to-fips.json';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            filter:{
                zip: "",
                inArea: false,
                radius: null,
                tuition:[0,53000],
                SAT:"",
                ACT:"",
                ranking: "",
                handleCheck: this.setZip.bind(this),
                zipltlng:{},
                zipState:""
            },
            data: data.map(obj => {
                obj.tuition = obj['2014.cost.tuition.out_of_state'];
                return obj;
            }),
            donutScatterIntroPlayed: false,
            onDonutScatterIntroPlayed: () => {
              this.setState({donutScatterIntroPlayed: true});
            }
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleCheck = this.handleCheck.bind(this);
        this.setZip = this.setZip.bind(this);
        this.changeValue = this.changeValue.bind(this);
        this.setZipLocation = this.setZipLocation.bind(this);
        this.applyFilter = this.applyFilter.bind(this);
        this.distFrom = this.distFrom.bind(this);
        this.toRad = this.toRad.bind(this);
        this.tuitionFilter = this.tuitionFilter.bind(this);
        this.satFilter = this.satFilter.bind(this);
        this.actFilter = this.actFilter.bind(this);
        this.rankingFilter = this.rankingFilter.bind(this);
    }

    componentWillMount() {
        var childState = Object.assign({}, this.state);
        this.child = React.cloneElement(this.props.children, childState);
    }

    componentWillReceiveProps(props) {
        var childState = Object.assign({}, this.state);
        this.child = React.cloneElement(this.props.children, childState);
    }

    setZip(event) {
        this.handleChange(event);
    }

    changeValue(e) {
        this.state.filter.tuition = e.target.value;
    }

    applyFilter(e) {
        e.preventDefault();
        var zipPromise;
        if ( /(^\d{5}$)|(^\d{5}-\d{4}$)/.test(this.state.filter.zip)) {
            var url = "https://maps.googleapis.com/maps/api/geocode/json?address="+ encodeURIComponent(this.state.filter.zip);

            zipPromise = fetch(url) //download the data
                .then(function(res) { return res.json(); })
                .then((datas) =>{
                    return this.setZipLocation(datas.results);
                });

        } else {
            // When we don't have a zip, assume out of state
            zipPromise = Promise.resolve(data.map(obj => {
                obj.tuition = obj['2014.cost.tuition.out_of_state'];
                return obj;
            }));
        }
         zipPromise.then(this.satFilter)
            .then(this.actFilter)
            .then(this.rankingFilter)
            .then(this.tuitionFilter);
    }

    satFilter(datas) {
        if (this.state.filter.SAT !== "") {
            return datas.filter((obj)=>{
                return this.state.filter.SAT>=obj["2014.admissions.sat_scores.average.overall"];
            });
        } else {
            return datas;
        }
    }

    actFilter(datas) {
        if (this.state.filter.ACT !== "") {
            return datas.filter((obj)=>{
                return this.state.filter.ACT>=obj["2014.admissions.act_scores.midpoint.cumulative"];
            });
        } else {
            return datas;
        }
    }

    rankingFilter(datas) {
        if ((this.state.filter.ranking).length !== 0) {
            var newData= datas.filter((obj)=>{
                return this.state.filter.ranking >=obj["rank"] && obj["rank"] !== null ;
            });
            return newData;
        } else {
            return datas;
        }
    }

    tuitionFilter(lastData) {
        var newData = lastData.filter((obj)=>{
                return obj.tuition >= this.state.filter.tuition[0] && obj.tuition <= this.state.filter.tuition[1];
            });
        var childState = Object.assign({}, this.state);
        childState.data = newData;
        this.child = React.cloneElement(this.props.children, childState);
        this.setState({"data": newData});
    }

    distFrom(lat1, lng1, lat2, lng2) {
        var earthRadius = 3958.75; // miles (or 6371.0 kilometers)
        var dLat = this.toRad(lat2-lat1);
        var dLng = this.toRad(lng2-lng1);
        var sindLat = Math.sin(dLat / 2);
        var sindLng = Math.sin(dLng / 2);
        var a = Math.pow(sindLat, 2) + Math.pow(sindLng, 2)
                * Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2));
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        var dist = earthRadius * c;
        return dist;
    }

    toRad(Value) {
        /** Converts numeric degrees to radians */
        return Value * Math.PI / 180;
    }

    setZipLocation(datas) {
        this.state.filter.zipltlng = datas[0].geometry.location; //update state
        var stateFips = datas[0].address_components[3].short_name
        this.state.filter.zipState = parseInt(stateData[stateFips], 10); //update state
        var newData = data;
        if (this.state.inArea) {
           newData= data.filter((obj)=>{
            var radius = this.state.filter.radius;
            var dist = this.distFrom(obj["location.lat"], obj["location.lon"],this.state.filter.zipltlng["lat"],this.state.filter.zipltlng["lng"]);
            return radius>= dist;
            });
        }

        var sent = newData.map(obj => {
            console.log(this.state.filter.zipState);
            if (obj["school.state_fips"] === this.state.filter.zipState) {
                obj.tuition = obj['2014.cost.tuition.in_state'];
            } else {
                obj.tuition = obj['2014.cost.tuition.out_of_state'];
            }
            return obj;
        });
         return sent;
    }

    handleChange(event) {
        var field = event.target.name;
        var value = event.target.value;
        this.state.filter[field] = value; //update state
        this.forceUpdate();
    }

    handleCheck(event) {
        if (event.target.checked) {
            this.setState({
                inArea:true
            });
        } else {
            this.setState({
                inArea:false
            });
        }
    }

    render() {
        return (
        <Layout fixedHeader>
            <Header>
              <h1>Because College</h1>
            </Header>
            <Drawer title="Filter">
                <form role="form">
                    <Textfield
                        onChange={this.handleChange}
                        pattern="-?[0-9]*(\.[0-9]+)?"
                        error="Input is not a number!"
                        label="Zip Code"
                        style={{width: '200px'}}
                        name="zip"
                        value={this.state.filter.zip}
                        floatingLabel
                        />
                    <Checkbox
                        label="Only show colleges in your area"
                        onChange={this.handleCheck}
                        name="inArea"
                        />
                    {this.state.inArea &&
                    <Textfield
                       onChange={this.handleChange}
                       pattern="-?[0-9]*(\.[0-9]+)?"
                       error="Input is not a number!"
                       label="Radius in miles"
                       style={{width: '200px'}}
                       name="radius"
                       floatingLabel
                       />
                    }
                    <Textfield
                        onChange={this.handleChange}
                        pattern="-?[0-9]*(\.[0-9]+)?"
                        error="Input is not a number!"
                        label="SAT Score"
                        style={{width: '200px'}}
                        name="SAT"
                        floatingLabel
                        />

                    <Textfield
                        onChange={this.handleChange}
                        pattern="-?[0-9]*(\.[0-9]+)?"
                        error="Input is not a number!"
                        label="ACT Score"
                        style={{width: '200px'}}
                        name="ACT"
                        floatingLabel
                        />

                    <Textfield
                        onChange={this.handleChange}
                        pattern="-?[0-9]*(\.[0-9]+)?"
                        error="Input is not a number!"
                        label="Lowest College Ranking"
                        style={{width: '200px'}}
                        name="ranking"
                        floatingLabel
                        />
                    <ControlLabel>Tuition Range:</ControlLabel>
                    <ReactBootstrapSlider
                        value={this.state.filter.tuition}
                        change={this.changeValue}
                        slideStop={this.changeValue}
                        step={1000}
                        max={52000}
                        min={0}
                        reversed={false}
                        name="tuition"
                        />
                    <div id="filterButton">
                        <Button onClick={this.applyFilter} raised colored>Apply Filter</Button>
                    </div>
                </form>
            </Drawer>
            <Content >
                {this.child}
            </Content>
        </Layout>
      );
  }
}

export default App;
