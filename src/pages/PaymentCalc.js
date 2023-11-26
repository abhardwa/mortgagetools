import { useState } from "react";
import { amortization } from "../components/calcAmort.js";
import Slider from "../components/MySlider.js";
import PieChartComp from "../components/PieChart.js";

function PaymentCalc() {
  const [data, setData] = useState({
    purchaseAmt: 100000,
    downPayPct: 20,
    intRate: 6.25,
    term: 30,
    propTaxAmt: 0,
    insAmt: 0,
    assocAmt: 0,
  });
  const out = {
    loanAmt: 0,
    pmtPI: 0,
    pmtPITI: 0,
    pmtPITIA: 0,
  };
  // const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const noDecimals = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  const thouSep = new Intl.NumberFormat("en-US");
  const maxDTI = 0.45;
  const pieData = [
    { name: "P&I", value: 0 },
    { name: "Taxes & Insurance", value: 0 },
    { name: "HOA", value: 0 },
  ];

  const COLORS = ["#8884d8", "#82ca9d", "#ff8042", "#ffc658", "#888888"];

  function calcPayment() {
    // ///////////////////////////////////////////////
    // Now update the remaining output fields

    out.loanAmt = data.purchaseAmt - (data.downPayPct * data.purchaseAmt) / 100;

    const purchase = {
      intRate: data.intRate,
      term: data.term,
      loanAmt: out.loanAmt,
    };

    out.pmtPI = amortization(purchase, "");
    out.pmtPITI = out.pmtPI + Number(data.propTaxAmt / 12 + data.insAmt / 12);
    out.pmtPITIA = out.pmtPITI + data.assocAmt;
    pieData[0].value = Number((out.pmtPI / out.pmtPITIA).toFixed(2));
    pieData[1].value = Number(
      (Number(data.propTaxAmt / 12 + data.insAmt / 12) / out.pmtPITIA).toFixed(
        2
      )
    );
    pieData[2].value = Number((data.assocAmt / out.pmtPITIA).toFixed(2));
  }

  calcPayment();

  const handleChange = (e) => {
    let updatedValues = {};
    switch (e.target.id) {
      case "rs-range-line": {
        const target = e.target.parentElement.parentElement.previousSibling;
        console.log(e.target, target);
        if (
          target.matches(
            ".purchaseAmt, .downPayPct, .intRate, .term, .propTaxAmt, .insAmt, .assocAmt"
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
        ".purchaseAmt, .downPayPct, .intRate, .term, .propTaxAmt, .insAmt, .assocAmt"
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
    <div id="paymentCalc" className="tabcontent">
      <div className="container-fluid">
        <div className="container">
          <div className="row">
            <div className="site-container">
              <div id="">
                <div className="content-area">
                  <h3 className="heading-primary centered-text">
                    Monthly Payment Calculator
                  </h3>
                  <h4 className="heading-tertiary centered-text">
                    Understand your monthly payment
                  </h4>
                  <br></br>
                  <p className="main-text max-text-box">
                    Enter your home price, loan detail, property taxes, home
                    insurance, and HOA payments below to get a breakdown of your
                    estimated monthly payments for your new home.
                  </p>
                </div>
              </div>
              <div className="grid-container">
                <div className="main-grid">
                  <div className="input-block purchase">
                    <form className="form">
                      <div className="form-subheading">
                        <p
                          className="main-text "
                          style={{ color: "var(--textColorHighlight)" }}
                        >
                          All inputs can be entered directly or by using the
                          slider
                        </p>
                        <h4 className="subheading">
                          Purchase Price & Loan Terms
                        </h4>
                      </div>
                      <label className="form-label">Purchase Price ($):</label>
                      <input
                        type="text"
                        title="Enter your Home purchase price"
                        name="purchaseAmt"
                        id="purchaseAmt"
                        value={data.purchaseAmt || ""}
                        onChange={handleChange}
                        className="purchaseAmt form-input"
                        pattern="^\$\d{1,3}(,\d{3})*(\.\d+)?$"
                        data-type="currency"
                      />
                      <div className="range-slider">
                        <Slider
                          min={0}
                          max={2000000}
                          step={"5000"}
                          summary={false}
                          minmax="none"
                          value={data.purchaseAmt}
                          handleChange={handleChange}
                          handleSliderUpdate={handleSliderUpdate}
                        />
                      </div>

                      <label className="form-label">Down Payment PCT(%):</label>
                      <input
                        name="downPayPct"
                        id="downPayPct"
                        // step="1000"
                        value={data.downPayPct}
                        onChange={handleChange}
                        pattern="^\$\d{1,3}(,\d{3})*(\.\d+)?$"
                        data-type="currency"
                        type="text"
                        className="downPayPct form-input"
                      ></input>
                      <div className="range-slider">
                        <Slider
                          min={0}
                          max={90}
                          step={"1"}
                          summary={false}
                          minmax="none"
                          value={data.downPayPct}
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

                  <div className="input-block qualify">
                    <h1
                      className="tertiary-text centered-text mx-0 px-0"
                      style={{
                        lineHeight: "3rem",
                        color: "var(--bgColorBrand)",
                        backgroundColor: "var(--bgColorAccent)",
                        fontSize: "2.5rem",
                        marginBottom: "3rem",
                      }}
                    >
                      Your monthly payment excluding PMI will be{" "}
                      <span id="pmtPITIA">
                        {noDecimals.format(out.pmtPITIA)}
                      </span>
                    </h1>
                    <form className="form">
                      <label className="form-label">Home Price:</label>
                      <span
                        type="text"
                        name="purchaseAmt"
                        id="purchaseAmt"
                        className="form-out"
                      >
                        {thouSep.format(
                          (data.purchaseAmt >
                          (data.downPayPct * data.purchaseAmt) / 100
                            ? data.purchaseAmt
                            : (data.downPayPct * data.purchaseAmt) / 100
                          ).toFixed(0)
                        )}
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
                        Mortgage Payment incl. Taxes & Ins.:
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
                      <label className="form-label">
                        Mortgage Payment incl. Taxes, Ins. & HOA:
                      </label>
                      <span
                        type="text"
                        name="pmtPITIA"
                        id="pmtPITIA"
                        className="form-out"
                      >
                        {thouSep.format(out.pmtPITIA.toFixed(2))}
                      </span>
                      <span className="form-suffix">$/month</span>
                      <br />
                      <div
                        className="form-subheading subheading"
                        style={{
                          color: "var(--textColorHighlight)",
                          fontSize: "2rem",
                          textTransform: "initial",
                        }}
                      >
                        Note: This estimate does not include PMI (mortgage
                        insurance) payment, as that is dependent on other
                        factors including, your credit rating, DTI ratio, and
                        down payment percentage.
                      </div>
                      <span>
                        <PieChartComp
                          data={pieData}
                          width={"170%"}
                          height={250}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          colors={COLORS}
                        />
                      </span>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentCalc;
