import { useState } from "react";
import { amortization } from "../components/calcAmort.js";
import BuydownYear from "../components/BuydownYear.jsx";
// import Slider from "../components/slider.js";
import Slider from "../components/MySlider.js";

function Buydown() {
  const [months, setMonths] = useState(0);
  const [data, setData] = useState({
    buyDownType: 3,
    loanAmt: 225000,
    intRate: 6.25,
    term: 30,
    "rs-range-line": 0,
  });
  const out1 = [
    {
      phase: "3% lower",
      rate: "",
      payWBuydown: 0,
      payWoBuydown: 0,
      reductionM: 0,
      reductionA: 0,
      yearRed: 0,
    },
    {
      phase: "2% lower",
      rate: "",
      payWBuydown: 0,
      payWoBuydown: 0,
      reductionM: 0,
      reductionA: 0,
      yearRed: 0,
    },
    {
      phase: "1% lower",
      rate: "",
      payWBuydown: 0,
      payWoBuydown: 0,
      reductionM: 0,
      reductionA: 0,
      yearRed: 0,
    },
    { phase: "", rate: "", payWBuydown: 0, payWoBuydown: 0, reductionM: 0 },
  ];
  const out2 = {
    totalSavings: 0,
    remEscrow: 0,
  };
  const currency = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  // const noDecimals = new Intl.NumberFormat("en-US", {
  //     style: "currency",
  //     currency: "USD",
  //     minimumFractionDigits: 0,
  //     maximumFractionDigits: 0,
  // });
  function calcBuydown() {
    const loan = {
      loanAmt: data.loanAmt,
      intRate: data.intRate,
      term: data.term,
    };
    let buyDownType = data.buyDownType;
    out1[0].payWoBuydown = amortization(loan, "");
    out1[1].payWoBuydown = out1[0].payWoBuydown;
    out1[2].payWoBuydown = out1[0].payWoBuydown;
    out1[3].payWoBuydown = out1[0].payWoBuydown;
    loan.intRate = data.intRate >= buyDownType ? data.intRate - buyDownType : 0;
    out1[0].payWBuydown = amortization(loan, ""); // first year
    buyDownType -= 1;
    loan.intRate = data.intRate >= buyDownType ? data.intRate - buyDownType : 0;
    out1[1].payWBuydown = amortization(loan, ""); // second year
    buyDownType -= 1;
    loan.intRate = data.intRate >= buyDownType ? data.intRate - buyDownType : 0;
    out1[2].payWBuydown = amortization(loan, ""); // third year
    out1[3].payWBuydown = out1[3].payWoBuydown; // 4-30 years
    // console.log(out);
    /// Year 1
    const buyDown0 = data.buyDownType;
    out1[0].phase = `${buyDown0}% Lower`;
    out1[0].rate = `${(data.intRate - buyDown0).toFixed(2)}%`;
    // console.log(
    //   `out rate:${out1[0].rate}, in rate:${data.intRate}, in buydownType${data.buyDownType}, ws-buyDownType${buyDown0}`
    // );
    out1[0].reductionM = out1[0].payWoBuydown - out1[0].payWBuydown;
    out1[0].reductionA = (out1[0].payWoBuydown - out1[0].payWBuydown) * 12;
    out1[0].yearRed = out1[0].payWoBuydown - out1[0].payWBuydown;

    /// Year 2
    const buyDown1 = data.buyDownType > 1 ? data.buyDownType - 1 : 0;
    out1[1].phase = `${buyDown1}% Lower`;
    out1[1].rate = `${(data.intRate - buyDown1).toFixed(2)}%`;
    out1[1].reductionM = out1[1].payWoBuydown - out1[1].payWBuydown;
    out1[1].reductionA = (out1[1].payWoBuydown - out1[1].payWBuydown) * 12;
    out1[1].yearRed = out1[1].payWoBuydown - out1[1].payWBuydown;

    /// Year 3
    const buyDown2 = data.buyDownType > 2 ? data.buyDownType - 2 : 0;
    out1[2].phase = `${buyDown2}% Lower`;
    out1[2].rate = `${(data.intRate - buyDown2).toFixed(2)}%`;
    out1[2].reductionM = out1[2].payWoBuydown - out1[2].payWBuydown;
    out1[2].reductionA = (out1[2].payWoBuydown - out1[2].payWBuydown) * 12;
    out1[2].yearRed = out1[2].payWoBuydown - out1[2].payWBuydown;

    const totalRed = (out1[0].yearRed + out1[1].yearRed + out1[2].yearRed) * 12;
    // console.log(out.yearOneRed, out.yearTwoRed, totalRed);

    /// Year 4
    out1[3].phase = "Fixed Rate";
    out1[3].rate = `${data.intRate}%`;
    out1[3].reductionM = out1[3].payWoBuydown - out1[3].payWBuydown;

    out2.totalSavings = totalRed;

    // console.log(` in calcall slider.value ${months}`);
    const usedAmount =
      months - 24 > 0
        ? out1[0].yearRed * 12 +
          out1[1].yearRed * 12 +
          out1[2].yearRed * (months - 24)
        : months - 12 > 0
        ? out1[0].yearRed * 12 + out1[1].yearRed * (months - 12)
        : out1[0].yearRed * months;

    // console.log(`yearOneRed * months: ${out.yearOneRed * months}`);
    out2.remEscrow = totalRed - usedAmount;
  }

  calcBuydown();
  // const updateSliderValue = (value)=> {
  //     console.log(value);
  //     setMonths(value);
  // }

  const handleChange = (e) => {
    if (e.target.id === "rs-range-line") setMonths(e.target.value);
    else {
      setData((data) => {
        return {
          ...data,
          [e.target.id]: Number(e.target.value),
        };
      });
    }
  };

  const handleSliderUpdate = (e) => {
    return;
  };
  return (
    <div id="buyDown" className="tabcontent">
      <div className="container-fluid">
        <div className="container">
          <div className="row">
            <div className="site-container">
              <div id="">
                <div className="content-area">
                  <h3 className="heading-primary centered-text">
                    Mortgage BuyDown Calculator
                  </h3>
                  <h4 className="heading-tertiary centered-text">
                    Does it make sense to get a buy-down option?
                  </h4>
                  <br></br>
                  <p className="main-text max-text-box">
                    You've seen seller-paid 3-2-1, 2-1, or 1-0 buydowns
                    advertised in communities just being built or being
                    discussed in other media articles, but you may be asking{" "}
                    <i>“What is a buydown and how can it help me?” </i>I would
                    like to give you some details on how this financing
                    arrangement works so that you can negotiate the contract
                    accordingly.
                  </p>
                  <p className="main-text max-text-box">
                    A temporary buydown is a way for a borrower to obtain a
                    lower interest rate for a period of time. The seller will
                    pay a lump sum at closing to cover a portion of the
                    borrower's interest during the buydown period. It allows the
                    buyer to make lower mortgage payments for the first few
                    years of their loan, with payments increasing slightly once
                    the buydown period is over. A seller-paid buydown helps
                    reduce the buyer's monthly mortgage payment for an initial
                    period — typically one, two, or three years — and can bring
                    the borrower significant savings. The amount of savings each
                    month depends on the terms of the buydown, interest rate,
                    and the loan amount.
                  </p>
                  <br></br>
                  <hr></hr>
                  <p className="centered-text small-text italic-text bold-text">
                    📝 Select the Buy Down Type, and enter a Loan Amount,
                    Interest Rate, and Loan Term, to see the savings in the
                    first 1-3 years
                  </p>
                  <br></br>
                </div>
              </div>
              <form className="form form-buyDownType">
                <label className="form-label">Buy Down Type:</label>
                <select
                  id="buyDownType"
                  name="buyDownType"
                  className="form-input"
                  value={data.buyDownType}
                  onChange={handleChange}
                >
                  <option value="3" defaultValue="">
                    3/2/1 BUYDOWN
                  </option>
                  <option value="2">2/1 BUYDOWN</option>
                  <option value="1">1/0 BUYDOWN</option>
                </select>
              </form>
              <form className="form form--loanAmt">
                <label className="form-label">Loan Amount:</label>
                <input
                  name="loanAmt"
                  id="loanAmt"
                  size="15"
                  className="form-input"
                  pattern="^\$\d{1,3}(,\d{3})*(\.\d+)?$"
                  data-type="currency"
                  type="text"
                  value={data.loanAmt}
                  onChange={handleChange}
                />
                <span className="form-suffix">$</span>
              </form>
              <form className="form form--intRate">
                <label className="form-label">Interest Rate:</label>
                <input
                  data-type="number"
                  type="number"
                  step="0.125"
                  min="0.125"
                  name="intRate"
                  id="intRate"
                  className="form-input"
                  value={data.intRate || ""}
                  onChange={handleChange}
                />
                <span className="form-suffix">%</span>
              </form>
              <form className="form form--term">
                <label className="form-label">Loan Term:</label>
                <select
                  id="term"
                  name="term"
                  data-type="number"
                  className="form-input"
                  value={data.term}
                  onChange={handleChange}
                >
                  <option value="30" defaultValue="">
                    30
                  </option>
                </select>
                <span className="form-suffix">Years</span>
              </form>
              <br></br>
              <hr></hr>
              <section className="white-section" id="pricing">
                <h2 className="section-heading centered-text">
                  You will lower your first {data.buyDownType} years' payments
                  by{" "}
                  <span id="firstYearSavings" className="price-text">
                    {currency.format(out2.totalSavings)}
                  </span>
                </h2>
                <p className="centered-text small-text italic-text">
                  The following payments do not include property tax, insurance,
                  and HOA fees
                </p>
                <div className="row">
                  {Array.from(
                    { length: data.buyDownType + 1 },
                    (_, index) => index
                  ).map((i) => (
                    <BuydownYear
                      key={i}
                      out={out1[i]}
                      last={i === data.buyDownType ? true : false}
                      buydownType={data.buyDownType}
                      year={i}
                    />
                  ))}
                </div>
              </section>
              <section className="white-section" id="monthly-tbl">
                <h3 className="tbl-header heading-tertiary">
                  Payment Reduction from Buydown
                </h3>
                <div className="centered-tbl">
                  <table
                    className="reduction-tbl small-text  right-text"
                    id="reduction-tbl"
                  >
                    <tbody className="red-tbl-body">
                      <tr className="main-text">
                        <th colSpan="1"></th>
                        <th colSpan="1">Rate</th>
                        <th colSpan="1">P&I</th>
                        <th colSpan="1">Monthly Reduction</th>
                        <th colSpan="1">Annual Reduction</th>
                      </tr>

                      {Array.from(
                        { length: data.buyDownType },
                        (_, index) => index
                      ).map((i) => (
                        <tr key={i}>
                          <td colSpan="1">Year {i + 1} Rate</td>
                          <td className="" id="td-rate">
                            {out1[i].rate}
                          </td>
                          <td className="" id="td-payWBuydown">
                            {currency.format(out1[i].payWBuydown)}
                          </td>
                          <td className="" id="td-reductionM">
                            {currency.format(out1[i].reductionM)}
                          </td>
                          <td className="" id="td-reductionA">
                            {currency.format(out1[i].reductionA)}
                          </td>
                        </tr>
                      ))}
                      <tr>
                        <td colSpan="4" className="total-red-row-label">
                          Total Reduction
                        </td>
                        <td id="td-totalred">
                          {currency.format(out2.totalSavings)}
                        </td>
                      </tr>
                      <tr>
                        <td
                          colSpan="4"
                          id="td-funds-label"
                          className="total-funds-row-label"
                        >
                          Funds needed from the Seller 💡
                        </td>
                        <td id="td-funds">
                          {currency.format(out2.totalSavings)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="tiny-text bold-text  ">
                  💡 These funds will need to be contributed by the seller or
                  the builder into an escrow account that will fund the Buydown.
                  If you refinance before the escrow funds are completely drawn,
                  the remaining escrow balance can be used to pay down your loan
                  balance.
                </p>
                <h2 className="tbl-header  item-spacer-bottom bold-text ">
                  You Will Need{" "}
                  <span id="seller-funds" className=" text-orange-400">
                    {currency.format(out2.totalSavings)}
                  </span>{" "}
                  From The Seller/Builder
                </h2>
                <br></br>
              </section>
              <section>
                <div className="container embed-slider main-text">
                  <span className="text">
                    If you refinance before using up your full&nbsp;
                    <span
                      id="escrow-amt"
                      className="text-orange-400 bold-text inline"
                    >
                      {currency.format(out2.totalSavings)}
                    </span>
                    &nbsp;credit, you can pay down your loan balance with what's
                    left in the escrow account. For example, if you refinance in
                    &nbsp;
                    <span className="range-slider-simple range-slider__wrap">
                      {/* <label for="slider">Month</label> */}
                      <div className="slider-container">
                        <Slider
                          max={data.buyDownType * 12}
                          summary={false}
                          minmax="none"
                          value={0}
                          handleChange={handleChange}
                          handleSliderUpdate={handleSliderUpdate}
                        />
                      </div>
                      {/* </span> */}
                      <span className="rs-value" id="rs-value">
                        &nbsp;{months}
                      </span>
                      <span className="">
                        &nbsp;months you will have{" "}
                        <span
                          id="rem-escrow"
                          className="text-lime-600 bold-text"
                        >
                          {currency.format(out2.remEscrow)}
                        </span>{" "}
                        remaining in your escrow account that will lower your
                        refinance loan balance.
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
  );
}

export default Buydown;
