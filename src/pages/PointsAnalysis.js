import { useState } from "react";
import { amortization } from "../components/calcAmort.js";
import Slider from "../components/MySlider.js";
function PointsAnalysis() {
    const [data, setData] = useState({
        loanAmt: 5000,
        term:30,
        intRateNoPoints: 6.25,
        intRatePoints: 5.75,
        pointsPaid: 0,         
    });
    const out = {
        costOfPoints: 0,
        PINoPoints: 0,
        PIPoints: 0,
        totalPymtsNoPoints: 0,
        totalPymtsPoints: 0,
        totalIntNoPoints: 0,
        totalIntPoints: 0,
        moSavings:0,
        recoveryPeriod:0,
    }
    // const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const noDecimals = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    });

    const thouSep = new Intl.NumberFormat("en-US");

    function calcResults () {
        // ///////////////////////////////////////////////
        // Now update the remaining output fields
        out.costOfPoints = data.loanAmt * data.pointsPaid/100;
        const purchase = {
            intRate: data.intRateNoPoints,
            term: data.term,
            loanAmt: data.loanAmt,
        };
        const loanNoPoints = amortization(purchase, "amortization");
        // console.log(loanNoPoints);
        out.PINoPoints = loanNoPoints[0].principal + loanNoPoints[0].interest;
        out.totalPymtsNoPoints = loanNoPoints.reduce((accum,curr) => accum+(curr.principal+curr.interest),0);
        out.totalIntNoPoints = loanNoPoints.reduce((accum,curr) => accum+curr.interest,0);

        purchase.intRate = data.intRatePoints;
        const loanPoints = amortization(purchase, "amortization");
        out.PIPoints = loanPoints[0].principal + loanPoints[0].interest;
        out.totalPymtsPoints = loanPoints.reduce((accum,curr) => accum+(curr.principal+curr.interest),0);
        out.totalIntPoints = loanPoints.reduce((accum,curr) => accum+curr.interest,0);

        out.moSavings = out.PINoPoints - out.PIPoints;
        out.recoveryPeriod = Math.ceil(out.costOfPoints/out.moSavings);

    }

    calcResults();

    const handleChange = (e) => {
        let updatedValues={};
        switch (e.target.id) {
            case "rs-range-line": {
                const target = e.target.parentElement.parentElement.previousSibling;
                // console.log(e.target, target);
                if (target.matches('.loanAmt, .intRateNoPoints, .term, .intRatePoints, .pointsPaid, .costOfPoints'))
                    setData(data => {return {...data, [target.id]: Number(e.target.value)}});
                break;
            }

            case "downPayAmt": {
                updatedValues = { 
                    downPayAmt: Number(e.target.value), 
                }
                break;
            }
            default: {
                updatedValues = { 
                    [e.target.id]: Number(e.target.value), 
                }
                break;
            }
        }

        setData(data => {return {...data, ...updatedValues}});
    };

    const handleSliderUpdate = (e) => {
        // Get the next sibling element
        const target = e.target.parentElement.parentElement.previousSibling;
        // console.log(e.target, target);
        // console.log(e.target, target);
        if (target.matches('.loanAmt, .intRateNoPoints, .term, .intRatePoints, .pointsPaid, .costOfPoints'))
            setData(data => {return {...data, [target.id]: Number(e.target.value)}});
            // console.log(e.type==='mouseup');
            if (e.type==='mouseup') {
                setData(data => {return {...data, [target.id]: Number(e.target.value)}});
            }
    };

    return (
        <div id="preQual" className="tabcontent">
            <div className="container-fluid">
                <div className="container">
                    <div className="row">
                        <div className="site-container">
                            <div id="">
                                <div className="content-area">
                                    <h3 className="heading-primary centered-text">Mortgage Points Analysis</h3>
                                    <h4 className="heading-tertiary centered-text">Should you lower your interest rate by paying points upfront?</h4>
                                    <br></br>
                                    <p className="main-text max-text-box">You can use this calculator to determine if you should lower your interest rate by paying a lump sum upfront. 
                                    The calculator tells you how long it will take you to recover the additional upfront payment, based on the resulting monthly payment savings due to a lower interest rate. 
                                       <br/>For example, you may refinance your loan, or move to another home, before you have recovered the additional upfront costs. 
                                    </p>
                                    <h1 className="tertiary-text centered-text mx-0 px-0 text-sky-600/100" style={{ lineHeight:'4rem'}}>You would need to carry the loan for <span id="recoveryPeriod" className="font-bold" >{out.recoveryPeriod} </span>months to fully recover the cost of points.</h1>
                                </div>
                                <br/><br/>
                            </div>
                            <form className="form form--loanAmt" style={{gridTemplateColumns:'1.5fr 1fr 2fr'}}>
                                <label className="form-label">Loan Amount ($):</label>
                                <input name="loanAmt" id="loanAmt" size="15" className="loanAmt form-input"
                                    pattern="^\$\d{1,3}(,\d{3})*(\.\d+)?$" data-type="currency" type="number" min='5000' step='5000' value={data.loanAmt} onChange={handleChange}/>
                                <div className="range-slider" style={{width:'50%'}}>
                                    <Slider min ={5000} max={1000000} step={'5000'} summary={false} minmax="none" value={data.loanAmt} handleChange={handleChange} handleSliderUpdate={handleSliderUpdate} />
                                </div>
                            </form>
                            <form className="form form--term" style={{gridTemplateColumns:'1.5fr 1fr 2fr'}}>
                                <label className="form-label" >Loan Term (years):</label>
                                <input id="term" name="term" type="number" step='5' className="term form-input" value={data.term} onChange={handleChange}>
                                </input>
                                <div className="range-slider" style={{width:'50%'}}>
                                    <Slider min ={5} max={30} step={'5'} summary={false} minmax="none" value={data.term} handleChange={handleChange} handleSliderUpdate={handleSliderUpdate} />
                                </div>
                            </form>
                            <form className="form form--intRate" style={{gridTemplateColumns:'1.5fr 1fr 2fr'}}>
                                <label className="form-label">Interest Rate - No Points (%):</label>
                                <input data-type="number" type="number"  step="0.125" min = "0.125"  name="intRateNoPoints" id="intRateNoPoints" 
                                    className="intRateNoPoints form-input" value={data.intRateNoPoints||''} onChange={handleChange}/>
                                <div className="range-slider" style={{width:'50%'}}>
                                    <Slider min ={0} max={10} step={'.125'} summary={false} minmax="none" value={data.intRateNoPoints} handleChange={handleChange} handleSliderUpdate={handleSliderUpdate} />
                                </div>
                            </form>
                            <form className="form form--intRate" style={{gridTemplateColumns:'1.5fr 1fr 2fr'}}>
                                <label className="form-label">Interest Rate - With Points (%):</label>
                                <input data-type="number" type="number"  step="0.125" min = "0.125"  name="intRatePoints" id="intRatePoints" 
                                    className="intRatePoints form-input" value={data.intRatePoints||''} onChange={handleChange}/>
                                <div className="range-slider" style={{width:'50%'}}>
                                    <Slider min ={0} max={10} step={'.125'} summary={false} minmax="none" value={data.intRatePoints} handleChange={handleChange} handleSliderUpdate={handleSliderUpdate} />
                                </div>
                            </form>                            
                            <form className="form" style={{gridTemplateColumns:'1.5fr 1fr 2fr'}}>
                                <label className="form-label" >Number of Points Paid:</label>
                                <input id="pointsPaid" name="pointsPaid" type="number" min="0" step="0.125" className="pointsPaid form-input" value={data.pointsPaid} onChange={handleChange}>
                                </input>
                                <div className="range-slider" style={{width:'50%'}}>
                                    <Slider min ={0} max={5} step={'0.125'} summary={false} minmax="none" value={data.pointsPaid} handleChange={handleChange} handleSliderUpdate={handleSliderUpdate} />
                                </div>
                            </form>
                            <form><label></label><input/></form>
                        </div>
    
                        <section className="white-section " id="monthly-tbl">
                                <h3 className="tbl-header heading-tertiary">Monthly Payment Savings by Buying Points</h3>
                                <div className="centered-tbl  mb-48">
                                    <table className="reduction-tbl small-text  right-text" id="reduction-tbl">
                                        <tbody className="red-tbl-body">
                                            <tr className = "main-text centered-text">
                                                <th colSpan="1" className = 'px-2'></th>
                                                <th colSpan="1" className = 'px-2'>Points</th>
                                                <th colSpan="1" className = 'px-2'>Cost of Points</th>
                                                <th colSpan="1" className = 'px-2'>Rate</th>
                                                <th colSpan="1" className = 'px-2'>Loan</th>
                                                <th colSpan="1" className = 'px-2'>Term (Years)</th>
                                                <th colSpan="1" className = 'px-2'>Monthly Payment</th>
                                                <th colSpan="1" className = 'px-2'>Total Payments</th>
                                                <th colSpan="1" className = 'px-2'>Total Interest Paid</th>
                                                <th colSpan="1" className = 'px-2'>Monthly Savings</th>
                                                <th colSpan="1" className = 'px-2 text-rose-500'>Months to Recover Cost</th>
                                            </tr>
                                            <tr>
                                                <td colSpan="1">Loan with No Points</td>
                                                <td className="pointsPaid" id="">0</td>
                                                <td className="costOfPoints" id="">$0</td>
                                                <td className="intRateNoPoints" id="">{data.intRateNoPoints}</td>
                                                <td className="loanAmt" id="">{noDecimals.format(data.loanAmt)}</td>
                                                <td className="term" id="">{data.term}</td>
                                                <td className="PINoPoints" id="">{noDecimals.format(out.PINoPoints)}</td>
                                                <td className="totalPymtsNoPoints" id="">{noDecimals.format(out.totalPymtsNoPoints)}</td>
                                                <td className="totalIntNoPoints" id="">{noDecimals.format(out.totalIntNoPoints)}</td>
                                                <td className="moSavings" id="">N/A</td>
                                                <td className="recoveryPeriod text-rose-500 font-extrabold" id="">N/A</td>
                                            </tr>
                                            <tr>
                                                <td colSpan="1">Loan With Points</td>
                                                <td className="pointsPaid" id="">{data.pointsPaid}</td>
                                                <td className="costOfPoints" id="">{noDecimals.format(out.costOfPoints)}</td>
                                                <td className="intRatePoints" id="">{data.intRatePoints}</td>
                                                <td className="loanAmt" id="">{noDecimals.format(data.loanAmt)}</td>
                                                <td className="term" id="">{data.term}</td>
                                                <td className="PIPoints" id="">{noDecimals.format(out.PIPoints)}</td>
                                                <td className="totalPymtsPoints" id="">{noDecimals.format(out.totalPymtsPoints)}</td>
                                                <td className="totalIntPoints" id="">{noDecimals.format(out.totalIntPoints)}</td>
                                                <td className="moSavings" id="">{noDecimals.format(out.moSavings)}</td>
                                                <td className="recoveryPeriod text-rose-500 font-extrabold" id="">{out.recoveryPeriod}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </section>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PointsAnalysis;