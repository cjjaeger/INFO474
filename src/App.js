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
            "filter":{
                "zip": "",
                "inArea": false,
                "radius": null,
                "tuition":[0,70000],
                "department":[],
                "SAT":null,
                "ACT":null,
                "ranking": null,
                "handleCheck": this.setZip = this.setZip.bind(this),
                "zipltlng":{},
                "zipState":""
            }
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleCheck = this.handleCheck.bind(this);
        this.setZip = this.setZip.bind(this);
        this.changeValue = this.changeValue.bind(this);
        this.logChange = this.logChange.bind(this);
        this.setZipLocation = this.setZipLocation.bind(this);
        this.applyFilter = this.applyFilter.bind(this);
    }
    componentWillMount() {
        var childState = Object.assign({}, this.state);
        childState.data = data;
        this.child = React.cloneElement(this.props.children, childState);
    }
    componentWillReceiveProps(props){
        var childState = Object.assign({}, this.state);
        childState.data = data;
        this.child = React.cloneElement(this.props.children, childState);
        this.forceUpdate();
    }
    setZip(event){

        this.handleChange(event);
    }
    changeValue(e){
        this.state.filter.tuition = e.target.value;
        console.log(this.state);
    }
    applyFilter(e){
        e.preventDefault();
        var url = "https://maps.googleapis.com/maps/api/geocode/json?address="+ encodeURIComponent(this.state.filter.zip);
        fetch(url) //download the data
      .then(function(res) { return res.json(); })
      .then((datas) =>{
        this.setZipLocation(datas.results);
      });
        this.forceUpdate();
    }
    setZipLocation(datas){
        this.state.filter.zipltlng = datas[0].geometry.location; //update state
        var stateFips = datas[0].address_components[3].short_name
        this.state.filter.zipState = stateData[stateFips] ; //update state
        var newData = data.filter((obj)=>{
            return obj['2014.cost.tuition.out_of_state'] >= this.state.filter.tuition[0] && obj['2014.cost.tuition.out_of_state'] <= this.state.filter.tuition[1];
        });
        console.log(newData);

    }

    handleChange(event) {
        var field = event.target.name;
        var value = event.target.value;
        this.state.filter[field] = value; //update state
        this.forceUpdate();
    }
    logChange(val){
        this.state.filter.department = val;
        this.forceUpdate();
    }


    handleCheck(event){
        if(event.target.checked){
            this.setState({
                inArea:true
            });
        }else{
            this.setState({
                inArea:false
            });
        }
        //console.log(event.target.checked);
    }

    render() {
        console.log(stateData);
        //console.log( this.props);
        var deptsList = ["Aeronautics and Astronautics","African Studies",
        "American Ethnic Studies",
        "American Indian Studies",
        "Anesthesiology",
        "Anthropology",
        "Applied and Computational Mathematical Sciences (ACMS)",
        "Applied Mathematics",
        "Aquatic and Fishery Sciences",
        "Architecture",
        "Art, Art History, and Design",
        "Astronomy",
        "Biochemistry",
        "Bioengineering",
        "Biology",
        "Biostatistics",
        "Chemistry",
        "Classics",
        "Communication",
        "Dance",
        "Drama",
        "Economics",
        "Endodontics",
        "English",
        "Epidemiology",
        "Geography",
        "Germanics",
        "History",
        "Immunology",
        "Linguistics",
        "Mathematics",
        "Medicine",
        "Microbiology",
        "Museology",
        "Music",
        "Nephrology",
        "Neurology",
        "Neurosurgery",
        "Oceanography",
        "Ophthalmology",
        "Orthodontics",
        "Pathobiology",
        "Pathology",
        "Pediatrics",
        "Periodontics",
        "Pharmaceutics",
        "Pharmacology",
        "Pharmacy",
        "Philosophy",
        "Physics",
        "Psychology",
        "Radiology",
        "Sociology",
        "Statistics",
        "Surgery",
        "Urology"];
        for (var i = 0; i < deptsList.length; i++) {
            deptsList[i] = {"value":deptsList[i], "label":deptsList[i]};
        }
        return (
        <Layout fixedHeader fixedDrawer>
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
                    <Select
                        multi simpleValue
                      name="form-field-name"
                      value={this.state.filter.department}
                      options={deptsList}
                      onChange={this.logChange}
                      placeholder="Select desired departments"
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
                        max={70000}
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
