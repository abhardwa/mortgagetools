const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function BuydownYear({ out, year, last }) {
  return (
    <div className="pricing-column col-lg-4 col-md-6">
      <div className="card card-year">
        <div className="card-header centered-text">
          <h3 className="subheading">
            Year {last ? `${year + 1}-${30}` : year + 1}
          </h3>
          <p className="tiny-text bold-text italic-text">
            payments{" "}
            {last
              ? `${year * 12 + 1}-${360}`
              : `${year * 12 + 1}-${year * 12 + 12}`}
          </p>
        </div>
        <div className="card-body">
          <label className="card-body-label tiny-text left-text bold-text">
            Phase:
          </label>
          <p id="phase" className="card-data tiny-text right-text bold-text">
            {out.phase}
          </p>
          <label className="card-body-label tiny-text left-text bold-text">
            Rate:
          </label>
          <p id="rate" className="card-data tiny-text right-text bold-text">
            {out.rate}
          </p>
          <label className=" card-body-label tiny-text left-text bold-text">
            Pmt w/ Buydown:
          </label>
          <p
            id="payWBuydown"
            className="card-data tiny-text right-text bold-text"
          >
            {currency.format(out.payWBuydown)}
          </p>
          <label className="card-body-label tiny-text left-text bold-text">
            Pmt w/o Buydown:
          </label>
          <p
            id="payWoBuydown"
            className="card-data tiny-text right-text bold-text"
          >
            {currency.format(out.payWoBuydown)}
          </p>
          <label className=" card-body-label tiny-text left-text bold-text">
            Monthly Reduction:
          </label>
          <h3
            id="reductionM"
            className="card-data tiny-text right-text bold-text"
          >
            {currency.format(out.reductionM)}
          </h3>
          {last ? (
            <>
              <label className="price-text reductionA" id="year4-msg">
                No further reduction in payments after Year {year}
              </label>
            </>
          ) : (
            <>
              <label className=" card-body-label tiny-text left-text bold-text price-text-label">
                Your
                <strong> annual payments </strong>will be lower by{" "}
              </label>
              <h3
                id="reductionA"
                className="price-text card-data tiny-text right-text bold-text"
              >
                {currency.format(out.reductionA)}
              </h3>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default BuydownYear;
