import { useState } from "react";
import { amortization } from "../components/calcAmort.js";
import Slider from "../components/MySlider.js";
function PreQual() {
  const [data, setData] = useState({
    downPayAmt: 70000,
    intRate: 6.25,
    term: 30,
    propTaxAmt: 0,
    insAmt: 0,
    assocAmt: 0,
    grossPay: 0,
    moMPay: 0,
    caMPay: 0,
    otMPay: 0,
    stLoanBal: 0,
    ccMPay: 0,
    DtiIRatio: 0.43,
  });
  const out = {
    purchaseAmt: 0,
    loanAmt: 0,
    pmiAmt: 0,
    pmtPI: 0,
    pmtPITI: 0,
    qualifyYN: "",
    qualifyColor: "",
    qualifyMax: 0,
    ratioIncome: 0,
    ratioDebt: 0,
    moDebts: 0,
    moTaxInsHoa: 0,
    maxHomeAmt: 0,
  };
  // const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const noDecimals = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  const thouSep = new Intl.NumberFormat("en-US");
  const maxDTI = 0.43;

  function calcPreQual() {
    // ///////////////////////////////////////////////
    // Now update the remaining output fields
    out.moTaxInsHoa = Number(
      data.propTaxAmt / 12 + data.insAmt / 12 + data.assocAmt
    );
    out.moDebts =
      data.moMPay +
      data.caMPay +
      data.otMPay +
      data.stLoanBal * 0.005 +
      data.ccMPay;
    out.maxHomeAmt =
      calcLoanAmt(
        data,
        (data.grossPay / 12) * maxDTI - (out.moDebts + out.moTaxInsHoa)
      ) + data.downPayAmt;

    const maxPiAmtB =
      (data.grossPay / 12) * data.DtiIRatio - (out.moDebts + out.moTaxInsHoa);
    out.qualifyMax = calcLoanAmt(data, maxPiAmtB);
    out.loanAmt = out.qualifyMax;
    out.purchaseAmt = out.loanAmt + data.downPayAmt;

    const purchase = {
      intRate: data.intRate,
      term: data.term,
      loanAmt: out.loanAmt,
    };

    out.pmtPI = amortization(purchase, "");
    out.pmtPITI = out.pmtPI + out.moTaxInsHoa;

    if (data.DtiIRatio <= 0.43) {
      out.qualifyYN = "is within your budget.";
      out.qualifyColor = "rgb(16, 115, 9)";
    } else {
      out.qualifyYN = "is outside budget.";
      out.qualifyColor = "rgb(255, 0, 0)";
    }

    function calcLoanAmt(purchase, X) {
      // given the loan terms (purchase) and the max monthly payment (X), calculate the loan amount
      const monthlyRate = purchase.intRate / 100 / 12;
      const numPayments = 12 * purchase.term;
      const loanAmount =
        X / (monthlyRate / (1 - (1 + monthlyRate) ** -numPayments));
      return loanAmount;
    }
  }

  calcPreQual();

  const handleChange = (e) => {
    let updatedValues = {};
    switch (e.target.id) {
      case "rs-range-line": {
        const target = e.target.parentElement.parentElement.previousSibling;
        console.log(e.target, target);
        if (
          target.matches(
            ".grossPay, .downPayAmt, .intRate, .term, .propTaxAmt, .insAmt, .assocAmt, .grossPay, .moMPay, .caMPay, .otMPay, .stLoanBal, .ccMPay, .DtiIRatio"
          )
        )
          setData((data) => {
            return { ...data, [target.id]: Number(e.target.value) };
          });
        break;
      }
      case "downPayAmt": {
        updatedValues = {
          downPayAmt: Number(e.target.value),
        };
        break;
      }
      case "DtiIRatio": {
        updatedValues = {
          DtiIRatio:
            Number(e.target.value) > 0.45 ? 0.45 : Number(e.target.value),
        };
        break;
      }
      default: {
        updatedValues = {
          [e.target.id]: Number(e.target.value),
        };
        break;
      }
    }

    setData((data) => {
      return { ...data, ...updatedValues };
    });
  };

  const handleSliderUpdate = (e) => {
    // Get the next sibling element
    const target = e.target.parentElement.parentElement.previousSibling;
    // console.log(e.target, target);
    // console.log(e.target, target);
    if (
      target.matches(
        ".grossPay, .downPayAmt, .intRate, .term, .propTaxAmt, .insAmt, .assocAmt, .grossPay, .moMPay, .caMPay, .otMPay, .stLoanBal, .ccMPay, .DtiIRatio"
      )
    )
      setData((data) => {
        return { ...data, [target.id]: Number(e.target.value) };
      });
    // console.log(e.type==='mouseup');
    if (e.type === "mouseup") {
      setData((data) => {
        return { ...data, [target.id]: Number(e.target.value) };
      });
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
                  <h3 className="heading-primary centered-text">
                    Affordability Calculator
                  </h3>
                  <h4 className="heading-tertiary centered-text">
                    How much house can you afford or qualify for?
                  </h4>
                  <br></br>
                  <p className="main-text max-text-box">
                    Enter your income, loan detail, property taxes, home
                    insurance, HOA payments, and other liabilities below to get
                    an estimate of how much house you could qualify for. The
                    calculator will calculate your estimated monthly payments,
                    and based on your income and liabilities, suggest a maximum
                    home value you can qualify for.
                  </p>
                  <h1
                    className="tertiary-text centered-text mx-0 px-0"
                    style={{
                      lineHeight: "4rem",
                      color: "var(--textColorPrimary)",
                    }}
                  >
                    Suggested Maximum Home Price:{" "}
                    <span
                      id="maxHomeAmt"
                      className="font-bold"
                      style={{ color: "var(--textColorAccent)" }}
                    >
                      {noDecimals.format(out.maxHomeAmt)}{" "}
                    </span>
                  </h1>
                </div>
              </div>
              <div className="grid-container">
                <div className="main-grid">
                  <div className="input-block purchase">
                    <form className="form">
                      <div className="form-subheading">
                        <p className="main-text">
                          All inputs can be entered directly or by using the
                          slider
                        </p>
                        <h4 className="subheading">Income & Loan Terms</h4>
                      </div>
                      <label className="form-label">
                        Annual Income ($/year):
                      </label>
                      <input
                        type="text"
                        title="Enter your total annual Income"
                        name="grossPay"
                        id="grossPay"
                        value={data.grossPay || ""}
                        onChange={handleChange}
                        className="grossPay form-input"
                        pattern="^\$\d{1,3}(,\d{3})*(\.\d+)?$"
                        data-type="currency"
                      />
                      <div className="range-slider">
                        <Slider
                          min={1000}
                          max={500000}
                          step={"1000"}
                          summary={false}
                          minmax="none"
                          value={data.grossPay}
                          handleChange={handleChange}
                          handleSliderUpdate={handleSliderUpdate}
                        />
                      </div>

                      <label className="form-label">Down Payment ($):</label>
                      <input
                        name="downPayAmt"
                        id="downPayAmt"
                        step="1000"
                        value={data.downPayAmt}
                        onChange={handleChange}
                        pattern="^\$\d{1,3}(,\d{3})*(\.\d+)?$"
                        data-type="currency"
                        type="text"
                        className="downPayAmt form-input"
                      ></input>
                      <div className="range-slider">
                        <Slider
                          min={1000}
                          max={100000}
                          step={"1000"}
                          summary={false}
                          minmax="none"
                          value={data.downPayAmt}
                          handleChange={handleChange}
                          handleSliderUpdate={handleSliderUpdate}
                        />
                      </div>

                      <label className="form-label">Interest Rate (%):</label>
                      <input
                        data-type="number"
                        type="number"
                        step="0.125"
                        min="0.125"
                        name="intRate"
                        id="intRate"
                        value={data.intRate || ""}
                        onChange={handleChange}
                        className="intRate form-input"
                      />
                      <div className="range-slider">
                        <Slider
                          min={0.125}
                          max={15}
                          step={".125"}
                          summary={false}
                          minmax="none"
                          value={data.intRate}
                          handleChange={handleChange}
                          handleSliderUpdate={handleSliderUpdate}
                        />
                      </div>

                      <label className="form-label">Loan Term (years):</label>
                      <input
                        type="number"
                        name="term"
                        id="term"
                        value={data.term}
                        onChange={handleChange}
                        data-type="number"
                        className="term form-input"
                      />
                      <div className="range-slider">
                        <Slider
                          min={10}
                          max={30}
                          step={"5"}
                          summary={false}
                          minmax="none"
                          value={data.term}
                          handleChange={handleChange}
                          handleSliderUpdate={handleSliderUpdate}
                        />
                      </div>

                      <div className="form-subheading">
                        <h4 className="subheading">Taxes, Insurance, & HOA</h4>
                      </div>
                      <label className="form-label">
                        Property Tax ($/year):
                      </label>
                      <input
                        type="text"
                        name="propTaxAmt"
                        id="propTaxAmt"
                        className="propTaxAmt form-input"
                        value={data.propTaxAmt || ""}
                        onChange={handleChange}
                      />
                      <div className="range-slider">
                        <Slider
                          min={0}
                          max={20000}
                          step={500}
                          summary={false}
                          minmax="none"
                          value={data.propTaxAmt}
                          handleChange={handleChange}
                          handleSliderUpdate={handleSliderUpdate}
                        />
                      </div>

                      <label className="form-label">
                        Home Insurance ($/year):
                      </label>
                      <input
                        type="text"
                        name="insAmt"
                        id="insAmt"
                        className="insAmt form-input"
                        value={data.insAmt || ""}
                        onChange={handleChange}
                      />
                      <div className="range-slider">
                        <Slider
                          min={0}
                          max={6000}
                          step={100}
                          summary={false}
                          minmax="none"
                          value={data.insAmt}
                          handleChange={handleChange}
                          handleSliderUpdate={handleSliderUpdate}
                        />
                      </div>

                      <label className="form-label">
                        Monthly HOA ($/month):
                      </label>
                      <input
                        type="text"
                        name="assocAmt"
                        id="assocAmt"
                        className="assocAmt form-input"
                        value={data.assocAmt || ""}
                        onChange={handleChange}
                      />
                      <div className="range-slider">
                        <Slider
                          min={0}
                          max={2000}
                          step={100}
                          summary={false}
                          minmax="none"
                          value={data.assocAmt}
                          handleChange={handleChange}
                          handleSliderUpdate={handleSliderUpdate}
                        />
                      </div>
                    </form>
                  </div>

                  <div className="input-block liabilities">
                    <form className="form">
                      <div className="form-subheading">
                        <h4 className="subheading">Liabilities</h4>
                      </div>

                      <label className="form-label">
                        Mortgage Payment ($/month):
                      </label>
                      <input
                        type="text"
                        title="Enter your monthly mortgage payment"
                        id="moMPay"
                        data-type="number"
                        className="moMPay liab-input form-input"
                        value={data.moMPay || ""}
                        onChange={handleChange}
                      />
                      <div className="range-slider">
                        <Slider
                          min={0}
                          max={10000}
                          step={100}
                          summary={false}
                          minmax="none"
                          value={data.moMPay}
                          handleChange={handleChange}
                          handleSliderUpdate={handleSliderUpdate}
                        />
                      </div>

                      <label className="form-label">Auto Loan ($/month):</label>
                      <input
                        type="text"
                        title="Enter your monthly car loan payments"
                        id="caMPay"
                        data-type="number"
                        className="caMPay liab-input form-input"
                        value={data.caMPay || ""}
                        onChange={handleChange}
                      />
                      <div className="range-slider">
                        <Slider
                          min={0}
                          max={3000}
                          step={50}
                          summary={false}
                          minmax="none"
                          value={data.caMPay}
                          handleChange={handleChange}
                          handleSliderUpdate={handleSliderUpdate}
                        />
                      </div>

                      <label className="form-label">
                        Other Installments ($/month):
                      </label>
                      <input
                        type="text"
                        title="Enter your monthly payments for other installment payment such as furniture"
                        id="otMPay"
                        data-type="number"
                        className="otMPay liab-input form-input"
                        value={data.otMPay || ""}
                        onChange={handleChange}
                      />
                      <div className="range-slider">
                        <Slider
                          min={0}
                          max={5000}
                          step={50}
                          summary={false}
                          minmax="none"
                          value={data.otMPay}
                          handleChange={handleChange}
                          handleSliderUpdate={handleSliderUpdate}
                        />
                      </div>

                      <label className="form-label">
                        Student Loan Balance ($):
                      </label>
                      <input
                        type="text"
                        title="Enter your current student loan balance, if any"
                        id="stLoanBal"
                        data-type="number"
                        className="stLoanBal liab-input form-input"
                        value={data.stLoanBal || ""}
                        onChange={handleChange}
                      />
                      <div className="range-slider">
                        <Slider
                          min={0}
                          max={500000}
                          step={"1000"}
                          summary={false}
                          minmax="none"
                          value={data.stLoanBal}
                          handleChange={handleChange}
                          handleSliderUpdate={handleSliderUpdate}
                        />
                      </div>

                      <label className="form-label">
                        Min. CC Payment ($/month):
                      </label>
                      <input
                        type="text"
                        title="Enter your minimum monthly payments for credit card debt"
                        id="ccMPay"
                        data-type="number"
                        className="ccMPay liab-input form-input"
                        value={data.ccMPay || ""}
                        onChange={handleChange}
                      />
                      <div className="range-slider">
                        <Slider
                          min={0}
                          max={5000}
                          step={100}
                          summary={false}
                          minmax="none"
                          value={data.ccMPay}
                          handleChange={handleChange}
                          handleSliderUpdate={handleSliderUpdate}
                        />
                      </div>

                      {/* <label className="form-label" title="Your liabilities include payments for mortgage, car loans, other loans, student loans, and credit card payments" >Total Monthly Liabilities:</label>
                                            <span type="text" title="Your liabilities include payments for mortgage, car loans, other loans, student loans, and credit card payments" name="moDebts" id="moDebts" className="form-out subheading">{out.moDebts.toFixed(0)}</span>
                                            <span className="form-suffix">$/month</span> */}
                    </form>
                  </div>
                  <div className="input-block DTI">
                    <form className="form">
                      <div className="form-subheading">
                        <h4 className="subheading">Debt to Income Ratio</h4>
                      </div>
                      <label className="form-label">
                        Debt to Income Ratio (DTI):
                      </label>
                      <input
                        type="number"
                        min={0.01}
                        max={0.45}
                        title="Enter a DTI Ratio"
                        id="DtiIRatio"
                        data-type="number"
                        className="DtiIRatio liab-input form-input"
                        value={data.DtiIRatio || ""}
                        onChange={handleChange}
                      />
                      <div className="range-slider">
                        <Slider
                          min={0.01}
                          max={0.45}
                          step={".01"}
                          summary={false}
                          minmax="none"
                          value={data.DtiIRatio}
                          handleChange={handleChange}
                          handleSliderUpdate={handleSliderUpdate}
                        />
                      </div>
                    </form>
                  </div>

                  <div className="input-block qualify">
                    <h1
                      className="tertiary-text centered-text mx-0 px-0"
                      style={{
                        marginTop: "2rem !important",
                        lineHeight: "2.5rem",
                        color: "var(--textColorPrimary)",
                        backgroundColor: "var(--plainWhiteColor)",
                      }}
                    >
                      Suggested Maximum Home Price:{" "}
                      <span
                        id="maxHomeAmt"
                        className="font-bold"
                        style={{ color: "var(--textColorAccent)" }}
                      >
                        {noDecimals.format(out.maxHomeAmt)}{" "}
                      </span>
                    </h1>
                    <form className="form">
                      <div
                        className="form-subheading mx-0 px-0"
                        style={{
                          paddingTop: "-1rem !important",
                          marginTop: "-1rem !important",
                        }}
                      >
                        <h1
                          className="tertiary-text centered-text mx-0 px-0"
                          style={{
                            paddingTop: "-1rem !important",
                            marginTop: "-1rem !important",
                            marginBottom: "0rem !important",
                            paddingBottom: "0rem !important",
                            lineHeight: "2.5rem",
                            color: out.qualifyColor,
                          }}
                        >
                          A{" "}
                          <span id="purchaseAmt" className="font-bold">
                            {noDecimals.format(
                              out.purchaseAmt > data.downPayAmt
                                ? out.purchaseAmt
                                : data.downPayAmt
                            )}{" "}
                            Home
                          </span>{" "}
                          {out.qualifyYN}
                        </h1>
                        <h3
                          className="small-text centered-text italic-text "
                          style={{
                            marginTop: "1rem",
                            paddingTop: "0rem",
                            color: "var(--textColorAccent",
                          }}
                        >
                          Your debt to income ratio for this amount is{" "}
                          <span
                            id="DtiIRatio"
                            className="font-bold text-2xl mt-0 underline underline-offset-4"
                          >
                            {data.DtiIRatio.toFixed(2)}{" "}
                          </span>
                        </h3>
                      </div>

                      <label className="form-label">Home Price:</label>
                      <span
                        type="text"
                        name="purchaseAmt"
                        id="purchaseAmt"
                        className="form-out"
                      >
                        {thouSep.format(
                          (out.purchaseAmt > data.downPayAmt
                            ? out.purchaseAmt
                            : data.downPayAmt
                          ).toFixed(0)
                        )}{" "}
                      </span>
                      <span className="form-suffix">$</span>
                      <label className="form-label">Loan Amount:</label>
                      <span
                        type="text"
                        name="loanAmt"
                        id="loanAmt"
                        size="15"
                        className="form-out"
                      >
                        {thouSep.format(
                          (out.loanAmt > 0 ? out.loanAmt : 0).toFixed(0)
                        )}
                      </span>
                      <span className="form-suffix">$</span>
                      <label className="form-label">
                        Mortgage Payment (P&I only):
                      </label>
                      <span
                        type="text"
                        name="pmtPI"
                        id="pmtPI"
                        className="form-out"
                      >
                        {thouSep.format(
                          (out.pmtPI > 0 ? out.pmtPI : 0).toFixed(2)
                        )}
                      </span>
                      <span className="form-suffix">$/month</span>
                      <label className="form-label">
                        Housing Pymt (incl. Tax, Ins, HOA):
                      </label>
                      <span
                        type="text"
                        name="pmtPITI"
                        id="pmtPITI"
                        className="form-out"
                      >
                        {thouSep.format(
                          (out.pmtPITI > 0 ? out.pmtPITI : 0).toFixed(2)
                        )}
                      </span>
                      <span className="form-suffix">$/month</span>
                      <label className="form-label">Other Debt Payments:</label>
                      <span
                        type="text"
                        name="moDebts"
                        id="moDebts"
                        className="form-out"
                      >
                        {thouSep.format(out.moDebts.toFixed(2))}
                      </span>
                      <span className="form-suffix">$/month</span>
                      <label className="form-label">Total Payments:</label>
                      <span
                        type="text"
                        name="totalPymt"
                        id="totalPymt"
                        className="form-out"
                      >
                        {thouSep.format(
                          (
                            (out.pmtPITI > 0 ? out.pmtPITI : 0) + out.moDebts
                          ).toFixed(2)
                        )}
                      </span>
                      <span className="form-suffix">$/month</span>
                      <br />
                      <div
                        className="form-subheading subheading"
                        style={{ color: "var(--textColorHighlight)" }}
                      >
                        Note: This estimate does not include PMI payment
                      </div>
                    </form>
                  </div>
                  <div className="backdrop-only"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PreQual;
