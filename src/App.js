import React, { Component } from 'react';
import './App.css';
import Filter from './Filter';
import {Layout, Header, Drawer, Navigation, Content, Spinner,Textfield, Checkbox  } from 'react-mdl';
import ReactBootstrapSlider from 'react-bootstrap-slider';



class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            "zip": null,
            "inArea": false,
            "radius": null,
            "tuition":[0,70000],
            "department":[],
            "SAT":null,
            "ACT":null,
            "ranking": null
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleCheck = this.handleCheck.bind(this);
    }
    componentWillMount() {
        this.setState({
            passed: false
        });
    }

    handleChange(event) {
        var field = event.target.name;
        var value = event.target.value;

        var changes = {}; //object to hold changes
        changes[field] = value; //change this field
        this.setState(changes); //update state
    }
    filterMap(e){

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
        console.log(event.target.checked);
    }
    render() {
        const {children} = this.props;
        var drawerContent = <Navigation><p>Chat is an online collaborative social media.</p>
        <p>Your work will never be the same</p></Navigation>;
        var stuff = this.state.filter;
        const child = React.cloneElement(children, {stuff});
        console.log(this.state);
        return (

        <Layout fixedHeader fixedDrawer>
            <Header title={<h1> Because College</h1>}>
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

                    <ReactBootstrapSlider
                        value={this.state.tuition}
                        change={this.changeValue}
                        slideStop={this.changeValue}
                        step={1000}
                        max={70000}
                        min={0}
                        reversed={true}
                        range={true}
                        />
                     <button className="btn btn-default"  onClick={(e) => this.signIn(e)}>Sign-In</button>
                </form>
            </Drawer>
            <Content >
            {child}
            </Content>
        </Layout>
    );
  }
}

export default App;
