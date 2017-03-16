import React, { Component } from 'react';

class Spr extends Component {
  render() {
    const sprList = this.props.sprData.map((lineItem, i) => {
      return <LineItem key={i} lineItem={lineItem}/>
    })
    return (
      <div>
        <h3 className="text-center"> Membership Score Posting Report</h3>
        <table className="table table-striped table-condensed">
          <SprHeader />
          <tbody>
            {sprList}
          </tbody>
        </table>
      </div>
    );
  }
}

class SprHeader extends Component {
  render() {
    return(
        <thead>
          <tr>
              <th className="text-center">Name</th>
              <th className="text-center">Tee Sheet Appearances</th>
              <th className="text-center">Scores Posted</th>
              <th className="text-center">Adjustments</th>
              <th className="text-center">Score Posting %</th>
          </tr>
        </thead>
    )
  }
}

class LineItem extends Component {
  render() {
    return(
        <tr>
          <td>{this.props.lineItem.name}</td>
          <td className="text-center">{this.props.lineItem.teeSheetAppearances}</td>
          <td className="text-center">{this.props.lineItem.scoresPosted}</td>
          <td className="text-center">{this.props.lineItem.adjustments}</td>
          <td className="text-center">{this.props.lineItem.percentage}%</td>
        </tr>
    )
  }
}

export default Spr;