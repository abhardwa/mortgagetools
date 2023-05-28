import { useState } from "react";
import { amortization } from "./calcAmort.js";
function PreQual() {
    const [data, setData] = useState({
        "purchaseAmt": 350000,
        "downPayPercAmt": 20,
        "downPayAmt": 70000,
        "loanAmt": 280000,
        "intRate": 6.25,
        "term":30,
        "propTaxAmt":0,
        "insAmt":0,
        "assocAmt":0,
        "pmiPercAmt":"",
        "grossPay":0,
        "moMPay":0,
        "caMPay":0,
        "otMPay":0,
        "stLoanBal":0,
        "ccMPay":0,

    });
    const out = {
        downPayPercAmt: 20,
        pmiAmt: 0,
        pmtPI: 0,
        pmtPITI: 0,
        qualifyYN: "",
        qualifyColor:"",
        qualifyMax: 0,
        ratioIncome:0,
        ratioDebt:0,
        moDebts:0,
    }
    // const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const noDecimals = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    });

    function calcPreQual () {
        // ///////////////////////////////////////////////
        // Now update the remaining output fields
        console.log(data);
        console.log(out);
        out.pmiAmt = (data.pmiPercAmt * data.purchaseAmt) / 12 / 100;
        out.pmtPI = amortization(data, "");
        out.pmtPITI = Number(out.pmtPI + data.propTaxAmt / 12 + data.insAmt / 12 + out.pmiAmt + data.assocAmt);
        out.moDebts = data.moMPay + data.caMPay + data.otMPay + (data.stLoanBal * .005) + data.ccMPay;
        out.downPayPercAmt = data.downPayAmt * 100 / data.purchaseAmt;


        if (((out.moDebts + out.pmtPITI) * 12) / data.grossPay <= 0.45) {
            out.qualifyYN = "Great News! You Qualify 👍🏼";
            out.qualifyColor = "rgb(16, 115, 9)";
        } else {
            out.qualifyYN = "Sorry, You do not Qualify 😞 Please see the Max Loan Amount Below";
            out.qualifyColor = "rgb(139, 54, 79)";
        };

        const maxPiAmtB = ((data.grossPay / 12) * 0.45 - out.moDebts) * (data.pmiPercAmt > 0 ? 0.77 : 0.8); // This accounts for 1.9% for taxes, insurance, PMI
        // console.log(maxPiAmtB);
        out.qualifyMax = calcLoanAmt(data, maxPiAmtB);
        out.ratioIncome = ((out.pmtPITI * 12) / data.grossPay) * 100;
        out.ratioDebt = (((out.pmtPITI + out.moDebts) * 12) / data.grossPay) * 100;
        console.log(`out.moDebts: ${out.moDebts}`);
       
        function calcLoanAmt(purchase, X) {
            const monthlyRate = purchase.intRate / 100 / 12;
            const numPayments = 12 * purchase.term;
            const loanAmount = X / (monthlyRate / (1 - (1 + monthlyRate) ** -numPayments));
            return loanAmount;
            // return X * 12 * (1 - (1 + purchase.intRate / (12 * 100)) ** (12 * purchase.term));
        }
    }

    calcPreQual();

    const handleChange = (e) => {
        let updatedValues={};
        switch (e.target.id) {
            case "purchaseAmt": {
                updatedValues = { 
                    "purchaseAmt": Number(e.target.value), 
                    "loanAmt": Number(e.target.value) - data.downPayAmt,
                }
                break;
            }
            case "downPayAmt": {
                updatedValues = { 
                    "downPayAmt": Number(e.target.value), 
                    "loanAmt": data.purchaseAmt - Number(e.target.value),
                }
                break;
            }
            case "loanAmt": {
                updatedValues = { 
                    "loanAmt": Number(e.target.value), 
                    "downPayAmt": data.purchaseAmt - Number(e.target.value),
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

        setData(data => {
            return {
            ...data, ...updatedValues
            }
        });
    };

    return (
        <div id="preQual" className="tabcontent">
            <div className="container-fluid">
                <div className="container">
                    <div className="row">
                        <div className="site-container">
                            <div id="">
                                <div className="content-area">
                                    <h3 className="heading-primary centered-text">Pre-Qual Calculator</h3>
                                    <h4 className="heading-tertiary centered-text">How much house can you afford or qualify for?</h4>
                                    <br></br>
                                    <p className="main-text max-text-box">Enter the Property detail, Income, and Liabilities below to see how much loan you could qualify for. The
                                        calculator will calculate your payments and determine if you qualify for the entered loan, based on
                                        your income and liabilities. The calculator will also provide you on the right, with an estimated maximum amount you can qualify for, given the entered loan rate and term.</p>
                                </div>
                            </div>
                            <div className = "grid-container">
                                <div className = "main-grid">
                                    <div className = "input-block purchase">
                                        <form className="form">
                                            <div className="form-subheading">
                                                <h4 className="subheading">Home Purchase Information</h4>
                                            </div>
                                            <label className="form-label">Home Price:</label>
                                            <input name="purchaseAmt" id="purchaseAmt" value={data.purchaseAmt} onChange={handleChange} step="10000"
                                                pattern="^\$\d{1,3}(,\d{3})*(\.\d+)?$" data-type="currency" type="text" className="form-input"/>
                                            <span className="form-suffix">$</span>
                                            <label className="form-label">Down Payment:</label>
                                            <input name="downPayAmt" id="downPayAmt" value={data.downPayAmt} onChange={handleChange} step="1000"
                                                pattern="^\$\d{1,3}(,\d{3})*(\.\d+)?$" data-type="currency" type="text" className="form-input"/>
                                            <span className="form-suffix">$</span>
                                            <label className="form-label" >Down Payment:</label>
                                            <span data-type="number" type="number" step=".125" name="downPayPercAmt" id="downPayPercAmt"
                                                className="form-out">{out.downPayPercAmt.toFixed(0)}</span>
                                            <span className="form-suffix">%</span>
                                            <label className="form-label" >Loan Amount:</label>
                                            <input name="loanAmt" id="loanAmt" size="15" value={data.loanAmt} onChange={handleChange} className="form-input"
                                                pattern="^\$\d{1,3}(,\d{3})*(\.\d+)?$" data-type="currency" type="text"/>
                                            <span className="form-suffix">$</span>
                                            <label className="form-label" >Interest Rate:</label>
                                            <input data-type="number" type="number" step=".125" name="intRate" id="intRate" value={data.intRate} onChange={handleChange}
                                                className="form-input"/>
                                            <span className="form-suffix">%</span>
                                            <label className="form-label">Loan Term:</label>
                                            <input type="number" name="term" id="term" value={data.term} onChange={handleChange} data-type="number" className="form-input"/>
                                            <span className="form-suffix">Years</span>
                                        </form>
                                    </div>
                                    <div className = "input-block taxes">
                                        <form className = "form">
                                            <div className="form-subheading">
                                                <h4 className="subheading">Property Taxes, Insurance, PMI, and Association Fees</h4>
                                            </div>
                                            <label className="form-label" >Property Tax:</label>
                                            <input type="text" name="propTaxAmt" id="propTaxAmt" className="form-input" value={data.propTaxAmt||''} onChange={handleChange}/>
                                            <span className="form-suffix">$/year</span>
                                            <label className="form-label" >Home Ins.:</label>
                                            <input type="text" name="insAmt" id="insAmt" className="form-input" value={data.insAmt||''} onChange={handleChange}/>
                                            <span className="form-suffix">$/year</span>
                                            <label className="form-label" >Monthly HOA:</label>
                                            <input type="text" name="assocAmt" id="assocAmt" className="form-input" value={data.assocAmt||''} onChange={handleChange}/>
                                            <span className="form-suffix">$/month</span>
                                            <label className="form-label" title="Actual PMI will depend on your downpayment, credit score, and DTI ratio">PMI:</label>
                                            <input type="number" name="pmiPercAmt" id="pmiPercAmt" title="Actual PMI will depend on your downpayment, credit score, and DTI ratio" data-type="number" 
                                                className="form-input" value={data.pmiPercAmt||''} onChange={handleChange} step="any" min="0.1"/>
                                            <span className="form-suffix">%</span>
                                            <label className="form-label" title="Actual PMI will depend on your downpayment, credit score, and DTI ratio">PMI:</label>
                                            <span type="text" name="pmiAmt" id="pmiAmt" className="form-out" title="Actual PMI will depend on your downpayment, credit score, and DTI ratio">{out.pmiAmt.toFixed(2)}</span>
                                            <span className="form-suffix">$/month</span>
                                            <label className="form-label" >Monthly P &amp; I:</label>
                                            <span type="text" name="pmtPI" id="pmtPI" className="form-out">{out.pmtPI.toFixed(2)}</span>
                                            <span className="form-suffix">$</span>
                                            <label className="form-label" >PITIA Pymt:</label>
                                            <span type="text" name="pmtPITI" id="pmtPITI" className="form-out">{out.pmtPITI.toFixed(2)}</span>
                                            <span className="form-suffix">$/month</span>
                                        </form>
                                    </div>
                                    <div className="input-block liabilities">
                                        <form className="form">
                                            <div className="form-subheading">
                                                <h4 className="subheading">Income and Liabilities</h4>
                                            </div>
                                            <label className="form-label" >Gross Income:</label>
                                            <input type="text" title="Enter your total annual Income" name="grossPay" id="grossPay" value={data.grossPay||''} onChange={handleChange} className="form-input" pattern="^\$\d{1,3}(,\d{3})*(\.\d+)?$"
                                                data-type="currency"/>
                                            <span className="form-suffix">$/year</span>
                                            <label className="form-label" title="Your liabilities include payments for mortgage, car loans, other loans, student loans, and credit card payments" >Total Monthly Liabilities:</label>
                                            <span type="text" title="Your liabilities include payments for mortgage, car loans, other loans, student loans, and credit card payments" name="moDebts" id="moDebts" className="form-out subheading">{out.moDebts.toFixed(0)}</span>
                                            <span className="form-suffix">$/month</span>

                                            <label className = "form-label" >Mortgage Payment:</label>
                                            <input type="text" title="Enter your monthly mortgage payment" id="moMPay" data-type="number" className="liab-input form-input" value={data.moMPay||''} onChange={handleChange}/>
                                            <span className="form-suffix">$/month</span>
                                            <label className="form-label">Auto Loan:</label>
                                            <input type="text" title="Enter your monthly car loan payments" id="caMPay" data-type="number" className="liab-input form-input" value={data.caMPay||''} onChange={handleChange}/>
                                            <span className="form-suffix">$/month</span>
                                            <label  className="form-label" >Other Installments:</label>
                                            <input type="text" title="Enter your monthly payments for other installment payment such as furniture" id="otMPay" data-type="number" className="liab-input form-input" value={data.otMPay||''} onChange={handleChange}/>
                                            <span className="form-suffix">$/month</span>
                                            <label  className="form-label">Student Loan Balance:</label>
                                            <input type="text" title="Enter your current student loan balance, if any" id="stLoanBal" data-type="number" className="liab-input form-input" value={data.stLoanBal||''} onChange={handleChange}/>
                                            <span className="form-suffix">$/balance</span>
                                            <label  className="form-label" >Min. CC Payment:</label>
                                            <input type="text" title="Enter your minimum monthly payments for credit card debt" id="ccMPay" data-type="number" className="liab-input form-input" value={data.ccMPay||''} onChange={handleChange}/>
                                            <span className="form-suffix">$/month</span>
                                        </form>
                                    </div>
                                    <div className = "input-block qualify">
                                        <form className = "form">
                                            <div className="form-subheading">
                                                <h4 className="subheading">Do You Qualify for the Loan?</h4>
                                            </div>
                                            <label className="form-label">Qualify For Loan?</label>
                                            <span type="text" name="qualifyYN" id="qualifyYN" className="form-out form-double" style={{color:out.qualifyColor}}>{out.qualifyYN}</span>
                                            <label className="form-label" >Max Loan Amount:</label>
                                            <span type="text" name="qualifyMax" id="qualifyMax" className="form-out">{noDecimals.format(out.qualifyMax)}</span>
                                            <span className="form-suffix">$ approx</span>
                                            <label className="form-label" >Mortgage Pmt to Income Ratio:</label>
                                            <span type="text" name="ratioIncome" id="ratioIncome" className="form-out">{out.ratioIncome.toFixed(0)}</span>
                                            <span className="form-suffix">max is approx 40%</span>
                                            <label className="form-label" >Debt to Income Ratio:</label>
                                            <span type="text" name="ratioDebt" id="ratioDebt" className="form-out">{out.ratioDebt.toFixed(0)}</span>
                                            <span className="form-suffix">max is approx 45%</span>
                                        </form>
                                    </div>
                                    <div className = "backdrop-only"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PreQual;