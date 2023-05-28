import React from "react";
import { Component } from "react";
// import players from "./players";

class LoanTable extends Component {
  constructor(props) {
    super(props);
    this.state = { expandedRows: [] };
    this.loan = props.value;
    this.dataFlag=props.length;
    // console.log(this.loan);
    // console.log(props);
  }
  handleExpand = year => {
    let newExpandedRows = [...this.state.expandedRows];
    let idxFound = newExpandedRows.findIndex(id => {
      return id === year.id;
    });
    console.log(idxFound);
    if (idxFound > -1) {
      console.log("Collapsing " + year.Date + " " + idxFound);
      newExpandedRows.splice(idxFound, 1);
    } else {
      console.log("Expanding " + year.Date);
      newExpandedRows.push(year.id);
    }

    console.log("Expanded rows");
    console.log(newExpandedRows);

    this.setState({ expandedRows: [...newExpandedRows] });
  };

  isExpanded = year => {
    const idx = this.state.expandedRows.find(id => {
      return id === year.id;
    });

    return idx > -1;
  };

  expandAll = loan => {
    console.log("ExapndedRows: " + this.state.expandedRows.length);
    console.log("Loan Years:      " + loan.length);
    if (this.state.expandedRows.length === loan.length) {
      let newExpandedRows = [];
      this.setState({ expandedRows: [...newExpandedRows] });
      console.log("Collapsing all...");
    } else {
      let newExpandedRows = loan.map(year => year.id);
      this.setState({ expandedRows: [...newExpandedRows] });
      console.log("Expanding all...");
      console.log("Expanded rows " + newExpandedRows.length);
    }
  };

  getRows = year => {
    let rows = [];
    const detail = year.detail || [];
    const color = this.isExpanded(year) ? "lightblue" : "blue";
    const backgroundColor = this.isExpanded(year) ? "lightblue" : "";
    const firstRow = (
      <tr className="parent-row" key={year.id} >
        <td>
          {detail.length > 0 && (
            <button onClick={() => this.handleExpand(year)} style={{color:color,  fontWeight:"bold", border:"none", backgroundColor:"none"}}>
              {this.isExpanded(year) ? "--" : "+"}
            </button>
          )}
        </td>
        <td style={{color:color, fontWeight:"bold"}}>{year.Date}</td>
        <td style={{color:color, backgroundColor:backgroundColor,fontWeight:"bold"}}>{year.Balance}</td>
        <td style={{color:color, backgroundColor:backgroundColor,fontWeight:"bold"}}>{year.Interest}</td>
        <td style={{color:color, backgroundColor:backgroundColor,fontWeight:"bold"}}>{year.Principal}</td>

      </tr>
    );

    rows.push(firstRow);

    if (this.isExpanded(year) && detail.length > 0) {
      const detailRows = detail.map(detail => (
        <tr className="year-details child-row" key={detail.id}>
            <td></td>
            <td className="attribute-value">{detail.Date}</td>
            <td className="attribute-value">{detail.Balance}</td>
            <td className="attribute-value">{detail.Interest}</td>
            <td className="attribute-value">{detail.Principal}</td>
        </tr>
      ));

      rows.push(detailRows);
    }

    return rows;
  };

  genTable = loan => {
    // console.log(loan);
    const loanRows = loan.map(year => {
      return this.getRows(year);
    });

    return (
      <table id="amort-tbl" className="small-text right-text">
        <tbody>
        <tr key="header">
          <th  className="banner" onClick={() => this.expandAll(loan)} style={{width:'1%'}}>
            <button  style={{border:"none", fontWeight:"bold"}}>
              {loan.length === this.state.expandedRows.length ? "--" : "+"}
            </button>
          </th>
          <th className="banner" style={{width:"2%"}}>Date</th>
          <th className="banner" style={{width:"5%"}}>Loan Balance</th>
          <th className="banner" style={{width:"5%"}}>Interest</th>
          <th className="banner" style={{width:"5%"}}>Principal</th>

        </tr>
        {loanRows}
        </tbody>
      </table>
    );
  };

    render() {
      if (this.dataFlag)  {
        return <div>{this.genTable(this.loan)}</div>;
      } else {
        return <div></div>;
      }
  };
}

export default LoanTable;