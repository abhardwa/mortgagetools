import { useState } from "react";
import { amortization } from "./calcAmort.js";
import Slider from "./slider.js";

function Buydown() {
    const [months, setMonths] = useState(0);
    const [data, setData] = useState({
        "buyDownType": 2,
        "loanAmt": 225000,
        "intRate": 6.25,
        "term":30,
        "rs-range-line":0,
    });
    const out = {
        phase1:"2% lower",
        rate1: "",
        payWBuydown1: 0,
        payWoBuydown1: 0,
        reductionM1:0,
        reductionA1:0,
        phase2:"1% lower",
        rate2: "",
        payWBuydown2: 0,
        payWoBuydown2: 0,
        reductionM2:0,
        reductionA2:0,
        phase3:"",
        rate3: "",
        payWBuydown3: 0,
        payWoBuydown3: 0,
        reductionM3:0,
        yearOneRed:0,
        yearTwoRed:0,
        totalSavings:0,
        remEscrow:0,

    }
    const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2 });
    // const noDecimals = new Intl.NumberFormat("en-US", {
    //     style: "currency",
    //     currency: "USD",
    //     minimumFractionDigits: 0,
    //     maximumFractionDigits: 0,
    // });
    function calcBuydown () {

        // calcAll(e.target, e.target.dataset.type);
        // t: target; type : currency or number
        // const vars = Object.keys(obj);
        // console.log(t.id, type, dmap);
        // if (type === "currency") obj[t.id] = Number(t.value.replace(/[^0-9.-]+/g, "")); // .replace(/[^\d.]/g, "")
        // else if (type === "number") obj[t.id] = Number(t.value.replace(/[^0-9.-]+/g, ""));
        // else obj[t.id] = Number(t.value.replace(/[^\d.]/g, ""));

        const loan = {
        loanAmt: data.loanAmt,
        intRate: data.intRate,
        term: data.term,
        };
        let buyDownType = data.buyDownType;
        out.payWoBuydown1 = amortization(loan, "");
        out.payWoBuydown2 = out.payWoBuydown1;
        out.payWoBuydown3 = out.payWoBuydown1;
        loan.intRate = data.intRate >= buyDownType ? data.intRate - buyDownType : 0;
        out.payWBuydown1 = amortization(loan, "");
        buyDownType -= 1;
        loan.intRate = data.intRate >= buyDownType ? data.intRate - buyDownType : 0;
        out.payWBuydown2 = amortization(loan, "");
        out.payWBuydown3 = out.payWoBuydown3;
        console.log(out);
        /// Year 1
        const buyDown1 = data.buyDownType;
        out.phase1 = `${buyDown1}% Lower`;
        out.rate1 = `${data.intRate - buyDown1}%`;
        out.reductionM1 = out.payWoBuydown1 - out.payWBuydown1;
        out.reductionA1 = (out.payWoBuydown1 - out.payWBuydown1) * 12;
        out.yearOneRed = out.payWoBuydown1 - out.payWBuydown1;

        /// Year 2
        const buyDown2 = data.buyDownType > 1 ? data.buyDownType - 1 : 0;
        out.phase2 = `${buyDown2}% Lower`;
        out.rate2 = `${data.intRate - buyDown2}%`;
        out.reductionM2 = out.payWoBuydown2 - out.payWBuydown2;
        out.reductionA2 = (out.payWoBuydown2 - out.payWBuydown2) * 12;
        out.yearTwoRed = out.payWoBuydown2 - out.payWBuydown2;

        const totalRed = (out.yearOneRed + out.yearTwoRed) * 12;
        console.log(out.yearOneRed, out.yearTwoRed, out.totalRed);

        /// Year 3
        out.phase3 = "Fixed Rate";
        out.rate3 = `${data.intRate}%`;
        out.reductionM3 = out.payWoBuydown3 - out.payWBuydown3;

        out.totalSavings = totalRed;

        console.log(` in calcall slider.value ${months}`);
        const usedAmount = months - 12 > 0 ? out.yearOneRed * 12 + out.yearTwoRed * (months - 12) : out.yearOneRed * months;
        console.log(`yearOneRed * months: ${out.yearOneRed * months}`);
        out.remEscrow = totalRed - usedAmount;
    }

    calcBuydown();
    const updateSliderValue = (value)=> {
        setMonths(value); 
    }

    const handleChange = (e) => {
        if (e.target.id === "slider-simple")
            setMonths(e.target.value)
        else {
            setData(data => {
                return {
                ...data, [e.target.id]:Number(e.target.value)
                }
            });
        };
    };
    return (
    <div id="buyDown" className="tabcontent">
    <div className="container-fluid">
        <div className="container">
            <div className="row">
                <div className="site-container">
                    <div id="">
                        <div className="content-area">
                            <h3 className="heading-primary centered-text">Mortgage BuyDown Calculator</h3>
                            <h4 className="heading-tertiary centered-text">Does it make sense to get a buy-down option?</h4>
                            <br></br>
                            <p className="main-text max-text-box">You've seen seller-paid buydowns advertised in communities just being built or being discussed in other media articles,
                            but you may be asking <i>“What is a buydown and how can it help me?” </i>I would like to give you some details on how this
                            financing arrangement works so that you can negotiate the contract accordingly.</p>
                            <p className="main-text max-text-box">
                            A buydown is a way for a borrower to obtain a lower interest rate for a period of time. The seller will pay a lump sum
                            at closing to cover a portion of the borrower's interest during the buydown period. It allows the buyer to make lower
                            mortgage payments for the first few years of their loan, with payments increasing slightly once the buydown period is
                            over. A seller-paid buydown helps reduce the buyer's monthly mortgage payment for an initial period — typically one or
                            two years — and can bring the borrower significant savings. The amount of savings each month depends on the terms of the
                            buydown, interest rate, and the loan amount.</p><br></br>
                        </div>
                    </div>
                    <form className="form form-buyDownType">
                        <label className="form-label">Buy Down Type:</label>
                        <select id="buyDownType" name="buyDownType" className="form-input" value={data.buyDownType} onChange={handleChange}>
                            <option value="2" defaultValue="">2/1 BUYDOWN</option>
                            <option value="1">1/0 BUYDOWN</option>
                        </select>
                    </form>
                    <form className="form form--loanAmt">
                        <label className="form-label">Loan Amount:</label>
                        <input name="loanAmt" id="loanAmt" size="15" className="form-input"
                            pattern="^\$\d{1,3}(,\d{3})*(\.\d+)?$" data-type="currency" type="text" value={data.loanAmt} onChange={handleChange}/>
                        <span className="form-suffix">$</span>
                    </form>
                    <form className="form form--intRate">
                        <label className="form-label">Interest Rate:</label>
                        <input data-type="number" type="number" step=".125" name="intRate" id="intRate" 
                            className="form-input" value={data.intRate} onChange={handleChange}/>
                        <span className="form-suffix">%</span>
                    </form>
                    <form className="form form--term">
                        <label className="form-label" >Loan Term:</label>
                        <select id="term" name="term" data-type="number" className="form-input" value={data.term} onChange={handleChange}>
                            <option value="30" defaultValue="">30</option>
                        </select>
                        <span className="form-suffix">Years</span>
                    </form>
                    <br></br>
                    <hr></hr>
                    <section className="white-section" id="pricing">
                        <h2 className="section-heading centered-text">You will lower your first 2 years' payments by <span
                                id="firstYearSavings" className="price-text">{currency.format(out.totalSavings)}</span></h2>
                        <p className="centered-text small-text italic-text">The following payments do not include property tax,
                            insurance, and HOA
                            fees</p>
                        <div className="row">
                            <div className="pricing-column col-lg-4 col-md-6">
                                <div className="card card-year1">
                                    <div className="card-header centered-text">
                                        <h3 className = "subheading">Year 1</h3>
                                        <p className="tiny-text bold-text italic-text">payments 1-12</p>
                                    </div>
                                    <div className="card-body">
                                        <label className="card-body-label tiny-text left-text bold-text">Phase:</label>
                                        <p id="phase1" className="card-data tiny-text right-text bold-text">{out.phase1}</p>
                                        <label className="card-body-label tiny-text left-text bold-text" >Rate:</label>
                                        <p id="rate1" className="card-data tiny-text right-text bold-text">{out.rate1}</p>
                                        <label className=" card-body-label tiny-text left-text bold-text" >Pmt w/ Buydown:</label>
                                        <p id="payWBuydown1" className="card-data tiny-text right-text bold-text">{currency.format(out.payWBuydown1)}</p>
                                        <label className="card-body-label tiny-text left-text bold-text" >Pmt w/o Buydown:</label>
                                        <p id="payWoBuydown1" className="card-data tiny-text right-text bold-text">{currency.format(out.payWoBuydown1)}</p>
                                        <label className=" card-body-label tiny-text left-text bold-text" >Monthly Reduction:</label>
                                        <h3 id="reductionM1" className="card-data tiny-text right-text bold-text">{currency.format(out.reductionM1)}</h3>
                                        <label className=" card-body-label tiny-text left-text bold-text price-text-label" >Your
                                            <strong> cumulative payments </strong>will be lower by </label>
                                        <h3 id="reductionA1" className="price-text card-data tiny-text right-text bold-text">{currency.format(out.reductionA1)}</h3>
                                    </div>
                                </div>
                            </div>

                            <div className="pricing-column col-lg-4 col-md-6">
                                <div className="card card-year2">
                                    <div className="card-header centered-text">
                                        <h3 className = "subheading">Year 2</h3>
                                        <p className="tiny-text bold-text  italic-text">payments 13-24</p>
                                    </div>
                                    <div className="card-body">
                                        <label className="card-body-label tiny-text left-text bold-text">Phase:</label>
                                        <p id="phase2" className="card-data tiny-text right-text bold-text">{out.phase2}</p>
                                        <label className="card-body-label tiny-text left-text bold-text" >Rate:</label>
                                        <p id="rate2" className="card-data tiny-text right-text bold-text">{out.rate2}</p>
                                        <label className="card-body-label tiny-text left-text bold-text" >Pmt w/ Buydown:</label>
                                        <p id="payWBuydown2" className="card-data tiny-text right-text bold-text">{currency.format(out.payWBuydown2)}</p>
                                        <label className="card-body-label tiny-text left-text bold-text" >Pmt w/o Buydown:</label>
                                        <p id="payWoBuydown2" className="card-data tiny-text right-text bold-text">{currency.format(out.payWoBuydown2)}</p>
                                        <label className="card-body-label tiny-text left-text bold-text" >Monthly Reduction:</label>
                                        <h3 id="reductionM2" className="card-data tiny-text right-text bold-text">{currency.format(out.reductionM2)}</h3>
                                        <label className="card-body-label tiny-text left-text bold-text price-text-label" >Your
                                            <strong> cumulative
                                                payments </strong>will be lower by </label>
                                        <h3 id="reductionA2" className="price-text card-data tiny-text right-text bold-text">{currency.format(out.reductionA1 + out.reductionA2)}</h3>
                                    </div>
                                </div>
                            </div>
                            <div className="pricing-column col-lg-4 col-md-6">
                                <div className="card card-year3">
                                    <div className="card-header centered-text">
                                        <h3 className = "subheading">Years 3-30</h3>
                                        <p className="tiny-text bold-text  italic-text">payments 25-360</p>
                                    </div>
                                    <div className="card-body">
                                        <label className="card-body-label tiny-text left-text bold-text" >Phase:</label>
                                        <p id="phase3" className="card-data tiny-text right-text bold-text">{out.phase3}</p>
                                        <label className="card-body-label tiny-text left-text bold-text">Rate:</label>
                                        <p id="rate3" className="card-data tiny-text right-text bold-text">{out.rate3}</p>
                                        <label className="card-body-label tiny-text left-text bold-text" >Pmt w/ Buydown:</label>
                                        <p id="payWBuydown3" className="card-data tiny-text right-text bold-text">{currency.format(out.payWBuydown3)}</p>
                                        <label className="card-body-label tiny-text left-text bold-text">Pmt w/o Buydown:</label>
                                        <p id="payWoBuydown3" className="card-data tiny-text right-text bold-text">{currency.format(out.payWoBuydown3)}</p>
                                        <label className="card-body-label tiny-text left-text bold-text" >Mnthly Reduction:</label>
                                        <p id="reductionM3" className="card-data tiny-text right-text bold-text bigger-font">{currency.format(out.reductionM3)}</p>
                                        <label className="price-text reductionA3" id="year3-msg" >No
                                            further reduction in payments after Year 2
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                    <section className="white-section" id="monthly-tbl">
                        <h3 className="tbl-header heading-tertiary">Payment Reduction from Buydown</h3>
                        <div className="centered-tbl">
                            <table className="reduction-tbl small-text  right-text" id="reduction-tbl">
                                <tbody className="red-tbl-body">
                                    <tr className = "main-text">
                                        <th colSpan="1"></th>
                                        <th colSpan="1">Rate</th>
                                        <th colSpan="1">P&I</th>
                                        <th colSpan="1">Monthly Reduction</th>
                                        <th colSpan="1">Annual Reduction</th>
                                    </tr>
                                    <tr>
                                        <td colSpan="1">Year 1 Rate</td>
                                        <td className="" id="td-rate1">{out.rate1}</td>
                                        <td className="" id="td-payWBuydown1">{currency.format(out.payWBuydown1)}</td>
                                        <td className="" id="td-reductionM1">{currency.format(out.reductionM1)}</td>
                                        <td className="" id="td-reductionA1">{currency.format(out.reductionA1)}</td>
                                    </tr>
                                    <tr>
                                        <td colSpan="1">Year 2 Rate</td>
                                        <td className="" id="td-rate2">{out.rate2}</td>
                                        <td className="" id="td-payWBuydown2">{currency.format(out.payWBuydown2)}</td>
                                        <td className="" id="td-reductionM2">{currency.format(out.reductionM2)}</td>
                                        <td className="" id="td-reductionA2">{currency.format(out.reductionA2)}</td>
                                    </tr>
                                    <tr>
                                        <td colSpan="4" className="total-red-row-label">Total Reduction</td>
                                        <td id="td-totalred">{currency.format(out.totalSavings)}</td>
                                    </tr>
                                    <tr>
                                        <td colSpan="4" id="td-funds-label" className="total-funds-row-label">Funds
                                            needed from the Seller 💡</td>
                                        <td id="td-funds">{currency.format(out.totalSavings)}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <p className="tiny-text bold-text text-padding-top ">💡 These funds will need to be contributed by the seller
                            or
                            the builder into an escrow
                            account
                            that will fund the
                            Buydown. If you refinance before the escrow funds are completely drawn, the remaining escrow
                            balance can be used to
                            pay down your loan balance.
                        </p>
                        <br></br><br></br>
                        <h2 className="tbl-header  item-spacer-bottom bold-text ">
                            You Will Need <span id="seller-funds" className="price-text">{currency.format(out.totalSavings)}</span> From The
                            Seller/Builder
                        </h2>
                        <br></br>
                    </section>
                    <section>
                        <div className="container embed-slider main-text">
                            <span className="embed-slider">If you refinance before using up your full <span id="escrow-amt"
                                    className="price-text">{currency.format(out.totalSavings)}</span> credit, you can pay down your loan balance
                                with
                                what's left in the
                                escrow account. For example, if you refinance in &nbsp;
                                <span className="range-slider-simple">
                                    {/* <label for="slider">Month</label> */}
                                    <Slider handleCallback={updateSliderValue}/>
                                    <span className="" id="slider-simple-value">&nbsp;{months}</span>
                                    {/* </span> */}
                                    <span className="">&nbsp;months you will have <span id="rem-escrow"
                                            className="price-text">{currency.format(out.remEscrow)}</span> remaining
                                        in
                                        your escrow account that will lower your refinance loan balance.
                                    </span>
                                </span>
                            </span>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    </div>
</div>
    )
}

export default Buydown;