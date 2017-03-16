import React, { Component } from 'react';

class MySpr extends Component {
  render() {
    let sprTotals = {
      rounds: 0,
      scores: 0,
      adjustments: 0,
      percentage: 0
    }
    const mySprList = this.props.mySprData.activity.map((myLineItem, i) => {
      if (myLineItem.onTeeSheet) {sprTotals.rounds++}
      if (myLineItem.scorePosted) {sprTotals.scores++}
      if (myLineItem.adjustment) {sprTotals.adjustments++}
      return <MyLineItem key={i} lineNumber={i} myLineItem={myLineItem} addAdjustment={this.props.addAdjustment} inputAdjustment={this.props.inputAdjustment} />
    })
    return (
      <div>
        <h3 className="text-center"> Individual Score Posting Record for {this.props.mySprData.name}</h3>
        <table className="table table-striped table-condensed">
          <MySprHeader />
          <tbody>
            {mySprList}
          </tbody>
        </table>
        <MySprTotal sprTotals={sprTotals} />
      </div>
    );
  }
}

class MySprHeader extends Component {
  render() {
    return(
        <thead>
          <tr>
              <th className="text-center">Date of Round</th>
              <th className="text-center">Score Posted?</th>
              <th className="text-center">Adjustment?</th>
              <th className="text-center">Reason</th>
          </tr>
        </thead>
    )
  }
}

class MyLineItem extends Component {
  render() {
    let scorePosted = 'Yes';
    let adjustment = 'No';
    if (!this.props.myLineItem.scorePosted) {
      scorePosted = 'No'
      if (!this.props.myLineItem.adjustment) {
        this.props.myLineItem.reason = <span><input id="reason" className="form-control" type="text" onChange={this.props.inputAdjustment}
        placeholder="Tornado..." /><button className="adjustment" onClick={() => this.props.addAdjustment(this.props.myLineItem.date, this.props.lineNumber)}>
        Add Adjustment?</button></span>;
      } else {adjustment = 'Yes'}
    }
    return(
        <tr>
          <td className="text-center">{this.props.myLineItem.date.substring(0,10)}</td>
          <td className="text-center">{scorePosted}</td>
          <td className="text-center">{adjustment}</td>
          <td id="reason-adjust" className="text-center">{this.props.myLineItem.reason}</td>
        </tr>
    )
  }
}

class MySprTotal extends Component {
  render() {
    let sprPercentage = Math.floor(100 * 
    (this.props.sprTotals.scores + this.props.sprTotals.adjustments)/this.props.sprTotals.rounds)
    return(
      <table className="table table-condensed totals">
        <thead>
          <tr>
              <th className="text-center">Total Rounds</th>
              <th className="text-center">Total Scores</th>
              <th className="text-center">Adjustments</th>
              <th className="text-center">SPR %</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="text-center">{this.props.sprTotals.rounds}</td>
            <td className="text-center">{this.props.sprTotals.scores}</td>
            <td className="text-center">{this.props.sprTotals.adjustments}</td>
            <td className="text-center">{sprPercentage}%</td>
          </tr>
        </tbody>
      </table>
    )
  }
}

export default MySpr;