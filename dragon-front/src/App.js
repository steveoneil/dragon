import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import Spr from './Spr'
import MySpr from './MySpr'

const SERVERURL = 'http://localhost:8080';
// const SERVERURL = 'http://stevo.ca';
// const SERVERURL = '';

class App extends Component {
  constructor(){
    super();
      this.state = {
        sprData: [],
        mySprData: {
          name: '',
          activity: []
        },
        memberId: '',
        reason: '',
        page: 'home'
      }
      this.clickHandler = this.clickHandler.bind(this);
      this.searchHandler = this.searchHandler.bind(this);
      this.inputAdjustment = this.inputAdjustment.bind(this);
      this.addAdjustment = this.addAdjustment.bind(this);
  }

  searchHandler (event) {
    this.setState({
      memberId: event.target.value
    })
  }

  inputAdjustment (event) {
    this.setState({
      reason: event.target.value
    })
  }

  addAdjustment (date, lineNumber) {
    let updateMySprData = this.state.mySprData;
    updateMySprData.activity[lineNumber].adjustment = true;
    updateMySprData.activity[lineNumber].reason = this.state.reason;
    this.setState({
      mySprData: updateMySprData
    })
  }

  clickHandler (page, memberId) {
    let _this = this;
    this.setState({
      page: page
    });
    if (page === 'spr') {
      axios.get(SERVERURL + '/api/club/activity')
      .then (function (response) {
        _this.setState({
          sprData: response.data,
        })
      })
    }
    if (page === 'mySpr') {
      axios.get(SERVERURL + '/api/member/activity/' + this.state.memberId)
      .then (function (response) {
        _this.setState({
          mySprData: response.data,
        })
      })
    }
  }

  render() {
    let display = null;
    if (this.state.page === 'spr') {
      display =
        <div>
          <h4> Click to view my Personal Score Posting Record</h4>
          <input id="memberId" className="form-control" type="text" onChange={this.searchHandler} placeholder="0981K0" />
          <button id="my-spr" className="btn-info" onClick={() => this.clickHandler('mySpr')}> My SPR </button>
          <Spr sprData={this.state.sprData}/>
        </div>;
    } else if (this.state.page === 'mySpr') {
      display = 
        <div>
          <h4> Click to view Membership Score Posting Report</h4>
          <button id="club-spr" className="btn-info" onClick={() => this.clickHandler('spr')}> Club SPR </button>
          <MySpr mySprData={this.state.mySprData} addAdjustment={this.addAdjustment} inputAdjustment={this.inputAdjustment} />
        </div>;
    } else {
      display = 
        <div>
          <h4> Click to view Membership Score Posting Report</h4>
          <button id="club-spr" className="btn-info" onClick={() => this.clickHandler('spr')}> Club SPR </button>
          <br/>
          <h4> Click to view my Personal Score Posting Record</h4>
          <input id="memberId" className="form-control" type="text" onChange={this.searchHandler} placeholder="0981K0" />
          <button id="my-spr" className="btn-info" onClick={() => this.clickHandler('mySpr')}> My SPR </button>
        </div>;
    }
    return (
      <div className="main-header">
        <button className="btn-info" onClick={() => this.clickHandler('home')}> Home </button>
        <h1 className="text-center"> St. George's Score Reporting Centre</h1>
          {display}
      </div>
    );
  }
}

export default App;

